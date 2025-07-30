import { EventEmitter as NodeEventEmitter } from 'node:events'
import type { Args, DefaultEventMap, EventMap, Key, Key2, Listener1, Listener2 } from './types'

/**
 * 判断字符串是否为正则表达式格式（'/pattern/flags'）
 * @param str 要检查的字符串
 * @returns 是否为正则表达式格式
 */
export const isRegExpString = (str: string): boolean => /^\/(.+)\/([gimuy]*)$/.test(str)

/**
 * 将正则表达式字符串转换为 RegExp 对象
 * @param str 正则表达式字符串，格式为 '/pattern/flags'
 * @returns RegExp 对象
 */
export const stringToRegExp = (str: string): RegExp => {
  const match = str.match(/^\/(.+)\/([gimuy]*)$/)
  if (!match) {
    throw new Error(`无效的正则表达式字符串格式: ${str}`)
  }
  return new RegExp(match[1], match[2])
}

/**
 * 通过正则表达式获取符合条件的key并缓存
 * @param reg 正则表达式字符串
 * @param event 事件发射器实例
 * @param cache 缓存
 * @returns 符合条件的key
 */
export const setRegexKeyCache = <T extends EventMap<T> = DefaultEventMap> (reg: RegExp, event: EventEmitter<T>, cache: Map<RegExp, string[]>) => {
  const keys = event.eventNames().map(key => key.toString())
  const result: string[] = []
  for (const key of keys) {
    if (reg.test(key)) {
      result.push(key)
    }
  }

  if (!result.length) {
    cache.delete(reg)
    return
  }

  cache.set(reg, result)
}

/**
 * 事件发射器类，基于Node.js原生EventEmitter，
 * 支持字符串和正则表达式字符串作为事件名
 */
export class EventEmitter<T extends EventMap<T> = DefaultEventMap> {
  /** 内部Node.js原生EventEmitter实例 */
  #emitter: NodeEventEmitter = new NodeEventEmitter()

  /** 存储正则表达式事件名的映射 */
  #regexEvents: Map<RegExp, string[]> = new Map()

  /**
   * 添加事件监听器，支持正则表达式事件名
   * @param eventName - 事件名，可以是字符串或正则表达式字符串
   * @param listener - 事件监听器函数
   * @returns 当前事件发射器实例，支持链式调用
   */
  public on<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (typeof eventName === 'string') {
      /** 如果是正则表达式字符串 */
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        setRegexKeyCache(reg, this, this.#regexEvents)
        return this
      }

      this.#emitter.on(eventName, listener as any)
      return this
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    this.#emitter.on(name as string | symbol, listener as any)
    return this
  }

  /**
   * 添加一次性事件监听器，触发后自动移除
   * @param eventName - 事件名，可以是字符串或正则表达式字符串
   * @param listener - 事件监听器函数
   * @returns 当前事件发射器实例，支持链式调用
   */
  public once<K> (
    eventName: Key<K, T>,
    listener: Listener1<K, T>
  ): this {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        setRegexKeyCache(reg, this, this.#regexEvents)
        return this
      }

      this.#emitter.once(eventName, listener as any)
      return this
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    this.#emitter.once(name as string | symbol, listener as any)
    return this
  }

  /**
   * 移除指定事件的特定监听器
   * @param eventName - 事件名，可以是字符串或正则表达式字符串
   * @param listener - 要移除的监听器函数
   * @returns 当前事件发射器实例，支持链式调用
   */
  public off<K> (
    eventName: Key<K, T>,
    listener: Listener1<K, T>
  ): this {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        this.#regexEvents.delete(reg)
        return this
      }

