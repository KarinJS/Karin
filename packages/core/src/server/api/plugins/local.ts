import { isTs } from '@/env'
import { getPlugins } from '@/plugin/list'
import { router } from '@/server/api/router'
import { createSuccessResponse } from '@/server/utils/response'
import type { RequestHandler } from 'express'

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
  const result: string[] = []
  list.forEach((val) => {
    const pkg = val.pkgData
    if (isTs() && pkg.karin?.['ts-web']) {
      result.push(val.name)
      return
    }

    if (pkg.karin?.web) {
      result.push(val.name)
    }
  })

  createSuccessResponse(res, result)
}

router.post('/plugin/local', getLocalList)
