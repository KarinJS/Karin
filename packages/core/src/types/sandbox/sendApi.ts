import type { AccountInfo } from './account'
import type { FriendMessageOptions, GroupMessageOptions } from '../event'

/** 发送好友消息 */
export type SandboxSendSendFriendMsg = Omit<FriendMessageOptions, 'bot' | 'srcReply'> & { selfId: string }

/** 发送群消息 */
export type SandboxSendSendGroupMsg = Omit<GroupMessageOptions, 'bot' | 'srcReply'> & { selfId: string }

/** 发送消息 */
export type SandboxSendSendMsg = SandboxSendSendFriendMsg | SandboxSendSendGroupMsg

/** 沙盒API */
export interface SandboxSendApi {
  /** 发送消息 */
  sendMsg: SandboxSendSendMsg
  /** 撤回消息 */
  recallMsg: {

    /** 消息id */
    messageId: string
  }
  /** 初始化完成 */
  init: AccountInfo
}
