import Review from './review.handler'
import config from '../utils/config'
import logger from '../utils/logger'
import Common from '../utils/common'
import Segment from '../utils/segment'
import Listeners from '../core/listener'
import { GroupCfg } from '../types/config'
import { KarinMessage } from './message'
import { KarinNotice } from './notice'
import { KarinRequest } from './request'
import { Event, Permission, Sub_event } from '../types/types'

export default class EventHandler {
  e: KarinMessage | KarinNotice | KarinRequest
  config: GroupCfg | {}
  /**
   * 处理事件，加入自定义字段
   */
  constructor(e: KarinMessage | KarinNotice | KarinRequest) {
    this.e = e
    this.config = {}
    /** 加入e.bot */
    Object.defineProperty(this.e, 'bot', { value: Listeners.getBot(this.e.self_id) })
    if (this.e.group_id) this.config = config.group(this.e.group_id)
  }

  /**
   * 事件处理
   */
  review() {
    /** 检查CD */
    if (!Review.CD(this.e, this.config as GroupCfg)) {
      logger.debug('[消息拦截] 正在冷却中')
      return true
    }

    /** 检查群聊黑白名单 */
    if (!Review.GroupEnable(this.e)) {
      logger.debug('[消息拦截] 未通过群聊黑白名单检查')
      return true
    }

    /** 检查用户黑白名单 */
    if (!Review.UserEnable(this.e)) {
      logger.debug('[消息拦截] 未通过用户黑白名单检查')
      return true
    }

    /** 都通过了 */
    return false
  }

  /**
   * 根据事件类型过滤事件
   */
  filtEvent(event: Event | `${Event}.${Sub_event}`): boolean {
    /** 事件映射表 */
    const eventMap = {
      message: () => `message.${this.e.sub_event}`,
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
  filterPermission(permission: Permission | undefined): boolean {
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
      if (role && this.e.sender?.role !== role.role) {
        this.e.reply(`暂无权限，只有${role.name}才能操作`)
        return false
      }
    }

    return true
  }

  /**
   * 快速回复
   */
  reply() {
    /**
     * 快速回复
     * @param elements 回复内容
     * @param options 回复选项
     */
    this.e.reply = async (elements = '', options = { reply: false, recallMsg: 0, at: false, retry_count: 1 }) => {
      const message = Common.makeMessage(elements)
      const { reply = false, recallMsg = 0, at, retry_count = 1 } = options

      /** 加入at */
      if (at && this.e.isGroup) message.unshift(Segment.at(this.e.user_id))

      /** 加入引用回复 */
      if (reply && 'message_id' in this.e) message.unshift(Segment.reply(this.e.message_id))

      /** 先发 提升速度 */
      const result = this.e.replyCallback(message, retry_count)
      const ReplyLog = Common.makeMessageLog(message)

      if (this.e.isGroup) {
        Review.GroupMsgPrint(this.e) && logger.bot('info', this.e.self_id, `${logger.green(`Send Group ${this.e.group_id}: `)}${ReplyLog}`)
      } else {
        logger.bot('info', this.e.self_id, `${logger.green(`Send private ${this.e.user_id}: `)}${ReplyLog}`)
      }

      let message_id = ''

      try {
        Listeners.emit('karin:count:send', 1)
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
