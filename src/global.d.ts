declare global {
  // eslint-disable-next-line no-var
  var logger: import('@/types/system').Logger
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

export { }
