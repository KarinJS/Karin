import lodash from 'lodash'
import { logger, segment, Bot, common } from '#Karin'
// eslint-disable-next-line no-unused-vars
import { KarinEvent } from './type.js'

export default class Event {
  /**
   * 处理事件，加入自定义字段
   * @param {KarinMessage|KarinNotice|KarinRequest} e - 包含消息信息的对象
   * @returns {KarinMessage|KarinNotice|KarinRequest} - 包含消息信息的对象
   */
  norm (e) {
    e.isAdmin = false
    e.isMaster = false
    e.isPrivate = false
    e.isGroup = false
    e.isGuild = false
    e.logText = ''
    e.logFnc = ''

    e.store = new Map()

    /** 加入bot */
    Object.defineProperty(e, 'bot', {
      value: Bot.adapter[e.self_id]
    })
  }

  /**
 * 根据事件类型过滤事件
 * @param {Object} e - 事件对象
 * @param {Object} v - 验证对象
 * @returns {boolean} - 是否匹配事件
 */
  filtEvent (e, v) {
    /** 事件映射表 */
    const eventMap = {
      message: () => `message.${e.type}`,
      notice: () => `notice.${e.type}`,
      request: () => `request.${e.type}`
    }

    const eventType = eventMap[e.event]()
    return eventType.includes(v.event)
  }

  /** 判断权限 */
  filterPermission (e, v) {
    if (v.permission === 'all' || !v.permission) return true

    if (v.permission === 'master') {
      if (!e.isMaster) {
        e.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (v.permission === 'admin') {
      if (!e.isAdmin) {
        e.reply('暂无权限，只有管理员才能操作')
        return false
      }
      return true
    }

    if (e.isGroup) {
      const list = {
        'group.owner': {
          role: 'owner',
          name: '群主'
        },
        'group.admin': {
          role: 'admin',
          name: '管理员'
        }

      }

      const role = list[v.permission]
      if (role && e.sender?.role !== role.role) {
        e.reply(`暂无权限，只有${role.name}才能操作`)
        return false
      }
    }

    return true
  }

  /**
   * 处理回复,捕获发送失败异常
   * @param {KarinEvent} e - 事件对象
   */
  reply (e) {
    e.replyNew = e.reply

    /**
     * @param {string|object|Array} message - 发送的消息
     * @param {object} options - 回复数据
     * @param {boolean} data.at - 是否at用户
     * @param {boolean} data.reply - 是否引用回复
     * @param {number} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
     * @param {boolean} data.button - 是否使用按钮
     * @param {number} data.retry_count - 重试次数
     */
    e.reply = async (message = '', options = { reply: false, recallMsg: 0, at: '', button: false, retry_count: 1 }) => {
      /** 将msg格式化为数组 */
      if (!Array.isArray(message)) message = typeof message == 'string' ? [segment.text(message)] : [message]

      let { reply, recallMsg, at, button, retry_count } = options
      logger.debug(button) // 后续处理
      /** 加入at */
      if (at && e.isGroup) message.unshift(segment.at(e.user_id))
      /** 加入引用回复 */
      if (reply && e.message_id) message.unshift(segment.reply(e.message_id))

      const reply_log = this.reply_log(message)

      if (e.isGroup) {
        logger.info(common.logger(e.self_id, `${logger.green(`Send Group ${e.group_id}: `)}${reply_log}`))
      } else {
        logger.info(common.logger(e.self_id, `${logger.green(`Send private ${e.user_id}: `)}${reply_log}`))
      }

      let msgRes
      try {
        msgRes = await e.replyNew(message, retry_count)
        logger.debug(common.logger(e.self_id, `回复消息结果:${JSON.stringify(msgRes, null, 2)}`))
      } catch (err) {
        logger.error(common.logger(e.self_id, `回复消息失败:${reply_log}`))
        logger.error(common.logger(e.self_id), err)
      }

      /** 快速撤回 */
      if (recallMsg > 0 && msgRes?.message_id) {
        setTimeout(() => e.bot.RecallMessage(null, msgRes.message_id), recallMsg * 1000)
      }

      return msgRes
    }
    Object.freeze(e.reply)
  }

  reply_log (message) {
    let reply_log = ''

    const fileMap = {
      image: '图片',
      record: '语音',
      file: '文件',
      video: '视频'
    }

    for (let val of message) {
      switch (val.type) {
        case 'text':
          reply_log += val.text
          break
        case 'at':
          reply_log += `[AT:${val.uid}] `
          break
        case 'face':
          reply_log += `[表情:${val.id}] `
          break
        case 'video':
        case 'image':
        case 'record':
        case 'file': {
          let file
          if (Buffer.isBuffer(val.file)) {
            file = 'Buffer://...'
          } else if (val.file.startsWith('http')) {
            file = val.file
          } else {
            file = 'base64://...'
          }
          reply_log += `[${fileMap[val.type]}:${file}] `
          break
        }
        case 'xml':
          reply_log += `[xml:${val.data}] `
          break
        case 'json':
          reply_log += `[json:${val.data}] `
          break
        case 'reply':
          reply_log += `[回复:${val.message_id}] `
          break
        default:
          reply_log += `[未知消息类型:${JSON.stringify(val)}] `
      }
    }
    return lodash.truncate(reply_log, { length: 500 })
  }
}
