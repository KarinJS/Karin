// import { MessageCallback } from '@/core/karin/command'
import type { AdapterProtocol } from '../adapter'
import type { MessageEventMap, Permission } from '../event'

type FNC<T> = (e: T, next: () => void) => void | Promise<void>

interface RuleItemBase {
  /** 命令正则 */
  reg: string | RegExp
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

/**
 * 插件规则项
 * @template T 事件类型
 */
export type PluginRuleItem<T extends keyof MessageEventMap = never> = T extends never
  ? RuleItemBase & {
    /** 事件类型 */
    event?: never
    /** 处理函数 */
    fnc: FNC<MessageEventMap['message']>
  }
  : RuleItemBase & {
    /** 事件类型 */
    event: T
    /** 处理函数 */
    fnc: FNC<MessageEventMap[T]>
  }

/**
 * @class
 * @description 插件配置
 */
export type PluginOptions = {
  [K in keyof MessageEventMap]: {
    /** 插件名称 */
    name: string
    /** 插件描述 */
    desc?: string
    /** 插件父事件 */
    event?: K
    /** 优先级 */
    priority?: number
    /** 指令规则 */
    rule: Array<
      | PluginRuleItem<K>
      | { [P in keyof MessageEventMap]: PluginRuleItem<P> & { event: P } }[keyof MessageEventMap]
    >
  }
}[keyof MessageEventMap]
