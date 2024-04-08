import { EventEmitter } from 'events'
import { kritor, common } from '#Karin'

export default class extends EventEmitter {
  constructor (grpc, account, version) {
    super()
    /** grpc */
    this.grpc = grpc
    /** 自增 */
    this.seq = 0
    const { uid, uin } = account
    /** 账户信息 */
    this.account = {
      /** uid目前并未普及，还是使用uin作为bot_id */
      uid,
      uin,
      name: ''
    }
    /** 适配器信息 */
    this.adapter = {
      type: 'QQ',
      name: 'Kritor',
      /** 启动时间 */
      start_time: Date.now()
    }
    /** 版本信息 */
    this.version = version
    /** 监听响应事件 */
    grpc.on('data', data => this.emit(data.seq, data))
    /** 监听关闭事件 */
    grpc.on('end', () => this.logger('warn', '连接已断开'))
  }

  // ============辅助=============

  /**
   * 编码
   * @param {string} service - 服务名
   * @param {string} cmd - 命令名
   * @param {string} type - 类型
   * @param {object} buf - 数据
   * @returns {Uint8Array}
   */
  encode (service, cmd, type, buf) {
    buf = kritor[type][`${cmd}Request`].encode(buf).finish()
    cmd = `${service}.${cmd}`
    return { cmd, buf }
  }

  /** 解码 */
  decode (cmd, type, buf) {
    return kritor[type][`${cmd}Response`].decode(buf)
  }

  /**
 *  todo 补充类型
 * @param elements
 * @return {*[]}
 */
  elements (elements) {
    const _elements = []
    const ElementType = kritor.common.Element.ElementType
    for (let i of elements) {
      switch (i.type) {
        case 'text': {
          const { TEXT: type } = ElementType
          const { text } = i
          _elements.push(new kritor.common.TextElement({ type, text: { text } }))
          break
        }
        case 'image': {
          const { IMAGE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.ImageElement({ type, image: { file } }))
          break
        }
        case 'at': {
          const { AT: type } = ElementType
          const { uid, uin = '' } = i
          _elements.push(new kritor.common.AtElement({ type, at: { uid, uin } }))
          break
        }
        case 'face': {
          const { FACE: type } = ElementType
          const { id, is_big = false } = i
          _elements.push(new kritor.common.FaceElement({ type, face: { id, is_big } }))
          break
        }
        case 'reply': {
          const { REPLY: type } = ElementType
          const { id } = i
          _elements.push(new kritor.common.ReplyElement({ type, reply: { id } }))
          break
        }
        case 'VOICE': {
          const { VOICE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.VoiceElement({ type, voice: { file } }))
          break
        }
      }
    }

    return _elements
  }

  // ================消息事件api============

  /**
   * 发送消息
   * @param {*} contact
   * @param {*} elements 消息元素
   * @param {number} retry_count 重试次数
   * @returns {Promise<{message_id:string}>}
   */
  async SendMessage (contact, elements, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'SendMessage'
    const type = 'message'
    elements = this.elements(elements)
    const buf = { contact, elements, retry_count }
    /** 序列化 */
    let data = this.encode(service, cmd, type, buf)
    /** 发送请求 */
    data = await this.SendApi(data.cmd, data.buf)
    /** 反序 */
    return this.decode(cmd, type, data.buf)
  }

  /** 通过资源id发送转发消息 */
  async SendMessageByResId (contact, res_id, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'SendMessageByResId'
    const type = 'message'
    const buf = { contact, res_id, retry_count }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 撤回消息 */
  async RecallMessage (contact, message_id) {
    const service = 'MessageService'
    const cmd = 'RecallMessage'
    const type = 'message'
    const buf = { contact, message_id }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 设置消息评论表情 */
  async ReactMessageWithEmoji (contact, message_id, face_id, is_set) {
    const service = 'MessageService'
    const cmd = 'ReactMessageWithEmoji'
    const type = 'message'
    const buf = { contact, message_id, face_id, is_set }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 获取msg_id获取消息 */
  async GetMessage (contact, message_id) {
    const service = 'MessageService'
    const cmd = 'GetMessage'
    const type = 'message'
    const buf = { contact, message_id }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 通过seq获取消息 */
  async GetMessageBySeq (contact, message_seq) {
    const service = 'MessageService'
    const cmd = 'GetMessageBySeq'
    const type = 'message'
    const buf = { contact, message_seq }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 获取msg_id获取历史消息 */
  async GetHistoryMessage (contact, start_message_id, count) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessage'
    const type = 'message'
    const buf = { contact, start_message_id, count }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 通过seq获取历史消息 */
  async GetHistoryMessageBySeq (contact, start_message_seq, count) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessageBySeq'
    const type = 'message'
    const buf = { contact, start_message_seq, count }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 清空本地聊天记录 */
  async SetMessageReaded (contact) {
    const service = 'MessageService'
    const cmd = 'SetMessageReaded'
    const type = 'message'
    const buf = { contact }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 上传合并转发消息 */
  async UploadForwardMessage (contact, messages, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'UploadForwardMessage'
    const type = 'message'
    const buf = { contact, messages, retry_count }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 下载合并转发消息 */
  async DownloadForwardMessage (res_id) {
    const service = 'MessageService'
    const cmd = 'DownloadForwardMessage'
    const type = 'message'
    const buf = { res_id }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 获取精华消息 */
  async GetEssenceMessageList (group_id, page, page_size) {
    const service = 'MessageService'
    const cmd = 'GetEssenceMessageList'
    const type = 'message'
    const buf = { group_id, page, page_size }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 设置精华消息 */
  async SetEssenceMessage (group_id, message_id) {
    const service = 'MessageService'
    const cmd = 'SetEssenceMessage'
    const type = 'message'
    const buf = { group_id, message_id }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  /** 删除精华消息 */
  async DeleteEssenceMessage (group_id, message_id) {
    const service = 'MessageService'
    const cmd = 'DeleteEssenceMessage'
    const type = 'message'
    const buf = { group_id, message_id }
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    return this.decode(cmd, type, data.buf)
  }

  // ========================其他api===============

  logger (level, ...args) {
    logger[level](common.logger(this.account.uin, ...args))
  }

  /**
  * 获取用户头像
  * @param {string} uid - 用户id，默认为发送者uid
  * @param {number} [size] - 头像大小，默认`0`
  * @returns {string} - 头像的url地址
  */
  getAvatar (uid, size = 0) {
    return `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=` + uid
  }

  /**
   * 获取群头像
   * @param {string} group_id - 群号
   * @param {number} [size] - 头像大小，默认`0`
   * @param {number} [history] - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns {string} - 群头像的url地址
   */
  getGroupAvatar (group_id, size = 0, history = 0) {
    return `https://p.qlogo.cn/gh/${group_id}/${group_id}${history ? '_' + history : ''}/` + size
  }

  /** 获取当前账户的信息 */
  async GetCurrentAccount () {
    const service = 'CoreService'
    const cmd = 'GetCurrentAccount'
    const type = 'core'
    const buf = {}
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    let res = this.decode(cmd, type, data.buf)
    /** 统一使用str */
    res.account_uin = String(res.account_uin)
    return res
  }

  /**
   * 发送Api请求
   * @param {string} cmd - 命令
   * @param {protobuf} buf - 请求参数
   * @param {number} time - 请求超时时间 默认10s
   * @returns {Promise<protobuf>}
   */
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
        reject(new Error('超时未响应...'))
      }, time * 1000)
    })
  }
}
