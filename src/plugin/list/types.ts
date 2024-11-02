/** 插件类型 */
export type PluginsType = 'git' | 'npm' | 'app'

/** 插件信息收集类型 */
export interface PluginInfo {
  /** 插件类型 */
  type: PluginsType
  /** 入口文件绝对路径 */
  main: string
  /** app列表<app绝对路径> */
  apps: string[]
  /** 插件目录绝对路径 */
  path: string
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 解析后的package.json */
  pkg: PackageJson
}

/** package.json类型 */
export interface PackageJson {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件入口 */
  main: string
  karin?: {
    /** 插件app列表 */
    apps?: string | string[]
    /** 静态资源目录 */
    static?: string | string[]
    /** 基本文件夹结构 */
    files?: string[]
  }
  [key: string]: any
}
