<template>
  <div class="content">
    <el-slider
      v-model="sliderValue"
      :step="sliderStep"
      :show-tooltip="false"
      :disabled="disabled"
      vertical
      show-stops
      height="150px"
      :marks="sliderMarks"
      ref="sliderRef"
      @change="changeSliderValue(sliderValue)"
    ></el-slider>
  </div>
</template>
<script>
import { sliderMarks, sliderStep, sliderValue } from '../../../common/js/timeLine'
export default {
  data () {
    return {
      // 滑块可选位置数值 即离散相距间隔
      sliderStep: sliderStep,
      // 滑块默认值
      sliderValue: sliderValue,
      // 滑块是否禁用
      disabled: false,
      // 滑块标记
      sliderMarks : sliderMarks
    }
  },
  methods: {
    // 改变slider的值
    changeSliderValue (sliderValue) {
      // 滑动块的值
      // console.log(sliderValue)
      // console.log(this.$refs.sliderRef.value)
      console.log(this.sliderMarks)
    },
    addSliderMarks () {
      console.log("添加")
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