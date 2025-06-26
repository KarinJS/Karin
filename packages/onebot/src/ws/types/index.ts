import type { OneBotCore } from '../../core/core'

/** WebSocket 基础选项 */
export type OneBotWsBaseOptions = OneBotCore['_options']

/** WebSocket 客户端请求参数 */
export type OneBotWsClientOptions = {
  /** 鉴权秘钥 */
  accessToken?: string
  /** 头部 */
  headers?: Record<string, string>
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 重连间隔 默认5000ms */
  reconnectInterval?: number
  /** 最大重连次数 默认100次 */
  maxReconnectAttempts?: number
} & OneBotWsBaseOptions

/** WebSocket 服务端请求参数 */
export type OneBotWsServerOptions = {
  /** 鉴权秘钥，客户端连接时需要提供相同的token */
  accessToken?: string
} & OneBotWsBaseOptions

/** WebSocket 默认配置 */
export const DEFAULT_WS_OPTIONS: Required<Pick<OneBotWsClientOptions,
  'autoReconnect' |
  'reconnectInterval' |
  'maxReconnectAttempts' |
  'timeout'
>> = {
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 100,
  timeout: 10000,
}
