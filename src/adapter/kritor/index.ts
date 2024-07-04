import grpc from '@grpc/grpc-js'
import { kritor } from 'kritor-proto'
import { logger, config, segment } from 'karin/utils'
import { contact, KarinAdapter, KarinElement } from 'karin/types'
import { listener } from 'karin/core'

/**
 * @extends KarinAdapter
 */
export default class AdapterKritor implements KarinAdapter {
  account: KarinAdapter['account']
  adapter: KarinAdapter['adapter']
  version: KarinAdapter['version']
  /**
   * - gRPC 服务
   */
  grpc: grpc.ServerDuplexStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>
  /**
   * - 自增索引
   */
  seq: number
  constructor (
    /**
     * - gRPC 服务
     */
    grpc: grpc.ServerDuplexStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>,
    uid: string,
    uin: string
  ) {
    this.account = { uid, uin, name: '' }
    this.adapter = { id: 'QQ', name: 'Kritor', type: 'grpc', sub_type: 'server', start_time: Date.now(), connect: '', index: 0 }
    this.version = { name: '', app_name: '', version: '' }
    this.grpc = grpc
    /** 自增 */
    this.seq = 0

    /** 监听响应事件 */
    this.grpc.on('data', data => this.grpc.emit(data.seq, data))
    /** 监听关闭事件 */
    this.grpc.once('end', () => {
      this.logger('warn', '[反向gRPC] 连接已断开')
      this.grpc.removeAllListeners()
      this.adapter.index && listener.delBot(this.adapter.index)
    })
    this.#init()
  }

  get self_id () {
    return this.account.uid || this.account.uin
  }

