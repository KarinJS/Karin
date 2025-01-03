import { server } from './app'
import { WebSocketServer } from 'ws'
import { listeners } from '@/core/internal'

/** ws 服务 */
export const wss: WebSocketServer = new WebSocketServer({ server })

wss.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.fatal(`[websocket] 端口 ${process.env.karin_port} 已被占用，无法启动 WebSocket 服务`)
  } else {
    logger.fatal(`[websocket] WebSocket服务启动失败: ${error.message}`)
  }

  throw error
})

/** 监听 ws 连接 */
wss.on('connection', (socket, request) => {
  listeners.emit('ws:connection', { socket, request })
  listeners.emit(`ws:connection:${socket.url}`, { socket, request })
})
