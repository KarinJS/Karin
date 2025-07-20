import type { CreateTaskParams } from './task'

/** 插件类型 */
type PluginType = 'npm' | 'git' | 'app'
/** 插件管理任务参数 */
type PluginAdminBase = Omit<CreateTaskParams, 'operatorIp' | 'createTime' | 'target'>

// =============== install ===============

/**
 * 插件安装任务参数
 */
interface PluginAdminInstallBase extends PluginAdminBase {
  type: 'install'
  /** 插件名称 */
  target: string
  /** 插件类型 */
  source: 'market' | 'custom'
}

/**
 * 自定义安装插件任务参数基类
 */
interface PluginAdminCustomInstallBase extends PluginAdminInstallBase {
  source: 'custom'
  /** 插件类型 */
  pluginType: PluginType
}

/**
 * 自定义安装npm包任务参数
 */
interface PluginAdminCustomInstallNpm extends PluginAdminCustomInstallBase {
  pluginType: 'npm'
  /** 版本 */
  version?: string
  /** 指定registry源 */
  registry?: string
  /** 允许pnpm在安装期间执行安装的包名列表 */
  allowBuild?: string[]
}

/**
 * 自定义安装git仓库任务参数
 */
interface PluginAdminCustomInstallGit extends PluginAdminCustomInstallBase {
  pluginType: 'git'
  /** 仓库地址 */
  repo: string
  /** 分支 */
  branch?: string
  /** 自定义插件名称 不指定则使用git仓库名称 */
  target: string
}

/**
 * 自定义安装app任务参数
 */
export interface PluginAdminCustomInstallApp extends PluginAdminCustomInstallBase {
  pluginType: 'app'
  /** js文件直链 */
  jsUrl: string
  /** 下载后显示的名称 不指定则使用jsUrl的文件名 无需指定后缀 */
  target: string
}

// =============== uninstall ===============

/**
 * 插件卸载任务参数
 */
export interface PluginAdminUninstall extends PluginAdminBase {
  type: 'uninstall'
  /** 卸载目标 */
  target: {
    /** 插件类型 */
    type: PluginType
    /** 插件名称 在app类型下是`插件包名称:ts、js文件名称` 包含后缀 */
    name: string
  }[]
}

// =============== update ===============

/**
 * 插件更新任务参数
 */
export interface PluginAdminUpdate extends PluginAdminBase {
  type: 'update'
  /** 是否更新所有插件 */
  isAll?: {
    /** 是否更新全部npm插件 */
    npm: boolean
    /** 是否更新全部git插件 */
    git: boolean
    /** git插件是否强制更新 */
    force: boolean
  }
  /** 更新目标 */
  target: {
    /** 插件类型 */
    type: Omit<PluginType, 'app'>
    /** 插件名称 */
    name: string
    /** 更新版本 默认为latest 仅在npm下有效 */
    version?: string
    /** 是否强制更新 仅在git下有效 */
    force?: boolean
  }[]
}

// TODO: 禁用和启用功能待适配
// 后端需要新增api，返回插件列表、每个app的方法名、插件名

// // =============== disable ===============

// /**
//  * 插件禁用任务参数
//  */
// interface PluginAdminDisable extends PluginAdminBase {
//   type: 'disable'
//   /** 插件名称 */
//   target: string
// }

// // =============== enable ===============

// /**
//  * 插件启用任务参数
//  */
// interface PluginAdminEnable extends PluginAdminBase {
//   type: 'enable'
//   /** 插件名称 */
//   target: string
// }

/**
 * 插件市场
 */
interface PluginAdminMarketInstallBaase extends PluginAdminInstallBase {
  type: 'install'
  /** 插件类型 */
  source: 'market'
}

/**
 * app类型插件市场安装任务参数
 */
export interface PluginAdminMarketInstallApp extends PluginAdminMarketInstallBaase {
  pluginType: 'apps'
  /** 需要安装的url列表 */
  urls: string[]
}

/**
 * npm类型插件市场安装任务参数
 */
interface PluginAdminMarketInstallNpm extends PluginAdminMarketInstallBaase {
  pluginType: 'npm'
  /** 允许pnpm在安装期间执行脚本的包名列表 */
  allowBuild?: string[]
}

/**
 * git类型插件市场安装任务参数
 */
interface PluginAdminMarketInstallGit extends PluginAdminMarketInstallBaase {
  pluginType: 'git'
}

/**
 * 插件市场安装任务参数
 */
export type PluginAdminMarketInstall =
  | PluginAdminMarketInstallApp
  | PluginAdminMarketInstallNpm
  | PluginAdminMarketInstallGit

/** 自定义安装任务参数 */
export type PluginAdminCustomInstall =
  | PluginAdminCustomInstallNpm
  | PluginAdminCustomInstallGit
  | PluginAdminCustomInstallApp

/**
 * 前端插件安装任务参数
 */
export type PluginAdminInstall =
  | PluginAdminMarketInstall
  | PluginAdminCustomInstall

/**
 * 插件管理路由参数
 */
export type PluginAdminParams =
  | PluginAdminInstall
  | PluginAdminUninstall
  | PluginAdminUpdate

/**
 * 插件管理返回值
 */
export interface PluginAdminResult {
  /** 是否成功 */
  success: boolean
  /** 操作日志 */
  message: string
  /** 任务ID */
  taskId?: string
}
