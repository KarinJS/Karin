import { auth, loginAuth } from './auth'
import { createResponse, createUnauthorizedResponse, HTTPStatusCode } from './utils/response'
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

  const checkResult = await auth.getAuth(req) || await auth.postAuth(req)
  /** 是否鉴权通过 */
  const Pass = checkResult.status

  if (req.path === '/ping' || req.path.startsWith('/console')) {
    next()
    return
  }

  const loginPass = await loginAuth(req)
  if (!loginPass && req.path === '/login') {
    createResponse(res, HTTPStatusCode.InternalServerError, { e: 'HTTP 鉴权密钥错误' }, 'HTTP 鉴权密钥错误')
    return
  }

  if (!Pass && req.path !== '/login') {
    createUnauthorizedResponse(res, '鉴权失败 / check failed')
    logger.error(`[express][${req.ip}] 鉴权错误: /api/v1/${req.path}`)
    return
  }

  // 如果响应内有新的令牌，则传递给前端
  if (checkResult.newToken) {
    res.setHeader('authorization', checkResult.newToken)
  }

  next()
}
