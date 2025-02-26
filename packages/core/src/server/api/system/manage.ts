import { router } from '../router'
import { restartDirect } from '@/utils/system/restart'
import { createSuccessResponse } from '../../utils/response'

import type { RequestHandler } from 'express'

const restartRouter: RequestHandler = async (_req, res) => {
  createSuccessResponse(res, null, '指令发送成功')
  restartDirect()
}

const exitRouter: RequestHandler = async (_req, res) => {
  logger.mark('收到退出请求，正在退出...')
  createSuccessResponse(res, null, '退出成功')
  const { processExit } = await import('@/core/internal/process')
  await processExit(0)
}

router.post('/exit', exitRouter)
router.post('/restart', restartRouter)
