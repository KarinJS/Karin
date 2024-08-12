import { listener, pluginLoader } from 'karin/core'
import { review } from './review'
import { segment, common, logger, config } from 'karin/utils'
import { GroupCfg, KarinEventTypes, AllListenEvent, PluginRule, ReplyReturn, KarinMessageType } from 'karin/types'

export class EventBaseHandler {
  e: KarinEventTypes
  /** 仅在群聊下存在 */
  config!: GroupCfg
  /**
   * - 是否打印群消息日志
   */
  GroupMsgPrint: boolean
  /**
   * 处理事件，加入自定义字段
   */
  constructor (e: KarinEventTypes) {
    this.e = e
    this.GroupMsgPrint = true
    /** 加入e.bot */
    !this.e.bot && Object.defineProperty(this.e, 'bot', { value: listener.getBot(this.e.self_id) })
    if (this.e.group_id) this.config = config.group(this.e.group_id, this.e)
  }

  /**
   * cd检查 返回false表示在cd中
   */
  getCd () {
    if (review.CD(this.e, this.config)) return true
    logger.debug(`[消息拦截][${this.e.group_id}][${this.e.user_id}] 正在冷却中`)
    return false
  }

  /**
   * 群聊黑白名单检查 返回false表示未通过
   */
  getGroupEnable () {
    if (review.GroupEnable(this.e)) return true
    logger.debug(`[消息拦截][${this.e.group_id}][${this.e.user_id}] 未通过群聊黑白名单检查`)
    return false
  }

  /**
   * 用户黑白名单检查 返回false表示未通过
   */
  getUserEnable () {
    if (review.UserEnable(this.e)) return true
    logger.debug(`[消息拦截][${this.e.group_id}][${this.e.user_id}] 未通过用户黑白名单检查`)
    return false
  }

  /**
   * 处理私聊功能 功能开启返回true
   */
  private () {
    /** 检查私聊是否开启 */
    if (this.e.user_id !== 'input' && this.e.isPrivate && !review.Private()) {
      /** 用户处于白名单 */
      if (config.Config?.private?.white_list?.includes(String(this.e.user_id))) return true
      /** 不处于白名单 检查是否存在提示词 */
      if (config.Config?.private?.tips) this.e.reply(config.Config.private.tips)
      logger.debug(`[消息拦截][${this.e.user_id}] 私聊功能未开启`)
      return false
    }
    return true
  }

  /**
   * 根据事件类型过滤事件 返回false表示未通过
   */
  filtEvent (event: AllListenEvent): boolean {
    /** 事件映射表 */
    const eventMap = {
      message: () => `message.${this.e.sub_event}`,
      message_sent: () => `message_sent.${this.e.sub_event}`,
      meta_event: () => `message.${this.e.sub_event}`,
      notice: () => `notice.${this.e.sub_event}`,
      request: () => `request.${this.e.sub_event}`,
    }

    const eventType = eventMap[this.e.event]()
    return eventType.includes(event)
  }

  /**
   * 判断权限
   */
  filterPermission (permission?: PluginRule['permission']): boolean {
    if (!permission || permission === 'all') return true

    if (permission === 'master') {
      if (!this.e.isMaster) {
        this.e.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (permission === 'admin') {
      if (!this.e.isMaster && !this.e.isAdmin) {
        this.e.reply('暂无权限，只有管理员才能操作')
        return false
      }
      return true
    }

    if (this.e.isGroup) {
      const list = {
        'group.owner': {
          role: 'owner',
          name: '群主',
        },
        'group.admin': {
          role: 'admin',
          name: '群管理员',
        },
      }

      const role = list[permission]
      if (!role) return true
      if (role.role === 'owner' && this.e.sender?.role === 'owner') return true
      if (role.role === 'admin' && (this.e.sender?.role === 'owner' || this.e.sender?.role === 'admin')) return true

      this.e.reply(`暂无权限，只有${role.name}才能操作`)
      return false
    }

    return true
  }

  /**
   * 快速回复
   */
  reply () {
    /**
     * 快速回复
     * @param elements 回复内容
     * @param options 回复选项
     */
    this.e.reply = async (elements = '', options = { reply: false, recallMsg: 0, at: false, retry_count: 1 }) => {
      const message = common.makeMessage(elements)
      /** 先调用中间件 */
      for (const info of pluginLoader.use.replyMsg) {
        try {
          let next = false
          const nextFn = () => { next = true }
          await info.fn(this.e as KarinMessageType, message, nextFn)
          if (!next) break
        } catch (e) {
          logger.error('[消息中间件] 调用失败，已跳过')
        }
      }

      const { reply = false, recallMsg = 0, at, retry_count = 1 } = options

      /** 加入at */
      if (at && this.e.isGroup) message.unshift(segment.at(this.e.user_id))

      /** 加入引用回复 */
      if (reply && 'message_id' in this.e) message.unshift(segment.reply(this.e.message_id))

      /** 先发 提升速度 */
      const result = this.e.replyCallback(message, retry_count)
      const ReplyLog = common.makeMessageLog(message)

      if (this.e.isGroup) {
        review.GroupMsgPrint(this.e) && logger.bot('info', this.e.self_id, `${logger.green(`Send Group ${this.e.group_id}: `)}${ReplyLog}`)
      } else {
        this.e.self_id !== 'input' && logger.bot('info', this.e.self_id, `${logger.green(`Send private ${this.e.user_id}: `)}${ReplyLog}`)
      }

      const request: ReplyReturn = {
        message_id: '',
        message_time: 0,
        raw_data: undefined,
      }

      try {
        listener.emit('karin:count:send', 1)
        /** 取结果 */
        const Res = await result
        request.message_id = Res.message_id || ''
        request.message_time = Res.message_time || Date.now()
        request.raw_data = Res.raw_data || undefined

        logger.bot('debug', this.e.self_id, `回复消息结果:${JSON.stringify(request)}`)
      } catch (error: any) {
        logger.bot('error', this.e.self_id, `回复消息失败:${ReplyLog}`)
        logger.bot('error', this.e.self_id, error.stack || error.message || JSON.stringify(error))
      }

      /** 快速撤回 */
      if (recallMsg > 0 && request.message_id) {
        setTimeout(() => this.e.bot.RecallMessage(this.e.contact, request.message_id), recallMsg * 1000)
      }

      return request
    }
    Object.freeze(this.e.reply)
  }
}
