<template>
  <div class="w-full p-6 fade-in">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 config-grid">
      <!-- App 配置 -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-white">App 配置</h2>
        <el-form label-position="left" label-width="auto">
          <ConfigSection :config="appConfig" />
        </el-form>
      </div>

      <!-- Config 配置 -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-white">Config 配置</h2>
        <el-form label-position="left" label-width="auto">
          <ConfigSection :config="configConfig" />
        </el-form>
      </div>

      <!-- Redis 配置 -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-white">Redis 配置</h2>
        <el-form label-position="left" label-width="auto">
          <ConfigSection :config="redisConfig" />
        </el-form>
      </div>

      <!-- Server 配置 -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4 text-white">Server 配置</h2>
        <el-form label-position="left" label-width="auto">
          <ConfigSection :config="serverConfig" />
        </el-form>
      </div>
    </div>

    <!-- 保存按钮 -->
    <el-button
      type="primary"
      :loading="isSaving"
      @click="saveConfigs"
      class="save-button"
    >
      保存配置
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchConfig, saveConfig } from '../v2'
import ConfigSection from './config/ConfigSection.vue'

const appConfig = ref({})
const configConfig = ref({})
const redisConfig = ref({})
const serverConfig = ref({})
const isSaving = ref(false)

onMounted(async () => {
  try {
    const [appResponse, configResponse, redisResponse, serverResponse] = await Promise.all([
      fetchConfig('app'),
      fetchConfig('config'),
      fetchConfig('redis'),
      fetchConfig('server')
    ])
    appConfig.value = appResponse.data.config
    configConfig.value = configResponse.data.config
    redisConfig.value = redisResponse.data.config
    serverConfig.value = serverResponse.data.config
  } catch (error) {
    console.error('获取配置失败', error)
    ElMessage.error('获取配置失败')
  }
})

const saveConfigs = async () => {
  isSaving.value = true
  try {
    await Promise.all([
      saveConfig('app', appConfig.value),
      saveConfig('config', configConfig.value),
      saveConfig('redis', redisConfig.value),
      saveConfig('server', serverConfig.value)
    ])
    ElMessage.success('配置保存成功')
  } catch (error) {
    console.error('保存配置失败', error)
    ElMessage.error('保存配置失败')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.card h2 {
  margin-bottom: 1rem;
}

.card .el-form {
  flex-grow: 1;
  overflow: auto;
}

.config-grid {
  transform-origin: top left;
  transition: transform 0.3s ease;
}

@media (max-width: 1920px) {
  .config-grid {
    transform: scale(0.98);
  }
}

@media (max-width: 1600px) {
  .config-grid {
    transform: scale(0.97);
  }
}

@media (max-width: 1366px) {
  .config-grid {
    transform: scale(0.93);
  }
}

@media (max-width: 1024px) {
  .config-grid {
    transform: scale(0.88);
  }
}

@media (max-width: 768px) {
  .config-grid {
    transform: scale(0.8);
  }
}

.save-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

@media (max-width: 768px) {
  .save-button {
    position: static;
    margin-top: 20px;
    width: 100%;
  }
}

/* 添加以下新的CSS规则 */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
