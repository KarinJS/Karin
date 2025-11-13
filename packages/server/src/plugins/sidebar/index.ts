import path from 'node:path'
import { redis } from '@karinjs/db'
import { getPluginWebConfig } from '../../config'
// import { getNpmLatestVersion } from '@karinjs/utils'
// import { getLocalCommitHash, getRemoteCommitHash } from '@karinjs/git'
import { createSuccessResponse, createServerErrorResponse } from '../../utils'
// import { cache, getPlugins, getPluginMarket, KarinPluginType } from '@karinjs/plugin'
import {
  REDIS_PLUGIN_LIST_CACHE_EXPIRE,
  REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY,
  REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND,
  REDIS_LOCAL_PLUGIN_LIST_CACHE_EXPIRE_FRONTEND,
} from '@karinjs/envs'

import type { RequestHandler } from 'express'
import type { FrontendInstalledPluginListResponse } from '../../types'
// import type { PluginCacheKeyPkg, PluginPackageType } from '@karinjs/plugin'

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
  webConfig: boolean
}

/**
 * 侧边栏已加载插件缓存信息结构
 * 用于在 Web UI 侧边栏展示已加载插件的详细信息
 */
export interface SidebarLoadedPluginCache {
  /** 插件名称 */
  pluginName: string
  /** 插件包含的文件列表 */
  fileList: {
    /** 文件名称 */
    fileName: string
    /** 该文件下所有的命令函数列表 */
    commandList: {
      /** 此命令函数所属的插件名称 */
      ownerPluginName: string
      /** 此命令函数的导出方法名 */
      exportMethodName: string
    }[]
  }[]
}

/**
 * 处理 Git 类型插件的版本信息
 * 获取本地和远程的 Git 提交哈希作为版本号
 */
const processGitPluginVersion = async (plugin: PluginCacheKeyPkg): Promise<PluginAdminListResponse> => {
  try {
    /** 本地最新提交哈希值 */
    const localCommitHash = await getLocalCommitHash(plugin.dir, { short: true })
    /** 远程最新提交哈希值 */
    const remoteCommitHash = await getRemoteCommitHash(plugin.dir, { short: true })
    return {
      type: 'git',
      id: plugin.name,
      name: plugin.name,
      version: localCommitHash,
      latestVersion: remoteCommitHash,
      webConfig: false,
    }
  } catch (error) {
    logger.debug(`获取插件${plugin.name}提交哈希失败`, { cache: error })
    return {
      type: 'git',
      id: plugin.name,
      name: plugin.name,
      version: '0.0.0',
      latestVersion: '0.0.0',
      webConfig: false,
    }
  }
}

/**
 * 处理 NPM 类型插件的版本信息
 * 获取当前安装版本和 NPM 仓库最新版本
 */
const processNpmPluginVersion = async (plugin: PluginCacheKeyPkg): Promise<PluginAdminListResponse> => {
  return {
    type: 'npm',
    id: plugin.name,
    name: plugin.name,
    version: plugin.data?.version || '0.0.0',
    latestVersion: await getNpmLatestVersion(plugin.name) || '0.0.0',
    webConfig: false,
  }
}

/**
 * 处理 Apps 类型插件的信息
 * 为每个应用创建单独的插件条目
 */
const processAppsPluginList = async (plugin: PluginCacheKeyPkg): Promise<PluginAdminListResponse[]> => {
  return plugin.apps.map(appPath => {
    return {
      type: 'apps',
      id: plugin.name,
      name: `${plugin.name}/${path.basename(appPath)}`,
      version: '',
      latestVersion: '',
      webConfig: true,
    }
  })
}

/**
 * 获取本地已安装插件的详细列表
 * 包含插件的版本信息和 Web 配置，用于管理后台的插件列表展示
 * @param isRefresh 是否强制刷新缓存
 * @returns 本地插件详细信息列表
 */
const getLocalInstalledPluginDetailList = async (isRefresh = false): Promise<PluginAdminListResponse[]> => {
  if (!isRefresh) {
    const cachedPluginList = await redis.get(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY)
    if (cachedPluginList) {
      return JSON.parse(cachedPluginList)
    }
  }

  const pluginDetailList: PluginAdminListResponse[] = []
  const installedPlugins = await getPlugins('all', true)

  await Promise.all(installedPlugins.map(async plugin => {
    if (plugin.type === 'git') {
      return pluginDetailList.push(await processGitPluginVersion(plugin))
    }
    if (plugin.type === 'npm') {
      return pluginDetailList.push(await processNpmPluginVersion(plugin))
    }
    if (plugin.type === 'apps') {
      const appsPluginList = await processAppsPluginList(plugin)
      return pluginDetailList.push(...appsPluginList)
    }
  }))

  /** 更新 Redis 缓存，设置过期时间 */
  await redis.set(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY, JSON.stringify(pluginDetailList), {
    EX: REDIS_PLUGIN_LIST_CACHE_EXPIRE,
  })

  return pluginDetailList
}

