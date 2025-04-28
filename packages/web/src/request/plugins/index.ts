import { api, request } from '@/request/base'
import type {
  LoadedPluginCacheList,
  PluginAdminListResponse,
  PluginAdminParams,
  PluginAdminResult,
} from 'node-karin'

/**
 * 插件管理
 * @param params 插件管理参数
 * @returns 更新插件结果
 */
export const pluginAdminRequest = async (
  params: PluginAdminParams
): Promise<PluginAdminResult> => {
  const response = await request.serverPost<PluginAdminResult, PluginAdminParams>(
    api.pluginAdmin,
    params
  )

  return response
}

/**
 * 获取已安装插件名称列表
 * @returns 已安装插件名称列表
 */
export const getLocalPluginNameListRequest = async (): Promise<PluginAdminListResponse[]> => {
  const response = await request.serverPost<PluginAdminListResponse[], null>(
    api.getPluginListPluginAdmin
  )
  return response
}

/** 插件缓存类型 */
interface PluginCache {
  /** 插件数据 */
  data: LoadedPluginCacheList[]
  /** 缓存时间戳 */
  timestamp: number
}

/** 缓存过期时间（毫秒） */
const CACHE_EXPIRY = 60 * 1000 // 1分钟

/** 插件缓存 */
let pluginCache: PluginCache | null = null

/**
 * 获取已加载命令插件缓存信息列表
 * @returns 已加载命令插件缓存信息列表
 */
export const getLoadedCommandPluginCacheListRequest = async (): Promise<LoadedPluginCacheList[]> => {
  const response = await request.serverPost<LoadedPluginCacheList[], null>(
    api.getLoadedCommandPluginCacheList
  )

  return response
}

/**
 * 获取已加载命令插件缓存信息列表（带缓存）
 * @param forceRefresh 是否强制刷新缓存
 * @returns 已加载命令插件缓存信息列表
 */
export const getLoadedCommandPluginCacheList = async (
  forceRefresh = false
): Promise<LoadedPluginCacheList[]> => {
  const now = Date.now()

  // 缓存有效且不强制刷新时返回缓存
  if (
    !forceRefresh &&
    pluginCache &&
    now - pluginCache.timestamp < CACHE_EXPIRY
  ) {
    return pluginCache.data
  }

  // 获取新数据并更新缓存
  const data = await getLoadedCommandPluginCacheListRequest()
  pluginCache = { data, timestamp: now }

  return data
}
