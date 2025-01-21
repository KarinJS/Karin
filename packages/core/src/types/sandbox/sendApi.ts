import type { Elements } from '../segment'

export interface Sandbox {
  sendMsg: {
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
  },
  /** 撤回消息 */
  recallMsg: {
    /** 消息id */
    messageId: string
  },
  /** 初始化完成 */
  init: {
    /** 机器人id */
    id: string
    /** 机器人名称 */
    name: string
    /** 机器人头像 */
    avatar: string
  }
}
