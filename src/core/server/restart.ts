import { isLocalRequest } from '@/utils/system/ip'
import { restartDirect } from '@/utils/system/restart'
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

  restartDirect()
}
