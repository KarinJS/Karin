import { config } from '../config'
import { createWsServer, log } from '../create'
import { wsServerContext } from '@karinjs/server'

export const createWebSocketServer = () => {
  const cfg = config.getConfigSync('config.json')
  if (cfg.server.enable === false) {
    return
  }

  wsServerContext.registerPath(cfg.server.route, (socket, request) => {
    const selfId = String(request.headers['x-self-id'])

    if (!selfId) {
      log.warn(`WebSocket 连接请求缺少 x-self-id 头部, 即将关闭连接: ${request.url}`)
      socket.close()
      return
    }

    const token = cfg.server.tokens[selfId] || cfg.server.token
    const auth = wsServerContext.getAuth(request, {
      token,
      query: {
        enable: true,
        name: 'access_token',
      },
      strict: false,
    })

    if (!auth) {
      log.warn(`WebSocket 鉴权失败, 即将关闭连接: ${request.url}`)
      socket.close()
      return
    }

    createWsServer(socket, request)
  })
}
