import path from 'node:path'
import { cache, getPluginMarket } from '@/plugin/system'
import { getPlugins } from '@/plugin/system/list'
import { redis } from '@/core/db'
import { getNpmLatestVersion } from '@/utils/npm'
import { KarinPluginType } from '@/types/plugin/market'
import { getWebConfig, defaultWebConfig } from '../config/webConfig'
import { getLocalCommitHash, getRemoteCommitHash } from '@/utils/git'
import { createSuccessResponse, createServerErrorResponse } from '@/server/utils/response'
import {
  REDIS_LOCAL_PLUGIN_LIST_CACHE_EXPIRE_FRONTEND,
  REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY,
  REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND,
  REDIS_PLUGIN_LIST_CACHE_EXPIRE,
} from '@/env'

import type { RequestHandler } from 'express'
import type { LoadedPluginCacheList, PluginAdminListResponse, PkgInfo, FrontendInstalledPluginListResponse } from '@/types'

const git = async (plugin: PkgInfo): Promise<PluginAdminListResponse> => {
  try {
    /** 本地最新提交哈希 */
    const version = await getLocalCommitHash(plugin.dir, { short: true })
    /** 远程最新提交哈希 */
    const latestHash = await getRemoteCommitHash(plugin.dir, { short: true })
    return {
      type: 'git',
      id: plugin.pkgData.name,
      name: plugin.name,
      version,
      latestVersion: latestHash,
      webConfig: await getWebConfig(plugin.name),
    }
  } catch (error) {
    logger.debug(`获取插件${plugin.name}提交哈希失败`, { cache: error })
    return {
      type: 'git',
      id: plugin.pkgData.name,
      name: plugin.name,
      version: '0.0.0',
      latestVersion: '0.0.0',
      webConfig: await getWebConfig(plugin.name),
    }
  }
}

const npm = async (plugin: PkgInfo): Promise<PluginAdminListResponse> => {
  return {
    type: 'npm',
    id: plugin.pkgData.name,
    name: plugin.name,
    version: plugin.pkgData.version,
    latestVersion: await getNpmLatestVersion(plugin.pkgData.name) || '0.0.0',
    webConfig: defaultWebConfig(),
  }
}

const app = async (plugin: PkgInfo): Promise<PluginAdminListResponse[]> => {
  return plugin.apps.map(v => {
    return {
      type: 'app',
      id: plugin.name,
      name: `${plugin.name}/${path.basename(v)}`,
      version: '',
      latestVersion: '',
      webConfig: defaultWebConfig(),
    }
  })
}

/**
 * 获取插件本地列表`(包含web.config相关配置)`
 * @param isRefresh 是否强制刷新
 * @returns 插件列表
 */
const getPluginLocalList = async (isRefresh = false): Promise<PluginAdminListResponse[]> => {
  if (!isRefresh) {
    const cachedData = await redis.get(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
  }

  const list: PluginAdminListResponse[] = []
  const plugin = await getPlugins('all', true)

  await Promise.all(plugin.map(async plugin => {
    if (plugin.type === 'git') {
      return list.push(await git(plugin))
    }
    if (plugin.type === 'npm') {
      return list.push(await npm(plugin))
    }
    if (plugin.type === 'app') {
      const result = await app(plugin)
      return list.push(...result)
    }
  }))

  /** 更新Redis缓存，设置过期时间 */
  await redis.set(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY, JSON.stringify(list), {
    EX: REDIS_PLUGIN_LIST_CACHE_EXPIRE,
  })

  return list
}

/**
 * @webui 插件管理 获取插件列表Api
 */
export const getPluginListPluginAdmin: RequestHandler = async (req, res) => {
  try {
    const { isRefresh = false } = req.body
    const result = await getPluginLocalList(isRefresh)
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * @webui 获取已加载命令插件缓存信息列表
 */
export const getLoadedCommandPluginCacheList: RequestHandler = async (_, res) => {
  try {
    const list: LoadedPluginCacheList[] = []
    /**
     * @example
     * ```ts
     * {
     *  'karin-plugin-example': {
     *    'index.ts': ['fnc'],
     *  }
     * }
     * ```
     */
    const map: Record<string, Record<string, { pluginName: string; method: string }[]>> = {}

    cache.command.forEach(plugin => {
      const { name: key } = plugin.pkg
      if (!map[key]) {
        map[key] = {}
      }

      if (!map[key][plugin.file.basename]) {
        map[key][plugin.file.basename] = []
      }

      map[key][plugin.file.basename].push({
        pluginName: plugin.file.name,
        method: plugin.file.method,
      })
    })

    Object.keys(map).forEach(key => {
      const files: LoadedPluginCacheList['files'] = []
      Object.keys(map[key]).forEach(file => {
        files.push({
          fileName: file,
          command: map[key][file],
        })
      })
      list.push({
        name: key,
        files,
      })
    })

    createSuccessResponse(res, list)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * @webui
 * 获取前端已安装插件简约列表
 */
export const getFrontendInstalledPluginList: RequestHandler = async (req, res) => {
  const isRefresh: boolean = req.body.isRefresh || false

  try {
    if (!isRefresh) {
      const cachedData = await redis.get(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND)
      if (cachedData) {
        return createSuccessResponse(res, JSON.parse(cachedData))
      }
    }

    /** 复用同一个获取逻辑 */
    const [list, marketResult] = await Promise.all([
      getPlugins('all', false, isRefresh),
      getPluginMarket(isRefresh),
    ])

    const marketMap: Record<string, KarinPluginType> = {}
    marketResult.plugins.forEach(item => {
      marketMap[item.name] = item
    })

    const result: FrontendInstalledPluginListResponse[] = await Promise.all(
      list.map(
        async item => {
          const [type, name] = item.split(':') as [FrontendInstalledPluginListResponse['type'], string]
          /** 是否在插件市场 */
          const market = marketMap[name]
          const webConfig = await getWebConfig(name)

          return {
            id: name,
            name,
            type,
            isMarketPlugin: !!market,
            description: market?.description || '',
            author: {
              name: market?.author[0].name || '',
              home: market?.author[0].home || '',
              avatar: market?.author[0].avatar || '',
            },
            repoUrl: market?.repo[0].url || '',
            hasConfig: webConfig.defaultComponent,
            hasCustomComponent: false,
          }
        }))

    createSuccessResponse(res, result)
    /** 更新Redis缓存，设置过期时间 */
    await redis.set(REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND, JSON.stringify(result), {
      EX: REDIS_LOCAL_PLUGIN_LIST_CACHE_EXPIRE_FRONTEND,
    })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
