import { router } from './router'
import type { RequestHandler } from 'express'
import { createSuccessResponse } from '../utils/response'

const exitRouter: RequestHandler = async (_req, res) => {
  logger.mark('收到退出请求，正在退出...')
  createSuccessResponse(res, null, '退出成功')
  const { processExit } = await import('@/core/internal/process')
  await processExit(0)
}

router.post('/exit', exitRouter)
