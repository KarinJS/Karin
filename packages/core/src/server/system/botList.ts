import { getAllBotList } from '@/service/bot'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'

/**
 * 获取所有bot列表
 */
export const getBotsRouter: RequestHandler = async (req, res) => {
  createSuccessResponse(res, getAllBotList())
}
