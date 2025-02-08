import type { AdapterProtocol } from '../adapter'
import type { MessageEventMap, Permission } from '../event'

export interface PluginRule {
  /** 命令正则 */
  reg: string | RegExp
  /** 命令执行方法名称 */
  fnc: string
  /** 监听子事件 */
  event?: keyof Omit<MessageEventMap, 'message'>
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
  * 如果无权触发插件 是否打印日志
  * - `true`: `暂无权限，只有主人才能操作`
  * - `false`: ``
  * - `string`: `自定义提示`
  */
  authFailMsg?: boolean | string
}

export interface PluginOptions<T extends keyof MessageEventMap> {
  /** 插件名称 */
  name: string
  /** 插件描述 */
  desc?: string
  /** 插件事件 */
  event?: T
  /** 优先级 */
  priority?: number
  /** 指令规则 */
  rule: PluginRule[]
}
