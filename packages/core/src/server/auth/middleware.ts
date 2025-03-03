import { auth } from '@/server/auth'
import { createMethodNotAllowedResponse } from '@/server/utils/response'
import type { Request, Response, NextFunction } from 'express'

/**
 * 鉴权中间件
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  logger.trace(
    '[express] 收到请求: \n' +
    `method: ${req.method}\n` +
    `ip: ${req.ip}\n` +
    `path: ${req.path}\n` +
    `headers: ${JSON.stringify(req.headers)}\n` +
    `body: ${JSON.stringify(req.body)}\n`
  )

  /** 白名单 */
  if (
    req.path === '/ping' ||
    req.path === '/login' ||
    req.path === '/refresh' ||
    req.path.startsWith('/console')
  ) {
    next()
    return
  }

  if (req.method === 'POST') {
    const verify = await auth.postAuth(req, res)
    if (!verify) return
  } else if (req.method === 'GET') {
    const verify = await auth.getAuth(req, res)
    if (!verify) return
  } else {
    createMethodNotAllowedResponse(res)
    return
  }

  next()
}
