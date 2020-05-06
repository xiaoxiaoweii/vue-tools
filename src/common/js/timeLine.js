// 时间轴
// 计算数组
const computationalDateArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// 时间轴时间间隔
const timeInterval = 5
// 时间轴刻度数量
const timeAxisTicksNumber = 10
// 播放速度
const playSpeed = 4000
// 速度滑块可选位置数值 即离散相距间隔
const speedSliderStep = 33
// 速度滑块标记
const speedSliderMarks = {
  0: {
    style: {
      color: '#000'
    },
    label: '4s'
  },
  33: {
    style: {
      color: '#000'
    },
    label: '1s'
  },
  66: {
    style: {
      color: '#000'
    },
    label: '500ms'
  },
  99: {
    style: {
      color: '#000'
    },
    label: '200ms'
  }
}
// 速度滑块默认值
const speedSliderValue = 0
// 时间轴间隔默认值
const intervalSliderValue = 0
// 间隔滑块可选位置数值
const intervalSliderStep = 33
// 间隔滑块可选位置标记
const intervalSliderMarks = {
  0: {
    style: {
      color: '#000'
    },
    label: '5min'
  },
  33: {
    style: {
      color: '#000'
    },
    label: '0.5h'
  },
  66: {
    style: {
      color: '#000'
    },
    label: '1h'
  },
  99: {
    style: {
      color: '#000'
    },
    label: '1.5h'
  }
}
export {
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
}