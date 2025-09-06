import { dispatchNoticeEvent, dispatchRequestEvent } from './notice_request'
import { dispatchGroupMessageEvent, dispatchPrivateMessageEvent } from './message'

/**
 * 事件分发工具
 */
export const dispatch = {
  /**
   * 消息事件分发
   */
  message: {
    /**
     * 单人场景消息事件分发
     */
    private: dispatchPrivateMessageEvent,
    /**
     * 多人场景消息事件分发
     */
    groups: dispatchGroupMessageEvent,
  },
  /**
   * 通知事件分发
   */
  notice: dispatchNoticeEvent,
  /**
   * 请求事件分发
   */
  request: dispatchRequestEvent,
}
