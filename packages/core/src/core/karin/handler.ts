import { createFile, createPkg } from '@/plugin/tools'
import type { Handler } from '@/types/plugin'

export interface HandlerOptions {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
  /** 优先级 默认`10000` */
  rank?: Handler['priority']
  /** 优先级 默认`10000` */
  priority?: Handler['priority']
}

/**
 * - 构建handler
 * @param key - 事件key
 * @param fnc - 函数实现
 * @param options - 选项
 */
export const handler = (key: string, fnc: Handler['fnc'], options: HandlerOptions = {}): Handler => {
  if (!key) throw new Error('[handler]: 缺少参数[key]')
  if (!fnc) throw new Error('[handler]: 缺少参数[fnc]')

  return {
    key,
    fnc,
    priority: Number(options.rank ?? options.priority) || 10000,
    file: createFile('handler', options.name || 'handler'),
    pkg: createPkg(),
  }
}
