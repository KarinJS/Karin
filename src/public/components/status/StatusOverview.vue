<template>
  <div class="card">
    <h2 class="text-xl font-bold mb-4">总览</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error" class="text-red-500">错误: {{ error }}</div>
    <div v-else>
      <div class="status-container">
        <ProgressBox title="内存" :downTitle="'总内存 ' + Number(status.data.system.info_memory_total).toFixed(0) + 'MB'" :value="status.data.system.info_memory_usage"/>
        <ProgressBox v-if="cpuUsage" title="CPU" :downTitle="'核心数 ' + cpuUsage.data.cpu_info.cpu_cpus" :value="cpuUsage.data.cpu_info.cpu_usage"/>
        <ProgressBox v-else title="CPU" downTitle="加载中..." :value="0"/>
        <ProgressBox title="内存" downTitle="使用率111" :value="status.data.system.info_memory_usage"/>
      </div>
      <h2 class="text-xl font-bold mb-2 mt-5">Karin</h2>
      <div class="status-container">
        <StatusTimer title="状态" :value=status.data.status :showTime="false" color="#3375b9" />
        <StatusTimer title="版本" :value=status.data.karin.info.version :showTime="false" color="#3375b9" />
        <StatusTimer title="运行时间" :value=status.data.karin.uptime :showTime="true" color="#2196F3" />
      </div>
      <h2 class="text-xl font-bold mb-2">数据库</h2>
      <div class="status-container">
        <StatusTimer title="状态" :value=status.data.database.info_status :showTime="false" color="#2196F3" />
        <StatusTimer title="数据库" :value=status.data.database.info_server :showTime="false" color="#2196F3" />
        <StatusTimer title="版本" :value=status.data.database.info_version :showTime="false" color="#2196F3" />
      </div>
      <h2 class="text-xl font-bold mb-2">系统</h2>
      <div class="status-container">
        <StatusTimer title="系统类型" :value=status.data.system.info_platform :showTime="false" color="#2196F3" />
        <StatusTimer title="系统架构" :value=status.data.system.info_arch :showTime="false" color="#2196F3" />
        <StatusTimer title="Node.js版本" :value=status.data.system.info_version :showTime="false" color="#2196F3" />
      </div>
      <!-- <pre class="text-sm overflow-x-auto mt-4">{{ JSON.stringify(status, null, 2) }}</pre> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { fetchStatus, fetchCPUUsage } from '../../v2';
import StatusTimer from './StatusBox.vue';
import ProgressBox from './ProgressBox.vue';
const status = ref(null);
const loading = ref(true);
const error = ref(null);
const intervalId = ref(null);
const cpuUsage = ref(null);

const loadStatus = async () => {
  try {
    const newStatus = await fetchStatus();
    status.value = newStatus;
    loading.value = false;
    error.value = null;

    // 异步加载CPU使用率
    fetchCPUUsage().then(cpuUsageData => {
      cpuUsage.value = cpuUsageData;
    }).catch(err => {
      console.error('加载CPU使用率失败:', err);
    });
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

onMounted(() => {
  loadStatus();
  intervalId.value = setInterval(loadStatus, 5000);
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped>
.flex {
  display: flex;
  gap: 15px;
}

.status-container {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.status-container > * {
  flex: 1;
  max-width: 33.33%;
}
</style>