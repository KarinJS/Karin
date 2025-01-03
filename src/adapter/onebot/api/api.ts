import { app } from '@/server/app'
import { createHmac } from 'node:crypto'
import { getHttpBotToken } from '../post/register'
import type { OB11AllEvent } from '../types'
import { listeners } from '@/core/internal'

app.post('/onebot', async (req, res) => {
  res.status(204).json({})
  const data = req.body as OB11AllEvent
  const info = getHttpBotToken(String(data.self_id))
  if (!data || !info || typeof data !== 'object') {
    logger.warn(`[onebot:http] 未知请求: ${JSON.stringify(data)}`)
    return
  }

  if (info.isAuth) {
    const sign = createHmac('sha1', info.token).update(JSON.stringify(data)).digest('hex')
    if (`sha1=${sign}` !== req.headers['x-signature']) {
      logger.warn(`[onebot:http] 鉴权失败: ${data.self_id} x-signature: ${req.headers['x-signature']}`)
      return
    }
  }

  listeners.emit(`onebot:${data.self_id}`, data)
})
