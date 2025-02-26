import { auth } from './auth'
import { createUnauthorizedResponse } from './utils/response'
import type { Request, Response, NextFunction } from 'express'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.trace(
    '[express] 收到请求: \n' +
    `method: ${req.method}\n` +
    `ip: ${req.ip}\n` +
    `path: ${req.path}\n` +
    `headers: ${JSON.stringify(req.headers)}\n` +
    `body: ${JSON.stringify(req.body)}\n`
  )

  if (req.path === '/ping' || req.path.startsWith('/console')) {
    next()
    return
  }

  if (!auth.getAuth(req)) {
    createUnauthorizedResponse(res, '错误的token')
    logger.error(`[express][${req.ip}] 鉴权错误: /api/v1/${req.path}`)
    return
  }

  next()
}
