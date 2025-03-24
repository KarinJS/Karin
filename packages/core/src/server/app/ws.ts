import { server } from './app'
import { WebSocketServer, type WebSocket } from 'ws'
import { listeners } from '@/core/internal'
import { getRenderCfg } from '@/utils/config'
import {
  WS_CLOSE,
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
  WS_CONNECTION_PUPPETEER_2,
  WS_CONNECTION_SANDBOX,
  WS_CONNECTION_TERMINAL,
} from '@/utils/fs/key'
import type { IncomingMessage } from 'node:http'

/** ws 服务 */
export const wss: WebSocketServer = new WebSocketServer({ server })

/**
 * 发送ws连接 如果5秒内无函数影响 则主动断开连接
 * @param key 事件名
 * @param socket 连接
 * @param request 请求
 */
export const emitEvent = (
  key: string,
  socket: WebSocket,
  request: IncomingMessage
) => {
  /** 是否关闭 */
  let isClose = true
  /** 回调 调用后代表有函数接管 */
  const call = () => {
    isClose = false
    timer && clearTimeout(timer)
  }

  /** 定时器 3秒后自动断开连接 */
  const timer = setTimeout(() => {
    if (!isClose) return
    socket.close()
    logger.warn(
      '[WebSocket] 链接无函数接管 已自动断开' +
      `ip: ${request.socket.remoteAddress}\n` +
      `host: ${request.headers.host}${request.url}\n` +
      `headers: ${JSON.stringify(request.headers, null, 2)}`
    )
  }, 3000)

  listeners.emit(key, socket, request, call)
}

wss.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.fatal(`[server] 端口 ${process.env.HTTP_PORT} 已被占用，无法启动 http WebSocket 服务`)
  } else {
    logger.fatal(`[server] http服务启动失败: ${error.message}`)
  }

  throw error
})

/** 监听 ws 连接 */
wss.on('connection', (socket, request) => {
  logger.mark(`[WebSocket] ${logger.green('connection')}:\n` +
    `ip: ${request.socket.remoteAddress}\n` +
    `host: ${request.headers.host}${request.url}\n` +
    `headers: ${JSON.stringify(request.headers, null, 2)}`
  )

  if (
    request.url === '/' ||
    request.url === '/onebot/v11/ws' ||
    request.url === '/onebot/v11/ws/'
  ) {
    emitEvent(WS_CONNECTION_ONEBOT, socket, request)

    socket.on('close', (code, reason) => {
      listeners.emit(WS_CLOSE_ONEBOT, socket, request, code, reason)
    })

    return
  }

  if (request.url === '/puppeteer') {
    const cfg = getRenderCfg()
    if (!cfg.ws_server.enable) {
      logger.warn('[WebSocket] puppeteerServer 未启用')
      socket.close()
      return
    }

    /**
     * 2.0 puppeteer
     * 客户端名称: @karinjs/puppeteer-server
     */
    if (request.headers['x-client-name'] === '@karinjs/puppeteer-server') {
      emitEvent(WS_CONNECTION_PUPPETEER_2, socket, request)
    } else {
      emitEvent(WS_CONNECTION_PUPPETEER, socket, request)
    }

    socket.once('close', (code, reason) => {
      listeners.emit(WS_CLOSE_PUPPETEER, socket, request, code, reason)
    })

    return
  }

  if (request.url?.startsWith('/terminal/create')) {
    emitEvent(WS_CONNECTION_TERMINAL, socket, request)
    return
  }

  if (request.url?.startsWith('/sandbox')) {
    emitEvent(WS_CONNECTION_SANDBOX, socket, request)

    // socket.once('close', (code, reason) => {
    //   listeners.emit(WS_CLOSE_SANDBOX, socket, request, code, reason)
    // })

    return
  }

  emitEvent(WS_CONNECTION, socket, request)
  socket.on('close', (code, reason) => {
    listeners.emit(WS_CLOSE, socket, request, code, reason)
  })
})
