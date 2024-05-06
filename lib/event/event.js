import lodash from 'lodash'
import { logger, segment, Bot, common } from '#Karin'
// eslint-disable-next-line no-unused-vars
import { KarinEvent } from '../bot/KarinEvent.js'

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
      message: () => `message.${e.sub_type}`,
      notice: () => `notice.${e.sub_type}`,
      request: () => `request.${e.sub_type}`
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
   * 快速回复
   * @param {KarinEvent} e - 事件对象
   */
  reply (e) {
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
    e.reply = async (elements = '', options = { reply: false, recallMsg: 0, at: false, button: false, retry_count: 1 }) => {
      /** 将msg格式化为数组 */
      if (!Array.isArray(elements)) {
        elements = [elements]
      }
      elements = elements.map(element => {
        if (typeof element == 'string') {
          return segment.text(element)
        }
        return element
      })
      let { reply, recallMsg, at, button, retry_count } = options
      logger.debug(button) // 后续处理
      /** 加入at */
      if (at && e.isGroup) elements.unshift(segment.at(e.user_id))
      /** 加入引用回复 */
      if (reply && e.message_id) elements.unshift(segment.reply(e.message_id))

      /** 先发 提升速度 */
      let msgRes = e.replyCallback(elements, retry_count)
      const reply_log = this.reply_log(elements)

      if (e.isGroup) {
        logger.info(common.logger(e.self_id, `${logger.green(`Send Group ${e.group_id}: `)}${reply_log}`))
      } else {
        logger.info(common.logger(e.self_id, `${logger.green(`Send private ${e.user_id}: `)}${reply_log}`))
      }

      try {
        Bot.emit('karin:count:send', 1)
        /** 取结果 */
        msgRes = await msgRes
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
    const logs = []

    for (let val of message) {
      switch (val.type) {
        case 'text':
          logs.push(val.text)
          break
        case 'face':
          logs.push(`[face:${val.id}]`)
          break
        case 'video':
        case 'image':
        case 'voice':
        case 'record':
        case 'file': {
          let file
          if (Buffer.isBuffer(val.file)) {
            file = 'Buffer://...'
          } else if (/^http|^file/.test(val.file)) {
            file = val.file
          } else {
            file = 'base64://...'
          }
          logs.push(`[${val.type}:${file}]`)
          break
        }
        case 'at':
          logs.push(`[at:${val.uid}]`)
          break
        case 'rps':
          logs.push(`[rps:${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice:${val.id}]`)
          break
        case 'shake':
          logs.push('[shake:窗口抖动]')
          break
        case 'poke':
          logs.push(`[poke:${val.id}]`)
          break
        case 'anonymous':
          logs.push(`[anonymous:${val.ignore}]`)
          break
        case 'share':
          logs.push(`[share:${JSON.stringify(val)}]`)
          break
        case 'contact':
          logs.push(`[contact:${JSON.stringify(val)}]`)
          break
        case 'location':
          logs.push(`[location:${JSON.stringify(val)}]`)
          break
        case 'music':
          logs.push(`[music:${JSON.stringify(val)}]`)
          break
        case 'reply':
          logs.push(`[reply:${val.message_id}]`)
          break
        case 'forward':
          logs.push(`[forward:${val.id}]`)
          break
        case 'node':
          logs.push(`[node:${JSON.stringify(val)}]`)
          break
        case 'xml':
          logs.push(`[xml:${val.data}]`)
          break
        case 'json':
          logs.push(`[json:${val.data}]`)
          break
        case 'markdown': {
          if (val.content) {
            logs.push(`[markdown:${val.content}]`)
          } else {
            let content = { id: val.custom_template_id }
            for (let v of val.params) content[v.key] = v.values[0]
            logs.push(`[markdown:${JSON.stringify(content)}]`)
          }
          break
        }
        case 'rows': {
          const rows = []
          for (let v of val.rows) rows.push(v.log)
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${val.log}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }
    return lodash.truncate(logs.join(''), { length: 500 })
  }
}
