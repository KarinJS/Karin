/**
 * Accept DSL
 * @module create/accept
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { AcceptCallback, AcceptOptions } from '../types'

/**
 * Accept 实例
 */
export interface AcceptInstance {
  /** 事件类型 */
  event: string
  /** 回调函数 */
  callback: AcceptCallback
  /** 选项 */
  options: AcceptOptions
}

/**
 * 创建事件接收器
 * @param event 事件类型
 * @param callback 回调函数
 * @param options 选项
 * @returns 注册 ID
 */
export function accept (
  event: string,
  callback: AcceptCallback,
  options: Partial<AcceptOptions> = {}
): string {
  // 参数验证
  if (typeof event !== 'string' || !event.trim()) {
    throw new Error('[accept] event must be a non-empty string')
  }
  if (typeof callback !== 'function') {
    throw new Error('[accept] callback must be a function')
  }

  const ctx = getContext()

  const instance: AcceptInstance = {
    event,
    callback,
    options: {
      event,
      priority: typeof options?.priority === 'number' && Number.isFinite(options.priority)
        ? options.priority
        : 0,
    },
  }

  return registry.register('accept', instance, ctx.pkg, ctx.file, {
    priority: options?.priority,
    metadata: { event },
  })
}

/**
 * 带选项的创建方式
 */
accept.create = (options: AcceptOptions) => {
  // 参数验证
  if (!options || typeof options !== 'object') {
    throw new Error('[accept.create] options must be an object')
  }
  return (callback: AcceptCallback) => {
    return accept(options.event, callback, options)
  }
}
