import { AdapterBase } from '@/adapter/base'
import { createMessage } from '@/adapter/onebot/create/message'
import { createNotice } from '@/adapter/onebot/create/notice'
import { createRequest } from '@/adapter/onebot/create/request'
import { senderGroup } from '@/event'
import { OneBotEventKey, OneBotMessageType } from '@karinjs/onebot'
import { registerBot, unregisterBot } from '@/service'
import { AdapterConvertKarin, KarinConvertAdapter } from '@/adapter/onebot/core/convert'

import type { Contact, GroupSender, Role } from '@/types/event'
import type { ForwardOptions, NodeElement, SendElement } from '@/types/segment'
import type { GetGroupHighlightsResponse, QQGroupHonorInfo, SendMsgResults } from '@/types/adapter'
import type { OneBotApi, OneBotMessage, OneBotCore, NodeCustomMessage, NodeMessage, OneBotType } from '@karinjs/onebot'

export class AdapterOneBot<T extends OneBotType> extends AdapterBase {
  #isInit = false
  _onebot: T

  constructor (_onebot: T) {
    super()
    this.adapter.platform = 'qq'
    this.adapter.standard = 'onebot11'
    this._onebot = _onebot
  }

  async init () {
    if (this.#isInit) return
    this.#isInit = true
    await this._onebot.init()
    this.setAdapterInfo()
    this.setBotInfo()

    this._onebot.on(OneBotEventKey.EVENT, (data) => {
      if (this._onebot.isEcho(data)) return

      if (data.post_type === 'message') return createMessage(data, this)
      if (data.post_type === 'notice') return createNotice(data, this)
      if (data.post_type === 'request') return createRequest(data, this)

      if (data.post_type === 'meta_event') {
        if (data.meta_event_type === 'lifecycle') {
          if (data.sub_type === 'enable') {
            return logger.bot('mark', this.selfId, 'OneBot启用')
          }

          if (data.sub_type === 'disable') {
            return logger.bot('mark', this.selfId, 'OneBot停用')
          }

          if (data.sub_type === 'connect') {
            return logger.bot('mark', this.selfId, 'WebSocket连接成功')
          }
        }

        if (data.meta_event_type === 'heartbeat') {
          return logger.bot('trace', this.selfId, '心跳:\n' + JSON.stringify(data, null, 2))
        }
      }

      logger.bot('warn', this.selfId, `收到未知事件: ${JSON.stringify(data, null, 2)}`)
    })
  }

  /**
   * 注册机器人
   */
  registerBot () {
    logger.bot('info', this.selfId, `[OneBot][${this.adapter.communication}] 连接成功: ${this.adapter.address}`)
    this.adapter.index = registerBot(this.adapter.communication, this)
  }

  /**
   * 卸载注册的机器人
   */
  unregisterBot () {
    unregisterBot('index', this.adapter.index)
    logger.bot('info', this.selfId, `连接关闭: ${this.adapter.address}`)
  }

  /** 设置登录号信息 */
  setAdapterInfo () {
    this.adapter.platform = 'qq'
    this.adapter.name = this._onebot.protocol.name
    this.adapter.version = this._onebot.protocol.version

    if (/gocq/i.test(this.adapter.name)) {
      this.adapter.protocol = 'gocq-http'
    } else if (/napcat/i.test(this.adapter.name)) {
      this.adapter.protocol = 'napcat'
    } else if (/llonebot/i.test(this.adapter.name)) {
      this.adapter.protocol = 'llonebot'
    } else if (/lagrange/i.test(this.adapter.name)) {
      this.adapter.protocol = 'lagrange'
    } else if (/conwechat/i.test(this.adapter.name)) {
      this.adapter.protocol = 'conwechat'
    } else {
      this.adapter.protocol = 'other'
    }
  }

  /**
   * 设置登录号详细信息
   */
  async setBotInfo () {
    this.account.name = this._onebot.self.nickname
    this.account.avatar = this._onebot.self.avatar
    this.account.selfId = this._onebot.self_id + ''
  }

  async sendApi<T extends keyof OneBotApi> (
    action: T,
    params: OneBotApi[T]['params'],
    timeout?: number
  ): Promise<OneBotApi[T]['response']> {
    return this._onebot.sendApi(action, params, timeout)
  }

  /**
   * onebot11转karin
   * @param data onebot11格式消息
   * @param contact 联系人信息 如果需要转换napcat的文件消息则需要传入
   * @return karin格式消息
   */
  AdapterConvertKarin (data: Array<OneBotMessage>) {
    return AdapterConvertKarin(data, this)
  }

  /**
   * karin转onebot11
   * @param data karin格式消息
   */
  KarinConvertAdapter (data: Array<SendElement>) {
    return KarinConvertAdapter(data, this)
  }

  /**
   * 获取头像url
   * @param userId 头像大小，默认`0`
   * @param size 头像大小，默认`0`
   * @returns 头像的url地址
   */
  async getAvatarUrl (userId = this.account.selfId, size = 0) {
    return Number(userId)
      ? `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=${userId}`
      : `https://q.qlogo.cn/qqapp/${userId}/${userId}/${size}`
  }

  /**
   * 获取群头像
   * @param groupId 群号
   * @param size 头像大小，默认`0`
   * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns 群头像的url地址
   */
  async getGroupAvatarUrl (groupId: string, size = 0, history = 0) {
    return `https://p.qlogo.cn/gh/${groupId}/${groupId}${history ? '_' + history : ''}/` + size
  }

  /**
   * 发送消息
   * @param contact
   * @param elements
   * @returns 消息ID
   */
  async sendMsg (
    contact: Contact, elements: Array<SendElement>, retryCount?: number
  ): Promise<SendMsgResults> {
    try {
      const message = this.KarinConvertAdapter(elements)
      let res
      if (contact.scene === 'group') {
        res = await this._onebot.sendGroupMsg(Number(contact.peer), message)
      } else if (contact.scene === 'groupTemp') {
        res = await this._onebot.sendPrivateMsg(Number(contact.subPeer), message)
      } else {
        res = await this._onebot.sendPrivateMsg(Number(contact.peer), message)
      }

      const messageId = String(res.message_id)
      const messageTime = Date.now()
      const rawData = res

      return { messageId, messageTime, rawData, message_id: messageId, time: messageTime }
    } catch (error) {
      if (retryCount && retryCount > 0) {
        return this.sendMsg(contact, elements, retryCount - 1)
      }
      throw error
    }
  }

  // /**
  //  * 上传合并转发消息
  //  * @param contact 联系人信息
  //  * @param elements nodes
  //  * @returns 资源id
  //  */
  // async UploadForwardMessage (contact: Contact, elements: NodeElementType[]) {
  //   if (!Array.isArray(elements)) elements = [elements]
  //   if (elements.some((element: { type: string }) => element.type !== 'node')) {
  //     throw new Error('elements should be all node type')
  //   }
  //   const { scene, peer } = contact
  //   const messageType = scene === 'group' ? 'group_id' : 'user_id'
  //   const messages: any[] = []
  //   const selfUin = this.account.uin
  //   const selfNick = this.account.name

  //   for (const i of elements) {
  //     const type = 'node'
  //     if (i.id) {
  //       messages.push({ type, data: { id: i.id } })
  //     } else {
  //       const content = this.KarinConvertAdapter(i.content as KarinElement[])
  //       const userId = Number(i.user_id || selfUin)
  //       const nickname = String(i.nickname || selfNick)
  //       messages.push({ type, data: { user_id: userId, nickname, content } })
  //     }
  //   }

  //   const params = { [messageType]: Number(peer), messages }
  //   return await this.sendApi(Action.sendForwardMsg, params)
  // }

  /**
   * 发送长消息
   * @param contact 目标信息
   * @param resId 资源ID
   */
  async sendLongMsg (contact: Contact, resId: string) {
    const result = await (async () => {
      if (contact.scene === 'group') {
        return await this._onebot.sendGroupMsg(
          Number(contact.peer),
          [{ type: OneBotMessageType.Forward, data: { id: resId } }]
        )
      }

      const id = contact.scene === 'friend' ? Number(contact.peer) : Number(contact.subPeer)
      return await this._onebot.sendPrivateMsg(
        id,
        [{ type: OneBotMessageType.Forward, data: { id: resId } }]
      )
    })()

    const messageId = String(result.message_id)
    const messageTime = Date.now()

    return {
      messageId,
      messageTime,
      rawData: result,
      message_id: messageId,
      message_time: messageTime,
      time: messageTime,
    }
  }

  /**
   * 撤回消息
   * @param contact ob11无需提供contact参数
   * @param messageId 消息ID
   */
  async recallMsg (_: Contact, messageId: string) {
    await this._onebot.deleteMsg(Number(messageId))
  }

  /**
   * 获取消息
   * @param contact 联系人信息
   * @param messageId 消息ID
   */
  async getMsg (_contact: Contact | string, messageId?: string) {
    /** 目标id */
    const targetId = typeof _contact === 'string' ? _contact : messageId
    const result = await this._onebot.getMsg(Number(targetId))
    const userId = result.sender.user_id + ''

    const messageSeq: number = (result as any).message_seq || result.message_id
    const messageID = result.message_id + ''

    const contact = ((): Contact => {
      if (result.message_type === 'group') {
        return {
          scene: 'group',
          peer: result.group_id + '',
          name: result.sender.nickname,
        }
      }

      return {
        scene: 'friend',
        peer: result.sender.user_id + '',
        name: result.sender.nickname,
      }
    })()

    const sender = (() => {
      if (result.message_type === 'group') {
        return {
          userId,
          uid: userId,
          uin: result.sender.user_id,
          nick: result.sender.nickname,
          name: result.sender.nickname,
          sex: result.sender.sex || 'unknown',
          role: (result.sender?.role || 'unknown') as Role,
          card: result.sender?.card || '',
          title: result.sender?.title || '',
          level: Number(result.sender?.level) || 0,
          area: result.sender?.area || '',
        }
      }

      return {
        userId,
        uid: userId,
        sex: result.sender.sex || 'unknown',
        role: 'unknown' as Role,
        uin: result.sender.user_id,
        nick: result.sender.nickname,
        name: result.sender.nickname,
      }
    })()

    return {
      time: result.time,
      messageId: messageID,
      message_id: messageID,
      message_seq: messageSeq,
      messageSeq,
      contact,
      sender,
      elements: await this.AdapterConvertKarin(result.message),
    }
  }

  /**
   * 获取msgId获取历史消息
   * @param contact 目标信息
   * @param startMsgId 起始消息ID
   * @param count 获取消息数量 默认为1
   * @returns 包含历史消息的数组
   */
  async getHistoryMsg (contact: Contact, startMsgId: string | number, count: number) {
    const result = await (async (): Promise<ReturnType<OneBotCore['getGroupMsgHistory']> | ReturnType<OneBotCore['nc_getFriendMsgHistory']>> => {
      const targetId = Number(contact.peer)

      /** 通过message_seq获取历史消息 */
      if (typeof startMsgId === 'number') {
        if (this.adapter.name === 'Lagrange.OneBot') {
          throw new Error('Lagrange.OneBot不支持通过seq获取历史消息')
        }

        return this._onebot.getGroupMsgHistory(targetId, startMsgId, count)
      }

      /** 通过message_id获取历史消息 */
      if (typeof startMsgId !== 'string') {
        throw new Error('startMsgId类型错误')
      }

      if (this.adapter.name === 'Lagrange.OneBot') {
        if (contact.scene === 'group') {
          return this._onebot.lgl_getGroupMsgHistory(targetId, Number(startMsgId), count)
        } else if (contact.scene === 'friend') {
          return this._onebot.lgl_getFriendMsgHistory(targetId, Number(startMsgId), count)
        } else {
          throw new Error(`不支持的消息环境:${contact.scene}`)
        }
      }

      const seq = await this.getMsg(contact, startMsgId)
      if (contact.scene === 'group') {
        return this._onebot.getGroupMsgHistory(targetId, seq.message_seq, count)
      } else if (contact.scene === 'friend') {
        return this._onebot.nc_getFriendMsgHistory(targetId, seq.message_seq, count)
      } else {
        throw new Error(`不支持的消息环境:${contact.scene}`)
      }
    })()

    return await Promise.all(result.messages.map(async (v) => {
      const userId = v.sender.user_id + '' || ''
      const messageId = String(v.message_id) || ''
      const messageSeq = (v as any).message_seq || v.message_id

      const data = {
        time: Date.now(),
        messageId,
        messageSeq,
        message_id: messageId,
        message_seq: messageSeq,
        contact,
        sender: senderGroup({
          userId,
          nick: v?.sender?.nickname || '',
          name: v?.sender?.nickname || '',
          sex: v?.sender?.sex || 'unknown',
          age: v?.sender?.age || 0,
          // @ts-ignore
          role: v?.sender?.role || 'unknown',
          // @ts-ignore
          card: v?.sender?.card || '',
          // @ts-ignore
          area: v?.sender?.area || '',
          // @ts-ignore
          level: Number(v?.sender?.level) || 0,
          // @ts-ignore
          title: v?.sender?.title || '',
        }),
        elements: await this.AdapterConvertKarin(v.message),
      }
      return data
    }))
  }

  /**
   * 发送好友赞
   * @param targetId 目标ID
   * @param count 赞的次数
   * @returns 此接口的返回值不值得信任
   */
  async sendLike (targetId: string, count: number) {
    await this._onebot.sendLike(Number(targetId), count)
  }

  /**
   * 群踢人
   * @param groupId 群ID
   * @param targetId 被踢出目标的ID 任选其一
   * @param rejectAddRequest 是否拒绝再次申请，默认为false
   * @param kickReason 踢出原因，可选
   * @returns 此接口的返回值不值得信任
   */
  async groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, _?: string) {
    await this._onebot.setGroupKick(Number(groupId), Number(targetId), rejectAddRequest)
  }

