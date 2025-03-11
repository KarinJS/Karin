import { router } from '../router'
import { createServerErrorResponse, createSuccessResponse } from '../../utils/response'
import type { RequestHandler } from 'express'

/** 初始化数据结构 */
let Data: { upload: number; download: number; totalSent: number; totalReceived: number } = {
  upload: 0,
  download: 0,
  totalSent: 0,
  totalReceived: 0
}

const networkStatusRouter: RequestHandler = async (_req, res) => {
  try {
    // @ts-ignore
    const { calculateNetworkSpeed } = await import('@karinjs/plugin-webui-network-monitor')
    Data = await calculateNetworkSpeed()
    createSuccessResponse(res, Data)
  } catch (error) {
    createServerErrorResponse(res, '@karinjs/plugin-webui-network-monitor 插件未安装！')
  }
}

router.get('/status/network', networkStatusRouter)
