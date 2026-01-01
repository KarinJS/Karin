/**
 * 链式命令构建器
 *
 * 提供链式 API 创建命令插件：
 * ```ts
 * cmd(/^admin$/, doAdmin)
 *   .name('管理命令')
 *   .perm('master')
 *   .priority(1)
 *   .on('message.group')
 * ```
 *
 * @module create/cmd
 */

import { store } from '../store'
import { CreateCommand, type MessageCallback, type Options, type EventTypes } from './command'
import { formatReg } from './options'

import type { Elements, MessageEventMap, AdapterProtocol } from '@karinjs/adapter'

/** 参数二为消息段时的类型 */
type MessageSegment = string | Elements | Elements[]

/**
 * 链式命令构建器
 */
export class CmdBuilder<T extends EventTypes = keyof MessageEventMap> {
  #reg: RegExp
  #callback: MessageCallback<T> | MessageSegment
  #options: Partial<Options<T>> = {}
  #registered = false
  #plugin: CreateCommand<T> | null = null

  constructor (
    reg: string | RegExp,
    callback: MessageCallback<T> | MessageSegment
  ) {
    this.#reg = formatReg(reg)
    this.#callback = callback
  }

  /**
   * 设置插件名称
   */
  name (name: string): this {
    this.#options.name = name
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置权限
   */
  perm (permission: 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin'): this {
    this.#options.permission = permission
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置优先级
   */
  priority (priority: number): this {
    this.#options.priority = priority
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置监听事件
   */
  on<E extends EventTypes> (event: E): CmdBuilder<E> {
    (this.#options as unknown as Options<E>).event = event
    this.#updateIfRegistered()
    return this as unknown as CmdBuilder<E>
  }

  /**
   * 设置适配器白名单
   */
  adapter (...adapters: AdapterProtocol[]): this {
    this.#options.adapter = adapters
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置适配器黑名单
   */
  dsbAdapter (...adapters: AdapterProtocol[]): this {
    this.#options.dsbAdapter = adapters
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置是否记录日志
   */
  log (enable: boolean): this {
    this.#options.log = enable
    this.#updateIfRegistered()
    return this
  }

  /**
   * 设置权限不足提示
   */
  authFailMsg (msg: boolean | string): this {
    this.#options.authFailMsg = msg
    this.#updateIfRegistered()
    return this
  }

  /**
   * 注册插件到 store
   * 注意：链式调用结束后会自动注册，通常不需要手动调用
   */
  register (): CreateCommand<T> {
    if (this.#registered && this.#plugin) {
      return this.#plugin
    }

    // 验证 name 必填
    if (!this.#options.name?.trim()) {
      throw new Error('[cmd] name 是必填项，请使用 .name() 方法设置')
    }

    this.#plugin = new CreateCommand(this.#reg, this.#callback, this.#options as Options<T>)
    store.add('command', this.#plugin as unknown as CreateCommand)
    this.#registered = true
    return this.#plugin
  }

  /**
   * 获取插件实例
   * 如果还未注册，会先注册
   */
  get plugin (): CreateCommand<T> {
    if (!this.#registered) {
      this.register()
    }
    return this.#plugin!
  }

  /**
   * 更新已注册的插件
   */
  #updateIfRegistered (): void {
    if (this.#registered && this.#plugin && this.#options.name) {
      this.#plugin.setOptions(this.#options as Options<T>)
    }
  }

  // ===== 代理到 CreateCommand 的属性 =====

  get id (): string {
    return this.plugin.id
  }

  get type (): 'command' {
    return 'command'
  }

  get reg (): RegExp {
    return this.#reg
  }

  get callback (): MessageCallback<T> {
    return this.plugin.callback
  }

  get options (): Partial<Options<T>> {
    return this.#options
  }
}

/**
 * 创建链式命令
 *
 * @example
 * ```ts
 * import { cmd } from '@karinjs/plugin'
 *
 * // 链式配置
 * cmd(/^admin$/, async (e) => {
 *   await e.reply('管理员命令')
 * })
 *   .name('管理命令')
 *   .perm('master')
 *   .priority(1)
 *   .on('message.group')
 *
 * // 简单用法
 * cmd(/^ping$/, 'pong').name('Ping')
 * ```
 */
export function cmd<T extends EventTypes = keyof MessageEventMap> (
  reg: string | RegExp,
  callback: MessageCallback<T> | MessageSegment
): CmdBuilder<T> {
  const builder = new CmdBuilder(reg, callback)
  // 延迟注册 - 使用 queueMicrotask 确保链式调用完成后再注册
  queueMicrotask(() => {
    builder.register()
  })
  return builder
}
