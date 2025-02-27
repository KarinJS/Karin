import { authKey } from '@/utils/config'
import jwt from 'jsonwebtoken'
import type { Request } from 'express'
import { level } from '@/index'
import crypto from 'node:crypto'

/**
 * 用户登录鉴权
 * @param req 请求对象
 * @returns
 */
export const loginAuth = async (req: Request): Promise<boolean> => {
  const token = req?.headers?.password as string
  if (!token) return false
  const uToken = authKey()
  const hashedData = crypto.createHash('sha256').update(uToken).digest('hex')
  if (token === hashedData) {
    const payload = { userId: uToken, passWord: hashedData }
    const jwtToken = await setToken2Level(payload, payload.userId)
    await level.set(`HTTP_AUTH_TOKEN:${uToken}`, jwtToken)
    return true
  }
  return false
}

/**
 * 生成 JWT 令牌
 * @param payload payload
 * @param token 鉴权密钥
 * @returns JWT 令牌
 */
const setToken2Level = async (payload: { userId: string, passWord: string }, token: string): Promise<string> => {
  const secretKey = jwt.sign(payload, token, { expiresIn: '3h' })
  await level.set(`HTTP_AUTH_TOKEN:${payload.userId}`, secretKey)
  return secretKey
}

/**
 * 验证 JWT 令牌
 * @param secreKey 加密后的 JWT 令牌
 * @param token 鉴权密钥
 * @returns 该 JWT 令牌是否匹配该密钥
 */
const verifyToken = async (secreKey: string, token: string): Promise<{ status: boolean, newToken?: string }> => {
  const uToken = authKey()
  const cacheSecreKey = await level.get(`HTTP_AUTH_TOKEN:${uToken}`)

  if (secreKey === cacheSecreKey || token === uToken) {
    try {
      const isValid = !!jwt.verify(secreKey, token)
      if (!isValid) return { status: false }
      return { status: true }
    } catch {
      logger.debug(logger.yellow('网页登录令牌已过期，将重新重新生成令牌'))
      const newsecreKey = crypto.createHash('sha256').update(token).digest('hex')
      const payload = { userId: uToken, passWord: newsecreKey }
      const newJwtToken = await setToken2Level(payload, payload.userId)
      return { status: true, newToken: newJwtToken }
    }
  }
  return { status: false }
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
   */
  getAuth: async (req: Request) => {
    const secreKey = req?.headers?.authorization?.replace('Bearer ', '') || req?.query?.token as string
    if (!secreKey) return { status: false }
    const uToken = authKey()
    const verifyStatus = await verifyToken(secreKey, uToken)
    return verifyStatus
  },

  /**
   * post请求鉴权
   * @description 仅支持请求头中携带`Authorization`字段
   */
  postAuth: async (req: Request) => {
    const secreKey = req?.headers?.authorization?.replace('Bearer ', '')
    if (!secreKey) return { status: false }
    const uToken = authKey()
    const verifyStatus = await verifyToken(secreKey, uToken)
    return verifyStatus
  },
}