  async #init () {
    const { account_name: name } = await this.GetCurrentAccount()
    this.account.name = name
    const { app_name, version } = await this.GetVersion()
    this.version.name = app_name
    this.version.app_name = app_name
    this.version.version = version
  }

  /**
   * 编码
   * @param service - 服务名
   * @param cmd - 方法名
   * @param type - 类型
   * @param buf - 数据
   */
  encode (service: string, cmd: string, type: string, buf: Uint8Array): { cmd: string, buf: Uint8Array } {
    buf = (kritor as any)[type][`${cmd}Request`].encode(buf).finish()
    cmd = `${service}.${cmd}`
    return { cmd, buf }
  }

  /**
   * 解码
   * @param cmd - 服务名.方法名
   * @param type - 类型
   * @param buf - 数据
   */
  decode (cmd: string, type: string, buf: Uint8Array) {
    return (kritor as any)[type][`${cmd}Response`].decode(buf)
  }

  /**
   * karin 转 kritor
   * @param data - 消息元素
   */
  AdapterConvertKarin (data: kritor.common.Element[]): KarinElement[] {
    const elements = []

    for (const i of data) {
      switch (i.type) {
        /** 文本消息 */
        case kritor.common.Element.ElementType.TEXT: {
          const text = (i.text as kritor.common.ITextElement).text as string
          elements.push(segment.text(text))
          break
        }
        /** 艾特消息 */
        case kritor.common.Element.ElementType.AT: {
          const uid = (i.at as kritor.common.IAtElement).uid as string
          const uin = String((i.at as kritor.common.IAtElement).uin)
          elements.push(segment.at(uid, uin))
          break
        }
        /** 表情消息 */
        case kritor.common.Element.ElementType.FACE: {
          const face = (i.face as kritor.common.IFaceElement).id as number
          const is_big = (i.face as kritor.common.IFaceElement).is_big as boolean
          elements.push(segment.face(face, is_big))
          break
        }
        /** 图片消息 */
        case kritor.common.Element.ElementType.IMAGE: {
          const file_url = (i.image as kritor.common.IImageElement).file_url as string
          const typeMap = {
            0: 'show',
            1: 'original',
            2: 'flash',
          }
          const options = {
            file_type: typeMap[(i.image as kritor.common.IImageElement).file_type as 0 | 1 | 2 || 0] as 'show' | 'flash' | 'original',
            name: (i.image as kritor.common.IImageElement).file_name || '',
            md5: (i.image as kritor.common.IImageElement).file_md5 || '',
            sub_type: String((i.image as kritor.common.IImageElement).sub_type),
            width: undefined,
            height: undefined,
          }
          elements.push(segment.image(file_url, options))
          break
        }
        /** 弹射表情 */
        case kritor.common.Element.ElementType.BUBBLE_FACE: {
          const id = (i.bubble_face as kritor.common.IBubbleFaceElement).id as number
          const count = (i.bubble_face as kritor.common.IBubbleFaceElement).count as number
          elements.push(segment.bubble_face(id, count))
          break
        }
        /** 回复消息 */
        case kritor.common.Element.ElementType.REPLY: {
          const message_id = (i.reply as kritor.common.IReplyElement).message_id as string
          elements.push(segment.reply(message_id))
          break
        }
        /** 语音消息 */
        case kritor.common.Element.ElementType.VOICE: {
          const file = (i.voice as kritor.common.IVoiceElement).file_url as string
          const magic = (i.voice as kritor.common.IVoiceElement).magic as boolean
          const md5 = (i.voice as kritor.common.IVoiceElement).file_md5 as string
          const name = (i.voice as kritor.common.IVoiceElement).file_name as string
          elements.push(segment.record(file, magic, md5, name))
          break
        }
        /** 视频消息 */
        case kritor.common.Element.ElementType.VIDEO: {
          const file = (i.video as kritor.common.IVideoElement).file_url as string
          const md5 = (i.video as kritor.common.IVideoElement).file_md5 as string
          const name = (i.video as kritor.common.IVideoElement).file_name as string
          elements.push(segment.video(file, md5, name))
          break
        }
        /** 篮球消息 */
        case kritor.common.Element.ElementType.BASKETBALL: {
          const id = (i.basketball as kritor.common.IBasketballElement).id as number
          elements.push(segment.basketball(id))
          break
        }
        /** 骰子消息 */
        case kritor.common.Element.ElementType.DICE: {
          const id = (i.dice as kritor.common.IDiceElement).id as number
          elements.push(segment.dice(id))
          break
        }
        case kritor.common.Element.ElementType.RPS: {
          const id = (i.rps as kritor.common.IRpsElement).id as number
          elements.push(segment.rps(id))
          break
        }
        /** 戳一戳消息 */
        case kritor.common.Element.ElementType.POKE: {
          const id = (i.poke as kritor.common.IPokeElement).id as number
          const poke_type = (i.poke as kritor.common.IPokeElement).poke_type as number
          const strength = (i.poke as kritor.common.IPokeElement).strength as number
          elements.push(segment.poke(id, poke_type, strength))
          break
        }
        /** 音乐消息 */
        case kritor.common.Element.ElementType.MUSIC: {
          const id = (i.music as kritor.common.IMusicElement).id as string
          const custom = (i.music as kritor.common.IMusicElement).custom as kritor.common.ICustomMusicData
          const { url, audio, title, author, pic } = custom
          elements.push(segment.customMusic(url as string, audio as string, title as string, author as string, pic as string, id))
          break
        }
        /** 天气消息 */
        case kritor.common.Element.ElementType.WEATHER: {
          const city = (i.weather as kritor.common.IWeatherElement).city as string
          const code = (i.weather as kritor.common.IWeatherElement).code as string
          elements.push(segment.weather(city, code))
          break
        }
        /** 位置消息 */
        case kritor.common.Element.ElementType.LOCATION: {
          const lat = (i.location as kritor.common.ILocationElement).lat as number
          const lon = (i.location as kritor.common.ILocationElement).lon as number
          const title = (i.location as kritor.common.ILocationElement).title as string
          const address = (i.location as kritor.common.ILocationElement).address as string
          elements.push(segment.location(lat, lon, title, address))
          break
        }
        /** 链接分享 */
        case kritor.common.Element.ElementType.SHARE: {
          const url = (i.share as kritor.common.IShareElement).url as string
          const title = (i.share as kritor.common.IShareElement).title as string
          const content = (i.share as kritor.common.IShareElement).content as string
          const image = (i.share as kritor.common.IShareElement).image as string
          elements.push(segment.share(url, title, content, image))
          break
        }
        /** 礼物消息 只收不发 */
        case kritor.common.Element.ElementType.GIFT: {
          const qq = Number((i.gift as kritor.common.IGiftElement).qq)
          const id = Number((i.gift as kritor.common.IGiftElement).id)
          elements.push(segment.gift(qq, id))
          break
        }
        /** 转发消息 */
        case kritor.common.Element.ElementType.FORWARD: {
          const res_id = (i.forward as kritor.common.IForwardElement).res_id as string
          const uniseq = (i.forward as kritor.common.IForwardElement).uniseq as string
          const summary = (i.forward as kritor.common.IForwardElement).summary as string
          const description = (i.forward as kritor.common.IForwardElement).description as string
          elements.push(segment.forward(res_id, uniseq, summary, description))
          break
        }
        /** 文件消息 收不到 文件为通知事件 不走这里 */
        case kritor.common.Element.ElementType.FILE: {
          // const file_url = (i.file as kritor.common.IFileElement).file_url as string
          // elements.push(new KarinFileElement(i.file.file_url))
          break
        }
        /** JSON消息 */
        case kritor.common.Element.ElementType.JSON: {
          const json = (i.json as kritor.common.IJsonElement).json as string
          elements.push(segment.json(json))
          break
        }
        /** XML消息 */
        case kritor.common.Element.ElementType.XML: {
          const xml = (i.xml as kritor.common.IXmlElement).xml as string
          elements.push(segment.xml(xml))
          break
        }
        // 这都啥玩意啊...
        case kritor.common.Element.ElementType.MARKET_FACE:
        case kritor.common.Element.ElementType.CONTACT:
        case kritor.common.Element.ElementType.MARKDOWN:
        case kritor.common.Element.ElementType.KEYBOARD:
        default: {
          let { ...args } = i
          args = JSON.stringify(args) as any
          logger.warn(`未知消息类型 ${i.type} ${args}`)
          elements.push(segment.text(args as any))
        }
      }
    }
    return elements
  }

  /**
   * karin 转 kritor
   */
  KarinConvertAdapter (elements: KarinElement[]): Array<kritor.common.Element> {
    const _elements = []
    // const ElementType = kritor.common.Element.ElementType
    for (const i of elements) {
      switch (i.type) {
        case 'text': {
          // const { TEXT: type } = ElementType
          const text = i.text as string
          _elements.push(new kritor.common.TextElement({ text }))
          break
        }
        case 'image': {
          // const { IMAGE: type } = ElementType
          const file = i.file as unknown as Uint8Array
          _elements.push(new kritor.common.ImageElement({ file }))
          break
        }
        case 'at': {
          // const { AT: type } = ElementType
          const { uid, uin = '' } = i
          _elements.push(new kritor.common.AtElement({ uid, uin: Number(uin) }))
          break
        }
        case 'face': {
          // const { FACE: type } = ElementType
          const { id, is_big = false } = i
          _elements.push(new kritor.common.FaceElement({ id, is_big }))
          break
        }
        case 'reply': {
          // const { REPLY: type } = ElementType
          const { message_id } = i
          _elements.push(new kritor.common.ReplyElement({ message_id }))
          break
        }
        case 'voice': {
          // const { VOICE: type } = ElementType
          const file = i.file as unknown as Uint8Array
          _elements.push(new kritor.common.VoiceElement({ file }))
          break
        }
      }
    }

    return _elements as kritor.common.Element[]
  }

  /**
   * 发送消息
   * @param contact - 联系人
   * @param elements - 消息元素
   * @param retry_count - 重试次数
   */
  async SendMessage (contact: contact, elements: KarinElement[], retry_count = 1) {
    /**
     * - 请求服务名
     */
    const service = 'MessageService'
    /**
     * - 请求方法名
     */
    const cmd = 'SendMessage'
    /**
     * - 请求类型
     */
    const type = 'message'

    const message = this.KarinConvertAdapter(elements)
    const buf = { contact: contact as any, elements: message, retry_count }
    /**
     * 请求编码
     */
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()

    /**
     * 请求命令名
     */
    const command = `${service}.${cmd}`
    /**
     * 发送请求
     */
    const res = await this.SendApi(command, data)

    /**
     * 响应解码
     */
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 撤回消息
   * @param contact - 联系人
   * @param message_id - 消息ID
   */
  async RecallMessage (contact: contact, message_id: string) {
    const service = 'MessageService'
    const cmd = 'RecallMessage'
    const type = 'message'

    const buf = { contact: contact as any, message_id }
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置消息评论表情
   * @param contact - 联系人
   * @param message_id - 消息ID
   * @param face_id - 表情ID
   * @param is_set - 是否设置
   */
  async ReactMessageWithEmoji (contact: contact, message_id: string, face_id: number, is_set: boolean) {
    const service = 'MessageService'
    const cmd = 'ReactMessageWithEmoji'
    const type = 'message'
    const buf = { contact: contact as any, message_id, face_id, is_set }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取msg_id获取消息
   * @param contact - 联系人
   * @param message_id - 消息ID
   */
  async GetMessage (contact: contact, message_id: string) {
    const service = 'MessageService'
    const cmd = 'GetMessage'
    const type = 'message'
    const buf = { contact: contact as any, message_id }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 通过seq获取消息
   * @param contact - 联系人
   * @param message_seq - 消息seq
   */
  async GetMessageBySeq (contact: contact, message_seq: number) {
    const service = 'MessageService'
    const cmd = 'GetMessageBySeq'
    const type = 'message'
    const buf = { contact: contact as any, message_seq }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 获取msg_id获取历史消息
   * @param contact - 联系人
   * @param start_message_id - 开始消息ID
   * @param count - 数量
   */
  async GetHistoryMessage (contact: contact, start_message_id: string, count: number) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessage'
    const type = 'message'
    const buf = { contact: contact as any, start_message_id, count }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 通过seq获取历史消息
   * @param contact - 联系人
   * @param start_message_seq - 开始消息seq
   * @param count - 数量
   */
  async GetHistoryMessageBySeq (contact: contact, start_message_seq: number, count: number) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessageBySeq'
    const type = 'message'
    const buf = { contact: contact as any, start_message_seq, count }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 清空本地聊天记录
   * @param contact - 联系人
   */
  async SetMessageReaded (contact: contact) {
    const service = 'MessageService'
    const cmd = 'SetMessageRead'
    const type = 'message'
    const buf = { contact: contact as any }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 上传合并转发消息
   * @param contact - 联系人
   * @param elements - 消息
   * @param retry_count - 重试次数
   */
  async UploadForwardMessage (contact: contact, elements: any[], retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'UploadForwardMessage'
    const type = 'message'
    if (service) throw new Error('service is required')
    // todo 这里格式不对 要改成转发消息的格式
    const messages = this.KarinConvertAdapter(elements)
    const buf = { contact: contact as any, messages, retry_count }

    const data = kritor[type][`${cmd}Request`].encode(buf as any).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 下载合并转发消息
   * @param res_id - 资源ID
   */
  async DownloadForwardMessage (res_id: string) {
    const service = 'MessageService'
    const cmd = 'DownloadForwardMessage'
    const type = 'message'
    const buf = { res_id }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取精华消息
   * @param group_id - 群组ID
   * @param page - 页码
   * @param page_size - 每页数量
   */
  async GetEssenceMessageList (group_id: string, page: number, page_size: number) {
    const service = 'MessageService'
    const cmd = 'GetEssenceMessageList'
    const type = 'message'
    const buf = { group_id: Number(group_id), page, page_size }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /** 设置精华消息 */
  async SetEssenceMessage (group_id: string, message_id: string) {
    const service = 'MessageService'
    const cmd = 'SetEssenceMessage'
    const type = 'message'
    const buf = { group_id: Number(group_id), message_id }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 删除精华消息
   * @param group_id - 群组ID
   * @param message_id - 消息ID
   */
  async DeleteEssenceMessage (group_id: string, message_id: string) {
    const service = 'MessageService'
    const cmd = 'DeleteEssenceMessage'
    const type = 'message'
    const buf = { group_id: Number(group_id), message_id }

    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const command = `${service}.${cmd}`
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  logger (level: 'trace' | 'debug' | 'mark' | 'info' | 'mark' | 'warn' | 'error' | 'fatal', ...args: any[]) {
    logger.bot(level, this.account.uin, ...args)
  }

  /**
  * 获取用户头像
  * @param {string} uid - 用户id，默认为发送者uid
  * @param {number} [size] - 头像大小，默认`0`
  * @returns {string} - 头像的url地址
  */
  getAvatarUrl (uid: string, size = 0) {
    return `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=` + uid
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
   * 获取Kritor版本
   */
  async GetVersion (): Promise<kritor.core.GetVersionResponse> {
    const service = 'CoreService'
    const cmd = 'GetVersion'
    const type = 'core'
    const buf = {}

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 让Kritor下载文件到Kritor本地
   * @param file - 文件地址
   * @param file_type - 文件类型
   * @param root_path - 文件保存路径
   * @param file_name - 文件名
   * @param thread_cnt - 线程数
   * @param headers - 请求头
   * @returns - 下载文件的响应
   */
  async DownloadFile (file: string, file_type: 'url' | 'base64', root_path?: string, file_name?: string, thread_cnt?: number, headers?: string) {
    const service = 'CoreService'
    const cmd = 'DownloadFile'
    const type = 'core'
    const buf = { [file_type]: file, root_path, file_name, thread_cnt, headers }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response
  }

  /**
   * 获取当前账户的信息
   */
  async GetCurrentAccount () {
    const service = 'CoreService'
    const cmd = 'GetCurrentAccount'
    const type = 'core'
    const buf = {}

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)

    const karinRes = { ...response, account_uin: response.account_uin + '' }
    return karinRes
  }

  /**
   * 获取好友列表
   * @param refresh - 是否刷新缓存
   */
  async GetFriendList (refresh: boolean) {
    const service = 'FriendService'
    const cmd = 'GetFriendList'
    const type = 'friend'
    const buf = { refresh }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取好友名片信息
   * @param options - 好友名片信息选项
   */
  async GetFriendProfileCard (options: {
    target_uids?: string[],
    target_uins?: number[]
  }) {
    const service = 'FriendService'
    const cmd = 'GetFriendProfileCard'
    const type = 'friend'
    const buf = options

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取陌生人信息
   * @param target_uid_or_uin - 目标用户的 uid 或者 uin 数组
   */
  async GetStrangerProfileCard (target_uid_or_uin: string[]) {
    const service = 'FriendService'
    const cmd = 'GetStrangerProfileCard'
    const type = 'friend'
    const buf: {
      target_uids: string[]
      target_uins: number[],
    } = { target_uins: [], target_uids: [] }

    target_uid_or_uin.forEach(v => Number(v) ? buf.target_uins.push(Number(v)) : buf.target_uids.push(v))

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置自己的名片
   * @param options - 名片信息选项
   */
  async SetProfileCard (options: {
    /**
     * 昵称
     */
    nick_name?: string,
    /**
     * 公司
     */
    company?: string,
    /**
     * 邮箱
     */
    email?: string,
    /**
     * 学校
     */
    college?: string,
    /**
     * 个人备注
     */
    personal_note?: string,
    /**
     * 生日
     */
    birthday?: number,
    /**
     * 年龄
     */
    age?: number
  }) {
    const service = 'FriendService'
    const cmd = 'SetProfileCard'
    const type = 'friend'
    const buf = options || {}

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 判断是否是黑名单用户
   * @param target_uid - 目标用户的 uid
   * @param target_uin - 目标用户的 uin
   */
  async IsBlackListUser (target_uid: string, target_uin: string) {
    const service = 'FriendService'
    const cmd = 'IsBlackListUser'
    const type = 'friend'
    const buf = { target_uid, target_uin: Number(target_uin) }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 点赞好友
   * @param target_uid_or_uin - 目标用户的 uid 或者 uin
   * @param vote_count - 点赞数量
   */
  async VoteUser (target_uid_or_uin: string, vote_count: number) {
    const service = 'FriendService'
    const cmd = 'VoteUser'
    const type = 'friend'
    let buf = {}

    if (Number(target_uid_or_uin)) {
      buf = { target_uin: Number(target_uid_or_uin), vote_count }
    } else {
      buf = { target_uid: target_uid_or_uin, vote_count }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 根据 uin 获取 uid
   * @param target_uins - 目标用户的 uin 数组
   */
  async GetUidByUin (target_uins: number[]) {
    const service = 'FriendService'
    const cmd = 'GetUidByUin'
    const type = 'friend'
    const buf = { target_uins }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 根据 uid 获取 uin
   * @param target_uids - 目标用户的 uid 数组
   */
  async GetUinByUid (target_uids: string[]) {
    const service = 'FriendService'
    const cmd = 'GetUinByUid'
    const type = 'friend'
    const buf = { target_uids }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 禁言用户
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 被禁言目标的 uid 任选其一
   * @param duration - 禁言时长 单位秒
   */
  async BanMember (group_id: string, target_uid_or_uin: string, duration: number) {
    const service = 'GroupService'
    const cmd = 'BanMember'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), duration }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, duration }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 戳一戳用户头像
   * @param options - 戳一戳选项
   */
  async PokeMember (options: {
    group_id: string,
    target_uid?: string,
    target_uin?: string
  }) {
    const service = 'GroupService'
    const cmd = 'PokeMember'
    const type = 'group'
    let buf = {}
    if (Number(options.target_uin)) {
      buf = { group_id: options.group_id, target_uin: Number(options.target_uin) }
    } else {
      buf = { group_id: options.group_id, target_uid: options.target_uid }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 群组踢人
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 被踢目标的 uid、uin 任选其一
   * @param reject_add_request - 是否拒绝再次入群请求
   * @param kick_reason - 踢人原因
   */
  async KickMember (group_id: string, target_uid_or_uin: string, reject_add_request?: boolean, kick_reason?: string) {
    const service = 'GroupService'
    const cmd = 'KickMember'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), reject_add_request, kick_reason }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, reject_add_request, kick_reason }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 退出群组
   * @param group_id - 群组ID
   */
  async LeaveGroup (group_id: string) {
    const service = 'GroupService'
    const cmd = 'LeaveGroup'
    const type = 'group'
    const buf = { group_id: Number(group_id) }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 修改群名片
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 目标用户的 uid、uin 任选其一
   * @param card - 新的群名片
   */
  async ModifyMemberCard (group_id: string, target_uid_or_uin: string, card: string) {
    const service = 'GroupService'
    const cmd = 'ModifyMemberCard'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), card }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, card }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 修改群名称
   * @param group_id - 群组ID
   * @param group_name - 新的群名称
   */
  async ModifyGroupName (group_id: string, group_name: string) {
    const service = 'GroupService'
    const cmd = 'ModifyGroupName'
    const type = 'group'
    const buf = { group_id: Number(group_id), group_name }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 修改群备注
   * @param group_id - 群组ID
   * @param remark - 新的群备注
   */
  async ModifyGroupRemark (group_id: string, remark: string) {
    const service = 'GroupService'
    const cmd = 'ModifyGroupRemark'
    const type = 'group'
    const buf = { group_id: Number(group_id), remark }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置群管理员
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 目标用户的 uid、uin 任选其一
   * @param is_admin - 是否设置为管理员
   */
  async SetGroupAdmin (group_id: string, target_uid_or_uin: string, is_admin: boolean) {
    const service = 'GroupService'
    const cmd = 'SetGroupAdmin'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), is_admin }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, is_admin }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置群头衔
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 目标用户的 uid、uin 任选其一
   * @param special_title - 新的群头衔
   */
  async SetGroupUniqueTitle (group_id: string, target_uid_or_uin: string, unique_title: string) {
    const service = 'GroupService'
    const cmd = 'SetGroupUniqueTitle'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), unique_title }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, unique_title }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置全员禁言
   * @param group_id - 群组ID
   * @param is_ban - 是否全员禁言
   */
  async SetGroupWholeBan (group_id: string, is_ban: boolean) {
    const service = 'GroupService'
    const cmd = 'SetGroupWholeBan'
    const type = 'group'
    const buf = { group_id: Number(group_id), is_ban }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取群信息
   * @param group_id - 群组ID
   * @param no_cache - 是否刷新缓存
   */
  async GetGroupInfo (group_id: string, no_cache = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupInfo'
    const type = 'group'
    const buf = { group_id: Number(group_id), no_cache }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取群列表
   * @param refresh - 是否刷新缓存
   */
  async GetGroupList (refresh = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupList'
    const type = 'group'
    const buf = { refresh }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取群成员信息
   * @param group_id - 群组ID
   * @param target_uid_or_uin - 目标用户的 uid、uin 任选其一
   * @param refresh - 是否刷新缓存
   */
  async GetGroupMemberInfo (group_id: string, target_uid_or_uin: string, refresh = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupMemberInfo'
    const type = 'group'
    let buf = {}
    if (Number(target_uid_or_uin)) {
      buf = { group_id, target_uin: Number(target_uid_or_uin), refresh }
    } else {
      buf = { group_id, target_uid: target_uid_or_uin, refresh }
    }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取群成员列表
   * @param group_id - 群组ID
   * @param refresh - 是否刷新缓存
   */
  async GetGroupMemberList (group_id: string, refresh = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupMemberList'
    const type = 'group'
    const buf = { group_id: Number(group_id), refresh }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取禁言用户列表
   * @param group_id - 群组ID
   */
  async GetProhibitedUserList (group_id: string) {
    const service = 'GroupService'
    const cmd = 'GetProhibitedUserList'
    const type = 'group'
    const buf = { group_id: Number(group_id) }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取艾特全体成员剩余次数
   * @param group_id - 群组ID
   */
  async GetRemainCountAtAll (group_id: string) {
    const service = 'GroupService'
    const cmd = 'GetRemainCountAtAll'
    const type = 'group'
    const buf = { group_id: Number(group_id) }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
 * 获取群荣誉信息
 * @param group_id - 群组ID
 * @param refresh - 是否刷新缓存
 * @returns - 群荣誉信息
 */
  async GetGroupHonor (group_id: string, refresh = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupHonor'
    const type = 'group'
    const buf = { group_id: Number(group_id), refresh }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 获取未加入群组信息
   * @param group_id - 群组ID
   */
  async GetNotJoinedGroupInfo (group_id: string) {
    const service = 'GroupService'
    const cmd = 'GetNotJoinedGroupInfo'
    const type = 'group'
    const buf = { group_id: Number(group_id) }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置好友请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   * @param remark - 好友备注 同意时有效
   * @returns
   */
  async SetFriendApplyResult (request_id: string, is_approve: boolean, remark: string) {
    const service = 'FriendService'
    const cmd = 'SetFriendApplyResult'
    const type = 'process'
    const buf = { request_id, is_approve, remark }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置申请加入群请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   * @param deny_reason - 拒绝原因
   */
  async SetGroupApplyResult (request_id: string, is_approve: boolean, deny_reason: string) {
    const service = 'GroupService'
    const cmd = 'SetGroupApplyResult'
    const type = 'process'
    const buf = { request_id, is_approve, deny_reason }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  /**
   * 设置邀请加入群请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   */
  async SetInvitedJoinGroupResult (request_id: string, is_approve: boolean) {
    const service = 'GroupService'
    const cmd = 'SetInvitedJoinGroupResult'
    const type = 'process'
    const buf = { request_id, is_approve }

    const command = `${service}.${cmd}`
    const data = kritor[type][`${cmd}Request`].encode(buf).finish()
    const res = await this.SendApi(command, data)
    const response = kritor[type][`${cmd}Response`].decode(res.buf)
    return response as any
  }

  async SendMessageByResId (contact: contact, id: string) {
    if (contact) throw new Error('不支持的操作')
    return '未实现' as any
  }

  async sendForwardMessage (contact: contact, elements: Array<any>) {
    if (contact) throw new Error('未实现')
    return '未实现' as any
  }

  async UploadGroupFile (group_id: string, file: string, name: string, folder?: string) {
    if (group_id) throw new Error('未实现')
    return '未实现' as any
  }

  async UploadPrivateFile (user_id: string, file: string, name: string) {
    if (user_id) throw new Error('未实现')
    return '未实现' as any
  }

  /**
   * 发送Api请求 返回未解码的数据
   * @param cmd - cmd的构成由 服务名 + "." + 方法名
   * @param buf - 请求参数
   * @param time - 请求超时时间 默认10s
   */
  SendApi (cmd: string, buf: any, time: number = 60): Promise<kritor.common.Response> {
    this.seq++
    const seq = this.seq
    if (!time) time = config.timeout('grpc')
    // ps: 我也不想写any啊 可是这里它不符合啊!!!
    const params = { cmd, seq, buf } as any
    logger.debug(`[API请求] ${cmd} seq: ${seq} buf: ${JSON.stringify(buf)}`)
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('API请求超时'))
      }, time * 1000)

      this.grpc.write(params)

      this.grpc.once(seq + '', data => {
        /** 停止监听器 */
        clearTimeout(timeoutId)
        data.code === 'SUCCESS' ? resolve(data) : resolve(data)
      })
    })
  }
}
