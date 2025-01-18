import { router } from './router'
import { updateLevel } from '@/utils/config'
import { createBadRequestResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 临时修改当前日志等级 重启后恢复
 */

const logRouter: RequestHandler = async (req, res) => {
  const level = req.body?.level
  const list = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

  if (!level || !list.includes(level)) {
    return createBadRequestResponse(res, '参数错误')
  }

  updateLevel(level)
  createSuccessResponse(res, null, '成功')
}

router.post('/log_level', logRouter)
