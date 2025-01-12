import { auth } from '../auth'
import { router } from './router'
import type { RequestHandler } from 'express'

const pingRouter: RequestHandler = (req, res) => {
  res.send({
    ping: 'pong',
  })
}

const statusRouter: RequestHandler = (req, res) => {
  if (!auth.getAuth(req)) {
    res.status(401).json({ message: '无效的token' })
    return
  }

  const data = {
    name: 'karin',
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.KARIN_VERSION,
    karin_dev: process.env.NODE_ENV === 'development',
    karin_lang: process.env.RUNTIME === 'tsx' ? 'ts' : 'js',
    karin_runtime: process.env.RUNTIME,
  }

  res.status(200).json(data)
}

router.get('/ping', pingRouter)
router.get('/status', statusRouter)