      this.#emitter.off(eventName, listener as any)
      return this
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    this.#emitter.off(name as string | symbol, listener as any)
    return this
  }

  /**
   * 移除指定事件的所有监听器
   * @param eventName - 可选，事件名。如果未提供，则移除所有事件的所有监听器
   * @returns 当前事件发射器实例，支持链式调用
   */
  public removeAllListeners (eventName?: Key<unknown, T>): this {
    if (eventName) {
      if (typeof eventName === 'string') {
        if (isRegExpString(eventName)) {
          const reg = stringToRegExp(eventName)
          this.#regexEvents.delete(reg)
          return this
        }

        this.#emitter.removeAllListeners(eventName)
        return this
      }

      this.#emitter.removeAllListeners(eventName as string | symbol)
      return this
    }

    this.#regexEvents.clear()
    this.#emitter.removeAllListeners()
    return this
  }

  /**
   * 解析事件名中的命名空间
   * @param eventName - 事件名
   * @returns 解析后的命名空间结果
   */
  #parseNamespace (eventName: string): { namespace: string; event: string; original: string } {
    const parts = eventName.split('.')
    return {
      namespace: parts.length > 1 ? parts.slice(0, -1).join('.') : '',
      event: parts[parts.length - 1],
      original: eventName,
    }
  }

  /**
   * 移除指定命名空间下的所有监听器
   * @param namespace - 命名空间
   * @description 暂未适配 `Symbol` 类型
   * @returns 当前事件发射器实例，支持链式调用
   */
  public removeNamespaceListeners (namespace: string): this {
    if (!namespace) return this

    const eventNames = this.eventNames()
    const toRemove = eventNames.filter(name => {
      if (typeof name === 'symbol') return false
      const parsed = this.#parseNamespace(name)
      return parsed.namespace === namespace ||
        parsed.namespace.startsWith(namespace + '.')
    })

    toRemove.forEach(eventName => {
      if (typeof eventName === 'symbol') return
      this.removeAllListeners(eventName)
    })

    return this
  }

  /**
   * 触发事件，支持正则表达式事件名匹配
   * @param eventName - 要触发的事件名
   * @param args - 传递给监听器的参数
   * @returns 如果有任何监听器处理了事件则返回 true，否则返回 false
   */
  public emit<K> (eventName: Key<K, T>, ...args: Args<K, T>): boolean {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        const keys = this.#regexEvents.get(reg)
        if (!keys) return false

        for (const key of keys) {
          this.#emitter.emit(key, ...args)
        }

        return true
      }

      return this.#emitter.emit(eventName, ...args)
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    return this.#emitter.emit(name as string | symbol, ...args)
  }

  /**
   * 获取指定事件的所有监听器
   * @param eventName - 事件名
   * @returns 监听器函数数组
   */
  public listeners<K> (eventName: Key<K, T>): Array<Listener2<K, T>> {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        const result: Listener2<K, T>[] = []
        const keys = this.#regexEvents.get(reg)
        if (!keys) return result

        for (const key of keys) {
          result.push(...this.#emitter.listeners(key) as Listener2<K, T>[])
        }

        return result
      }

      return this.#emitter.listeners(eventName as string | symbol) as Listener2<K, T>[]
    }

    return this.#emitter.listeners(eventName as string | symbol) as Listener2<K, T>[]
  }

  /**
   * 获取指定事件的监听器数量
   * @param eventName - 事件名
   * @returns 监听器数量
   */
  public listenerCount<K> (eventName: Key<K, T>, listener?: Listener2<K, T>): number {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        const keys = this.#regexEvents.get(reg)
        if (!keys) return 0

        if (listener) {
          // 如果提供了特定监听器，计算匹配该监听器的数量
          return keys.reduce((acc, key) => {
            const listeners = this.#emitter.listeners(key)
            return acc + listeners.filter(l => l === listener).length
          }, 0)
        }

        return keys.reduce((acc, key) => acc + this.#emitter.listenerCount(key), 0)
      }

      if (listener) {
        const listeners = this.#emitter.listeners(eventName as string | symbol)
        return listeners.filter(l => l === listener).length
      }

      return this.#emitter.listenerCount(eventName as string | symbol)
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName

    if (listener) {
      const listeners = this.#emitter.listeners(name as string | symbol)
      return listeners.filter(l => l === listener).length
    }

    return this.#emitter.listenerCount(name as string | symbol)
  }

  /**
   * 获取所有已注册事件名称列表
   * @returns 事件名称数组
   */
  public eventNames (): Array<(string | symbol) & Key2<unknown, T>> {
    const result = this.#emitter.eventNames()
    const regexKeys = Array.from(this.#regexEvents.keys())
    /** 将reg转为string */
    const regexKeysString = regexKeys.map(key => key.toString())
    return [...result, ...regexKeysString] as Array<(string | symbol) & Key2<unknown, T>>
  }

  /**
   * 创建自定义事件实例
   * @returns 自定义事件实例
   */
  public createEvent<T extends EventMap<T> = DefaultEventMap> (): CustomEventImpl<T> {
    return new CustomEventImpl<T>(this as unknown as EventEmitter<T>)
  }

  /**
   * 获取或设置最大监听器数量
   * @param n - 可选，要设置的最大监听器数量
   * @returns 当前最大监听器数量，或当前事件发射器实例（如果设置了新值）
   */
  public maxListeners (n?: number): number | this {
    if (n === undefined) {
      return this.#emitter.getMaxListeners()
    }
    this.#emitter.setMaxListeners(n)
    return this
  }

  /**
   * 设置最大监听器数量
   * @param n - 最大监听器数量
   * @returns 当前事件发射器实例
   */
  public setMaxListeners (n: number): this {
    this.#emitter.setMaxListeners(n)
    return this
  }

  /**
   * 获取最大监听器数量
   * @returns 最大监听器数量
   */
  public getMaxListeners (): number {
    return this.#emitter.getMaxListeners()
  }

  public addListener = this.on
  public removeListener = this.off

  /**
   * 在列表开头添加监听器
   * @param eventName - 事件名
   * @param listener - 监听器函数
   * @returns 当前事件发射器实例
   */
  public prependListener<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        setRegexKeyCache(reg, this, this.#regexEvents)
        return this
      }

      this.#emitter.prependListener(eventName, listener as any)
      return this
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    this.#emitter.prependListener(name as string | symbol, listener as any)
    return this
  }

  /**
   * 在列表开头添加一次性监听器
   * @param eventName - 事件名
   * @param listener - 监听器函数
   * @returns 当前事件发射器实例
   */
  public prependOnceListener<K> (
    eventName: Key<K, T>,
    listener: Listener1<K, T>
  ): this {
    if (typeof eventName === 'string') {
      if (isRegExpString(eventName)) {
        const reg = stringToRegExp(eventName)
        setRegexKeyCache(reg, this, this.#regexEvents)
        return this
      }

      this.#emitter.prependOnceListener(eventName, listener as any)
      return this
    }

    const name = typeof eventName === 'number' ? eventName.toString() : eventName
    this.#emitter.prependOnceListener(name as string | symbol, listener as any)
    return this
  }

  /**
   * 获取原始监听器列表
   * @param eventName - 事件名
   * @returns 原始监听器列表
   */
  public rawListeners<K> (eventName: Key<K, T>): Array<Listener2<K, T>> {
    return this.#emitter.rawListeners(eventName as string | symbol) as Listener2<K, T>[]
  }

  /**
   * 清理所有事件和缓存
   * @returns 当前事件发射器实例
   */
  public clear (): this {
    this.removeAllListeners()
    this.#regexEvents.clear()
    return this
  }

  /**
   * 设置默认的最大监听器数量
   * @param n - 最大监听器数量
   */
  public static setDefaultMaxListeners (n: number): void {
    NodeEventEmitter.defaultMaxListeners = n
  }

  /**
   * 获取默认的最大监听器数量
   * @returns 默认的最大监听器数量
   */
  public static getDefaultMaxListeners (): number {
    return NodeEventEmitter.defaultMaxListeners
  }
}

