import '../adapter/kritor/index.js'
import { EventEmitter } from 'events'
import KarinMessage from '../event/message.js'
import KarinNotice from '../event/notice.js'
import KarinRequest from '../event/request.js'
import { segment, common, logger, Cfg, redis } from '#Karin'

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
    this.on('message', data => new KarinMessage(data))
    /** 通知事件 */
    this.on('notice', data => new KarinNotice(data))
    /** 请求事件 */
    this.on('request', data => new KarinRequest(data))

    /** 注册bot */
    this.on('bot', data => {
      /** {uin: '1234...', adapter: class } */
      const { uid, uin, name: accountName } = data.account
      this.adapter[uid || uin] = data
      const { name, type } = data.adapter
      logger.mark(common.logger(uid || uin, `${logger.green('[机器人][注册]')}[adapter:${type}(${name})][account:${uid || uin}(${accountName})]`))
      this.#online(uid || uin)
    })

    /** 注册WebSocket适配器 */
    this.on('WebSocket', data => {
      /** {url: 'ws://...', adapter: class } */
      this.WebSocket[data.url] = data.adapter
      logger.mark('[适配器][WebSocket][注册]: ' + logger.green(`ws://localhost://${Cfg.Server.http.port}/${data.url}`))
    })
  }

  /**
   * 发送上线通知
   */
  async #online (uid) {
    /** 暂时只支持redis */
    if (!redis) return
    /** 重启 */
    const key = `karin:restart:${uid}`
    const options = await redis.get(key)
    if (!options) return
    const { id, contact, time, message_id } = JSON.parse(options)
    /** 重启花费时间 保留2位小数 */
    const restartTime = ((Date.now() - time) / 1000).toFixed(2)
    const element = [
      segment.reply(message_id),
      segment.text(`Karin 重启成功：${restartTime}秒`)
    ]
    await this.sendMsg(id, contact, element)
    await redis.del(key)
    return true
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
   * @param {KarinContact} contact - 目标信息
   * @param {Array<KarinElement|string>|KarinElement|string} elements - 消息内容
   * @param {options} options - 消息选项
   * @typedef options
   * @property {number} recallMsg - 发送成功后撤回消息时间
   * @property {boolean} button - 是否有按钮 todo
   * @property {number} retry_count - 重试次数
   * @returns {Promise<{message_id}>}
   */
  async sendMsg (id, contact, elements, options = { recallMsg: 0, button: false, retry_count: 1 }) {
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
