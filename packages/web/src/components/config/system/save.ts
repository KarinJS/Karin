import { request } from '@/lib/request'
import toast from 'react-hot-toast'

import type { ConfigType } from '@/pages/dashboard/config/index'

/**
 * 保存系统配置
 * @param type 配置类型
 * @param data 配置
 * @returns 保存配置结果
 */
export const saveConfig = async <T> (type: ConfigType, data: T) => {
  try {
    const response = await request.serverPost<string, { type: ConfigType; data: T }>(
      '/api/v1/config/new/save',
      {
        type,
        data
      }
    )

    toast.success(response)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    toast.error(errorMessage)
    console.error('保存配置出错:', error)
  }
}
