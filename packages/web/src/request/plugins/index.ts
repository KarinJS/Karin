import { api, request } from '@/request/base'
import type {
  FrontendInstalledPluginListResponse,
  LoadedPluginCacheList,
  PluginAdminListResponse,
  PluginAdminParams,
  PluginAdminResult,
  PluginMarketRequest,
  PluginMarketResponse,
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
 * @param isRefresh 是否强制刷新
 * @returns 已安装插件名称列表
 */
export const getLocalPluginNameListRequest = async (
  isRefresh: boolean = false
): Promise<PluginAdminListResponse[]> => {
  const response = await request.serverPost<PluginAdminListResponse[], {
    isRefresh: boolean
  }>(
    api.getPluginListPluginAdmin,
    {
      isRefresh,
    }
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

  /** 缓存有效且不强制刷新时返回缓存 */
  if (
    !forceRefresh &&
    pluginCache &&
    now - pluginCache.timestamp < CACHE_EXPIRY
  ) {
    return pluginCache.data
  }

  /** 获取新数据并更新缓存 */
  const data = await getLoadedCommandPluginCacheListRequest()
  pluginCache = { data, timestamp: now }

  return data
}

/**
 * 获取插件市场列表
 * @param forceRefresh 是否强制刷新数据
 * @returns 插件市场列表
 */
export const getPluginMarketListRequest = async (
  forceRefresh = false
): Promise<PluginMarketResponse[]> => {
  const response = await request.serverPost<PluginMarketResponse[], PluginMarketRequest>(
    api.getPluginMarketList,
    { refresh: forceRefresh }
  )
  return response
}

/**
 * 创建任务结果
 */
export interface CreateTaskResult {
  /** 任务ID */
  taskId?: string
  /** 操作是否成功 */
  success: boolean
  /** 操作消息 */
  message?: string
}

/**
 * 获取插件索引的简约插件列表
 */
export const getFrontendInstalledPluginListRequest = async (
  isRefresh = false
): Promise<FrontendInstalledPluginListResponse[]> => {
  const response = await request.serverPost<FrontendInstalledPluginListResponse[], {
    isRefresh: boolean
  }>(
    api.getFrontendInstalledPluginList,
    { isRefresh }
  )
  return response
}
