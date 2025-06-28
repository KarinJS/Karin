import { OneBotHttp } from './http'
import type { OneBotHttpClientOptions } from './http'

/**
 * HTTP服务器配置选项
 */
export type OneBotHttpServerOptions = {
  /** 鉴权秘钥，客户端连接时需要提供相同的token */
  accessToken?: string
  /** 监听的端口 */
  port: number
  /** 监听的主机 */
  host?: string
  /** 路径，默认为"/" */
  path?: string
}

/**
 * OneBot Http 管理类
 * 用于创建和管理HTTP连接
 */
class OneBotHttpManager {
  /**
   * 创建HTTP客户端
   * @param options - 配置选项
   * @returns OneBotHttp客户端实例
   */
  createClient (options: OneBotHttpClientOptions): OneBotHttp {
    /** 合并默认配置 */
    const mergedOptions = OneBotHttp.getOptions(options)

    /** 创建客户端 */
    const client = new OneBotHttp(mergedOptions)
    return client
  }
}

/**
 * 创建HTTP管理器实例
 * @returns OneBotHttpManager实例
 */
export const oneBotHttpManager = new OneBotHttpManager()
