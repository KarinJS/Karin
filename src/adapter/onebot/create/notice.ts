import { karin } from '@/karin'
import { AdapterOneBot } from '../base'
import { OB11NoticeType } from '../types/event'
import type { OB11Message, OB11Notice, OB11Request } from '../types/event'
import {
  createFriendIncreaseNotice,
  createGroupAdminChangedNotice,
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
} from '@/event'

/**
 * 创建通知事件
 * @param event onebot11通知事件
 * @param bot 标准api实例
 */
export const createNotice = (event: OB11Notice, bot: AdapterOneBot) => {
  const time = event.time
  const selfId = event.self_id + ''
  // 私聊撤回
  if (event.notice_type === OB11NoticeType.FriendRecall) {
    const userId = event.user_id + ''
    const messageId = event.message_id + ''
    const contact = karin.contactFriend(userId)
    createPrivateRecallNotice({
      bot,
      eventId: `notice:${userId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.friendSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      messageId,
      operatorId: userId,
      tips: '',
    })
    return
  }

  // 新增好友
  if (event.notice_type === OB11NoticeType.FriendAdd) {
    const userId = event.user_id + ''
    const contact = karin.contactFriend(userId)
    createFriendIncreaseNotice({
      bot,
      eventId: `notice:${userId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.friendSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      targetId: userId,
    })
    return
  }

  // 群聊戳一戳
  if (event.notice_type === OB11NoticeType.Notify && event.sub_type === 'poke' && event.group_id) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupPokeNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      operatorId: userId,
      targetId: event.target_id + '',
      action: '',
      actionImage: '',
      suffix: '',
    })
    return
  }

  // 私聊戳一戳
  if (event.notice_type === OB11NoticeType.Notify && event.sub_type === 'poke') {
    const userId = event.user_id + ''
    const contact = karin.contactFriend(userId)
    createPrivatePokeNotice({
      bot,
      eventId: `notice:${userId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.friendSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      operatorId: userId,
      targetId: event.target_id + '',
      action: '',
      actionImage: '',
      suffix: '',
    })
    return
  }

  // 运气王事件
  if (event.notice_type === OB11NoticeType.Notify && event.sub_type === 'lucky_king') {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupLuckKingNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      userId,
      targetId: event.target_id + '',
    })
    return
  }

  // 群聊荣誉变更
  if (event.notice_type === OB11NoticeType.Notify && event.sub_type === 'honor') {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupHonorChangedNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      honorType: event.honor_type,
    })
    return
  }

  // 群消息撤回
  if (event.notice_type === OB11NoticeType.GroupRecall) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const messageId = event.message_id + ''
    const operatorId = event.operator_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupRecallNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      messageId,
      operatorId,
      targetId: userId,
      tip: '',
    })
    return
  }

  // 群成员增加
  if (event.notice_type === OB11NoticeType.GroupIncrease) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupMemberAddNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      operatorId: event.operator_id + '',
      targetId: userId,
      type: event.sub_type,
    })
    return
  }

  // 群成员减少
  if (event.notice_type === OB11NoticeType.GroupDecrease) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupMemberDelNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      operatorId: event.operator_id + '',
      targetId: userId,
      type: event.sub_type === 'kick_me' ? 'kickBot' : event.sub_type,
    })
    return
  }

  // 群文件上传
  if (event.notice_type === OB11NoticeType.GroupUpload) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupFileUploadedNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      fid: event.file.id,
      name: event.file.name,
      size: event.file.size,
      subId: event.file.busid,
    })
    return
  }

  // 群管理员变动
  if (event.notice_type === OB11NoticeType.GroupAdmin) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupAdminChangedNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      targetId: userId,
      isAdmin: event.sub_type === 'set',
    })
    return
  }

  // 群禁言
  if (event.notice_type === OB11NoticeType.GroupBan) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupMemberBanNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      operatorId: event.operator_id + '',
      targetId: userId,
      duration: event.duration,
      isBan: event.sub_type === 'ban',
    })
    return
  }

  // 群表情回应
  if (event.notice_type === OB11NoticeType.GroupMsgEmojiLike) {
    const userId = event.user_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupMessageReactionNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      count: event.likes[0].count,
      faceId: event.likes[0].emoji_id,
      isSet: true,
      messageId: event.message_id + '',
    })
    return
  }

  // 群表情回应 Lagrange
  if (event.notice_type === OB11NoticeType.GroupMsgEmojiLikeLagrange) {
    const userId = event.operator_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupMessageReactionNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      count: event.count,
      faceId: Number(event.code),
      isSet: event.sub_type === 'add',
      messageId: event.message_id + '',
    })
    return
  }

  // 群精华
  if (event.notice_type === OB11NoticeType.GroupEssence) {
    const userId = event.sender_id + ''
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)
    createGroupHlightsChangedNotice({
      bot,
      eventId: `notice:${groupId}.${event.time}`,
      rawEvent: event,
      selfId,
      time,
      userId,
      contact,
      sender: karin.groupSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      isSet: event.sub_type === 'add',
      messageId: event.message_id + '',
      operatorId: event.operator_id + '',
      senderId: userId,
    })
    return
  }

  logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
}

/**
 * 创建请求事件
 * @param event onebot11请求事件
 * @param bot 标准api实例
 */
export const createRequest = (event: OB11Request, bot: AdapterOneBot) => {

}

/**
 * 处理元事件
 * @param event 元事件
 * @param bot 标准api实例
 */
export const createMeta = (event: OB11Message, bot: AdapterOneBot) => {

}
