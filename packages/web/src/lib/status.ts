import key from '@/consts/key'
import { SystemStatus } from '@/types/server'
import { eventSourcePolyfill } from './request'

/**
 * 获取系统状态
 * @param writer - 写入器
 * @description 获取系统状态
 */
export function getSystemStatus (writer: (data: SystemStatus) => void) {
  const token = localStorage.getItem(key.accessToken)
  const userId = localStorage.getItem(key.userId)
  if (!token || !userId) {
    throw new Error('未登录')
  }

  const eventSource = eventSourcePolyfill(
    '/api/v1/status/system',
    {
      withCredentials: true
    }
  )

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as SystemStatus
      writer(data)
    } catch (error) {
      console.error(error)
    }
  }

  eventSource.onerror = (error) => {
    console.error('SSE连接出错:', error)
    eventSource.close()
  }

  return eventSource
}
