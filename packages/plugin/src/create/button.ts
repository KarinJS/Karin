import { types } from '@karinjs/utils'
import { formatReg } from './options'
import { BuilderBase } from './base'
import { store } from '../store'
import type { OptionsBase } from './options'
import type { ButtonType, Event } from '@karinjs/adapter'

/**
 * Button 插件选项
 */
export interface Options extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type FormatOptions = Required<Omit<Options, 'permission'>>

/**
 * Button 回调函数类型
 */
export type ButtonCallback = (
  /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
  next: () => void,
  /** 自定义参数 如果传e需要符合标准 */
  args?: { e?: Event, [key: string]: unknown }
) => Promise<ButtonType> | ButtonType

/**
 * Button 构建器
 * @class CreateButton
 */
export class CreateButton extends BuilderBase {
  #reg: RegExp
  #callback: ButtonCallback
  #options: Required<FormatOptions>

  constructor (
    reg: string | RegExp,
    callback: ButtonCallback,
    options: Options
  ) {
    super()
    if (!reg) throw new Error('[button]: 缺少参数[reg]')
    if (!callback) throw new Error('[button]: 缺少参数[fnc]')

    this.#reg = formatReg(reg)
    this.#callback = callback
    this.#options = CreateButton.options(options)
  }

  /**
   * 标准化 Button 选项
   * @param options 选项
   * @returns 返回格式化后的选项
   */
  static options (
    options: Options
  ): Required<FormatOptions> {
    const name = options.name?.trim()
    if (!name) {
      throw new Error('[button] name 是必填项，且不允许为空')
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

  get type (): 'button' {
    return 'button'
  }

  /**
   * 按钮匹配正则
   * @returns 返回按钮匹配正则
   */
  get reg (): RegExp {
    /** 这里重新赋值是防止lastIndex错误 */
    const r = this.#reg
    return r
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
  get callback (): ButtonCallback {
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
   * 更新按钮匹配正则
   * @param reg 按钮匹配正则
   */
  setReg (reg: string | RegExp) {
    this.#reg = formatReg(reg)
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   */
  setCallback (callback: ButtonCallback) {
    this.#callback = callback
  }

  /**
   * 更新选项
   * @param options Button 选项
   */
  setOptions (options: Options) {
    const opt = CreateButton.options(options)
    /** 标记脏数据 */
    if (opt.priority !== this.#options.priority) {
      store.markDirty('button')
    }

    this.#options = opt
  }
}

/**
 * 快速构建按钮
 * @param reg 正则表达式
 * @param fnc 回调函数
 * @param options 选项
 */
export const button = (
  reg: string | RegExp,
  fnc: ButtonCallback,
  options: Options
) => {
  const result = new CreateButton(reg, fnc, options)
  store.add('button', result)
  return result
}
