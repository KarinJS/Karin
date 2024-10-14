import { MessageEventSubEnum } from '../base'
import { Contact, Scene } from '@/adapter/contact'
import { BaseMessageEventType, Message, MessageOptions } from '.'

/** new 群消息事件所需参数 */
export type GroupMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<Scene.GROUP>
}

/** 群消息事件定义 */
export interface GroupMessageEventType extends BaseMessageEventType {
  contact: GroupMessageOptions['contact']
  /** 事件子类型 */
  subEvent: `${MessageEventSubEnum.GROUP_MESSAGE}`
  /** 群ID */
  groupId: string
}

/**
 * @description 群消息事件类
 * @class GroupMessage
 */
export class GroupMessage extends Message implements GroupMessageEventType {
  #contact: GroupMessageOptions['contact']
  #subEvent: `${MessageEventSubEnum.GROUP_MESSAGE}`

  constructor (options: GroupMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GROUP_MESSAGE }))
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

  get contact () {
    return this.#contact
  }

  get groupId () {
    return this.contact.peer
  }

  get subEvent () {
    return this.#subEvent
  }
}
