import api from '../client'
import type { ApiResponse } from '../types'

/**
 * 插件包类型
 */
export type PluginPackageType = 'npm' | 'dev' | 'apps'

/**
 * 插件类型
 */
export type PluginType = 'command' | 'accept' | 'handler' | 'button' | 'task'

/**
 * 插件包信息
 */
export interface PluginPackageInfo {
  /** 包名 */
  name: string
  /** 包类型 */
  type: PluginPackageType
  /** 包路径 */
  path: string
  /** 插件数量 */
  pluginCount: number
}

/**
 * 插件信息
 */
export interface PluginInfo {
  /** 插件 ID */
  id: string
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: string
  /** 所属包名 */
  pkg: string
  /** 文件路径 */
  file: string
  /** 优先级 */
  priority: number
}

/**
 * 插件统计信息
 */
export interface PluginStats {
  plugins: {
    command: { total: number; active: number; disabled: number }
    accept: { total: number; active: number; disabled: number }
    handler: { total: number; active: number; disabled: number; keys: number }
    button: { total: number; active: number; disabled: number }
    task: { total: number; active: number; disabled: number }
    files: number
    packages: number
  }
  packages: {
    npm: number
    dev: number
    apps: number
    total: number
  }
}

/**
 * 获取所有插件包列表
 */
export const getPluginPackages = () => {
  return api.get<ApiResponse<PluginPackageInfo[]>>('/v2/plugin/packages').then(res => res.data)
}

/**
 * 获取包名列表（简化版本）
 */
export const getPluginPackageNames = () => {
  return api.get<ApiResponse<string[]>>('/v2/plugin/package-names').then(res => res.data)
}

/**
 * 获取插件列表
 * @param type 可选，过滤插件类型
 * @param pkg 可选，过滤所属包名
 */
export const getPluginList = (type?: PluginType, pkg?: string) => {
  const params = new URLSearchParams()
  if (type) params.append('type', type)
  if (pkg) params.append('pkg', pkg)

  const queryString = params.toString()
  const url = queryString ? `/v2/plugin/list?${queryString}` : '/v2/plugin/list'

  return api.get<ApiResponse<PluginInfo[]>>(url).then(res => res.data)
}

/**
 * 获取插件统计信息
 */
export const getPluginStats = () => {
  return api.get<ApiResponse<PluginStats>>('/v2/plugin/stats').then(res => res.data)
}
