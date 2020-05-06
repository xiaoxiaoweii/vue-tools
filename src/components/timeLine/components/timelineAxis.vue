<template>
  <div class="content">
    <!-- 播放速度 -->
    <div class="play_speed_main">
      <el-slider
        v-model="speedSliderValue"
        :step="speedSliderStep"
        :show-tooltip="false"
        vertical
        show-stops
        height="80px"
        :marks="speedSliderMarks"
        ref="sliderRef"
        @change="changeSpeedSliderValue(speedSliderValue)"
      ></el-slider>
    </div>
    <!-- 时间轴间隔 -->
    <div class="play_interval_main">
      <el-slider
        v-model="intervalSliderValue"
        :step="intervalSliderStep"
        :show-tooltip="false"
        vertical
        show-stops
        height="80px"
        :marks="intervalSliderMarks"
        ref="sliderRef"
        @change="changeIntervalSliderValue(intervalSliderValue)"
      ></el-slider>
    </div>
    <div class="play_control_main">
      <div class="control_date">
        <el-date-picker
          v-model="timeRangeValue"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 350px;"
          @change="changDateInterval"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </div>
      <div class="control_button">
        <el-button size="small" class="el-icon-d-arrow-left" @click="backWarder" round></el-button>
        <el-button size="small" class="el-icon-arrow-left" round></el-button>
        <el-button
          size="small"
          :class="{'el-icon-video-play':!playing, 'el-icon-video-pause':playing}"
          @click="playTimeAxis"
          round
        ></el-button>
        <el-button size="small" class="el-icon-arrow-right" @click="forward" round></el-button>
        <el-button size="small" class="el-icon-d-arrow-right" @click="forwarder" round></el-button>
      </div>
    </div>
    <div class="play_left_main" @click="lastDateScale">
      <div class="el-icon-arrow-left"></div>
    </div>
    <div class="timeline_main">
      <div class="timeline_axis">
        <!-- 进度条 -->
        <div class="axis_item" v-for="(time, index) in currentTimeAxisScale" :key="index">
          <!-- 进度条刻度 -->
          <div
            class="axis_item_tick"
            :class="{ 'axis_item_tick_active':index === highlightIndex }"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
            @click="tickClick(time, index)"
          ></div>
          <!-- 刻度值 -->
          <div class="axis_item_label">{{ time }}</div>
          <!-- 当前播放的日期值 -->
          <div
            class="axis_item_tip"
            v-if="index === highlightIndex || index === hoverIndex"
          >{{ time }}</div>
        </div>
      </div>
    </div>
    <div class="play_right_main" @click="nextDateScale">
      <div class="el-icon-arrow-right"></div>
    </div>
  </div>
