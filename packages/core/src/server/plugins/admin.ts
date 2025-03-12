import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'
import type { RequestHandler } from 'express'

/**
 * 更新插件
 */
export const pluginUpdate: RequestHandler = async (req, res) => {
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
