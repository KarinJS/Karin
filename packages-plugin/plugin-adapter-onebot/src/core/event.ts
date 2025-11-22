import { NoticeType, RequestType } from '@karinjs/onebot'
import {
  // 消息
  createFriendMessage,
  createGroupMessage,
  createGroupTempMessage,
  contactFriend,
  contactGroup,
  contactGroupTemp,
  senderFriend,
  senderGroup,
  // 通知
  createFriendIncreaseNotice,
  createGroupAdminChangedNotice,
  createGroupCardChangedNotice,
  createGroupFileUploadedNotice,
  createGroupHlightsChangedNotice,
  createGroupHonorChangedNotice,
  createGroupLuckKingNotice,
  createGroupMemberAddNotice,
  createGroupMemberBanNotice,
  createGroupMemberDelNotice,
  createGroupMessageReactionNotice,
  createGroupPokeNotice,
  createGroupRecallNotice,
  createPrivatePokeNotice,
  createPrivateRecallNotice,
  createPrivateFileUploadedNotice,
  // 请求
  createGroupApplyRequest,
  createGroupInviteRequest,
  createPrivateApplyRequest,
} from '@karinjs/adapter'

import type { AdapterOneBot } from './adapter'
import type { Role } from '@karinjs/adapter'
import type { OneBotMessageEvent, OneBotMetaEvent, OneBotNoticeEvent, OneBotRequestEvent, OneBotWsEvent } from '@karinjs/onebot'

/**
 * OneBot事件创建器类
 * @class CreateOneBotEvent
 */
export class CreateOneBotEvent {
  /** onebot适配器实例 */
  core: AdapterOneBot
  constructor (core: AdapterOneBot) {
    this.core = core
  }

  /**
   * 分发事件
   * @param event OneBot事件
   */
  async dispatch (event: OneBotWsEvent) {
    if (this.core.core.isEcho(event)) return

    // 统计接收到的事件
    switch (event.post_type) {
      case 'message':
        this.core.recordReceivedEvent('message')
        return this.message(event)
      case 'notice':
        this.core.recordReceivedEvent('notice')
        return this.notice(event)
      case 'request':
        this.core.recordReceivedEvent('request')
        return this.request(event)
      case 'meta_event':
        this.core.recordReceivedEvent('other')
        return this.meta(event)
      default:
        this.core.recordReceivedEvent('other')
        return this.unknown(event)
    }
  }

  /**
   * 创建消息事件
   * @param event onebot11消息事件
   * @param this.core 标准api实例
   */
  async message (event: OneBotMessageEvent) {
    const time = event.time
    if (event.message_type === 'private') {
      if (event.sub_type === 'friend' || event.sub_type === 'other') {
        const userId = event.sender.user_id + ''
        const contact = contactFriend(userId)
        const sender = senderFriend(userId,
          event.sender.nickname,
          event.sender.sex,
          event.sender.age
        )

        createFriendMessage({
          bot: this.core,
          time,
          contact,
          sender,
          rawEvent: event,
          messageId: event.message_id + '',
          messageSeq: event.message_id,
          eventId: `message:${event.message_id}`,
          elements: await this.core.AdapterConvertKarin(event.message),
          srcReply: (elements) => this.core.sendMsg(contact, elements),
        })
        return
      }

      /** 群临时消息 */
      if (event.sub_type === 'group') {
        // TODO: lgl有待测试
        // @ts-ignore 兼容奇怪的协议
        const groupId = event.sender.group_id + '' || event.temp_source + '' || event.group_id + ''
        const userId = event.sender.user_id + ''
        const contact = contactGroupTemp(groupId, userId)
        const sender = senderFriend(userId, event.sender.nickname)
        createGroupTempMessage({
          bot: this.core,
          contact,
          elements: await this.core.AdapterConvertKarin(event.message),
          eventId: `message:${event.message_id}`,
          messageId: event.message_id + '',
          messageSeq: event.message_id,
          rawEvent: event,
          sender,
          time,
          srcReply: (elements) => this.core.sendMsg(contact, elements),
        })
        return
      }

      logger.warn(`[OneBot] 收到未知的私聊事件: ${JSON.stringify(event)}`)
      return
    }

    if (event.message_type === 'group' && event.sub_type === 'normal') {
      const groupId = event.group_id + ''
      const userId = event.sender.user_id + ''
      const { nickname, role, sex, age, card, area, level, title } = event.sender

      const contact = contactGroup(groupId)
      const sender = senderGroup({
        userId,
        role: role as Role,
        nick: nickname,
        name: nickname,
        sex,
        age,
        card,
        area,
        level: +level,
        title,
      })
      createGroupMessage({
        bot: this.core,
        contact,
        elements: await this.core.AdapterConvertKarin(event.message),
        eventId: `message:${event.message_id}`,
        messageId: event.message_id + '',
        messageSeq: event.message_id,
        rawEvent: event,
        sender,
        time,
        srcReply: (elements) => this.core.sendMsg(contact, elements),
      })
      return
    }

    /** tips: go-cqhttp这里会多一个guild类型 一起判断得了... */
    logger.warn(`[OneBot] 收到未知事件: ${JSON.stringify(event)}`)
  }

