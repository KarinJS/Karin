import { formatReg } from './options'
import { pluginCache } from '../cache'
import { createHash } from 'node:crypto'
import { BuilderBase } from '../create/base'
import { types, isClass } from '@karinjs/utils'
import type { PackageMetaInfoCache } from '../cache'
import type { EventTypes, MessageCallback } from './command'
import type { Message, MessageEventMap, Permission, AdapterProtocol } from '@karinjs/adapter'

/**
 * 规则基础配置
 */
export interface RuleItemBase {
  /** 插件名称 */
  name: string
  /** 命令正则 */
  reg: string | RegExp
  /** 优先级 默认为10000 */
  priority?: number
  /** 插件触发权限 例如只有主人才可触发 */
  permission?: Permission
  /** 打印日志 默认为true */
  log?: boolean
  /** 生效的适配器 */
  adapter?: AdapterProtocol[]
  /** 禁用的适配器 */
  dsbAdapter?: AdapterProtocol[]
  /**
   * 如果无权触发插件时的提示行为
   * - `true`: 显示默认提示 `权限不足，仅管理员可操作`
   * - `false`: 不显示任何提示（默认）
   * - `string`: 自定义提示文本
   * - @default `false`
   *
   * @description 在 2.0 版本之后，默认值将为 `false`，即默认不触发任何回复
   *
   * @example
   * ```ts
   * // 显示默认提示
   * { authFailMsg: true }
   *
   * // 不显示提示（默认行为）
   * { authFailMsg: false }
   * // 或
   * { } // 不指定，默认为 false
   *
   * // 自定义提示
   * { authFailMsg: '权限不足，请联系管理员' }
   * ```
   */
  authFailMsg?: boolean | string
}

/**
 * 插件规则项
 * @template T 事件类型
 */
export type PluginRuleItem<T extends keyof MessageEventMap = never> = T extends never
  ? RuleItemBase & {
    /** 事件类型 */
    event?: never
    /** 处理函数（方法名或函数） */
    fnc: MessageCallback<'message'> | string
  }
  : RuleItemBase & {
    /** 事件类型 */
    event?: T
    /** 处理函数（方法名或函数） */
    fnc: MessageCallback<T> | string
  }

/**
 * 插件配置类型
 */
export type PluginOptions = {
  [K in keyof MessageEventMap]: {
    /** 插件名称 */
    name: string
    /** 插件描述 */
    desc?: string
    /** 插件父事件 */
    event?: K
    /** 优先级 */
    priority?: number
    /** 指令规则 */
    rule: Array<
      | PluginRuleItem<K>
      | { [P in keyof MessageEventMap]: PluginRuleItem<P> & { event: P } }[keyof MessageEventMap]
    >
  }
}[keyof MessageEventMap]

/**
 * 格式化后的插件选项类型
 */
export interface FormatPluginOptions {
  name: string
  desc: string
  event: keyof MessageEventMap
  priority: number
  rule: Array<Required<Omit<RuleItemBase, 'reg'>> & {
    event: keyof MessageEventMap
    reg: RegExp
    fnc: MessageCallback<keyof MessageEventMap> | string
  }>
}

/**
 * 原始配置信息接口
 */
export interface OriginOptions {
  id: string
  meta: PackageMetaInfoCache
  options: FormatPluginOptions
  callerPath: string
  PluginClass: new () => Plugin
}

/**
 * 类插件
 * @template T 事件类型
 * @class Plugin
 * @description 此方法性能劣于函数式插件
 */
export abstract class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
  /** 插件配置 */
  options: PluginOptions
  /** 消息事件对象 */
  e!: T extends keyof MessageEventMap ? MessageEventMap[T] : Message
  /** 调用后将继续匹配下一个插件 */
  next!: () => unknown
  /** 快速回复 */
  reply!: Message['reply']

  constructor (options: PluginOptions) {
    this.options = options
  }

  /**
   * 快速回复合并转发
   * @param element 合并转发消息元素节点
   */
  async replyForward (element: Parameters<Message['bot']['sendForwardMsg']>[1]) {
    const result = await this.e.bot.sendForwardMsg(this.e.contact, element)
    return {
      ...result,
      /**
       * @description 同messageId
       */
      message_id: result.messageId,
    }
  }
}

