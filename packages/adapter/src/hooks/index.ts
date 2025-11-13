import { empty, EmptyHooks } from './implements/empty'
import { message, MessageHooks } from './implements/message'
import { sendMsg, SendMsgHooks } from './implements/sendMsg'
import { eventCall, EventCallHooks } from './implements/eventCall'

export * from './types'
export { HookManager, HookOptions as HookManagerOptions, HookItem, isThenable } from './core/manager'

/**
 * 消息钩子系统类型
 */
export type HooksType = {
  /** 消息hook */
  message: typeof message
  /** 发送消息钩子 */
  sendMsg: typeof sendMsg
  /** 未找到匹配插件钩子 */
  empty: typeof empty
  /** 事件调用插件钩子 */
  eventCall: typeof eventCall
}

/**
 * 钩子系统
 */
export const hooks: HooksType = {
  message,
  sendMsg,
  empty,
  eventCall,
}

/**
 * 内部钩子触发器（框架内部使用）
 */
export const HooksInternal = {
  /** 消息钩子触发器 */
  Message: MessageHooks,
  /** 发送消息钩子触发器 */
  SendMsg: SendMsgHooks,
  /** 空插件钩子触发器 */
  Empty: EmptyHooks,
  /** 事件调用钩子触发器 */
  EventCall: EventCallHooks,
}
