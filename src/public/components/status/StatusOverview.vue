<template>
  <div class="card status-overview">
    <h2 class="text-xl font-bold mb-4">总览</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="text-red-500">错误: {{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-3 gap-4 progress-boxes">
        <ProgressBox title="内存" :downTitle="'总内存 ' + Number(staticInfo.system.info_memory_total).toFixed(0) + 'MB'" :value="Number(staticInfo.system.info_memory_usage).toFixed(1)"/>
        <ProgressBox title="CPU" :downTitle="'核心数 ' + Number(staticInfo.cpu.cpu_cpus).toFixed(0)" :value="Number(staticInfo.cpu.cpu_usage).toFixed(1)"/>
        <ProgressBox title="今日处理" :downTitle="'总处理消息 ' + counter.data.value.total" :value="counter.data.value.today" :showPercent="false"/>
      </div>
      <h2 class="text-xl font-bold mb-2 mt-5">Karin</h2>
      <div class="status-container">
        <StatusTimer title="状态" value="running" :showTime="false" color="#3375b9" />
        <StatusTimer title="版本" :value="staticInfo.karin.info.version" :showTime="false" color="#3375b9" />
        <StatusTimer title="运行时间" :value="staticInfo.karin.uptime" :showTime="true" color="#2196F3" />
      </div>
      <h2 class="text-xl font-bold mb-2">数据库</h2>
      <div class="status-container">
        <StatusTimer title="状态" :value="staticInfo.redis.info_status" :showTime="false" color="#2196F3" />
        <StatusTimer title="数据库" :value="staticInfo.redis.info_server" :showTime="false" color="#2196F3" />
        <StatusTimer title="版本" :value="staticInfo.redis.info_version" :showTime="false" color="#2196F3" />
      </div>
      <h2 class="text-xl font-bold mb-2">系统</h2>
      <div class="status-container">
        <StatusTimer title="系统类型" :value="staticInfo.system.info_platform" :showTime="false" color="#2196F3" />
        <StatusTimer title="系统架构" :value="staticInfo.system.info_arch" :showTime="false" color="#2196F3" />
        <StatusTimer title="Node.js" :value="staticInfo.system.info_version" :showTime="false" color="#2196F3" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { fetchStatic, fetchCounter } from '../../v2';
import StatusTimer from './StatusBox.vue';
import ProgressBox from './ProgressBox.vue';

const staticInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const intervalId = ref(null);
const counter = ref(null);

const loadStatus = async () => {
  try {
    const newStatic = await fetchStatic();
    const newCounter = await fetchCounter("message:send");
    staticInfo.value = newStatic.data.staticInfo;
    counter.value = newCounter;
    loading.value = false;
    error.value = null;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

onMounted(() => {
  loadStatus();
  intervalId.value = setInterval(loadStatus, 10000);
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.status-overview {
  overflow: hidden;
}

.progress-boxes {
  transform-origin: top left;
  transition: transform 0.3s ease;
}

@media (max-width: 1920px) {
  .progress-boxes {
    transform: scale(0.98);
  }
}

@media (max-width: 1600px) {
  .progress-boxes {
    transform: scale(0.95);
  }
}

@media (max-width: 1366px) {
  .progress-boxes {
    transform: scale(0.9);
  }
}

@media (max-width: 1024px) {
  .progress-boxes {
    transform: scale(0.85);
  }
}

@media (max-width: 768px) {
  .progress-boxes {
    transform: scale(0.8);
  }
}

.status-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.status-container > * {
  flex: 1 1 calc(33.333% - 8px);
  min-width: 100px;
}

@media (max-width: 640px) {
  .status-container > * {
    flex: 1 1 100%;
  }
}
</style>