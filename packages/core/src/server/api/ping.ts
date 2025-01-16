import { createSuccessResponse } from '../utils/response'
import { router } from './router'
import type { RequestHandler } from 'express'

const pingRouter: RequestHandler = (_req, res) => {
  createSuccessResponse(
    res,
    {
      ping: 'pong',
    },
    '成功',
  )
}

const statusRouter: RequestHandler = (_req, res) => {
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

  createSuccessResponse(res, data, '成功')
}

router.get('/ping', pingRouter)
router.get('/status', statusRouter)
