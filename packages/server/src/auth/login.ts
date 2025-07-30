import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse,
  createForbiddenResponse,
} from '../utils/response'
import { createJwt, getSecretOrPrivateKey } from './jwt'

import type { RequestHandler, Response } from 'express'

/** 登录限制配置 */
const IP_LIMIT_CONFIG = {
  /** 最大尝试次数 */
  maxAttempts: 5,
  /** 时间窗口 */
  timeWindow: 5 * 60 * 1000,
  /** 封禁时长 */
  blockDuration: 30 * 60 * 1000,
}

/** IP记录 */
interface IPRecord {
  /** 尝试次数 */
  attempts: number
  /** 首次尝试时间 */
  firstAttempt: number
  /** 封禁结束时间 */
  blockedUntil?: number
}

/** IP记录 */
const ipRecords = new Map<string, IPRecord>()

/**
 * 清理过期的IP记录
 */
const cleanupIPRecords = () => {
  const now = Date.now()
  for (const [ip, record] of ipRecords.entries()) {
    if (
      (record.blockedUntil && record.blockedUntil < now) ||
      now - record.firstAttempt > IP_LIMIT_CONFIG.timeWindow
    ) {
      ipRecords.delete(ip)
    }
  }
}

/** 每10分钟清理一次过期记录 */
setInterval(cleanupIPRecords, 10 * 60 * 1000)

/**
 * 检查IP是否被封禁
 * @param clientIP 客户端IP
 * @param res 响应
 * @returns 是否被封禁
 */
const checkIPBlocked = (clientIP: string, res: Response) => {
  const now = Date.now()
  const ipRecord = ipRecords.get(clientIP) || { attempts: 0, firstAttempt: now }

  if (ipRecord.blockedUntil && ipRecord.blockedUntil > now) {
    /** 在封禁期间继续尝试,延长封禁时间 */
    const additionalAttempts = ipRecord.attempts + 1 - IP_LIMIT_CONFIG.maxAttempts
    const extraBlockTime = Math.min(
      IP_LIMIT_CONFIG.blockDuration * additionalAttempts,
      24 * 60 * 60 * 1000 // 最长封禁24小时
    )
    // 更新封禁结束时间为: 当前时间 + 新的封禁时长
    ipRecord.blockedUntil = now + extraBlockTime
    ipRecord.attempts++
    ipRecords.set(clientIP, ipRecord)

    const remainingTime = Math.ceil((ipRecord.blockedUntil - now) / 1000 / 60)
    const tips = `登录尝试次数过多,请在${remainingTime}分钟后重试`

    createForbiddenResponse(res, tips)
    logger.warn(`${logger.red('login')}: ${clientIP} 继续尝试登录, 当前尝试次数:${ipRecord.attempts}, 封禁时间延长至${remainingTime}分钟`)
    return {
      isBlocked: true,
      ipRecord,
    }
  }

  /** 检查是否需要重置计数器 */
  if (now - ipRecord.firstAttempt > IP_LIMIT_CONFIG.timeWindow) {
    ipRecord.attempts = 0
    ipRecord.firstAttempt = now
  }

  return { isBlocked: false, ipRecord }
}

/**
 * 处理登录失败
 * @param clientIP 客户端IP
 * @param ipRecord IP记录
 * @param res 响应
 * @returns 处理结果
 */
const handleLoginFailure = (clientIP: string, ipRecord: IPRecord, res: Response) => {
  const now = Date.now()
  ipRecord.attempts++

  /** 检查是否超过最大尝试次数 */
  if (ipRecord.attempts >= IP_LIMIT_CONFIG.maxAttempts) {
    ipRecord.blockedUntil = now + IP_LIMIT_CONFIG.blockDuration
    ipRecords.set(clientIP, ipRecord)
    const remainingTime = Math.ceil(IP_LIMIT_CONFIG.blockDuration / 1000 / 60)
    const tips = `登录尝试次数过多,请在${remainingTime}分钟后重试`

    logger.warn(`${logger.red('login')}: ${clientIP} ${tips}`)
    return createForbiddenResponse(res, tips)
  }

  ipRecords.set(clientIP, ipRecord)
  logger.warn(`${logger.red('login')}: ${clientIP} 密码错误`)
  return createBadRequestResponse(res, '密码错误')
}

/**
 * 处理登录成功
 * @param clientIP 客户端IP
 * @param res 响应
 * @returns 处理结果
 */
const handleLoginSuccess = (clientIP: string, res: Response) => {
  /** 登录成功，重置该IP的记录 */
  ipRecords.delete(clientIP)
  const { userId, accessToken, refreshToken } = createJwt()
  return createSuccessResponse(res, { userId, accessToken, refreshToken }, '登录成功')
}

/**
 * 验证登录凭证
 * @param authorization 授权
 * @returns 是否有效
 */
const validateCredentials = (authorization?: string) => {
  const token = authorization?.replace('Bearer ', '')
  return token && token === getSecretOrPrivateKey()
}

/**
 * 登录路由处理
 */
export const loginRouter: RequestHandler = async (req, res) => {
  try {
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown'

    logger.info(`${logger.green('login')}: ${clientIP} ${JSON.stringify(req.body)}`)

    /** 检查IP限制 */
    const { isBlocked, ipRecord } = checkIPBlocked(clientIP, res)
    if (isBlocked) return

    /** 验证登录凭证 */
    const { authorization } = req.body || {}
    const isValid = validateCredentials(authorization)

    if (!isValid) {
      handleLoginFailure(clientIP, ipRecord, res)
      return
    }

    handleLoginSuccess(clientIP, res)
  } catch (error) {
    logger.error(error)
    createServerErrorResponse(res, error instanceof Error ? error.message : '服务器错误')
  }
}