export class CreateClassPlugin extends BuilderBase {
  #origin: OriginOptions
  #options: FormatPluginOptions['rule'][number]
  #callback: MessageCallback<keyof MessageEventMap>
  constructor (
    origin: OriginOptions,
    rule: FormatPluginOptions['rule'][number]
  ) {
    super()
    this.#origin = origin
    this.#options = { ...rule }
    this.#callback = CreateClassPlugin.callback(origin, rule)
    this.setLog(this.#options.log, true)
  }

  /**
   * 标准化回调函数
   * @param origin 原始配置信息
   * @param rule 规则项
   * @returns 标准化后的回调函数
   */
  static callback (
    origin: OriginOptions,
    rule: FormatPluginOptions['rule'][number]
  ): MessageCallback<keyof MessageEventMap> {
    return async (ctx: Message, next: () => void) => {
      const instance = new origin.PluginClass()
      instance.e = ctx
      instance.next = next
      instance.reply = ctx.reply.bind(ctx)

      if (typeof rule.fnc === 'function') {
        return rule.fnc.call(instance, ctx, next)
      }

      if (typeof rule.fnc !== 'string') {
        throw new Error(`Invalid function type: ${typeof rule.fnc}`)
      }

      if (!isMethodExist(instance, rule.fnc)) {
        logger.fatal(`[${origin.meta.name}] 类插件 ${origin.PluginClass.name} 中不存在方法 ${rule.fnc}`)
        return next()
      }

      return instance[rule.fnc](ctx, next)
    }
  }

  /**
   * 标准化命令选项
   * @param origin 原始选项
   * @param rule 规则项
   * @returns 返回命令选项
   */
  static options (
    origin: OriginOptions,
    rule: PluginOptions['rule'][number]
  ): FormatPluginOptions['rule'][number] {
    return {
      event: types.string(rule.event, origin.options.event),
      reg: formatReg(rule.reg),
      fnc: rule.fnc as MessageCallback<keyof MessageEventMap> | string,
      name: types.string(rule.name, origin.options.name),
      priority: types.number(rule.priority, types.number(origin.options.priority, 10000)),
      permission: types.string(rule.permission, 'all'),
      log: types.bool(rule.log, true),
      adapter: types.array(rule.adapter, []),
      dsbAdapter: types.array(rule.dsbAdapter, []),
      authFailMsg: rule.authFailMsg ?? false,
    }
  }

  get type () {
    return 'classPlugin' as const
  }

  get packageName () {
    return this.#origin.meta.name
  }

  get callerPath () {
    return this.#origin.callerPath
  }

  /**
   * 当前app名称
   */
  get name (): string {
    return this.#options.name
  }

  /**
   * 优先级
   */
  get priority (): number {
    return this.#options.priority
  }

  /**
   * 插件消息匹配正则
   * @returns 返回插件消息匹配正则
   */
  get reg (): RegExp {
    /** 这里重新赋值是防止lastIndex错误 */
    const r = this.#options.reg
    return r
  }

  /**
   * 插件回调函数
   * @returns 返回插件回调函数
   */
  get callback (): MessageCallback<keyof MessageEventMap> {
    return this.#callback
  }

  /**
   * 插件选项
   * @returns 返回插件选项
   */
  get options (): FormatPluginOptions['rule'][number] {
    return this.#options
  }

  /**
   * 原始配置信息
   */
  get origin (): OriginOptions {
    return this.#origin
  }

  /**
   * 更新消息匹配正则
   * @param reg 消息匹配正则
   */
  setReg (reg: string | RegExp) {
    this.#options.reg = formatReg(reg)
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   * @example
   * ```ts
   * plugin.setCallback('methodName')
   * plugin.setCallback(async (ctx, next) => { ... })
   *
   * // 泛型
   * plugin.setCallback<'message'>(async (ctx, next) => { ... })
   * ```
   */
  setCallback<T extends EventTypes = EventTypes> (callback: MessageCallback<T> | string) {
    const fnc = callback as FormatPluginOptions['rule'][number]['fnc']
    this.#callback = CreateClassPlugin.callback(this.#origin, { ...this.#options, fnc })
  }

  /**
   * 更新选项
   * @param options 命令选项
   * @description 这里不允许更新回调函数 请使用 `setCallback` 方法
   */
  setOptions (options: PluginOptions['rule'][number]) {
    const opt = CreateClassPlugin.options(this.#origin, { ...options, fnc: this.#options.fnc })
    /** 标记脏数据 */
    if (opt.priority !== this.#options.priority) {
      pluginCache.instances.markAsUnsorted('command')
    }

    this.#options = opt
  }
}

/**
 * 类型守卫：检查实例是否包含指定的方法
 * @param instance 插件实例
 * @param methodName 方法名
 * @returns 如果方法存在则返回 true，并收窄类型
 */
const isMethodExist = <T extends Record<PropertyKey, any>, K extends PropertyKey> (
  instance: T,
  methodName: K
): instance is T & Record<K, Function> => {
  return methodName in instance && typeof instance[methodName] === 'function'
}

/**
 * 生成类插件父类唯一ID
 * @param meta 插件包元信息
 * @param callerPath 当前模块所属文件绝对路径
 * @param PluginClassName 插件类名称
 * @param ruleCount 规则数量
 * @returns 返回唯一ID
 */
const generateClassPluginId = (
  meta: PackageMetaInfoCache,
  callerPath: string,
  PluginClassName: string,
  ruleCount: number
): string => {
  const src = `${meta.name}:${callerPath}:${PluginClassName}:${ruleCount}:${Date.now()}`
  return createHash('md5').update(src).digest('hex')
}

/**
 * 格式化插件规则集
 * @param instanceOptions 插件实例的选项配置
 * @returns 返回格式化后的插件选项（不包含 rule）
 */
const formatRule = (
  instanceOptions: PluginOptions
): FormatPluginOptions => {
  const defaultEvent = types.string<keyof MessageEventMap>(instanceOptions.event, 'message')
  return {
    name: instanceOptions.name,
    desc: types.string(instanceOptions.desc, ''),
    event: defaultEvent,
    priority: types.number(instanceOptions.priority, 10000),
    rule: [],
  }
}

/**
 * 注册类插件
 * @param meta 插件包元信息
 * @param callerPath 当前模块所属文件绝对路径
 * @param PluginClass 插件类构造函数
 */
const register = async (
  meta: PackageMetaInfoCache,
  callerPath: string,
  PluginClass: unknown
) => {
  if (!isClass<Plugin>(PluginClass)) {
    return null
  }

  /** new PluginClass */
  const instance = new PluginClass()
  if (!instance.options || typeof instance.options !== 'object' || !instance.options.name) {
    pluginCache.logger.error(`[${meta.name}] 插件类 ${PluginClass.name} 缺少有效的 options 配置`)
    return null
  }

  const options = formatRule(instance.options)
  const id = generateClassPluginId(meta, callerPath, PluginClass.name, instance.options.rule.length)

  /** 如果存在init方法 执行 */
  if ('init' in instance && typeof instance.init === 'function') {
    await instance.init()
  }

  /** 父类信息 */
  const origin = {
    id,
    meta,
    options,
    callerPath,
    PluginClass,
  }

  options.rule = instance.options.rule.map((item) => {
    const rule = CreateClassPlugin.options(origin, item)

    const result = new CreateClassPlugin(origin, rule)
    pluginCache.register.classPlugin(result)
    return rule
  })
}

/**
 * 从模块中注册所有类插件
 * @param meta 插件包元信息
 * @param callerPath 当前模块所属文件绝对路径
 * @param module 模块对象
 * @returns 所有注册的插件类构造函数数组
 */
export const registerModule = async (
  meta: PackageMetaInfoCache,
  callerPath: string,
  module: Record<string, unknown>
) => {
  await Promise.all(Object.entries(module).map(async ([key, value]) => {
    if (key === 'default') return
    await register(meta, callerPath, value).catch((error) => {
      pluginCache.logger.error(new Error(`[${meta.name}] 注册失败`, { cause: error }))
    })
  }))
}
