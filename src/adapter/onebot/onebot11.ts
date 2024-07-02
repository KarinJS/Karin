import WebSocket from 'ws'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'
import { KarinAdapter } from 'karin/types'
import { listener } from 'karin/core/listener'
import { common, config, logger, segment } from 'karin/utils'
import { KarinMessage, KarinNotice, KarinRequest } from 'karin/event'

import {
  Role,
  Scene,
  contact,
  ByPostType,
  OneBot11Api,
  KarinElement,
  OneBot11Event,
  OneBot11Segment,
  CustomNodeSegment,
  OneBot11ApiParamsType,
  GroupInfo,
  KarinNodeElement,
  CustomMusicElemen,
} from 'karin/types'

/**
 * @class OneBot11
 * @extends KarinAdapter
 */
export class AdapterOneBot11 implements KarinAdapter {
  /**
   * 是否初始化
   */
  #init = false
  /**
   * - 重连次数 仅正向ws使用
   */
  index: number
  socket!: WebSocket
  account: KarinAdapter['account']
  adapter: KarinAdapter['adapter']
  version: KarinAdapter['version']

  constructor () {
    this.index = 0
    this.account = { uid: '', uin: '', name: '' }
    this.adapter = { id: 'QQ', name: 'OneBot11', type: 'ws', sub_type: 'internal', start_time: Date.now(), connect: '' }
    this.version = { name: '', app_name: '', version: '' }
  }

  /**
   * 反向ws初始化
   */
  async server (socket: WebSocket, request: IncomingMessage) {
    this.socket = socket

    const self_id = String(request.headers['x-self-id']) as string
    const connect = 'ws://' + (request.headers.host as String) + (request.url as String)

    this.account.uin = self_id
    this.account.uid = self_id
    this.adapter.connect = connect
    this.adapter.sub_type = 'server'
    this.logger('info', `[反向WS][onebot11-${request.headers.upgrade}][${self_id}] ` + logger.green(connect))
    await this.#initListener(connect)
  }

  /**
   * 正向ws初始化
   * @param connect - WebSocket连接地址
   */
  async client (connect: string) {
    /** 创建连接 */
    this.socket = new WebSocket(connect)

    this.socket.on('open', async () => {
      this.adapter.sub_type = 'client'
      this.adapter.connect = connect

      logger.info('[正向WS][连接成功][onebot11] ' + logger.green(connect))
      this.index = 0
      this.#initListener(connect)
    })

    /** 监听断开 */
    this.socket.on('close', async () => {
      this.index++
      logger.warn(`[正向WS][重连次数:${this.index}] 连接断开，将在5秒后重连：${connect}`)
      /** 停止全部监听 */
      this.socket.removeAllListeners()
      await common.sleep(5000)
      this.client(connect)
    })
  }

  /**
   * 初始化监听事件
   * @param connect - WebSocket连接地址
   */
  async #initListener (connect: string) {
    /** 监听事件 */
    this.socket.on('message', data => {
      this.logger('debug', `[收到事件]：${data}`)
      const event = data.toString().trim() || '{"post_type":"error","error":"空事件"}'
      const json = JSON.parse(event)
      if (json.echo) {
        return this.socket.emit(json.echo, json)
      } else {
        /** 未初始化 */
        this.#init && this.#event(json)
      }
    })

    /** 监听错误 */
    this.socket.on('error', error => {
      this.logger('debug', '[正向WS] 发生错误', error)
    })

