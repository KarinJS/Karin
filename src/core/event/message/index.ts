import { ElementTypes, ElementTypeEnum } from '@/adapter/segment'
import {
  BaseEvent,
  BaseEventOptions,
  BaseEventType,
  EventParentEnum,
  MessageEventSubEnum,
} from '../base'

/** 消息事件基类定义 */
export interface BaseMessageEventType extends BaseEventType {
  /** 事件类型 */
  event: `${EventParentEnum.MESSAGE}`
  /** 事件子类型 */
  subEvent: `${MessageEventSubEnum}`
  /** 消息ID */
  messageId: string
  /** 消息序列号 */
  messageSeq: number
  /** 消息体元素 */
  elements: Array<ElementTypes>

  /** 序列化的纯文本 消息事件专属 */
  msg: string
  /** 引用回复的消息id */
  replyId: string
  /** bot别名 */
  alias: string
  /** 语音url */
  record: string
  /** 是否atBot */
  atBot: boolean
  /** 是否atAll */
  atAll: boolean
  /** at的用户列表 不会出现Bot自身的at */
  at: string[]
  /** 消息图片 */
  image: string[]
}

/** new 消息事件所需参数 */
export type MessageOptions = Omit<BaseEventOptions, 'event'> & {
  messageId: BaseMessageEventType['messageId']
  messageSeq: BaseMessageEventType['messageSeq']
  elements: BaseMessageEventType['elements']
  subEvent: BaseMessageEventType['subEvent']
}

/**
 * @description 消息事件类
 * @class FriendMessage
 */
export class Message extends BaseEvent implements BaseMessageEventType {
  /** 事件子类型 */
  #subEvent: BaseMessageEventType['subEvent']
  /** 消息ID */
  #messageId: BaseMessageEventType['messageId']
  /** 消息序列号 */
  #messageSeq: BaseMessageEventType['messageSeq']
  /** 消息体元素 */
  public elements: BaseMessageEventType['elements']
  /** 序列化的纯文本 消息事件专属 */
  public msg: BaseMessageEventType['msg']
  /** bot别名 */
  public alias: BaseMessageEventType['alias']

  constructor (options: MessageOptions) {
    super(Object.assign(options, { event: EventParentEnum.MESSAGE }))
    this.#subEvent = options.subEvent
    this.#messageId = options.messageId
    this.#messageSeq = options.messageSeq
    this.elements = options.elements

    this.msg = ''
    this.alias = ''
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
    return `${EventParentEnum.MESSAGE}` as const
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
      .filter(element => element.type === ElementTypeEnum.AT)
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
      .filter(element => element.type === ElementTypeEnum.IMAGE)
      .map(element => element.file)
      .filter(Boolean)
  }

  get record () {
    const record = this.elements.find(element => element.type === ElementTypeEnum.RECORD)
    return record ? record.file : ''
  }

  get replyId () {
    const reply = this.elements.find(element => element.type === ElementTypeEnum.REPLY)
    return reply ? reply.messageId : ''
  }

  /**
   * @description 引用回复的消息id
   * @deprecated 即将废弃 请使用 `replyId`
   */
  get reply_id () {
    return this.replyId
  }
}
