import { Contact } from '@/adapter/contact'
import { MessageEventSubEnum } from '@/event/types/types'
import { BaseMessageEventType, MessageBase, MessageOptions } from '@/event/create/message/base'

/** new 频道私信消息事件所需参数 */
export type DirectMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<'direct'>
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
export class DirectMessage extends MessageBase implements DirectMessageEventType {
  #subEvent: `${MessageEventSubEnum.GUILD_DIRECT}`
  #contact: DirectMessageOptions['contact']
  #srcGuildId: DirectMessageOptions['srcGuildId']

  constructor (options: DirectMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GUILD_DIRECT }))

    this.#subEvent = MessageEventSubEnum.GUILD_DIRECT
    this.#contact = options.contact
    this.#srcGuildId = options.srcGuildId
    // TODO: sender
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

/**
 * @description 创建频道私信消息事件实例
 * @param options 频道私信消息事件所需参数
 */
export const createDirectMessage = (options: Omit<DirectMessageOptions, 'subEvent'>): DirectMessage => {
  return new DirectMessage({ ...options, subEvent: MessageEventSubEnum.GUILD_DIRECT })
}
