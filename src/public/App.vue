<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect"
      class="el-menu-vertical-demo w-64 h-full"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      background-color="#1e1e1e"
      text-color="#ffffff"
      active-text-color="#409EFF"
    >
      <el-menu-item index="1">
        <el-icon><icon-menu /></el-icon>
        <span>Karin喵~</span>
      </el-menu-item>
      <el-menu-item v-for="(tool, index) in hrTools" :key="index" :index="(index + 2).toString()">
        <el-icon><icon-menu /></el-icon>
        <span>{{ tool }}</span>
      </el-menu-item>
      <el-menu-item index="6">
        <el-icon><icon-menu /></el-icon>
        <span>Karin 5</span>
      </el-menu-item>
    </el-menu>

    <!-- 主要内容 -->
    <component :is="currentComponent" class="flex-1 overflow-auto" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Menu as IconMenu } from '@element-plus/icons-vue'
import MainContent from './components/Dashboard.vue'
import Config from './components/Config.vue'

const activeIndex = ref('1')
const currentComponent = computed(() => {
  return activeIndex.value === '2' ? Config : MainContent
})

const isCollapse = ref(false)
const hrTools = ref(['Config', 'Karin 2', 'Karin 3', 'Karin 4'])

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}

const handleSelect = (index) => {
  activeIndex.value = index
}
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #121212;
  color: #ffffff;
  margin: 0;
  padding: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu {
  border-right: none;
}

.el-menu-item:hover {
  background-color: #2c2c2c !important;
}

.el-menu-item.is-active {
  background-color: #363636 !important;
}
</style>