import { MessageEventSubEnum } from '../base'
import { Contact, Scene } from '@/adapter/contact'
import { BaseMessageEventType, Message, MessageOptions } from '.'

/** new 好友消息事件所需参数 */
export type FriendMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<Scene.FRIEND>
}

/** 好友消息事件定义 */
export interface FriendMessageEventType extends BaseMessageEventType {
  contact: FriendMessageOptions['contact']
  /** 事件子类型 */
  subEvent: `${MessageEventSubEnum.FRIEND_MESSAGE}`
}

/**
 * @description 好友消息事件类
 * @class FriendMessage
 */
export class FriendMessage extends Message implements FriendMessageEventType {
  #contact: FriendMessageOptions['contact']
  #subEvent: `${MessageEventSubEnum.FRIEND_MESSAGE}`

  constructor (options: FriendMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.FRIEND_MESSAGE }))
    this.#contact = options.contact
    this.#subEvent = MessageEventSubEnum.FRIEND_MESSAGE
  }

  get contact () {
    return this.#contact
  }

  get subEvent () {
    return this.#subEvent
  }
}
