/** 插件类型 */
export type Apps = 'app' | 'git' | 'npm'
/** 获取插件的方式 */
export type GetPluginType = 'app' | 'git' | 'npm' | 'all'

export interface PluginAuthor {
  name: string
  email: string
  home: string
}

export interface PluginRepo {
  type: string
  url: string
}

export interface OnlinePluginInfo {
  name: string
  package_name: string
  type: string
  description: string
  license: string
  time: string
  author: PluginAuthor[]
  repo: PluginRepo[]
}

/** package.json类型 */
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
    /** ts插件app列表 ts专属 仅在ts开发模式下生效 */
    ['ts-apps']?: string | string[]
    /** 静态资源目录 */
    static?: string | string[]
    /** 基本文件夹结构 */
    files?: string[]
  }
  [key: string]: any
}

/** 插件包基本属性 */
export interface LocalPluginInfo {
  /**
   * 插件包唯一标识
   */
  id: number
  /**
   * 插件包类型
   * - `app`: 单app
   * - `git`: git仓库
   * - `npm`: npm包
   */
  type: Apps
  /**
   * 插件包名称
   * - `app`: `karin-plugin-example`
   * - `git`: `karin-plugin-memes`
   * - `npm`: `@karinjs/adapter-qqbot`
   */
  name: string
  /**
   * 插件根目录
   * - `app`: `/root/karin/plugins/karin-plugin-example`
   * - `git`: `/root/karin/plugins/karin-plugin-memes`
   * - `npm`: `/root/karin/node_modules/@karinjs/adapter-qqbot`
   */
  dir: string
  /**
   * apps绝对路径列表
   */
  apps: string[]
  /**
   * 所有可能包含apps的目录列表
   */
  allApps: string[]
  /**
   * 获取`package.json`绝对路径
   */
  get pkgPath(): string
  /**
   * 读取`package.json`文件
   */
  get pkgData(): PkgData
}
