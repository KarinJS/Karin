import { isLocalRequest } from '../utils'
import { exec } from '@/utils/system/exec'
import type { Request, Response } from 'express'

/**
 * @description 重启接口
 * @param req 请求对象
 * @param res 响应对象
 */
export const restart = async (req: Request, res: Response) => {
  if (!await isLocalRequest(req)) {
    res.status(403).json({ error: '禁止访问', message: '无效的请求' })
    return
  }

  res.status(200).end()

  logger.mark('收到重启请求，正在重启...')
  if (process.env.karin_app_runner === 'pm2') {
    await exec(`pm2 restart ${process.env.pm_id}`)
    return
  }

  if (process.env.karin_app_runner === 'tsx') {
    throw new Error('tsx 不支持重启')
  }

  if (process?.send) {
    process.send('restart')
    logger.mark('发送重启信号成功')
  }
}
