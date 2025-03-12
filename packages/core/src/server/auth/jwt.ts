import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { authKey } from '@/utils/config'
import { HTTPStatusCode } from '../utils/response'

import type { JwtVerifyResult } from '@/types/server/auth'

// 访问令牌 7天
const EXPIRES_IN = (process.env.EXPIRES_IN || '7d') as '7d'
// 刷新令牌 30天
const REFRESH_EXPIRES_IN = '30d'
/** 鉴权密钥 */
let secretOrPrivateKey = ''

/**
 * 初始化鉴权密钥
 */
export const initSecretOrPrivateKey = () => {
  if (!secretOrPrivateKey) {
    secretOrPrivateKey = crypto.createHash('sha256').update(authKey()).digest('hex')
  }
}

/**
 * 获取鉴权密钥
 * @returns 鉴权密钥
 */
export const getSecretOrPrivateKey = () => {
  initSecretOrPrivateKey()
  return secretOrPrivateKey
}

/**
 * 收到登录请求时，生成 JWT 令牌
 * @description 需要先验证传递的token是否正确再调用此方法
 * @returns 用户id和jwt 每次请求都需要携带
 */
export const createJwt = (): {
  /** 用户id */
  userId: string,
  /** 访问令牌 */
  accessToken: string,
  /** 刷新令牌 */
  refreshToken: string
} => {
  initSecretOrPrivateKey()
  const userId = crypto.randomUUID()
  /** 生成访问令牌 */
  const accessToken = jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: EXPIRES_IN })
  /** 生成刷新令牌 */
  const refreshToken = jwt.sign({ userId, accessToken }, secretOrPrivateKey, { expiresIn: REFRESH_EXPIRES_IN })
  return { userId, accessToken, refreshToken }
}

/**
 * 验证jwt
 * @param token jwt
 * @param userId 用户id
 * @returns 用户id
 */
export const verifyJwt = (
  token: string,
  userId: string
): JwtVerifyResult => {
  try {
    initSecretOrPrivateKey()
    const decoded = jwt.verify(token, secretOrPrivateKey) as { userId: string }
    if (decoded.userId === userId) {
      return { status: HTTPStatusCode.OK, data: decoded.userId }
    }

    return { status: HTTPStatusCode.Unauthorized, data: 'jwt鉴权失败 用户id不匹配' }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        return { status: HTTPStatusCode.AccessTokenExpired, data: 'jwt令牌已过期' }
      }

      return { status: HTTPStatusCode.Unauthorized, data: 'jwt鉴权失败 请登录' }
    }

    logger.error(error)
    return { status: HTTPStatusCode.InternalServerError, data: '服务器内部错误' }
  }
}

/**
 * 验证刷新令牌
 * @param token 刷新令牌
 * @param expiredToken 过期令牌
 * @returns 是否验证成功
 */
export const verifyRefreshToken = (
  token: string,
  expiredToken: string
) => {
  try {
    initSecretOrPrivateKey()
    const decoded = jwt.verify(token, secretOrPrivateKey) as { userId: string, accessToken: string }
    if (decoded.accessToken === expiredToken) {
      return { status: true, data: decoded.userId }
    }

    return { status: false, data: '无效令牌' }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { status: false, data: '刷新令牌已过期' }
    }

    logger.error(error)
    return { status: false, data: '服务器内部错误' }
  }
}

/**
 * 刷新访问令牌
 * @param userId 用户id
 * @returns 访问令牌
 */
export const refreshAccessToken = (userId: string) => {
  initSecretOrPrivateKey()
  const accessToken = jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: EXPIRES_IN })
  return accessToken
}

/**
 * 更新缓存
 */
export const updateJwt = () => {
  secretOrPrivateKey = crypto.createHash('sha256').update(authKey()).digest('hex')
}
