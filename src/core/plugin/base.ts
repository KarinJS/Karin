import { PluginType, KarinElement, NodeElement, EventType, stateArrType, KarinNoticeType, KarinRequestType, ReplyReturn, EType } from '../../types'

/**
 * 插件基类
 */
export class Plugin implements PluginType {
  /**
   * @param name - 插件名称
   */
  name: PluginType['name']
  /**
   * @param desc - 插件描述
   */
  desc: PluginType['desc']
  /**
   * @param event - 监听事件 仅支持消息事件 其他事件请使用accept
   */
  event: PluginType['event']
  /**
   * @param priority - 优先级 默认10000
   */
  priority: PluginType['priority']
  /**
   * @param task - 定时任务 即将废弃 请使用karin.task
   * @deprecated
   */
  task: PluginType['task']
  /**
   * @param rule - 命令规则
   */
  rule: PluginType['rule']
  /**
   * @param handler - handler 已废弃 请使用karin.handler
   * @deprecated
   */
  handler: PluginType['handler']
  /**
   * @param userId - 用户ID 一般上下文使用
   */
  userId?: PluginType['userId']
  /**
   * @param timeout - 上下文超时
   */
  timeout: PluginType['timeout']

  constructor ({
    name,
    desc = name,
    event = EventType.Message,
    priority = 10000,
    task = [],
    rule = [],
    handler = [],
  }: {
    /** 插件名称 */
    name: string
    /** 插件描述 没有则默认为插件名称 */
    desc?: string
    /** 监听事件 默认为message */
    event?: PluginType['event']
    /** 优先级 默认为10000 */
    priority?: PluginType['priority']
    /**
     * - 定时任务 即将废弃 请使用karin.task
     * @deprecated
     */
    task?: PluginType['task']
    /** 命令规则 */
    rule?: PluginType['rule']
    /**
     * - handler 已废弃 请使用karin.handler
     * @deprecated
     */
    handler?: PluginType['handler']
  }) {
    this.name = name
    this.desc = desc
    this.event = event
    this.priority = priority
    this.task = task
    this.rule = rule
    this.handler = handler
  }

  /** 快速回复 */
  reply (
    msg: string | KarinElement | Array<KarinElement | string> = '',
    options: {
      /**
       * @param at - 是否at用户
       * @default false
       */
      at?: boolean
      /**
       * @param reply - 是否引用回复
       * @default false
       */
      reply?: boolean
      /**
       * @param recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
       * @default 0
       */
      recallMsg?: number
      /**
       * @param button - 是否使用按钮
       * @default false
       */
      button?: boolean
      /**
       * @param retry_count - 重试次数
       * @default 1
       */
      retry_count?: number
    } = { reply: false, recallMsg: 0, at: false, button: false, retry_count: 1 }
  ): Promise<ReplyReturn> {
    return this.e.reply(msg, options)
  }

  /** 快速回复合并转发 */
  async replyForward (msg: NodeElement[]): Promise<{ message_id: string }> {
    const result = await this.e.bot.sendForwardMessage(this.e.contact, msg)
    return result
  }

  /**
   * - 已废弃 请使用karin.ctx
   * - 构建上下文键
   * @deprecated
   */
  conKey (): string {
    return `${this.e.isGroup ? `${this.e.group_id}.` : ''}` + (this.userId || this.e.user_id)
  }

  /**
   * - 已废弃 请使用karin.ctx
   * - 设置上下文状态
   * @deprecated
   */
  setContext (
    /**
     * @param fnc - 执行方法
     */
    fnc: string | Function,
    /**
     * @param reply - 超时后是否回复
     */
    reply = true,
    /**
     * @param time - 超时时间，默认120秒
     */
    time = 120
  ) {
    const key = this.conKey()

    if (typeof fnc === 'string') {
      stateArr[key] = { type: 'class', fnc: this, name: fnc }
    } else {
      stateArr[key] = { type: 'fnc', fnc }
    }

    /** 操作时间 */
    this.timeout = setTimeout(() => {
      if (stateArr[key]) {
        delete stateArr[key]
        if (reply) this.e.reply('操作超时已取消', { at: true })
      }
    }, time * 1000)
  }

  /**
   * - 已废弃 请使用karin.ctx
   * - 获取上下文状态
   */
  getContext (): stateArrType[string] {
    const key = this.conKey()
    return stateArr[key]
  }

  /**
   * - 已废弃 请使用karin.ctx
   * - 清除上下文状态
   * @deprecated
   */
  finish () {
    const key = this.conKey()
    if (stateArr[key] && stateArr[key]) {
      /** 清除定时器 */
      clearTimeout(this.timeout)
      delete stateArr[key]
    }
  }

  e!: EType<this>
  replyCallback!: PluginType['replyCallback']
}

/**
 * 上下文状态
 */
export const stateArr: stateArrType = {}

/**
 * 通知事件 插件类型
 */
export interface ExtendedPlugin extends Plugin {
  accept: (e: KarinNoticeType | KarinRequestType) => Promise<void>
}

/**
 * @description 即将废弃，请使用 `Plugin`
*/
export const plugin = Plugin
