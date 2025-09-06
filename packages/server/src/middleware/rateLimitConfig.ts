import { rateLimitMiddleware } from './rateLimit'
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

/**
 * 创建自定义配置的访问频率限制中间件
 *
 * @example
 * ```typescript
 * // 创建严格限制的中间件
 * const strictRateLimit = createRateLimitMiddleware({
 *   windowMs: 60,        // 1分钟
 *   maxRequests: 20,     // 最多20次请求
 *   blacklistTTL: 7200,  // 拉黑2小时
 *   whitelist: ['127.0.0.1', '192.168.1.100'],
 *   skipPaths: ['/ping', '/health']
 * })
 *
 * // 使用中间件
 * app.use(strictRateLimit)
 * ```
 */
export const createRateLimitMiddleware = (config: Partial<RateLimitConfig>): RequestHandler => {
  return rateLimitMiddleware(config)
}

/**
 * 预设配置：严格模式
 * 适用于对安全要求较高的API
 */
export const strictRateLimitMiddleware: RequestHandler = createRateLimitMiddleware({
  windowMs: 60,         // 1分钟
  maxRequests: 30,      // 最多30次请求
  blacklistTTL: 3600,   // 拉黑1小时
  skipPaths: ['/ping'], // 只跳过ping
})

/**
 * 预设配置：宽松模式
 * 适用于开发环境或内部API
 */
export const lenientRateLimitMiddleware: RequestHandler = createRateLimitMiddleware({
  windowMs: 60,          // 1分钟
  maxRequests: 200,      // 最多200次请求
  blacklistTTL: 1800,    // 拉黑30分钟
  skipPaths: ['/ping', '/login', '/refresh'], // 跳过更多路径
})

/**
 * 预设配置：API密集型
 * 适用于需要大量API调用的场景
 */
export const apiIntensiveRateLimitMiddleware: RequestHandler = createRateLimitMiddleware({
  windowMs: 60,          // 1分钟
  maxRequests: 500,      // 最多500次请求
  blacklistTTL: 600,     // 拉黑10分钟
  skipPaths: ['/ping', '/health', '/metrics'], // 跳过监控相关路径
})
