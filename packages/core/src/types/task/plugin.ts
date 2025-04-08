import type { CreateTaskParams } from './task'

type PluginAdminBase = Omit<CreateTaskParams, 'operatorIp' | 'createTime' | 'spawn'>

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
  /** 插件类型 */
  pluginType: 'npm' | 'git' | 'app'
}

/**
 * 自定义安装插件任务参数基类
 */
interface PluginAdminCustomInstall extends PluginAdminInstallBase {
  source: 'custom'
}

/**
 * 自定义安装npm包任务参数
 */
interface PluginAdminCustomInstallNpm extends PluginAdminCustomInstall {
  pluginType: 'npm'
  /** 版本 */
  version?: string
  /** 指定registry源 */
  registry?: string
}

/**
 * 自定义安装git仓库任务参数
 */
interface PluginAdminCustomInstallGit extends PluginAdminCustomInstall {
  pluginType: 'git'
  /** 仓库地址 */
  repo: string
  /** 分支 */
  branch?: string
  /** 自定义插件名称 不指定则使用git仓库名称 */
  customName?: string
}

/**
 * 自定义安装app任务参数
 */
export interface PluginAdminCustomInstallApp extends PluginAdminCustomInstall {
  pluginType: 'app'
  /** js文件直链 */
  jsUrl: string
  /** 下载后显示的名称 不指定则使用jsUrl的文件名 无需指定后缀 */
  customName?: string
}

// =============== uninstall ===============

/**
 * 插件卸载任务参数
 */
export interface PluginAdminUninstall extends PluginAdminBase {
  type: 'uninstall'
  /** 插件名称 */
  target: string
}

// =============== update ===============

/**
 * 插件更新任务参数
 */
export interface PluginAdminUpdate extends PluginAdminBase {
  type: 'update'
  /** 插件名称 */
  target: string
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
 * 插件市场安装任务参数
 */
export interface PluginAdminMarketInstall extends PluginAdminInstallBase {
  type: 'install'
  /** 插件类型 */
  source: 'market'
}

/** 自定义安装任务参数 */
export type PluginAdminCustomInstallParams =
  | PluginAdminCustomInstallNpm
  | PluginAdminCustomInstallGit
  | PluginAdminCustomInstallApp

/**
 * 前端插件安装任务参数
 */
export type PluginAdminInstall =
  | PluginAdminMarketInstall
  | PluginAdminCustomInstallParams
