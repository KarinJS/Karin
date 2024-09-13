<template>
  <div class="demo-progress">
    <div class="progress-container">
      <el-progress type="dashboard" :percentage="percentage" :color="colors">
        <template #default="{ percentage }: { percentage: number }">
          <span class="percentage-value">{{ percentage.toFixed(1) }}%</span>
          <br/>
          <span class="percentage-label">{{ title }}</span>
        </template>
      </el-progress>
      <h2 class="down-title">{{ downTitle }}</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'NaN'
  },
  downTitle: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  }
})

const percentage = ref(props.value)
const downTitle = ref(props.downTitle)

const colors = [
  { color: '#a6a9ad', percentage: 20 },
  { color: '#66b1ff', percentage: 40 },
  { color: '#85ce61', percentage: 60 },
  { color: '#ebb563', percentage: 80 },
  { color: '#f78989', percentage: 100 },
]

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
onMounted(() => {
  setInterval(() => {
    percentage.value = props.value
    downTitle.value = props.downTitle
  }, 500)
})
</script>

<style scoped>
.demo-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-container {
  position: relative;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}
.percentage-value {
  color: #ffffff;
  font-size: 1.5em;
  opacity: 0.7;
  margin-bottom: 5px;
}
.percentage-label {
  color: #ffffff;
  font-size: 1em;
  opacity: 0.7;
  margin-bottom: 5px;
  margin-top: 5px;
}
.down-title {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 1em;
  opacity: 0.7;
  text-align: center;
  width: 100%;
}
</style>