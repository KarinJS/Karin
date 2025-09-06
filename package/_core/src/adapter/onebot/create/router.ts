import { app } from '@/server/app/app'
import { Router } from 'express'

import type { OneBotEvent } from '@karinjs/onebot'
import type { RequestHandler } from 'express'
import { cacheMap } from '../core'

/**
 * OneBot事件分发处理函数
 */
const oneBotEventDispatchRouter: RequestHandler<null, {}, OneBotEvent> = async (req, res) => {
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
      logger.warn(`[OneBot] 未知请求: ${JSON.stringify(data)}`)
      return
    }

    const adapter = cacheMap.http.get(selfId)
    if (!adapter) {
      logger.warn(`[OneBot] 未知请求: ${JSON.stringify(data)}`)
      return
    }

    adapter._onebot.handleEvent(rawBody, req.headers)
  })
}

/**
 * 创建一个 OneBot HTTP_POST 事件分发路由
 * @returns
 */
export const createOneBotEventDispatchRouter = () => {
  const router = Router()
  router.post('/', oneBotEventDispatchRouter)
  app.use('/onebot', router)
}
