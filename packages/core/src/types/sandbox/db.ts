import type { Elements } from '../segment'

/**
 * 存档消息记录
 */
export interface SandboxMsgRecord {
  /** 消息类型 */
  type: 'friend' | 'group'
  /** 目标id */
  targetId: string
  /** 消息段 */
  elements: Elements[]
  /** 消息索引 */
  seq: number
  /** 消息id */
  messageId: string
  /** 消息时间 */
  time: number
  /** 消息状态 正常/撤回 */
  status: 'normal' | 'recall'
}
