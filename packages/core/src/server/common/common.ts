import { authKey } from '@/utils/config'
import { verifyJwt } from '../auth/jwt'
import {
  createAccessTokenExpiredResponse,
  createServerErrorResponse,
  createUnauthorizedResponse,
  HTTPStatusCode
} from '../utils/response'
import type { Request, Response } from 'express'

enum AuthErrorType {
  MissingToken = '鉴权失败: 缺少authorization',
  MissingUserId = '鉴权失败: 缺少x-user-id'
}

/**
 * 统一的token验证函数
 * @param token 令牌
 * @param userId 用户id
 * @param res 响应
 * @returns 是否验证成功
 */
const verifyToken = async (
  token: string | undefined,
  userId: string | undefined,
  res: Response
): Promise<boolean> => {
  if (!token) {
    createUnauthorizedResponse(res, AuthErrorType.MissingToken)
    return false
  }

  if (!userId) {
    /** 尝试明文密码验证 */
    if (authKey() === token) return true
    createUnauthorizedResponse(res, AuthErrorType.MissingUserId)
    return false
  }

  /** 验证jwt */
  const verifyStatus = verifyJwt(token, userId)
  /** JWT验证成功 */
  if (verifyStatus.status === HTTPStatusCode.OK) return true

  /** JWT验证失败后尝试明文密码 */
  if (authKey() === token) return true

  /** 处理各种错误情况 */
  switch (verifyStatus.status) {
    case HTTPStatusCode.Unauthorized:
      createUnauthorizedResponse(res, verifyStatus.data)
      return false
    case HTTPStatusCode.AccessTokenExpired:
      createAccessTokenExpiredResponse(res)
      return false
    case HTTPStatusCode.InternalServerError:
      createServerErrorResponse(res, verifyStatus.data)
      return false
    default:
      createServerErrorResponse(res, '服务器内部错误')
      return false
  }
}

/**
 * http鉴权
 * @public
 */
export const auth = {
  /**
   * get请求鉴权
   * @description 支持请求头中携带`Authorization`字段
   * @description 支持请求参数中携带`token`字段
   * @description 支持明文密码
   */
  getAuth: async (req: Request, res: Response) => {
    const token = req?.headers?.authorization?.replace('Bearer ', '') || req?.query?.token as string
    const userId = req?.headers?.['x-user-id'] as string
    return verifyToken(token, userId, res)
  },

  /**
   * post请求鉴权
   * @description 仅支持请求头中携带`Authorization`字段
   * @description 除了支持jwt之外，还支持明文密码
   */
  postAuth: async (req: Request, res: Response) => {
    const token = req?.headers?.authorization?.replace('Bearer ', '')
    const userId = req?.headers?.['x-user-id'] as string
    return verifyToken(token, userId, res)
  },

  /**
   * 虚拟终端鉴权
   * @param token 令牌
   * @param userId 用户id
   * @returns 是否验证成功
   */
  terminalAuth: (token: string, userId: string) => {
    if (!token || !userId) {
      return false
    }

    const verifyStatus = verifyJwt(token, userId)
    if (verifyStatus.status === HTTPStatusCode.OK) {
      return true
    }

    return false
  }
}
