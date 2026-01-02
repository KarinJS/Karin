import { types } from '@karinjs/utils'
import { BuilderBase } from './base'
import { store } from '../store'
import type { OptionsBase } from './options'

/**
 * Handler 插件选项
 */
export interface Options extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type FormatOptions = Required<Omit<Options, 'permission'>>

/**
 * Handler 回调函数类型
 */
export type HandlerCallback = (
  /** 自定义参数 由调用方传递 */
  args: Record<string, unknown>,
  /** 调用后将继续执行下一个handler */
  next: (msg?: string) => void,
) => Promise<unknown> | unknown

/**
 * 快速构建 Handler 插件
 * @param key 事件key
 * @param fnc 回调函数
 * @param options 选项
 */
export const handler = (
  key: string,
  fnc: HandlerCallback,
  options: Options
): CreateHandler => {
  const result = new CreateHandler(key, fnc, options)
  store.add('handler', result)
  return result
}

/**
 * Handler 构建器
 * @class CreateHandler
 */
export class CreateHandler extends BuilderBase {
  #key: string
  #callback: HandlerCallback
  #options: Required<FormatOptions>

  constructor (
    key: string,
    callback: HandlerCallback,
    options: Options
  ) {
    super()
    if (!key) throw new Error('[handler]: 缺少参数[key]')
    if (!callback) throw new Error('[handler]: 缺少参数[fnc]')

    this.#key = key
    this.#callback = callback
    this.#options = CreateHandler.options(options)
  }

  /**
   * 标准化 Handler 选项
   * @param options 选项
   * @returns 返回格式化后的选项
   */
  static options (
    options: Options
  ): Required<FormatOptions> {
    const name = options.name?.trim()
    if (!name) {
      throw new Error('[handler] name 是必填项，且不允许为空')
    }

    return {
      name,
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

  get type (): 'handler' {
    return 'handler'
  }

  /**
   * 事件key
   * @returns 返回事件key
   */
  get key (): string {
    return this.#key
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
  get callback (): HandlerCallback {
    return this.#callback
  }

  /**
   * 插件选项
   * @returns 返回插件选项
   */
  get options (): Required<FormatOptions> {
    return this.#options
  }

  /**
   * 更新事件key
   * @param key 事件key
   */
  setKey (key: string) {
    this.#key = key
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   */
  setCallback (callback: HandlerCallback) {
    this.#callback = callback
  }

  /**
   * 更新选项
   * @param options Handler 选项
   */
  setOptions (options: Options) {
    const opt = CreateHandler.options(options)
    /** 标记脏数据 */
    if (opt.priority !== this.#options.priority) {
      store.markDirty('handler')
    }

    this.#options = opt
  }
}
