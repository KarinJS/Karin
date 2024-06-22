import {
  KarinAtElement,
  KarinContactElement,
  KarinFaceElement,
  KarinFileElement,
  KarinForwardElement,
  KarinImageElement,
  KarinJsonElement,
  KarinLocationElement,
  KarinPokeElement,
  KarinRecordElement,
  KarinReplyElement,
  KarinTextElement,
  KarinvideoElement,
  KarinXmlElement,
} from '../../bot/KarinElement.js'

import {
  KarinFriendRecallNotice,
  KarinGroupPokeNotice,
  KarinGroupRecallNotice,
  KarinGroupMemberIncreasedNotice,
  KarinGroupMemberDecreasedNotice,
  KarinGroupAdminChangedNotice,
  KarinGroupMemberBanNotice,
  KarinGroupFileUploadedNotice,
  KarinGroupMessagReactionNotice,
} from '../../bot/KarinNotice.js'

import WebSocket from 'ws'
import { randomUUID } from 'crypto'
import { KarinAdapter } from '../../adapter/adapter.js'
import { KarinMessage } from '../../bot/KarinMessage.js'

/**
 * @typedef OneBotSegmentNode
 * @property {'node'} type - 节点类型
 * @property {object} data - 节点数据
 * @property {string} data.uin - 用户QQ号
 * @property {string} data.name - 用户昵称
 * @property {Array<object>} data.content - 节点内容
 */

/**
 * @typedef {object} version 适配器版本信息
 * @property {string} version.app_name - 适配器名称
 * @property {string} version.version - 适配器版本
 */

/**
 * @class OneBot11
 * @extends KarinAdapter
 */
export class OneBot11 extends KarinAdapter {
  /**
   * @private
   * @type {import('../../index.js').logger}
   */
  #logger

  /**
   * @private
   * @type {import('../../index.js').common}
   */
  #common

  /**
   * @private
   * @type {import('../../index.js').listener}
   */
  #listener

  /**
   * @private
   * @type {import('../../index.js').config}
   */
  #config

  /**
   * 是否初始化
   */
  #init = false

  constructor (logger, common, listener, config) {
    super()
    // 私有属性是为了避免后续更改这些属性消失而导致插件无法使用...
    this.#logger = logger
    this.#common = common
    this.#listener = listener
    this.#config = config
  }

  /**
   * 反向ws初始化
   */
  async server (socket, request) {
    this.socket = socket
    const { host, upgrade, 'x-self-id': self_id } = request.headers
    const url = `ws://${host + request.url}`
    this.account = { uid: self_id, uin: self_id, name: '' }
    this.adapter.id = 'QQ'
    this.adapter.name = 'onebot11'
    this.adapter.type = 'websocket'
    this.adapter.sub_type = 'server'
    this.adapter.url = url

    this.logger('info', `[反向WS][onebot11-${upgrade}][${self_id}] ` + logger.green(url))
    /** 监听消息事件 */
    this.socket.on('message', (bot) => {
      /** 防止空事件 */
      bot = bot.toString().trim() || '{"post_type":"error","error":"空事件"}'
      this.logger('debug', `[收到事件]：${bot}`)
      const data = JSON.parse(bot)
      data.echo ? this.socket.emit(data.echo, data) : this.#init && this.#event(data)
    })

    /** 监听断开 */
    this.socket.on('close', () => this.logger('warn', `[反向WS] 连接断开：${url}`))
    await this.getSelf()
    this.#init = true
  }

  /**
   * 正向ws初始化
   * @param {string} url - WebSocket连接地址
   */
  async client (url) {
    /** 创建连接 */
    this.socket = new WebSocket(url)

    this.socket.on('open', async () => {
      this.adapter.id = 'QQ'
      this.adapter.name = 'onebot11'
      this.adapter.type = 'websocket'
      this.adapter.sub_type = 'client'
      this.adapter.url = url

      logger.info('[正向WS][连接成功][onebot11] ' + logger.green(url))
      this.index = 0
      /** 监听消息事件 */
      this.socket.on('message', bot => {
        /** 防止空事件 */
        bot = bot.toString().trim() || '{"post_type":"error","error":"空事件"}'
        this.logger('debug', `[收到事件]：${bot}`)
        const data = JSON.parse(bot)
        data.echo ? this.socket.emit(data.echo, data) : this.#init && this.#event(data)
      })

      /** 监听断开 */
      this.socket.on('close', () => this.logger('warn', `[正向WS] 连接断开：${url}`))
      await this.getSelf()
      this.#init = true
    })

    /** 监听错误 */
    this.socket.on('error', error => {
      logger.debug('[正向WS] 发生错误', error)
      this.socket.close()
    })

    /** 监听断开 */
    this.socket.on('close', async () => {
      this.index++
      logger.warn(`[正向WS][重连次数:${this.index}] 连接断开，将在5秒后重连：${url}`)
      /** 停止全部监听 */
      this.socket.removeAllListeners()
      await this.#common.sleep(5000)
      this.client(url)
    })
  }

