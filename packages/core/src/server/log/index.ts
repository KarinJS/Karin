import type { RequestHandler } from 'express'

/**
 * 日志中间件
 */
export const logMiddleware: RequestHandler = async (req, _, next) => {
  logger.debug(
    '[express] 收到请求: \n' +
    `method: ${req.method}\n` +
    `ip: ${req.ip}\n` +
    `path: ${req.path}\n` +
    `headers: ${JSON.stringify(req.headers)}\n` +
    `body: ${JSON.stringify(req.body)}\n`
  )

  next()
}
