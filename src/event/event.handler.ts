import { listener } from 'karin/core'
import { review } from './review.handler'
import { segment, common, logger, config } from 'karin/utils'
import { GroupCfg, KarinEventTypes, AllListenEvent, PluginRule } from 'karin/types'

export default class EventHandler {
  e: KarinEventTypes
  config: GroupCfg | {}
  /**
   * - 是否打印群消息日志
   */
  GroupMsgPrint: boolean
  /**
   * 处理事件，加入自定义字段
   */
  constructor (e: KarinEventTypes) {
    this.e = e
    this.config = {}
    this.GroupMsgPrint = false
    /** 加入e.bot */
    !this.e.bot && Object.defineProperty(this.e, 'bot', { value: listener.getBot(this.e.self_id) })
    if (this.e.group_id) this.config = config.group(this.e.group_id)
  }

  /**
   * 事件处理
   */
  review () {
    /** 检查CD */
    if (!review.CD(this.e, this.config as GroupCfg)) {
      logger.debug('[消息拦截] 正在冷却中')
      return true
    }

    /** 检查群聊黑白名单 */
    if (!review.GroupEnable(this.e)) {
      logger.debug('[消息拦截] 未通过群聊黑白名单检查')
      return true
    }

    /** 检查用户黑白名单 */
    if (!review.UserEnable(this.e)) {
      logger.debug('[消息拦截] 未通过用户黑白名单检查')
      return true
    }

    /** 都通过了 */
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
      logger.debug('[消息拦截] 私聊功能未开启')
      return false
    }
    return true
  }

  /**
   * 根据事件类型过滤事件
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

      let message_id = ''

      try {
        listener.emit('karin:count:send', 1)
        /** 取结果 */
        const Res = await result
        message_id = Res.message_id || ''
        logger.bot('debug', this.e.self_id, `回复消息结果:${JSON.stringify(result)}`)
      } catch (error: any) {
        logger.bot('error', this.e.self_id, `回复消息失败:${ReplyLog}`)
        logger.bot('error', this.e.self_id, error.stack || error.message || JSON.stringify(error))
      }

      /** 快速撤回 */
      if (recallMsg > 0 && message_id) {
        setTimeout(() => this.e.bot.RecallMessage(this.e.contact, message_id), recallMsg * 1000)
      }

      return result
    }
    Object.freeze(this.e.reply)
  }
}
