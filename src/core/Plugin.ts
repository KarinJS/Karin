import { KarinElement, KarinNodeElement } from '../types/Element'

/**
 * 上下文状态
 */
export const stateArr: {
  [key: string]: {
    /**
     * @param plugin - 插件实例
     */
    plugin: plugin
    /**
     * @param fnc - 执行方法名称
     */
    fnc: string
  }
} = {}

/**
 * 插件基类
 */
export default class plugin {
  e: any

  /**
   * @param name - 插件名称
   */
  name: string
  /**
   * @param dsc - 插件描述
   */
  dsc?: string
  /**
   * @param event - 监听事件
   */
  event: 'message' | 'request' | 'notice' | 'meta_event'
  /**
   * @param priority - 优先级 默认5000
   */
  priority: number
  /**
   * @param task - 定时任务
   */
  task: {
    /**
     * @param name - 定时任务名称
     */
    name: string
    /**
     * @param cron - 定时任务cron表达式
     */
    cron: string
    /**
     * @param fnc - 定时任务方法名
     */
    fnc: string
    /**
     * @param log - 是否显示执行日志
     */
    log?: boolean
  }[]
  /**
   * @param rule - 命令规则
   */
  rule: {
    /**
     * @param reg - 命令正则
     */
    reg: string
    /**
     * @param fnc - 命令执行方法
     */
    fnc: string
    /**
     * @param event - 子事件
     */
    event?: string
    /**
     * @param log - 是否显示执行日志
     */
    log?: boolean
    /**
     * @param permission - 子权限
     */
    permission?: 'master' | 'admin' | 'group.owner' | 'group.admin' | 'all'
  }[]
  /**
   * @param button - 按钮
   */
  button: {
    /**
     * @param key - 按钮命令正则
     */
    key: string
    /**
     * @param fnc - 按钮执行方法
     */
    fnc: string
    /**
     * @param priority - 按钮优先级
     */
    priority: number
  }[]
  /**
   * @param handler - handler
   */
  handler: {
    /**
     * @param key - handler支持的事件key
     */
    key: string
    /**
     * @param fnc - handler的处理fnc
     */
    fnc: string
    /**
     * @param priority - handler优先级
     */
    priority?: number
  }[]
  /**
   * @param userId - 用户ID 一般上下文使用
   */
  userId?: string
  /**
   * @param timeout - 上下文超时
   */
  timeout: NodeJS.Timeout | undefined

  constructor({
    name,
    dsc,
    event = 'message',
    priority = 5000,
    task = [],
    rule = [],
    handler = [],
    button = [],
  }: {
    name: string
    dsc: any
    event?: 'message' | 'request' | 'notice' | 'meta_event'
    priority?: number
    task?: {
      name: string
      cron: string
      fnc: string
      log?: boolean
    }[]
    rule?: {
      reg: string
      fnc: string
      event?: string
      log?: boolean
      permission?: 'master' | 'admin' | 'group.owner' | 'group.admin' | 'all'
    }[]
    handler?: {
      key: string
      fnc: string
      priority?: number
    }[]
    button?: {
      key: string
      fnc: string
      priority: number
    }[]
  }) {
    this.name = name
    this.dsc = dsc
    this.event = event
    this.priority = priority
    this.task = task
    this.rule = rule
    this.button = button
    this.handler = handler
  }

  /**
   * - 快速回复
   */
  reply(
    msg: string | KarinElement | Array<KarinElement> = '',
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
    } = { reply: false, recallMsg: 0, at: false, button: false, retry_count: 1 },
  ): Promise<{
    /**
     * @param message_id - 消息发送成功返回的消息ID
     */
    message_id?: string
  }> {
    return this.e.reply(msg, options)
  }

  /**
   * - 快速回复合并转发
   */
  async replyForward(msg: Array<KarinNodeElement>) {
    await this.e.bot.sendForwardMessage(this.e.contact, msg)
  }

  /**
   * - 构建上下文键
   */
  conKey(): string {
    return `${this.e.isGroup ? `${this.e.group_id}.` : ''}` + (this.userId || this.e.user_id)
  }

  /**
   * 设置上下文状态
   */
  setContext(
    /**
     * @param fnc - 执行方法
     */
    fnc: string,
    /**
     * @param reply - 超时后是否回复
     */
    reply = true,
    /**
     * @param time - 超时时间，默认120秒
     */
    time = 120,
  ) {
    const key = this.conKey()
    stateArr[key] = { plugin: this, fnc }
    /** 操作时间 */
    this.timeout = setTimeout(() => {
      if (stateArr[key]) {
        delete stateArr[key]
        if (reply) this.e.reply('操作超时已取消', { at: true })
      }
    }, time * 1000)
  }

  /**
   * 获取上下文状态
   */
  getContext(): {
    /**
     * @param plugin - 插件实例
     */
    plugin: plugin
    /**
     * @param fnc - 执行方法名称
     */
    fnc: string
  } {
    const key = this.conKey()
    return stateArr[key]
  }

  /**
   * 清除上下文状态
   */
  finish() {
    const key = this.conKey()
    if (stateArr[key] && stateArr[key]) {
      /** 清除定时器 */
      clearTimeout(this.timeout)
      delete stateArr[key]
    }
  }
}