/**
 * @webui 插件管理后台 - 获取插件列表 API
 * 提供插件管理后台的完整插件列表，包含版本信息和配置状态
 */
export const getSidebarPluginAdminList: RequestHandler = async (req, res) => {
  try {
    const { isRefresh = false } = req.body
    const pluginDetailList = await getLocalInstalledPluginDetailList(isRefresh)
    createSuccessResponse(res, pluginDetailList)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * @webui 侧边栏 - 获取已加载命令插件缓存信息列表
 * 用于在侧边栏展示当前已加载的插件命令结构
 */
export const getSidebarLoadedCommandPluginCache: RequestHandler = async (_, res) => {
  try {
    const sidebarPluginCacheList: SidebarLoadedPluginCache[] = []
    /**
     * 插件命令映射表
     * @example
     * ```ts
     * {
     *  'karin-plugin-example': {
     *    'index.ts': ['fnc'],
     *  }
     * }
     * ```
     */
    const pluginCommandMap: Record<string, Record<string, { ownerPluginName: string; exportMethodName: string }[]>> = {}

    cache.command.forEach(cachedPlugin => {
      const { name: pluginKey } = cachedPlugin.pkg
      if (!pluginCommandMap[pluginKey]) {
        pluginCommandMap[pluginKey] = {}
      }

      if (!pluginCommandMap[pluginKey][cachedPlugin.file.basename]) {
        pluginCommandMap[pluginKey][cachedPlugin.file.basename] = []
      }

      pluginCommandMap[pluginKey][cachedPlugin.file.basename].push({
        ownerPluginName: cachedPlugin.file.basename,
        exportMethodName: cachedPlugin.app.name,
      })
    })

    Object.keys(pluginCommandMap).forEach(pluginKey => {
      const fileList: SidebarLoadedPluginCache['fileList'] = []
      Object.keys(pluginCommandMap[pluginKey]).forEach(fileName => {
        fileList.push({
          fileName,
          commandList: pluginCommandMap[pluginKey][fileName],
        })
      })
      sidebarPluginCacheList.push({
        pluginName: pluginKey,
        fileList,
      })
    })

    createSuccessResponse(res, sidebarPluginCacheList)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * @webui 侧边栏 - 获取前端已安装插件简约列表
 * @webui 插件卡片信息 - 同时，这里还同时肩负了前端插件列表卡片信息的展示
 */
export const getSidebarInstalledPluginSummary: RequestHandler = async (req, res) => {
  const shouldRefreshCache: boolean = req.body.isRefresh || false

  try {
    if (!shouldRefreshCache) {
      const cachedPluginSummary = await redis.get(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND)
      if (cachedPluginSummary) {
        return createSuccessResponse(res, JSON.parse(cachedPluginSummary))
      }
    }

    /** 复用同一个获取逻辑，并行获取本地插件和市场插件信息 */
    const [localPluginList, marketPluginData] = await Promise.all([
      getPlugins('all', false, shouldRefreshCache),
      getPluginMarket(shouldRefreshCache),
    ])

    const marketPluginMap: Record<string, KarinPluginType> = {}
    marketPluginData.plugins.forEach(marketPlugin => {
      marketPluginMap[marketPlugin.name] = marketPlugin
    })

    const frontendPluginSummaryList: FrontendInstalledPluginListResponse[] = await Promise.all(
      localPluginList.map(
        async pluginItem => {
          const [pluginType, pluginName] = pluginItem.split(':') as [FrontendInstalledPluginListResponse['type'], string]
          /** 检查插件是否在插件市场中 */
          const marketPluginInfo = marketPluginMap[pluginName]
          const pluginWebConfig = await getPluginWebConfig(pluginName)

          return {
            id: pluginName,
            name: pluginName,
            type: pluginType,
            isMarketPlugin: !!marketPluginInfo,
            description: marketPluginInfo?.description || '',
            author: {
              name: marketPluginInfo?.author[0].name || '',
              home: marketPluginInfo?.author[0].home || '',
              avatar: marketPluginInfo?.author[0].avatar ||
                marketPluginInfo?.author[0].home
                ? `${marketPluginInfo?.author[0].home}.png`
                : '',
            },
            repoUrl: marketPluginInfo?.repo[0].url || '',
            hasConfig: pluginWebConfig.status,
            hasCustomComponent: false,
            icon: {
              /**
               * 图标名称
               * @see https://fonts.google.com/icons
               */
              name: '',
              /** 图标大小 */
              size: 0,
              /** 图标颜色 */
              color: '',
            },
          }
        }))

    createSuccessResponse(res, frontendPluginSummaryList)

    /** 更新 Redis 缓存，设置过期时间 */
    await redis.set(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND, JSON.stringify(frontendPluginSummaryList), {
      EX: REDIS_LOCAL_PLUGIN_LIST_CACHE_EXPIRE_FRONTEND,
    })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
