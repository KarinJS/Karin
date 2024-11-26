declare global {
  // eslint-disable-next-line no-var
  var logger: import('./core/utils/logger/logger').LoggerType
}

export const enum Runner {
  Node = 'node',
  Tsx = 'tsx',
  Pm2 = 'pm2',
}

export const enum Mode {
  Dev = 'dev',
  Prod = 'prod',
}

export const enum Lang {
  Js = 'js',
  Ts = 'ts',
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** 启动次数 */
      karin_app_start_count: string
      /** 是否为监听模式 true false 注意是str */
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

export { }
