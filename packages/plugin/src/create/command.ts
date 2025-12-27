/**
 * Command DSL - 极简版
 * @module create/command
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { CommandCallback, CommandOptions } from '../types'

export interface CommandInstance {
  rule: RegExp
  callback: CommandCallback
  options: CommandOptions
}

const toRegex = (r: string | RegExp): RegExp => {
  if (r instanceof RegExp) return r
  try { return new RegExp(r) }
  catch { return new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }
}

export function command (
  rule: string | RegExp,
  callback: CommandCallback,
  opts: Partial<CommandOptions> = {}
): string {
  const ctx = getContext()
  const regex = toRegex(rule)
  const instance: CommandInstance = {
    rule: regex,
    callback,
    options: { rule: regex.source, priority: opts.priority ?? 0, permission: opts.permission, desc: opts.desc },
  }
  return registry.register('command', instance, ctx.pkg, ctx.file, {
    priority: opts.priority,
    metadata: { rule: regex.source, desc: opts.desc },
  })
}

command.create = (opts: CommandOptions) => (cb: CommandCallback) => command(opts.rule, cb, opts)
