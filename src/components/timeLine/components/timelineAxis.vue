<template>
  <div class="timeline_main">
    <div class="timeline_axis">
      <!-- 进度条 -->
      <div class="axis_item" v-for="(time, index) in dateTimes" :key="index">
        <!-- 进度条刻度 -->
        <div
          class="axis_item_tick"
          :class="{ 'axis_item_tick_active':index === highlightIndex }"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="tickClick(time, index)"
        ></div>
        <!-- 刻度值 -->
        <div class="axis_item_label" v-if="dateTimeIndexes.indexOf(index) >=0 ">{{ time }}</div>
        <!-- 当前播放的日期值 -->
        <div
          class="axis_item_tip"
          v-if="index === highlightIndex || index === hoverIndex"
        >{{ time }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 时间轴刻度
      dateTimes: [
        '03-04',
        '03-05',
        '03-06',
        '03-07',
        '03-08',
        '03-09',
        '03-10',
        '03-11',
        '03-12',
        '03-13',
        '03-14',
        '03-15',
        '03-16',
        '03-17',
        '03-18',
        '03-19',
        '03-20',
        '03-21'
      ],
      // 鼠标移入的时间位置
      hoverIndex: 0,
      // 日期列表
      dateTimeIndexes: [],
      // 日期间的间隔
      interval: 200,
      // 当前正在显示的日期列表
      dateTimeIndexes: [],
    }
  },
  computed: {
    // 高亮的刻度
    highlightIndex () {
      return (
        (this.activeIndex === -1 && this.dateTimes.length - 1) ||
        this.activeIndex
      )
    }
  },
  mounted () {
    // 初始化时间轴
    this.renderTimeline()
    // 浏览器窗口改变 重新初始化时间轴
    let that = this
    window.onresize = function () {
      that.renderTimeline()
    }
  },
  methods: {
    // 初始化时间轴
    renderTimeline () {
      // 时间轴宽度
      const timelineWidth = this.$el.offsetWidth
      console.log("时间轴宽度:" + timelineWidth)
      // 需要展示的日期个数
      const dateTimesSize = this.dateTimes.length
      console.log("需要显示的日期数量:" + dateTimesSize)
      // 如果时间全部显示，时间轴的理想宽度
      const dateTimesWidth = dateTimesSize * this.interval
      console.log( "时间全部显示需要的理想长度" + dateTimesWidth )
      // 如果时间轴的宽度大于理想宽度
      if (timelineWidth >= dateTimesWidth) {
        // 当前显示的日期index与需要显示的日期index相同
        console.log("时间轴的实际宽度大于日期所需的理想宽度")
        this.dateTimeIndexes = this.dateTimes.map((dateTime, index) => {
          return index
        })
        // 返回
        return
      }
      // 当前时间轴的宽度最大能容纳多少日期刻度
      const maxTicks = Math.floor(timelineWidth / this.interval)
      console.log("当前时间轴宽度能容纳的日期刻度数量:" + maxTicks)
      // 间隔刻度数 日期个数需要时间轴宽度个数
      const gapTicks = Math.ceil(dateTimesSize / maxTicks)
      console.log("完全展示完毕需要的当前时间轴个数:" + gapTicks)
      // 记录需要显示的日期索引
      this.dateTimeIndexes = []

      for (let t = 0; t <= maxTicks; t++) {
        this.dateTimeIndexes.push(t * gapTicks)
      }
      const len = this.dateTimeIndexes.length
      // 最后一项需要特殊处理
      if (len > 0) {
        // 当前播放的日期最后一项
        const lastIndex = this.dateTimeIndexes[len - 1]
        // 判断
        if (lastIndex + gapTicks > dateTimesSize - 1) {
          this.dateTimeIndexes[len - 1] = dateTimesSize - 1
        } else {
          this.dateTimeIndexes.push(dateTimesSize - 1)
        }
      }
    },
    // 点击刻度
    tickClick (time, index) {
      // console.log(time, index)
      // 点击的是正在播放的日期 则直接返回
      if (this.playing) {
        return
      }
      // console.log(time, index)
      // 激活的index变为点击的index
      this.activeIndex = index
      // console.log(this.activeIndex)
    },
  }
}
</script>
<style lang="scss" scoped>
.timeline_main {
  padding: 30px;
  box-sizing: border-box;
  width: 1080px;
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
</style>