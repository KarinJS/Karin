import { getAllBotList } from '@/service/bot'
import { createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'

/**
 * 获取所有bot列表
 */
export const getBotsRouter: RequestHandler = async (_, res) => {
  const bots = getAllBotList().map(bot => ({
    index: bot.index,
    selfId: bot.bot.selfId,
  }))
  createSuccessResponse(res, bots)
}
