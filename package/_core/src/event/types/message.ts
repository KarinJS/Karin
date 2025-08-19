import { MessageResponse } from '@/types'
import { BaseEvent } from './base'

import type {
  MessageEventSub,
  MessageOptions,
  FriendMessageOptions,
  GroupMessageOptions,
  DirectMessageOptions,
  GuildMessageOptions,
  GroupTempMessageOptions,
} from '@/types/event'
import type { Elements } from '@/types/segment'

/**
 * @description 消息事件基类
 * @class FriendMessage
 */
export abstract class MessageBase extends BaseEvent<'message'> {
  #event: 'message'
  #subEvent: MessageEventSub
  #messageId: string
  #messageSeq: number

  /** 消息段 */
  public elements: Elements[]
  /** 消息文本 */
  public msg: string
  /** 别名 */
  public alias: string
  /** 消息日志 */
  public rawMessage: string

  constructor ({
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
    messageId,
    messageSeq,
    elements,
  }: MessageOptions) {
    super({
      subEvent,
      eventId,
      rawEvent,
      time,
      contact,
      sender,
      srcReply,
      bot,
      event: 'message',
    })

    this.#event = 'message'
    this.#subEvent = subEvent
    this.#messageId = messageId
    this.#messageSeq = messageSeq
    this.elements = elements

    this.msg = ''
    this.alias = ''
    this.rawMessage = ''
  }

  /**
   * @deprecated 即将废弃 请使用 `rawMessage`
   */
  get raw_message () {
    return this.rawMessage
  }

  /**
   * @description 消息ID
   * @deprecated 即将废弃 请使用 `messageId`
   */
  get message_id () {
    return this.messageId
  }

  /**
   * @description 消息序列号
   * @deprecated 即将废弃 请使用 `messageSeq`
   */
  get message_seq () {
    return this.messageSeq
  }

  get event () {
    return this.#event
  }

  get subEvent () {
    return this.#subEvent
  }

  get messageId () {
    return this.#messageId
  }

  get messageSeq () {
    return this.#messageSeq
  }

  get at () {
    return this.elements
      .filter(element => element.type === 'at')
      .map(element => element.targetId)
      .filter(Boolean)
  }

  get atBot () {
    return this.at.includes(this.selfId)
  }

  get atAll () {
    return this.at.includes('all')
  }

  get image () {
    return this.elements
      .filter(element => element.type === 'image')
      .map(element => element.file)
      .filter(Boolean)
  }

  get record () {
    const record = this.elements.find(element => element.type === 'record')
    return record ? record.file : ''
  }

  get replyId () {
    const reply = this.elements.find(element => element.type === 'reply')
    return reply ? reply.messageId : ''
  }

  /**
   * @description 引用回复的消息id
   * @deprecated 即将废弃 请使用 `replyId`
   */
  get reply_id () {
    return this.replyId
  }

  /**
   * @description 获取当前事件中 `reply消息段` 的数据
   */
  async getReplyRaw (): Promise<{
    /** 是否成功 */
    status: false
    /** 错误信息 */
    data: unknown
  } | {
    /** 是否成功 */
    status: true
    /** 消息段数据 */
    data: MessageResponse
  }> {
    const id = this.replyId
    if (!id) {
      return {
        status: false,
        data: new Error('当前上下文不存在 reply 消息段'),
      }
    }

    try {
      const data = await this.bot.getMsg(this.contact, id)
      return {
        status: true,
        data,
      }
    } catch (error) {
      return {
        status: false,
        data: error,
      }
    }
  }
}

/**
 * @description 好友消息事件类
 * @class FriendMessage
 */
export class FriendMessage extends MessageBase {
  #subEvent: 'friend'
  #contact: FriendMessageOptions['contact']
  #sender: FriendMessageOptions['sender']

