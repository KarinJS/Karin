import { api, request, getErrorMessage } from '@/request/base'

import type { BaseResponse } from '@/request/base'
import type { PluginAdminListResponse, PluginAdminParams, PluginAdminResult } from 'node-karin'

/**
 * 插件管理
 * @param params 插件管理参数
 * @returns 更新插件结果
 */
export const pluginAdminRequest = async (
  params: PluginAdminParams
): Promise<BaseResponse<PluginAdminResult>> => {
  try {
    const response = await request.serverPost<PluginAdminResult, PluginAdminParams>(
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

/**
 * 获取已安装插件名称列表
 * @returns 已安装插件名称列表
 */
export const getLocalPluginNameListRequest = async (): Promise<BaseResponse<PluginAdminListResponse[]>> => {
  try {
    const response = await request.serverPost<PluginAdminListResponse[], null>(
      api.getPluginListPluginAdmin
    )
    return { success: true, data: response }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}
