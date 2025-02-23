import { isTs } from '@/env'
import { getWebConfig } from './config'
import { getPlugins } from '@/plugin/list'
import { router } from '@/server/api/router'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { LocalApiResponse } from '@/types/server/local'

/**
 * 获取本地已安装插件列表
 */
const getLocalList: RequestHandler = async (req, res) => {
  const { isForce } = req.body
  const [npm, git] = await Promise.all([
    getPlugins('npm', true, isForce ?? false),
    getPlugins('git', true, isForce ?? false)
  ])

  const list = [...npm, ...git]
  const result: LocalApiResponse[] = []
  await Promise.allSettled(list.map(async (val) => {
    const pkg = val.pkgData
    if (isTs() && pkg.karin?.['ts-web']) {
      const config = await getWebConfig(val.type, val.name)
      if (config && config.info) {
        result.push({
          ...config.info,
          id: val.name,
          version: config.info.version ?? pkg.version,
          description: config.info.description ?? pkg.description,
          hasConfig: true,
          type: val.type
        })
      }
      return
    }

    if (pkg.karin?.web) {
      const config = await getWebConfig(val.type, val.name)
      if (config && config.info) {
        result.push({
          ...config.info,
          id: val.name,
          version: config.info.version ?? pkg.version,
          description: config.info.description ?? pkg.description,
          hasConfig: true,
          type: val.type
        })
      }
    }
  }))

  createSuccessResponse(res, result)
}

router.post('/plugin/local', getLocalList)
