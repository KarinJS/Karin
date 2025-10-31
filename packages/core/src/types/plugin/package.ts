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
  /** 官方的 engines 字段 */
  engines?: {
    karin?: string
    ['node-karin']?: string
    [key: string]: any
  }
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
    /**
     * 引擎兼容性 官方的翻译。。。奇奇怪怪的
     * @description 插件的引擎兼容性配置，用于指定插件在哪些karin版本下运行。
     * @description karin版本
     * @example ^0.0.1
     * @example >=0.0.1
     * @example 0.0.1
     * @example 0.0.x
     */
    engines?: string
    /** 忽略引擎版本检查，强制加载插件（仅适用于karin.engines，不影响package.engines） */
    ignoreEngines?: boolean
  }
  [key: string]: any
}
