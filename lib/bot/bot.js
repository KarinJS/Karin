import '../adapter/kritor/index.js'
import { EventEmitter } from 'events'
import logger from '../config/log.js'
import message from '../event/message.js'
import notice from '../event/notice.js'
import request from '../event/request.js'
import common from '../common/common.js'

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
      logger.mark(common.logger(uid || uin, `${logger.green('[机器人][注册]')}[adapter:${type}(${name})][account:${uid || uin}(${accountName})`))
    })
    /** 注册WebSocket适配器 */
    this.on('WebSocket', data => {
      /** {url: 'ws://...', adapter: class } */
      this.WebSocket[data.url] = data.adapter
      logger.mark(`[适配器][WebSocket][注册][${data.url}]`)
    })
  }
}

export default new Bot()
