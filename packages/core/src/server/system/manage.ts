import { restartDirect } from '@/utils/system/restart'
import { createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 重启karin
 */
export const restartRouter: RequestHandler = async (_req, res) => {
  createSuccessResponse(res, null, '重启指令发送成功')
  restartDirect()
}

/**
 * 退出karin
 */
export const exitRouter: RequestHandler = async (_req, res) => {
  logger.mark('收到退出请求，正在退出...')
  createSuccessResponse(res, null, '退出指令发送成功')
  const { processExit } = await import('@/core/internal/process')
  await processExit(0)
}
