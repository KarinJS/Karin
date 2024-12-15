import { FriendHandler } from '@/event/handler/message/friend'
import { MessageEventSubEnum } from '@/event/types/types'
import { BaseMessageEventType, MessageBase, MessageOptions } from '@/event/create/message/base'
import type { Contact } from '@/adapter/contact'
import type { FriendSender } from '@/adapter/sender'

/** new 好友消息事件所需参数 */
export interface FriendMessageOptions extends MessageOptions {
  contact: Contact<'friend'>
  sender: FriendSender
}

/** 好友消息事件定义 */
export interface FriendMessageEventType extends BaseMessageEventType {
  contact: FriendMessageOptions['contact']
  subEvent: `${MessageEventSubEnum.FRIEND_MESSAGE}`
  sender: FriendSender
}

/**
 * @description 好友消息事件类
 * @class FriendMessage
 */
export class FriendMessage extends MessageBase implements FriendMessageEventType {
  #sender: FriendSender
  #contact: FriendMessageOptions['contact']
  #subEvent: `${MessageEventSubEnum.FRIEND_MESSAGE}`

  constructor (options: FriendMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.FRIEND_MESSAGE }))
    this.#sender = options.sender
    this.#contact = options.contact
    this.#subEvent = MessageEventSubEnum.FRIEND_MESSAGE
  }

  get contact () {
    return this.#contact
  }

  get subEvent () {
    return this.#subEvent
  }

  get sender () {
    return this.#sender
  }
}

/**
 * @description 创建好友消息事件
 * @param options 好友消息事件所需参数
 */
export const createFriendMessage = (options: Omit<FriendMessageOptions, 'subEvent'>) => {
  const event = new FriendMessage({ ...options, subEvent: MessageEventSubEnum.FRIEND_MESSAGE })
  return new FriendHandler(event).init()
}
