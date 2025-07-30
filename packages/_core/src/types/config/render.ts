/**
 * render.json 类型
 */
export interface Renders {
  /** ws服务器配置`反向ws` */
  ws_server: {
    /** 是否启用 */
    enable: boolean
  },
  /** ws客户端配置`正向ws` */
  ws_client: {
    /** 是否启用 */
    enable: boolean
    /** 地址 */
    url: string
    /** 令牌 */
    token: string
    /** 是否为snapka */
    isSnapka: boolean
    /** 重连时间 单位毫秒 默认5000 */
    reconnectTime?: number
    /** 心跳时间 单位毫秒 默认30000 */
    heartbeatTime?: number
  }[],
  /** http服务器配置`反向http` */
  http_server: {
    /** 是否启用 */
    enable: boolean
    /** 地址 */
    url: string
    /** 令牌 */
    token: string
    /** 是否为snapka */
    isSnapka: boolean
  }[]
}
