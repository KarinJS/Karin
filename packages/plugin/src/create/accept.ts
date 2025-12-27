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
  const ctx = getContext()

  const instance: AcceptInstance = {
    event,
    callback,
    options: {
      event,
      priority: options.priority ?? 0,
    },
  }

  return registry.register('accept', instance, ctx.pkg, ctx.file, {
    priority: options.priority,
    metadata: { event },
  })
}

/**
 * 带选项的创建方式
 */
accept.create = (options: AcceptOptions) => {
  return (callback: AcceptCallback) => {
    return accept(options.event, callback, options)
  }
}
