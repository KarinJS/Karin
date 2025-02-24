import { message } from './messaeg'
import { sendMsg } from './sendMsg'

/**
 * 消息钩子系统
 */
export const hooks = {
  /** 消息hook */
  message,
  /** 发送消息钩子 */
  sendMsg,
}
