import { karin } from '@/karin'
import type { AdapterOneBot } from '../base'
import { OB11RequestType, type OB11Request } from '../types/event'
import { createGroupApplyRequest, createGroupInviteRequest, createPrivateApplyRequest } from '@/event'

/**
 * 创建请求事件
 * @param event onebot11请求事件
 * @param bot 标准api实例
 */
export const createRequest = (event: OB11Request, bot: AdapterOneBot) => {
  const time = event.time
  const selfId = event.self_id + ''
  const userId = event.user_id + ''

  // 新好友申请
  if (event.request_type === OB11RequestType.Friend) {
    const contact = karin.contactFriend(userId)
    createPrivateApplyRequest({
      bot,
      selfId,
      time,
      userId,
      contact,
      rawEvent: event,
      subEvent: 'friendApply',
      eventId: `request:${event.flag}`,
      sender: karin.friendSender(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      applierId: userId,
      message: event.comment,
      flag: event.flag,
    })
    return
  }

  // 新成员加群申请
  if (event.request_type === OB11RequestType.Group && event.sub_type === 'add') {
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)

    createGroupApplyRequest({
      bot,
      selfId,
      time,
      userId,
      contact,
      rawEvent: event,
      subEvent: 'groupApply',
      eventId: `request:${event.flag}`,
      sender: karin.groupSender(userId, groupId),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      applierId: userId,
      inviterId: '',
      reason: event.comment,
      flag: event.flag,
    })
    return
  }

  // 邀请Bot加入群聊
  if (event.request_type === OB11RequestType.Group && event.sub_type === 'invite') {
    const groupId = event.group_id + ''
    const contact = karin.contactGroup(groupId)

    createGroupInviteRequest({
      bot,
      selfId,
      time,
      userId,
      contact,
      rawEvent: event,
      subEvent: 'groupInvite',
      eventId: `request:${event.flag}`,
      sender: karin.groupSender(userId, groupId),
      srcReply: (elements) => bot.sendMsg(contact, elements),
    }, {
      inviterId: userId,
      flag: event.flag,
    })
    return
  }

  logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
}
