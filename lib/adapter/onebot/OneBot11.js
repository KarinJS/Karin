import {
  // eslint-disable-next-line no-unused-vars
  KarinElement,
  KarinFileElement,
  KarinAtElement,
  KarinFaceElement,
  KarinImageElement,
  KarinTextElement,
  KarinReplyElement
} from '../../bot/model.js'
import { KarinMessage } from '../../event/type.js'
import { randomUUID } from 'crypto'
import Bot from '../../bot/bot.js'
import Cfg from '../../config/config.js'
import logger from '../../config/log.js'
import common from '../../common/common.js'

class OneBot11 {
  socket
  request
  /** 机器人QQ */
  #id
  /** 初始化 */
  init = false
  /** host */
  #host
  /** 连接地址 */
  url
  /** 机器人名称 */
  nickname
  /** 版本信息 */
  version
  constructor (socket, request) {
    this.socket = socket
    this.request = request
    this.#start()
  }

  /** 初始化 */
  async #start () {
    this.#id = Number(this.request.headers['x-self-id'])
    this.#host = this.request.headers.host
    this.url = `ws://${this.#host + this.request.url}`
    /** 账户信息 */
    this.account = {
      uid: this.#id,
      uin: this.#id,
      name: ''
    }
    this.adapter = {
      type: 'QQ',
      name: 'OneBot_V11',
      /** 启动时间戳 */
      start_time: Date.now()
    }

    this.logger('info', `收到新的连接：[OneBot11-${this.request.headers.upgrade}][${this.#id}] <==> ${this.url}`)
    /** 监听消息事件 */
    this.socket.on('message', (bot) => {
      /** 防止空事件 */
      bot = bot.toString().trim() || '{"post_type":"error","error":"空事件"}'
      this.logger('debug', `[收到事件]：${bot}`)
      const data = JSON.parse(bot)
      data.echo ? this.socket.emit(data.echo, data) : this.init && this.#event(data)
    })

    /** 监听断开 */
    this.socket.on('close', () => {
      this.logger('warn', `连接断开：${this.url}`)
    })

