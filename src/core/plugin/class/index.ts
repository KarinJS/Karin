import { AdapterProtocol } from '@/adapter/adapter'
import type { Message } from '@/event'
import type { NodeElementType } from '@/adapter/segment'
import type { BaseEventHandle, MessageEventMap } from '@/event/types/types'
import { PermissionEnum } from '@/adapter/sender'

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
  permission?: `${PermissionEnum}`
  /** 打印日志 默认为true */
  log?: boolean
  /** 生效的适配器 */
  adapter?: AdapterProtocol[]
  /** 禁用的适配器 */
  dsbAdapter?: AdapterProtocol[]
}

export interface PluginOptions {
  /** 插件名称 */
  name: string
  /** 插件描述 */
  desc?: string
  /** 插件事件 */
  event?: keyof MessageEventMap
  /** 优先级 */
  priority?: number
  /** 指令规则 */
  rule: PluginRule[]
}

/** 消息事件插件类 */
export class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
  /** 插件名称 */
  name: PluginOptions['name']
  /** 指令规则集 */
  rule: PluginOptions['rule']
  /** 插件描述 */
  desc: PluginOptions['desc']
  /** 插件事件 */
  event: T
  /** 优先级 */
  priority: PluginOptions['priority']
  /** 消息事件对象 */
  e!: T extends keyof MessageEventMap ? MessageEventMap[T] : Message
  /** 快速回复 */
  reply!: BaseEventHandle['reply']

  constructor (options: PluginOptions & { event?: T }) {
    const { name, rule } = options
    this.name = name
    this.rule = rule
    this.desc = options.desc || '无描述'
    this.event = (options.event || 'message') as T
    this.priority = options.priority || 10000
  }

  /**
   * 快速回复合并转发
   * @param element 合并转发消息元素节点
   */
  async replyForward (element: NodeElementType[]) {
    const result = await this.e.bot.sendForwardMsg(this.e.contact, element)
    return {
      ...result,
      /** @deprecated 已废弃 请请使用 messageId */
      message_id: result.messageId,
    }
  }
}
