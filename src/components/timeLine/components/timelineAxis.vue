<template>
  <div class="content">
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
  </div>
</template>
<script>
import { computationalDateArray, timeInterval, timeAxisTicksNumber, playSpeed } from '../../../common/js/timeLine'
export default {
  data () {
    return {
      // 定时器
      intervalTimer: null, // 定时器
      // 计算日期数组
      computationalDateArray: computationalDateArray,
      // 时间轴当前刻度
      currentTimeAxisScale: [],
      // 鼠标移入的时间位置
      hoverIndex: 0,
      // 日期列表
      dateTimeIndexes: [],
      // 当前正在显示的日期列表
      dateTimeIndexes: [],
      // 当前显示的刻度
      currentTimelineScale: [],
      // 时间轴第一个刻度
      firstScale: '',
      // 时间间隔
      timeInterval: timeInterval,
      // 时间轴刻度数量
      timeAxisTicksNumber: timeAxisTicksNumber,
      // 当前的时间位置
      activeIndex: 0,
      // 播放
      playing: false,
      // 播放速度
      playSpeed: playSpeed
    }
  },
  computed: {
    // 高亮的刻度
    highlightIndex () {
      return (
        this.activeIndex
      )
    }
  },
  mounted () {
    // 初始化刻度
    this.currentTimeAxisScale = this.$moment().add(0, 'minutes').format('MM-DD HH:mm')
    // 初始化时间轴
    this.renderTimeline()
    // 浏览器窗口改变 重新初始化时间轴
    let that = this
    window.onresize = function () {
      that.renderTimeline()
    }
  },
  watch: {
    // 当playing改变触发
    playing () {
      if (this.playing) {
        this.intervalTimer = setInterval(() => {
          if (this.activeIndex < 10) {
            this.activeIndex = this.activeIndex + 1
          } else {
            this.nextDateScale()
            this.activeIndex = 0
          }
        }, this.playSpeed * 1000)
      } else {
        if (this.intervalTimer) {
          clearInterval(this.intervalTimer)
          this.intervalTimer = null
        }
      }
    },
  },
  methods: {
    // 渲染时间轴
    renderTimeline (firstScale) {
      // 当前时间轴刻度
      const currentArray = (this.computationalDateArray).map(sweetItem => {
        return this.$moment(firstScale).add(this.timeInterval * sweetItem, 'minutes').format('MM-DD HH:mm')
      })
      this.currentTimeAxisScale = currentArray
    },
    // 点击刻度
    tickClick (time, index) {
      // 点击的是正在播放的日期 则直接返回
      if (this.playing) {
        return
      }
      // 激活的index变为点击的index
      this.activeIndex = index
    },
    // next
    nextDateScale () {
      this.firstScale = this.$moment(this.currentTimeAxisScale[this.currentTimeAxisScale.length - 1]).add(this.timeInterval * 1, 'minutes').format('MM-DD HH:mm')
      this.renderTimeline(this.firstScale)
    },
    // last
    lastDateScale () {
      this.firstScale = this.$moment(this.currentTimeAxisScale[this.currentTimeAxisScale.length - 1]).subtract(this.timeInterval * (2 * this.timeAxisTicksNumber - 1), 'minutes').format('MM-DD HH:mm')
      this.renderTimeline(this.firstScale)
    },
    // 切换时间间隔
    changTimeInterval (number) {
      this.timeInterval = number
      this.firstScale = this.$moment(this.currentTimeAxisScale[0]).format('MM-DD HH:mm')
      this.renderTimeline(this.firstScale)
    },
    // 播放时间轴
    playTimeAxis () {
      this.playing = !this.playing
    },
    // 左两个
    backWarder () {
      let currentActiveIndex = this.activeIndex - 2
      if (currentActiveIndex < 0) {
        this.lastDateScale()
        currentActiveIndex = this.timeAxisTicksNumber + currentActiveIndex
      }
      this.activeIndex = currentActiveIndex
    },
    // 左一个
    backWard () {
      let currentActiveIndex = this.activeIndex - 1
      if (currentActiveIndex < 0) {
        this.lastDateScale()
        currentActiveIndex = this.timeAxisTicksNumber + currentActiveIndex
      }
      this.activeIndex = currentActiveIndex
    },
    // 右一个
    forward () {
      let currentActiveIndex = this.activeIndex + 1
      if (currentActiveIndex > 9) {
        this.nextDateScale()
        currentActiveIndex = currentActiveIndex - this.timeAxisTicksNumber
      }
      this.activeIndex = currentActiveIndex
    },
    // 右两个
    forwarder () {
      let currentActiveIndex = this.activeIndex + 2
      if (currentActiveIndex > 9) {
        this.nextDateScale()
        currentActiveIndex = currentActiveIndex - this.timeAxisTicksNumber
      }
      this.activeIndex = currentActiveIndex
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0;
  margin: 0;
  width: 100%;
  background: #2299cf;
  height: 120px;
  .timeline_main {
    padding: 30px;
    box-sizing: border-box;
    width: 1200px;
    height: 60px;
    float: right;

    .timeline_axis {
      position: relative;
      display: flex;
      justify-content: space-around;
      padding: 8px 0;

      &::before {
        content: '';
        width: 100%;
        height: 10px;
        position: absolute;
        left: 0;
        bottom: 8px;
        display: inline-block;
        background: rgba(0, 0, 0, 0.5);
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
        background: rgba(0, 0, 0, 0.5);
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
}
</style>