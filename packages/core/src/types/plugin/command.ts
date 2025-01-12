import type { Plugin } from '../plugin/class'
import type { MessageEventMap, Permission } from '../event'
import type { AdapterOptions, Log, PkgInfo, PluginFile } from './base'

/** 函数命令插件方法 */
export type CmdFnc<T extends keyof MessageEventMap> = (
  /** 消息事件 */
  e: MessageEventMap[T],
  /** 调用后将继续匹配下一个插件 */
  next: () => unknown
) => unknown

/** 函数方法命令插件 */
export interface Command<
  T extends keyof MessageEventMap = keyof MessageEventMap
> extends AdapterOptions {
  /** 插件包基本属性 */
  pkg: PkgInfo
  /** 插件方法基本属性 */
  file: PluginFile<'command'>
  /** 插件子类型 */
  type: 'fnc'
  /** 插件正则 */
  reg: RegExp
  /** 监听事件 */
  event: T
  /** 优先级 */
  priority: number
  /** 插件触发权限 */
  permission: Permission
  /**
   * 如果无权触发插件 是否打印日志
   * - `true`: `暂无权限，只有主人才能操作`
   * - `false`: ``
   * - `string`: `自定义提示`
   */
  authFailMsg: boolean | string
  /** 打印触发插件日志方法 */
  log: Log<true>
  /** 插件方法 */
  fnc: CmdFnc<T>
}

/** 类方法命令插件 */
export interface CommandClass<
  T extends keyof MessageEventMap = keyof MessageEventMap
> extends AdapterOptions {
  /** 插件包基本属性 */
  pkg: PkgInfo
  /** 插件方法基本属性 */
  file: PluginFile<'command'>
  /** 插件子类型 */
  type: 'class'
  /** 插件正则 */
  reg: RegExp
  /** 监听事件 */
  event: T
  /** 优先级 */
  priority: number
  /** 插件触发权限 */
  permission: Permission
  /**
   * 如果无权触发插件 是否打印日志
   * - `true`: `暂无权限，只有主人才能操作`
   * - `false`: ``
   * - `string`: `自定义提示`
   */
  authFailMsg: boolean | string
  /** 插件类 */
  Cls: new () => Plugin<T>
  /** 打印触发插件日志方法 */
  log: Log<true>
}
