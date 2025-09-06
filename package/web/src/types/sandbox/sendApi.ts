import type { SandboxEvent } from './event'

export interface SandboxWsEvent {
  sendMsg: SandboxEvent,
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
