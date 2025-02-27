import { auth } from './auth'
import { createServerErrorResponse, createUnauthorizedResponse } from './utils/response'
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

  const Pass = auth.getAuth(req) || auth.postAuth(req)

  if (req.path === '/ping' || req.path.startsWith('/console')) {
    next()
    return
  }

  if (!Pass && req.path === '/login') {
    createServerErrorResponse(res, 'HTTP 鉴权密钥错误')
    return
  }

  if (!Pass) {
    createUnauthorizedResponse(res, '鉴权失败 / check failed')
    logger.error(`[express][${req.ip}] 鉴权错误: /api/v1/${req.path}`)
    return
  }

  next()
}
