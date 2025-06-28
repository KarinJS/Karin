/**
 * 上报事件类型枚举
 */
export enum EventPostType {
  /** 消息 */
  Message = 'message',
  /** 请求 */
  Request = 'request',
  /** 通知 */
  Notice = 'notice',
  /** 元事件 */
  MetaEvent = 'meta_event',
  /** GoCQ拓展: Bot自身上报 */
  MessageSent = 'message_sent',
}

/**
 * 所有事件都继承自这个类型
 */
export interface EventBase {
  /** 事件发生的unix时间戳 */
  time: number
  /** 收到事件的机器人 QQ 号 */
  self_id: number
  /** 表示该上报的类型, 消息, 消息发送, 请求, 通知, 或元事件 */
  post_type: EventPostType
}
