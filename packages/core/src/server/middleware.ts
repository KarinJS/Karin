import { auth } from './auth'
import { Request, Response, NextFunction } from 'express'
import { createUnauthorizedResponse } from './utils/response'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.debug(
    '[express] 收到请求: \n' +
    `method: ${req.method}\n` +
    `ip: ${req.ip}\n` +
    `path: ${req.path}\n` +
    `headers: ${JSON.stringify(req.headers)}\n` +
    `body: ${JSON.stringify(req.body)}\n`
  )

  if (req.path.startsWith('/api')) {
    if (req.path === '/api/v1/ping' || req.path.startsWith('/api/v1/console')) {
      next()
      return
    }
    if (!auth.getAuth(req)) {
      createUnauthorizedResponse(res, '错误的token')
      return
    }
  }

  next()
}
