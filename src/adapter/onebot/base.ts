import { AdapterBase } from '../base'
import { OB11Event } from './types/event'
import { createMessage } from './create/message'
import { RoleEnum, SexEnum } from '@/adapter/sender'
import { createNotice, createRequest } from './create/notice'
import { AdapterConvertKarin, KarinConvertAdapter } from './convert'
import { GetGroupHighlightsResponse, QQGroupHonorInfo } from '@/adapter/types'
import { Action, OB11NodeSegment, OB11Segment, Params, Request } from './types'
import type { Contact } from '@/adapter/contact'
import type { OB11AllEvent } from './types/event'
import type { ElementTypes, NodeElementType } from '@/adapter/segment'
import type { ForwardOptions, SendMsgResults } from '@/adapter/adapter'

export abstract class AdapterOneBot extends AdapterBase {
  constructor () {
    super()
    this.adapter.platform = 'qq'
    this.adapter.standard = 'onebot11'
  }

  /**
   * 事件处理
   * @param data 事件数据对象
   * @param str 事件字符串
   */
  eventHandlers (data: OB11AllEvent, str: string) {
    if (data.post_type === OB11Event.Message) {
      createMessage(data, this)
      return
    }

    if (data.post_type === OB11Event.Notice) {
      createNotice(data, this)
      return
    }

    if (data.post_type === OB11Event.Request) {
      createRequest(data, this)
      return
    }

    if (data.post_type === OB11Event.MetaEvent) {
      if (data.meta_event_type === 'lifecycle') {
        if (data.sub_type === 'enable') {
          logger.bot('debug', this.selfId, 'OneBot启用')
        }

        if (data.sub_type === 'disable') {
          logger.bot('debug', this.selfId, 'OneBot停用')
        }

        if (data.sub_type === 'connect') {
          logger.bot('debug', this.selfId, 'WebSocket连接成功')
        }
        return
      }

      logger.bot('warn', this.selfId, `收到未知元事件: ${str}`)
      return
    }

    if ((data as any).retcode) {
      const { retcode } = data as any
      if (retcode === 1401 || retcode === 1403) {
        logger.error(`[oneBot11][鉴权失败] address: ${this.adapter.address} event: ${str}`)
        return
      }

      logger.bot('error', this.selfId, `发生未知错误: ${str}`)
    }

    logger.bot('warn', this.selfId, `收到未知事件: ${str}`)
  }

  /**
   * onebot11转karin
   * @return karin格式消息
   */
  AdapterConvertKarin (data: Array<OB11Segment>): any {
    return AdapterConvertKarin(data)
  }

  /**
   * karin转onebot11
   * @param data karin格式消息
   */
  KarinConvertAdapter (data: Array<ElementTypes>): any {
    return KarinConvertAdapter(data, this.adapter.address)
  }

  /**
   * 获取头像url
   * @param 头像大小，默认`0`
   * @param 用户qq，默认为机器人QQ
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
    contact: Contact, elements: Array<ElementTypes>, retryCount?: number
  ): Promise<SendMsgResults & { message_id: string, message_time: number }> {
    try {
      const { scene, peer } = contact
      let res
      if (scene === 'group') {
        res = await this.sendApi(Action.sendMsg, {
          message_type: 'group',
          group_id: Number(peer),
          message: this.KarinConvertAdapter(elements),
        })
      } else {
        res = await this.sendApi(Action.sendMsg, {
          message_type: 'private',
          user_id: Number(peer),
          message: this.KarinConvertAdapter(elements),
        })
      }

      const messageId = String(res.message_id)
      const messageTime = Date.now()
      const rawData = res

      return { messageId, messageTime, rawData, message_id: messageId, message_time: messageTime }
    } catch (error) {
      if (retryCount && retryCount > 0) {
        return this.sendMsg(contact, elements, retryCount - 1)
      }
      throw error
    }
  }

  /**
   * 发送消息
   * @deprecated 已废弃，请使用`sendMsg`
   */
  async SendMessage (contact: Contact, elements: Array<ElementTypes>, retryCount?: number) {
    return this.sendMsg(contact, elements, retryCount)
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
    let result
    const { scene, peer } = contact

    if (scene === 'group') {
      result = await this.sendApi(Action.sendGroupMsg, {
        group_id: Number(peer),
        message: [{ type: 'forward', data: { id: resId } }],
      })
    } else {
      result = await this.sendApi(Action.sendPrivateMsg, {
        user_id: Number(peer),
        message: [{ type: 'forward', data: { id: resId } }],
      })
    }

    const messageId = String(result.message_id)
    const messageTime = Date.now()

    return {
      messageId,
      messageTime,
      rawData: result,
      message_id: messageId,
      message_time: messageTime,
    }
  }

