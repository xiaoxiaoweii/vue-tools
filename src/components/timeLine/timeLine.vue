<template>
  <div class="time_line">
    <line-axis></line-axis>
  </div>
</template>

<script>
import lineAxis from './components/timelineAxis.vue'
export default {
  name: 'timeLine',
  components: {
    lineAxis
  }
}
</script>

