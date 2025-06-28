import { getBotCount } from '@/service/bot'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'

/**
 * 获取所有bot列表
 */
export const getBotsRouter: RequestHandler = async (_, res) => {
  createSuccessResponse(res, getBotCount())
}
