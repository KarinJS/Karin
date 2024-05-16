import '../adapter/kritor/index.js'
import { EventEmitter } from 'events'
import message from '../event/message.js'
import notice from '../event/notice.js'
import request from '../event/request.js'
import { segment, common, logger } from '#Karin'

class Bot extends EventEmitter {
  constructor () {
    super()
    /** 框架 */
    this.name = 'Karin'
    /**
     * Bot列表
     * @type {Object.<number|string, KarinAdapter>}
     */
    this.adapter = {}
    /** WebSocket适配器 */
    this.WebSocket = {}
    /** 错误事件 */
    this.on('error', data => logger.error(data))
    /** 消息事件 */
    this.on('message', data => message.deal(data))
    /** 通知事件 */
    this.on('notice', data => notice.deal(data))
    /** 请求事件 */
    this.on('request', data => request.deal(data))
    /** 注册bot */
    this.on('bot', data => {
      /** {uin: '1234...', adapter: class } */
      const { uid, uin, name: accountName } = data.account
      this.adapter[uid || uin] = data
      const { name, type } = data.adapter
      logger.mark(common.logger(uid || uin, `${logger.green('[机器人][注册]')}[adapter:${type}(${name})][account:${uid || uin}(${accountName})]`))
    })
    /** 注册WebSocket适配器 */
    this.on('WebSocket', data => {
      /** {url: 'ws://...', adapter: class } */
      this.WebSocket[data.url] = data.adapter
      logger.mark(`[适配器][WebSocket][注册][${data.url}]`)
    })
  }

  /**
   * 获取bot
   * @param {string} [id] - Bot的id 未传入则返回第一个Bot
   * @returns {KarinAdapter}
   */
  getBot (id = '') {
    if (id === '') {
      /** 如果没有任何Bot 产生错误 */
      if (Object.keys(this.adapter).length === 0) {
        throw new Error('找不到Bot，请先注册Bot')
      }
      return Object.values(this.adapter)[0]
    }
    return this.adapter[id]
  }

  /**
   * 发送主动消息
   * @param {string} [id] - Bot的id
   * @param {{
   *  scene: 'private' | 'group',
   *  peer: string,
   * }} contact - 目标信息
   * @param {string} contact.scene - 场景
   * @param {string} contact.peer - 目标id
   * @param {string} elements - 消息内容
   * @returns {Promise<{message_id}>}
   */
  async sendMsg (id, contact, elements, options = { recallMsg: 0, button: false, retry_count: 1 }) {
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
    let { recallMsg, button, retry_count } = options
    logger.debug(button) // 后续处理
    const bot = this.getBot(id)

    /** 先发 提升速度 */
    let msgRes = bot.SendMessage(contact, elements, retry_count)

    const reply_log = common.reply_log(elements)
    const self_id = bot.account.uid || bot.account.uin
    if (contact.scene === 'group') {
      logger.info(common.logger(self_id, `${logger.green(`Send Proactive Group ${contact.peer}: `)}${reply_log}`))
    } else {
      logger.info(common.logger(self_id, `${logger.green(`Send Proactive private ${contact.peer}: `)}${reply_log}`))
    }

    try {
      this.emit('karin:count:send', 1)
      /** 取结果 */
      msgRes = await msgRes
      logger.debug(common.logger(self_id, `回复消息结果:${JSON.stringify(msgRes, null, 2)}`))
    } catch (err) {
      logger.error(common.logger(self_id, `回复消息失败:${reply_log}`))
      logger.error(common.logger(self_id), err)
    }

    /** 快速撤回 */
    if (bot.RecallMessage && recallMsg > 0 && msgRes?.message_id) {
      setTimeout(() => bot.RecallMessage(null, msgRes.message_id), recallMsg * 1000)
    }
    return msgRes
  }
}

export default new Bot()