</template>
<script>
import {
  computationalDateArray,
  timeInterval,
  timeAxisTicksNumber,
  playSpeed,
  speedSliderStep,
  speedSliderMarks,
  speedSliderValue,
  intervalSliderValue,
  intervalSliderStep,
  intervalSliderMarks
} from "../../../common/js/timeLine";
export default {
  data() {
    return {
      // 带年份播放刻度
      currentTimeAxisScaleY: [],
      // 选取日期间隔绑定值
      timeRangeValue: "",
      // 速度滑块可选位置数值 即离散相距间隔
      speedSliderStep: speedSliderStep,
      // 速度滑块标记
      speedSliderMarks: speedSliderMarks,
      // 速度滑块
      speedSliderValue: speedSliderValue,
      // 时间轴间隔默认值
      intervalSliderValue: intervalSliderValue,
      // 间隔滑块可选位置数值
      intervalSliderStep: intervalSliderStep,
      // 间隔滑块可选位置标记
      intervalSliderMarks: intervalSliderMarks,
      // 定时器
      intervalTimer: null, // 定时器
      // 计算日期数组
      computationalDateArray: computationalDateArray,
      // 时间轴当前刻度
      currentTimeAxisScale: [],
      // 鼠标移入的时间位置
      hoverIndex: -1,
      // 日期列表
      dateTimeIndexes: [],
      // 当前正在显示的日期列表
      dateTimeIndexes: [],
      // 当前显示的刻度
      currentTimelineScale: [],
      // 时间轴第一个刻度
      firstScale: "",
      // 时间间隔
      timeInterval: timeInterval,
      // 时间轴刻度数量
      timeAxisTicksNumber: timeAxisTicksNumber,
      // 当前的时间位置
      activeIndex: 0,
      // 播放
      playing: false,
      // 播放速度
      playSpeed: playSpeed,
      // 选取的时间范围
      dataPickerRange: {},
      // 当前时刻
      currentDateTime: ""
    };
  },
  computed: {
    // 高亮的刻度
    highlightIndex() {
      return this.activeIndex;
    }
  },
  mounted() {
    // 初始化刻度
    this.currentTimeAxisScaleY = this.$moment()
      .add(0, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");
    this.currentDateTime = this.$moment().format("YYYY-MM-DD HH:mm:ss");
    // 初始化时间轴
    this.renderTimeline();
    // 浏览器窗口改变 重新初始化时间轴
    let that = this;
    window.onresize = function() {
      that.renderTimeline();
    };
  },
  watch: {
    // 当playing改变触发
    playing() {
      if (this.playing) {
        this.intervalTimer = setInterval(() => {
          this.activeIndex = this.activeIndex + 1;
          if (this.activeIndex > 9) {
            this.nextDateScale();
            this.activeIndex = 0;
          }
        }, this.playSpeed);
      } else {
        if (this.intervalTimer) {
          clearInterval(this.intervalTimer);
          this.intervalTimer = null;
        }
      }
    },
    activeIndex() {
      this.currentDateTime = this.currentTimeAxisScaleY[this.activeIndex];
      console.log(this.currentDateTime)
    }
  },
  methods: {
    // 渲染时间轴
    renderTimeline(firstScale) {
      // 当前时间轴刻度
      // console.log(firstScale)
      const currentArray = this.computationalDateArray.map(sweetItem => {
        return this.$moment(firstScale)
          .add(this.timeInterval * sweetItem, "minutes")
          .format("MM-DD HH:mm");
      });
      const currentArrayY = this.computationalDateArray.map(sweetItem => {
        return this.$moment(firstScale)
          .add(this.timeInterval * sweetItem, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      });
      // console.table(currentArray)
      // console.table(currentArrayY)
      this.currentTimeAxisScale = currentArray;
      this.currentTimeAxisScaleY = currentArrayY;
    },
    // 点击刻度
    tickClick(time, index) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      // 激活的index变为点击的index
      this.activeIndex = index;
    },
    // next
    nextDateScale() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      this.firstScale = this.$moment(
        this.currentTimeAxisScaleY[this.currentTimeAxisScaleY.length - 1]
      )
        .add(this.timeInterval * 1, "minutes")
        .format("YYYY-MM-DD HH:mm");
      // console.log(this.firstScale)
      this.renderTimeline(this.firstScale);
    },
    // last
    lastDateScale() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      this.firstScale = this.$moment(
        this.currentTimeAxisScaleY[this.currentTimeAxisScaleY.length - 1]
      )
        .subtract(
          this.timeInterval * (2 * this.timeAxisTicksNumber - 1),
          "minutes"
        )
        .format("YYYY-MM-DD HH:mm");
      this.renderTimeline(this.firstScale);
    },
    // 切换时间间隔
    changTimeInterval(number) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      this.timeInterval = number;
      this.firstScale = this.$moment(this.currentTimeAxisScaleY[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.renderTimeline(this.firstScale);
    },
    // 播放时间轴
    playTimeAxis() {
      this.playing = !this.playing;
    },
    // 左两个
    backWarder() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      let currentActiveIndex = this.activeIndex - 2;
      if (currentActiveIndex < 0) {
        this.lastDateScale();
        currentActiveIndex = this.timeAxisTicksNumber + currentActiveIndex;
      }
      this.activeIndex = currentActiveIndex;
    },
    // 左一个
    backWard() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      let currentActiveIndex = this.activeIndex - 1;
      if (currentActiveIndex < 0) {
        this.lastDateScale();
        currentActiveIndex = this.timeAxisTicksNumber + currentActiveIndex;
      }
      this.activeIndex = currentActiveIndex;
    },
    // 右一个
    forward() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      let currentActiveIndex = this.activeIndex + 1;
      if (currentActiveIndex > 9) {
        this.nextDateScale();
        currentActiveIndex = currentActiveIndex - this.timeAxisTicksNumber;
      }
      this.activeIndex = currentActiveIndex;
    },
    // 右两个
    forwarder() {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      let currentActiveIndex = this.activeIndex + 2;
      if (currentActiveIndex > 9) {
        this.nextDateScale();
        currentActiveIndex = currentActiveIndex - this.timeAxisTicksNumber;
      }
      this.activeIndex = currentActiveIndex;
    },
    // 改变播放速度
    changeSpeedSliderValue(value) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      // console.log(value);
      if (value === 0) {
        this.playSpeed = 4000;
        // console.log(this.playSpeed)
        return;
      }
      if (value === 33) {
        this.playSpeed = 2000;
        // console.log(this.playSpeed)
        return;
      }
      if (value === 66) {
        this.playSpeed = 1000;
        // console.log(this.playSpeed)
        return;
      }
      if (value === 99) {
        this.playSpeed = 200;
        // console.log(this.playSpeed)
        return;
      }
    },
    // 改变播放间隔
    changeIntervalSliderValue(value) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      // console.log(value);
      if (value === 0) {
        this.timeInterval = 5;
        console.log(this.timeInterval);
      }
      if (value === 33) {
        this.timeInterval = 30;
        // console.log(this.timeInterval);
      }
      if (value === 66) {
        this.timeInterval = 60;
        // console.log(this.timeInterval);
      }
      if (value === 99) {
        this.timeInterval = 180;
        // console.log(this.timeInterval);
      }
      this.renderTimeline();
    },
    // 改变日期间隔
    changDateInterval(date) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      // console.log(date);
      if (date) {
        this.dataPickerRange.startTime = date[0];
        this.dataPickerRange.endTime = date[1];
      } else {
        this.dataPickerRange.startTime = null;
        this.dataPickerRange.endTime = null;
      }
      // console.log(this.dataPickerRange);
      this.firstScale = this.$moment(this.dataPickerRange.startTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.renderTimeline(this.firstScale);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding: 0;
  margin: 0;
  width: 100%;
  background: #365abb;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 120px;

  .play_speed_main {
    width: 100px;
    float: left;
    height: 120px;
    // border: 1px solid #fff;

    .el-slider {
      padding: 20px;
    }
  }
  .play_interval_main {
    width: 100px;
    float: left;
    height: 120px;
    // border: 1px solid #fff;
    .el-slider {
      padding: 20px;
    }
  }
  .play_control_main {
    width: 350px;
    float: left;
    // background: #00fffa;
    height: 120px;
    // border: 1px solid #fff;
    .control_date {
      // background: #2299cf;
      width: 100%;
      height: 40%;
      padding-top: 19px;
    }
    .control_button {
      // background: #262727;
      width: 100%;
      height: 50%;
      // padding-top: 0px;
      padding-left: 40px;
      .el-icon-error {
        cursor: no-drop;
        opacity: 0.5;
      }
    }
  }
  .play_left_main {
    width: 50px;
    float: left;
    // background: #00fffa;
    height: 120px;
    // border: 1px solid #fff;
    .el-icon-arrow-left {
      font-size: 30px;
      margin-top: 24px;
      margin-left: 12px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 6px;
      padding-right: 6px;
      border: 1.5px solid #fff;
      border-radius: 12px;
      cursor: pointer;
    }
  }
  .timeline_main {
    padding: 30px;
    box-sizing: border-box;
    width: 1200px;
    height: 60px;
    float: left;

    .timeline_axis {
      position: relative;
      display: flex;
      justify-content: space-around;
      padding: 8px 0;

      &::before {
        content: "";
        width: 100%;
        height: 10px;
        position: absolute;
        left: 0;
        bottom: 8px;
        display: inline-block;
        background: #fff;
      }
    }

    .axis_item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      .axis_item_tick {
        display: inline-block;
        width: 4px;
        height: 30px;
        background: #fff;
        transition: background 0.3s;
        cursor: pointer;

        &:hover {
          background: #00fffa;
        }
      }

      .axis_item_tick_active {
        background: #00fffa;
      }

      .axis_item_label {
        position: absolute;
        bottom: -30px;
        white-space: nowrap;
      }

      .axis_item_tip {
        position: absolute;
        top: -25px;
        padding: 2px 6px;
        border-radius: 2px;
        background: rgba(0, 0, 0, 0.5);
        white-space: nowrap;
        color: #fff;
      }
    }
  }

  .play_right_main {
    width: 50px;
    float: left;
    // background: #00fffa;
    height: 120px;
    // border: 1px solid #fff;
    .el-icon-arrow-right {
      font-size: 30px;
      margin-top: 24px;
      margin-left: 2px;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 6px;
      padding-right: 6px;
      border: 1.5px solid #fff;
      border-radius: 12px;
      cursor: pointer;
    }
  }
}
</style>