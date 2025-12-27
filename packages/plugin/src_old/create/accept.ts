import { types } from '@karinjs/utils'
import { BuilderBase } from './base'
import { pluginCache } from '../cache'
import type { OptionsBase } from './options'
import type { NoticeAndRequest } from '@karinjs/adapter'

/**
 * Accept 插件选项
 * @template T 监听的事件类型
 */
export interface Options<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> extends Omit<OptionsBase, 'perm' | 'permission'> {
  /**
   * 监听事件类型
   * @default 'notice'
   */
  event?: T
}

/**
 * 格式化后的参数选项类型
 * @template T 事件类型
 */
type FormatOptions<T extends keyof NoticeAndRequest> = Required<Omit<
  Options<T>,
  'notAdapter' | 'perm' | 'rank'
>> & {
  /** 监听的事件类型 */
  event: T
}

/**
 * Accept 回调函数类型
 * @template T 事件类型
 */
export type AcceptCallback<T extends keyof NoticeAndRequest> = (
  /** 事件上下文 */
  event: NoticeAndRequest[T],
  /** 调用后将继续匹配下一个插件 */
  next: () => unknown
) => Promise<unknown> | unknown

/**
 * Accept 构建器
 * @template T 事件类型
 * @class CreateAccept
 */
export class CreateAccept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> extends BuilderBase {
  #event: T
  #callback: AcceptCallback<T>
  #options: Required<FormatOptions<T>>

  constructor (
    event: T,
    callback: AcceptCallback<T>,
    options: Options<T> = {}
  ) {
    super()
    this.#event = event
    this.#callback = callback
    this.#options = CreateAccept.options(options, this.defaultAppName)
    this.setLog(this.#options.log)
  }

  /**
   * 标准化 Accept 选项
   * @template T 事件类型
   * @param options 选项
   * @returns 返回格式化后的选项
   */
  static options<T extends keyof NoticeAndRequest> (
    options: Options<T>,
    defaultAppName: string
  ): Required<FormatOptions<T>> {
    return {
      event: (options.event || 'notice') as T,
      name: types.string(options.name, defaultAppName),
      log: types.bool(options.log, true),
      priority: types.number(options.priority, types.number(options.rank, 10000)),
      adapter: types.array(options.adapter, []),
      dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    }
  }

  /**
   * 当前app名称
   */
  get name (): string {
    return this.#options.name
  }

  get type (): 'accept' {
    return 'accept'
  }

  /**
   * 监听的事件类型
   * @returns 返回事件类型
   */
  get event (): T {
    return this.#event
  }

  /**
   * 优先级
   */
  get priority (): number {
    return this.#options.priority
  }

  /**
   * 插件回调函数
   * @returns 返回插件回调函数
   */
  get callback (): AcceptCallback<T> {
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
   * 更新事件类型
   * @param event 事件类型
   */
  setEvent (event: T) {
    this.#event = event
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   */
  setCallback (callback: AcceptCallback<T>) {
    this.#callback = callback
  }

  /**
   * 更新选项
   * @param options Accept 选项
   */
  setOptions (options: Options<T>) {
    const opt = CreateAccept.options(options, this.defaultAppName)
    /** 标记脏数据 */
    if (opt.priority !== this.#options.priority) {
      pluginCache.instances.markAsUnsorted('accept')
    }

    this.#options = opt
  }
}

/**
 * 快速构建 Accept 插件
 * @template T 事件类型
 * @param event 事件类型
 * @param fnc 回调函数
 * @param options 选项
 */
export const accept = <T extends keyof NoticeAndRequest = keyof NoticeAndRequest> (
  event: T,
  fnc: AcceptCallback<T>,
  options: Options<T> = {}
): CreateAccept<T> => {
  const result = new CreateAccept(event, fnc, options)
  pluginCache.register.accept(result as unknown as CreateAccept)
  return result
}
