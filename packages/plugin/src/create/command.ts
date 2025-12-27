/**
 * Command DSL
 * @module create/command
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { CommandCallback, CommandOptions } from '../types'

/**
 * Command 实例
 */
export interface CommandInstance {
  /** 规则 */
  rule: RegExp
  /** 回调函数 */
  callback: CommandCallback
  /** 选项 */
  options: CommandOptions
}

/**
 * 创建命令
 * @param rule 匹配规则（字符串或正则）
 * @param callback 回调函数
 * @param options 选项
 * @returns 注册 ID
 */
export function command (
  rule: string | RegExp,
  callback: CommandCallback,
  options: Partial<CommandOptions> = {}
): string {
  const ctx = getContext()
  const ruleRegex = typeof rule === 'string' ? new RegExp(rule) : rule

  const instance: CommandInstance = {
    rule: ruleRegex,
    callback,
    options: {
      rule: ruleRegex.source,
      priority: options.priority ?? 0,
      permission: options.permission,
      desc: options.desc,
    },
  }

  return registry.register('command', instance, ctx.pkg, ctx.file, {
    priority: options.priority,
    metadata: { rule: ruleRegex.source, desc: options.desc },
  })
}

/**
 * 带选项的创建方式
 */
command.create = (options: CommandOptions) => {
  return (callback: CommandCallback) => {
    return command(options.rule, callback, options)
  }
}
