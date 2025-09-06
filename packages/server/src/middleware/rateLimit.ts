import { logger } from '@karinjs/logger'
import type { RequestHandler } from 'express'

interface RateLimitConfig {
  /** 时间窗口（秒） */
  windowMs: number
  /** 在时间窗口内允许的最大请求数 */
  maxRequests: number
  /** IP黑名单过期时间（秒），0表示永不过期 */
  blacklistTTL: number
  /** 白名单IP列表 */
  whitelist: string[]
  /** 需要跳过限制的路径 */
  skipPaths: string[]
}

interface RequestRecord {
  count: number
  resetTime: number
}

interface BlacklistRecord {
  addedTime: number
  expireTime: number // 0表示永不过期
}

/** 默认配置 */
const defaultConfig: RateLimitConfig = {
  windowMs: 60, // 1分钟
  maxRequests: 100, // 每分钟最多100次请求
  blacklistTTL: 3600, // 黑名单1小时
  whitelist: ['127.0.0.1', '::1'], // 本地IP白名单
  skipPaths: ['/ping', '/login'], // 跳过限制的路径
}

// 内存存储
const requestCountMap = new Map<string, RequestRecord>()
const blacklistMap = new Map<string, BlacklistRecord>()

// 定期清理过期数据
setInterval(() => {
  const now = Date.now()

  // 清理过期的请求计数
  for (const [ip, record] of requestCountMap.entries()) {
    if (now > record.resetTime) {
      requestCountMap.delete(ip)
    }
  }

  // 清理过期的黑名单
  for (const [ip, record] of blacklistMap.entries()) {
    if (record.expireTime > 0 && now > record.expireTime) {
      blacklistMap.delete(ip)
      logger.info(`[RateLimit] IP ${ip} 已从黑名单中自动移除（过期）`)
    }
  }
}, 60000) // 每分钟清理一次

/**
 * 获取客户端真实IP地址
 * @param req Express请求对象
 * @returns 客户端IP地址
 */
const getClientIP = (req: any): string => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    '0.0.0.0'
  ).replace(/^::ffff:/, '')
}

/**
 * 检查IP是否在黑名单中
 * @param ip IP地址
 * @returns 是否在黑名单中
 */
const isBlacklisted = (ip: string): boolean => {
  const record = blacklistMap.get(ip)
  if (!record) {
    return false
  }

  // 检查是否过期
  if (record.expireTime > 0 && Date.now() > record.expireTime) {
    blacklistMap.delete(ip)
    logger.info(`[RateLimit] IP ${ip} 已从黑名单中移除（过期）`)
    return false
  }

  return true
}

/**
 * 将IP添加到黑名单
 * @param ip IP地址
 * @param ttl 过期时间（秒）
 */
const addToBlacklist = (ip: string, ttl: number): void => {
  const now = Date.now()
  const expireTime = ttl > 0 ? now + ttl * 1000 : 0

  blacklistMap.set(ip, {
    addedTime: now,
    expireTime,
  })

  logger.warn(`[RateLimit] IP ${ip} 已被加入黑名单，TTL: ${ttl > 0 ? ttl + '秒' : '永久'}`)
}

/**
 * 增加IP的请求计数
 * @param ip IP地址
 * @param windowMs 时间窗口（毫秒）
 * @returns 当前请求次数
 */
const incrementRequestCount = (ip: string, windowMs: number): number => {
  const now = Date.now()
  const record = requestCountMap.get(ip)

  if (!record || now > record.resetTime) {
    // 新的时间窗口，重置计数
    const newRecord: RequestRecord = {
      count: 1,
      resetTime: now + windowMs,
    }
    requestCountMap.set(ip, newRecord)
    return 1
  } else {
    // 在同一时间窗口内，增加计数
    record.count++
    requestCountMap.set(ip, record)
    return record.count
  }
}/**
 * 检查IP是否在白名单中
 * @param ip IP地址
 * @param whitelist 白名单列表
 * @returns 是否在白名单中
 */
const isWhitelisted = (ip: string, whitelist: string[]): boolean => {
  return whitelist.includes(ip)
}

/**
 * 检查路径是否需要跳过限制
 * @param path 请求路径
 * @param skipPaths 跳过的路径列表
 * @returns 是否需要跳过
 */
const shouldSkipPath = (path: string, skipPaths: string[]): boolean => {
  return skipPaths.some(skipPath => {
    if (skipPath.endsWith('*')) {
      return path.startsWith(skipPath.slice(0, -1))
    }
    return path === skipPath
  })
}

/**
 * 访问频率限制中间件
 * @param config 配置选项
 * @returns Express中间件函数
 */
