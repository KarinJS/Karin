import { createServerErrorResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'
import type { NetworkStatus } from '@/types/server/network'

let network: (() => Promise<NetworkStatus>) | null = null

/**
 * 获取网络状态
 */
export const networkStatusRouter: RequestHandler = async (_req, res) => {
  try {
    if (typeof network !== 'function') {
      /** 不要直接import 不然打包之后会有类型问题 */
      const name = '@karinjs/plugin-webui-network-monitor'
      const { calculateNetworkSpeed } = await import(name)
      network = calculateNetworkSpeed
    }

    const data = await network!()
    createSuccessResponse(res, data)
  } catch (error) {
    logger.debug(error)
    createServerErrorResponse(res, '@karinjs/plugin-webui-network-monitor 插件未安装！')
  }
}
