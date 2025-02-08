/**
 * 基类
 */
interface Base {
  /** 插件包名 */
  name: string
  /**
   * 插件类型
   * - npm: npm 插件
   * - git: git 插件
   * - app: 单应用插件
   */
  type: 'npm' | 'git' | 'app'
  /** 插件描述 限制 50 长度 */
  description: string
  /** 仓库主页 */
  home: string
  /** 插件提交到仓库时间 */
  time: string
  /** 插件许可证 */
  license: {
    /** 许可证名称 */
    name: string
    /** 许可证地址 */
    url: string
  }
  /** 插件作者 */
  author: {
    /** 名字 */
    name: string
    /** 主页 */
    home: string
    /** 头像 */
    avatar: string
  }[]
  /** 插件仓库 */
  repo: {
    /** 仓库类型 */
    type: 'github' | 'gitee' | 'gitcode' | 'gitlab' | 'npm'
    /** 仓库地址 */
    url: string
    /** 分支名称 */
    branch: string
  }[]
}

/**
 * 单应用插件类型
 */
interface App extends Base {
  type: 'app'
  /** app文件直链 */
  files: string[]
}

type Plugins = Base | App

/**
 * 官方Api返回类型
 * https://registry.npmjs.com/@karinjs/plugins-list/latest
 * https://registry.npmmirror.com/@karinjs/plugins-list/latest
 */
export interface OnlinePluginInfo {
  plugins: Plugins[]
}

/**
 * karin api返回类型
 */
export interface PluginLists extends Base {
  version: string
  /** 是否已经安装 */
  installed: boolean
  /** 最新版本 */
  latestVersion?: string
  /** 下载量 */
  downloads: number
  /** 插件大小 */
  size: number
  /** 最近一次更新时间 */
  updated: string
}

export interface PluginUpdateInfo extends PluginLists {
  /** 是否可更新 */
  hasUpdate: boolean
  /** 当前版本 */
  currentVersion?: string
  /** 最新版本 */
  latestVersion?: string
  /** 当前hash */
  currentHash?: string
  /** 更新日志 */
  updateLog?: string
  /** 更新数量 */
  updateCount?: number
}
