import { isDev, isTs } from '@/env'
import { getWebConfig, normalizeAuthor } from './config'
import { getPlugins } from '@/plugin/system/list'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { PkgData, PkgInfo } from '@/types'
import type { LocalApiResponse } from '@/types/server/local'

/**
 * 获取本地已安装插件列表
 */
export const pluginGetLocalList: RequestHandler = async (req, res) => {
  const { isForce } = req.body
  const [npm, git] = await Promise.all([
    getPlugins('npm', true, isForce ?? false),
    getPlugins('git', true, isForce ?? false),
  ])

  const list = [...npm, ...git]
  const result: LocalApiResponse[] = []
  const promise: Promise<void>[] = []
  list.forEach((val) => promise.push(isWebConfigPlugin(val, result)))
  await Promise.all(promise)
  createSuccessResponse(res, result)
}

/**
 * 判断插件是否存在`web.config`
 */
const isWebConfigPlugin = async (val: PkgInfo, result: LocalApiResponse[]) => {
  const pkg = val.pkgData

  if (val.type === 'npm') {
    if (!pkg.karin?.web) return
    return getWebConfigPlugins(pkg, val, result)
  }

  if (isTs()) {
    if (!pkg.karin?.['ts-web']) return
    return getWebConfigPlugins(pkg, val, result)
  }
}

/**
 * 获取拥有web.config的插件配置
 */
const getWebConfigPlugins = async (
  pkg: PkgData,
  val: PkgInfo,
  result: LocalApiResponse[]
) => {
  let config = null
  config = await getWebConfig(val.type, val.name)
  /** 开发环境下兼容获取根目录的 */
  if (!config && isDev() && val.type === 'npm') {
    config = await getWebConfig('git', val.name)
  }

  if (!config || !config.info) return

  result.push({
    ...config.info,
    id: val.name,
    version: config.info.version ?? pkg.version,
    description: config.info.description ?? pkg.description,
    hasConfig: true,
    type: val.type,
    author: normalizeAuthor(config.info.author),
  })
}
