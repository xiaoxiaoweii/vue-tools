<template>
  <div class="content">
    <div class="play_control_main">
      <!-- 日期 -->
      <div class="control_date">
        <el-date-picker
          v-model="timeRangeValue"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 230px; height: 30px; background: #7A888B; opacity:0.6;"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changDateInterval"
        />
        <!-- 间隔 -->
      </div>
      <div class="interval_main">
        <el-tag
          v-for="(item, index) in itemTags"
          :key="item.name"
          type="success"
          :class="{ 'active_tags': index === activeTags }"
          @click="changTimeInterval(item.value, index)"
        >{{item.name}}</el-tag>
      </div>
    </div>

    <div class="play_left_main" @click="lastDateScale">
      <!-- <img src="../../assets/images/timeline/backward.png" /> -->
    </div>
    <div class="timeline_main">
      <div class="timeline_axis">
        <!-- 进度条 -->
        <div v-for="(time, index) in currentTimeAxisScale" :key="index" class="axis_item">
          <!-- 进度条刻度 -->
          <div
            class="axis_item_tick"
            :class="{ 'axis_item_tick_active':index === highlightIndex }"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
            @click="tickClick(time, index)"
          />
          <!-- 刻度值 -->
          <div class="axis_item_label">{{ time }}</div>
          <!-- 当前播放的日期值 -->
          <div
            v-if="index === highlightIndex || index === hoverIndex"
            class="axis_item_tip"
          >{{ time_tip }}</div>
        </div>
      </div>
      <div class="control_button">
        <span @click="backWarder">-{{ (2* this.currentItemTags + 'min') }}</span>
        <span @click="backWard">-{{ ( this.currentItemTags + 'min' ) }}</span>
        <span
          @click="playTimeAxis"
          :class="{'el-icon-video-play':!playing, 'el-icon-video-pause':playing}"
          class="el-icon-video"
        ></span>
        <!-- <el-button
          size="small"
          :class="{'el-icon-video-play':!playing, 'el-icon-video-pause':playing}"
          type="text"
          @click="playTimeAxis"
        />-->
        <span @click="forward">+{{ this.currentItemTags + 'min' }}</span>
        <span @click="forward">+{{ (2* this.currentItemTags + 'min') }}</span>
      </div>
    </div>
    <!-- 下一时间段 -->
    <div class="play_right_main" @click="nextDateScale">
      <!-- <img src="../../assets/images/timeline/forward.png" /> -->
    </div>
    <!-- 播放速度 -->
    <div class="play_speed_main">
      <!-- <select v-model="playSpeedValue" >
        <option v-for="item in speedOptions" :key="item.name" :value="item.value">{{ item.name }}</option>
      </select> -->
      <!-- <select @change="changeSpeedSliderValue(value)">
        <option value="200" selected style="background-color:rgba(255,255,255,0.5);">200ms</option>
        <option value="500" style="background-color:rgba(255,255,255,0.5);">500ms</option>
        <option value="1000" style="background-color:rgba(255,255,255,0.5);">1s</option>
        <option value="4000" style="background-color:rgba(255,255,255,0.5);">4s</option>
      </select>-->
    </div>
  </div>
