// import { getBotCount } from '@karinjs/core'
import { createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 获取所有bot列表
 */
export const getBotsRouter: RequestHandler = async (_, res) => {
  // TODO
  createSuccessResponse(res, 0)
}
