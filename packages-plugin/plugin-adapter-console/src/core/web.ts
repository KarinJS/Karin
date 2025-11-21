import { config } from './config'
import { app, express, Router, rateLimit } from '@karinjs/server'
import type { Request } from '@karinjs/server'

const getClientIp = (req: Request) => {
  // X-Forwarded-For 可能是 "client, proxy1, proxy2"
  const xff = req.headers['x-forwarded-for']
  if (xff && typeof xff === 'string') {
    const ips = xff.split(',').map(ip => ip.trim())
    if (ips.length && typeof ips[0] === 'string') return ips[0] // 第一个是真实客户端
  }

  // fallback: 直连 IP
  return req.socket?.remoteAddress || ''
}

const isLocalhost = (req: Request) => {
  const ip = getClientIp(req)
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

const router = Router()
router.use(rateLimit({
  windowMs: 60 * 1000, // 1分钟窗口
  max: 30, // 每个IP在窗口内最多请求30次
  standardHeaders: true, // 返回RateLimit相关信息到headers
  legacyHeaders: false, // 禁止X-RateLimit-* headers
  message: '请求过于频繁，请稍后再试',
}))

/** 鉴权 */
router.use('/', async (req, res, next) => {
  const cfg = await config.getConfig('config.json')

  if (cfg.isLocal) {
    if (!isLocalhost(req)) {
      res.status(403).send('仅限本地访问')
      return
    }

    next()
    return
  }

  const token = req.query.token
  if (cfg.token && token !== cfg.token) {
    res.status(401).send('无效的访问令牌')
    return
  }

  next()
})

/** 静态资源 */
router.use('/', express.static(config.dir.temp))

app.use('/console', router)
