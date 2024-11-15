import { IncomingMessage } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

type Request = new (socket: WebSocket, request: IncomingMessage) => any
/** ws路由和class的映射 */
const pathClassMap = new Map<string, Request>()
/** http post bot列表 */
const botList = new Map<string, { token: string, isAuth: true } | { token: null, isAuth: false }>()

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
 * @description 注册一个http post bot
 * @param selfId 机器人ID
 * @param token 鉴权token 用于校验请求是否合法
 */
export const registerHttpBot = (selfId: string, token?: string) => {
  if (!token) {
    botList.set(selfId, { token: null, isAuth: false })
  } else {
    botList.set(selfId, { token, isAuth: true })
  }

  logger.debug(`[service][onebot-post][注册Bot] ${selfId}`)
}

/**
 * @description 卸载一个http post bot
 * @param selfId 机器人ID
 */
export const unregisterHttpBot = (selfId: string) => {
  botList.delete(selfId)
  logger.debug(`[service][onebot-post][卸载Bot] ${selfId}`)
}

/**
 * @description 获取鉴权token
 * @param selfId 机器人ID
 */
export const getHttpBotToken = (selfId: string) => {
  return botList.get(selfId)
}

/**
 * @description 更新鉴权token
 * @param selfId 机器人ID
 * @param token 鉴权token
 */
export const updateHttpBotToken = (selfId: string, token?: string) => {
  const bot = botList.get(selfId)
  if (!bot) return
  if (!token) {
    botList.set(selfId, { token: null, isAuth: false })
    return
  }

  botList.set(selfId, { token, isAuth: true })
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
