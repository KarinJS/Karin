import type {
  Echo,
  OneBotWsEvent,
  OneBotMessageEvent,
  OneBotMessageSentEvent,
  OneBotNoticeEvent,
  OneBotRequestEvent,
  OneBotMetaEvent,
} from '../event'

/** OneBot 错误类型 */
export enum OneBotErrorType {
  /** 常规错误 */
  ERROR = 1001,

  /** ws客户端独有: 初始化失败，正在尝试重连 */
  CONNECTION_FAILED = 2002,
  /** ws客户端独有: 初始化失败，重连关闭 */
  RECONNECTING = 2003,
  /** ws客户端独有: 初始化失败，重连达到上限 */
  RECONNECT_FAILED = 2004,

  /** ws服务端独有: 鉴权失败 */
  AUTH_FAILED = 3001,
  /** ws服务端独有: Authorization头格式错误 */
  AUTH_INVALID_FORMAT = 3002,
}

/** OneBot 关闭类型 */
export enum OneBotCloseType {
  /** 常规关闭 */
  ERROR = 1001,
  /** 主动关闭 */
  MANUAL_CLOSE = 1002,

  /** ws客户端独有:重连上限 */
  MAX_RETRIES = 2001,
  /** ws客户端独有: 服务端关闭 */
  SERVER_CLOSE = 2002,

  /** http客户端独有: 心跳失败 */
  HEARTBEAT_FAILED = 3001,
  /** http客户端独有: 心跳失败次数超过最大重试次数 */
  HEARTBEAT_FAILED_MAX_RETRIES = 3002,
}

/** OneBot 事件类型 */
export enum OneBotEventKey {
  /** 连接成功 */
  OPEN = 'open',
  /** 错误 */
  ERROR = 'error',
  /** 关闭 */
  CLOSE = 'close',

  /** 收到API请求 */
  SEND_API = 'sendApi',
  /** 收到API响应 */
  RESPONSE = 'response',

  /** 收到事件上报 */
  EVENT = 'event',
  /** 收到消息事件上报 */
  MESSAGE = 'message',
  /** 收到通知事件上报 */
  NOTICE = 'notice',
  /** 收到请求事件上报 */
  REQUEST = 'request',
  /** 收到元事件上报 */
  META_EVENT = 'meta_event',
  /** 收到Bot自身消息上报 */
  MESSAGE_SENT = 'message_sent',
}

/** OneBot 事件类型 */
export interface OneBotOnEvent {
  /** 连接成功 */
  [OneBotEventKey.OPEN]: void
  /** 错误 */
  [OneBotEventKey.ERROR]: {
    /** 错误 */
    error: Error
    /** 错误类型 */
    type: Exclude<OneBotErrorType, OneBotErrorType.CONNECTION_FAILED | OneBotErrorType.RECONNECT_FAILED>
  } | {
    /** 错误 */
    error: Error
    /** 错误类型 */
    type: OneBotErrorType.CONNECTION_FAILED
    /** 重连次数 */
    reconnectAttempt: number
    /** 重试间隔 */
    reconnectInterval: number
    /** 最大重试次数 */
    maxReconnectAttempt: number
  } | {
    /** 错误 */
    error: Error
    /** 错误类型 */
    type: OneBotErrorType.RECONNECT_FAILED
    /** 总重连次数 */
    totalReconnectAttempt: number
    /** 最大重试次数 */
    maxReconnectAttempt: number
  }

  /** 关闭 */
  [OneBotEventKey.CLOSE]: OneBotCloseType
  /** 收到API请求 */
  [OneBotEventKey.SEND_API]: {
    /** 请求ID */
    echo: string
    /** API动作 */
    action: string
    /** API参数 */
    params: object
    /** JSON序列化之后的参数 */
    request: string
  }
  /** 收到API响应 */
  [OneBotEventKey.RESPONSE]: {
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
  }

  /** 收到事件上报 */
  [OneBotEventKey.EVENT]: OneBotWsEvent
  /** 收到消息事件上报 */
  [OneBotEventKey.MESSAGE]: OneBotMessageEvent
  /** 收到Bot自身消息上报 */
  [OneBotEventKey.MESSAGE_SENT]: OneBotMessageSentEvent
  /** 收到通知事件上报 */
  [OneBotEventKey.NOTICE]: OneBotNoticeEvent
  /** 收到请求事件上报 */
  [OneBotEventKey.REQUEST]: OneBotRequestEvent
  /** 收到元事件上报 */
  [OneBotEventKey.META_EVENT]: OneBotMetaEvent

  [key: `echo:${bigint}`]: Echo
  [key: `echo:${string}`]: Echo
}
