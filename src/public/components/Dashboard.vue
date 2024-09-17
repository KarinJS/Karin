<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 fade-in">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <div class="mt-6">
        <h1 class="text-2xl font-bold">Morning~ My Master</h1>
        <p class="text-gray-400">Welcome to the Karin Management System</p>
      </div>
      <div class="flex space-x-4">
        <div class="icon-bg p-2">
          <i class="fas fa-bell text-gray-500"></i>
        </div>
        <div class="icon-bg p-2">
          <i class="fas fa-cog text-gray-500"></i>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 dashboard-grid">
      <!-- Status Overview Card -->
      <StatusOverview class="col-span-3 xl:col-span-1" />

      <!-- Statistics Cards -->
      <div class="col-span-3 xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="(stat, index) in statistics" :key="index" class="card">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-2xl font-bold">{{ stat.value }}</h3>
              <p class="text-gray-400">{{ stat.label }}</p>
            </div>
            <div :class="['progress-circle', stat.color]">
              <span class="text-sm">{{ stat.percentage }}</span>
            </div>
          </div>
          <p :class="['mt-2', `text-${stat.color}-500`]">{{ stat.change }}</p>
        </div>

        <div class="card col-span-1 sm:col-span-3">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-2xl font-bold">咚咚咚 </h3>
              <p class="text-gray-400">装修中</p>
            </div>
            <div class="icon-bg p-2">
              <i class="fas fa-tasks text-blue-500"></i>
            </div>
          </div>
        </div>
      </div>

      <Git class="card col-span-3 sm:col-span-1" />

      <!-- Applicants Received Time -->
      <div class="card col-span-3 sm:col-span-2">
        <h2 class="text-xl font-bold mb-4">咚咚咚</h2>
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-400">装修中</p>
          <i class="fas fa-chevron-down text-gray-500"></i>
        </div>
        <div class="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">咚咚咚 咚咚咚</p>
        </div>
      </div>

      <!-- Calendar -->
      <div class="card col-span-3 sm:col-span-1">
        <h2 class="text-xl font-bold mb-4">咚咚咚～</h2>
        <!-- <div class="flex justify-between items-center mb-4">
            <i class="fas fa-chevron-left text-gray-500"></i>
            <p class="text-gray-400">July 2022</p>
            <i class="fas fa-chevron-right text-gray-500"></i>
          </div>
          <div class="grid grid-cols-7 gap-2 text-center text-gray-400 mb-4">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
            <div v-for="date in 31" :key="date" :class="{ 'bg-blue-500 text-white rounded-full': date === 12 }">{{ date }}</div>
          </div>
          <div class="space-y-4">
            <div v-for="(event, index) in calendarEvents" :key="index" class="flex items-center justify-between">
              <div class="flex items-center">
                <div v-if="event.icon" class="icon-bg p-2">
                  <i :class="['fas', event.icon, 'text-blue-500']"></i>
                </div>
                <img v-else :src="event.image" :alt="`Profile picture of ${event.name}`" class="rounded-full mr-4" height="40" width="40"/>
                <div class="ml-4">
                  <h3 class="text-lg font-bold">{{ event.title }}</h3>
                  <p class="text-gray-400">{{ event.description }}</p>
                </div>
              </div>
              <p class="text-gray-400">{{ event.time }}</p>
            </div>
          </div> -->
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <!-- <button class="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg">View 4 more events</button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusOverview from './status/StatusOverview.vue'
import Git from './status/Git.vue'

const isCollapse = ref(false)
const hrTools = ref(['Karin 1', 'Karin 2', 'Karin 3', 'Karin 4'])

const statistics = ref([
  { value: 2864, label: '咚咚咚', color: 'blue', percentage: '+28%', change: '+12% Inc' },
  { value: 485, label: '咚咚咚', color: 'purple', percentage: '+12%', change: '+4% Inc' },
  { value: 2864, label: '咚咚咚', color: 'red', percentage: '+16%', change: '-8% Inc' }
])

const calendarEvents = ref([
  { title: 'Video Call', description: 'with Tom Fell', time: '7-8 AM', icon: 'fa-video' },
  { title: 'Interview', description: 'Penny Porter', time: '9 AM', image: '' },
  { title: 'English class', description: 'Individual lesson', time: '10-11 AM', icon: 'fa-graduation-cap' }
])

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}
</script>

<style scoped>
body {
  font-family: monospace;
  background-color: #121212;
  color: #ffffff;
}

.card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
}

.icon-bg {
  background-color: #2a2a2a;
  border-radius: 50%;
  padding: 10px;
}

.progress-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle.blue {
  background-color: #1e3a8a;
}

.progress-circle.purple {
  background-color: #6b21a8;
}

.progress-circle.red {
  background-color: #b91c1c;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.dashboard-grid {
  transform-origin: top left;
  transition: transform 0.3s ease;
}

@media (max-width: 1920px) {
  .dashboard-grid {
    transform: scale(0.98);
  }
}

@media (max-width: 1600px) {
  .dashboard-grid {
    transform: scale(0.95);
  }
}

@media (max-width: 1366px) {
  .dashboard-grid {
    transform: scale(0.9);
  }
}

@media (max-width: 1024px) {
  .dashboard-grid {
    transform: scale(0.85);
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    transform: scale(0.8);
  }
}

.statistics-grid {
  transform-origin: top left;
  transition: transform 0.3s ease;
}

@media (max-width: 1920px) {
  .statistics-grid {
    transform: scale(0.98);
  }
}

@media (max-width: 1600px) {
  .statistics-grid {
    transform: scale(0.95);
  }
}

@media (max-width: 1366px) {
  .statistics-grid {
    transform: scale(0.9);
  }
}

@media (max-width: 1024px) {
  .statistics-grid {
    transform: scale(0.85);
  }
}

@media (max-width: 768px) {
  .statistics-grid {
    transform: scale(0.8);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>