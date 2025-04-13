import { api, request, getErrorMessage } from '@/request/base'

import type { BaseResponse } from '@/request/base'
import type { PluginAdminParams, PluginAdminUpdateResult } from 'node-karin'

/**
 * 插件管理
 * @param params 插件管理参数
 * @returns 更新插件结果
 */
export const pluginAdmin = async (
  params: PluginAdminParams
): Promise<BaseResponse<PluginAdminUpdateResult>> => {
  try {
    const response = await request.serverPost<PluginAdminUpdateResult, PluginAdminParams>(
      api.pluginAdmin,
      params
    )

    if (response.success) {
      return { success: true, data: response }
    }
    throw new Error(response.message)
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}
