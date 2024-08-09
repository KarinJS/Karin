import { Logger as LoggerType } from 'log4js'
import { Logger } from 'karin/types'
import { Lang, Mode, Runner } from 'karin/cli/karin'

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
    }
  }
}

declare global {
  var logger: LoggerType & Logger
}

export { }
