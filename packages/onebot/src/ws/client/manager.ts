import WebSocket from 'ws'
import { OneBotWsClient } from './client'
import { DEFAULT_WS_OPTIONS } from '../types'
import type { OneBotWsClientOptions } from '../types'

/**
 * OneBot WebSocket 客户端管理类
 */
class OneBotWsClientManager {
  /** 已连接的OneBot客户端实例 */
  private _clients: Map<string, OneBotWsClient> = new Map()

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
   * 创建OneBotWsClient客户端实例
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns OneBotWsClient客户端实例
   */
  async createClient (url: string, options: OneBotWsClientOptions): Promise<OneBotWsClient> {
    const mergedOptions = this.getOptions(options)
    const socket = this.createWebSocketClient(url, mergedOptions)

    /** 创建客户端 */
    const client = new OneBotWsClient(socket, url, mergedOptions)

    /** 保存客户端实例 */
    this._clients.set(url, client)

    return client
  }

  /**
   * 获取所有已连接的客户端
   * @returns 客户端Map
   */
  getClients (): Map<string, OneBotWsClient> {
    return this._clients
  }

  /**
   * 获取指定客户端
   * @param url - 客户端URL
   * @returns 客户端实例，不存在则返回undefined
   */
  getClient (url: string): OneBotWsClient | null {
    return this._clients.get(url) || null
  }

  /**
   * 关闭指定客户端连接
   * @param id - 客户端ID
   * @returns 是否成功关闭
   */
  closeClient (url: string): boolean {
    const client = this._clients.get(url)
    if (client) {
      client.close()
      return true
    }
    return false
  }

  /**
   * 关闭所有客户端连接
   */
  closeAllClients (): void {
    for (const client of this._clients.values()) {
      client.close()
    }
  }

  /**
   * 让指定客户端重连
   * @param url - 客户端URL
   * @returns 重连后的客户端实例
   */
  async reconnect (url: string): Promise<OneBotWsClient | null> {
    if (!url && typeof url !== 'string') return null
    const client = this.getClient(url)
    if (!client) return null

    client.reconnect(url, {
      ...client._options,
      maxReconnectAttempts: client._options.maxReconnectAttempts - 1,
    })

    return client
  }

  /**
   * 销毁客户端
   * @param url - 客户端URL
   * @returns 是否成功删除
   */
  removeClient (url: string): boolean {
    const client = this._clients.get(url)
    if (client) client.close()
    return this._clients.delete(url)
  }

  /**
   * 删除客户端 与销毁客户端一样
   * @param url - 客户端URL
   * @returns 是否成功删除
   */
  deleteClient (url: string): boolean {
    return this.removeClient(url)
  }

  /**
   * 创建WebSocket客户端
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns WebSocket客户端实例
   */
  createWebSocketClient (url: string, options: OneBotWsClientOptions): WebSocket {
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
