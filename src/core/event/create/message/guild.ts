import { MessageEventSubEnum } from '@/event/types/types'
import type { Contact } from '@/adapter/contact'
import type { GuildSender } from '@/adapter/sender'
import {
  BaseMessageEventType,
  MessageBase,
  MessageOptions,
} from '@/event/create/message/base'
import { GuildMessageHandler } from '@/event/handler/message/guild'

/** new 频道消息事件所需参数 */
export type GuildMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<'guild'>
  /** 发送者信息 */
  sender: GuildSender
}

/** 频道消息事件定义 */
export interface GuildMessageEventType extends BaseMessageEventType {
  contact: GuildMessageOptions['contact']
  /** 事件子类型 */
  subEvent: `${MessageEventSubEnum.GUILD_MESSAGE}`
  /** 频道ID */
  guildId: string
  /** 子频道ID */
  channelId: string
  /** 发送者信息 */
  sender: GuildSender
}

/**
 * @description 频道消息事件类
 * @class GuildMessage
 */
export class GuildMessage extends MessageBase implements GuildMessageEventType {
  #sender: GuildSender
  #contact: GuildMessageOptions['contact']
  #subEvent: `${MessageEventSubEnum.GUILD_MESSAGE}`

  constructor (options: GuildMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GUILD_MESSAGE }))

    this.#sender = options.sender
    this.#contact = options.contact
    this.#subEvent = MessageEventSubEnum.GUILD_MESSAGE
  }

  get contact () {
    return this.#contact
  }

  get guildId () {
    return this.#contact.peer
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

  get isGuild (): true {
    return true
  }

  get isGroupTemp (): false {
    return false
  }

  get isDirect (): false {
    return false
  }
}

/**
 * @description 创建频道消息事件实例
 * @param options 频道消息事件所需参数
 */
export const createGuildMessage = (options: Omit<GuildMessageOptions, 'subEvent'>) => {
  const event = new GuildMessage({ ...options, subEvent: MessageEventSubEnum.GUILD_MESSAGE })
  return new GuildMessageHandler(event).init()
}
