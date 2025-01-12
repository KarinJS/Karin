import type { AdapterOneBot } from '@/adapter/onebot/core/base'
import { OB11RequestType, type OB11Request } from '@/adapter/onebot/types/event'
import {
  contactFriend,
  contactGroup,
  senderFriend,
  senderGroup,
} from '@/event'
import {
  createGroupApplyRequest,
  createGroupInviteRequest,
  createPrivateApplyRequest,
} from '@/event/create'

/**
 * 创建请求事件
 * @param event onebot11请求事件
 * @param bot 标准api实例
 */
export const createRequest = (event: OB11Request, bot: AdapterOneBot) => {
  const time = event.time
  const userId = event.user_id + ''

  // 新好友申请
  if (event.request_type === OB11RequestType.Friend) {
    const contact = contactFriend(userId)
    createPrivateApplyRequest({
      bot,
      time,
      contact,
      rawEvent: event,
      subEvent: 'friendApply',
      eventId: `request:${event.flag}`,
      sender: senderFriend(userId, ''),
      srcReply: (elements) => bot.sendMsg(contact, elements),
      content: {
        applierId: userId,
        message: event.comment,
        flag: event.flag,
      },
    })
    return
  }

  // 新成员加群申请
  if (event.request_type === OB11RequestType.Group && event.sub_type === 'add') {
    const groupId = event.group_id + ''
    const contact = contactGroup(groupId)

    createGroupApplyRequest({
      bot,
      time,
      contact,
      rawEvent: event,
      subEvent: 'groupApply',
      eventId: `request:${event.flag}`,
      sender: senderGroup(userId, 'member'),
      srcReply: (elements) => bot.sendMsg(contact, elements),
      content: {
        applierId: userId,
        inviterId: '',
        reason: event.comment,
        flag: event.flag,
        groupId,
      },
    })
    return
  }

  // 邀请Bot加入群聊
  if (event.request_type === OB11RequestType.Group && event.sub_type === 'invite') {
    const groupId = event.group_id + ''
    const contact = contactGroup(groupId)

    createGroupInviteRequest({
      bot,
      time,
      contact,
      rawEvent: event,
      subEvent: 'groupInvite',
      eventId: `request:${event.flag}`,
      sender: senderGroup(userId, 'member'),
      srcReply: (elements) => bot.sendMsg(contact, elements),
      content: {
        inviterId: userId,
        flag: event.flag,
      },
    })
    return
  }

  logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
}
