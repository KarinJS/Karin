import { api, request } from '@/request/base'

/**
 * 重启karin
 * @param options - 重启选项
 */
export const restartRequest = async (options: {
  /**
   * 是否使用PM2进行重启
   * 当设置为true时，将通过PM2管理器重启应用，可保持进程管理
   * 当设置为false时，将直接重启应用，不使用PM2进行管理
   */
  isPm2?: boolean
  /**
   * 是否重新加载依赖
   * 当设置为true时，重启过程中忽略缓存重新加载karin，会增加内存压力
   * 建议在更新karin之后再打开此选项
   */
  reloadDeps?: boolean
}) => {
  const response = await request.serverPost(
    api.restartKarin,
    options
  )

  return response
}
