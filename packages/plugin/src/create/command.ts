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
  // 参数验证
  if (typeof callback !== 'function') {
    throw new Error('[command] callback must be a function')
  }
  if (rule === null || rule === undefined) {
    throw new Error('[command] rule must be a string or RegExp')
  }

  const ctx = getContext()

  let ruleRegex: RegExp
  if (typeof rule === 'string') {
    try {
      ruleRegex = new RegExp(rule)
    } catch {
      // 无效的正则表达式字符串，转义后再试
      ruleRegex = new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    }
  } else if (rule instanceof RegExp) {
    ruleRegex = rule
  } else {
    // 尝试转换为字符串
    try {
      ruleRegex = new RegExp(String(rule))
    } catch {
      ruleRegex = new RegExp(String(rule).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    }
  }

  const instance: CommandInstance = {
    rule: ruleRegex,
    callback,
    options: {
      rule: ruleRegex.source,
      priority: typeof options?.priority === 'number' && Number.isFinite(options.priority)
        ? options.priority
        : 0,
      permission: options?.permission,
      desc: options?.desc,
    },
  }

  return registry.register('command', instance, ctx.pkg, ctx.file, {
    priority: options?.priority,
    metadata: { rule: ruleRegex.source, desc: options?.desc },
  })
}

/**
 * 带选项的创建方式
 */
command.create = (options: CommandOptions) => {
  // 参数验证
  if (!options || typeof options !== 'object') {
    throw new Error('[command.create] options must be an object')
  }
  return (callback: CommandCallback) => {
    return command(options.rule, callback, options)
  }
}
