import { api, request, getErrorMessage } from '@/request/base'

import type { Dependency } from 'node-karin'
import type { BaseResponse } from '@/request/base'

/**
 * 获取依赖列表
 * @param isForceRefresh - 是否强制刷新
 * @timeout 2分钟超时
 */
export const getDependencies = async (
  isForceRefresh = false
): Promise<BaseResponse<Dependency[]>> => {
  try {
    const data = { force: isForceRefresh }
    const result = await request.serverPost<Dependency[], { force: boolean }>(
      api.getDependencies,
      data
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}
