import key from '@/consts/key'
import { SystemStatus } from '@/types/server'
import { EventSourcePolyfill } from 'event-source-polyfill'

export function getSystemStatus (writer: (data: SystemStatus) => void) {
  const token = localStorage.getItem(key.accessToken)
  const userId = localStorage.getItem(key.userId)
  if (!token || !userId) {
    throw new Error('未登录')
  }

  const eventSource = new EventSourcePolyfill(
    '/api/v1/status/system',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
        Accept: 'text/event-stream'
      },
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
