/** pkg环境变量类型 */
export interface PkgEnv {
  /** 变量名 */
  key: string
  /** 变量值 */
  value: string
  /** 变量注释 */
  comment: string
}

/** 插件的package.json标准类型 */
export interface PkgData {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件入口 */
  main: string
  karin?: {
    /** ts入口 */
    main?: string
    /** 插件app列表 */
    apps?: string | string[]
    /** web配置文件 */
    web?: string
    /** ts插件app列表 ts专属 仅在ts开发模式下生效 */
    ['ts-apps']?: string | string[]
    /** ts-web */
    ['ts-web']?: string
    /** 静态资源目录 */
    static?: string | string[]
    /** 基本文件夹结构 */
    files?: string[]
    /** 环境变量配置 */
    env?: PkgEnv[]
  }
  [key: string]: any
}