</template>
<script>
// import {
//   computationalDateArray,
//   timeInterval,
//   timeAxisTicksNumber,
//   playSpeed
// } from "../../utils/timeLine.js";
import {
  computationalDateArray,
  timeInterval,
  timeAxisTicksNumber,
  playSpeed
} from "../../../common/js/timeLine.js";
export default {
  data() {
    return {
      // 当前时间间隔
      currentItemTags: "5",
      // 播放速度
      speedOptions: [
        { name: "200ms", value: "200" },
        { name: "500ms", value: "500" },
        { name: "1s", value: "1000" },
        { name: "4s", value: "4000" }
      ],
      // 激活的时间间隔
      activeTags: 0,
      // 时间间隔列表
      itemTags: [
        { name: "5min", value: "5" },
        { name: "30min", value: "30" },
        { name: "60min", value: "60" },
        { name: "180min", value: "180" }
      ],
      // 带年份播放刻度
      currentTimeAxisScaleY: [],
      // 选取日期间隔绑定值
      timeRangeValue: "",
      // 定时器
      intervalTimer: null, // 定时器
      // 计算日期数组
      computationalDateArray: computationalDateArray,
      // 时间轴当前刻度
      currentTimeAxisScale: [],
      // 鼠标移入的时间位置
      hoverIndex: -1,
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
    },
    time_tip() {
      return this.$moment(this.currentTimeAxisScaleY[this.activeIndex]).format(
        "YYYY-MM-DD HH:mm"
      )
    }
  },
  watch: {
    // 当playing改变触发
    playing() {
      if (this.playing) {
        this.intervalTimer = setInterval(() => {
          // console.log(this.currentDateTime)
          // this.timeAxisDate(this.currentDateTime)
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
      console.log(this.currentDateTime);
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
    const that = this;
    window.onresize = function() {
      that.renderTimeline();
    };
  },
  methods: {
    //  播放进度条执行函数
    timeAxisDate() {
      this.$emit('changTimeAxis',this.currentDateTime);
      // @changTimeAxis="changTimeAxis"
    },
    // 渲染时间轴
    renderTimeline(firstScale) {
      // 当前时间轴刻度
      // console.log(firstScale)
      const currentArray = this.computationalDateArray.map(sweetItem => {
        return this.$moment(firstScale)
          .add(this.timeInterval * sweetItem, "minutes")
          .format("HH:mm");
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
    changTimeInterval(number, index) {
      // // 正在播放时间轴 则切换刻度无效
      // if (this.playing) {
      //   return;
      // }
      console.log(number, index);
      this.currentItemTags = number
      this.activeTags = index;
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
      console.log(value);
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
<style lang="scss">
.content {
  padding: 0;
  margin: 0;
  width: 100%;
  background: #365abb;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 120px;

  .play_control_main {
    width: 280px;
    float: left;
    // background: #00fffa;
    height: 120px;
    // border: 1px solid #fff;
    .control_date {
      // background: #2299cf;
      width: 100%;
      height: 40%;
      // padding-top: 19px;
      .el-range-input {
        background: #7a888b;
        color: #999b9c;
        opacity: 0.6;
      }
    }
    .interval_main {
      margin-left: 24px;
      // background: #fff;
      width: 230px;
      height: 30px;
      border-radius: 5px;
      .el-tag {
        height: 100%;
        width: 25%;
        margin: 0;
        padding: 0;
        float: left;
        cursor: pointer;
        background: #7a888b;
        color: rgba(255, 255, 255, 1);
        opacity: 0.6;
      }
      .active_tags {
        background: #0c9cca;
      }
      // .el-tag_end {
      //   border-radius: 100%;
      // }
    }
  }
  // 上一时间段
  .play_left_main {
    width: 40px;
    float: left;
    // background: #00fffa;
    height: 120px;
    // border: 1px solid #fff;
    img {
      cursor: pointer;
    }
  }
  // 时间轴
  .timeline_main {
    // padding: 30px;
    padding-top: 10px;
    margin-left: 15px;
    margin-right: 15px;
    box-sizing: border-box;
    width: 1450px;
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
        height: 4px;
        position: absolute;
        left: 0;
        bottom: 25px;
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
        height: 15px;
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
        color: #fff;
      }

      .axis_item_tip {
        position: absolute;
        top: -25px;
        // padding: 2px 6px;
        // margin-bottom: 15px;
        bottom: 25px;
        border-radius: 2px;
        background: #05b0e7;
        white-space: nowrap;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
      }
    }
    .control_button {
      // margin-top: 25px;
      margin: 25px auto 0;
      height: auto;
      span {
        color: #fff;
        padding: 5px;
        width: 45px;
        height: 26px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 1);
        cursor: pointer;
      }
      .el-icon-video {
        display: inline-block;
        // font-size: 26px;
        border: none;
        // width: 20px;
        height: 26px;
        line-height: 26px;
      }
      i {
        // display: inline-block;
        font-size: 30px;
        color: #fff;
        text-align: center;
        // width: 20px;
        // height: 26px;
      }
    }
  }
  // 下一时间段
  .play_right_main {
    width: 50px;
    float: left;
    // background: #00fffa;
    height: 120px;
    img {
      cursor: pointer;
    }
  }
  // 播放速度
  .play_speed_main {
    width: 50px;
    float: left;
    height: 120px;
    // border: 1px solid #fff;
    // background: #00fffa;

    select {
      margin-top: 5px;
      line-height: 21px;
      font-size: 12px;
      opacity: 0.5;
      cursor: pointer;
    }
  }
}
</style>
