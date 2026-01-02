import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api', // This will be intercepted or proxied later
  timeout: 5000,
})

// Mock data
const MOCK_STATS = [
  { title: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { title: 'Active Sessions', value: '56', change: '-5%', trend: 'down' },
  { title: 'Server Uptime', value: '99.9%', change: '+0.1%', trend: 'up' },
  { title: 'Memory Usage', value: '45%', change: '+2%', trend: 'up' },
]

const MOCK_LOGS = [
  { id: 1, level: 'info', message: 'Server started successfully', timestamp: '2023-10-01 10:00:00' },
  { id: 2, level: 'warn', message: 'High memory usage detected', timestamp: '2023-10-01 10:05:00' },
  { id: 3, level: 'error', message: 'Connection timeout', timestamp: '2023-10-01 10:10:00' },
  { id: 4, level: 'info', message: 'User logged in', timestamp: '2023-10-01 10:15:00' },
]

// Mock adapter (simple interceptor for now)
api.interceptors.request.use(async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  if (config.url === '/stats') {
    throw {
      response: {
        status: 200,
        data: MOCK_STATS,
      }
    }
  }

  if (config.url === '/logs') {
    throw {
      response: {
        status: 200,
        data: MOCK_LOGS,
      }
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// We use interceptors.response to catch the "thrown" mock responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data) {
      return Promise.resolve(error.response)
    }
    return Promise.reject(error)
  }
)

export const fetchStats = () => api.get('/stats').then(res => res.data)
export const fetchLogs = () => api.get('/logs').then(res => res.data)

export default api
