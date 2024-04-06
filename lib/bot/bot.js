import '../adapter/kritor/index.js'
import { EventEmitter } from 'events'
import loader from '../plugins/loader.js'
import logger from '../config/log.js'
import message from '../event/message.js'
import notice from '../event/notice.js'

class Bot extends EventEmitter {
  constructor () {
    super()
    /** 框架 */
    this.frame = 'Karin'
    /** Bot列表 */
    this.adapter = {}
    /** WebSocket适配器 */
    this.WebSocket = {}
    /** 初始化事件 */
    this.on('init', data => this.init())
    /** 错误事件 */
    this.on('error', data => logger.error(data))
    /** 消息事件 */
    this.on('message', data => message.deal(data))
    /** 通知事件 */
    this.on('notice', data => notice.deal(data))
    /** 请求事件 */
    this.on('request', data => notice.deal(data))
    /** 注册bot */
    this.on('bot', data => {
      /** {uin: '1234...', adapter: class } */
      this.adapter[data.account.uin || data.account.uin] = data
      logger.mark(`[注册Bot] [ID: ${data.account.uin}]`)
    })
    /** 注册WebSocket适配器 */
    this.on('WebSocket', data => {
      /** {url: 'ws://...', adapter: class } */
      this.WebSocket[data.url] = data.adapter
      logger.mark(`[注册WebSocket适配器] [path: ${data.url}]`)
    })
  }

  /** 初始化 */
  async init () {
    /** 加载插件 */
    await loader.load()
  }
}

export default new Bot()
