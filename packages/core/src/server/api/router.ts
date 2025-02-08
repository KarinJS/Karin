import express from 'express'
import { Router } from 'express'
import { authMiddleware } from '../middleware'

/**
 * karin-api 路由
 */
export const router: Router = Router()

/** 鉴权 */
router.use(authMiddleware)
router.use(express.json())

router.use((req, res, next) => {
  logger.debug(
    '[router] 收到请求: \n' +
    `method: ${req.method}\n` +
    `ip: ${req.ip}\n` +
    `path: ${req.path}\n` +
    `headers: ${JSON.stringify(req.headers)}\n` +
    `body: ${JSON.stringify(req.body)}\n`
  )
  next()
})