  /**
   * @deprecated 已废弃，请使用`sendLongMsg`
   */
  async SendMessageByResId (contact: Contact, id: string) {
    return this.sendLongMsg(contact, id)
  }

  /**
   * 撤回消息
   * @param contact ob11无需提供contact参数
   * @param messageId 消息ID
   */
  async recallMsg (contact: Contact, messageId: string) {
    try {
      await this.sendApi(Action.deleteMsg, { message_id: Number(messageId) })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`recallMsg`
   */
  async RecallMessage (_contact: Contact, messageId: string) {
    return this.recallMsg(_contact, messageId)
  }

  /**
   * 获取消息
   * @param contact 联系人信息
   * @param messageId 消息ID
   */
  async getMsg (contact: Contact, messageId: string) {
    const result = await this.sendApi(Action.getMsg, { message_id: Number(messageId) })
    const userId = result.sender.user_id + ''
    const messageSeq = result.message_seq || result.message_id
    const messageID = result.message_id + ''

    return {
      time: result.time,
      messageId: messageID,
      message_id: messageID,
      message_seq: messageSeq,
      messageSeq,
      contact: {
        scene: result.message_type === 'group' ? 'group' as const : 'friend' as const,
        peer: contact.peer, // 这里可能不准确 传入是什么就返回什么
        sub_peer: null,
      },
      sender: {
        userId,
        uid: userId,
        uin: result.sender.user_id,
        nick: result.sender.nickname,
        role: RoleEnum.UNKNOWN,
      },
      elements: this.AdapterConvertKarin(result.message),
    }
  }

  /**
   * @deprecated 已废弃，请使用`getMsg`
   */
  async GetMessage (contact: Contact, messageId: string) {
    return this.getMsg(contact, messageId)
  }

  /**
   * 获取msgId获取历史消息
   * @param contact 目标信息
   * @param startMsgId 起始消息ID
   * @param count 获取消息数量 默认为1
   * @returns 包含历史消息的数组
   */
  async getHistoryMsg (contact: Contact, startMsgId: string, count: number) {
    let options: any

    if (this.adapter.name === 'Lagrange.OneBot') {
      options = { message_id: Number(startMsgId), count }
    } else {
      // 后续检查一下llob napcat是支持传递message_id的
      const messageSeq = (await this.getMsg(contact, startMsgId)).message_seq
      options = { message_seq: messageSeq, count }
    }

    let res
    if (contact.scene === 'group') {
      options.group_id = Number(contact.peer)
      res = await this.sendApi(Action.getGroupMsgHistory, options)
    } else {
      options.user_id = Number(contact.peer)
      res = await this.sendApi(Action.getFriendMsgHistory, options)
    }

    const all = []

    for (const v of res.messages) {
      const userId = v.sender.user_id + '' || ''
      const messageId = String(v.message_id) || ''
      const messageSeq = v.message_seq || 0

      const data = {
        time: Date.now(),
        messageId,
        messageSeq,
        message_id: messageId,
        message_seq: messageSeq,
        contact,
        sender: {
          userId,
          uid: userId,
          uin: v.sender.user_id,
          nick: v?.sender?.nickname || '',
          role: v?.sender?.role as RoleEnum || RoleEnum.UNKNOWN,
          card: contact.scene === 'group' ? v?.sender?.card || '' : '',
        },
        elements: this.AdapterConvertKarin(v.message),
      }

      all.push(data)
    }

    return all
  }

  /**
   * 获取msg_id获取历史消息
   * @deprecated 已废弃，请使用`getHistoryMsg`
   */
  async GetHistoryMessage (contact: Contact, startMessageId: string, count: number = 1) {
    return this.getHistoryMsg(contact, startMessageId, count)
  }

  /**
   * 发送好友赞
   * @param targetId 目标ID
   * @param count 赞的次数
   * @returns 此接口的返回值不值得信任
   */
  async sendLike (targetId: string, count: number) {
    try {
      await this.sendApi(Action.sendLike, { user_id: Number(targetId), times: count })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`sendLike`
   */
  async VoteUser (targetId: string, voteCount: number = 10) {
    return this.sendLike(targetId, voteCount)
  }

  /**
   * 群踢人
   * @param groupId 群ID
   * @param targetId 被踢出目标的ID 任选其一
   * @param rejectAddRequest 是否拒绝再次申请，默认为false
   * @param kickReason 踢出原因，可选
   * @returns 此接口的返回值不值得信任
   */
  async groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string) {
    try {
      await this.sendApi(Action.setGroupKick, {
        group_id: Number(groupId),
        user_id: Number(targetId),
        reject_add_request: rejectAddRequest,
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`groupKickMember`
   */
  async KickMember (groupId: string, targetId: string, rejectAddRequest: boolean = false, kickReason: string = '') {
    return this.groupKickMember(groupId, targetId, rejectAddRequest, kickReason)
  }

  /**
   * 禁言群成员
   * @param groupId 群ID
   * @param targetId 被禁言目标的ID 任选其一
   * @param duration 禁言时长 单位:秒
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMute (groupId: string, targetId: string, duration: number) {
    try {
      await this.sendApi(Action.setGroupBan, { group_id: Number(groupId), user_id: Number(targetId), duration })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupMute`
   */
  async BanMember (groupId: string, targetId: string, duration: number) {
    return this.setGroupMute(groupId, targetId, duration)
  }

  /**
   * 群全员禁言
   * @param groupId 群ID
   * @param isBan 是否开启全员禁言
   * @returns 此接口的返回值不值得信任
   */
  async setGroupAllMute (groupId: string, isBan: boolean) {
    try {
      await this.sendApi(Action.setGroupWholeBan, { group_id: Number(groupId), enable: isBan })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupAllMute`
   */
  async SetGroupWholeBan (groupId: string, isBan = true) {
    return this.setGroupAllMute(groupId, isBan)
  }

  /**
   * 设置群管理员
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param isAdmin 是否设置为管理员
   * @returns 此接口的返回值不值得信任
   */
  async setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean) {
    try {
      await this.sendApi(Action.setGroupAdmin, { group_id: Number(groupId), user_id: Number(targetId), enable: isAdmin })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupAdmin`
   */
  async SetGroupAdmin (groupId: string, targetId: string, isAdmin: boolean) {
    return this.setGroupAdmin(groupId, targetId, isAdmin)
  }

  /**
   * 设置群名片
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param card 新的群名片
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMemberCard (groupId: string, targetId: string, card: string) {
    try {
      await this.sendApi(Action.setGroupCard, { group_id: Number(groupId), user_id: Number(targetId), card })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupMemberCard`
   */
  async ModifyMemberCard (groupId: string, targetId: string, card: string) {
    return this.setGroupMemberCard(groupId, targetId, card)
  }

  /**
   * 设置群名
   * @param groupId 群ID
   * @param groupName 新的群名
   * @returns 此接口的返回值不值得信任
   */
  async setGroupName (groupId: string, groupName: string) {
    try {
      await this.sendApi(Action.setGroupName, { group_id: Number(groupId), group_name: groupName })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupName`
   */
  async ModifyGroupName (groupId: string, groupName: string) {
    return this.setGroupName(groupId, groupName)
  }

  /**
   * 退出群组
   * @param groupId 群ID
   * @param isDismiss 如果Bot是群主，是否解散群
   * @returns 此接口的返回值不值得信任
   */
  async setGroupQuit (groupId: string, isDismiss: boolean) {
    try {
      await this.sendApi(Action.setGroupLeave, { group_id: Number(groupId), is_dismiss: isDismiss })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupQuit`
   */
  async LeaveGroup (groupId: string, isDismiss = false) {
    return this.setGroupQuit(groupId, isDismiss)
  }

  /**
   * 设置群专属头衔 仅群主可用
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param title 新的专属头衔
   * @returns 此接口的返回值不值得信任
   */
  async setGroupMemberTitle (groupId: string, targetId: string, title: string) {
    try {
      await this.sendApi(Action.setGroupSpecialTitle, { group_id: Number(groupId), user_id: Number(targetId), special_title: title })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupMemberTitle`
   */
  async SetGroupUniqueTitle (groupId: string, targetId: string, uniqueTitle: string) {
    return this.setGroupMemberTitle(groupId, targetId, uniqueTitle)
  }

  /**
   * 获取登录号信息
   * @deprecated 已废弃，请直接使用`this.account`
   */
  async GetCurrentAccount (): Promise<{
    account_uid: string
    account_uin: string
    account_name: string
  }> {
    const res = await this.sendApi(Action.getLoginInfo, {})
    return {
      account_uid: res.user_id + '',
      account_uin: res.user_id + '',
      account_name: res.nickname,
    }
  }

  /**
   * 获取陌生人信息
   * @param targetId 用户ID 任选其一
   * @returns 陌生人信息数组
   */
  async getStrangerInfo (targetId: string) {
    const result = await this.sendApi(Action.getStrangerInfo, { user_id: Number(targetId[0]), no_cache: true })
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
      sex: result.sex as SexEnum || SexEnum.UNKNOWN,
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
  async getFriendList (refresh?: boolean) {
    const friendList = await this.sendApi(Action.getFriendList, {})
    return friendList.map(v => {
      const userId = v.user_id + ''
      return {
        ...v,
        userId,
        user_id: userId,
        /** 用户UID */
        uid: v.uid || '',
        /** 用户UIN */
        uin: userId,
        /** qid */
        qid: v.qid || '',
        /** 名称 */
        nick: v.nickname,
        /** 备注 */
        remark: '',
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
        sex: v.sex as SexEnum || SexEnum.UNKNOWN,
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

  /**
   * @deprecated 已废弃，请使用`getStrangerInfo`
   */
  async GetStrangerProfileCard (targetId: Array<string>) {
    return this.getStrangerInfo(targetId[0])
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
    const info = await this.sendApi(Action.getGroupInfo, { group_id: Number(groupId), no_cache: noCache })
    const groupName = info.group_name
    // todo 可以走群成员列表获取群主
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
  }

  /**
   * @deprecated 已废弃，请使用`getGroupInfo`
   */
  async GetGroupInfo (_groupId: string, noCache = false) {
    return this.getGroupInfo(_groupId, noCache)
  }

  /**
   * 获取群列表
   * @param refresh 是否刷新好友列表
   * @returns 群列表数组
   */
  async getGroupList (refresh?: boolean) {
    const groupList = await this.sendApi(Action.getGroupList, { no_cache: refresh })
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
   * 获取群列表
   * @deprecated 已废弃，请使用`getGroupList`
   */
  async GetGroupList () {
    return this.getGroupList()
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
    const info = await this.sendApi(Action.getGroupMemberInfo, { group_id: Number(groupId), user_id: userId, no_cache: refresh })
    return {
      ...info,
      userId: targetId,
      uid: targetId,
      uin: targetId,
      nick: info.nickname,
      role: info.role as RoleEnum,
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
   * @deprecated 已废弃，请使用`getGroupMemberInfo`
   */
  async GetGroupMemberInfo (groupId: string, targetId: string, refresh = false) {
    return this.getGroupMemberInfo(groupId, targetId, refresh)
  }

  /**
   * 获取群成员列表
   * @param groupId 群ID
   * @param refresh 是否刷新缓存
   * @returns 群成员列表数组
   */
  async getGroupMemberList (groupId: string, refresh?: boolean) {
    const list = await this.sendApi(Action.getGroupMemberList, { group_id: Number(groupId), no_cache: refresh })
    return list.map(v => {
      const userId = v.user_id + ''
      return {
        ...v,
        userId,
        uid: userId,
        uin: userId,
        nick: v.nickname,
        role: v.role as RoleEnum,
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
   * @deprecated 已废弃，请使用`getGroupMemberList`
   */
  async GetGroupMemberList (groupId: string, refresh = false) {
    return this.getGroupMemberList(groupId, refresh)
  }

  /**
   * 获取群荣誉信息
   * @param groupId 群ID
   * @param refresh 是否刷新缓存
   * @returns 群荣誉信息数组
   */
  async getGroupHonor (groupId: string) {
    const groupHonor = await this.sendApi(Action.getGroupHonorInfo, { group_id: Number(groupId), type: 'all' })

    const result: QQGroupHonorInfo[] = []
    groupHonor.talkative_list.forEach(honor => {
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
    groupHonor.performer_list.forEach(honor => {
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
    groupHonor.legend_list.forEach(honor => {
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
    groupHonor.strong_newbie_list.forEach(honor => {
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
    groupHonor.emotion_list.forEach(honor => {
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
   * @deprecated 已废弃，请使用`getGroupHonor`
   */
  async GetGroupHonor (groupId: string, refresh = false) {
    return this.getGroupHonor(groupId)
  }

  /**
   * 设置消息表情回应
   * @param contact 目标信息
   * @param messageId 消息ID
   * @param faceId 表情ID
   * @returns 此接口的返回值不值得信任
   */
  async setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean) {
    try {
      await this.sendApi(Action.setMsgEmojiLike, { message_id: messageId, emoji_id: faceId, is_set: isSet })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setMsgReaction`
   */
  async ReactMessageWithEmoji (contact: Contact, messageId: string, faceId: number, isSet = true) {
    return this.setMsgReaction(contact, messageId, faceId, isSet)
  }

  /**
   * 获取版本信息
   * @deprecated 已废弃，请使用`setMsgReaction`
   */
  async GetVersion () {
    const res = await this.sendApi(Action.getVersionInfo, {})
    return {
      name: res.app_name,
      app_name: res.app_name,
      version: res.app_version,
      protocol: res.protocol_version,
    }
  }

  async DownloadForwardMessage (resId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   * 获取精华消息
   * @param groupId 群ID
   * @param page 页码
   * @param pageSize 每页数量
   * @returns EssenceMessageBody对象
   */
  async getGroupHighlights (groupId: string, page: number, pageSize: number) {
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
    const res = await this.sendApi(Action.getEssenceMsgList, { group_id: Number(groupId) })
    for (const v of res) {
      const { message_seq: messageSeq, elements } = await this.getMsg({ scene: 'group', peer: groupId, sub_peer: null }, v.message_id + '')
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
   * 精华消息
   * @deprecated 已废弃，请使用`getGroupHighlights`
   */
  async GetEssenceMessageList (groupId: string, page: number, pageSize: number) {
    return this.getGroupHighlights(groupId, page, pageSize)
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
    try {
      if (contact.scene === 'group') {
        await this.sendApi(Action.uploadGroupFile, { group_id: Number(contact.peer), file, name, folder })
      } else {
        await this.sendApi(Action.uploadPrivateFile, { user_id: Number(contact.peer), file, name })
      }
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`uploadFile`
   */
  async UploadGroupFile (groupId: string, file: string, name: string, folder?: string) {
    return this.uploadFile({ scene: 'group', peer: groupId, sub_peer: null }, file, name, folder)
  }

  /**
   * @deprecated 已废弃，请使用`uploadFile`
   */
  async UploadPrivateFile (userId: string, file: string, name: string) {
    return this.uploadFile({ scene: 'friend', peer: userId, sub_peer: null }, file, name)
  }

  /**
   * 设置、取消群精华消息
   * @param groupId 群ID
   * @param messageId 群消息ID
   * @param create true为添加精华消息，false为删除精华消息 默认为true
   */
  async setGgroupHighlights (groupId: string, messageId: string, create: boolean) {
    try {
      await this.sendApi(create ? Action.setEssenceMsg : Action.deleteEssenceMsg, { message_id: Number(messageId) })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGgroupHighlights`
   */
  async SetEssenceMessage (_groupId: string, messageId: string) {
    return this.setGgroupHighlights(_groupId, messageId, true)
  }

  /**
   * @deprecated 已废弃，请使用`setGgroupHighlights`
   */
  async DeleteEssenceMessage (_groupId: string, messageId: string) {
    return this.setGgroupHighlights(_groupId, messageId, false)
  }

  async PokeMember (groupId: string, targetId: string) {
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
    try {
      await this.sendApi(Action.setFriendAddRequest, { flag: requestId, approve: isApprove, remark })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setFriendApplyResult`
   */
  async SetFriendApplyResult (requestId: string, isApprove: boolean, remark?: string) {
    return this.setFriendApplyResult(requestId, isApprove, remark)
  }

  /**
   * 设置申请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @param denyReason 拒绝理由 拒绝时有效
   * @returns 此接口的返回值不值得信任
   */
  async setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string) {
    try {
      await this.sendApi(Action.setGroupAddRequest, { flag: requestId, approve: isApprove, sub_type: 'add', reason: denyReason })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setGroupApplyResult`
   */
  async SetGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string) {
    try {
      await this.sendApi(Action.setGroupAddRequest, { flag: requestId, approve: isApprove, sub_type: 'add', reason: denyReason })
      return true
    } catch {
      return false
    }
  }

  /**
   * 设置邀请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @returns 此接口的返回值不值得信任
   */
  async setInvitedJoinGroupResult (requestId: string, isApprove: boolean) {
    try {
      await this.sendApi(Action.setGroupAddRequest, { flag: requestId, approve: isApprove, sub_type: 'invite' })
      return true
    } catch {
      return false
    }
  }

  /**
   * @deprecated 已废弃，请使用`setInvitedJoinGroupResult`
   */
  async SetInvitedJoinGroupResult (requestId: string, isApprove: boolean, denyReason?: string) {
    return this.setInvitedJoinGroupResult(requestId, isApprove)
  }

  /**
   * 合并转发 karin -> adapter
   * @param elements 消息元素
   * @returns 适配器消息元素
   */
  forwardKarinConvertAdapter (elements: Array<NodeElementType>): Array<OB11NodeSegment> {
    const messages: OB11NodeSegment[] = []
    for (const elem of elements) {
      if ('resId' in elem) {
        messages.push({ type: 'node', data: { id: elem.resId } })
      } else {
        const node: OB11NodeSegment = {
          type: 'node',
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
  async sendForwardMsg (contact: Contact, elements: NodeElementType[], options?: ForwardOptions) {
    if (contact.scene === 'group') {
      const result = await this.sendApi(Action.sendGroupForwardMsg, {
        group_id: Number(contact.peer),
        messages: this.forwardKarinConvertAdapter(elements),
        ...options,
      })
      const messageId = String(result.message_id)
      return { messageId, forwardId: result.forward_id, message_id: messageId }
    }

    if (contact.scene === 'friend') {
      const result = await this.sendApi(Action.sendPrivateForwardMsg, {
        user_id: Number(contact.peer),
        messages: this.forwardKarinConvertAdapter(elements),
        ...options,
      })

      const messageId = String(result.message_id)
      return { messageId, forwardId: result.forward_id, message_id: messageId }
    }

    throw TypeError(`不支持的场景类型: ${contact.scene}`)
  }

  /**
   * @deprecated 已废弃，请使用`sendForwardMsg`
   */
  async sendForwardMessage (contact: Contact, elements: NodeElementType[]) {
    return this.sendForwardMsg(contact, elements)
  }

  /**
   * 发送API请求
   * @param action API端点
   * @param params API参数
   */
  async sendApi<T extends keyof Params> (
    action: T | `${T}`,
    params: Params[T],
    time = 120
  ): Promise<Request[T]> {
    throw new Error('tips: 请在子类中实现此方法')
  }

  /**
   * 发送API请求
   * @deprecated 已废弃，请使用`sendApi`
   */
  async SendApi<T extends keyof Params> (
    action: T,
    params: Params[T],
    time = 0
  ): Promise<Request[T]> {
    return this.sendApi(action, params, time)
  }
}
