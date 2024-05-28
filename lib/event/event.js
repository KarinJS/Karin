/* eslint-disable no-unused-vars */
import Review from './review.js'
import { logger, segment, Bot, common, Cfg } from '#Karin'
import { KarinEvent } from '../bot/KarinEvent.js'
import { KarinMessage } from '../bot/KarinMessage.js'
import { KarinNotice } from '../bot/KarinNotice.js'
import { KarinRequest } from '../bot/KarinRequest.js'

export default class Event {
  /**
   * 处理事件，加入自定义字段
   * @param {KarinEvent|KarinMessage|KarinNotice|KarinRequest} e - 包含消息信息的对象
   */
  constructor (e) {
    this.e = e
    this.e.isAdmin = false
    this.e.isMaster = false
    this.e.isPrivate = false
    this.e.isGroup = false
    this.e.isGuild = false
    this.e.logText = ''
    this.e.logFnc = ''
    this.e.store = new Map()
    this.config = {}
    /** 加入e.bot */
    Object.defineProperty(this.e, 'bot', { value: Bot.adapter[this.e.self_id] })
    if (this.e.group_id) this.config = Cfg.group(e.group_id)
  }

  /**
   * 事件处理
   */
  review () {
    /** 检查CD */
    if (!Review.CD(this.e, this.config)) {
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
   * @param {string} event - 验证对象
   * @returns {boolean} - 是否匹配事件
   */
  filtEvent (event) {
    /** 事件映射表 */
    const eventMap = {
      message: () => `message.${this.e.sub_type}`,
      notice: () => `notice.${this.e.sub_type}`,
      request: () => `request.${this.e.sub_type}`
    }

    const eventType = eventMap[this.e.event]()
    return eventType.includes(event)
  }

  /**
   * 判断权限
   * @param {'all'|'master'|'admin'|'group.owner'|'group.admin'} permission - 权限
   * @returns {boolean} - 是否有权限
   */
  filterPermission (permission) {
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
          name: '群主'
        },
        'group.admin': {
          role: 'admin',
          name: '群管理员'
        }

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
  reply () {
    /**
     * @param {string|object|Array} elements - 发送的消息
     * @param {object} options - 回复数据
     * @param {boolean} options.at - 是否at用户
     * @param {boolean} options.reply - 是否引用回复
     * @param {number} options.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
     * @param {boolean} options.button - 是否使用按钮
     * @param {number} options.retry_count - 重试次数
     * @returns {Promise<{ message_id?: string }>} - 返回消息ID
     */
    this.e.reply = async (elements = '', options = { reply: false, recallMsg: 0, at: false, button: false, retry_count: 1 }) => {
      /** 将msg格式化为数组 */
      if (!Array.isArray(elements)) {
        elements = [elements]
      }
      elements = elements.map(element => {
        if (typeof element === 'string') {
          return segment.text(element)
        }
        return element
      })
      let { reply, recallMsg, at, button, retry_count } = options
      logger.debug(button) // 后续处理
      /** 加入at */
      if (at && this.e.isGroup) elements.unshift(segment.at(this.e.user_id))
      /** 加入引用回复 */
      if (reply && this.e.message_id) elements.unshift(segment.reply(this.e.message_id))

      /** 先发 提升速度 */
      let msgRes = this.e.replyCallback(elements, retry_count)
      const reply_log = common.reply_log(elements)

      if (this.e.isGroup) {
        Review.GroupMsgPrint(this.e) && logger.bot('info', this.e.self_id, `${logger.green(`Send Group ${this.e.group_id}: `)}${reply_log}`)
      } else {
        logger.bot('info', this.e.self_id, `${logger.green(`Send private ${this.e.user_id}: `)}${reply_log}`)
      }

      try {
        Bot.emit('karin:count:send', 1)
        /** 取结果 */
        msgRes = await msgRes
        logger.bot('debug', this.e.self_id, `回复消息结果:${JSON.stringify(msgRes)}`)
      } catch (err) {
        logger.bot('error', this.e.self_id, `回复消息失败:${reply_log}`)
        logger.bot('error', this.e.self_id, err)
      }

      /** 快速撤回 */
      if (recallMsg > 0 && msgRes?.message_id) {
        setTimeout(() => this.e.bot.RecallMessage(null, msgRes.message_id), recallMsg * 1000)
      }

      return msgRes
    }
    Object.freeze(this.e.reply)
  }

  /**
   * @type {{
   *  GroupCD: number,
   *  GroupUserCD: number,
   *  mode: '0'|'1'|'2'|'3'|'4'|'5',
   *  ailas: string[],
   *  enable: string[],
   *  disable: string[]
   * }}
   */
  config
}
