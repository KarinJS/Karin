import { createServer } from 'node:http'
import { OneBotHttp } from './http'
import { randomUUID } from 'node:crypto'

import type { OneBotEvent } from '../event'
import type { IncomingMessage, ServerResponse } from 'node:http'
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
  /** 已连接的客户端实例 self_id => OneBotHttp */
  private _clients: Map<string, OneBotHttp> = new Map()

  /** HTTP服务器实例 */
  private _httpServers: Map<string, {
    server: ReturnType<typeof createServer>,
    options: OneBotHttpServerOptions
  }> = new Map()

  /**
   * 创建HTTP客户端
   * @param options - 配置选项
   * @returns OneBotHttp客户端实例
   */
  createClient (options: OneBotHttpClientOptions): OneBotHttp {
    const id = options.self_id.toString()

    /** 合并默认配置 */
    const mergedOptions = OneBotHttp.getOptions(options)

    /** 创建客户端 */
    const client = new OneBotHttp(mergedOptions)

    /** 保存客户端实例 */
    this._clients.set(id, client)
    return client
  }

  /**
   * 获取所有已连接的客户端
   * @returns 客户端Map
   */
  getClients (): Map<string, OneBotHttp> {
    return this._clients
  }

  /**
   * 获取指定客户端
   * @param self_id - Bot的self_id
   * @returns 客户端实例，不存在则返回undefined
   */
  getClient (self_id: string): OneBotHttp | undefined {
    return this._clients.get(self_id)
  }

  /**
   * 关闭指定客户端连接
   * @param self_id - Bot的self_id
   * @returns 是否成功关闭
   */
  closeClient (self_id: string): boolean {
    const client = this._clients.get(self_id)
    if (client) {
      client.close()
      this._clients.delete(self_id)
      return true
    }
    return false
  }

  /**
   * 关闭所有客户端连接
   */
  closeAllClients (): void {
    for (const [self_id, client] of this._clients.entries()) {
      client.close()
      this._clients.delete(self_id)
    }
  }

  /**
   * 删除客户端
   * @param self_id - Bot的self_id
   * @returns 是否成功删除
   */
  deleteClient (self_id: string): boolean {
    const client = this._clients.get(self_id)
    if (client) {
      client.close()
      return true
    }
    return false
  }

  /**
   * 创建HTTP服务器接收事件
   * @param options 服务器配置
   * @returns 服务器ID
   */
  createHttpServer (options: OneBotHttpServerOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = randomUUID()
      const path = options.path || '/'

      const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        try {
          /** 检查路径 */
          if (req.url !== path) {
            res.statusCode = 404
            res.end('Not Found')
            return
          }

          /** 只接受POST请求 */
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }

          /** 读取请求体 */
          const buffers: Buffer[] = []
          for await (const chunk of req) {
            buffers.push(Buffer.from(chunk))
          }
          const body = Buffer.concat(buffers).toString('utf-8')

          /** 解析事件数据 */
          let event: OneBotEvent
          try {
            event = JSON.parse(body)
          } catch (error) {
            res.statusCode = 400
            res.end('Invalid JSON')
            return
          }

          /** 获取self_id */
          const selfId = event.self_id
          if (!selfId) {
            res.statusCode = 400
            res.end('Missing self_id')
            return
          }

          /** 查找对应的客户端实例 */
          let foundClient: OneBotHttp | undefined

          for (const client of this._clients.values()) {
            if (client.self.id === selfId) {
              foundClient = client
              break
            }
          }

          if (!foundClient) {
            res.statusCode = 404
            res.end(`{"status":"failed","message":"No client found for self_id: ${selfId}"}`)
            return
          }

          /** 处理事件 */
          try {
            /** 获取所有请求头 */
            const headers: Record<string, string> = {}
            for (const key in req.headers) {
              const value = req.headers[key]
              if (value) {
                headers[key] = Array.isArray(value) ? value[0] : value
              }
            }

            foundClient.handleEvent(event, headers)
            res.statusCode = 200
            res.end('{"status":"ok"}')
          } catch (error) {
            res.statusCode = 403
            res.end(`{"status":"failed","message":"${(error as Error).message}"}`)
          }
        } catch (error) {
          res.statusCode = 500
          res.end(`{"status":"failed","message":"${(error as Error).message}"}`)
        }
      })

      /** 监听错误 */
      server.on('error', (error) => {
        reject(error)
      })

      /** 启动服务器 */
      server.listen(options.port, options.host || '127.0.0.1', () => {
        this._httpServers.set(id, { server, options })
        resolve(id)
      })
    })
  }

  /**
   * 关闭HTTP服务器
   * @param id 服务器ID
   * @returns 是否成功关闭
   */
  closeHttpServer (id: string): boolean {
    const serverInfo = this._httpServers.get(id)
    if (!serverInfo) {
      return false
    }

    /** 关闭服务器 */
    serverInfo.server.close()
    this._httpServers.delete(id)
    return true
  }

  /**
   * 获取所有HTTP服务器
   * @returns 服务器Map
   */
  getHttpServers (): Map<string, { options: OneBotHttpServerOptions }> {
    const servers = new Map<string, { options: OneBotHttpServerOptions }>()
    for (const [id, { options }] of this._httpServers.entries()) {
      servers.set(id, { options })
    }
    return servers
  }

  /**
   * 关闭所有HTTP服务器
   */
  closeAllHttpServers (): void {
    for (const id of this._httpServers.keys()) {
      this.closeHttpServer(id)
    }
  }
}

/**
 * 创建HTTP管理器实例
 * @returns OneBotHttpManager实例
 */
export const oneBotHttpManager = new OneBotHttpManager()
