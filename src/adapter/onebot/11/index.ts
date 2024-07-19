import WebSocket from 'ws'
import { randomUUID } from 'crypto'
import { IncomingMessage } from 'http'
import { listener } from 'karin/core/listener'
import { common, config, logger, segment } from 'karin/utils'
import { GroupHonorInfo, KarinAdapter, LoggerLevel, MessageType, OB11Api, OB11ApiParams, OB11ApiResponse, OB11Segment, OB11SegmentType, Role } from 'karin/types'

import {
  Scene,
  Contact,
  KarinElement,
  OB11EventAll,
  GroupInfo,
  NodeElement,
  EssenceMessageBody,
} from 'karin/types'
import { OB11Event } from './event'
import { AdapterConvertKarin, KarinConvertAdapter } from './convert'

/**
 * @class OneBot11
 * @extends KarinAdapter
 */
export class AdapterOneBot11 implements KarinAdapter {
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
    this.adapter = { id: 'QQ', name: 'OneBot11', type: 'ws', sub_type: 'internal', start_time: Date.now(), connect: '', index: 0 }
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
  }

  init (data: OB11EventAll) {
    return false
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
      if (json.echo) return this.socket.emit(json.echo, json)
      return this.init(json)
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

      /** 注销bot */
      this.adapter.index && listener.delBot(this.adapter.index)

      /** 正向ws需要重连 */
      if (this.adapter.sub_type === 'client') {
        this.index++
        this.logger('warn', `[正向WS][重连次数:${this.index}] 连接断开，将在5秒后重连：${connect}`)
        await common.sleep(5000)
        this.client(connect)
      }
    })
    await this.getSelf()

    this.init = (data: OB11EventAll) => {
      new OB11Event(this).event(data)
      return true
    }
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
      const { app_name, version } = await this.GetVersion()
      this.version.name = app_name
      this.version.app_name = app_name
      this.version.version = version
    } catch (e) {
      /** 兼容onebots */
      const { app_name, version } = await this.SendApi(OB11Api['get_version'])
      this.version.name = app_name
      this.version.app_name = app_name
      this.version.version = version
    }

    this.account.uid = data.account_uid
    this.account.uin = data.account_uin
    this.account.name = data.account_name
    this.logger('info', `[加载完成][app_name:${this.version.name}][version:${this.version.version}] ` + logger.green(this.adapter.connect as string))
    /** 注册bot */
    const index = listener.addBot({ type: this.adapter.type, bot: this })
    if (index) this.adapter.index = index
  }

  /**
   * onebot11转karin
   * @return karin格式消息
   */
  AdapterConvertKarin (data: Array<OB11Segment>) {
    return AdapterConvertKarin(data)
  }

  /**
   * karin转onebot11
   * @param data karin格式消息
   */
  KarinConvertAdapter (data: Array<KarinElement>) {
    return KarinConvertAdapter(data)
  }

  /**
   * 专属当前Bot的日志打印方法
   */
  logger (level: LoggerLevel, ...args: any[]) {
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
   * 发送消息
   *
   * @param contact
   * @param elements
   * @returns - 消息ID
   */
  async SendMessage (contact: Contact, elements: Array<KarinElement>) {
    const { scene, peer } = contact
    let res
    if (scene === Scene.Group) {
      res = await this.SendApi(OB11Api['send_msg'], {
        message_type: MessageType.Group,
        group_id: Number(peer),
        message: this.KarinConvertAdapter(elements),
      })
    } else {
      res = await this.SendApi(OB11Api['send_msg'], {
        message_type: MessageType.Private,
        user_id: Number(peer),
        message: this.KarinConvertAdapter(elements),
      })
    }

    return { message_id: String(res.message_id), message_time: Date.now() }
  }

  /**
   * 上传合并转发消息
   * @param contact - 联系人信息
   * @param elements - nodes
   * @returns - 资源id
   */
  async UploadForwardMessage (contact: Contact, elements: NodeElement[]) {
    if (!Array.isArray(elements)) elements = [elements]
    if (elements.some((element: { type: string }) => element.type !== 'node')) {
      throw new Error('elements should be all node type')
    }
    const { scene, peer } = contact
    const message_type = scene === 'group' ? 'group_id' : 'user_id'
    const messages: any[] = []
    const selfUin = this.account.uin
    const selfNick = this.account.name

    for (const i of elements) {
      const type = 'node'
      if (i.id) {
        messages.push({ type, data: { id: i.id } })
      } else {
        const content = this.KarinConvertAdapter(i.content as KarinElement[])
        const user_id = String(i.user_id || selfUin)
        const nickname = String(i.nickname || selfNick)
        messages.push({ type, data: { user_id, nickname, content } })
      }
    }

    const params = { [message_type]: String(peer), messages }
    return await this.SendApi(OB11Api['send_forward_msg'], params)
  }

  /**
   * 通过资源id发送转发消息
   * @param contact - 联系人信息
   * @param id - 资源id
   */
  async SendMessageByResId (contact: Contact, id: string) {
    let res
    const { scene, peer } = contact
    if (scene === Scene.Group) {
      res = await this.SendApi(OB11Api['send_msg'], {
        message_type: MessageType.Group,
        group_id: Number(peer),
        message: [{ type: OB11SegmentType.Forward, data: { id } }],
      })
    } else {
      res = await this.SendApi(OB11Api['send_msg'], {
        message_type: MessageType.Private,
        user_id: Number(peer),
        message: [{ type: OB11SegmentType.Forward, data: { id } }],
      })
    }

    return { message_id: String(res.message_id), message_time: Date.now() }
  }

  /**
   * 撤回消息
   * @param _contact - ob11无需提供contact参数
   * @param message_id - 消息ID
   */
  async RecallMessage (_contact: Contact, message_id: string) {
    try {
      await this.SendApi(OB11Api['delete_msg'], { message_id: Number(message_id) })
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取消息
   * @param contact - 联系人信息
   * @param message_id - 消息ID
   */

  async GetMessage (contact: Contact, message_id: string) {
    const res = await this.SendApi(OB11Api['get_msg'], { message_id: Number(message_id) })

    return {
      time: res.time,
      message_id: res.message_id + '',
      message_seq: res.message_id,
      contact: {
        scene: res.message_type === 'group' ? Scene.Group : Scene.Private,
        peer: contact.peer, // 这里可能不准确 传入是什么就返回什么
      },
      sender: {
        uid: res.sender.user_id,
        uin: res.sender.user_id,
        nick: res.sender.nickname,
        role: Role.Unknown,
      },
      elements: this.AdapterConvertKarin(res.message),
    }
  }

  /**
   * 获取msg_id获取历史消息
   * @description 此api各平台实现不同
   */
  async GetHistoryMessage (contact: Contact, start_message_id: string, count: number = 1) {
    const message_seq = (await this.GetMessage(contact, start_message_id)).message_seq
    // 先拿到消息的seq

    let options: any

    if (this.version.name === 'Lagrange.OneBot') {
      options = { message_id: Number(start_message_id), message_count: count }
    } else {
      options = { message_seq, message_count: count }
    }

    let res
    if (contact.scene === 'group') {
      options.group_id = Number(contact.peer)
      res = await this.SendApi(OB11Api['get_group_msg_history'], options)
    } else {
      options.user_id = Number(contact.peer)
      res = await this.SendApi(OB11Api['get_friend_msg_history'], options)
    }

    const all = []
    const elements = this.AdapterConvertKarin(res)
    const scene = contact.scene === 'group' ? Scene.Group : Scene.Private
    for (const v of elements) {
      all.push({
        time: Date.now(),
        message_id: '',
        message_seq: 0,
        contact: {
          scene,
          peer: '',
          sub_peer: '',
        },
        sender: {
          uid: '',
          uin: '',
          nick: '',
          role: Role.Unknown,
        },
        elements: [v],
      })
    }

    return all
  }

  /**
   * 发送好友赞
   * @param target_uid_or_uin - 用户ID
   * @param vote_count - 赞的次数，默认为`10`
   */
  async VoteUser (target_uid_or_uin: string, vote_count: number = 10) {
    const user_id = Number(target_uid_or_uin)
    try {
      await this.SendApi(OB11Api['send_like'], { user_id, times: vote_count })
      return true
    } catch {
      return false
    }
  }

  /**
   * 群组踢人
   */
  async KickMember (group_id: string, target_uid_or_uin: string, reject_add_request: boolean = false, kick_reason: string = '') {
    const user_id = Number(target_uid_or_uin)
    try {
      await this.SendApi(OB11Api['set_group_kick'], { group_id: Number(group_id), user_id, reject_add_request })
      return true
    } catch {
      return false
    }
  }

  /**
   * 禁言用户
   * @param group_id - 群号
   * @param target_uid_or_uin - 用户ID
   * @param duration - 禁言时长，单位秒，0 表示取消禁言
   */
  async BanMember (group_id: string, target_uid_or_uin: string, duration: number) {
    const user_id = Number(target_uid_or_uin)
    try {
      await this.SendApi(OB11Api['set_group_ban'], { group_id: Number(group_id), user_id, duration })
      return true
    } catch {
      return false
    }
  }

  /**
   * 群组全员禁言
   * @param group_id - 群号
   * @param is_ban - 是否全员禁言
   */
  async SetGroupWholeBan (group_id: string, is_ban = true) {
    try {
      await this.SendApi(OB11Api['set_group_whole_ban'], { group_id: Number(group_id), enable: is_ban })
      return true
    } catch {
      return false
    }
  }

  /**
   * 设置群管理员
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户ID
   * @param is_admin - 是否设置为管理员
   */
  async SetGroupAdmin (group_id: string, target_uid_or_uin: string, is_admin: boolean) {
    try {
      const user_id = Number(target_uid_or_uin)
      await this.SendApi(OB11Api['set_group_admin'], { group_id: Number(group_id), user_id, enable: is_admin })
      return true
    } catch {
      return false
    }
  }

  /**
   * 修改群名片
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户ID
   * @param card - 新名片
   */
  async ModifyMemberCard (group_id: string, target_uid_or_uin: string, card: string) {
    try {
      const user_id = Number(target_uid_or_uin)
      await this.SendApi(OB11Api['set_group_card'], { group_id: Number(group_id), user_id, card })
      return true
    } catch {
      return false
    }
  }

  /**
   * 设置群名
   * @param group_id - 群号
   * @param group_name - 新群名
   */
  async ModifyGroupName (group_id: string, group_name: string) {
    try {
      await this.SendApi(OB11Api['set_group_name'], { group_id: Number(group_id), group_name })
      return true
    } catch {
      return false
    }
  }

  /**
   * 退出群组
   * @param group_id - 群号
   * @param is_dismiss - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  async LeaveGroup (group_id: string, is_dismiss = false) {
    try {
      await this.SendApi(OB11Api['set_group_leave'], { group_id: Number(group_id), is_dismiss })
    } catch {
      return false
    }
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
    try {
      await this.SendApi(OB11Api['set_group_special_title'], { group_id: Number(group_id), user_id, special_title, duration })
    } catch {
      return false
    }
  }

  /**
   * 获取登录号信息
   */
  async GetCurrentAccount (): Promise<{
    account_uid: string
    account_uin: string
    account_name: string
  }> {
    const res = await this.SendApi(OB11Api['get_login_info'])
    return {
      account_uid: res.user_id + '',
      account_uin: res.user_id + '',
      account_name: res.nickname,
    }
  }

  /**
   * 获取陌生人信息 不支持批量获取 只支持一个
   * @param target_uid_or_uin - 目标用户ID
   */
  async GetStrangerProfileCard (target_uid_or_uin: Array<string>) {
    const user_id = Number(target_uid_or_uin[0])
    const res = await this.SendApi(OB11Api['get_stranger_info'], { user_id, no_cache: true })
    return [
      {
        /**
         * - 用户UID
         */
        uid: res.user_id + '',
        /**
       * - 用户UIN
       */
        uin: res.user_id + '',
        /**
       * - qid
       */
        qid: '',
        /**
       * - 名称
       */
        nick: res.nickname,
        /**
       * - 备注
       */
        remark: '',
        /**
       * - 用户等级
       */
        level: 0,
        /**
       * - 生日
       */
        birthday: '',
        /**
       * - 登录天数
       */
        login_day: 0,
        /**
       * - 点赞数
       */
        vote_cnt: 0,
        /**
       * - 学校是否已核实
       */
        is_school_verified: undefined,
        /**
       * - 年龄
       * - 拓展字段
       */
        age: res.age,
        /**
       * - 性别
       * - 拓展字段
       */
        sex: res.sex,
        ext: {
          /**
           * 大会员
           */
          big_vip: undefined,
          /**
         * 好莱坞/腾讯视频会员
         */
          hollywood_vip: undefined,
          /**
         * QQ会员
         */
          qq_vip: undefined,
          /**
         * QQ超级会员
         */
          super_vip: undefined,
          /**
         * 是否已经赞过
         */
          voted: undefined,
        },
      },
    ]
  }

  /**
   * 获取好友列表
   */
  async GetFriendList () {
    const friendList = await this.SendApi(OB11Api['get_friend_list'])
    return friendList.map(v => {
      const user_id = v.user_id + ''
      return {
        /**
         * - 用户UID
         */
        uid: user_id,
        /**
       * - 用户UIN
       */
        uin: user_id,
        /**
       * - qid
       */
        qid: '',
        /**
       * - 名称
       */
        nick: v.nickname,
        /**
       * - 备注
       */
        remark: '',
        /**
       * - 用户等级
       */
        level: 0,
        /**
       * - 生日
       */
        birthday: '',
        /**
       * - 登录天数
       */
        login_day: 0,
        /**
       * - 点赞数
       */
        vote_cnt: 0,
        /**
       * - 学校是否已核实
       */
        is_school_verified: undefined,
        /**
       * - 年龄
       * - 拓展字段
       */
        age: v.age,
        /**
       * - 性别
       * - 拓展字段
       */
        sex: v.sex,
        ext: {
          /**
           * 大会员
           */
          big_vip: undefined,
          /**
         * 好莱坞/腾讯视频会员
         */
          hollywood_vip: undefined,
          /**
         * QQ会员
         */
          qq_vip: undefined,
          /**
         * QQ超级会员
         */
          super_vip: undefined,
          /**
         * 是否已经赞过
         */
          voted: undefined,
        },
      }
    })
  }

  /**
   * 获取群信息
   * @param group_id - 群号
   * @param no_cache - 是否不使用缓存
   */
  async GetGroupInfo (group_id: string, no_cache = false): Promise<GroupInfo> {
    const info = await this.SendApi(OB11Api['get_group_info'], { group_id: Number(group_id), no_cache })
    const groupId = info.group_id + ''
    const groupName = info.group_name
    // todo 可以走群成员列表获取群主
    return {
      group_id: groupId,
      group_name: groupName,
      group_remark: groupName,
      max_member_count: info.max_member_count,
      member_count: info.member_count,
      group_uin: groupId,
      admins: [],
      owner: '',
    }
  }

  /**
   * 获取群列表
   */
  async GetGroupList () {
    const groupList = await this.SendApi(OB11Api['get_group_list'])
    return groupList.map(v => {
      const groupId = v.group_id + ''
      const groupName = v.group_name
      return {
        group_id: groupId,
        group_name: groupName,
        group_remark: groupName,
        max_member_count: v.max_member_count,
        member_count: v.member_count,
        group_uin: groupId,
        admins: [],
        owner: '',
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
    const info = await this.SendApi(OB11Api['get_group_member_info'], { group_id: Number(group_id), user_id, no_cache: refresh })
    return {
      uid: target_uid_or_uin,
      uin: target_uid_or_uin,
      nick: info.nickname,
      age: info.age,
      unique_title: info.title,
      unique_title_expire_time: info.title_expire_time,
      card: info.card,
      join_time: info.join_time,
      last_active_time: info.last_sent_time,
      level: Number(info.level) || 0,
      shut_up_time: 0,
      distance: undefined,
      honors: [],
      unfriendly: info.unfriendly,
      card_changeable: info.card_changeable,
    }
  }

  /**
   * 获取群成员列表
   * @param group_id - 群号
   * @param refresh - 是否刷新缓存，默认为 false
   */
  async GetGroupMemberList (group_id: string, refresh = false) {
    const gl = await this.SendApi(OB11Api['get_group_member_list'], { group_id: Number(group_id), no_cache: refresh })
    return gl.map(v => {
      const user_id = v.user_id + ''
      return {
        uid: user_id,
        uin: user_id,
        nick: v.nickname,
        age: v.age,
        unique_title: v.title,
        unique_title_expire_time: v.title_expire_time,
        card: v.card,
        join_time: v.join_time,
        last_active_time: v.last_sent_time,
        level: Number(v.level) || 0,
        shut_up_time: 0,
        distance: undefined,
        honors: [],
        unfriendly: v.unfriendly,
        card_changeable: v.card_changeable,
      }
    })
  }

  /**
   * 获取群荣誉信息
   */
  async GetGroupHonor (group_id: string, refresh = false) {
    const groupHonor = await this.SendApi(OB11Api['get_group_honor_info'], { group_id: Number(group_id), type: 'all' })

    const result: GroupHonorInfo[] = []
    groupHonor.talkative_list.forEach(honor => {
      const user_id = honor.user_id + ''
      result.push({
        uin: user_id,
        uid: user_id,
        nick: honor.nickname,
        honor_name: '历史龙王',
        id: 0,
        avatar: honor.avatar,
        description: honor.description,
      })
    })
    groupHonor.performer_list.forEach(honor => {
      const user_id = honor.user_id + ''
      result.push({
        uin: user_id,
        uid: user_id,
        nick: honor.nickname,
        honor_name: '群聊之火',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.legend_list.forEach(honor => {
      const user_id = honor.user_id + ''
      result.push({
        uin: user_id,
        uid: user_id,
        nick: honor.nickname,
        honor_name: '群聊炽焰',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.strong_newbie_list.forEach(honor => {
      const user_id = honor.user_id + ''
      result.push({
        uin: user_id,
        uid: user_id,
        nick: honor.nickname,
        honor_name: '冒尖小春笋',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    groupHonor.emotion_list.forEach(honor => {
      const user_id = honor.user_id + ''
      result.push({
        uin: user_id,
        uid: user_id,
        nick: honor.nickname,
        honor_name: '快乐之源',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    return result
  }

  /**
   * 对消息进行表情回应
   * @param contact - 联系人信息
   * @param message_id - 消息ID
   * @param face_id - 表情ID
   */
  async ReactMessageWithEmoji (contact: Contact, message_id: string, face_id: number, is_set = true) {
    try {
      await this.SendApi(OB11Api['set_msg_emoji_like'], { message_id, emoji_id: face_id, is_set })
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取版本信息
   */
  async GetVersion () {
    const res = await this.SendApi(OB11Api['get_version_info'])
    return {
      name: res.app_name,
      app_name: res.app_name,
      version: res.app_version,
      protocol: res.protocol_version,
    }
  }

  async DownloadForwardMessage (res_id: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   * 精华消息
   */
  async GetEssenceMessageList (group_id: string, page: number, page_size: number) {
    const list: EssenceMessageBody[] = []
    const res = await this.SendApi(OB11Api['get_essence_msg_list'], { group_id: Number(group_id) })
    for (const v of res) {
      const { message_seq, elements } = await this.GetMessage({ scene: Scene.Group, peer: group_id }, v.message_id + '')
      list.push({
        /**
         * - 群ID
         */
        group_id,
        /**
         * - 发送者uid
         */
        sender_uid: v.sender_id + '',
        /**
         * - 发送者uin
         */
        sender_uin: v.sender_id + '',
        /**
         * - 发送者昵称
         */
        sender_nick: v.sender_nick,
        /**
         * - 操作者uid
         */
        operator_uid: v.operator_id + '',
        /**
         * - 操作者uin
         */
        operator_uin: v.operator_id + '',
        /**
         * - 操作者昵称
         */
        operator_nick: v.operator_nick,
        /**
         * - 操作时间
         */
        operation_time: v.operator_time,
        /**
         * - 消息时间
         */
        message_time: v.sender_time,
        /**
         * - 消息ID
         */
        message_id: v.message_id + '',
        /**
         * - 消息序列号
         */
        message_seq,
        /**
         * - 被设置的精华消息元素文本
         */
        json_elements: JSON.stringify(elements),
      })
    }

    return list
  }

  /**
   * 上传群文件
   * @param group_id - 群号
   * @param file - 本地文件绝对路径
   * @param name - 文件名称 必须提供
   * @param folder - 父目录ID 不提供则上传到根目录
   */
  async UploadGroupFile (group_id: string, file: string, name: string, folder?: string) {
    try {
      await this.SendApi(OB11Api['upload_group_file'], { group_id: Number(group_id), file, name, folder })
      return true
    } catch {
      return false
    }
  }

  /**
   * 上传私聊文件
   * @param user_id - 用户ID
   * @param file - 本地文件绝对路径
   * @param name - 文件名称 必须提供
   */
  async UploadPrivateFile (user_id: string, file: string, name: string) {
    try {
      await this.SendApi(OB11Api['upload_private_file'], { user_id: Number(user_id), file, name })
      return true
    } catch {
      return false
    }
  }

  /**
   * 设置精华消息
   * @param _group_id - 群号
   * @param message_id - 消息ID
   */
  async SetEssenceMessage (_group_id: string, message_id: string) {
    try {
      await this.SendApi(OB11Api['set_essence_msg'], { message_id: Number(message_id) })
      return true
    } catch {
      return false
    }
  }

  /**
   * 移除精华消息
   * @param _group_id - 群号
   * @param message_id - 消息ID
   */
  async DeleteEssenceMessage (_group_id: string, message_id: string) {
    try {
      await this.SendApi(OB11Api['delete_essence_msg'], { message_id: Number(message_id) })
      return true
    } catch {
      return false
    }
  }

  async PokeMember (group_id: string, target_uid_or_uin: string) {
    // 这个接口比较特殊 暂时先搁置 lgl单独接口 shamrock单独接口 gocq字段不一样 llob貌似没实现？
    throw new Error('Method not implemented.')
  }

  async SetFriendApplyResult (request_id: string, is_approve: boolean, remark?: string) {
    try {
      await this.SendApi(OB11Api['set_friend_add_request'], { flag: request_id, approve: is_approve, remark })
      return true
    } catch {
      return false
    }
  }

  async SetGroupApplyResult (request_id: string, is_approve: boolean, deny_reason?: string) {
    try {
      await this.SendApi(OB11Api['set_group_add_request'], { flag: request_id, approve: is_approve, sub_type: 'add', reason: deny_reason })
      return true
    } catch {
      return false
    }
  }

  async SetInvitedJoinGroupResult (request_id: string, is_approve: boolean, deny_reason?: string) {
    try {
      await this.SendApi(OB11Api['set_group_add_request'], { flag: request_id, approve: is_approve, sub_type: 'invite', reason: deny_reason })
      return true
    } catch {
      return false
    }
  }

  DownloadFile (): Promise<any> { throw new Error('Method not implemented.') }
  CreateFolder (): Promise<any> { throw new Error('Method not implemented.') }
  RenameFolder (): Promise<any> { throw new Error('Method not implemented.') }
  DeleteFolder (): Promise<any> { throw new Error('Method not implemented.') }
  DeleteFile (): Promise<any> { throw new Error('Method not implemented.') }
  GetFileList (): Promise<any> { throw new Error('Method not implemented.') }
  UploadFile (): Promise<any> { throw new Error('Method not implemented.') }
  GetFileSystemInfo (): Promise<any> { throw new Error('Method not implemented.') }
  ModifyGroupRemark (): Promise<any> { throw new Error('Method not implemented.') }
  GetRemainCountAtAll (): Promise<any> { throw new Error('Method not implemented.') }
  GetProhibitedUserList (): Promise<any> { throw new Error('Method not implemented.') }
  SetMessageReaded (): Promise<any> { throw new Error('Method not implemented.') }

  async sendForwardMessage (contact: Contact, elements: NodeElement[]) {
    let message_id = await this.UploadForwardMessage(contact, elements)
    if (this.version.name === 'Lagrange.OneBot') {
      message_id = (await this.SendMessage(contact, [segment.forward(message_id)])).message_id
    }
    return { message_id }
  }

  /**
   * 发送API请求
   * @param action - API断点
   * @param {object} params - API参数
   * @returns {Promise<any>} - API返回
   */
  async SendApi<T extends keyof OB11ApiParams> (
    action: T,
    params: OB11ApiParams[T] = {} as OB11ApiParams[T],
    time = 0
  ): Promise<OB11ApiResponse[T]> {
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
