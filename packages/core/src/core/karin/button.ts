import { createFile, createPkg } from '@/plugin/tools'
import type { Button } from '@/types/plugin'

export interface ButtonOptions {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
  /**
   * 插件优先级 数字越小优先级越高
   * @default 10000
   */
  priority?: Button['priority']
  /** 优先级 默认`10000` */
  rank?: Button['priority']
}

/**
 * 按钮
 * @param reg - 正则表达式
 * @param fnc - 函数
 */
export const button = (
  reg: RegExp | string,
  fnc: Button['fnc'],
  options: ButtonOptions = {}
): Button => {
  const rank = Number(options.rank ?? options.priority)
  return {
    fnc,
    reg: reg instanceof RegExp ? reg : new RegExp(reg),
    rank: isNaN(rank) ? 10000 : rank,
    file: createFile('button', options.name || 'button'),
    pkg: createPkg(),
    priority: rank ?? 10000,
  }
}