  constructor (options: FriendMessageOptions) {
    super(Object.assign(options, { subEvent: 'friend' as const }))
    this.#subEvent = 'friend'
    this.#contact = options.contact
    this.#sender = options.sender
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get subEvent () {
    return this.#subEvent
  }

  get isPrivate (): true {
    return true
  }

  get isFriend (): true {
    return true
  }

  get isGroup (): false {
    return false
  }

  get isGuild (): false {
    return false
  }

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 群消息事件类
 * @class GroupMessage
 */
export class GroupMessage extends MessageBase {
  #subEvent: 'group'
  #contact: GroupMessageOptions['contact']
  #sender: GroupMessageOptions['sender']

  constructor (options: GroupMessageOptions) {
    super(Object.assign(options, { subEvent: 'group' as const }))
    this.#subEvent = 'group'
    this.#contact = options.contact
    this.#sender = options.sender
  }

  /**
   * @description 群ID
   * @deprecated 即将废弃 请使用 `groupId`
   */
  get group_id () {
    return this.groupId
  }

  /**
   * @description 群ID
   */
  get groupId () {
    return this.contact.peer
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get subEvent () {
    return this.#subEvent
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

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 频道私信消息事件类
 * @class DirectMessage
 */
export class DirectMessage extends MessageBase {
  #subEvent: 'direct'
  #contact: DirectMessageOptions['contact']
  #sender: DirectMessageOptions['sender']
  #srcGuildId: DirectMessageOptions['srcGuildId']

  constructor (options: DirectMessageOptions) {
    super(Object.assign(options, { subEvent: 'direct' as const }))
    this.#subEvent = 'direct'
    this.#sender = options.sender
    this.#contact = options.contact
    this.#srcGuildId = options.srcGuildId
  }

  /** 来源频道id */
  get srcGuildId () {
    return this.#srcGuildId
  }

  get guildId () {
    return this.#contact.peer
  }

  get channelId () {
    return this.#contact.subPeer
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get subEvent () {
    return this.#subEvent
  }

  get isPrivate (): true {
    return true
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

  get isDirect (): true {
    return true
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 频道消息事件类
 * @class GuildMessage
 */
export class GuildMessage extends MessageBase {
  #subEvent: 'guild'
  #contact: GuildMessageOptions['contact']
  #sender: GuildMessageOptions['sender']

  constructor (options: GuildMessageOptions) {
    super(Object.assign(options, { subEvent: 'guild' as const }))
    this.#subEvent = 'guild'
    this.#contact = options.contact
    this.#sender = options.sender
  }

  /**
   * @description 频道ID
   * @deprecated 即将废弃 请使用 `guildId`
   */
  get guild_id () {
    return this.guildId
  }

  /**
   * @description 子频道ID
   * @deprecated 即将废弃 请使用 `channelId`
   */
  get channel_id () {
    return this.channelId
  }

  /**
   * @description 频道ID
   */
  get guildId () {
    return this.#contact.peer
  }

  /**
   * @description 子频道ID
   */
  get channelId () {
    return this.#contact.subPeer
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get subEvent () {
    return this.#subEvent
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

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): false {
    return false
  }
}

/**
 * @description 群临时会话消息事件类
 * @class GroupTempMessage
 */
export class GroupTempMessage extends MessageBase {
  #subEvent: 'groupTemp'
  #contact: GroupTempMessageOptions['contact']
  #sender: GroupTempMessageOptions['sender']

  constructor (options: GroupTempMessageOptions) {
    super(Object.assign(options, { subEvent: 'groupTemp' as const }))
    this.#subEvent = 'groupTemp'
    this.#contact = options.contact
    this.#sender = options.sender
  }

  /**
   * @description 群ID
   * @deprecated 即将废弃 请使用 `groupId`
   */
  get group_id () {
    return this.groupId
  }

  /**
   * @description 群ID
   */
  get groupId () {
    return this.contact.peer
  }

  get contact () {
    return this.#contact
  }

  get sender () {
    return this.#sender
  }

  get subEvent () {
    return this.#subEvent
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

  get isDirect (): false {
    return false
  }

  get isGroupTemp (): true {
    return true
  }
}
