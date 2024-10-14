import { MessageEventSubEnum } from '../base'
import { Contact, Scene } from '@/adapter/contact'
import { BaseMessageEventType, Message, MessageOptions } from '.'

/** new 频道私信消息事件所需参数 */
export type DirectMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<Scene.GUILD_DIRECT>
  /** 来源频道ID */
  srcGuildId: string
}

/** 频道私信消息事件定义 */
export interface DirectMessageEventType extends BaseMessageEventType {
  contact: DirectMessageOptions['contact']
  /** 事件子类型 */
  subEvent: `${MessageEventSubEnum.GUILD_DIRECT}`
  /** 频道ID */
  guildId: string
  /** 子频道ID */
  channelId: string
}

/**
 * @description 频道私信消息事件类
 * @class DirectMessage
 */
export class DirectMessage extends Message implements DirectMessageEventType {
  #subEvent: `${MessageEventSubEnum.GUILD_DIRECT}`
  #contact: DirectMessageOptions['contact']
  #srcGuildId: DirectMessageOptions['srcGuildId']

  constructor (options: DirectMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GUILD_DIRECT }))

    this.#subEvent = MessageEventSubEnum.GUILD_DIRECT
    this.#contact = options.contact
    this.#srcGuildId = options.srcGuildId
  }

  get contact () {
    return this.#contact
  }

  get guildId () {
    return this.#srcGuildId
  }

  get channelId () {
    return this.#contact.subPeer
  }

  get subEvent () {
    return this.#subEvent
  }
}
