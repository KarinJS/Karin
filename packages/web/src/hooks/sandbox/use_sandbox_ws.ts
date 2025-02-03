import { request } from '@/lib/request'
import type { SandboxBotInfo } from '@/types/sandbox/bot'
import { useEffect, useState, useRef } from 'react'

function useSandboxWebsoocket () {
  const wsRef = useRef<WebSocket | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<Error | Event | null>(null)
  const [ready, setReady] = useState(false)
  const [botInfo, setBotInfo] = useState<SandboxBotInfo>({
    id: 'karin',
    name: 'Karin',
    avatar: '/web/karin.png',
  })

  useEffect(() => {
    const connectWs = async () => {
      console.log('WebSocket connecting')
      if (wsRef.current) return
      setConnecting(true)

      const { authKey } = await request.serverPost<{ authKey: string }, null>('/api/v1/sandbox/url')

      const currentURL = new URL(window.location.href)
      currentURL.protocol = currentURL.protocol.replace('http', 'ws')
      currentURL.pathname = '/sandbox'
      currentURL.searchParams.set('authorization', authKey)
      const wsURL = currentURL.toString()
      const ws = new WebSocket(wsURL)
      wsRef.current = ws
      ws.onopen = () => {
        setConnecting(false)
        setConnected(true)
        console.log('WebSocket connected')
      }
      ws.onmessage = event => {
        const message = JSON.parse(event.data)
        console.log(message)
        if (message.action === 'init') {
          setReady(true)
          setBotInfo(message.param)
        }
        console.log('WebSocket message received:', event.data)
      }
      ws.onclose = () => {
        setConnecting(false)
        setConnected(false)
        console.log('WebSocket disconnected')
      }
      ws.onerror = error => {
        setError(error)
        console.error('WebSocket error:', error)
      }
    }

    connectWs()

    return () => {
      console.log('WebSocket cleanup')
      setConnecting(false)
      setConnected(false)
      setError(null)
      setReady(false)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  return {
    connecting,
    connected,
    error,
    ready,
    ws: wsRef.current,
    botInfo,
  }
}

export default useSandboxWebsoocket
