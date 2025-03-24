import { createServerErrorResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'
import type { NetworkStatus } from '@/types/server/network'

/**
 * 获取网络状态
 */
export const networkStatusRouter: RequestHandler = async (_req, res) => {
  try {
    // @ts-ignore
    const { calculateNetworkSpeed } = await import('@karinjs/plugin-webui-network-monitor')
    const data: NetworkStatus = await calculateNetworkSpeed()
    createSuccessResponse(res, data)
  } catch (error) {
    logger.debug(error)
    createServerErrorResponse(res, '@karinjs/plugin-webui-network-monitor 插件未安装！')
  }
}
