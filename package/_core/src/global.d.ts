declare global {
  var logger: import('@/types/system/logger').Logger
  type EventEmitter = import('events').EventEmitter
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 是否启用HTTP */
      HTTP_ENABLE: string
      /** HTTP监听端口 */
      HTTP_PORT: string
      /** HTTP监听地址 */
      HTTP_HOST: string
      /** HTTP鉴权秘钥 仅用于karin自身Api */
      HTTP_AUTH_KEY: string
      /** ws_server鉴权秘钥 */
      WS_SERVER_AUTH_KEY: string
      /** 是否启用Redis 关闭后将使用内部虚拟Redis */
      REDIS_ENABLE: string
      /** 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序 */
      PM2_RESTART: string
      /** 日志等级 */
      LOG_LEVEL: string
      /** 日志保留天数 */
      LOG_DAYS_TO_KEEP: string
      /** 日志文件最大大小 如果此项大于0则启用日志分割 */
      LOG_MAX_LOG_SIZE: string
      /** logger.fnc颜色 */
      LOG_FNC_COLOR: string
      /** 运行器 "node" | "pm2" | "tsx" */
      RUNTIME: 'node' | 'pm2' | 'tsx'
      /** ffmpeg路径 */
      FFMPEG_PATH: string
      /** ffprobe路径 */
      FFPROBE_PATH: string
      /** ffplay路径 */
      FFPLAY_PATH: string
      /** node-karin版本 */
      KARIN_VERSION: string
      /** tsx监察者模式 */
      TSX_WATCH: string
      /** 日志实时Api最多支持同时连接数 */
      LOG_MAX_CONNECTIONS: string
    }
  }
}

export { }
