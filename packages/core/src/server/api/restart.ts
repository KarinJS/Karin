import { router } from './router'
import { restartDirect } from '@/utils/system/restart'
import type { RequestHandler } from 'express'
import { createSuccessResponse } from '../utils/response'

const restartRouter: RequestHandler = async (_req, res) => {
  createSuccessResponse(res, null, '指令发送成功')
  restartDirect()
}

router.get('/restart', restartRouter)
