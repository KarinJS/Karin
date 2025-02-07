import type { Message, MessageEventMap } from '@/types/event'
import type { NodeElement } from '@/types/segment'
import type { PluginOptions } from '@/types/plugin/class'

/** 消息事件插件类 */
export class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
  /** 插件名称 */
  name: PluginOptions<T>['name']
  /** 指令规则集 */
  rule: PluginOptions<T>['rule']
  /** 插件描述 */
  desc: PluginOptions<T>['desc']
  /** 插件事件 */
  event: T
  /** 优先级 */
  priority: PluginOptions<T>['priority']
  /** 消息事件对象 */
  e!: T extends keyof MessageEventMap ? MessageEventMap[T] : Message
  /** 调用后将继续匹配下一个插件 */
  next!: () => unknown
  /** 快速回复 */
  reply!: Message['reply']
  constructor (options: PluginOptions<T> & { event?: T }) {
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
  async replyForward (element: NodeElement[]) {
    const result = await this.e.bot.sendForwardMsg(this.e.contact, element)
    return {
      ...result,
      /** @deprecated 已废弃 请请使用 messageId */
      message_id: result.messageId,
    }
  }
}
