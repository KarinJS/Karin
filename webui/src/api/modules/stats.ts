import type { StatItem, LogEntry } from '../types'

// TODO: 待后端实现 stats 和 logs API 后替换为真实接口
// 目前 Dashboard 页面暂时使用 mock 数据

const MOCK_STATS: StatItem[] = [
  { title: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { title: 'Active Sessions', value: '56', change: '-5%', trend: 'down' },
  { title: 'Server Uptime', value: '99.9%', change: '+0.1%', trend: 'up' },
  { title: 'Memory Usage', value: '45%', change: '+2%', trend: 'up' },
]

const MOCK_LOGS: LogEntry[] = [
  { id: 1, level: 'info', message: 'Server started successfully', timestamp: '2023-10-01 10:00:00' },
  { id: 2, level: 'warn', message: 'High memory usage detected', timestamp: '2023-10-01 10:05:00' },
  { id: 3, level: 'error', message: 'Connection timeout', timestamp: '2023-10-01 10:10:00' },
  { id: 4, level: 'info', message: 'User logged in', timestamp: '2023-10-01 10:15:00' },
]

/**
 * 获取统计数据
 * @description 暂时使用 mock 数据，待后端实现后替换
 */
export const fetchStats = async (): Promise<StatItem[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  return MOCK_STATS
}

/**
 * 获取日志列表
 * @description 暂时使用 mock 数据，待后端实现后替换
 */
export const fetchLogs = async (): Promise<LogEntry[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  return MOCK_LOGS
}
