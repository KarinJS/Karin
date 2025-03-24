import crypto from 'node:crypto'

/**
 * 获取md5
 * @param token 令牌
 * @returns md5
 */
export const getMd5 = (token: string) => {
  return crypto.createHash('md5').update(token).digest('hex')
}

/**
 * 鉴权
 * 1. md5 * 2 加密
 * 2. 明文对比
 * 3. 以上都需要带`Bearer`前缀
 * @param token 令牌
 */
export const auth = (token?: string) => {
  if (!process.env.WS_SERVER_AUTH_KEY) return true
  if (!token) return false
  /** 先对比明文 */
  if (token === `Bearer ${process.env.WS_SERVER_AUTH_KEY}`) return true

  /** 再对比md5 */
  if (token === `Bearer ${getMd5(getMd5(process.env.WS_SERVER_AUTH_KEY))}`) return true

  return false
}
