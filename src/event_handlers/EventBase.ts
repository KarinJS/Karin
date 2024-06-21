import Review from './review'
import config from '../core/Config'
import logger from '../core/logger'
import Listeners from '../core/Listener'
import { GroupCfg } from '../types/Config'
import { KarinMessage } from '../event/KarinMessage'
import { KarinNotice } from '../event/KarinNotice'
import { KarinRequest } from '../event/KarinRequest'
import { Event, Permission } from '../types/Types'

export default class EventBase {
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
  filtEvent(event: Event): boolean {
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
  filterPermission(permission: Permission): boolean {
    if (permission === 'all' || !permission) return true

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

  // /**
  //  * 快速回复
  //  */
  // reply() {
  //   /**
  //    * @param {string|object|Array} elements - 发送的消息
  //    * @param {object} options - 回复数据
  //    * @param {boolean} options.at - 是否at用户
  //    * @param {boolean} options.reply - 是否引用回复
  //    * @param {number} options.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
  //    * @param {boolean} options.button - 是否使用按钮
  //    * @param {number} options.retry_count - 重试次数
  //    * @returns {Promise<{ message_id?: string }>} - 返回消息ID
  //    */
  //   this.e.reply = async (elements = '', options = { reply: false, recallMsg: 0, at: false, retry_count: 1 }) => {
  //     /** 将msg格式化为数组 */
  //     if (!Array.isArray(elements)) {
  //       elements = [elements]
  //     }
  //     elements = elements.map(element => {
  //       if (typeof element === 'string') {
  //         return segment.text(element)
  //       }
  //       return element
  //     })
  //     const { reply, recallMsg, at, retry_count } = options

  //     /** 加入at */
  //     if (at && this.e.isGroup) elements.unshift(segment.at(this.e.user_id))
  //     /** 加入引用回复 */
  //     if (reply && this.e.message_id) elements.unshift(segment.reply(this.e.message_id))

  //     /** 先发 提升速度 */
  //     let msgRes = this.e.replyCallback(elements, retry_count)
  //     const reply_log = common.makeMessageLog(elements)

  //     if (this.e.isGroup) {
  //       Review.GroupMsgPrint(this.e) && logger.bot('info', this.e.self_id, `${logger.green(`Send Group ${this.e.group_id}: `)}${reply_log}`)
  //     } else {
  //       logger.bot('info', this.e.self_id, `${logger.green(`Send private ${this.e.user_id}: `)}${reply_log}`)
  //     }

  //     try {
  //       Listeners.emit('karin:count:send', 1)
  //       /** 取结果 */
  //       msgRes = await msgRes
  //       logger.bot('debug', this.e.self_id, `回复消息结果:${JSON.stringify(msgRes)}`)
  //     } catch (err) {
  //       logger.bot('error', this.e.self_id, `回复消息失败:${reply_log}`)
  //       logger.bot('error', this.e.self_id, err)
  //     }

  //     /** 快速撤回 */
  //     if (recallMsg > 0 && msgRes?.message_id) {
  //       setTimeout(() => this.e.bot.RecallMessage(this.e.contact, msgRes.message_id), recallMsg * 1000)
  //     }

  //     return msgRes
  //   }
  //   Object.freeze(this.e.reply)
  // }
}
