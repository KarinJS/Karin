import { isDev, isTs } from '@/env'
import { getWebConfig, normalizeAuthor } from './config'
import { getPlugins } from '@/plugins/list'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { PkgData } from '@/types'
import type { LocalApiResponse } from '@/types/server/local'
import type { PluginCacheKeyPkg } from '@/core/karin/base'

/**
 * 获取本地已安装插件列表
 */
export const pluginGetLocalList: RequestHandler = async (req, res) => {
  const { isForce } = req.body
  const list = (await getPlugins('all', true, isForce)).filter(item => item.type !== 'apps')
  const result: LocalApiResponse[] = []
  const promise: Promise<void>[] = []
  list.forEach((val) => promise.push(isWebConfigPlugin(val, result)))
  await Promise.all(promise)
  createSuccessResponse(res, result)
}

/**
 * 判断插件是否存在`web.config`
 */
const isWebConfigPlugin = async (cache: PluginCacheKeyPkg, result: LocalApiResponse[]) => {
  const pkg = cache.data

  if (cache.type === 'npm') {
    if (!pkg?.karin?.web) return
    return getWebConfigPlugins(cache, pkg, result)
  }

  if (isTs()) {
    if (!pkg?.karin?.['ts-web']) return
    return getWebConfigPlugins(cache, pkg, result)
  }
}

/**
 * 获取拥有web.config的插件配置
 */
const getWebConfigPlugins = async (
  cache: PluginCacheKeyPkg,
  pkg: PkgData,
  result: LocalApiResponse[]
) => {
  let config = null
  config = await getWebConfig(cache.type, cache.name)
  /** 开发环境下兼容获取根目录的 */
  if (!config && isDev() && cache.type === 'npm') {
    config = await getWebConfig('git', cache.name)
  }

  if (!config || !config.info) return

  result.push({
    ...config.info,
    id: cache.name,
    version: config.info.version ?? pkg.version,
    description: config.info.description ?? pkg.description,
    hasConfig: true,
    type: cache.type,
    author: normalizeAuthor(config.info.author),
  })
}
