import { karin } from '@/karin'
import { AdapterConvertKarin } from '../core/convert'
import { createFriendMessage, createGroupMessage } from '@/event'
import type { AdapterOneBot } from '../core/base'
import type { OB11Message } from '../types/event'

/**
 * 创建消息事件
 * @param event onebot11消息事件
 * @param bot 标准api实例
 */
export const createMessage = (event: OB11Message, bot: AdapterOneBot) => {
  const time = event.time
  const selfId = event.self_id + ''
  if (event.message_type === 'private') {
    const userId = event.sender.user_id + ''
    const contact = karin.contactFriend(userId)
    const sender = karin.friendSender(userId, event.sender.nickname, event.sender.sex, event.sender.age)

    createFriendMessage({
      bot,
      selfId,
      time,
      contact,
      sender,
      userId,
      rawEvent: event,
      messageId: event.message_id + '',
      messageSeq: event.message_id,
      eventId: `message:${event.message_id}`,
      elements: AdapterConvertKarin(event.message),
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
      selfId,
      sender,
      time,
      userId,
      srcReply: (elements) => bot.sendMsg(contact, elements),
    })
    return
  }

  logger.warn(`[AdapterOneBot] 收到未知事件: ${JSON.stringify(event)}`)
}
