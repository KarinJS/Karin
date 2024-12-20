import crypto from 'crypto'
import { listeners } from '@/internal/listeners'
import { getHttpBotToken } from '@/service/server'
import { OB11AllEvent } from '@adapter/onebot/types/event'
import type { Request, Response } from 'express'

/**
 * @description onebot11 post上报接口
 * @param req 请求对象
 * @param res 响应对象
 */
export const onebot = async (req: Request, res: Response) => {
  res.status(204).json({})
  const data = req.body as OB11AllEvent
  const info = getHttpBotToken(String(data.self_id))
  if (!data || !info || typeof data !== 'object') {
    logger.warn(`[onebot:http] 未知请求: ${JSON.stringify(data)}`)
    return
  }

  if (info.isAuth) {
    const sign = crypto.createHmac('sha1', info.token).update(JSON.stringify(data)).digest('hex')
    if (`sha1=${sign}` !== req.headers['x-signature']) {
      logger.warn(`[onebot:http] 鉴权失败: ${data.self_id} x-signature: ${req.headers['x-signature']}`)
      return
    }
  }

  listeners.emit(`onebot:${data.self_id}`, data)
}
