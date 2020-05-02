<template>
  <div class="content">
    <el-slider
      v-model="sliderValue"
      :step="sliderStep"
      :show-tooltip="false"
      :disabled="disabled"
      vertical
      show-stops
      height="200px"
      :marks="sliderMarks"
      ref="sliderRef"
      @change="changeSliderValue(sliderValue)"
    ></el-slider>
    <button @click="addSliderMarks">添加</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 滑块可选离散数 数值为多少百分比一个
      sliderStep: 33,
      // 滑块默认值
      sliderValue: 30,
      // 滑块是否禁用
      disabled: false,
      // 滑块标记
      sliderMarks : {

      }
      // sliderMarks: {
      //   0: '3h',
      //   33: '1h',
      //   66: '0.5h',
      //   99: '5min'
      // }
    }
  },
  methods: {
    // 改变slider的值
    changeSliderValue (sliderValue) {
      // 滑动块的值
      console.log(sliderValue)
      console.log(this.$refs.sliderRef.value)
    },
    addSliderMarks () {
      const Marks = {
        0: '3h',
        33: '1h',
        66: '0.5h',
        99: '5min'
      }
      if(!this.sliderMarks) {
        this.sliderMarks = Marks
      } else {
        this.sliderMarks = []
      }
    }
  }
}
</script>
<style scoped>
.content {
  /* background: chartreuse; */
  width: 80px;
  height: 240px;
  margin-top: 10px;
}
.el-slider {
  padding: 10px;
}
</style>