import axios from 'axios'
import { URL } from 'node:url'
import { getPlugins } from '@/plugin/system/list'
import { getPluginMarket } from '@/plugin/system'
import { getFastRegistry, getPackageJson } from '@/utils/request'
import { createSuccessResponse, createServerErrorResponse } from '@/server/utils/response'
import { REDIS_PLUGIN_MARKET_LIST_CACHE_KEY, REDIS_PLUGIN_MARKET_LIST_CACHE_EXPIRE } from '@/env/key/redis'

import type { RequestHandler } from 'express'
import type { KarinPluginType } from '@karinjs/plugins-list'
import type {
  PkgInfo,
  PluginMarketAuthor,
  PluginMarketRequest,
  PluginMarketResponse,
} from '@/types'

/**
 * @webui 插件市场 获取插件列表
 */
export const getPluginMarketList: RequestHandler<null, null, PluginMarketRequest> = async (req, res) => {
  try {
    const list: PluginMarketResponse[] = []
    const isForce = Boolean(req.body.refresh ?? false)

    if (!isForce) {
      const cache = await getCache()
      if (cache) {
        return createSuccessResponse(res, JSON.parse(cache))
      }
    }

    const [
      local,
      { plugins: market },
    ] = await Promise.all([getPlugins('all', true), getPluginMarket(isForce)])

    const registry = await getFastRegistry()
    handleLocalPlugins(list, local, market)
    await handleMarketPlugins(list, local, market, registry)

    setCache(list)
    return createSuccessResponse(res, list)
  } catch (error) {
    logger.error(error)
    return createServerErrorResponse(res, (error as Error).message)
  }
}

/**
 * 获取缓存
 */
const getCache = async () => {
  const { redis } = await import('@/core/db/redis/redis')
  const cache = await redis.get(REDIS_PLUGIN_MARKET_LIST_CACHE_KEY)
  return cache
}

/**
 * 设置缓存
 */
const setCache = async (data: PluginMarketResponse[]) => {
  const { redis } = await import('@/core/db/redis/redis')
  await redis.set(
    REDIS_PLUGIN_MARKET_LIST_CACHE_KEY,
    JSON.stringify(data),
    { EX: REDIS_PLUGIN_MARKET_LIST_CACHE_EXPIRE }
  )
}

/**
 * 已安装但未在插件市场中的插件
 * @param list 插件市场列表
 * @param local 已安装插件列表
 * @param market 插件市场列表
 */
const handleLocalPlugins = (
  list: PluginMarketResponse[],
  local: PkgInfo[],
  market: KarinPluginType[]
) => {
  const localPlugins = local.filter(plugin => !market.some(m => m.name === plugin.name))

  for (const plugin of localPlugins) {
    const author = getAuthorInfo()
    const local: PluginMarketResponse['local'] = {
      name: plugin.name,
      installed: true,
      type: plugin.type,
      version: '',
      description: '',
      home: '',
    }

    if (plugin.type !== 'app') {
      const pkg = plugin.pkgData
      local.version = pkg.version
      local.description = pkg.description
      local.home = pkg.homepage || pkg?.repository?.url

      if (local.home) {
        const url = new URL(local.home)
        const [owner] = url.pathname.split('/').filter(Boolean)
        author.name = pkg.author || owner
        author.home = `${url.origin}/${owner}`
        if (url.hostname.includes('github') || url.hostname.includes('gitee')) {
          author.avatar = `${url.origin}/${owner}.png`
        }
      }
    }

    list.push({ type: 'local', local, author })
  }
}

/**
 * 处理插件市场的插件
 * @param list 插件市场列表
 * @param local 已安装插件列表
 * @param market 插件市场列表
 * @param registry 注册源
 */
const handleMarketPlugins = async (
  list: PluginMarketResponse[],
  local: PkgInfo[],
  market: KarinPluginType[],
  registry: string
) => {
  await Promise.all(market.map(async (plugin) => {
    const data: PluginMarketResponse['local'] = {
      installed: false,
      type: plugin.type,
      version: '',
      name: plugin.name,
      description: plugin.description,
      home: plugin.home,
    }

    /** 检查是否已经安装 返回安装的插件 */
    const pkg = local.find(p => p.name === plugin.name)
    if (pkg) {
      data.installed = true
      data.type = pkg.type
      data.version = pkg.pkgData.version
    } else {
      data.version = await handlePluginVersion(plugin, registry)
    }

    const author = getAuthorInfo()
    if (plugin.author?.length) {
      author.name = plugin.author[0].name
      author.home = plugin.author[0].home
      author.avatar = plugin.author[0].avatar || `${plugin.author[0].home}.png`
    }

    list.push({ type: 'market', market: plugin, local: data, author })
  }))
}

/**
 * 获取默认作者信息
 */
const getAuthorInfo = (): PluginMarketAuthor => {
  /** 嘿嘿嘿，三月七天下第一可爱^_^ */
  return {
    name: '神秘的三月七',
    home: '',
    avatar: 'https://bbs-static.miyoushe.com/static/2025/03/05/fed22237b02cf398ef993b98b83989b3_7330898026089067872.png',
  }
}

/**
 * 处理插件的版本
 * @param plugin 插件
 * @param registry 注册源
 * @returns 返回插件的版本
 */
const handlePluginVersion = async (plugin: KarinPluginType, registry: string) => {
  if (plugin.type === 'npm') {
    const result = await axios.get(`${registry}/${plugin.name}/latest`)
    if (result) {
      return result.data.version
    }
  } else {
    const github = plugin.repo.find(r => r.type === 'github')
    if (github) {
      const [owner, repo] = new URL(github.url).pathname.split('/').filter(Boolean)
      const { version } = await getPackageJson(owner, repo)
      return version
    }
    return '0.0.0'
  }
}