export const rateLimitMiddleware = (config: Partial<RateLimitConfig> = {}): RequestHandler => {
  const finalConfig = { ...defaultConfig, ...config }

  const middleware: RequestHandler = async (req, res, next) => {
    try {
      const ip = getClientIP(req)
      const path = req.path

      // 检查白名单
      if (isWhitelisted(ip, finalConfig.whitelist)) {
        return next()
      }

      // 检查是否需要跳过的路径
      if (shouldSkipPath(path, finalConfig.skipPaths)) {
        return next()
      }

      // 检查黑名单
      const blacklisted = isBlacklisted(ip)
      if (blacklisted) {
        logger.warn(`[RateLimit] 拒绝黑名单IP访问: ${ip} -> ${path}`)
        res.status(429).json({
          code: 429,
          message: 'IP已被拉黑，请稍后再试',
          data: null,
        })
        return
      }

      // 获取当前请求计数并增加
      const currentCount = incrementRequestCount(ip, finalConfig.windowMs * 1000)

      // 检查是否超过限制
      if (currentCount > finalConfig.maxRequests) {
        // 将IP加入黑名单
        addToBlacklist(ip, finalConfig.blacklistTTL)

        logger.warn(`[RateLimit] IP ${ip} 在 ${finalConfig.windowMs}秒内请求 ${currentCount} 次，超过限制 ${finalConfig.maxRequests} 次，已拉黑`)

        res.status(429).json({
          code: 429,
          message: '请求过于频繁，IP已被拉黑',
          data: null,
        })
        return
      }

      // 设置响应头
      res.set({
        'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, finalConfig.maxRequests - currentCount).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + finalConfig.windowMs * 1000).toISOString(),
      })

      // 日志记录（仅在接近限制时）
      if (currentCount > finalConfig.maxRequests * 0.8) {
        logger.debug(`[RateLimit] IP ${ip} 请求频率较高: ${currentCount}/${finalConfig.maxRequests}`)
      }

      next()
    } catch (error) {
      logger.error(`[RateLimit] 中间件执行失败: ${error}`)
      // 出错时不阻止请求，继续执行
      next()
    }
  }

  return middleware
}

/**
 * 创建默认的访问频率限制中间件
 */
export const defaultRateLimitMiddleware: RequestHandler = rateLimitMiddleware()

/**
 * 手动将IP添加到黑名单的工具函数
 * @param ip IP地址
 * @param ttl 过期时间（秒），默认1小时
 */
export const manualBlacklistIP = (ip: string, ttl: number = 3600): void => {
  addToBlacklist(ip, ttl)
}

/**
 * 从黑名单中移除IP的工具函数
 * @param ip IP地址
 */
export const removeFromBlacklist = (ip: string): void => {
  const removed = blacklistMap.delete(ip)
  if (removed) {
    logger.info(`[RateLimit] IP ${ip} 已从黑名单中移除`)
  } else {
    logger.warn(`[RateLimit] IP ${ip} 不在黑名单中`)
  }
}

/**
 * 重置IP的请求计数
 * @param ip IP地址
 */
export const resetRequestCount = (ip: string): void => {
  const removed = requestCountMap.delete(ip)
  if (removed) {
    logger.info(`[RateLimit] IP ${ip} 的请求计数已重置`)
  } else {
    logger.info(`[RateLimit] IP ${ip} 没有请求计数记录`)
  }
}

/**
 * 获取黑名单列表
 * @returns 黑名单IP列表
 */
export const getBlacklistIPs = (): string[] => {
  const now = Date.now()
  const activeIPs: string[] = []

  for (const [ip, record] of blacklistMap.entries()) {
    // 过滤掉已过期的IP
    if (record.expireTime === 0 || now <= record.expireTime) {
      activeIPs.push(ip)
    }
  }

  return activeIPs
}

/**
 * 获取当前请求计数统计
 * @returns 请求计数统计信息
 */
export const getRequestCountStats = (): Array<{ ip: string; count: number; resetTime: Date }> => {
  const now = Date.now()
  const stats: Array<{ ip: string; count: number; resetTime: Date }> = []

  for (const [ip, record] of requestCountMap.entries()) {
    if (now <= record.resetTime) {
      stats.push({
        ip,
        count: record.count,
        resetTime: new Date(record.resetTime),
      })
    }
  }

  return stats.sort((a, b) => b.count - a.count)
}

/**
 * 清理所有过期数据
 */
export const cleanupExpiredData = (): void => {
  const now = Date.now()
  let cleanedRequests = 0
  let cleanedBlacklist = 0

  // 清理过期的请求计数
  for (const [ip, record] of requestCountMap.entries()) {
    if (now > record.resetTime) {
      requestCountMap.delete(ip)
      cleanedRequests++
    }
  }

  // 清理过期的黑名单
  for (const [ip, record] of blacklistMap.entries()) {
    if (record.expireTime > 0 && now > record.expireTime) {
      blacklistMap.delete(ip)
      cleanedBlacklist++
    }
  }

  if (cleanedRequests > 0 || cleanedBlacklist > 0) {
    logger.info(`[RateLimit] 清理完成：请求计数 ${cleanedRequests} 条，黑名单 ${cleanedBlacklist} 条`)
  }
}
