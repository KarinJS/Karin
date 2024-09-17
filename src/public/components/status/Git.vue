<template>
  <div class="git-activity" ref="gitActivityRef" @scroll="handleScroll">
    <h2 class="text-xl font-bold mb-4">Git 活动</h2>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in gitActivities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
      >
        <h3 class="text-sm font-medium">
          <a :href="activity.url" target="_blank" class="hover:underline">{{ activity.title }}</a>
        </h3>
        <p class="text-xs text-gray-400">{{ activity.content }}</p>
      </el-timeline-item>
    </el-timeline>
    <div v-if="loading" class="text-center py-2">加载中...</div>
    <div v-if="error" class="text-center py-2 text-red-500">
      错误: {{ error }}
      <a v-if="documentationUrl" :href="documentationUrl" target="_blank" class="text-blue-400 hover:underline">
        查看文档
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios, { AxiosError } from 'axios'
import { Document, Promotion } from '@element-plus/icons-vue'

interface GitActivity {
  type: string;
  icon: any;
  size: string;
  title: string;
  content: string;
  timestamp: string;
  hollow?: boolean;
  color?: string;
  url: string;
}

interface Commit {
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

const gitActivities = ref<GitActivity[]>([])
const page = ref(1)
const loading = ref(false)
const error = ref('')
const documentationUrl = ref('')
const gitActivityRef = ref<HTMLElement | null>(null)
const perPage = 15

const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) {
    if (diffHours < 1) {
      const minutes = Math.floor(diffHours * 60);
      return `${minutes}分钟前`;
    }
    return `${Math.floor(diffHours)}小时前`;
  } else if (diffHours < 168) { // 7天 = 168小时
    const days = Math.floor(diffHours / 24);
    return `${days}天前`;
  }
  return date.toLocaleString();
}

const fetchGitActivities = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  documentationUrl.value = ''
  try {
    const [prResponse, commitResponse] = await Promise.all([
      axios.get(`https://api.github.com/repos/KarinJS/Karin/pulls?page=${page.value}&per_page=${perPage}`),
      axios.get(`https://api.github.com/repos/KarinJS/Karin/commits?page=${page.value}&per_page=${perPage}`)
    ])

    const prs = prResponse.data.map((pr: any) => ({
      type: 'primary',
      icon: Document,
      size: 'large',
      title: `PR: ${pr.title}`,
      content: `by ${pr.user.login}`,
      timestamp: formatTimestamp(pr.created_at),
      hollow: true,
      url: pr.html_url,
    }))

    const commits = commitResponse.data.map((commit: Commit) => ({
      type: 'success',
      icon: Promotion,
      color: '#0bbd87',
      size: 'normal',
      title: `Commit: ${commit.commit.message.split('\n')[0]}`,
      content: `by ${commit.commit.author.name}`,
      timestamp: formatTimestamp(commit.commit.author.date),
      url: commit.html_url,
    }))

    const newActivities = [...prs, ...commits].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    gitActivities.value = [...gitActivities.value, ...newActivities]
    page.value++
  } catch (err) {
    console.error('Error fetching git activities:', err)
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as any
        error.value = responseData.message || '未知错误'
        documentationUrl.value = responseData.documentation_url || ''
      } else {
        error.value = axiosError.message || '未知网络错误'
      }
    } else {
      error.value = '获取 Git 活动时发生未知错误'
    }
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  if (!gitActivityRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = gitActivityRef.value
  if (scrollTop + clientHeight >= scrollHeight - 50 && !loading.value) {
    fetchGitActivities()
  }
}

onMounted(() => {
  fetchGitActivities()
})
</script>

<style scoped>
.git-activity {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

:deep(.el-timeline-item__content) {
  color: #e0e0e0;
}

:deep(.el-timeline-item__timestamp) {
  color: #888;
  font-size: 0.75rem;
}

:deep(.el-timeline-item__node) {
  background-color: #409EFF;
}

:deep(.el-timeline-item__wrapper) {
  padding-bottom: 15px;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