/**
 * 创建自定义事件类，实现事件隔离
 */
export class CustomEventImpl<T extends EventMap<T> = DefaultEventMap> extends EventEmitter<T> {
  #eventEmitter: EventEmitter<T>
  /** 是否已锁定监听器添加功能 */
  #locked: boolean = false

  constructor (eventEmitter: EventEmitter<T>) {
    super()
    this.#eventEmitter = eventEmitter
  }

  /**
   * - 与emit的区别在于 此函数会向上级发射器发射事件
   * @example 举个例子
   * ```ts
   * const parent = new EventEmitter()
   * const event = new CustomEventImpl(parent)
   * event.on('test', () => {
   *   console.log('test')
   * })
   *
   * event.em('test') // parent.on('test')也会触发
   * event.emit('test', true) // 只会触发内部的event.on('test')
   * ```
   * @param eventName - 事件名
   * @param args - 事件参数
   * @returns 是否触发成功
   */
  public em<K> (eventName: Key<K, T>, ...args: Args<K, T>): boolean {
    this.#eventEmitter.emit(eventName, ...args)
    return this.emit(eventName, ...args)
  }

  /**
   * 锁定监听器添加功能，调用后将不允许添加新的事件监听器
   * 用于在内部包监听器设置完成后，防止外部插件添加额外的监听器
   * @returns 当前实例，支持链式调用
   */
  public lockListeners (): this {
    this.#locked = true
    return this
  }

  /**
   * 判断当前实例是否已锁定监听器添加功能
   * @returns 是否已锁定
   */
  public isLocked (): boolean {
    return this.#locked
  }

  /**
   * 覆盖继承自EventEmitter的on方法
   * @param eventName - 事件名
   * @param listener - 事件监听器
   * @returns 当前实例
   */
  public on<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (this.#locked) {
      return this
    }
    return super.on(eventName, listener)
  }

  /**
   * 覆盖继承自EventEmitter的once方法
   * @param eventName - 事件名
   * @param listener - 事件监听器
   * @returns 当前实例
   */
  public once<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (this.#locked) {
      return this
    }
    return super.once(eventName, listener)
  }

  /**
   * 覆盖继承自EventEmitter的off方法
   * @param eventName - 事件名
   * @param listener - 事件监听器
   * @returns 当前实例
   */
  public off<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (this.#locked) {
      return this
    }

    return super.off(eventName, listener)
  }

  /**
   * 重写addListener属性，使其指向锁定后的on方法
   */
  public addListener = this.on

  /**
   * 重写removeListener属性，使其指向off方法
   */
  public removeListener = this.off

  /**
   * 覆盖继承自EventEmitter的prependListener方法
   * @param eventName - 事件名
   * @param listener - 事件监听器
   * @returns 当前实例
   */
  public prependListener<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (this.#locked) {
      return this
    }
    return super.prependListener(eventName, listener)
  }

  /**
   * 覆盖继承自EventEmitter的prependOnceListener方法
   * @param eventName - 事件名
   * @param listener - 事件监听器
   * @returns 当前实例
   */
  public prependOnceListener<K> (eventName: Key<K, T>, listener: Listener1<K, T>): this {
    if (this.#locked) {
      return this
    }
    return super.prependOnceListener(eventName, listener)
  }
}
