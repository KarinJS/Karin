import type { WebConfigIcon } from '@karinjs/components'
import type { KarinPluginType, PluginPackageType } from '@karinjs/plugin'

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
  type: 'npm' | 'git' | 'apps'
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

/**
 * 插件管理 获取插件列表Api响应
 */
export interface PluginAdminListResponse {
  /** 插件ID `package.json中的名称` */
  id: string
  /** 插件名称 `文件夹根目录名称` */
  name: string
  /** 插件类型 */
  type: PluginPackageType
  /** 插件版本 App类型为空 */
  version: string
  /**
   * 插件最新版本
   * - npm: 最新版本号
   * - git: 最新提交哈希
   * - app: 最新版本号
   */
  latestVersion: string
  webConfig: {
    /** 是否存在`web.config`文件 */
    exists: boolean
    /** wen.config 文件绝对路径 */
    path: string
    /** 是否存在自定义组件配置函数 */
    customComponent: boolean
    /** 是否存在默认组件配置函数 一般用于插件的配置文件管理 */
    defaultComponent: boolean
    /** 插件图标 */
    icon: WebConfigIcon
  }
}

/**
 * 前端已安装插件简约列表 用于在插件管理索引页面显示
 */
export interface FrontendInstalledPluginListResponse {
  /** 插件ID `package.json中的名称` */
  id: string
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: PluginPackageType
  /** 插件是否存在插件市场中 */
  isMarketPlugin: boolean
  /** 插件描述 */
  description: string
  /** 插件作者信息 */
  author: {
    /** 名字 */
    name: string
    /** 主页 */
    home: string
    /** 头像 */
    avatar: string
  }
  /** 插件图标 */
  icon: WebConfigIcon
  /** 插件仓库主页 */
  repoUrl: string
  /** 插件是否可配置 */
  hasConfig: boolean
  /** 插件是否存在自定义组件 */
  hasCustomComponent: boolean
}

/**
 * 插件市场响应 作者信息
 * @description 因为前端只方便展示一个作者 这里进行解耦
 */
export interface PluginMarketAuthor {
  /** 名字 */
  name: string
  /** 主页 */
  home: string
  /** 头像 */
  avatar: string
}

/**
 * 插件市场响应 本地插件基本参数
 */
export interface PluginMarketLocalBase {
  /**
   * 是否已安装到本地
   */
  installed: boolean
  /**
   * 插件名称
   */
  name: string
  /**
   * 在本地的插件类型
   * @description 此项一般用于追踪插件配置 比如`npm`插件，在开发环境是`git`类型
   */
  type: PluginPackageType
  /**
   * 插件当前版本
   * @description 如果是`app`类型 则返回空字符串
   */
  version?: string
  /**
   * 插件描述
   */
  description?: string
  /**
   * 插件主页
   */
  home?: string
}

/**
 * 插件市场请求参数
 */
export interface PluginMarketRequest {
  /**
   * 是否强制刷新
   * @default false
   */
  refresh?: boolean
}

/**
 * 插件市场 type=market响应参数
 */
export interface PluginMarketOptions {
  /**
   * - `market`: 插件市场
   * - `local`: 本地
   */
  type: 'market'
  /**
   * 插件市场参数
   * @description api返回什么这里就是什么
   */
  market: KarinPluginType
  /**
   * 本地配置
   */
  local: PluginMarketLocalBase
  /**
   * 插件作者
   */
  author: PluginMarketAuthor
}

/**
 * 插件市场 type=local响应参数
 */
export interface PluginMarketLocalOptions {
  /**
   * - `market`: 插件市场
   * - `local`: 本地
   */
  type: 'local'
  /**
   * 本地配置
   */
  local: PluginMarketLocalBase
  /**
   * 插件作者
   */
  author: PluginMarketAuthor
}

/**
 * 插件市场响应参数
 */
export type PluginMarketResponse = PluginMarketOptions | PluginMarketLocalOptions