    /** 监听断开 */
    this.socket.once('close', async () => {
      const type = this.adapter.sub_type === 'server' ? '反向WS' : '正向WS'
      this.logger('warn', `[${type}] 连接断开：${connect}`)
      /** 停止全部监听 */
      this.socket.removeAllListeners()

      /** 正向ws需要重连 */
      if (this.adapter.sub_type === 'client') {
        this.index++
        this.logger('warn', `[正向WS][重连次数:${this.index}] 连接断开，将在5秒后重连：${connect}`)
        await common.sleep(5000)
        this.client(connect)
      }
    })
    await this.getSelf()
    this.#init = true
  }

  get self_id () {
    return this.account.uid || this.account.uin
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
    this.logger('info', `[加载完成][app_name:${this.version.name}][version:${this.version.version}] ` + logger.green(this.adapter.connect as string))
    /** 注册bot */
    listener.emit('bot', { type: 'websocket', bot: this })
  }

  /** 是否初始化 */
  get isInit () {
    return new Promise(resolve => {
      const timer = setInterval(() => {
        if (this.account.name) {
          const { name, version } = this.version
          this.logger('info', `建立连接成功：[${name}(${version})] ${this.adapter.connect}`)
          clearInterval(timer)
          resolve(true)
        }
      }, 100)
    })
  }

  /**
   * 处理事件
   * - @param data ob11相关标准数据
   */
  #event (data: OneBot11Event) {
    switch (data.post_type) {
      case 'meta_event': {
        switch (data.meta_event_type) {
          case 'heartbeat':
            this.logger('trace', `[心跳]：${JSON.stringify(data.status)}`)
            break
          case 'lifecycle': {
            const typeMap = {
              enable: 'OneBot启用',
              disable: 'OneBot停用',
              connect: 'WebSocket连接成功',
            }
            const sub_type = data.sub_type
            this.logger('debug', `[生命周期]：${typeMap[sub_type]}`)
            break
          }
        }
        listener.emit('meta_event', data)
        return
      }
      case 'message':
      case 'message_sent': {
        const message = {
          event: (data.post_type + '') as 'message' | 'message_sent',
          event_id: data.message_id + '',
          self_id: data.self_id + '',
          user_id: data.sender.user_id + '',
          time: data.time,
          message_id: data.message_id + '',
          message_seq: data.message_id + '',
          sender: {
            ...data.sender,
            uid: data.sender.user_id + '',
            uin: data.sender.user_id + '',
            nick: data.sender.nickname || '',
            role: ('role' in data.sender ? data.sender.role || '' : '') as Role,
          },
          elements: this.AdapterConvertKarin(data.message),
          contact: {
            scene: (data.message_type === 'private' ? 'private' : 'group') as 'private' | 'group',
            peer: data.message_type === 'private' ? data.sender.user_id : data.group_id,
            sub_peer: '',
          },
          group_id: data.message_type === 'group' ? data.group_id : '',
          raw_message: '',
        }

        const e = new KarinMessage(message)
        e.bot = this
        /**
         * 快速回复 开发者不应该使用这个方法，应该使用由karin封装过后的reply方法
         */
        e.replyCallback = async elements => {
          if (data.message_type === 'private') {
            return this.send_private_msg(data.user_id, elements)
          } else {
            return this.send_group_msg(data.group_id, elements)
          }
        }

        listener.emit('message', e)
        return
      }
      case 'notice':
        this.#notice_event(data)
        return
      case 'request':
        this.#request_event(data)
        return
      default:
        this.logger('info', `未知事件：${JSON.stringify(data)}`)
    }
  }

  /**
   * 通知事件
   */
  #notice_event (data: ByPostType<'notice'>) {
    const time = data.time
    const self_id = data.self_id + ''
    let notice = {}

    const user_id = data.user_id + ''
    const event_id = `notice.${time}`
    const sender = {
      uid: data.user_id + '',
      uin: data.user_id + '',
      nick: '',
      role: '' as Role,
    }

    const contact = {
      scene: ('group_id' in data ? 'group' : 'private') as Scene,
      peer: 'group_id' in data ? data.group_id : data.user_id,
      sub_peer: '',
    }

    switch (data.notice_type) {
      // 群文件上传
      case 'group_upload': {
        const content = {
          group_id: data.group_id + '',
          operator_uid: data.user_id + '',
          operator_uin: data.user_id + '',
          file_id: data.file.id,
          file_sub_id: 0,
          file_name: data.file.name,
          file_size: data.file.size,
          expire_time: 0,
          file_url: '',
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          content,
          sender,
          contact,
          sub_event: 'group_file_uploaded' as 'group_file_uploaded',
        }
        notice = new KarinNotice(options)
        break
      }
      // 群管理员变动
      case 'group_admin': {
        const content = {
          group_id: data.group_id + '',
          target_uid: data.user_id + '',
          target_uin: data.user_id + '',
          is_admin: data.sub_type === 'set',
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_admin_changed' as 'group_admin_changed',
        }
        notice = new KarinNotice(options)
        break
      }
      // 群成员减少
      case 'group_decrease': {
        const content = {
          group_id: data.group_id + '',
          operator_uid: data.operator_id || '',
          operator_uin: data.operator_id || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          type: data.sub_type,
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_member_decrease' as 'group_member_decrease',
        }
        notice = new KarinNotice(options)
        break
      }
      // 群成员增加
      case 'group_increase': {
        const content = {
          group_id: data.group_id + '',
          operator_uid: (data.operator_id || '') + '',
          operator_uin: (data.operator_id || '') + '',
          target_uid: (data.user_id || '') + '',
          target_uin: (data.user_id || '') + '',
          type: data.sub_type,
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_member_increase' as 'group_member_increase',
        }
        notice = new KarinNotice(options)
        break
      }
      // 群禁言事件
      case 'group_ban': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.operator_id || '',
          operator_uin: data.operator_id || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          duration: data.duration,
          type: data.sub_type,
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_member_ban' as 'group_member_ban',
        }
        notice = new KarinNotice(options)
        break
      }
      case 'friend_add':
        // todo kritor没有这个事件
        this.logger('info', `[好友添加]：${JSON.stringify(data)}`)
        break
      case 'group_recall': {
        const content = {
          group_id: data.group_id,
          operator_uid: data.operator_id || '',
          operator_uin: data.operator_id || '',
          target_uid: data.user_id || '',
          target_uin: data.user_id || '',
          message_id: data.message_id,
          tip_text: '撤回了一条消息',
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_recall' as 'group_recall',
        }
        notice = new KarinNotice(options)
        break
      }
      case 'friend_recall': {
        const content = {
          operator_uid: data.user_id || '',
          operator_uin: data.user_id || '',
          message_id: data.message_id,
          tip_text: '撤回了一条消息',
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'private_recall' as 'private_recall',
        }
        notice = new KarinNotice(options)
        break
      }
      case 'notify':
        switch (data.sub_type) {
          case 'poke': {
            const content = {
              group_id: data.group_id + '',
              operator_uid: data.user_id + '',
              operator_uin: data.user_id + '',
              target_uid: data.target_id + '',
              target_uin: data.target_id + '',
              action: '戳了戳',
              suffix: '',
              action_image: '',
            }

            const options = {
              time,
              self_id,
              user_id,
              event_id,
              sender,
              contact,
              content,
              sub_event: data.group_id ? 'group_poke' : 'private_poke' as 'group_poke' | 'group_poke',
            }
            notice = new KarinNotice(options)
            break
          }
          case 'lucky_king':
            // todo kritor没有这个事件
            this.logger('info', `[运气王]：${JSON.stringify(data)}`)
            break
          case 'honor':
            // todo kritor没有这个事件
            this.logger('info', `[群荣誉变更]：${JSON.stringify(data)}`)
            break
        }
        break
      case 'group_msg_emoji_like': {
        const content = {
          group_id: data.group_id + '',
          message_id: data.message_id,
          face_id: data.likes[0].emoji_id,
          is_set: true,
        }

        const options = {
          time,
          self_id,
          user_id,
          event_id,
          sender,
          contact,
          content,
          sub_event: 'group_message_reaction' as 'group_message_reaction',
        }
        notice = new KarinNotice(options)
        break
      }
      default: {
        return this.logger('error', '未知通知事件：', JSON.stringify(data))
      }
    }

    listener.emit('notice', notice)
  }

  /** 请求事件 */
  #request_event (data: ByPostType<'request'>) {
    switch (data.request_type) {
      case 'friend': {
        const request = new KarinRequest({
          event_id: `request.${data.time}`,
          self_id: data.self_id + '',
          user_id: data.user_id + '',
          time: data.time,
          contact: {
            scene: 'private',
            peer: data.user_id + '',
            sub_peer: '',
          },
          sender: {
            uid: data.user_id + '',
            uin: data.user_id + '',
            nick: '',
            role: '' as Role,
          },
          sub_event: 'private_apply' as 'private_apply',
          content: {
            applier_uid: data.user_id + '',
            applier_uin: data.user_id + '',
            message: data.comment,
          },
        })
        listener.emit('request', request)
        return
      }
      case 'group': {
        const request = new KarinRequest({
          event_id: `request.${data.time}`,
          self_id: data.self_id + '',
          user_id: data.user_id + '',
          time: data.time,
          contact: {
            scene: 'group',
            peer: data.group_id + '',
            sub_peer: '',
          },
          sender: {
            uid: data.user_id + '',
            uin: data.user_id + '',
            nick: '',
            role: '' as Role,
          },
          sub_event: data.sub_type === 'add' ? 'group_apply' : 'invited_group',
          content: {
            group_id: data.group_id + '',
            applier_uid: data.user_id + '',
            applier_uin: data.user_id + '',
            inviter_uid: data.user_id + '',
            inviter_uin: data.user_id + '',
            message: data.comment,
          },
        })
        listener.emit('request', request)
        return
      }
      default: {
        this.logger('info', `未知请求事件：${JSON.stringify(data)}`)
      }
    }
  }

  /**
   * onebot11转karin
   * @return karin格式消息
   * */
  AdapterConvertKarin (data: Array<OneBot11Segment>): Array<KarinElement> {
    const elements = []
    for (const i of data) {
      switch (i.type) {
        case 'text':
          elements.push(segment.text(i.data.text))
          break
        case 'face':
          elements.push(segment.face(Number(i.data.id)))
          break
        case 'image':
          elements.push(segment.image(i.data.url || i.data.file, { file_type: i.data.type }))
          break
        case 'record':
          elements.push(segment.voice(i.data.url || i.data.file, i.data.magic === 1))
          break
        case 'video':
          elements.push(segment.video(i.data.url || i.data.file))
          break
        case 'at':
          elements.push(segment.at(i.data.qq, i.data.qq))
          break
        case 'poke':
          elements.push(segment.poke(Number(i.data.id), Number(i.data.type)))
          break
        case 'contact':
          elements.push(segment.contact(i.data.type === 'qq' ? 'friend' : 'group', i.data.id))
          break
        case 'location':
          elements.push(segment.location(Number(i.data.lat), Number(i.data.lon), i.data.title || '', i.data.content || ''))
          break
        case 'reply':
          elements.push(segment.reply(i.data.id))
          break
        case 'forward':
          elements.push(segment.forward(i.data.id))
          break
        case 'json':
          elements.push(segment.json(i.data.data))
          break
        case 'xml':
          elements.push(segment.xml(i.data.data))
          break
        default: {
          elements.push(segment.text(JSON.stringify(i)))
        }
      }
    }
    return elements
  }

  /**
   * karin转onebot11
   * @param data karin格式消息
   * */
  KarinConvertAdapter (data: Array<KarinElement>): Array<OneBot11Segment> {
    const elements = []

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
        case 'xml': {
          elements.push({ type: 'xml', data: { data: i.data } })
          break
        }
        case 'json': {
          elements.push({ type: 'json' as 'json', data: { data: i.data } })
          break
        }
        case 'forward': {
          elements.push({ type: 'forward', data: { id: i.res_id } })
          break
        }
        case 'record':
        case 'voice': {
          elements.push({ type: 'record', data: { file: i.file, magic: i.magic || false } })
          break
        }
        case 'music': {
          if (i.id) {
            elements.push({ type: 'music', data: { type: i.platform, id: i.id } })
          } else {
            const { url, audio, title, author, pic } = i as unknown as CustomMusicElemen
            elements.push({ type: 'music', data: { type: 'custom', url, audio, title, content: author, image: pic } })
          }
          break
        }
        case 'button': {
          elements.push({ type: 'button', data: i.data })
          break
        }
        case 'markdown': {
          const { type, ...data } = i
          elements.push({ type, data: { ...data } })
          break
        }
        case 'rows': {
          for (const val of i.rows) {
            elements.push({ type: 'button', data: val.data })
          }
          break
        }
        case 'poke': {
          elements.push({ type: 'poke', data: { type: i.poke_type, id: i.id } })
          break
        }
        case 'bubble_face': {
          elements.push({ type: 'bubble_face', data: { id: i.id, count: i.count } })
          break
        }
        case 'contact': {
          elements.push({ type: 'contact', data: { type: i.scene, id: i.peer } })
          break
        }
        case 'location': {
          elements.push({ type: 'location', data: { lat: i.lat, lon: i.lon, title: i.title, content: i.address } })
          break
        }
        case 'long_msg':
        case 'basketball':
        case 'dice':
        case 'market_face':
        case 'rps': {
          elements.push({ type: i.type, data: { id: i.id } })
          break
        }
        case 'gift': {
          elements.push({ type: 'gift', data: { qq: i.qq, id: i.id } })
          break
        }
        case 'share': {
          elements.push({ type: 'share', data: { url: i.url, title: i.title, content: i.content, image: i.image } })
          break
        }
        case 'weather': {
          elements.push({ type: 'weather', data: { city: i.city, type: i.type } })
          break
        }
        default: {
          elements.push(i)
          break
        }
      }
    }
    return elements as Array<OneBot11Segment>
  }

  /**
   * 专属当前Bot的日志打印方法
   */
  logger (level: 'info' | 'error' | 'trace' | 'debug' | 'mark' | 'warn' | 'fatal', ...args: any[]) {
    logger.bot(level, this.account.uid || this.account.uin, ...args)
  }

  /**
   * 获取头像url
   * @param 头像大小，默认`0`
   * @param 用户qq，默认为机器人QQ
   * @returns 头像的url地址
   */
  getAvatarUrl (uid = this.account.uid || this.account.uin, size = 0) {
    return Number(uid) ? `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${uid}` : `https://q.qlogo.cn/qqapp/${uid}/${uid}/${size}`
  }

  /**
   * 获取群头像
   * @param group_id - 群号
   * @param size - 头像大小，默认`0`
   * @param history - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns - 群头像的url地址
   */
  getGroupAvatar (group_id: string, size = 0, history = 0) {
    return `https://p.qlogo.cn/gh/${group_id}/${group_id}${history ? '_' + history : ''}/` + size
  }

  /**
   * 发送私聊消息
   * @param user_id - 用户ID
   * @param message - 要发送的内容
   * @returns - 消息ID
   */
  async send_private_msg (user_id: string, message: Array<KarinElement>): Promise<{ message_id?: string }> {
    const obMessage = this.KarinConvertAdapter(message)
    // this.logger(`${logger.green(`Send private ${user_id}: `)}${this.logSend(message)}`))
    return await this.SendApi('send_private_msg', { user_id, message: obMessage })
  }

  /**
   * 发送群消息
   * @param group_id - 群号
   * @param message - 要发送的内容
   * @returns - 消息ID
   */
  async send_group_msg (group_id: string, message: Array<KarinElement>) {
    const obMessages = this.KarinConvertAdapter(message)
    return await this.SendApi('send_group_msg', { group_id, message: obMessages })
  }

  /**
   * 发送消息
   *
   * @param contact
   * @param elements
   * @returns - 消息ID
   */
  async SendMessage (contact: contact, elements: Array<KarinElement>) {
    const { scene, peer } = contact
    const message_type = scene === 'group' ? 'group' : 'private'
    const key = scene === 'group' ? 'group_id' : 'user_id'
    const message = this.KarinConvertAdapter(elements)
    const params = { [key]: peer, message_type, message }
    return await this.SendApi('send_msg', params)
  }

  /**
   * 上传合并转发消息
   * @param contact - 联系人信息
   * @param elements - nodes
   * @returns - 资源id
   * */
  async UploadForwardMessage (contact: contact, elements: KarinNodeElement[]) {
    if (!Array.isArray(elements)) elements = [elements]
    if (elements.some((element: { type: string }) => element.type !== 'node')) {
      throw new Error('elements should be all node type')
    }
    const { scene, peer } = contact
    const message_type = scene === 'group' ? 'group_id' : 'user_id'
    const messages = []
    const selfUin = this.account.uin
    const selfNick = this.account.name

    for (const i of elements) {
      const { type, user_id, nickname, content: contents } = i
      const content = this.KarinConvertAdapter(contents as KarinElement[])
      messages.push({ type, data: { uin: user_id || selfUin, name: nickname || selfNick, content } })
    }

    const params = { [message_type]: String(peer), messages }
    return await this.SendApi('send_forward_msg', params)
  }

  /**
   * 通过资源id发送转发消息
   * @param contact - 联系人信息
   * @param id - 资源id
   * */
  async SendMessageByResId (contact: contact, id: string) {
    const { scene, peer } = contact
    const message_type = scene === 'group' ? 'group' : 'private'
    const key = scene === 'group' ? 'group_id' : 'user_id'
    const message = [{ type: 'forward', data: { id } }]
    const params = { [key]: peer, message_type, message }
    const res = await this.SendApi('send_msg', params)
    return { message_id: res.message_id, message_time: Date.now() }
  }

  /**
   * 撤回消息
   * @param _contact - ob11无需提供contact参数
   * @param message_id - 消息ID
   */

  async RecallMessage (_contact: contact, message_id: string) {
    return await this.SendApi('delete_msg', { message_id })
  }

  /**
   * 获取消息
   * @param _contact - ob11无需提供contact参数
   * @param message_id - 消息ID
   * @returns {Promise<object>} - 消息内容
   */

  async GetMessage (_contact: contact, message_id: string) {
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

  /**
   * 获取msg_id获取历史消息
   * @description 此api各平台实现不同，暂时废弃
   */
  async GetHistoryMessage (contact: contact, start_message_id: string, count: number = 1) {
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
   * 获取合并转发消息
   */
  async get_forward_msg (id: string): Promise<Array<CustomNodeSegment>> {
    return await this.SendApi('get_forward_msg', { id })
  }

  /**
   * 发送好友赞
   * @param target_uid_or_uin - 用户ID
   * @param vote_count - 赞的次数，默认为`10`
   */
  async VoteUser (target_uid_or_uin: string, vote_count: number = 10) {
    const user_id = Number(target_uid_or_uin)
    await this.SendApi('send_like', { user_id, times: vote_count })
  }

  /**
   * 群组踢人
   */
  async KickMember (group_id: string, target_uid_or_uin: string, reject_add_request: boolean = false, kick_reason: string = '') {
    const user_id = Number(target_uid_or_uin)
    await this.SendApi('set_group_kick', { group_id, user_id, reject_add_request })
  }

  /**
   * 禁言用户
   * @param group_id - 群号
   * @param target_uid_or_uin - 用户ID
   * @param duration - 禁言时长，单位秒，0 表示取消禁言
   */
  async BanMember (group_id: string, target_uid_or_uin: string, duration: number) {
    const user_id = Number(target_uid_or_uin)
    await this.SendApi('set_group_ban', { group_id, user_id, duration })
  }

  /**
   * 群组全员禁言
   * @param group_id - 群号
   * @param is_ban - 是否全员禁言
   */
  async SetGroupWholeBan (group_id: string, is_ban = true) {
    await this.SendApi('set_group_whole_ban', { group_id, enable: is_ban })
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
  async SetGroupAdmin (group_id: string, target_uid_or_uin: string, is_admin: boolean) {
    const user_id = Number(target_uid_or_uin)
    await this.SendApi('set_group_admin', { group_id, user_id, enable: is_admin })
  }

  /**
   * 群组匿名
   * @param group_id - 群号
   * @param enable - 是否允许匿名聊天
   */
  async set_group_anonymous (group_id: string, enable = true) {
    await this.SendApi('set_group_anonymous', { group_id, enable })
  }

  /**
   * 修改群名片
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户ID
   * @param card - 新名片
   */
  async ModifyMemberCard (group_id: string, target_uid_or_uin: string, card: string) {
    const user_id = Number(target_uid_or_uin)
    await this.SendApi('set_group_card', { group_id, user_id, card })
  }

  /**
   * 设置群名
   * @param group_id - 群号
   * @param group_name - 新群名
   */
  async ModifyGroupName (group_id: string, group_name: string) {
    await this.SendApi('set_group_name', { group_id, group_name })
  }

  /**
   * 退出群组
   * @param group_id - 群号
   * @param is_dismiss - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  async LeaveGroup (group_id: string, is_dismiss = false) {
    await this.SendApi('set_group_leave', { group_id, is_dismiss })
  }

  /**
   * 设置群专属头衔
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户ID
   * @param special_title - 专属头衔
   */
  async SetGroupUniqueTitle (group_id: string, target_uid_or_uin: string, unique_title: string) {
    const user_id = Number(target_uid_or_uin)
    const special_title = unique_title
    const duration = -1
    await this.SendApi('set_group_special_title', { group_id, user_id, special_title, duration })
  }

  // /**
  //  * 处理加好友请求
  //  * @param flag - 加好友请求的 flag（需从上报的数据中获得）
  //  * @param {boolean} [approve=true] - 是否同意请求
  //  * @param [remark=''] - 添加后的好友备注（仅在同意时有效）
  //  */
  // async set_friend_add_request(flag: string, approve = true, remark = '') {
  //   await this.SendApi('set_friend_add_request', { flag, approve, remark })
  // }

  // /**
  //  * 处理加群请求／邀请
  //  * @param flag - 加群请求的 flag（需从上报的数据中获得）
  //  * @param sub_type - add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
  //  * @param {boolean} [approve=true] - 是否同意请求／邀请
  //  * @param [reason=''] - 拒绝理由（仅在拒绝时有效）
  //  */
  // async set_group_add_request(flag: string, sub_type: string, approve = true, reason = '') {
  //   await this.SendApi('set_group_add_request', { flag, sub_type, approve, reason })
  // }

  /**
   * 获取登录号信息
   */
  async GetCurrentAccount (): Promise<{
    account_uid: string
    account_uin: string
    account_name: string
  }> {
    const res = await this.SendApi('get_login_info')
    return {
      account_uid: res.user_id as string,
      account_uin: res.user_id as string,
      account_name: res.nickname as string,
    }
  }

  /**
   * 获取陌生人信息 不支持批量获取 只支持一个
   * @param target_uid_or_uin - 目标用户ID
   */
  async GetStrangerProfileCard (target_uid_or_uin: Array<string>) {
    const user_id = Number(target_uid_or_uin[0]) || String(target_uid_or_uin[0])
    const res = await this.SendApi('get_stranger_info', { user_id, no_cache: true })
    return [res]
  }

  /**
   * 获取好友列表
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
    return friendList.map((friend: { user_id: any; nickname: any; user_name: any; remark: any; user_remark: any }) => {
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
   * @param group_id - 群号
   * @param no_cache - 是否不使用缓存
   */
  async GetGroupInfo (group_id: string, no_cache = false): Promise<GroupInfo> {
    const groupInfo = await this.SendApi('get_group_info', { group_id, no_cache })
    return {
      group_id: groupInfo.group_id,
      group_name: groupInfo.group_name,
      group_remark: groupInfo.group_memo || groupInfo.group_remark,
      max_member_count: groupInfo.max_member_count,
      member_count: groupInfo.member_count,
      group_uin: groupInfo.group_id,
      admins: groupInfo.admins,
      owner: groupInfo.admins[0],
    }
  }

  /**
   * 获取群列表
   */
  async GetGroupList () {
    const groupList = await this.SendApi('get_group_list')
    return groupList?.map((groupInfo: { group_id: any; group_name: any; group_memo: any; group_remark: any; max_member_count: any; member_count: any; admins: any }) => {
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
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户ID
   * @param refresh - 是否刷新缓存，默认为 false
   */
  async GetGroupMemberInfo (group_id: string, target_uid_or_uin: string, refresh = false) {
    const user_id = Number(target_uid_or_uin)
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
      shut_up_time: 0,
      level,
      shut_up_timestamp: groupMemberInfo.shut_up_timestamp,
      unfriendly: groupMemberInfo.unfriendly,
      card_changeable: groupMemberInfo.card_changeable,
    }
  }

  /**
   * 获取群成员列表
   * @param group_id - 群号
   * @param refresh - 是否刷新缓存，默认为 false
   */
  async GetGroupMemberList (group_id: string, refresh = false) {
    const gl = await this.SendApi('get_group_member_list', { group_id, refresh })
    return gl.map((groupMemberInfo: { level: string; user_id: any; nickname: any; age: any; title: any; title_expire_time: any; card: any; join_time: any; last_sent_time: any; shut_up_timestamp: any; unfriendly: any; card_changeable: any }) => {
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
   */
  async GetGroupHonor (group_id: string, refresh = false) {
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

    const result: { uin: string; uid: string; nick: string; honor_name: string; avatar: string; id: number; description: string }[] = []
    groupHonor.talkative_list.forEach((honor: { user_id: any; nickname: any; avatar: any; description: any }) => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '历史龙王',
        id: 0,
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.performer_list.forEach((honor: { user_id: any; nickname: any; avatar: any; description: any }) => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '群聊之火',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.legend_list.forEach((honor: { user_id: any; nickname: any; avatar: any; description: any }) => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '群聊炽焰',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.strong_newbie_list.forEach((honor: { user_id: any; nickname: any; avatar: any; description: any }) => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '冒尖小春笋',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.emotion_list.forEach((honor: { user_id: any; nickname: any; avatar: any; description: any }) => {
      result.push({
        uin: honor.user_id,
        uid: honor.user_id,
        nick: honor.nickname,
        honor_name: '快乐之源',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    return result
  }

  // /**
  //  * 对消息进行表情回应
  //  * @param Contact - 联系人信息
  //  * @param message_id - 消息ID
  //  * @param face_id - 表情ID
  //  */
  // async ReactMessageWithEmoji(Contact: any, message_id: any, face_id: any, is_set = true) {
  //   return await this.SendApi('set_msg_emoji_like', { message_id, emoji_id: face_id, is_set })
  // }

  /**
   * 获取版本信息
   */
  async GetVersion () {
    return await this.SendApi('get_version_info')
  }

  async DownloadForwardMessage () {
    throw new Error('Method not implemented.')
  }

  async GetEssenceMessageList () {
    throw new Error('Method not implemented.')
  }

  async SetEssenceMessage () { }
  async DeleteEssenceMessage () { }
  async SetFriendApplyResult () { }
  async SetGroupApplyResult () { }
  async SetInvitedJoinGroupResult () { }
  async ReactMessageWithEmoji () { }
  async UploadPrivateFile () { }
  async UploadGroupFile () { }
  async sendForwardMessage () {
    return {}
  }

  /**
   * 发送API请求
   * @param action - API断点
   * @param {object} params - API参数
   * @returns {Promise<any>} - API返回
   */
  async SendApi (action: OneBot11Api, params: OneBot11ApiParamsType[OneBot11Api] = {}, time = 0): Promise<any> {
    if (!time) time = config.timeout('ws')
    const echo = randomUUID()
    const request = JSON.stringify({ echo, action, params })
    logger.debug(`[API请求] ${action}: ${request}`)

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('API请求超时'))
      }, time * 1000)

      this.socket.send(request)
      this.socket.once(echo, data => {
        /** 停止监听器 */
        clearTimeout(timeoutId)

        if (data.status === 'ok') {
          resolve(data.data)
        } else {
          this.logger('error', `[Api请求错误] ${action}: ${JSON.stringify(data, null, 2)}`)
          reject(data)
        }
      })
    })
  }
}

export default {
  type: 'websocket',
  path: '/onebot/v11/ws',
  adapter: AdapterOneBot11,
}
