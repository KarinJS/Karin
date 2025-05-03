import { installMarket } from './installMarket'
import { installCustom } from './installCustom'
import { handleReturn, validatePluginRequest } from './tool'

import type { Response } from 'express'
import type { PluginAdminInstall } from '@/types/task'

/**
 * 安装插件
 * @param res - 响应对象
 * @param data - 更新数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
export const install = async (
  res: Response,
  data: PluginAdminInstall,
  ip: string = '0.0.0.0'
) => {
  if (!validatePluginRequest(res, data.name, data.target, data.pluginType, ['npm', 'git', 'app'])) {
    return
  }

  if (data.source === 'market') {
    return installMarket(res, data, ip)
  }

  if (data.source === 'custom') {
    return installCustom(res, data, ip)
  }

  return handleReturn(res, false, '无效的安装来源')
}
