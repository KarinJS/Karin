<template>
  <div class="status-timer">
    <div class="title">{{ title }}</div>
    <div :style="{ color: statusColor }">{{ displayValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  value: number | string
  title: string
  showTime: boolean
}>()

const elapsedTime = ref(typeof props.value === 'number' ? props.value : 0)
const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

const displayValue = computed(() => {
  if (props.showTime && typeof elapsedTime.value === 'number') {
    const hours = Math.floor(elapsedTime.value / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((elapsedTime.value % 3600) / 60).toString().padStart(2, '0')
    const seconds = Math.floor(elapsedTime.value % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }
  return props.value
})

const statusColor = computed(() => {
  switch (props.value) {
    case 'running':
      return '#85ce61'
    case 'error':
      return '#f78989'
    default:
      return '#66b1ff'
  }
})

onMounted(() => {
  if (props.showTime && typeof props.value === 'number') {
    intervalId.value = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
  }
})
</script>

<style scoped>
.status-timer {
  padding: 15px;
  font-family: monospace;
  font-size: 1.5em;
}

.title {
  font-size: 0.8em;
  opacity: 0.7;
  margin-bottom: 5px;
}
</style>