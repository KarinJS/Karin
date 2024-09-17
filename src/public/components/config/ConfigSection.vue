<template>
  <template v-for="(value, key) in config" :key="key">
    <template v-if="typeof value === 'object' && !Array.isArray(value)">
      <el-tooltip :content="getTip(key)" placement="top" :disabled="!getTip(key)">
        <h3 class="font-bold mt-2 mb-1 text-white">{{ getDisplayName(key) }}</h3>
      </el-tooltip>
      <div class="nested-config">
        <template v-for="(nestedValue, nestedKey) in value" :key="nestedKey">
          <el-form-item class="config-item">
            <template #label>
              <el-tooltip :content="getTip(nestedKey)" placement="top" :disabled="!getTip(nestedKey)">
                <span>{{ getDisplayName(nestedKey) }}</span>
              </el-tooltip>
            </template>
            <el-switch v-if="typeof nestedValue === 'boolean'" v-model="value[nestedKey]" />
            <el-input-number v-else-if="typeof nestedValue === 'number'" v-model="value[nestedKey]" class="dark-input" />
            <el-input v-else-if="typeof nestedValue === 'string'" v-model="value[nestedKey]" class="dark-input" :placeholder="`请输入${getDisplayName(nestedKey)}`" />
            <el-select
              v-else-if="Array.isArray(nestedValue)"
              v-model="value[nestedKey]"
              multiple
              filterable
              allow-create
              default-first-option
              :placeholder="`请选择或输入${getDisplayName(nestedKey)}`"
              class="dark-input"
              @visible-change="handleVisibleChange"
            >
              <el-option v-for="item in value[nestedKey]" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </template>
      </div>
    </template>
    <el-form-item v-else class="config-item">
      <template #label>
        <el-tooltip :content="getTip(key)" placement="top" :disabled="!getTip(key)">
          <span>{{ getDisplayName(key) }}</span>
        </el-tooltip>
      </template>
      <el-switch v-if="typeof value === 'boolean'" v-model="config[key]" />
      <el-input-number v-else-if="typeof value === 'number'" v-model="config[key]" class="dark-input" />
      <el-input v-else-if="typeof value === 'string'" v-model="config[key]" class="dark-input" :placeholder="`请输入${getDisplayName(key)}`" />
      <el-select
        v-else-if="Array.isArray(value)"
        v-model="config[key]"
        multiple
        filterable
        allow-create
        default-first-option
        :placeholder="`请选择或输入${getDisplayName(key)}`"
        class="dark-input"
        @visible-change="handleVisibleChange"
      >
        <el-option v-for="item in config[key]" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
  </template>
</template>

<script setup>
import { nextTick } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const keyMappings = {
  log4jsCfg: { name: 'log4jsCfg 日志配置', tip: 'log4js 日志配置' },
  level: { name: 'level 日志等级', tip: '日志等级: trace, debug, info, warn, fatal, mark, error, off' },
  daysToKeep: { name: 'daysToKeep 日志保留天数', tip: '日志保留天数' },
  overall: { name: 'overall 整体化', tip: '将日志输出到一个文件(一天为一个文件) 日志较多的情况下不建议与碎片化同时开启' },
  fragments: { name: 'fragments 碎片化', tip: '将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启' },
  maxLogSize: { name: 'maxLogSize 日志文件最大大小', tip: '日志文件最大大小 MB' },
  log_color: { name: 'log_color 控制台触发插件日志颜色', tip: '控制台触发插件日志颜色 十六进制 默认#FFFF00 不支持热更新' },
  pm2Restart: { name: 'pm2Restart 重启是否调用pm2', tip: '重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序' },
  private: { name: 'private 私聊设置', tip: '私聊设置' },
  tips: { name: 'tips 关闭私聊后回复的提示词', tip: '关闭私聊后回复的提示词 为空则不回复' },
  white_list: { name: 'white_list 关闭私聊后的用户白名单', tip: '关闭私聊后的用户白名单' },
}

const getDisplayName = (key) => {
  return keyMappings[key]?.name || key
}

const getTip = (key) => {
  return keyMappings[key]?.tip || ''
}

const handleVisibleChange = (visible) => {
  if (!visible) {
    nextTick(() => {
      const input = document.querySelector('.el-select__input')
      if (input) {
        input.value = ''
      }
    })
  }
}
</script>

<style scoped>
.nested-config {
  margin-left: 0.5rem;
  border-left: 1px solid #333;
  padding-left: 0.5rem;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.config-item :deep(.el-form-item__label) {
  color: #e0e0e0;
  flex: 0 0 auto;
  margin-right: 0.5rem;
  font-size: 0.9em;
}

.config-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 1;
  display: flex;
  align-items: center;
}

.dark-input {
  width: 100%;
  max-width: 15rem;
}

.dark-input :deep(.el-input__wrapper),
.dark-input :deep(.el-input-number__decrease),
.dark-input :deep(.el-input-number__increase),
.dark-input :deep(.el-select__wrapper) {
  background-color: #2c2c2c;
  box-shadow: 0 0 0 1px #4a4a4a inset !important;
  border-radius: 0.25rem;
}

.dark-input :deep(.el-input__inner),
.dark-input :deep(.el-input__inner::placeholder),
.dark-input :deep(.el-input__inner::-webkit-input-placeholder),
.dark-input :deep(.el-input__inner::-moz-placeholder),
.dark-input :deep(.el-input__inner:-ms-input-placeholder),
.dark-input :deep(.el-select__input) {
  color: #e0e0e0;
  font-size: 0.9em;
}

.dark-input :deep(.el-input__inner::placeholder),
.dark-input :deep(.el-input__inner::-webkit-input-placeholder),
.dark-input :deep(.el-input__inner::-moz-placeholder),
.dark-input :deep(.el-input__inner:-ms-input-placeholder) {
  color: #888;
}

.dark-input :deep(.el-input-number__decrease),
.dark-input :deep(.el-input-number__increase) {
  background-color: #3a3a3a;
  color: #e0e0e0;
  border-color: #4a4a4a;
}

.dark-input :deep(.el-input-number__decrease:hover),
.dark-input :deep(.el-input-number__increase:hover) {
  background-color: #4a4a4a;
}

:deep(.el-select-dropdown) {
  background-color: #2c2c2c;
  border: 1px solid #4a4a4a;
}

:deep(.el-select-dropdown__item) {
  color: #e0e0e0;
}

:deep(.el-select-dropdown__item.hover),
:deep(.el-select-dropdown__item:hover) {
  background-color: #3a3a3a;
}

:deep(.el-switch__core) {
  border-color: #4a4a4a;
  background-color: #2c2c2c;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #409EFF;
  background-color: #409EFF;
}

:deep(.el-select__input) {
  color: #e0e0e0 !important;
}

:deep(.el-select-dropdown__item.created) {
  color: #409EFF;
}

:deep(.el-select .el-select__tags .el-tag) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
}

h3.el-tooltip__trigger {
  display: inline-block;
}
</style>