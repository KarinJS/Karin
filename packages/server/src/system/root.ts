import { createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 根路由
 */
export const rootRouter: RequestHandler = async (_req, res) => {
  createSuccessResponse(res, null, '雪霁银妆素，桔高映琼枝。')
}
