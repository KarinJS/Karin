import { updatePkg } from '@/utils/system'

import { createServerErrorResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 更新karin
 */
export const updateCoreRouter: RequestHandler = async (_req, res) => {
  console.log('收到更新请求')
  const result = await updatePkg('node-karin')
  if (result.status === 'ok') {
    createSuccessResponse(res, result, '更新成功')
  } else {
    createServerErrorResponse(res, '更新失败，请检查日志')
  }
}
