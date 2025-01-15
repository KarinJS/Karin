// TODO: 未完成 event 类型定义
import type { Event } from '../event'
import type { PkgInfo, PluginFile } from './base'
import type { ButtonElement, KeyboardElement } from '../segment'

type ButtonType = ButtonElement | KeyboardElement | Array<ButtonElement | KeyboardElement>

/** 按钮插件类型 */
export interface Button {
  /** 插件包基本属性 */
  pkg: PkgInfo
  /** 插件方法基本属性 */
  file: PluginFile<'button'>
  /** 优先级 */
  priority: number
  /** 插件正则 */
  reg: RegExp
  /** 优先级 */
  rank: number
  /** 执行方法 */
  fnc: (
    /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
    next: () => void,
    /** 自定义参数 如果传e需要符合标准 */
    args?: { e?: Event, [key: string]: any }
  ) => Promise<ButtonType> | ButtonType
}
