<template>
  <div class="w-full p-6 fade-in dark-theme">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 config-grid">
      <div v-for="plugin in mergedPlugins" :key="plugin.name" class="card">
        <h2 class="text-xl font-bold mb-4 text-white">{{ plugin.name }}</h2>
        <el-form label-position="left" label-width="auto">
          <el-form-item label="插件数量" class="dark-form-item">
            <span class="text-white">{{ plugin.count }}</span>
          </el-form-item>
          <el-form-item label="命令数量" class="dark-form-item">
            <span class="text-white">{{ plugin.totalCommands }}</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="openCommandsDialog(plugin)" size="small" type="primary" class="dark-button">管理命令</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="命令列表" width="50%" custom-class="dark-dialog">
      <el-table :data="currentPluginCommands" style="width: 100%" class="dark-table">
        <el-table-column prop="fullName" label="命令名称"></el-table-column>
        <el-table-column prop="reg" label="正则"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchPlugins, fetchPluginCommandsList } from '../v2'

const plugins = ref([])
const dialogVisible = ref(false)
const currentPluginCommands = ref([])

const mergedPlugins = computed(() => {
  const pluginMap = new Map()
  plugins.value.forEach(plugin => {
    if (pluginMap.has(plugin.name)) {
      const existingPlugin = pluginMap.get(plugin.name)
      existingPlugin.count += 1
      existingPlugin.totalCommands += plugin.commands || 0
      existingPlugin.ids.push(plugin.id)
    } else {
      pluginMap.set(plugin.name, {
        name: plugin.name,
        count: 1,
        totalCommands: plugin.commands || 0,
        ids: [plugin.id]
      })
    }
  })
  return Array.from(pluginMap.values())
})

const openCommandsDialog = async (plugin) => {
  try {
    const allCommands = await Promise.all(plugin.ids.map(id => fetchPluginCommandsList(id)))
    currentPluginCommands.value = allCommands.flatMap(response => 
      response.data.commands.map(command => ({
        ...command,
        fullName: `${command.name} ${command.fnname}`
      }))
    )
    dialogVisible.value = true
  } catch (error) {
    console.error('获取插件命令列表失败', error)
    ElMessage.error('获取插件命令列表失败')
  }
}

onMounted(async () => {
  try {
    const response = await fetchPlugins()
    plugins.value = response.data.plugins
  } catch (error) {
    console.error('获取插件失败', error)
    ElMessage.error('获取插件失败')
  }
})
</script>

<style scoped>
.dark-theme {
  background-color: #121212;
  color: #ffffff;
}

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

.dark-form-item :deep(.el-form-item__label) {
  color: #ffffff;
}

.dark-button {
  background-color: #409EFF;
  border-color: #409EFF;
}

.dark-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.dark-dialog {
  background-color: #1e1e1e;
  color: #ffffff;
}

.dark-dialog :deep(.el-dialog__title) {
  color: #ffffff;
}

.dark-dialog :deep(.el-dialog__body) {
  color: #ffffff;
}

.dark-table {
  background-color: #1e1e1e;
  color: #ffffff;
}

.dark-table :deep(.el-table__header-wrapper) {
  background-color: #2c2c2c;
}

.dark-table :deep(.el-table__header) {
  background-color: #2c2c2c;
}

.dark-table :deep(.el-table__body) {
  background-color: #1e1e1e;
}

.dark-table :deep(.el-table__body tr:hover > td) {
  background-color: #2c2c2c;
}

.dark-table :deep(.el-table__cell) {
  background-color: #1e1e1e;
  border-bottom: 1px solid #2c2c2c;
}

.dark-table :deep(.el-table__header-wrapper th) {
  background-color: #2c2c2c;
  border-bottom: 1px solid #3c3c3c;
  color: #ffffff;
}

:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
