import { api, request } from '@/request/base'
import type { PluginAdminListResponse, PluginAdminParams, PluginAdminResult } from 'node-karin'

/**
 * 插件管理
 * @param params 插件管理参数
 * @returns 更新插件结果
 */
export const pluginAdminRequest = async (
  params: PluginAdminParams
): Promise<PluginAdminResult> => {
  const response = await request.serverPost<PluginAdminResult, PluginAdminParams>(
    api.pluginAdmin,
    params
  )

  return response
}

/**
 * 获取已安装插件名称列表
 * @returns 已安装插件名称列表
 */
export const getLocalPluginNameListRequest = async (): Promise<PluginAdminListResponse[]> => {
  const response = await request.serverPost<PluginAdminListResponse[], null>(
    api.getPluginListPluginAdmin
  )
  return response
}
