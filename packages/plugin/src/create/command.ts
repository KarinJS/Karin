import { BuilderBase } from './base'
import { formatReg } from './options'
import { types } from '@karinjs/utils'
import { store, hotCache } from '../store'

import type { OptionsBase } from './options'
import type { Elements, MessageEventMap } from '@karinjs/adapter'

/**
 * 事件类型约束
 * - 可以是单个事件键，如 `'message'` 或 `'message.group'`
 * - 也可以是事件键数组，如 `['message.group', 'message.friend']`
 */
export type EventTypes = keyof MessageEventMap | readonly (keyof MessageEventMap)[]

/**
 * 辅助类型：将事件类型或事件数组转换为对应的联合类型
 * @template T 事件类型或事件数组
 * @example
 * ```ts
 * // 单个事件类型
 * type Single = EventsToUnion<'message.group'> // GroupMessage
 *
 * // 事件数组
 * type Multi = EventsToUnion<['message.group', 'message.friend']> // GroupMessage | FriendMessage
 * ```
 */
export type EventsToUnion<T extends EventTypes> = T extends readonly (keyof MessageEventMap)[]
  ? MessageEventMap[T[number]]
  : T extends keyof MessageEventMap ? MessageEventMap[T] : never

/**
 * 命令选项
 * @template T 监听的事件类型，可以是单个事件或事件数组
 */
export interface Options<T extends EventTypes> extends OptionsBase {
  /**
   * 监听事件类型
   * - 支持单个事件：监听指定的单个事件类型
   * - 支持事件数组：同时监听多个事件类型
   * - 默认值：`'message'`
   *
   * @example
   * ```ts
   * // 监听单个事件
   * { event: 'message.group' }
   *
   * // 监听多个事件
   * { event: ['message.group', 'message.friend'] }
   *
   * // 监听所有消息事件
   * { event: ['message.group', 'message.friend', 'message.guild', 'message.direct', 'message.groupTemp'] }
   *
   * // 不指定则默认监听所有消息
   * { } // 等同于 { event: 'message' }
   * ```
   */
  event?: T
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

/** 参数二为消息段时的类型 */
type MessageSegment = string | Elements | Elements[]

/**
 * 消息回调函数类型
 * @template T 事件类型，决定回调函数接收的事件对象类型
 * - 当 T 为单个事件时，event 参数类型为对应的消息事件类型
 * - 当 T 为事件数组时，event 参数类型为所有事件类型的联合类型
 *
 * @example
 * ```ts
 * // 单个事件类型
 * const callback: MessageCallback<'message.group'> = async (event, next) => {
 *   // event 类型为 GroupMessage
 *   console.log(event.groupId)
 * }
 *
 * // 事件数组（联合类型）
 * const callback: MessageCallback<['message.group', 'message.friend']> = async (event, next) => {
 *   // event 类型为 GroupMessage | FriendMessage
 *   if (event.isGroup) {
 *     console.log(event.groupId)
 *   } else if (event.isFriend) {
 *     console.log('好友消息')
 *   }
 * }
 * ```
 */
export type MessageCallback<T extends EventTypes> = (
  /** 消息事件上下文 */
  event: EventsToUnion<T>,
  /** 调用后将继续匹配下一个插件 */
  next: () => unknown
) => Promise<unknown> | unknown

/**
 * 参数二非函数时的命令选项
 * @template T 监听的事件类型
 */
interface StringOptions<T extends EventTypes> extends Options<T> {
  /** 延迟回复 单位毫秒 */
  delay?: number
  /** 是否停止执行后续插件 默认true */
  stop?: boolean
  /** 是否加上at 仅在群聊中有效 */
  at?: boolean
  /** 是否加上引用回复 */
  reply?: boolean
  /** 发送是否撤回消息 单位秒 */
  recallMsg?: number
}

/**
 * 格式化后的参数选项类型
 * @template T 事件类型
 */
type FormatOptions<T extends EventTypes> = Required<Omit<
  Options<T>,
  'event'
>> & {
  /** 监听的事件类型 */
  event: readonly (keyof MessageEventMap)[]
  /** 是否监听所有消息事件 */
  isListenAll: boolean
}

/**
 * 快速构建命令
 * @template T 事件类型，可以是单个事件或事件数组
 * @param reg 正则表达式
 * @param callback 函数或者字符串或者KarinElement、KarinElement数组
 * @param options 选项
 */
export const command = <T extends EventTypes = keyof MessageEventMap> (
  reg: string | RegExp,
  callback: MessageCallback<T> | MessageSegment,
  options: Options<T> | StringOptions<T>
) => {
  const result = new CreateCommand<T>(reg, callback, options)
  store.add('command', result)
  return result
}

export class CreateCommand<T extends EventTypes = EventTypes> extends BuilderBase {
  #reg: RegExp
  #callback: MessageCallback<T>
  #options: Required<FormatOptions<T>>
  /** 原始options */
  #rawOptions: Options<T> | StringOptions<T>

