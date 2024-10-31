import { MessageEventSubEnum } from '../../types/types'
import { Contact, Scene } from '@/adapter/contact'
import { BaseMessageEventType, MessageBase, MessageOptions } from '.'

/** new 频道消息事件所需参数 */
export type GuildMessageOptions = MessageOptions & {
  /** 事件联系人信息 */
  contact: Contact<Scene.GUILD>
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
}

/**
 * @description 频道消息事件类
 * @class GuildMessage
 */
export class GuildMessage extends MessageBase implements GuildMessageEventType {
  #subEvent: `${MessageEventSubEnum.GUILD_MESSAGE}`
  #contact: GuildMessageOptions['contact']

  constructor (options: GuildMessageOptions) {
    super(Object.assign(options, { subEvent: MessageEventSubEnum.GUILD_MESSAGE }))

    this.#subEvent = MessageEventSubEnum.GUILD_MESSAGE
    this.#contact = options.contact
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
}
