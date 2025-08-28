import type { RequestHandler } from 'express'
import { createSuccessResponse } from '../utils/response'

/**
 * ping路由
 */
export const pingRouter: RequestHandler = (_req, res) => {
  createSuccessResponse(
    res,
    {
      ping: 'pong',
    },
    '成功'
  )
}
