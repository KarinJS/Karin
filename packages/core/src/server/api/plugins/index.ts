import { router } from '@/server/api/router'
import { getPlugins } from '@/plugin/list'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { GetPluginType } from '@/types/plugin'

/**
 * 获取已安装插件列表详情
 * @description 获取插件列表详情，包含插件的基本信息
 */
const getPluginListRouter: RequestHandler = async (req, res) => {
  try {
    const { type = 'all' } = req.query as { type?: GetPluginType }
    const plugins = await getPlugins(type, true)
    createSuccessResponse(res, plugins)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

router.post('/plugin/list', getPluginListRouter)
