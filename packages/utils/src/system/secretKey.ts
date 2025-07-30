import { secureRandomStr } from '../data'
import { logger } from '@karinjs/logger'

/**
 * @public 公开Api
 * @description 获取鉴权秘钥
 */
export const authKey = () => {
  const key = process.env.HTTP_AUTH_KEY
  /** 如果是默认 则生成随机秘钥 */
  if (!key || key === 'default') {
    const value = secureRandomStr({ length: 6 })
    process.env.HTTP_AUTH_KEY = value
    logger.warn(`HTTP鉴权秘钥为默认 使用随机秘钥: ${value}`)
    return value
  }

  return key
}
