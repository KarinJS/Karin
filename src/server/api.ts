import { isLocalRequest } from '../core/utils'
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
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.karin_app_version,
    karin_app_mode: process.env.karin_app_mode,
    karin_app_lang: process.env.karin_app_lang,
    karin_app_runner: process.env.karin_app_runner,
    karin_app_start_count: process.env.karin_app_start_count,
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
  process.exit(0)
}