  /**
   * 获取当前登录号信息
   */
  async getSelf () {
    const data = await this.GetCurrentAccount()
    try {
      const { app_name, app_version: version } = await this.GetVersion()
      this.version.name = app_name
      this.version.app_name = app_name
      this.version.version = version
    } catch (e) {
      /** 兼容onebots */
      const { app_name, app_version: version } = await this.SendApi('get_version')
      this.version.name = app_name
      this.version.app_name = app_name
      this.version.version = version
    }

    this.account.uid = data.account_uid
    this.account.uin = data.account_uin
    this.account.name = data.account_name
    this.logger('info', `[加载完成][app_name:${this.version.name}][version:${this.version.version}] ` + logger.green(this.adapter.url))
    /** 注册bot */
    this.#listener.emit('bot', { type: 'websocket', bot: this })
  }

  /** 是否初始化 */
  get isInit () {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.account.name) {
          const { app_name, version } = this.version
          this.logger('info', `建立连接成功：[${app_name}(${version})] ${this.adapter.url}`)
          clearInterval(timer)
          resolve(true)
        }
      }, 100)
    })
  }

  /** 处理事件 */
  #event (data) {
    switch (data.post_type) {
      case 'meta_event':
        this.#meta_event_event(data)
        break
      case 'message':
        this.#message_event(data)
        break
      case 'notice':
        this.#notice_event(data)
        break
      case 'request':
        this.#request_event(data)
        break
      case 'message_sent':
        this.#message_event(data)
        break
      default:
        this.logger('info', `未知事件：${JSON.stringify(data)}`)
    }
  }

  /** 元事件 */
  #meta_event_event (data) {
    switch (data.meta_event_type) {
      case 'heartbeat':
        this.logger('trace', `[心跳]：${JSON.stringify(data.status, null, 2)}`)
        break
      case 'lifecycle':
        this.logger('debug', `[生命周期]：${{ enable: 'OneBot启用', disable: 'OneBot停用', connect: 'WebSocket连接成功' }[data.sub_type]}`)
        break
    }

    this.#listener.emit('meta_event', data)
  }

  /** 消息事件 */
  async #message_event (data) {
    const message = {
      self_id: data.self_id,
      user_id: data.sender.user_id + '',
      time: data.time,
      message_id: data.message_id,
      message_seq: data.message_seq,
      sender: {
        uid: data.sender.user_id + '',
        uin: data.sender.user_id + '',
        nick: data.sender.nickname || '',
      },
    }

    message.elements = this.AdapterConvertKarin(data.message)

    switch (data.message_type) {
      case 'private':
        message.contact = {
          scene: 'friend',
          peer: data.sender.user_id,
          sub_peer: data.sender.user_id,
        }
        break
      case 'group':
        message.group_id = data.group_id
        message.contact = {
          scene: 'group',
          peer: data.group_id,
          sub_peer: data.sender.user_id,
        }
        break
    }

    const e = new KarinMessage(message)
    e.bot = this
    /**
     * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
     * @param {KarinElement[]} elements - 消息内容
     */
    e.replyCallback = async (elements) => {
      if (data.message_type === 'private') {
        return this.send_private_msg(data.user_id, elements)
      } else {
        return this.send_group_msg(data.group_id, elements)
      }
    }

    this.#listener.emit('message', e)
  }

  /** 通知事件 */
  #notice_event (data) {
    const time = data.time
    const self_id = data.self_id
    switch (data.notice_type) {
      case 'group_upload': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.user_id,
          operator_uin: data.user_id,
          file_id: data.file.id,
          file_sub_id: undefined,
          file_name: data.file.name,
          file_size: data.file.size,
          expire_time: undefined,
          biz: undefined,
          url: undefined,
        }
        data = new KarinGroupFileUploadedNotice({ time, self_id, content })
        break
      }
      case 'group_admin': {
        const content = {
          group_id: data.group_id,
          target_uid: data.user_id,
          target_uin: data.user_id,
          is_admin: data.sub_type === 'set',
        }
        data = new KarinGroupAdminChangedNotice({ time, self_id, content })
        break
      }
      case 'group_decrease': {
        const content = { group_id: data.group_id }
        switch (data.sub_type) {
          // 主动退群
          case 'leave':
            content.type = 0
            content.target_uid = data.user_id
            content.target_uin = data.user_id
            break
          // 成员被踢
          case 'kick':
            content.type = 1
            content.operator_uid = data.operator_id
            content.operator_uin = data.operator_id
            content.target_uid = data.user_id
            content.target_uin = data.user_id
            break
          // bot被踢
          case 'kick_me':
            content.type = 2
            content.operator_uid = data.operator_id
            content.operator_uin = data.operator_id
            break
        }
        data = new KarinGroupMemberDecreasedNotice({ time, self_id, content })
        break
      }
      case 'group_increase': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.operator_id,
          operator_uin: data.operator_id,
          target_uid: data.user_id,
          target_uin: data.user_id,
          type: data.sub_type === 'approve' ? 0 : 1,
        }
        data = new KarinGroupMemberIncreasedNotice({ time, self_id, content })
        break
      }
      case 'group_ban': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.operator_id,
          operator_uin: data.operator_id,
          target_uid: data.user_id,
          target_uin: data.user_id,
          duration: data.duration,
          type: data.sub_type === 'ban' ? 1 : 0,
        }
        data = new KarinGroupMemberBanNotice({ time, self_id, content })
        break
      }
      case 'friend_add':
        // todo
        this.logger('info', `[好友添加]：${JSON.stringify(data)}`)
        break
      case 'group_recall': {
        const content = {
          group_id: data.group_id,
          message_id: data.message_id,
          operator_uid: data.operator_id,
          operator_uin: data.operator_id,
          target_uid: data.user_id,
          target_uin: data.user_id,
          message_seq: data.message_id,
          tip_text: '',
        }
        data = new KarinGroupRecallNotice({ time, self_id, content })
        break
      }
      case 'friend_recall': {
        const content = {
          operator_uid: data.operator_id,
          operator_uin: data.operator_id,
          message_id: data.message_id,
          tip_text: undefined,
        }
        data = new KarinFriendRecallNotice({ time, self_id, content })
        break
      }
      case 'notify':
        switch (data.sub_type) {
          case 'poke': {
            const content = {
              group_id: data.group_id,
              operator_uid: data.operator_id,
              operator_uin: data.operator_id,
              target_uid: data.user_id,
              target_uin: data.user_id,
              action: undefined,
              suffix: undefined,
              action_image: undefined,
            }
            data = new KarinGroupPokeNotice({ time, self_id, content })
            break
          }
          case 'lucky_king':
            this.logger('info', `[运气王]：${JSON.stringify(data)}`)
            break
          case 'honor':
            this.logger('info', `[群荣誉变更]：${JSON.stringify(data)}`)
            break
        }
        break
      case 'group_msg_emoji_like': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.user_id,
          operator_uin: data.user_id,
          message_id: data.message_id,
          face_id: data.likes[0].emoji_id,
          // llob目前只有上报点击 没有取消 暂时默认为true
          is_emoji: true,
        }
        data = new KarinGroupMessagReactionNotice({ time, self_id, content })
        break
      }
      default: {
        return this.#logger.error('未知通知事件：', JSON.stringify(data))
      }
    }

    this.#listener.emit('notice', data)
  }

  /** 请求事件 */
  #request_event (data) {
    switch (data.request_type) {
      case 'friend':
        this.logger('info', `[加好友请求]：${JSON.stringify(data)}`)
        /**
         * 快速操作
         * @param {boolean} approve 是否同意请求
         * @param {string} remark 添加后的好友备注（仅在同意时有效）
         */
        data.approve = async (approve, remark) => {
          const obj = { flag: data.flag, approve, remark }
          if (!remark) delete obj.remark
          return await this.SendApi('set_friend_add_request', obj)
        }
        break
      case 'group':
        this.logger('info', `[加群请求]：${JSON.stringify(data)}`)
        /**
         * 快速操作
         * @param {boolean} approve 是否同意请求／邀请
         * @param {string} remark 拒绝理由（仅在拒绝时有效）
         */
        data.approve = async (approve, remark) => {
          const { flag, sub_type } = data
          const obj = { flag, sub_type, approve, remark }
          if (!remark) delete obj.remark
          return await this.SendApi('set_group_add_request', obj)
        }
        break
    }
    // Bot.emit('request', data)
  }

  /**
   * onebot11转karin
   * @param {Array<{type: string, data: any}>} data onebot11格式消息
   * @return {Array<KarinElement>} karin格式消息
   * */
  AdapterConvertKarin (data) {
    const elements = []
    for (const i of data) {
      switch (i.type) {
        case 'text':
          elements.push(new KarinTextElement(i.data.text))
          break
        case 'face':
          elements.push(new KarinFaceElement(i.data.id))
          break
        case 'image':
          elements.push(new KarinImageElement(i.data.url || i.data.file))
          break
        case 'record':
          elements.push(new KarinRecordElement(i.data.url || i.data.file))
          break
        case 'video':
          elements.push(new KarinvideoElement(i.data.url || i.data.file))
          break
        case 'at':
          elements.push(new KarinAtElement(i.data.qq))
          break
        case 'poke':
          elements.push(new KarinPokeElement(i.data.type, i.data.id))
          break
        case 'contact':
          elements.push(new KarinContactElement(i.data.type, i.data.id))
          break
        case 'location':
          elements.push(new KarinLocationElement(i.data.lat, i.data.lon, i.data.title, i.data.content))
          break
        case 'music':
          // 收不到这种类型的消息，收到的都是json
          break
        case 'reply':
          elements.push(new KarinReplyElement(i.data.id))
          break
        case 'forward':
          elements.push(new KarinForwardElement(i.data.id))
          break
        case 'node':
          // 收不到这种类型的消息，收到的都是forward
          break
        case 'file':
          elements.push(new KarinFileElement(i.data.name, i.data.url))
          break
        case 'json':
          elements.push(new KarinJsonElement(i.data.data))
          break
        case 'xml':
          elements.push(new KarinXmlElement(i.data.data))
          break
        case 'custom':
        case 'button':
        case 'rows':
        default: {
          elements.push(new KarinTextElement(JSON.stringify(i)))
        }
      }
    }
    return elements
  }

  /**
   * karin转onebot11
   * @param {Array<KarinElement>} data karin格式消息
   * @return {Array<{type: string, data: any}>} onebot11格式消息
   * */
  KarinConvertAdapter (data) {
    const elements = []
    const selfUin = this.account.uin
    const selfNick = this.account.name

    for (const i of data) {
      switch (i.type) {
        case 'text':
          elements.push({ type: 'text', data: { text: i.text } })
          break
        case 'face':
          elements.push({ type: 'face', data: { id: i.id } })
          break
        case 'at':
          elements.push({ type: 'at', data: { qq: String(i.uid || i.uin) } })
          break
        case 'reply':
          elements.push({ type: 'reply', data: { id: i.message_id } })
          break
        case 'image':
        case 'video':
        case 'file': {
          elements.push({ type: i.type, data: { file: i.file } })
          break
        }
        case 'xml':
        case 'json': {
          elements.push({ type: i.type, data: { data: i.data } })
          break
        }
        case 'node': {
          let { id, type, user_id = selfUin, nickname = selfNick, content } = i
          if (id) {
            elements.push({ type, data: { id } })
            break
          }
          content = this.KarinConvertAdapter(content)
          elements.push({ type, data: { uin: user_id, name: nickname, content } })
          break
        }
        case 'forward': {
          elements.push({ type: 'forward', data: { id: i.id } })
          break
        }
        case 'voice': {
          elements.push({ type: 'record', data: { file: i.file, magic: i.magic || false } })
          break
        }
        case 'music': {
          if (i.platform) {
            elements.push({ type: 'music', data: { type: i.platform, id: i.id } })
          } else {
            const { url, audio, title, content, image } = i
            elements.push({ type: 'music', data: { type: 'custom', url, audio, title, content, image } })
          }
          break
        }
        case 'button': {
          elements.push({ type: 'button', data: { buttons: i.buttons } })
          break
        }
        case 'markdown': {
          const { type, ...data } = i
          elements.push({ type, data: { ...data } })
          break
        }
        case 'rows': {
          for (const val of i.rows) {
            elements.push({ type: 'button', data: { buttons: val.buttons } })
          }
          break
        }
        case 'poke': {
          elements.push({ type: 'poke', data: { type: i.poke, id: i.id } })
          break
        }
        case 'long_msg': {
          elements.push({ type: 'long_msg', data: { id: i.id } })
          break
        }
        default: {
          elements.push(i)
          logger.info(i)
        }
      }
    }
    return elements
  }

  /**
   * 构建特定账号的日志
   * @param {string} level - 日志等级
   * @param {string} args - 日志内容
   */
  logger (level, ...args) {
    this.#logger.bot(level, this.account.uid || this.account.uin, ...args)
  }

  /**
   * 获取头像url
   * @param {number} size 头像大小，默认`0`
   * @param {string} uid 用户qq，默认为机器人QQ
   * @returns {string} 头像的url地址
   */
  getAvatarUrl (uid = this.account.uid || this.account.uin, size = 0) {
    return Number(uid) ? `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${uid}` : `https://q.qlogo.cn/qqapp/${uid}/${uid}/${size}`
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

  /**
   * 对事件执行快速操作 隐藏api
   * @param {object} context 事件数据对象，可做精简，如去掉 message 等无用字段
   * @param {object} operation 快速操作对象，例如 {"ban": true, "reply": "请不要说脏话"}
   */
  async #handle_quick_operation (context, operation) {
    if (!operation.remark) delete operation.remark
    return await this.SendApi('.handle_quick_operation', { context, operation })
  }

  /**
   * 发送私聊消息
   * @param {number} user_id - 用户ID
   * @param {Array<KarinElement>} message - 要发送的内容
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async send_private_msg (user_id, message) {
    const obMessage = this.KarinConvertAdapter(message)
    // this.logger(`${logger.green(`Send private ${user_id}: `)}${this.logSend(message)}`))
    return await this.SendApi('send_private_msg', { user_id, message: obMessage })
  }

  /**
   * 发送群消息
   * @param {number} group_id - 群号
   * @param {Array<KarinElement>} message - 要发送的内容
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async send_group_msg (group_id, message) {
    const obMessages = this.KarinConvertAdapter(message)
    return await this.SendApi('send_group_msg', { group_id, message: obMessages })
  }

  /**
   * 发送消息
   *
   * @param {KarinContact} contact
   * @param {Array<KarinElement>} elements
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async SendMessage (contact, elements) {
    let { scene, peer } = contact
    const message_type = scene === 'group' ? 'group' : 'private'
    scene = scene === 'group' ? 'group_id' : 'user_id'
    const message = this.KarinConvertAdapter(elements)
    const params = { [scene]: peer, message_type, message }
    return await this.SendApi('send_msg', params)
  }

  /**
   * 上传合并转发消息
   * @param {KarinContact} contact - 联系人信息
   * @param {KarinNodeElement[] | KarinNodeElement} elements - nodes
   * @returns {Promise<string>} - 资源id
   * */
  async UploadForwardMessage (contact, elements) {
    if (!Array.isArray(elements)) elements = [elements]
    if (elements.some(element => element.type !== 'node')) {
      throw new Error('elements should be all node type')
    }
    const { scene, peer } = contact
    const message_type = scene === 'group' ? 'group_id' : 'user_id'
    const messages = this.KarinConvertAdapter(elements)

    const params = { [message_type]: String(peer), messages }
    return await this.SendApi('send_forward_msg', params)
  }

  /**
   * 撤回消息
   * @param {null} [_contact] - ob11无需提供contact参数
   * @param {number} message_id - 消息ID
   * @returns {Promise<null>}
   */
  async RecallMessage (_contact, message_id) {
    return await this.SendApi('delete_msg', { message_id })
  }

  /**
   * 获取消息
   * @param {null} [_contact] - ob11无需提供contact参数
   * @param {number} message_id - 消息ID
   * @returns {Promise<object>} - 消息内容
   */

  async GetMessage (_contact, message_id) {
    let res = await this.SendApi('get_msg', { message_id })
    res = {
      time: res.time,
      message_id: res.message_id,
      message_seq: res.message_id,
      contact: {
        scene: res.message_type === 'group' ? 'group' : 'private',
        peer: res.sender.user_id, // 拿不到group_id...
      },
      sender: {
        uid: res.sender.user_id,
        uin: res.sender.user_id,
        nick: res.sender.nickname,
      },
      elements: this.AdapterConvertKarin(res.message),
    }
    return res
  }

  /** 获取msg_id获取历史消息 */
  async GetHistoryMessage (contact, start_message_id, count) {
    const type = contact.scene === 'group' ? 'group_id' : 'user_id'
    const param = { [type]: contact.peer, message_id: start_message_id, count }
    const api = contact.scene === 'group' ? 'get_group_msg_history' : 'get_friend_msg_history'
    const res = await this.SendApi(api, param, 120)
    const ret = []
    for (const i of res.messages) {
      let { time = Date.now(), message_id, message_seq = message_id, sender, message } = i
      const { user_id, nickname } = sender
      sender = { uid: user_id, uin: user_id, nick: nickname }
      const elements = this.AdapterConvertKarin(message)
      ret.push({ time, message_id, message_seq, contact, sender, elements })
    }
    return ret
  }

  /**
   * todo
   * 获取合并转发消息
   * @param {string} id - 合并转发 ID
   * @returns {Promise<object>} - 消息内容，使用消息的数组格式表示，数组中的消息段全部为 node 消息段
   */
  async get_forward_msg (id) {
    return await this.SendApi('get_forward_msg', { id })
  }

  /**
   * 发送好友赞
   * @param {{
   *  target_uid?: string,
   *  target_uin?: string,
   *  times: number
   * }} options
   * @param options.target_uid - 好友 QQ 号 任选其一
   * @param options.target_uin - 好友 QQ 号 任选其一
   * @param options.times - 赞的次数，默认为 10
   */
  async VoteUser (options) {
    const user_id = Number(options.target_uid || options.target_uin)
    await this.SendApi('send_like', { user_id, times: options.times || 10 })
  }

  /**
    * 群组踢人
    * @param {{
    *  group_id:string,
    *  target_uid?:string,
    *  target_uin?:string,
    *  reject_add_request?:boolean,
    *  kick_reason?:string
    * }} options
    * @param options.group_id - 群组ID
    * @param options.target_uid - 被踢出目标的 uid 任选其一
    * @param options.target_uin - 被踢出目标的 uin 任选其一
    * @param options.reject_add_request - 是否拒绝再次申请，默认为false
    * @param options.kick_reason - 踢出原因，可选
    * @returns {Promise<KickMemberResponse>} - 踢出操作的响应
    */
  async KickMember (options) {
    const { group_id, target_uid, target_uin, reject_add_request } = options
    const user_id = Number(target_uid || target_uin)
    await this.SendApi('set_group_kick', { group_id, user_id, reject_add_request })
  }

  /**
    * 禁言用户
    * @param {{
    *  group_id:string,
    *  target_uid?:string,
    *  target_uin?:string,
    *  duration:number
    * }} options
    * @param options.group_id - 群组ID
    * @param options.target_uid - 被禁言目标的uin 任选其一
    * @param options.target_uin - 被禁言目标的uid 任选其一
    * @param options.duration - 禁言时长（单位：秒）
    * @returns {Promise<BanMemberResponse>} - 禁言操作的响应
    */
  async BanMember (options) {
    const { group_id, target_uid, target_uin, duration } = options
    const user_id = Number(target_uid || target_uin)
    await this.SendApi('set_group_ban', { group_id, user_id, duration })
  }

  /**
   * 群组匿名用户禁言
   * @param {number} group_id - 群号
   * @param {object} anonymous - 要禁言的匿名用户对象（群消息上报的 anonymous 字段）
   * @param {string} [anonymous_flag] - 要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @param {number} [duration=1800] - 禁言时长，单位秒，无法取消匿名用户禁言
   */
  async set_group_anonymous_ban (group_id, anonymous, anonymous_flag, duration = 1800) {
    await this.SendApi('set_group_anonymous_ban', { group_id, anonymous, anonymous_flag, duration })
  }

  /**
   * 群组全员禁言
   * @param {number} group_id - 群号
   * @param {boolean} [enable=true] - 是否全员禁言
   */
  async SetGroupWholeBan (group_id, enable = true) {
    await this.SendApi('set_group_whole_ban', { group_id, enable })
  }

  /**
   * 设置群管理员
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  is_admin:boolean
   * }} options - 设置管理员选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 要设置为管理员的用户uid
   * @param options.target_uin - 要设置为管理员的用户uin
   * @param options.is_admin - 是否设置为管理员
   * @returns {Promise<SetGroupAdminResponse>} - 设置群管理员操作的响应
   */
  async SetGroupAdmin (options) {
    const { group_id, target_uid, target_uin, is_admin } = options
    const user_id = Number(target_uid || target_uin)
    await this.SendApi('set_group_admin', { group_id, user_id, enable: is_admin })
  }

  /**
   * 群组匿名
   * @param {number} group_id - 群号
   * @param {boolean} [enable=true] - 是否允许匿名聊天
   */
  async set_group_anonymous (group_id, enable = true) {
    await this.SendApi('set_group_anonymous', { group_id, enable })
  }

  /**
   * 修改群名片
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  card:string
   * }} options
   * @param {number} options.group_id - 群组ID
   * @param {string|number} options.target_uid - 目标用户的 uid 任选其一
   * @param {string|number} options.target_uin - 目标用户的 uin 任选其一
   * @param {string} options.card - 新的群名片
   * @returns {Promise<ModifyMemberCardResponse>} - 修改群名片操作的响应
   */
  async ModifyMemberCard (options) {
    const { group_id, target_uid, target_uin, card } = options
    const user_id = Number(target_uid || target_uin)
    await this.SendApi('set_group_card', { group_id, user_id, card })
  }

  /**
   * 设置群名
   * @param {number} group_id - 群号
   * @param {string} group_name - 新群名
   */
  async ModifyGroupName (group_id, group_name) {
    await this.SendApi('set_group_name', { group_id, group_name })
  }

  /**
   * 退出群组
   * @param {number} group_id - 群号
   * @param {boolean} [is_dismiss=false] - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  async LeaveGroup (group_id, is_dismiss = false) {
    await this.SendApi('set_group_leave', { group_id, is_dismiss })
  }

  /**
   * 设置群专属头衔
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  unique_title:string
   * }} options - 设置头衔选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 目标用户的uid
   * @param options.target_uin - 目标用户的uin
   * @param options.unique_title - 新的群头衔
   * @returns {Promise<SetGroupUniqueTitleResponse>} - 设置群头衔操作的响应
   */
  async SetGroupUniqueTitle (options) {
    const { group_id, target_uid, target_uin, unique_title } = options
    const user_id = Number(target_uid || target_uin)
    const special_title = unique_title
    const duration = -1
    await this.SendApi('set_group_special_title', { group_id, user_id, special_title, duration })
  }

  /**
   * 处理加好友请求
   * @param {string} flag - 加好友请求的 flag（需从上报的数据中获得）
   * @param {boolean} [approve=true] - 是否同意请求
   * @param {string} [remark=''] - 添加后的好友备注（仅在同意时有效）
   */
  async set_friend_add_request (flag, approve = true, remark = '') {
    await this.SendApi('set_friend_add_request', { flag, approve, remark })
  }

  /**
   * 处理加群请求／邀请
   * @param {string} flag - 加群请求的 flag（需从上报的数据中获得）
   * @param {string} sub_type - add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
   * @param {boolean} [approve=true] - 是否同意请求／邀请
   * @param {string} [reason=''] - 拒绝理由（仅在拒绝时有效）
   */
  async set_group_add_request (flag, sub_type, approve = true, reason = '') {
    await this.SendApi('set_group_add_request', { flag, sub_type, approve, reason })
  }

  /**
   * 获取登录号信息
   * @returns {Promise<{account_uid:string, account_uin:string, account_name:string}>} - 登录号信息
   */
  async GetCurrentAccount () {
    const res = await this.SendApi('get_login_info')
    return {
      account_uid: res.user_id,
      account_uin: res.user_id,
      account_name: res.nickname,
    }
  }

  /**
   * 获取陌生人信息 不支持批量获取
   * @param {Object} [options] - 陌生人信息选项
   * @param {Array<string>} [options.target_uids] - 目标用户的 uid 数组 可选
   * @param {Array<string>} [options.target_uins] - 目标用户的 uin 数组 可选
   * @param {boolean} [options.no_cache=false] - 是否不使用缓存
   * @returns {Promise<IProfileCard[]>} - 获取到的陌生人信息
   */
  async GetStrangerProfileCard (options) {
    const { target_uids = [], target_uins = [], no_cache = false } = options || {}
    const user_id = target_uids.length > 0 ? target_uids[0] : target_uins[0]
    const res = await this.SendApi('get_stranger_info', { user_id, no_cache })
    return [res]
  }

  /**
   * 获取好友列表
   * @returns {Promise<Array<IFriendInfo>>} - 好友列表
   */
  async GetFriendList () {
    /** @type {{
     * user_id: number,
     * user_name: string?,
     * user_remark: string,
     * remark: string?,
     * nickname: string?,
     }[]} **/
    const friendList = await this.SendApi('get_friend_list')
    return friendList.map(friend => {
      return {
        uin: friend.user_id,
        uid: friend.user_id,
        qid: '',
        nick: friend.nickname || friend.user_name,
        remark: friend.remark || friend.user_remark,
      }
    })
  }

  /**
   * 获取群信息
   * @param {number} group_id - 群号
   * @param {boolean} [no_cache=false] - 是否不使用缓存
   * @returns {Promise<IGroupInfo>} - 群信息
   */
  async GetGroupInfo (group_id, no_cache = false) {
    /**
     * @type {{
     *   group_id: number,
     *   group_name: string,
     *   group_memo: string,
     *   group_remark: string,
     *   group_create_time: number,
     *   group_level: number,
     *   member_count: number,
     *   max_member_count: number,
     *   admins: number[]
     * }}
     */
    const groupInfo = await this.SendApi('get_group_info', { group_id, no_cache })
    return {
      group_id: groupInfo.group_id,
      group_name: groupInfo.group_name,
      group_remark: groupInfo.group_memo || groupInfo.group_remark,
      max_member_count: groupInfo.max_member_count,
      member_count: groupInfo.member_count,
      group_uin: groupInfo.group_id,
      admins: groupInfo.admins,
    }
  }

  /**
   * 获取群列表
   * @returns {Promise<Array<IGroupInfo>>} - 群列表
   */
  async GetGroupList () {
    const groupList = await this.SendApi('get_group_list')
    return groupList?.map(groupInfo => {
      return {
        group_id: groupInfo.group_id,
        group_name: groupInfo.group_name,
        group_remark: groupInfo.group_memo || groupInfo.group_remark,
        max_member_count: groupInfo.max_member_count,
        member_count: groupInfo.member_count,
        group_uin: groupInfo.group_id,
        admins: groupInfo.admins,
      }
    })
  }

  /**
   * 获取群成员信息
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  refresh?:boolean
   * }} options - 获取成员信息选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 目标用户的uid
   * @param options.target_uin - 目标用户的uin
   * @param options.refresh - 是否刷新缓存，默认为 false
   * @returns {Promise<IGroupMemberInfo>} - 获取群成员信息操作的响应
   */
  async GetGroupMemberInfo (options) {
    const { group_id, target_uid, target_uin, refresh = false } = options
    const user_id = Number(target_uid || target_uin)
    /**
     * @type {{
     *   group_id: number,
     *   user_id: number,
     *   nickname: string,
     *   card: string,
     *   sex: string,
     *   age: number,
     *   area: string,
     *   join_time: number,
     *   last_sent_time: number,
     *   level: string,
     *   role: 'owner' | 'admin' | 'member',
     *   unfriendly: boolean,
     *   title: string,
     *   title_expire_time: number,
     *   card_changeable: boolean,
     *   shut_up_timestamp: number
     * }}
     */
    const groupMemberInfo = await this.SendApi('get_group_member_info', { group_id, user_id, no_cache: refresh })
    let level = 0
    try {
      level = parseInt(groupMemberInfo.level)
    } catch (e) { }
    return {
      uid: groupMemberInfo.user_id,
      uin: groupMemberInfo.user_id,
      nick: groupMemberInfo.nickname,
      age: groupMemberInfo.age,
      unique_title: groupMemberInfo.title,
      unique_title_expire_time: groupMemberInfo.title_expire_time,
      card: groupMemberInfo.card,
      join_time: groupMemberInfo.join_time,
      last_active_time: groupMemberInfo.last_sent_time,
      level,
      shut_up_timestamp: groupMemberInfo.shut_up_timestamp,
      unfriendly: groupMemberInfo.unfriendly,
      card_changeable: groupMemberInfo.card_changeable,
    }
  }

  /**
   * 获取群成员列表
   * @param {Object} options - 获取成员列表选项
   * @param {number} options.group_id - 群组ID
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupMemberInfo[]>} - 获取群成员列表操作的响应
   */
  async GetGroupMemberList (options) {
    const { group_id } = options
    const gl = await this.SendApi('get_group_member_list', { group_id })
    return gl.map(groupMemberInfo => {
      let level = 0
      try {
        level = parseInt(groupMemberInfo.level)
      } catch (e) { }
      return {
        uid: groupMemberInfo.user_id,
        uin: groupMemberInfo.user_id,
        nick: groupMemberInfo.nickname,
        age: groupMemberInfo.age,
        unique_title: groupMemberInfo.title,
        unique_title_expire_time: groupMemberInfo.title_expire_time,
        card: groupMemberInfo.card,
        join_time: groupMemberInfo.join_time,
        last_active_time: groupMemberInfo.last_sent_time,
        level,
        shut_up_timestamp: groupMemberInfo.shut_up_timestamp,
        unfriendly: groupMemberInfo.unfriendly,
        card_changeable: groupMemberInfo.card_changeable,
      }
    })
  }

  /**
   * 获取群荣誉信息
   * @param {Object} options - 获取群荣誉信息选项
   * @param {number} options.group_id - 群号
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupHonorInfo[]>} - 获取群荣誉信息操作的响应
   */
  async GetGroupHonor (options) {
    const { group_id } = options
    /**
     * @typedef {{user_id: number, nickname: string, avatar: string, description: string}} GroupHonor
     */
    /**
     * @type {{
     *   group_id: number,
     *   current_talkative: {user_id: number, nickname: string, avatar: string, day_count: number},
     *   talkative_list: Array<GroupHonor>,
     *   performer_list: Array<GroupHonor>,
     *   legend_list: Array<GroupHonor>,
     *   strong_newbie_list: Array<GroupHonor>,
     *   emotion_list: Array<GroupHonor>,
     * }}
     */
    const groupHonor = await this.SendApi('get_group_honor_info', { group_id, type: 'all' })

    const result = []
    groupHonor.talkative_list.forEach(honor => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '历史龙王',
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.performer_list.forEach(honor => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '群聊之火',
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.legend_list.forEach(honor => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '群聊炽焰',
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.strong_newbie_list.forEach(honor => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '冒尖小春笋',
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.emotion_list.forEach(honor => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '快乐之源',
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    return result
  }

  /**
   * 对消息进行表情回应
   * @param {KarinContact} Contact - 联系人信息
   * @param {string} message_id - 消息ID
   * @param {string} face_id - 表情ID
   */
  async ReactMessageWithEmojiRequest (Contact, message_id, face_id, is_set = true) {
    return await this.SendApi('set_msg_emoji_like', { message_id, emoji_id: face_id, is_set })
  }

  /**
   * 上传群文件
   * @param {string} group_id - 群号
   * @param {string} file - 本地文件绝对路径
   * @param {string} name - 文件名称 必须提供
   * @param {string} [folder] - 父目录ID 不提供则上传到根目录
   */
  async UploadGroupFile (group_id, file, name) {
    return await this.SendApi('upload_group_file', { group_id, file, name })
  }

  /**
   * 上传私聊文件
   * @param {string} user_id - 用户ID
   * @param {string} file - 本地文件绝对路径
   * @param {string} name - 文件名称 必须提供
   */
  async UploadPrivateFile (user_id, file, name) {
    return await this.SendApi('upload_private_file', { user_id, file, name })
  }

  /**
   * 获取 Cookies
   * @param {string} domain - 需要获取 cookies 的域名
   * @returns {Promise<string>} - Cookies
   */
  async get_cookies (domain) {
    return (await this.SendApi('get_cookies', { domain }))?.cookies
  }

  /**
   * 获取 CSRF Token
   * @returns {Promise<string>} - CSRF Token
   */
  async get_csrf_token () {
    return (await this.SendApi('get_csrf_token')).token
  }

  /**
 * 获取 QQ 相关接口凭证
 * @param {string} domain - 需要获取 cookies 的域名
 * @returns {Promise<{
 *   cookies: string,
 *   cstf_token: number
 * }>} - QQ 相关接口凭证
 */
  async get_credentials (domain) {
    return await this.SendApi('get_credentials', { domain })
  }

  /**
   * 获取语音
   * @param {string} file - 收到的语音文件名
   * @param {string} out_format - 要转换到的格式
   * @returns {Promise<{
   *   file: string,
   *   out_format: 'mp3' | 'amr' | 'wma' | 'm4a' | 'spx' | 'ogg' | 'wav' | 'flac'
   * }>} - 转换后的语音文件路径
   */
  async get_record (file, out_format) {
    return await this.SendApi('get_record', { file, out_format })
  }

  /**
   * 获取图片
   * @param {string} file - 收到的图片文件名
   * @returns {Promise<{
   *   size: number,
   *   filename: string,
   *   url: string
   * }>} - 下载后的图片文件路径
   */
  async get_image (file) {
    return await this.SendApi('get_image', { file })
  }

  /**
   * 检查是否可以发送图片
   * @returns {Promise<boolean>} - 是否可以发送图片
   */
  async can_send_image () {
    return (await this.SendApi('can_send_image'))?.yes
  }

  /**
   * 检查是否可以发送语音
   * @returns {Promise<boolean>} - 是否可以发送语音
   */
  async can_send_record () {
    return (await this.SendApi('can_send_record'))?.yes
  }

  /**
   * 获取运行状态
   * @returns {Promise<object>} - 运行状态
   */
  async get_status () {
    return await this.SendApi('get_status')
  }

  /**
   * 获取版本信息
   * @returns {Promise<GetVersionResponse>} - 版本信息
   */
  async GetVersion () {
    return await this.SendApi('get_version_info')
  }

  /**
   * 重启 OneBot 实现
   * @param {number} [delay=0] - 要延迟的毫秒数
   * @returns {Promise<object>} - 重启状态
   */
  async set_restart (delay = 0) {
    return await this.SendApi('set_restart', { delay })
  }

  /**
   * 清理缓存
   * @returns {Promise<object>} - 清理状态
   */
  async clean_cache () {
    return await this.SendApi('clean_cache')
  }

  /**
   * 发送API请求
   * @param {string} action - API断点
   * @param {object} params - API参数
   * @returns {Promise<any>} - API返回
   */
  async SendApi (action, params = {}, time) {
    if (!time) time = this.#config.timeout('ws')
    const echo = randomUUID()
    const request = JSON.stringify({ echo, action, params })
    logger.debug(`[API请求] ${action}: ${request}`)
    return new Promise((resolve, reject) => {
      this.socket.send(request)
      this.socket.once(echo, (data) => {
        if (data.status === 'ok') {
          resolve(data.data)
        } else {
          this.logger('error', `[Api请求错误] ${action}: ${JSON.stringify(data, null, 2)}`)
          reject(data)
        }
      })
      /** 设置一个超时计时器 */
      setTimeout(() => {
        reject(new Error('API请求超时'))
      }, time * 1000)
    })
  }

  /**
   * karin的node转为ob的node
   * @param {{type: 'node', user_id: string, nickname: string, content: object[]}} node
   * @return OneBotSegmentNode
   */
  formatNode (node) {
    return {
      type: 'node',
      data: {
        uin: node.user_id,
        name: node.nickname,
        content: node.content,
      },
    }
  }
}

export default {
  type: 'websocket',
  path: '/onebot/v11/ws',
  adapter: OneBot11,
}
