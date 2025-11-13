// import { restartDirect, processExit } from '@karinjs/utils'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 重启karin
 */
export const restartRouter: RequestHandler = async (req, res) => {
  try {
    const { isPm2 = false, reloadDeps = false } = req.body
    // restartDirect({ isPm2, reloadDeps })
    createSuccessResponse(res, null, '重启指令发送成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
  }
}

/**
 * 退出karin
 */
export const exitRouter: RequestHandler = async (_req, res) => {
  logger.mark('收到退出请求，正在退出...')
  createSuccessResponse(res, null, '退出指令发送成功')
  // await processExit(0, true)
}
