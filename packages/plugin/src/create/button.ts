/**
 * Button DSL
 * @module create/button
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { ButtonCallback, ButtonOptions } from '../types'

/**
 * Button 实例
 */
export interface ButtonInstance {
  /** 按钮 ID */
  id: string
  /** 回调函数 */
  callback: ButtonCallback
  /** 选项 */
  options: ButtonOptions
}

/**
 * 创建按钮处理器
 * @param id 按钮 ID
 * @param callback 回调函数
 * @param options 选项
 * @returns 注册 ID
 */
export function button (
  id: string,
  callback: ButtonCallback,
  options: Partial<ButtonOptions> = {}
): string {
  // 参数验证
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('[button] id must be a non-empty string')
  }
  if (typeof callback !== 'function') {
    throw new Error('[button] callback must be a function')
  }

  const ctx = getContext()

  const instance: ButtonInstance = {
    id,
    callback,
    options: {
      id,
      priority: typeof options?.priority === 'number' && Number.isFinite(options.priority)
        ? options.priority
        : 0,
    },
  }

  return registry.register('button', instance, ctx.pkg, ctx.file, {
    priority: options?.priority,
    metadata: { id },
  })
}

/**
 * 带选项的创建方式
 */
button.create = (options: ButtonOptions) => {
  // 参数验证
  if (!options || typeof options !== 'object') {
    throw new Error('[button.create] options must be an object')
  }
  return (callback: ButtonCallback) => {
    return button(options.id, callback, options)
  }
}
