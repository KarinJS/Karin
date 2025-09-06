import { EventEmitter } from './emitter'
import type { Args, DefaultEventMap, EventMap, Key, Listener1 } from './types'

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
