/* eslint-disable no-var */
declare global {
  var logger: import('@/types/system').Logger
  var debug: ReturnType<typeof import('@/utils/debug/debug').createDebug>
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 是否为监听模式 true false 注意是str */
      karin_watch: string
      /** 是否处于dev模式 */
      karin_dev: string
      /** 语言环境 "js" | "ts" */
      karin_lang: 'js' | 'ts'
      /** 运行器 "node" | "tsx" | "pm2" */
      runtime: 'node' | 'pm2' | 'tsx'
      /** 版本 */
      karin_version: string
      /** http服务监听端口 */
      karin_port: string
    }
  }
}

import { Debugger } from 'debug'

declare global {
  var debug: Debugger
}

export { }
