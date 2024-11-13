import { IncomingMessage } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

type Request = new (socket: WebSocket, request: IncomingMessage) => any
/** ws理由和class的映射 */
const pathClassMap = new Map<string, Request>()

/**
 * @description 注册一个ws路由
 * @param path ws路由
 * @param cls ws类
 */
export const registerWSPath = (path: string, cls: Request) => {
  pathClassMap.set(path, cls)
  logger.debug(`[service][绑定WebSocket路由] ${path}`)
}

/**
 * @description 创建 WebSocket 服务
 * @param app express 服务
 */
export const createWebSocketServer = (wss: WebSocketServer) => {
  wss.on('connection', (socket, request) => {
    try {
      /** 请求路由 */
      const url = request.url || '/'
      /** 请求头 */
      const headers = request.headers
      logger.debug(`[WebSocketServer] 收到连接请求: ${url}\nheaders: ${JSON.stringify(headers, null, 2)}`)
      const App = pathClassMap.get(url)
      if (!App) {
        logger.error(`[WebSocketServer] 未找到请求路由对应的实现类: ${url}`)
        socket.close()
        return
      }

      const cls = new App(socket, request)
      if (typeof cls.init === 'function') {
        cls.init()
      }
    } catch (error: any) {
      logger.error(`[WebSocketServer] 连接处理失败 已关闭此次连接: ${request.url || '/'}`)
      logger.error(error)
      socket.close()
    }
  })

  return wss
}
