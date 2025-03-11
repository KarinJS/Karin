import {
  refreshAccessToken,
  verifyRefreshToken
} from '@/server/auth/jwt'
import {
  createSuccessResponse,
  createBadRequestResponse,
  createUnauthorizedResponse,
  createServerErrorResponse,
  createRefreshTokenExpiredResponse
} from '@/server/utils/response'

import type { RequestHandler } from 'express'

/**
 * 刷新访问令牌
 * @param req 请求
 * @param res 响应
 * @returns 响应
 */
export const refreshRouter: RequestHandler = async (req, res) => {
  try {
    const { accessToken, refreshToken } = (req.body || {}) as { accessToken: string, refreshToken: string }
    if (!accessToken || !refreshToken) return createBadRequestResponse(res)

    const { status, data } = verifyRefreshToken(refreshToken, accessToken)
    if (!status) {
      if (data.includes('过期')) {
        return createRefreshTokenExpiredResponse(res)
      }
      return createUnauthorizedResponse(res, data)
    }

    const newAccessToken = refreshAccessToken(data)
    logger.mark(`[refresh] 刷新成功: ${accessToken} -> ${newAccessToken}`)
    createSuccessResponse(res, { accessToken: newAccessToken }, '刷新成功')
  } catch (error) {
    logger.error(error)
    createServerErrorResponse(res, error instanceof Error ? error.message : '服务器错误')
  }
}
