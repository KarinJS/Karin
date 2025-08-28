import { responseUtils } from '../utils'
import { getPluginWebConfig, getSystemConfig, setPluginWebConfig, setSystemConfig } from '../config'

import type { RequestHandler } from 'express'
import type { SetSystemConfig } from '../config/system'

/**
 * 获取 `karin` 系统配置路由
 * @code 200 500
 */
export const getSystemConfigRouter: RequestHandler<null, null, { type: string }> = async (req, res) => {
  try {
    const cfg = await getSystemConfig(req.body.type)

    if (!cfg) {
      return responseUtils.createBadRequestResponse(res, '无效的配置类型')
    }

    return responseUtils.createSuccessResponse(res, cfg)
  } catch (error) {
    return responseUtils.createServerErrorResponse(res, (error as Error).message)
  }
}

/**
 * 设置 `karin` 系统配置路由
 * @code 200 400
 */
export const setSystemConfigRouter: RequestHandler<null, null, { type: SetSystemConfig; data: Record<string, any> }> = async (req, res) => {
  try {
    const { type, data } = req.body
    const result = await setSystemConfig(type, data)

    if (!result) {
      return responseUtils.createBadRequestResponse(res, '无效的配置类型')
    }

    return responseUtils.createSuccessResponse(res, '配置已更新')
  } catch (error) {
    logger.debug(new Error('设置系统配置失败', { cause: error }))
    return responseUtils.createServerErrorResponse(res, (error as Error).message)
  }
}

/**
 * 获取插件的 `webconfig` 配置数据
 * @code 200
 */
export const getPluginWebConfigRouter: RequestHandler<null, null, { pluginName: string }> = async (req, res) => {
  try {
    const name = req.body.pluginName
    if (!name) {
      throw new Error('插件名称不能为空')
    }
    const result = await getPluginWebConfig(name)
    responseUtils.createSuccessResponse(res, result)
  } catch (error) {
    logger.debug(new Error('获取插件Web配置失败', { cause: error }))
    responseUtils.createSuccessResponse(res, { status: false, data: (error as Error).message })
  }
}

/**
 * 设置插件的 `webconfig` 配置数据
 * @code 200 400
 */
export const setPluginWebConfigRouter: RequestHandler<null, null, { pluginName: string, config: Record<string, any> }> = async (req, res) => {
  try {
    const { pluginName, config } = req.body
    if (!pluginName || !config) {
      throw new Error('插件名称和配置不能为空')
    }

    const result = await setPluginWebConfig(pluginName, config)
    responseUtils.createSuccessResponse(res, result)
  } catch (error) {
    logger.debug(new Error('设置插件Web配置失败', { cause: error }))
    responseUtils.createSuccessResponse(res, { status: false, data: (error as Error).message })
  }
}
