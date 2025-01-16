import { createSuccessResponse } from '../utils/response'
import { router } from './router'
import type { RequestHandler } from 'express'

const loginRouter: RequestHandler = async (_req, res) => {
  createSuccessResponse(res, null, '登录成功')
}

router.get('/login', loginRouter)
