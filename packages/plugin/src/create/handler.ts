/**
 * Handler DSL
 * @module create/handler
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { HandlerCallback, HandlerOptions } from '../types'

/**
 * Handler 实例
 */
export interface HandlerInstance {
  /** 处理器键名 */
  key: string
  /** 回调函数 */
  callback: HandlerCallback
  /** 选项 */
  options: HandlerOptions
}

/**
 * 创建处理器
 * @param key 处理器键名
 * @param callback 回调函数
 * @param options 选项
 * @returns 注册 ID
 */
export function handler (
  key: string,
  callback: HandlerCallback,
  options: Partial<HandlerOptions> = {}
): string {
  const ctx = getContext()

  const instance: HandlerInstance = {
    key,
    callback,
    options: {
      key,
      priority: options.priority ?? 0,
    },
  }

  return registry.register('handler', instance, ctx.pkg, ctx.file, {
    priority: options.priority,
    metadata: { key },
  })
}

/**
 * 带选项的创建方式
 */
handler.create = (options: HandlerOptions) => {
  return (callback: HandlerCallback) => {
    return handler(options.key, callback, options)
  }
}
