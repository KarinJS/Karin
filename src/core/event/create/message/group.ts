import { MessageEventSubEnum } from '../../types/types'
import { Contact } from '@/adapter/contact'
import { BaseMessageEventType, MessageBase, MessageOptions } from './base'
import { GroupHandler } from '@/event/handler/message/group'
import { GroupSender } from '@/adapter/sender'

/** new 群消息事件所需参数 */
export interface GroupMessageOptions extends MessageOptions {
  contact: Contact<'group'>
  sender: GroupSender
}

/** 群消息事件定义 */
export interface GroupMessageEventType extends BaseMessageEventType {
  /** 群ID */
  groupId: string
  contact: GroupMessageOptions['contact']
  subEvent: `${MessageEventSubEnum.GROUP_MESSAGE}`
  sender: GroupSender
}

/**
 * @description 群消息事件类
 * @class GroupMessage
 */
export class GroupMessage extends MessageBase implements GroupMessageEventType {
  #sender: GroupSender
  #contact: GroupMessageOptions['contact']
  #subEvent: `${MessageEventSubEnum.GROUP_MESSAGE}`

  constructor (options: GroupMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GROUP_MESSAGE }))
    this.#sender = options.sender
    this.#contact = options.contact
    this.#subEvent = MessageEventSubEnum.GROUP_MESSAGE
  }

  /**
   * @description 群ID
   * @deprecated 即将废弃 请使用 `groupId`
   */
  get group_id () {
    return this.groupId
  }

  /**
   * @deprecated 即将废弃 请使用 `rawMessage`
   */
  get raw_message () {
    return this.rawMessage
  }

  get contact () {
    return this.#contact
  }

  get groupId () {
    return this.contact.peer
  }

  get subEvent () {
    return this.#subEvent
  }

  get sender () {
    return this.#sender
  }
}

/**
 * @description 创建群消息事件实例
 * @param options 群消息事件所需参数
 */
export const createGroupMessage = (options: GroupMessageOptions) => {
  const event = new GroupMessage(options)
  return new GroupHandler(event).init()
}
