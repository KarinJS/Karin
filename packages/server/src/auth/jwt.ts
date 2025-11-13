import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
// import { authKey } from '@karinjs/utils'
import { HTTPStatusCode } from '../utils/response'

/** JWT验证基础接口 */
export interface JwtVerifyBase {
  /** 状态码 */
  status: number
  /** 返回数据 */
  data: string
}

/** 鉴权成功 */
export interface JwtVerifySuccess extends JwtVerifyBase {
  status: 200
  /** 用户id */
  data: string
}

/** 鉴权失败 */
export interface JwtVerifyUnauthorized extends JwtVerifyBase {
  status: 401
  /** 错误信息 */
  data: string
}

/** 令牌过期 */
export interface JwtVerifyExpired extends JwtVerifyBase {
  status: 419
  /** 错误信息 */
  data: string
}

/** 服务器错误 */
export interface JwtVerifyError extends JwtVerifyBase {
  status: 500
  /** 错误信息 */
  data: string
}

/** JWT验证返回类型 */
export type JwtVerifyResult =
  | JwtVerifySuccess
  | JwtVerifyUnauthorized
  | JwtVerifyExpired
  | JwtVerifyError

// 访问令牌 7天
const EXPIRES_IN = (process.env.EXPIRES_IN || '7d') as '7d'
// 刷新令牌 30天
const REFRESH_EXPIRES_IN = '30d'
/** 鉴权密钥 */
const secretOrPrivateKey = ''

/**
 * 初始化鉴权密钥
 */
export const initSecretOrPrivateKey = () => {
  if (!secretOrPrivateKey) {
    // secretOrPrivateKey = crypto.createHash('sha256').update(authKey()).digest('hex')
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
  const accessToken = jwt.sign({ userId, type: 'access' }, secretOrPrivateKey, { expiresIn: EXPIRES_IN })
  /** 生成刷新令牌 - 只包含userId，不再绑定特定accessToken */
  const refreshToken = jwt.sign({ userId, type: 'refresh' }, secretOrPrivateKey, { expiresIn: REFRESH_EXPIRES_IN })
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
 * @returns 是否验证成功
 */
export const verifyRefreshToken = (token: string) => {
  try {
    initSecretOrPrivateKey()

    const decoded = jwt.verify(token, secretOrPrivateKey) as { userId: string, type: string }
    if (decoded && decoded.userId && decoded.type === 'refresh') {
      return { status: true, data: decoded.userId }
    }

    return { status: false, data: '无效令牌' }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        return { status: false, data: '刷新令牌已过期' }
      }
      return { status: false, data: '无效的刷新令牌' }
    }

    logger.error(error)
    return { status: false, data: '服务器内部错误' }
  }
}

/**
 * 刷新访问令牌
 * @param userId 用户id
 * @returns 新的访问令牌
 */
export const refreshAccessToken = (userId: string) => {
  initSecretOrPrivateKey()
  // 只生成新的访问令牌，不再生成新的刷新令牌
  const accessToken = jwt.sign({ userId }, secretOrPrivateKey, { expiresIn: EXPIRES_IN })
  return accessToken
}

/**
 * 更新缓存
 */
export const updateJwt = () => {
  // secretOrPrivateKey = crypto.createHash('sha256').update(authKey()).digest('hex')
}
