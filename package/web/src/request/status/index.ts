import { KarinStatus } from '@/types/server'
import { api, request } from '@/request/base'

/**
 * 获取karin状态
 * @returns karin状态
 */
export const getKarinStatusRequest = async (): Promise<KarinStatus> => {
  const response = await request.serverGet<KarinStatus>(
    api.getKarinStatus
  )

  return response
}
