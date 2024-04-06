import { EventEmitter } from 'events'
import { kritor } from './protos/compiled.js'

export default class extends EventEmitter {
  constructor (grpc) {
    super()
    /** grpc */
    this.grpc = grpc
    /** 自增 */
    this.seq = 0
    /** 监听响应事件 */
    grpc.on('data', data => this.emit(data.seq, data))
    /** 账户信息 */
    this.account = {
      /** uid目前并未普及，还是使用uin作为bot_id */
      uid: '',
      uin: '',
      name: ''
    }
    /** 适配器信息 */
    this.adapter = {
      type: 'QQ',
      name: 'Kritor',
      /** 启动时间 */
      start_time: Date.now()
    }
  }

  /** 获取当前账户的信息 */
  async GetCurrentAccount () {
    /** 序列化 */
    const buf = kritor.core.GetCurrentAccountRequest.encode({}).finish()
    let data = await this.SendApi('CoreService.GetCurrentAccount', buf)
    /** 反序 */
    const res = kritor.core.GetCurrentAccountResponse.decode(data.buf)
    /** 统一使用str */
    res.accountUin = String(res.accountUin)
    return res
  }

  /**
   * 发送消息
   * @param {*} contact
   * @param {*} elements 消息元素
   * @param {number} retry_count 重试次数
   * @returns {Promise<{message_id:string}>}
   */
  async SendMessage (contact, elements, retry_count = 1) {
    /** 将buf序列化 */
    let buf = { contact, elements, retry_count }
    buf = kritor.message.SendMessageRequest.encode(buf).finish()
    let data = await this.SendApi('MessageService.SendMessage', buf)
    /** 反序 */
    return kritor.message.SendMessageResponse.decode(data.buf)
  }

  SendApi (cmd, buf, time = 10) {
    const seq = this.seq
    /** 立刻自增防止并发导致重复的seq... */
    this.seq++
    let params = { cmd, seq, buf }
    this.grpc.write(params)
    return new Promise((resolve, reject) => {
      const listener = (data) => {
        data.code === 'SUCCESS' ? resolve(data) : resolve(data)
        this.removeListener(seq, listener)
      }

      this.once(seq, listener)

      /** 超时 */
      setTimeout(() => {
        this.removeListener(seq, listener)
        reject(new Error({ code: 'INTERNAL', message: '超时未响应...' }))
      }, time * 1000)
    })
  }
}
