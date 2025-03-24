import { listeners } from '@/core/internal'
import { createWsResponseKey } from './key'

import type { Options2 } from '@/adapter/render/admin/types'
import type { WebSocket } from 'ws'

/** 索引 */
let index = 0

/**
 * 创建请求错误
 * @param options 请求选项
 * @param errorType 错误类型
 * @param cause 错误原因
 * @returns Error实例
 */
const createRequestError = (
  options: string,
  errorType: string,
  cause?: any
): Error => {
  return new Error(
    '[sendRequest] 请求错误:\n' +
    `  options: ${options}\n` +
    `  error: ${errorType}`,
    { cause }
  )
}

/**
 * 发送ws请求
 * @description 开启监听响应 你需要自己往`listeners` `emit` 响应事件
 * @param socket WebSocket
 * @param data 发送的结构体
 * @param options 请求参数
 * @returns 响应数据
 * ```ts
 * import { listeners } from '@/core/internal'
 * import { createWsResponseKey } from './key'
 *
 * const { echo, data } = result
 * const key = createWsResponseKey(echo)
 * listeners.emit(key, data)
 * ```
 */
export const sendWsRequest = <T, R = void> (
  socket: WebSocket,
  data: T,
  options: {
    /** 监听响应 */
    onRequest?: boolean
    /** 监听响应超时时间 */
    timeout?: number
  } = { timeout: 60 * 1000, onRequest: true }
): Promise<R> => {
  return new Promise((resolve, reject) => {
    /** 超时时间 */
    const timeout = options?.timeout ?? 60 * 1000

    /** 检查WebSocket连接状态 */
    if (socket.readyState !== socket.OPEN) {
      return reject(createRequestError(
        JSON.stringify(data),
        `WebSocket未连接，当前状态: ${socket.readyState}`
      ))
    }

    if (options.onRequest) {
      /** 递增并检查索引是否需要重置 */
      if (index >= Number.MAX_SAFE_INTEGER) {
        index = 0
      }

      const echo = (++index).toString()
      const key = createWsResponseKey(echo)
      const str = JSON.stringify({ ...data, echo })

      /**
       * 监听响应函数
       * @param data 响应数据
       */
      const result = (data: any) => {
        clearTimeout(timer)
        if (data?.status === 'ok') {
          return resolve(data.data)
        }

        reject(createRequestError(str, '请求失败', data))
      }

      /**
       * 超时函数
       */
      const timer = setTimeout(() => {
        listeners.off(key, result)
        reject(createRequestError(str, `请求超时 ${timeout}ms`))
      }, timeout)

      listeners.once(key, result)

      try {
        socket.send(str)
      } catch (error) {
        clearTimeout(timer)
        listeners.off(key, result)
        reject(createRequestError(str, '发送失败', error))
      }

      return
    }

    try {
      socket.send(JSON.stringify(data))
      resolve(undefined as R)
    } catch (error) {
      reject(createRequestError(JSON.stringify(data), '发送失败', error))
    }
  })
}

/**
 * puppeteer-server 发送截图请求
 * @param socket WebSocket
 * @param params 发送的结构体
 * @param timeout 请求超时时间
 * @returns 响应数据
 */
export const sendWsScreenshotRequest = <R> (
  socket: WebSocket,
  params: Options2,
  timeout: number = 60 * 1000
): Promise<R> => {
  return sendWsRequest(
    socket,
    {
      params,
      type: 'request',
      action: params.data ? 'render' : 'screenshot',
    },
    {
      onRequest: true,
      timeout,
    })
}

/**
 * puppeteer-server 发送鉴权失败请求
 * @param socket WebSocket
 * @param message 鉴权失败消息
 */
export const sendWsAuthFailedRequest = (
  socket: WebSocket,
  message: string
) => {
  const data = {
    type: 'request',
    action: 'auth',
    params: {
      status: 'failed',
      message,
    },
  }

  return sendWsRequest(socket, data, { onRequest: false })
}
