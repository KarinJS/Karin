/**
 * 适配器所属平台
 * - `qq`: QQ
 * - `wechat`: 微信
 * - `telegram`: Telegram
 * - `discord`: Discord
 * - `koko`: 开黑吧
 * - `other`: 其他
 */
export type AdapterPlatform = 'qq'
  | 'wechat'
  | 'telegram'
  | 'discord'
  | 'koko'
  | 'other'

/**
 * 适配器所使用的标准接口协议
 * - `onebot11`: OneBot v11 标准
 * - `onebot12`: OneBot v12 标准
 * - `oicq`: OICQ 标准
 * - `icqq`: OICQ fork 标准
 * - `other`: 其他标准
 */
export type AdapterStandard = 'onebot11'
  | 'onebot12'
  | 'oicq'
  | 'icqq'
  | 'other'

/**
 * 适配器协议实现名称
 * - `console`: 控制台
 * - `qqbot`: https://bot.q.qq.com/wiki
 * - `icqq`: https://github.com/icqqjs/icqq
 * - `gocq-http`: https://docs.go-cqhttp.org/
 * - `napcat`: https://napneko.github.io/zh-CN/
 * - `oicq`: https://github.com/takayama-lily/oicq
 * - `llonebot`: https://llonebot.github.io/zh-CN/
 * - `conwechat`: https://justundertaker.github.io/ComWeChatBotClient/
 * - `lagrange`: https://lagrangedev.github.io/Lagrange.Doc/Lagrange.OneBot/
 */
export type AdapterProtocol =
  'qqbot'
  | 'icqq'
  | 'gocq-http'
  | 'napcat'
  | 'oicq'
  | 'llonebot'
  | 'conwechat'
  | 'lagrange'
  | 'console'

/**
 * 适配器通信方式
 * - `http`: HTTP 通信
 * - `webSocketServer`: WebSocket 服务端
 * - `webSocketClient`: WebSocket 客户端
 * - `grpc`: gRPC 通信
 * - `other`: 其他通信方式
 */
export type AdapterCommunication = 'http'
  | 'webSocketServer'
  | 'webSocketClient'
  | 'grpc'
  | 'other'

/**
 * 适配器基本信息
 */
export interface AdapterInfo {
  /** 适配器索引 默认为-1 在注册适配器时会自动更改为对应的索引 */
  index: number
  /** 适配器名称 如lagrange-onebot */
  name: string
  /** 适配器版本 */
  version: string
  /** 适配器平台 */
  platform: AdapterPlatform
  /** 适配器使用的协议标准 如onebot11 */
  standard: AdapterStandard
  /** 适配器协议实现 如gocq、napcat */
  protocol: AdapterProtocol
  /** 适配器通信方式 */
  communication: AdapterCommunication
  /**
   * 适配器通信地址
   * @example `http://127.0.0.1:7000`
   * @example `ws://127.0.0.1:7000/ws`
   * @example `grpc://127.0.0.1:7001`
   * @example `internal://127.0.0.1`
   */
  address: string
  /** 连接时间 */
  connectTime: number
  /** 鉴权秘钥 */
  secret: string | null
}
