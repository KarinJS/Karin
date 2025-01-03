/** `server.yaml`类型 */
export interface Server {
  /** 当前文件热更新是否重启http服务 */
  hmrToServer: boolean
  /** http监听地址 */
  host: string
  /** http端口 */
  port: number
  /** 鉴权秘钥 */
  authKey: string
  /** ws api请求超时时间 秒 */
  timeout: number
  /** 反向ws鉴权秘钥 */
  reverseWsToken: string
  /** onebot11 正向WebSocket地址 */
  forwardWs: Array<string | { url: string, token: string }>
  /** websocket 渲染器地址 ws://127.0.0.1:7005/ws/render */
  renderWs: Array<{ url: string, token: string }>
  /** http渲染器地址 */
  renderHttp: Array<{ url: string, token: string }>
  /** http根理由随机返回的文案列表 */
  rootMsg: string[]
  /** onebot http配置 */
  onebotHttp: Array<{
    /** 机器人ID */
    selfId: string
    /** api地址 */
    api: string
    /** 鉴权token */
    token: string
  }>,
  /** console控制台适配器配置 */
  console: {
    /** 只允许本地访问 */
    isLocal: boolean
    /** 如果 isLocal 为 false 则需要配置 token */
    token: string
    /** 自定义host */
    host: string
  }
}
