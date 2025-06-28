import WebSocket from 'ws'
import { OneBotWsClient } from './client'
import { DEFAULT_WS_OPTIONS } from '../types'
import type { OneBotWsClientOptions } from '../types'

/**
 * OneBot WebSocket 客户端管理类
 */
class OneBotWsClientManager {
  /**
   * 获取格式化之后的参数
   * @param options - 连接配置
   * @returns 格式化之后的参数
   */
  getOptions (options: Partial<OneBotWsClientOptions>): OneBotWsClientOptions {
    const mergedOptions: OneBotWsClientOptions = {
      ...DEFAULT_WS_OPTIONS,
      ...options,
      accessToken: options.accessToken ?? '',
      headers: options.headers ?? {},
      autoReconnect: options.autoReconnect ?? DEFAULT_WS_OPTIONS.autoReconnect,
      reconnectInterval: options.reconnectInterval ?? DEFAULT_WS_OPTIONS.reconnectInterval,
      maxReconnectAttempts: options.maxReconnectAttempts ?? DEFAULT_WS_OPTIONS.maxReconnectAttempts,
      timeout: options.timeout ?? DEFAULT_WS_OPTIONS.timeout,
    }

    if (options.accessToken) {
      mergedOptions.headers!['authorization'] = `Bearer ${options.accessToken}`
    }

    return mergedOptions
  }

  /**
   * 创建 OneBotWsClient 客户端实例
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns OneBotWsClient客户端实例
   */
  async createClient (url: string, options: OneBotWsClientOptions): Promise<OneBotWsClient> {
    const mergedOptions = this.getOptions(options)
    const socket = this.createWebSocket(url, mergedOptions)

    /** 创建客户端 */
    const client = new OneBotWsClient(socket, url, mergedOptions)
    return client
  }

  /**
   * 创建 WebSocket 示例
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns WebSocket客户端实例
   */
  createWebSocket (url: string, options: OneBotWsClientOptions): WebSocket {
    const mergedOptions = this.getOptions(options)
    const socket = Object.keys(mergedOptions.headers || {}).length > 0
      ? new WebSocket(url, { headers: mergedOptions.headers })
      : new WebSocket(url)

    return socket
  }
}

/**
 * OneBot WebSocket 客户端管理类实例
 */
export const oneBotWsClientManager = new OneBotWsClientManager()