  /**
   * 禁言群成员
   * @param groupId 群ID
   * @param targetId 被禁言目标的ID 任选其一
   * @param duration 禁言时长 单位:秒
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMute (groupId: string, targetId: string, duration: number) {
    await this._onebot.setGroupBan(Number(groupId), Number(targetId), duration)
  }

  /**
   * 群全员禁言
   * @param groupId 群ID
   * @param isBan 是否开启全员禁言
   * @returns 此接口的返回值不值得信任
   */
  async setGroupAllMute (groupId: string, isBan: boolean) {
    await this._onebot.setGroupWholeBan(Number(groupId), isBan)
  }

  /**
   * 设置群管理员
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param isAdmin 是否设置为管理员
   * @returns 此接口的返回值不值得信任
   */
  async setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean) {
    await this._onebot.setGroupAdmin(Number(groupId), Number(targetId), isAdmin)
  }

  /**
   * 设置群名片
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param card 新的群名片
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMemberCard (groupId: string, targetId: string, card: string) {
    await this._onebot.setGroupCard(Number(groupId), Number(targetId), card)
  }

  /**
   * 设置群名
   * @param groupId 群ID
   * @param groupName 新的群名
   * @returns 此接口的返回值不值得信任
   */
  async setGroupName (groupId: string, groupName: string) {
    await this._onebot.setGroupName(Number(groupId), groupName)
  }

  /**
   * 退出群组
   * @param groupId 群ID
   * @param isDismiss 如果Bot是群主，是否解散群
   * @returns 此接口的返回值不值得信任
   */
  async setGroupQuit (groupId: string, isDismiss: boolean) {
    await this._onebot.setGroupLeave(Number(groupId), isDismiss)
  }

  /**
   * 设置群专属头衔 仅群主可用
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param title 新的专属头衔
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMemberTitle (groupId: string, targetId: string, title: string) {
    await this._onebot.setGroupSpecialTitle(Number(groupId), Number(targetId), title)
  }

  /**
   * 获取陌生人信息
   * @param targetId 用户ID 任选其一
   * @returns 陌生人信息数组
   */
  async getStrangerInfo (targetId: string) {
    const result = await this._onebot.getStrangerInfo(Number(targetId[0]), true)
    return {
      ...result,
      userId: targetId,
      user_id: targetId,
      /** 用户UID */
      uid: result.uid || '',
      /** 用户UIN */
      uin: targetId,
      /** qid */
      qid: result.qid || '',
      /** 名称 */
      nick: result.nickname,
      /** 备注 */
      remark: '',
      /** 用户等级 */
      level: 0,
      /** 生日 */
      birthday: '',
      /** 登录天数 */
      login_day: result.login_days || 0,
      /** 点赞数 */
      vote_cnt: 0,
      /** 学校是否已核实 */
      is_school_verified: undefined,
      /**
     * 年龄
     * 拓展字段
     */
      age: result.age,
      /**
     * 性别
     * 拓展字段
     */
      sex: result.sex || 'unknown',
      /** 大会员 */
      big_vip: undefined,
      /** 好莱坞/腾讯视频会员 */
      hollywood_vip: undefined,
      /** QQ会员 */
      qq_vip: result.is_vip,
      /** QQ超级会员 */
      super_vip: undefined,
      /** 是否已经赞过 */
      voted: undefined,
    }
  }

  /**
   * 获取好友列表
   * @param refresh 是否刷新好友列表
   * @returns 好友列表数组
   */
  async getFriendList (_?: boolean) {
    const friendList = await this._onebot.getFriendList()
    return friendList.map(v => {
      const userId = v.user_id + ''
      return {
        ...v,
        userId,
        user_id: userId,
        /** 用户UID */
        uid: '',
        /** 用户UIN */
        uin: userId,
        /** qid */
        qid: v.qid || '',
        /** 昵称 */
        nick: v.nickname,
        /** 昵称 */
        name: v.nickname,
        /** 用户等级 */
        level: 0,
        /** 生日 */
        birthday: '',
        /** 登录天数 */
        login_day: v.login_days || 0,
        /** 点赞数 */
        vote_cnt: 0,
        /** 学校是否已核实 */
        is_school_verified: undefined,
        /**
         * 年龄
         * 拓展字段
         */
        age: v.age,
        /**
         * 性别
         * 拓展字段
         */
        sex: v.sex || 'unknown',
        /** 大会员 */
        big_vip: undefined,
        /** 好莱坞/腾讯视频会员 */
        hollywood_vip: undefined,
        /** QQ会员 */
        qq_vip: v.is_vip,
        /** QQ超级会员 */
        super_vip: undefined,
        /** 是否已经赞过 */
        voted: undefined,
      }
    })
  }

  /** 获取好友列表 */
  async GetFriendList () {
    return this.getFriendList()
  }

  /**
   * 获取群信息
   * @param groupId 群ID
   * @param noCache 是否刷新缓存
   * @returns 群信息
   */
  async getGroupInfo (groupId: string, noCache?: boolean) {
    const info = await this._onebot.getGroupInfo(Number(groupId), noCache)
    const groupName = info.group_name
    return {
      groupId,
      groupName,
      groupRemark: groupName,
      maxMemberCount: info.max_member_count,
      memberCount: info.member_count,
      groupDesc: '',
      group_name: groupName,
      group_remark: groupName,
      max_member_count: info.max_member_count,
      member_count: info.member_count,
      group_uin: groupId,
      admins: (info.admin_list || []).map(v => ({
        userId: v.user_id + '',
        name: v.nickname,
        role: v.role as Role,
      })),
      owner: info.owner_id + '',
    }
  }

  /**
   * 获取群列表
   * @param refresh 是否刷新好友列表
   * @returns 群列表数组
   */
  async getGroupList (_refresh?: boolean) {
    // TODO: 可以走群成员列表获取群主、管理员列表
    const groupList = await this._onebot.getGroupList()
    return groupList.map(info => {
      const groupId = info.group_id + ''
      const groupName = info.group_name
      return {
        groupId,
        groupName,
        groupRemark: groupName,
        maxMemberCount: info.max_member_count,
        memberCount: info.member_count,
        groupDesc: '',
        group_name: groupName,
        group_remark: groupName,
        max_member_count: info.max_member_count,
        member_count: info.member_count,
        group_uin: groupId,
        admins: [],
        owner: '',
      }
    })
  }

  /**
   * 获取群成员信息
   * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param refresh 是否刷新缓存
   * @returns 群成员信息
   */
  async getGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean) {
    const userId = Number(targetId)
    const info = await this._onebot.getGroupMemberInfo(Number(groupId), userId, refresh)
    return {
      ...info,
      userId: targetId,
      uid: targetId,
      uin: targetId,
      nick: info.nickname,
      role: info.role as Role,
      age: info.age,
      uniqueTitle: info.title,
      card: info.card,
      joinTime: info.join_time,
      lastActiveTime: info.last_sent_time,
      level: Number(info.level) || 0,
      shutUpTime: 0,
      distance: undefined,
      honors: [],
      unfriendly: info.unfriendly,
      sex: info.sex,
      get sender (): GroupSender {
        return senderGroup({
          userId: targetId,
          nick: info.nickname,
          name: info.nickname,
          role: info.role as Role,
          sex: info.sex,
          age: info.age,
          card: info.card,
          area: info.area,
          level: Number(info.level) || 0,
          title: info.title,
        })
      },
    }
  }

  /**
   * 获取群成员列表
   * @param groupId 群ID
   * @param refresh 是否刷新缓存
   * @returns 群成员列表数组
   */
  async getGroupMemberList (groupId: string, refresh?: boolean) {
    const list = await this._onebot.getGroupMemberList(Number(groupId), refresh)
    return list.map(v => {
      const targetId = v.user_id + ''
      return {
        ...v,
        userId: targetId,
        uid: targetId,
        uin: targetId,
        nick: v.nickname,
        role: v.role as Role,
        age: v.age,
        uniqueTitle: v.title,
        card: v.card,
        joinTime: v.join_time,
        lastActiveTime: v.last_sent_time,
        level: Number(v.level) || 0,
        shutUpTime: 0,
        distance: undefined,
        honors: [],
        unfriendly: v.unfriendly,
        sex: v.sex,
        get sender (): GroupSender {
          return senderGroup({
            userId: targetId,
            nick: v.nickname,
            name: v.nickname,
            role: v.role as Role,
            sex: v.sex,
            age: v.age,
            card: v.card,
            area: v.area,
            level: Number(v.level),
            title: v.title,
          })
        },
      }
    })
  }

  /**
   * 获取群荣誉信息
   * @param groupId 群ID
   * @param refresh 是否刷新缓存
   * @returns 群荣誉信息数组
   */
  async getGroupHonor (groupId: string) {
    const groupHonor = await this._onebot.getGroupHonorInfo(Number(groupId), 'all')

    const result: QQGroupHonorInfo[] = []
    groupHonor.talkative_list && groupHonor.talkative_list.forEach(honor => {
      const userId = honor.user_id + ''
      result.push({
        userId,
        nick: honor.nickname,
        honorName: '历史龙王',
        id: 0,
        avatar: honor.avatar,
        description: honor.description,
      })
    })

    groupHonor.performer_list && groupHonor.performer_list.forEach(honor => {
      const userId = honor.user_id + ''
      result.push({
        userId,
        nick: honor.nickname,
        honorName: '群聊之火',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })

    groupHonor.legend_list && groupHonor.legend_list.forEach(honor => {
      const userId = honor.user_id + ''
      result.push({
        userId,
        nick: honor.nickname,
        honorName: '群聊炽焰',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })

    groupHonor.strong_newbie_list && groupHonor.strong_newbie_list.forEach(honor => {
      const userId = honor.user_id + ''
      result.push({
        userId,
        nick: honor.nickname,
        honorName: '冒尖小春笋',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })

    groupHonor.emotion_list && groupHonor.emotion_list.forEach(honor => {
      const userId = honor.user_id + ''
      result.push({
        userId,
        nick: honor.nickname,
        honorName: '快乐之源',
        avatar: honor.avatar,
        id: 0,
        description: honor.description,
      })
    })
    return result
  }

  /**
   * 设置消息表情回应
   * @param contact 目标信息
   * @param messageId 消息ID
   * @param faceId 表情ID
   * @returns 此接口的返回值不值得信任
   */
  async setMsgReaction (contact: Contact, messageId: string, faceId: number | string, isSet: boolean) {
    if (this.adapter.name === 'Lagrange.OneBot') {
      await this._onebot.lgl_setGroupReaction(+contact.peer, +messageId, faceId + '', isSet)
      return
    }

    if (this.adapter.name === 'NapCat.Onebot') {
      await this._onebot.nc_setMsgEmojiLike(+messageId, faceId + '', isSet)
      return
    }

    throw new Error(`${this.adapter.name} 不支持设置消息表情回应`)
  }

  /**
   * 获取版本信息
   */
  async getVersion () {
    const res = await this._onebot.getVersionInfo()
    return {
      name: res.app_name,
      app_name: res.app_name,
      version: res.app_version,
      protocol: res.protocol_version,
    }
  }

  async DownloadForwardMessage (_: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   * 获取精华消息
   * @param groupId 群ID
   * @param page 页码
   * @param pageSize 每页数量
   * @returns EssenceMessageBody对象
   */
  async getGroupHighlights (groupId: string, _: number, __: number) {
    const list: Array<GetGroupHighlightsResponse & {
      group_id: string
      sender_uid: string
      sender_uin: string
      sender_nick: string
      operator_uid: string
      operator_uin: string
      operator_nick: string
      operation_time: number
      message_time: number
      message_id: string
      message_seq: number
      json_elements: string
    }> = []
    const res = await this._onebot.getEssenceMsgList(Number(groupId))
    for (const v of res) {
      const { message_seq: messageSeq, elements } = await this.getMsg({
        scene: 'group',
        peer: groupId,
        name: '',
      }, v.message_id + '')
      const senderId = v.sender_id + ''
      const operatorId = v.operator_id + ''
      list.push({
        /** 群ID */
        groupId,
        /** 发送者Id */
        senderId,
        /** 操作者Id */
        operatorId,
        senderName: v.sender_nick,
        operatorName: v.operator_nick,
        operationTime: v.operator_time,
        messageTime: v.sender_time,
        messageSeq,
        messageId: v.message_id + '',
        jsonElements: JSON.stringify(elements),
        group_id: groupId,
        /** 发送者uid */
        sender_uid: senderId,
        /** 发送者uin */
        sender_uin: senderId,
        /** 发送者昵称 */
        sender_nick: v.sender_nick,
        /** 操作者uid */
        operator_uid: operatorId,
        /** 操作者uin */
        operator_uin: operatorId,
        /** 操作者昵称 */
        operator_nick: v.operator_nick,
        /** 操作时间 */
        operation_time: v.operator_time,
        /** 消息时间 */
        message_time: v.sender_time,
        /** 消息ID */
        message_id: v.message_id + '',
        /** 消息序列号 */
        message_seq: messageSeq,
        /** 被设置的精华消息元素文本 */
        json_elements: JSON.stringify(elements),
      })
    }

    return list
  }

  /**
   * 上传群文件、私聊文件
   * @param contact 目标信息
   * @param file 本地文件绝对路径
   * @param name 文件名称 必须提供
   * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
   * @returns 此接口的返回值不值得信任
   */
  async uploadFile (contact: Contact, file: string, name: string, folder?: string) {
    if (contact.scene === 'group') {
      await this._onebot.uploadGroupFile(+contact.peer, file, name, folder)
      return
    }

    await this._onebot.uploadPrivateFile(+contact.peer, file, name)
  }

  /**
   * 设置、取消群精华消息
   * @param groupId 群ID
   * @param messageId 群消息ID
   * @param create true为添加精华消息，false为删除精华消息 默认为true
   */
  async setGgroupHighlights (_: string, messageId: string, create: boolean) {
    if (create) {
      await this._onebot.setEssenceMsg(+messageId)
    } else {
      await this._onebot.deleteEssenceMsg(+messageId)
    }
  }

  async PokeMember (_: string, __: string) {
    // 这个接口比较特殊 暂时先搁置 lgl单独接口 shamrock单独接口 gocq字段不一样 llob貌似没实现？
    throw new Error('Method not implemented.')
  }

  /**
   * 设置好友请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @param remark 好友备注 同意时有效
   * @returns 设置结果
   */
  async setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string) {
    await this._onebot.setFriendAddRequest(requestId, isApprove, remark)
  }

  /**
   * 设置申请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @param denyReason 拒绝理由 拒绝时有效
   * @returns 此接口的返回值不值得信任
   */
  async setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string) {
    await this._onebot.setGroupAddRequest(requestId, 'add', isApprove, denyReason)
  }

  /**
   * 设置邀请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @returns 此接口的返回值不值得信任
   */
  async setInvitedJoinGroupResult (requestId: string, isApprove: boolean) {
    await this._onebot.setGroupAddRequest(requestId, 'invite', isApprove)
  }

  /**
   * 合并转发 karin -> adapter
   * @param elements 消息元素
   * @param options 首层小卡片外显参数
   * @returns 适配器消息元素
   */
  forwardKarinConvertAdapter (elements: Array<NodeElement>, options?: ForwardOptions): Array<NodeMessage> {
    const messages: NodeMessage[] = []
    for (const elem of elements) {
      if (elem.subType === 'messageID') {
        messages.push({ type: OneBotMessageType.Node, data: { id: elem.messageId } })
      } else {
        const node: NodeCustomMessage = {
          type: OneBotMessageType.Node,
          data: {
            user_id: elem.userId,
            nickname: elem.nickname,
            content: this.KarinConvertAdapter(elem.message),
          },
        }

        if (typeof elem.options === 'object') {
          if (elem.options.prompt) node.data.prompt = elem.options.prompt
          if (elem.options.summary) node.data.summary = elem.options.summary
          if (elem.options.source) node.data.source = elem.options.source
        }

        if (options && messages.length === 0) {
          node.data.prompt = options.prompt
          node.data.summary = options.summary
          node.data.source = options.source
        }

        messages.push(node)
      }
    }

    return messages
  }

  /**
   * 发送合并转发消息
   * @param contact 目标信息
   * @param elements 消息元素
   * @param options 首层小卡片外显参数
   */
  async sendForwardMsg (contact: Contact, elements: NodeElement[], options?: ForwardOptions) {
    const result = await (() => {
      if (contact.scene === 'group') {
        return this._onebot.sendGroupForwardMsg(
          Number(contact.peer),
          this.forwardKarinConvertAdapter(elements, options)
        )
      }

      if (contact.scene === 'friend') {
        return this._onebot.sendPrivateForwardMsg(
          Number(contact.peer),
          this.forwardKarinConvertAdapter(elements, options)
        )
      }

      throw TypeError(`不支持的场景类型: ${contact.scene}`)
    })()

    return {
      ...result,
      messageId: String(result.message_id),
      forwardId: String(result.res_id || result.forward_id),
    }
  }

  /**
   * 获取文件url
   * @description napcat支持仅提供fid获取url`(但是你要伪造一个假的contact...)`
   * @param contact 目标信息
   * @param fid 文件id
   * @returns 文件url
   */
  async getFileUrl (contact: Contact, fid: string) {
    if (this.adapter.name === 'NapCat.Onebot') {
      const { url } = await this._onebot.nc_getFile(fid)
      return url
    }

    if (contact.scene === 'group') {
      const { url } = await this._onebot.getGroupFileUrl(+contact.peer, fid)
      return url
    }

    if (contact.scene === 'friend') {
      const { url } = await this._onebot.getPrivateFileUrl(+contact.peer, fid)
      return url
    }

    throw TypeError(`不支持的场景类型: ${contact.scene}`)
  }

  /**
   * 获取群文件系统信息
   * @param groupId 群ID
   * @returns 群文件系统信息
   */
  async getGroupFileSystemInfo (groupId: string) {
    const result = await this._onebot.getGroupFileSystemInfo(+groupId)
    return {
      ...result,
      fileCount: result.file_count,
      limitCount: result.limit_count,
      usedSpace: result.used_space,
      totalSpace: result.total_space,
    }
  }

  /**
   * 获取群文件列表
   * @param groupId 群ID
   * @param folderId 文件夹ID
   * @returns 群文件列表
   */
  async getGroupFileList (groupId: string, folderId?: string) {
    const result = typeof folderId !== 'string'
      ? await this._onebot.getGroupRootFiles(+groupId)
      : await this._onebot.getGroupFilesByFolder(+groupId, folderId)

    return {
      files: result.files.map(v => ({
        fid: v.file_id,
        name: v.file_name,
        size: v.file_size,
        uploadTime: v.upload_time,
        expireTime: v.dead_time,
        modifyTime: v.modify_time,
        downloadCount: v.download_times,
        uploadId: v.uploader + '',
        uploadName: v.uploader_name,
        sha1: '',
        sha3: '',
        md5: '',
      })),
      folders: result.folders.map(v => ({
        id: v.folder_id,
        name: v.folder_name,
        fileCount: v.total_file_count,
        createTime: v.create_time,
        creatorId: v.creator + '',
        creatorName: v.creator_name,
      })),

    }
  }

  /**
   * 获取 Cookies
   * @param domain The domain to get cookies from
   */
  async getCookies (domain: string) {
    const result = await this._onebot.getCookies(domain)
    return { ...result, cookie: result.cookies }
  }

  /**
   * 获取 QQ 相关接口凭证
   * @param domain The domain to get credentials from
   */
  async getCredentials (domain: string) {
    const result = await this._onebot.getCredentials(domain)
    return { ...result, cookies: result.cookies }
  }

  /**
   * 获取 CSRF Token
   */
  async getCSRFToken () {
    const result = await this._onebot.getCsrfToken()
    return { ...result, token: result.token }
  }

  /**
   * 设置头像
   * @param file base64:// file:// http(s)://
   * @returns 是否设置成功
   */
  async setAvatar (file: string) {
    await this._onebot.setQqAvatar(file)
  }

  /**
   * 获取群 Ai 语音可用声色列表
   * @returns 声色列表
   */
  async getAiCharacters () {
    const result = await this._onebot.getAiCharacters()
    return result
  }

  /**
   * 设置群 Ai 语音声色
   * @param groupId 群号
   * @param character 声色ID
   * @param text 转换的文本
   */
  async sendAiCharacter (groupId: string, character: string, text: string) {
    const result = await this._onebot.sendGroupAiRecord(+groupId, character, text)
    return { messageId: result.message_id + '' }
  }

  /**
   * 获取 rkey
   * @returns rkey
   */
  async getRkey () {
    const result = await this._onebot.getRkey()
    return result.rkeys
  }
}
