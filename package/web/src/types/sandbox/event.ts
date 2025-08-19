import type { Elements } from '../segment'

interface BaseEvent {
  /** 事件类型 */
  type: 'friend' | 'group'
  /** 机器人id */
  selfId: string
  /** 发送者 */
  sender: {
    /** 发送者id */
    id: string
    /** 发送者名称 */
    name: string
  }
  /** 消息段 */
  elements: Elements[]
  /** 消息索引 */
  seq: number
  /** 消息id */
  messageId: string
  /** 消息时间 */
  time: number
}

/** 沙盒群事件 */
export interface SandboxGroupEvent extends BaseEvent {
  type: 'group'
  /** 群id */
  groupId: string
  /** 群名称 */
  groupName: string
  /** 发送者 */
  sender: {
    /** 发送者id */
    id: string
    /** 发送者名称 */
    name: string
    /** 发送者类型 */
    role: 'member' | 'admin' | 'owner'
  }
}

/** 沙盒好友事件 */
export interface SandboxFriendEvent extends BaseEvent {
  type: 'friend'
}

/** 沙盒事件 */
export type SandboxEvent = SandboxFriendEvent | SandboxGroupEvent
