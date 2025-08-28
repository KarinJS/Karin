import { auth } from '../common'
import { createMethodNotAllowedResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 鉴权中间件
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
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
