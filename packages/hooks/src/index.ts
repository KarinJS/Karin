import { empty, emptyEmit } from './empty'
import { hooksMessageEmit, message } from './message'
import { hooksSendMsgEmit, sendMsg } from './sendMsg'
import { eventCall, eventCallEmit } from './eventCall'

export * from './types'

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
 * 触发钩子
 */
export const hooksEmit = {
  empty: emptyEmit,
  eventCall: eventCallEmit,
  message: hooksMessageEmit,
  sendMsg: hooksSendMsgEmit,
}
