import crypto from 'node:crypto'

/**
 * 鉴权
 * 1. sha256 加密
 * 2. 明文对比
 * 3. 以上都需要带`Bearer`前缀
 * @param token 令牌
 */
export const auth = (token?: string) => {
  if (!process.env.WS_SERVER_AUTH_KEY) return true
  if (!token) return false
  /** 先对比明文 */
  if (token === `Bearer ${process.env.WS_SERVER_AUTH_KEY}`) return true

  /** 再对比sha256 */
  const sha256 = crypto.createHash('sha256').update(process.env.WS_SERVER_AUTH_KEY).digest('hex')
  if (token === `Bearer ${sha256}`) return true

  return false
}