  constructor (
    reg: string | RegExp,
    callback: MessageCallback<T> | MessageSegment,
    options: Options<T> | StringOptions<T>
  ) {
    super()
    const opt = typeof options === 'object' && options !== null
      ? options
      : {} as Options<T> | StringOptions<T>
    this.#rawOptions = opt
    this.#reg = formatReg(reg)
    this.#callback = CreateCommand.callback(callback, opt, this as CreateCommand<T>)
    this.#options = CreateCommand.options(opt)
  }

  /**
   * 标准化回调函数
   * @template T 事件类型
   * @param fnc 回调函数
   * @param options 选项
   * @param command CreateCommand 实例（用于热点缓存追踪）
   * @returns 标准化后的回调函数
   */
  static callback<T extends EventTypes> (
    fnc: MessageCallback<T> | MessageSegment,
    options: Options<T> | StringOptions<T>,
    command?: CreateCommand<T>
  ): MessageCallback<T> {
    if (typeof fnc === 'function') {
      return async (ctx: EventsToUnion<T>, next: () => void) => {
        // 异步追踪热点缓存（不阻塞命令执行）
        if (command) {
          hotCache.track(ctx.msg, command as unknown as CreateCommand).catch(() => { })
        }

        return fnc(ctx, next)
      }
    } let sleep = async () => { }
    if ('delay' in options && typeof options.delay === 'number' && options.delay > 0) {
      sleep = () => new Promise(resolve => setTimeout(resolve, options.delay))
    }

    return async (ctx: EventsToUnion<T>, next: () => void) => {
      // 异步追踪热点缓存（不阻塞命令执行）
      if (command) {
        hotCache.track(ctx.msg, command as unknown as CreateCommand).catch(() => { })
      }

      await sleep()
      const message = typeof fnc === 'number' ? String(fnc) : fnc

      const at = ('at' in options && typeof options.at === 'boolean' && options.at) || false
      const reply = ('reply' in options && typeof options.reply === 'boolean' && options.reply) || false
      const recallMsg = ('recallMsg' in options && typeof options.recallMsg === 'number' && options.recallMsg) || 0

      await ctx.reply(message, { at, reply, recallMsg })

      if ('stop' in options) {
        if (options.stop) return
        next()
      }
    }
  }

  /**
   * 标准化命令选项
   * @template T 事件类型
   * @param options 选项
   * @returns 返回命令选项
   */
  static options<T extends EventTypes> (
    options: Options<T>
  ): Required<FormatOptions<T>> {
    let eventArray: readonly (keyof MessageEventMap)[]
    if (options.event === undefined || options.event === 'message') {
      eventArray = ['message'] as const
    } else if (Array.isArray(options.event)) {
      eventArray = options.event as readonly (keyof MessageEventMap)[]
    } else {
      eventArray = [options.event] as readonly (keyof MessageEventMap)[]
    }

    /** 是否监听全部属性 */
    const isListenAll = eventArray.length === 1 && eventArray[0] === 'message'

    // 验证 name 必填且不为空
    const name = options.name?.trim()
    if (!name) {
      throw new Error('[command] name 是必填项，且不允许为空')
    }

    return {
      authFailMsg: options.authFailMsg ?? false,
      name,
      event: eventArray,
      isListenAll,
      permission: types.string(options.permission, 'all'),
      priority: types.number(options.priority, 10000),
      adapter: types.array(options.adapter, []),
      dsbAdapter: types.array(options.dsbAdapter, []),
    }
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

  get type () {
    return 'command' as const
  }

  /**
   * 插件消息匹配正则
   * @returns 返回插件消息匹配正则
   */
  get reg (): RegExp {
    /** 这里重新赋值是防止lastIndex错误 */
    const r = this.#reg
    return r
  }

  /**
   * 插件回调函数
   * @returns 返回插件回调函数
   */
  get callback (): MessageCallback<T> {
    return this.#callback
  }

  /**
   * 插件选项
   * @returns 返回插件选项
   */
  get options (): Required<FormatOptions<T>> {
    return this.#options
  }

  /**
   * 更新消息匹配正则
   * @param reg 消息匹配正则
   */
  setReg (reg: string | RegExp) {
    this.#reg = formatReg(reg)
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   */
  setCallback (callback: MessageCallback<T> | MessageSegment) {
    this.#callback = CreateCommand.callback(callback, this.#rawOptions, this as CreateCommand<T>)
  }

  /**
   * 更新选项
   * @param options 命令选项
   */
  setOptions (options: Options<T> | StringOptions<T>) {
    this.#rawOptions = options
    const opt = CreateCommand.options(options)
    this.#callback = CreateCommand.callback(this.#callback, options, this as CreateCommand<T>)
    /** 标记脏数据 */
    if (opt.priority !== this.#options.priority) {
      store.markDirty('command')
    }

    this.#options = opt
  }
}
