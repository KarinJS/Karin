import { EventEmitter } from '@karinjs/events'

import type { IncomingMessage } from 'node:http'
import type { WebSocket } from 'ws'
import type { Event } from '@karinjs/adapter'
import type {
  WS_CLOSE,
  WS_CONNECTION,
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_SNAPKA,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
  WS_CONNECTION_TERMINAL,
} from '@karinjs/envs'

/** 回调处理器 代表链接已被函数接收 5秒内如果这个回调没有触发 说明此ws链接无效 */
export type CallbackHandler = () => void

export interface SystemEventMap {
  /** 错误事件 */
  error: unknown[]
  /** ws:close 事件 */
  [WS_CLOSE]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:onebot 事件 */
  [WS_CLOSE_ONEBOT]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:puppeteer 事件 */
  [WS_CLOSE_PUPPETEER]: [WebSocket, IncomingMessage, number, Buffer]

  /** ws:connection 事件 */
  [WS_CONNECTION]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:snapka 连接事件 */
  [WS_CONNECTION_SNAPKA]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:terminal 事件 */
  [WS_CONNECTION_TERMINAL]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:onebot 事件 */
  [WS_CONNECTION_ONEBOT]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:puppeteer 事件 */
  [WS_CONNECTION_PUPPETEER]: [WebSocket, IncomingMessage, CallbackHandler]
  /** 上下文事件 */
  [key: `ctx:${string}`]: [Event]
}

/**
 * 事件管理器
 */
export const emitter = new EventEmitter<SystemEventMap>()

/**
 * 内部事件管理器
 */
export const internalEmitter = emitter.createEvent()

export * from './status_listener'
