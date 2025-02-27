import { router } from '../router'
import { createSuccessResponse } from '../../utils/response'
import { level } from '@/index'
import type { RequestHandler } from 'express'
import { authKey } from '@/utils/config'
import crypto from 'crypto'

const loginRouter: RequestHandler = async (_req, res) => {
  const uToken = authKey()
  const hashedData = crypto.createHash('sha256').update(uToken).digest('hex')
  let authorization = ''
  if (_req.body.password === hashedData) {
    authorization = await level.get(`HTTP_AUTH_TOKEN:${uToken}`)
  }
  createSuccessResponse(res, { authorization }, '登录成功')
}

router.post('/login', loginRouter)
