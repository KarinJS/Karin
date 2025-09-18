import type {
  Echo,
  OneBotWsEvent,
  OneBotMessageEvent,
  OneBotMessageSentEvent,
  OneBotNoticeEvent,
  OneBotRequestEvent,
  OneBotMetaEvent,
} from '../../event'

/** OneBot 错误类型 */
export enum OneBotErrorType {
  /** 常规错误 */
  ERROR = 1001,

  /** ws、http客户端独有: 初始化失败，正在尝试重连`(http是心跳)` */
  CONNECTION_FAILED = 2002,
  /** ws客户端独有: 初始化失败，重连关闭 */
  RECONNECTING = 2003,
  /** ws、http客户端独有: 初始化失败，重连达到上限`(http是心跳)` */
  RECONNECT_FAILED = 2004,

  /** ws服务端独有: 鉴权失败 */
  AUTH_FAILED = 3001,
  /** ws服务端独有: Authorization头格式错误 */
  AUTH_INVALID_FORMAT = 3002,
}

/** OneBot 事件类型 */
export interface OneBotEventMap {
  /** 连接成功 */
  open: [void]
  /** 错误 */
  error: [Error]
  /** 关闭 */
  close: [number, Buffer, Error?]

  /** 收到API请求 */
  sendApi: [{
    /** 请求ID */
    echo: string
    /** API动作 */
    action: string
    /** API参数 */
    params: object
    /** JSON序列化之后的参数 */
    request: string
  }]
  /** 收到API响应 */
  response: [{
    /** 请求ID */
    echo: string
    /** API动作 */
    action: string
    /** API参数 */
    params: object
    /** JSON序列化之后的参数 */
    request: string
    /** 响应 */
    data: object
  }]

  /** 收到事件上报 */
  event: [OneBotWsEvent]
  /** 收到消息事件上报 */
  message: [OneBotMessageEvent]
  /** 收到Bot自身消息上报 */
  message_sent: [OneBotMessageSentEvent]
  /** 收到通知事件上报 */
  notice: [OneBotNoticeEvent]
  /** 收到请求事件上报 */
  request: [OneBotRequestEvent]
  /** 收到元事件上报 */
  metaEvent: [OneBotMetaEvent]

  [key: `echo:${bigint}`]: [Echo]
  [key: `echo:${string}`]: [Echo]
}
