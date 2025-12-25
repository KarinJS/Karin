import { createFile, createLogger, createPkg } from '@/plugin/tools'
import type { Task } from '@/types/plugin'

export interface TaskOptions {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
  /**
   * 任务执行策略
   * - `default`: 默认策略，允许并发执行，即不检查上一次任务是否完成
   * - `skip`: 跳过策略，如果上一次任务未完成，则直接跳过本次执行
   */
  type?: 'default' | 'skip'
}

/**
 * 构建定时任务
 * @param name 任务名称
 * @param cron cron表达式
 * @param fnc 执行函数
 * @param options 选项
 */
export const task = (
  name: string,
  cron: string,
  fnc: Function,
  options: TaskOptions = {}
): Task => {
  if (!name) throw new Error('[task]: 缺少参数[name]')
  if (!cron) throw new Error('[task]: 缺少参数[cron]')
  if (!fnc || typeof fnc !== 'function') throw new Error('[task]: 缺少参数或类型错误[fnc]')

  return {
    name,
    cron,
    fnc,
    log: createLogger(options.log, false),
    schedule: undefined,
    file: createFile('task', options.name || 'task'),
    pkg: createPkg(),
    type: options.type || 'default',
    running: false,
  }
}
