import { app } from '@/server/app'
import { createHmac } from 'node:crypto'
import express, { Router } from 'express'
import { listeners } from '@/core/internal'
import { getHttpBot } from '@/adapter/onebot/post/register'

import type { OB11AllEvent } from '../types'
import type { RequestHandler } from 'express'

const onebotPostRouter: RequestHandler = async (req, res) => {
  res.status(204).json({})
  const data = req.body as OB11AllEvent
  const info = getHttpBot(String(data.self_id))
  if (!data || !info || typeof data !== 'object') {
    logger.warn(`[onebot:http] 未知请求: ${JSON.stringify(data)}`)
    return
  }

  if (info.postToken) {
    const sign = createHmac('sha1', info.postToken).update(JSON.stringify(data)).digest('hex')
    if (`sha1=${sign}` !== req.headers['x-signature']) {
      logger.warn(`[onebot:http] 鉴权失败: ${data.self_id} x-signature: ${req.headers['x-signature']}`)
      return
    }
  }

  listeners.emit(`onebot:${data.self_id}`, data)
}

const router = Router()
router.use(express.json())
router.post('/', onebotPostRouter)
app.use('/onebot', router)
