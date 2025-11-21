import { server } from '../app/app'
import { WebSocketServer } from 'ws'
import { wsServerContext } from './context'

/** ws 服务 */
export const webSocketServer: WebSocketServer = new WebSocketServer({ server })

/**
 * 创建 WebSocket 上下文
 */
export const createWebSocketContext = () => {
  webSocketServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.fatal(`[server] 端口 ${process.env.HTTP_PORT} 已被占用，无法启动 http WebSocket 服务`)
    } else {
      logger.fatal(`[server] http服务启动失败: ${error.message}`)
    }

    throw error
  })

  webSocketServer.on('connection', (socket, request) => {
    wsServerContext.dispatch(socket, request)
    const url = wsServerContext.getFullWsUrl(request)
    logger.debug(`[ws][server] 收到新的 ws 连接请求: ${url.toString()}\n  headers: ${JSON.stringify(request.headers, null, 2)}`)
  })
}
