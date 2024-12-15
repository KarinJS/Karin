import { Contact } from '@/adapter/contact'
import { MessageEventSubEnum } from '@/event/types/types'
import { BaseMessageEventType, MessageBase, MessageOptions } from '@/event/create/message/base'
import type { DirectSender } from '@/adapter'
import { DirectHandler } from '@/event/handler/message/direct'

/** new 频道私信消息事件所需参数 */
export type DirectMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<'direct'>
  /** 来源频道ID */
  srcGuildId: string
  sender: DirectSender
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
  /** 发送者信息 */
  sender: DirectSender
}

/**
 * @description 频道私信消息事件类
 * @class DirectMessage
 */
export class DirectMessage extends MessageBase implements DirectMessageEventType {
  #sender: DirectSender
  #subEvent: `${MessageEventSubEnum.GUILD_DIRECT}`
  #contact: DirectMessageOptions['contact']
  #srcGuildId: DirectMessageOptions['srcGuildId']

  constructor (options: DirectMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GUILD_DIRECT }))

    this.#sender = options.sender
    this.#contact = options.contact
    this.#srcGuildId = options.srcGuildId
    this.#subEvent = MessageEventSubEnum.GUILD_DIRECT
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

  get sender () {
    return this.#sender
  }

  get isPrivate (): false {
    return false
  }

  get isFriend (): false {
    return false
  }

  get isGroup (): false {
    return false
  }

  get isGuild (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }

  get isDirect (): true {
    return true
  }
}

/**
 * @description 创建频道私信消息事件实例
 * @param options 频道私信消息事件所需参数
 */
export const createDirectMessage = (options: Omit<DirectMessageOptions, 'subEvent'>) => {
  const event = new DirectMessage({ ...options, subEvent: MessageEventSubEnum.GUILD_DIRECT })
  return new DirectHandler(event).init()
}
