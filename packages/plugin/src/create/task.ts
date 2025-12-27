/**
 * Task DSL - 极简版
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { TaskCallback, TaskOptions } from '../types'

export interface TaskInstance {
  cron: string
  callback: TaskCallback
  options: TaskOptions
  timer?: NodeJS.Timeout
}

export function task (cron: string, callback: TaskCallback, opts: Partial<TaskOptions> = {}): string {
  const ctx = getContext()
  const instance: TaskInstance = {
    cron,
    callback,
    options: { cron, name: opts.name, immediate: opts.immediate ?? false },
  }
  return registry.register('task', instance, ctx.pkg, ctx.file, { metadata: { cron, name: opts.name } })
}

task.create = (opts: TaskOptions) => (cb: TaskCallback) => task(opts.cron, cb, opts)
