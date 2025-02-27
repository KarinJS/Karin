import { router } from '../router'
import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse
} from '@/server/utils/response'
import { createJwt, getSecretOrPrivateKey } from '@/server/utils/jwt'

import type { RequestHandler } from 'express'

/**
 * 登录
 * @param req 请求
 * @param res 响应
 * @returns 响应
 * @description 登录成功后，返回用户id、访问令牌和刷新令牌
 */
const loginRouter: RequestHandler = async (req, res) => {
  try {
    const { authorization } = req.body || {}
    const tips = '密码错误'
    if (!authorization) return createBadRequestResponse(res, tips)

    const token = authorization?.replace('Bearer ', '')
    if (!token || token !== getSecretOrPrivateKey()) return createBadRequestResponse(res, tips)

    const { userId, accessToken, refreshToken } = createJwt()

    createSuccessResponse(res, { userId, accessToken, refreshToken }, '登录成功')
  } catch (error) {
    logger.error(error)
    createServerErrorResponse(res, error instanceof Error ? error.message : '服务器错误')
  }
}

router.post('/login', loginRouter)