    /** 获取登录号信息 */
    const data = await this.get_login_info()
    try {
      this.version = await this.get_version_info()
    } catch (e) {
      /** 非标接口 */
      this.version = await this.SendApi('get_version')
    }
    this.account.nickname = data.nickname
    this.init = true
  }

  /** 是否初始化 */
  get isInit () {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.account.nickname) {
          const { app_name, app_version } = this.version
          this.logger('info', `[${this.version} - ${app_name}(${app_version})]建立连接成功：${this.url}`)
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
        data = this.norm(data)
        this.#message_event(data)
        break
      case 'notice':
        data = this.norm(data)
        this.#notice_event(data)
        break
      case 'request':
        data = this.norm(data)
        this.#request_event(data)
        break
      default:
        this.logger('info', `未知事件：${JSON.stringify(data)}`)
    }
  }

  /** 构建通用字段 */
  norm (data) {
    data = {
      ...data,
      SendApi: (action, params) => this.SendApi(action, params),
      /**
       * 获取头像url
       * @param size 头像大小，默认`0`
       * @param qq 用户qq，默认为消息发送者
       * @returns 头像的url地址
       */
      getAvatarUrl: (size = 0, qq = data.user_id) => this.getAvatarUrl(size, qq),
      /**
       * 快速回复
       * @param {message} message - 消息内容
       */
      reply: async (message) => {
        if (data.message_type === 'private') {
          return await this.send_private_msg(data.user_id, message)
        } else {
          return await this.send_group_msg(data.group_id, message)
        }
      }
    }
    return data
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

    Bot.emit('meta_event', data)
  }

  /** 消息事件 */
  async #message_event (data) {
    /**
     * 快速撤回，可键入指定message_id
     * @param {number} message_id - 消息ID
     */
    data.delete_msg = async message_id => this.delete_msg(message_id || data.message_id)
    let message = {
      self_id: data.self_id,
      user_id: data.sender.user_id,
      time: data.time,
      message_id: data.message_id,
      message_seq: data.message_seq,
      sender: {
        uid: data.sender.user_id,
        uin: data.sender.user_id,
        nick: data.sender.nickname
      }
    }

    message.elements = this.#OneBot_V11_Elements(data.message)

    switch (data.message_type) {
      case 'private':
        message.contact = {
          scene: 'friend',
          peer: data.sender.user_id,
          sub_peer: data.sender.user_id
        }
        // this.logger(`私聊：[${data.user_id}(${data.sender.nickname || ''})] ${data.raw_message}`))
        break
      case 'group':
        message.group_id = data.group_id
        message.contact = {
          scene: 'group',
          peer: data.group_id,
          sub_peer: data.sender.user_id
        }
        // this.logger(`群消息：[${data.group_id}-${data.user_id}(${data.sender.nickname || ''})] ${data.raw_message}`))
        break
    }

    const e = new KarinMessage(message)

    /**
     * 快速回复
     * @param {message} message - 消息内容
     */
    e.reply = (message) => {
      if (data.message_type === 'private') {
        return this.send_private_msg(data.user_id, message)
      } else {
        return this.send_group_msg(data.group_id, message)
      }
    }

    Bot.emit('message', e)
  }

  /** 通知事件 */
  #notice_event (data) {
    switch (data.notice_type) {
      case 'group_upload':
        this.logger('info', `[群文件上传]：${JSON.stringify(data)}`)
        break
      case 'group_admin':
        this.logger('info', `[群管理员变动]：${JSON.stringify(data)}`)
        break
      case 'group_decrease':
        this.logger('info', `[群成员减少]：${JSON.stringify(data)}`)
        break
      case 'group_increase':
        this.logger('info', `[群成员增加]：${JSON.stringify(data)}`)
        break
      case 'group_ban':
        this.logger('info', `[群禁言]：${JSON.stringify(data)}`)
        break
      case 'friend_add':
        this.logger('info', `[好友添加]：${JSON.stringify(data)}`)
        break
      case 'group_recall':
        this.logger('info', `[群消息撤回]：${JSON.stringify(data)}`)
        break
      case 'friend_recall':
        this.logger('info', `[好友消息撤回]：${JSON.stringify(data)}`)
        break
      case 'notify':
        switch (data.sub_type) {
          case 'poke':
            this.logger('info', `[戳一戳]：${JSON.stringify(data)}`)
            break
          case 'lucky_king':
            this.logger('info', `[运气王]：${JSON.stringify(data)}`)
            break
          case 'honor':
            this.logger('info', `[群荣誉变更]：${JSON.stringify(data)}`)
            break
        }
        break
    }

    // Bot.emit('notice', data)
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
          let obj = { flag: data.flag, approve, remark }
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
          let obj = { flag, sub_type, approve, remark }
          if (!remark) delete obj.remark
          return await this.SendApi('set_group_add_request', obj)
        }
        break
    }
    // Bot.emit('request', data)
  }

  /** onebot11转karin */
  #OneBot_V11_Elements (data) {
    const elements = []
    for (let i of data) {
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
        case 'at':
          elements.push(new KarinAtElement(i.data.qq, i.data.name))
          break
        case 'reply':
          elements.push(new KarinReplyElement(i.data.id))
          break
        case 'file':
          elements.push(new KarinFileElement(i.data.name, i.data.url))
          break
        // todo 其他类型
        default: {
          logger.info(i)
        }
      }
    }
    return elements
  }

  /** karin转onebot11 */
  #Elements_OneBot_V11 (data) {
    const elements = []
    for (let i of data) {
      switch (i.type) {
        case 'text':
          elements.push({ type: 'text', data: { text: i.text } })
          break
        case 'face':
          elements.push({ type: 'face', data: { id: i.id } })
          break
        case 'image':
          elements.push({ type: 'image', data: { file: i.file } })
          break
        case 'at':
          elements.push({ type: 'at', data: { qq: String(i.uid || i.uin) } })
          break
        case 'reply':
          elements.push({ type: 'reply', data: { id: i.message_id } })
          break
        case 'file':
          elements.push({ type: 'file', data: { file: i.file } })
          break
        case 'button':
        case 'markdown': {
          const { type, ...data } = i
          elements.push({ type, data: { ...data } })
          break
        }
        case 'rows': {
          for (let val of i.rows) {
            elements.push({ type: 'button', data: { buttons: val.buttons } })
          }
          break
        }
        default: {
          const { type, ...data } = i
          elements.push({ type, data: { ...data } })
          logger.info(i)
        }
      }
    }
    return elements
  }

  /** 日志 加上前缀 */
  logger (level, ...args) {
    logger[level](common.logger(this.account.uin, ...args))
  }

  /**
   * 获取头像url
   * @param size 头像大小，默认`0`
   * @param uid 用户qq，默认为机器人QQ
   * @returns 头像的url地址
   */
  getAvatarUrl (uid = this.#id, size = 0) {
    return `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${uid}`
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
   * @param {message} message - 要发送的内容
   * @returns {Promise<message_id>} - 消息ID
   */
  async send_private_msg (user_id, message) {
    message = this.#Elements_OneBot_V11(message)
    // this.logger(`${logger.green(`Send private ${user_id}: `)}${this.logSend(message)}`))
    return await this.SendApi('send_private_msg', { user_id, message })
  }

  /**
   * 发送群消息
   * @param {number} group_id - 群号
   * @param {message} message - 要发送的内容
   * @returns {Promise<message_id>} - 消息ID
   */
  async send_group_msg (group_id, message) {
    message = this.#Elements_OneBot_V11(message)
    // this.logger(`${logger.green(`Send Group ${group_id}: `)}${this.logSend(message)}`))
    return await this.SendApi('send_group_msg', { group_id, message })
  }

  /**
   * 发送消息
   * @param {number} id - user_id 或 group_id
   * @param {message} message - 要发送的内容
   * @param {string} message_type - 消息类型，支持 private、group，分别对应私聊、群组，如不传入，则根据传入的 *_id 参数判断
   * @returns {Promise<message_id>} - 消息ID
   */
  async send_msg (id, message, message_type) {
    message = this.#Elements_OneBot_V11(message)
    if (!message_type) throw new Error('message_type 不能为空')
    const type = message_type === 'private' ? 'user_id' : 'group_id'
    // this.logger(`${logger.green(`Send ${message_type} ${id}: `)}${this.logSend(message)}`))
    return await this.SendApi('send_msg', { message_type, [type]: id, message })
  }

  /**
   * 撤回消息
   * @param {number} message_id - 消息ID
   * @returns {Promise<object>} - 消息内容
   */
  async delete_msg (message_id) {
    return await this.SendApi('delete_msg', { message_id })
  }

  /**
   * 获取消息
   * @param {number} message_id - 消息ID
   * @returns {Promise<object>} - 消息内容
   */
  async get_msg (message_id) {
    return await this.SendApi('get_msg', { message_id })
  }

  /**
 * 获取合并转发消息
 * @param {string} id - 合并转发 ID
 * @returns {Promise<object>} - 消息内容，使用消息的数组格式表示，数组中的消息段全部为 node 消息段
 */
  async get_forward_msg (id) {
    return await this.SendApi('get_forward_msg', { id })
  }

  /**
   * 发送好友赞
   * @param {number} user_id - 对方 QQ 号
   * @param {number} [times=1] - 赞的次数，每个好友每天最多 10 次
   */
  async send_like (user_id, times = 1) {
    await this.SendApi('send_like', { user_id, times })
  }

  /**
   * 群组踢人
   * @param {number} group_id - 群号
   * @param {number} user_id - 要踢的 QQ 号
   * @param {boolean} [reject_add_request=false] - 拒绝此人的加群请求
   */
  async set_group_kick (group_id, user_id, reject_add_request = false) {
    await this.SendApi('set_group_kick', { group_id, user_id, reject_add_request })
  }

  /**
   * 群组单人禁言
   * @param {number} group_id - 群号
   * @param {number} user_id - 要禁言的 QQ 号
   * @param {number} [duration=1800] - 禁言时长，单位秒，0 表示取消禁言
   */
  async set_group_ban (group_id, user_id, duration = 1800) {
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
   * @param {boolean} [enable=true] - 是否禁言
   */
  async set_group_whole_ban (group_id, enable = true) {
    await this.SendApi('set_group_whole_ban', { group_id, enable })
  }

  /**
   * 群组设置管理员
   * @param {number} group_id - 群号
   * @param {number} user_id - 要设置管理员的 QQ 号
   * @param {boolean} [enable=true] - true 为设置，false 为取消
   */
  async set_group_admin (group_id, user_id, enable = true) {
    await this.SendApi('set_group_admin', { group_id, user_id, enable })
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
   * 设置群名片（群备注）
   * @param {number} group_id - 群号
   * @param {number} user_id - 要设置的 QQ 号
   * @param {string} [card=''] - 群名片内容，不填或空字符串表示删除群名片
   */
  async set_group_card (group_id, user_id, card = '') {
    await this.SendApi('set_group_card', { group_id, user_id, card })
  }

  /**
   * 设置群名
   * @param {number} group_id - 群号
   * @param {string} group_name - 新群名
   */
  async set_group_name (group_id, group_name) {
    await this.SendApi('set_group_name', { group_id, group_name })
  }

  /**
   * 退出群组
   * @param {number} group_id - 群号
   * @param {boolean} [is_dismiss=false] - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  async set_group_leave (group_id, is_dismiss = false) {
    await this.SendApi('set_group_leave', { group_id, is_dismiss })
  }

  /**
   * 设置群组专属头衔
   * @param {number} group_id - 群号
   * @param {number} user_id - 要设置的 QQ 号
   * @param {string} [special_title=''] - 专属头衔，不填或空字符串表示删除专属头衔
   * @param {number} [duration=-1] - 专属头衔有效期，单位秒，-1 表示永久
   */
  async set_group_special_title (group_id, user_id, special_title = '', duration = -1) {
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
   * @returns {Promise<object>} - 登录号信息
   */
  async get_login_info () {
    return await this.SendApi('get_login_info')
  }

  /**
   * 获取陌生人信息
   * @param {number} user_id - QQ 号
   * @param {boolean} [no_cache=false] - 是否不使用缓存
   * @returns {Promise<object>} - 陌生人信息
   */
  async get_stranger_info (user_id, no_cache = false) {
    return await this.SendApi('get_stranger_info', { user_id, no_cache })
  }

  /**
   * 获取好友列表
   * @returns {Promise<Array<object>>} - 好友列表
   */
  async get_friend_list () {
    return await this.SendApi('get_friend_list')
  }

  /**
   * 获取群信息
   * @param {number} group_id - 群号
   * @param {boolean} [no_cache=false] - 是否不使用缓存
   * @returns {Promise<object>} - 群信息
   */
  async get_group_info (group_id, no_cache = false) {
    return await this.SendApi('get_group_info', { group_id, no_cache })
  }

  /**
   * 获取群列表
   * @returns {Promise<Array<object>>} - 群列表
   */
  async get_group_list () {
    return await this.SendApi('get_group_list')
  }

  /**
   * 获取群成员信息
   * @param {number} group_id - 群号
   * @param {number} user_id - QQ 号
   * @param {boolean} [no_cache=false] - 是否不使用缓存
   * @returns {Promise<object>} - 群成员信息
   */
  async get_group_member_info (group_id, user_id, no_cache = false) {
    return await this.SendApi('get_group_member_info', { group_id, user_id, no_cache })
  }

  /**
   * 获取群成员列表
   * @param {number} group_id - 群号
   * @returns {Promise<Array<object>>} - 群成员列表
   */
  async get_group_member_list (group_id) {
    return await this.SendApi('get_group_member_list', { group_id })
  }

  /**
   * 获取群荣誉信息
   * @param {number} group_id - 群号
   * @param {string} type - 要获取的群荣誉类型
   * @returns {Promise<object>} - 群荣誉信息
   */
  async get_group_honor_info (group_id, type) {
    return await this.SendApi('get_group_honor_info', { group_id, type })
  }

  /**
   * 获取 Cookies
   * @param {string} domain - 需要获取 cookies 的域名
   * @returns {Promise<object>} - Cookies
   */
  async get_cookies (domain) {
    return await this.SendApi('get_cookies', { domain })
  }

  /**
   * 获取 CSRF Token
   * @returns {Promise<object>} - CSRF Token
   */
  async get_csrf_token () {
    return await this.SendApi('get_csrf_token')
  }

  /**
 * 获取 QQ 相关接口凭证
 * @param {string} domain - 需要获取 cookies 的域名
 * @returns {Promise<object>} - QQ 相关接口凭证
 */
  async get_credentials (domain) {
    return await this.SendApi('get_credentials', { domain })
  }

  /**
   * 获取语音
   * @param {string} file - 收到的语音文件名
   * @param {string} out_format - 要转换到的格式
   * @returns {Promise<object>} - 转换后的语音文件路径
   */
  async get_record (file, out_format) {
    return await this.SendApi('get_record', { file, out_format })
  }

  /**
   * 获取图片
   * @param {string} file - 收到的图片文件名
   * @returns {Promise<object>} - 下载后的图片文件路径
   */
  async get_image (file) {
    return await this.SendApi('get_image', { file })
  }

  /**
   * 检查是否可以发送图片
   * @returns {Promise<object>} - 是否可以发送图片
   */
  async can_send_image () {
    return await this.SendApi('can_send_image')
  }

  /**
   * 检查是否可以发送语音
   * @returns {Promise<object>} - 是否可以发送语音
   */
  async can_send_record () {
    return await this.SendApi('can_send_record')
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
   * @returns {Promise<object>} - 版本信息
   */
  async get_version_info () {
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
   * @returns {Promise<object>} - API返回
   */
  async SendApi (action, params = {}) {
    const echo = randomUUID()
    const request = JSON.stringify({ echo, action, params })
    return new Promise((resolve, reject) => {
      this.socket.send(request)
      this.socket.on(echo, (data) => {
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
      }, Cfg.Config.ws_timeout * 1000)
    })
  }
}

export default { url: '/onebot/v11/ws', adapter: OneBot11 }
