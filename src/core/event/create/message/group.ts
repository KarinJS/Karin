import { GroupSender } from '@/adapter/sender'
import { Contact } from '@/adapter/contact'
import { MessageEventSubEnum } from '@/event/types/types'
import { GroupMessageHandler } from '@/event/handler/message/group'
import { BaseMessageEventType, MessageBase, MessageOptions } from '@/event/create/message/base'

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

  get isPrivate (): false {
    return false
  }

  get isFriend (): false {
    return false
  }

  get isGroup (): true {
    return true
  }

  get isGuild (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }

  get isDirect (): false {
    return false
  }
}

/**
 * @description 创建群消息事件实例
 * @param options 群消息事件所需参数
 */
export const createGroupMessage = (options: Omit<GroupMessageOptions, 'subEvent'>) => {
  const event = new GroupMessage({ ...options, subEvent: MessageEventSubEnum.GROUP_MESSAGE })
  return new GroupMessageHandler(event).init()
}
