import crypto from 'crypto'
import { isLocalRequest } from '../utils'
import { listeners } from '@/internal/listeners'
import { OB11AllEvent } from '@adapter/onebot/types/event'
import { getHttpBotToken } from '@/service/server'
import { type Request, type Response } from 'express'

/**
 * @description Ping接口返回信息
 * @param req - 请求对象
 * @param res - 响应对象
 */
export const ping = async (req: Request, res: Response) => {
  /** 判断是否为本地请求 */
  if (!await isLocalRequest(req)) {
    res.status(403).json({ error: '禁止访问', message: '无效的请求' })
    return
  }

  const data = {
    name: 'karin',
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.karin_app_version,
    karin_app_mode: process.env.karin_app_mode,
    karin_app_lang: process.env.karin_app_lang,
    karin_app_runner: process.env.karin_app_runner,
  }

  res.json(data)
}

/**
 * @description 退出接口
 * @param req 请求对象
 * @param res 响应对象
 */
export const exit = async (req: Request, res: Response) => {
  if (!await isLocalRequest(req)) {
    res.status(403).json({ error: '禁止访问', message: '无效的请求' })
    return
  }

  logger.mark('收到退出请求，正在退出...')
  res.json({ message: '退出成功' })
  const { processExit } = await import('@/internal/process')
  await processExit(0)
}

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
