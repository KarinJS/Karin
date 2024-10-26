import { Lang, Mode, Runner } from 'karin/cli'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 重启次数 */
      karin_app_start_count: string
      /** 是否为监听模式 yes=true no=false */
      karin_app_watch: string
      /** 运行模式 "dev" | "prod" */
      karin_app_mode: `${Mode}`
      /** 语言环境 "js" | "ts" */
      karin_app_lang: `${Lang}`
      /** 运行器 "node" | "tsx" | "pm2" */
      karin_app_runner: `${Runner}`
      /** 版本 */
      karin_app_version: string
      /** http服务监听端口 */
      karin_app_port: string
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var logger: import('./core/utils/logger/logger').LoggerType
}

export { }
