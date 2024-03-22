import { EventEmitter } from 'events'
import logger from './log.js'
import loader from '../plugins/loader.js'
import message from '../event/message.js'

class Bot extends EventEmitter {
  constructor () {
    super()
    /** 初始化事件 */
    this.on('init', data => this.init())
    /** 错误事件 */
    this.on('error', data => logger.error(data))
    /** 元事件 */
    this.on('meta_event', data => logger.debug(data))
    /** 消息事件 */
    this.on('message', data => message.deal(data))
    /** 通知事件 */
    this.on('notice', data => logger.debug(data))
    /** 请求事件 */
    this.on('request', data => logger.debug(data))

    /** Bot列表 */
    this.adapter = {}
  }

  /** 初始化 */
  async init () {
    /** 加载插件 */
    await loader.load()
  }
}

export default new Bot()
