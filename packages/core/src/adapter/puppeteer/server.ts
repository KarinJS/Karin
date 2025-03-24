import { auth } from './auth'
import { listeners } from '@/core/internal'
import { createWsResponseKey } from './key'
import { sendWsScreenshotRequest } from './request'
import { WS_CONNECTION_PUPPETEER_2 } from '@/utils/fs/key'
import { renderTemplate } from '../render/admin/template'
import { registerRender, unregisterRender } from '../render/admin/cache'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { Options2, RenderResult2 } from '../render/admin/types'

/**
 * @description 2.0 puppeteer WebSocket服务端
 * @param socket WebSocket
 * @param request IncomingMessage
 */
const WebSocketPuppeteerServer = async (
  socket: WebSocket,
  request: IncomingMessage
) => {
  let index = -1

  /** 鉴权 */
  const authorization = request.headers['authorization']
  if (!auth(authorization)) {
    socket.close()
    logger.error(`[WebSocket] 鉴权失败: authorization: ${authorization} url: ${request.url}`)
    return
  }

  /**
   * 截图函数
   */
  const render = <T extends Options2> (options: T) => {
    if (options.data) {
      options = renderTemplate(options)
    }
    return sendWsScreenshotRequest<RenderResult2<T>>(socket, options)
  }

  socket.on('close', () => {
    index > 0 && unregisterRender(index)
    socket.removeAllListeners()
    socket.close()
  })

  socket.on('message', (event) => {
    const raw = event.toString()
    const { type, status, echo, data } = JSON.parse(raw) || {}
    logger.debug(`[WebSocket] ${echo} ${type} ${status}`)
    logger.trace(`[WebSocket] ${echo} ${raw}`)

    if (type !== 'response') {
      logger.error(`[WebSocket] 未知的请求: ${raw}`)
      return
    }

    const key = createWsResponseKey(echo)
    listeners.emit(key, { status, data })
  })

  index = registerRender('@karinjs/puppeteer-server', render)
}

/**
 * @description 初始化WebSocketPuppeteerServer
 */
export const initWebSocketPuppeteerServer = () => {
  listeners.on(WS_CONNECTION_PUPPETEER_2, (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    call()
    WebSocketPuppeteerServer(socket, request)
  })
}
