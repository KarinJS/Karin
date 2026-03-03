/**
 * 插件相关 API 类型
 */

// ===================== 插件信息 =====================

/** 插件类型 */
export type PluginType = 'npm' | 'git' | 'app'

/** 插件基础信息 */
export interface PluginInfo {
  /** 插件名称 */
  name: string
  /** 显示名称 */
  displayName?: string
  /** 插件描述 */
  description?: string
  /** 当前版本 */
  version: string
  /** 作者 */
  author?: string
  /** 主页链接 */
  homepage?: string
  /** 仓库地址 */
  repository?: string
  /** 开源协议 */
  license?: string
  /** 插件类型 */
  type: PluginType
  /** 是否已启用 */
  enabled: boolean
}

// ===================== 插件安装 =====================

/** 安装插件请求参数 */
export interface InstallPluginRequest {
  /** 插件名称（npm 包名或 git 仓库地址） */
  name: string
  /** 插件类型 */
  type: PluginType
  /** 指定版本（可选） */
  version?: string
}

/** 卸载插件请求参数 */
export interface UninstallPluginRequest {
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: PluginType
}

// ===================== 插件更新 =====================

/** 插件更新信息 */
export interface PluginUpdateInfo {
  /** 插件名称 */
  name: string
  /** 当前版本 */
  currentVersion: string
  /** 最新可用版本 */
  latestVersion: string
  /** 可用版本列表（含预发布） */
  versions?: string[]
}

/** 更新插件请求参数 */
export interface UpdatePluginRequest {
  /** 插件名称 */
  name: string
  /** 目标版本 */
  version: string
}
