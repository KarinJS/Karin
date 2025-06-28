import { EventPostType } from './event'
import type { MessagePrivateEvent, MessageGroupEvent } from './message'

/**
 * 私聊消息发送事件类型
 */
export interface MessageSentPrivateEvent extends Omit<MessagePrivateEvent, 'post_type'> {
  /** 消息发送事件 */
  post_type: EventPostType.MessageSent
}

/**
 * 群消息发送事件类型
 */
export interface MessageSentGroupEvent extends Omit<MessageGroupEvent, 'post_type'> {
  /** 消息发送事件 */
  post_type: EventPostType.MessageSent
}

/** OneBot 消息发送事件类型 */
export type OneBotMessageSentEvent = MessageSentPrivateEvent | MessageSentGroupEvent