  /**
   * 创建通知事件
   * @param event onebot11通知事件
   */
  async notice (event: OneBotNoticeEvent) {
    const time = event.time
    // 私聊撤回
    if (event.notice_type === NoticeType.FriendRecall) {
      const userId = event.user_id + ''
      const messageId = event.message_id + ''
      const contact = contactFriend(userId)
      createPrivateRecallNotice({
        bot: this.core,
        eventId: `notice:${userId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderFriend(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          messageId,
          operatorId: userId,
          tips: '',
        },
      })
      return
    }

    // 新增好友
    if (event.notice_type === NoticeType.FriendAdd) {
      const userId = event.user_id + ''
      const contact = contactFriend(userId)
      createFriendIncreaseNotice({
        bot: this.core,
        eventId: `notice:${userId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderFriend(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          targetId: userId,
        },
      })
      return
    }

    // 群聊戳一戳
    if (event.notice_type === NoticeType.Notify && event.sub_type === 'poke' && event.group_id) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupPokeNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: userId,
          targetId: event.target_id + '',
          action: '',
          actionImage: '',
          suffix: '',
        },
      })
      return
    }

    // 私聊戳一戳
    if (event.notice_type === NoticeType.Notify && event.sub_type === 'poke') {
      const userId = event.user_id + ''
      const contact = contactFriend(userId)
      createPrivatePokeNotice({
        bot: this.core,
        eventId: `notice:${userId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderFriend(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: userId,
          targetId: event.target_id + '',
          action: '',
          actionImage: '',
          suffix: '',
        },
      })
      return
    }

    // 运气王事件
    if (event.notice_type === NoticeType.Notify && event.sub_type === 'lucky_king') {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupLuckKingNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          userId,
          targetId: event.target_id + '',
        },
      })
      return
    }

    // 群聊荣誉变更
    if (event.notice_type === NoticeType.Notify && event.sub_type === 'honor') {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupHonorChangedNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          honorType: event.honor_type,
        },
      })
      return
    }

    // 群消息撤回
    if (event.notice_type === NoticeType.GroupRecall) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const messageId = event.message_id + ''
      const operatorId = event.operator_id + ''
      const contact = contactGroup(groupId)
      createGroupRecallNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          messageId,
          operatorId,
          targetId: userId,
          tip: '',
        },
      })
      return
    }

    // 群成员增加
    if (event.notice_type === NoticeType.GroupIncrease) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupMemberAddNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: event.operator_id + '',
          targetId: userId,
          type: event.sub_type,
        },
      })
      return
    }

    // 群成员减少
    if (event.notice_type === NoticeType.GroupDecrease) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupMemberDelNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: event.operator_id + '',
          targetId: userId,
          type: event.sub_type === 'kick_me' ? 'kickBot' : event.sub_type,
        },
      })
      return
    }

    // 群文件上传
    if (event.notice_type === NoticeType.GroupUpload) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupFileUploadedNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          fid: event.file.id,
          name: event.file.name,
          size: event.file.size,
          subId: event.file.busid,
          url: async () => {
            const { file } = await this.core.converter.getFileMessage(event.file)
            return file
          },
        },
      })
      return
    }

    // 群管理员变动
    if (event.notice_type === NoticeType.GroupAdmin) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupAdminChangedNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          targetId: userId,
          isAdmin: event.sub_type === 'set',
        },
      })
      return
    }

    // 群禁言
    if (event.notice_type === NoticeType.GroupBan) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupMemberBanNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: event.operator_id + '',
          targetId: userId,
          duration: event.duration,
          isBan: event.sub_type === 'ban',
        },
      })
      return
    }

    // 群表情回应
    if (event.notice_type === NoticeType.Nc_EmojiLike) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupMessageReactionNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          count: event.likes[0].count,
          faceId: event.likes[0].emoji_id,
          isSet: true,
          messageId: event.message_id + '',
        },
      })
      return
    }

    // 群表情回应 Lagrange
    if (event.notice_type === NoticeType.Lgl_EmojiLike) {
      const userId = event.operator_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupMessageReactionNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          count: event.count,
          faceId: Number(event.code),
          isSet: event.sub_type === 'add',
          messageId: event.message_id + '',
        },
      })
      return
    }

    // 群精华
    if (event.notice_type === NoticeType.GroupEssence) {
      const userId = event.sender_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupHlightsChangedNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          isSet: event.sub_type === 'add',
          messageId: event.message_id + '',
          operatorId: event.operator_id + '',
          senderId: userId,
        },
      })
      return
    }

    /** 群名片变更 */
    if (event.notice_type === NoticeType.GroupCard) {
      const userId = event.user_id + ''
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)
      createGroupCardChangedNotice({
        bot: this.core,
        eventId: `notice:${groupId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderGroup(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          newCard: event.card_new,
          operatorId: '',
          targetId: userId,
        },
      })
      return
    }

    // 好友离线文件
    if (event.notice_type === NoticeType.Lgl_FriendOfflineFile) {
      const userId = event.user_id + ''
      const contact = contactFriend(userId)
      createPrivateFileUploadedNotice({
        bot: this.core,
        eventId: `notice:${userId}.${event.time}`,
        rawEvent: event,
        time,
        contact,
        sender: senderFriend(userId),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          operatorId: userId,
          subId: 0,
          fid: event.file.id,
          name: event.file.name,
          size: event.file.size,
          expireTime: 0,
          url: async () => {
            const { file } = await this.core.converter.getFileMessage(event.file)
            return file
          },
        },
      })
      return
    }

    logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
  }

  /**
   * 创建请求事件
   * @param event onebot11请求事件
   */
  async request (event: OneBotRequestEvent) {
    const time = event.time
    const userId = event.user_id + ''

    // 新好友申请
    if (event.request_type === RequestType.Friend) {
      const contact = contactFriend(userId)
      createPrivateApplyRequest({
        bot: this.core,
        time,
        contact,
        rawEvent: event,
        subEvent: 'friendApply',
        eventId: `request:${event.flag}`,
        sender: senderFriend(userId, ''),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          comment: event.comment,
          applierId: userId,
          message: event.comment,
          flag: event.flag,
        },
      })
      return
    }

    // 新成员加群申请
    if (event.request_type === RequestType.Group && event.sub_type === 'add') {
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)

      createGroupApplyRequest({
        bot: this.core,
        time,
        contact,
        rawEvent: event,
        subEvent: 'groupApply',
        eventId: `request:${event.flag}`,
        sender: senderGroup(userId, 'member'),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          applierId: userId,
          inviterId: '',
          reason: event.comment,
          flag: event.flag,
          groupId,
          comment: event.comment,
        },
      })
      return
    }

    // 邀请Bot加入群聊
    if (event.request_type === RequestType.Group && event.sub_type === 'invite') {
      const groupId = event.group_id + ''
      const contact = contactGroup(groupId)

      createGroupInviteRequest({
        bot: this.core,
        time,
        contact,
        rawEvent: event,
        subEvent: 'groupInvite',
        eventId: `request:${event.flag}`,
        sender: senderGroup(userId, 'member'),
        srcReply: (elements) => this.core.sendMsg(contact, elements),
        content: {
          inviterId: userId,
          flag: event.flag,
          comment: event.comment,
          groupId,
        },
      })
      return
    }

    logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
  }

  /**
   * 处理OneBot元事件
   * @param event OneBot元事件
   */
  meta (event: OneBotMetaEvent) {
    if (event.meta_event_type === 'lifecycle') {
      if (event.sub_type === 'enable') {
        return logger.bot('mark', this.core.selfId, 'OneBot启用')
      }

      if (event.sub_type === 'disable') {
        return logger.bot('mark', this.core.selfId, 'OneBot停用')
      }

      if (event.sub_type === 'connect') {
        return logger.bot('mark', this.core.selfId, 'WebSocket连接成功')
      }
    }

    if (event.meta_event_type === 'heartbeat') {
      return logger.bot('trace', this.core.selfId, '心跳:\n' + JSON.stringify(event, null, 2))
    }
  }

  /**
   * 未知事件
   * @param event OneBot未知事件
   */
  async unknown (event: OneBotWsEvent) {
    logger.bot('warn', this.core.selfId, `收到未知事件: ${JSON.stringify(event, null, 2)}`)
  }
}
