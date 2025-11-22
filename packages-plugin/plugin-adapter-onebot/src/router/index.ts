import { config } from '../config'
import { cache, log } from '../create'
import { app, express } from '@karinjs/server'

import type { RequestHandler } from '@karinjs/server'

/**
 * IP 限流记录
 * key: IP 地址
 * value: 403 状态码的时间戳数组
 */
const ipRateLimitMap = new Map<string, number[]>()

/**
 * 限流规则配置
 */
const RATE_LIMIT_RULES = [
  { window: 10 * 1000, limit: 5 },   // 10秒内5次
  { window: 30 * 1000, limit: 10 },  // 30秒内10次
  { window: 45 * 1000, limit: 20 },  // 45秒内20次
  { window: 60 * 1000, limit: 30 },  // 60秒内30次
]

/**
 * 限流时长
 */
const BAN_DURATIONS = [
  4 * 60 * 1000,  // 规则4: 4分钟
  3 * 60 * 1000,  // 规则3: 3分钟
  2 * 60 * 1000,  // 规则2: 2分钟
  1 * 60 * 1000,  // 规则1: 1分钟
]

/**
 * IP 封禁记录
 * key: IP 地址
 * value: 封禁到期时间戳
 */
const ipBanMap = new Map<string, number>()

/**
 * 检查 IP 是否被限流
 */
const checkRateLimit = (ip: string): { banned: boolean; duration?: number } => {
  const now = Date.now()

  // 检查是否在封禁期内
  const banUntil = ipBanMap.get(ip)
  if (banUntil && banUntil > now) {
    return { banned: true, duration: Math.ceil((banUntil - now) / 1000) }
  }

  // 清除过期的封禁
  if (banUntil && banUntil <= now) {
    ipBanMap.delete(ip)
  }

  // 获取该 IP 的 403 记录
  const timestamps = ipRateLimitMap.get(ip) || []

  // 清理过期的记录（超过60秒的）
  const validTimestamps = timestamps.filter(t => now - t < 60 * 1000)
  ipRateLimitMap.set(ip, validTimestamps)

  // 检查是否触发限流规则（从严格到宽松）
  for (let i = RATE_LIMIT_RULES.length - 1; i >= 0; i--) {
    const rule = RATE_LIMIT_RULES[i]
    const count = validTimestamps.filter(t => now - t < rule.window).length

    if (count >= rule.limit) {
      const banDuration = BAN_DURATIONS[i]
      const banUntil = now + banDuration
      ipBanMap.set(ip, banUntil)
      log.warn(`[限流] IP ${ip} 触发规则${i + 1}（${rule.window / 1000}秒内${rule.limit}次），封禁${banDuration / 60000}分钟`)
      return { banned: true, duration: Math.ceil(banDuration / 1000) }
    }
  }

  return { banned: false }
}

/**
 * 记录 403 状态码
 */
const record403 = (ip: string) => {
  const timestamps = ipRateLimitMap.get(ip) || []
  timestamps.push(Date.now())
  ipRateLimitMap.set(ip, timestamps)
}

const webhook: RequestHandler = async (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown'

  // 检查 IP 是否被限流
  const rateLimitResult = checkRateLimit(clientIp)
  if (rateLimitResult.banned) {
    log.warn(`[限流] IP ${clientIp} 已被封禁，剩余时间: ${rateLimitResult.duration}秒`)
    res.status(429).json({
      error: 'Too Many Requests',
      message: '请求过于频繁，再dd我会被封禁哦~',
      retryAfter: rateLimitResult.duration,
    })
    return
  }

  res.status(204).json({})
  const chunks: Buffer[] = []
  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk)
  })

  req.on('end', () => {
    const rawBody = Buffer.concat(chunks).toString('utf8')
    const data = req.body
    const selfId = req.headers['x-self-id']

    if (!selfId || typeof selfId !== 'string') {
      log.warn(`[webhook] 未知请求: ${JSON.stringify(data)}`)
      return
    }

    const adapter = cache.http.get(selfId)
    if (!adapter) {
      log.warn(`[webhook] 未知请求: ${JSON.stringify(data)}`)
      return
    }

    const cfg = config.getConfigSync('config.json')
    const token = cfg.http.webhook.tokens[selfId] || cfg.http.webhook.token
    const result = adapter.core.dispatch(rawBody, req.headers, token)
    if (result.status !== 200) {
      log.warn(`[webhook] 处理请求失败: ${result.data} ${JSON.stringify({ data, headers: req.headers }, null, 2)}`)
    }

    if (result.status === 403) {
      record403(clientIp)
    }
  })
}

/**
 * 创建 OneBot 路由并注册到应用中
 */
export const createOneBotRouter = async () => {
  const cfg = config.getConfigSync('config.json')
  const router = express.Router()

  app.use(cfg.server.route, router)
  router.post('/', webhook)
}
