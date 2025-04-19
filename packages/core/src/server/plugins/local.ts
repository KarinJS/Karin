import { isDev, isTs } from '@/env'
import { getWebConfig, normalizeAuthor } from './config'
import { getPlugins } from '@/plugin/list'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
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
  await Promise.allSettled(list.map(async (val) => {
    const pkg = val.pkgData
    if (isTs() && pkg.karin?.['ts-web']) {
      let config = await getWebConfig(val.type, val.name)
      /** 开发环境下兼容获取根目录的 */
      if (!config && isDev()) {
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
      return
    }

    if (pkg.karin?.web) {
      let config = await getWebConfig(val.type, val.name)
      /** 开发环境下兼容获取根目录的 */
      if (!config && isDev()) {
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
  }))

  createSuccessResponse(res, result)
}
