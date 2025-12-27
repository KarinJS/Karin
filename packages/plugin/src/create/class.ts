/**
 * 类式插件 - 极简版
 * @module create/class
 */

import { BuilderBase } from './base'
import type { PluginType } from '../types'

export interface RuleItemBase {
  name: string
  reg: string | RegExp
  priority?: number
  permission?: string
  log?: boolean
}

export interface PluginRuleItem extends RuleItemBase {
  event?: string
  fnc: string | ((...args: any[]) => any)
}

export interface PluginOptions {
  name: string
  desc?: string
  event?: string
  priority?: number
  rule: PluginRuleItem[]
}

export interface FormattedRuleItem {
  name: string
  event: string
  reg: RegExp
  fnc: string | ((...args: any[]) => any)
  priority: number
  permission: string
  log: boolean
}

const toReg = (r: string | RegExp): RegExp => (r instanceof RegExp ? r : new RegExp(r))

const formatRule = (r: PluginRuleItem, event: string, pri: number): FormattedRuleItem => ({
  name: r.name,
  event: r.event || event,
  reg: toReg(r.reg),
  fnc: r.fnc,
  priority: r.priority ?? pri,
  permission: r.permission || 'all',
  log: r.log ?? true,
})

export abstract class Plugin<E = any> {
  options: PluginOptions
  e!: E
  next!: () => unknown
  reply!: (content: any) => Promise<any>

  constructor (options: PluginOptions) { this.options = options }
  async init?(): Promise<void>

  async replyForward (element: any) {
    const e = this.e as any
    if (e?.bot?.sendForwardMsg) {
      const r = await e.bot.sendForwardMsg(e.contact, element)
      return { ...r, message_id: r?.messageId }
    }
    throw new Error('replyForward not supported')
  }
}

export class CreateClassPlugin extends BuilderBase {
  private _name: string
  private _priority: number
  private _reg: RegExp
  private _callback: (...args: any[]) => any
  private _options: FormattedRuleItem
  private _PluginClass: new () => Plugin

  constructor (Cls: new () => Plugin, rule: FormattedRuleItem, pkg: string, path: string) {
    super()
    this._PluginClass = Cls
    this._options = rule
    this._name = rule.name
    this._priority = rule.priority
    this._reg = rule.reg
    this.setPackageName(pkg)
    this.setCallerPath(path)
    this._callback = this.createCallback(rule)
    this.setLog(rule.log)
  }

  get type (): PluginType { return 'command' }
  get name () { return this._name }
  get priority () { return this._priority }
  get reg () { return this._reg }
  get callback () { return this._callback }
  get options () { return this._options }

  private createCallback (rule: FormattedRuleItem) {
    const Cls = this._PluginClass
    return async (ctx: any, next: () => void) => {
      const inst = new Cls()
      inst.e = ctx
      inst.next = next
      inst.reply = ctx.reply?.bind(ctx) || (async () => { })

      const fn = typeof rule.fnc === 'function' ? rule.fnc : (inst as any)[rule.fnc]
      if (typeof fn === 'function') return fn.call(inst, ctx, next)
      console.error(`Method not found: ${rule.fnc}`)
      return next()
    }
  }

  setReg (r: string | RegExp) { this._reg = this._options.reg = toReg(r) }
  setPriority (p: number) { this._priority = this._options.priority = p }
}

export async function registerClassPlugin (
  Cls: new () => Plugin,
  pkg: string,
  path: string
): Promise<CreateClassPlugin[]> {
  const inst = new Cls()
  if (!inst.options?.name || !inst.options?.rule) return []
  if (inst.init) await inst.init()

  const event = inst.options.event || 'message'
  const pri = inst.options.priority ?? 10000

  return inst.options.rule.map(r => new CreateClassPlugin(Cls, formatRule(r, event, pri), pkg, path))
}

export async function registerModuleClassPlugins (
  mod: Record<string, unknown>,
  pkg: string,
  path: string
): Promise<CreateClassPlugin[]> {
  const results: CreateClassPlugin[] = []
  for (const [k, v] of Object.entries(mod)) {
    if (k === 'default' || typeof v !== 'function' || !v.prototype) continue
    try {
      results.push(...await registerClassPlugin(v as new () => Plugin, pkg, path))
    } catch (e) {
      console.error(`Failed register ${k}:`, e)
    }
  }
  return results
}

export type { PluginOptions as ClassPluginOptions }
