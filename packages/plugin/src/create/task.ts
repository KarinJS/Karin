/**
 * Task DSL
 * @module create/task
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { TaskCallback, TaskOptions } from '../types'

/**
 * Task 实例
 */
export interface TaskInstance {
  /** Cron 表达式 */
  cron: string
  /** 回调函数 */
  callback: TaskCallback
  /** 选项 */
  options: TaskOptions
  /** 定时器引用（内部使用） */
  timer?: NodeJS.Timeout
}

/**
 * 创建定时任务
 * @param cron Cron 表达式
 * @param callback 回调函数
 * @param options 选项
 * @returns 注册 ID
 */
export function task (
  cron: string,
  callback: TaskCallback,
  options: Partial<TaskOptions> = {}
): string {
  // 参数验证
  if (typeof cron !== 'string' || !cron.trim()) {
    throw new Error('[task] cron must be a non-empty string')
  }
  if (typeof callback !== 'function') {
    throw new Error('[task] callback must be a function')
  }

  const ctx = getContext()

  const instance: TaskInstance = {
    cron,
    callback,
    options: {
      cron,
      name: typeof options?.name === 'string' ? options.name : undefined,
      immediate: Boolean(options?.immediate),
    },
  }

  // TODO: 实际的 cron 调度逻辑

  return registry.register('task', instance, ctx.pkg, ctx.file, {
    metadata: { cron, name: options?.name },
  })
}

/**
 * 带选项的创建方式
 */
task.create = (options: TaskOptions) => {
  // 参数验证
  if (!options || typeof options !== 'object') {
    throw new Error('[task.create] options must be an object')
  }
  return (callback: TaskCallback) => {
    return task(options.cron, callback, options)
  }
}
