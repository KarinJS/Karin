import { karin } from '@/karin'
import { AdapterOneBot } from './base'
import { AdapterConvertKarin } from './convert'
import { createFriendMessage, createGroupMessage, createPrivateRecallNotice } from '@/event'
import { OB11NoticeType, type OB11Message, type OB11Notice, type OB11Request } from './types/event'

/**
 * 创建消息事件
 * @param event onebot11消息事件
 * @param bot 标准api实例
 */
export const createMessage = (event: OB11Message, bot: AdapterOneBot) => {
  if (event.message_type === 'private') {
    const userId = event.sender.user_id + ''
    const contact = karin.contactFriend(userId)
    const sender = karin.friendSender(userId, event.sender.nickname, event.sender.sex, event.sender.age)

    createFriendMessage({
      bot,
      contact,
      elements: AdapterConvertKarin(event.message),
      eventId: `message:${event.message_id}`,
      messageId: event.message_id + '',
      messageSeq: event.message_id,
      rawEvent: event,
      selfId: event.self_id + '',
      sender,
      time: event.time,
      subEvent: 'friend',
      userId,
      srcReply: (elements) => bot.sendMsg(contact, elements),
    })
    return
  }

  /** tips: go-cqhttp这里会多一个guild类型 一起判断得了... */
  if (event.message_type === 'group') {
    const groupId = event.group_id + ''
    const userId = event.sender.user_id + ''
    const { nickname, role, sex, age, card, area, level, title } = event.sender

    const contact = karin.contactGroup(groupId)
    const sender = karin.groupSender(userId, nickname, role, sex, age, card, area, level, title)
    createGroupMessage({
      bot,
      contact,
      elements: AdapterConvertKarin(event.message),
      eventId: `message:${event.message_id}`,
      messageId: event.message_id + '',
      messageSeq: event.message_id,
      rawEvent: event,
      selfId: event.self_id + '',
      sender,
      time: event.time,
      subEvent: 'group',
      userId,
      srcReply: (elements) => bot.sendMsg(contact, elements),
    })
    return
  }

  logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
}

/**
 * 创建通知事件
 * @param event onebot11通知事件
 * @param bot 标准api实例
 */
export const createNotice = (event: OB11Notice, bot: AdapterOneBot) => {
  if (event.notice_type === OB11NoticeType.FriendRecall) {
    const userId = event.user_id + ''
    const messageId = event.message_id + ''
    createPrivateRecallNotice({
      bot,
      eventId: `notice:${userId}.${event.time}`,
      rawEvent: event,
      selfId: event.self_id + '',
      time: event.time,
      userId,
      srcReply: (elements) => bot.sendMsg(karin.contactFriend(userId), elements),
      contact: karin.contactFriend(userId),
      sender: karin.friendSender(userId, ''),
      subEvent: 'privateRecall',
    }, {
      messageId,
      operatorId: userId,
      tips: '',
    })
  }
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
