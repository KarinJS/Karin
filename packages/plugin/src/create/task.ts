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
  const ctx = getContext()

  const instance: TaskInstance = {
    cron,
    callback,
    options: {
      cron,
      name: options.name,
      immediate: options.immediate ?? false,
    },
  }

  // TODO: 实际的 cron 调度逻辑

  return registry.register('task', instance, ctx.pkg, ctx.file, {
    metadata: { cron, name: options.name },
  })
}

/**
 * 带选项的创建方式
 */
task.create = (options: TaskOptions) => {
  return (callback: TaskCallback) => {
    return task(options.cron, callback, options)
  }
}
