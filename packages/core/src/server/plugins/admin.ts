import {
  createServerErrorResponse,
  createSuccessResponse,
} from '@/server/utils/response'
import type { RequestHandler } from 'express'
import type {
  PluginAdminInstall,
  PluginAdminUninstall,
  PluginAdminUpdate,
} from '@/types/task'

/**
 * 更新插件
 */
export const pluginUpdate: RequestHandler<null, null, PluginAdminUpdate> = async (req, res) => {
  try {
    const { name } = req.body
    console.log(`updatePlugin: ${name}`)
    // 实现插件更新逻辑
    createSuccessResponse(res, { success: true })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 卸载插件
 */
export const pluginUninstallRouter: RequestHandler<null, null, PluginAdminUninstall> = async (req, res) => {
  try {
    const { name } = req.body
    console.log(`uninstallPlugin: ${name}`)
    createSuccessResponse(res, { success: true })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 安装插件
 */
export const pluginInstallRouter: RequestHandler<null, null, PluginAdminInstall> = async (req, res) => {
  try {
    const { name } = req.body
    console.log(`installPlugin: ${name}`)
    createSuccessResponse(res, { success: true })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
