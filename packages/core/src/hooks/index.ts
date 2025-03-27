import { empty } from './empty'
import { message } from './messaeg'
import { sendMsg } from './sendMsg'
import { eventCall } from './eventCall'

/**
 * 消息钩子系统
 */
export const hooks = {
  /** 消息hook */
  message,
  /** 发送消息钩子 */
  sendMsg,
  /** 未找到匹配插件钩子 */
  empty,
  /** 事件调用插件钩子 */
  eventCall,
}
