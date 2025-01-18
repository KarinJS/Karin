import { SystemStatus } from '@/types/server'
import { EventSourcePolyfill } from 'event-source-polyfill'

export function getSystemStatus(writer: (data: SystemStatus) => void) {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('未登录')
  }
  const _token = JSON.parse(token)
  const eventSource = new EventSourcePolyfill(
    '/api/v1/status/system',
    {
      headers: {
        Authorization: `Bearer ${_token}`,
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
