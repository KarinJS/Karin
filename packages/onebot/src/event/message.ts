import { EventPostType } from './event'
import type { EventBase } from './event'
import type { OneBotMessage } from '../message'
import type { SenderGroup, SenderPrivate } from './sender'

/**
 * 消息类型枚举
 */
export enum MessageType {
  /** 私聊消息 */
  Private = 'private',
  /** 群消息 */
  Group = 'group',
}

/**
 * 私聊消息子类型枚举
 */
export enum MessageSubType {
  /** 好友消息 */
  Friend = 'friend',
  /** 群临时会话 */
  Group = 'group',
  /** 其他 */
  Other = 'other',
  /** 普通消息 (非标准,兼容某些实现) */
  Normal = 'normal',
}

/**
 * 私聊消息事件类型
 */
export interface MessagePrivateEvent extends EventBase {
  /** 消息事件 */
  post_type: EventPostType.Message
  /** 消息类型 */
  message_type: MessageType.Private
  /** 消息子类型 */
  sub_type: MessageSubType.Friend | MessageSubType.Other | MessageSubType.Normal
  /** 消息 ID */
  message_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** 消息内容 */
  message: OneBotMessage[]
  /** 原始消息内容 */
  raw_message: string
  /** 字体 */
  font: number
  /** 发送人信息 */
  sender: SenderPrivate
}

/**
 * 群消息事件类型
 */
export interface MessageGroupEvent extends EventBase {
  /** 消息事件 */
  post_type: EventPostType.Message
  /** 消息类型 */
  message_type: MessageType.Group
  /** 消息子类型 匿名没有了`(直接写死)` */
  sub_type: 'normal'
  /** 消息 ID */
  message_id: number
  /** 群号 */
  group_id: number
  /** 发送者 QQ 号 */
  user_id: number
  /** @deprecated 匿名信息 */
  anonymous: Record<string, never>
  /** 消息内容 */
  message: OneBotMessage[]
  /** 原始消息内容 */
  raw_message: string
  /** 字体 */
  font: number
  /** 发送人信息 */
  sender: SenderGroup
}

/**
 * 群临时会话事件类型
 */
export interface MessageTempEvent extends Omit<MessagePrivateEvent, 'sub_type'> {
  sub_type: MessageSubType.Group
  /** 发送人信息 */
  sender: SenderPrivate & {
    /** 群号 */
    group_id: number
  }
}

/** OneBot 消息事件类型 */
export type OneBotMessageEvent = MessagePrivateEvent | MessageGroupEvent | MessageTempEvent
