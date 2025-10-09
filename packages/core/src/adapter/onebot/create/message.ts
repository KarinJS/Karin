import { AdapterConvertKarin } from '@/adapter/onebot/core/convert'
import { createFriendMessage, createGroupMessage, createGroupTempMessage } from '@/event/create'
import { contactFriend, contactGroup, contactGroupTemp, senderFriend, senderGroup } from '@/event'
import type { AdapterOneBot } from '@/adapter/onebot/core/core'
import type { OneBotMessageEvent, OneBotType } from '@karinjs/onebot'
import type { Role } from '@/types'

/**
 * 创建消息事件
 * @param event onebot11消息事件
 * @param bot 标准api实例
 */
export const createMessage = async (event: OneBotMessageEvent, bot: AdapterOneBot<OneBotType>) => {
  const time = event.time
  if (event.message_type === 'private') {
    if (event.sub_type === 'friend' || event.sub_type === 'other' || event.sub_type === 'normal') {
      const userId = event.sender.user_id + ''
      const contact = contactFriend(userId)
      const sender = senderFriend(userId,
        event.sender.nickname,
        event.sender.sex,
        event.sender.age
      )

      createFriendMessage({
        bot,
        time,
        contact,
        sender,
        rawEvent: event,
        messageId: event.message_id + '',
        messageSeq: event.message_id,
        eventId: `message:${event.message_id}`,
        elements: await AdapterConvertKarin(event.message, bot),
        srcReply: (elements) => bot.sendMsg(contact, elements),
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
        bot,
        contact,
        elements: await AdapterConvertKarin(event.message, bot),
        eventId: `message:${event.message_id}`,
        messageId: event.message_id + '',
        messageSeq: event.message_id,
        rawEvent: event,
        sender,
        time,
        srcReply: (elements) => bot.sendMsg(contact, elements),
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
      bot,
      contact,
      elements: await AdapterConvertKarin(event.message, bot),
      eventId: `message:${event.message_id}`,
      messageId: event.message_id + '',
      messageSeq: event.message_id,
      rawEvent: event,
      sender,
      time,
      srcReply: (elements) => bot.sendMsg(contact, elements),
    })
    return
  }

  /** tips: go-cqhttp这里会多一个guild类型 一起判断得了... */
  logger.warn(`[OneBot] 收到未知事件: ${JSON.stringify(event)}`)
}
