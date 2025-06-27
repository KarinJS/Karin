import { OneBotWsServer } from './server'
import { OneBotErrorType } from '../events'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotWsServerOptions } from '../types'

/**
 * OneBot WebSocket 服务端管理器
 */
class OneBotWsServerManager {
  /**
   * 创建WebSocket服务端
   * @param socket - WebSocket实例
   * @param request - 请求
   * @param options - 配置选项
   * @returns OneBotWsServer服务端实例
   */
  createServer (socket: WebSocket, request: IncomingMessage, options: OneBotWsServerOptions): OneBotWsServer {
    /** 鉴权检查 */
    if (options?.accessToken) {
      const authHeader = request.headers['authorization']

      /** 检查Authorization头 */
      if (!authHeader) {
        socket.close(OneBotErrorType.AUTH_INVALID_FORMAT)
        throw new Error('WebSocket连接鉴权失败：缺少Authorization头')
      }

      /** 检查token格式 */
      const match = authHeader.match(/^Bearer\s+(.+)$/)
      if (!match) {
        socket.close(OneBotErrorType.AUTH_INVALID_FORMAT)
        throw new Error('WebSocket连接鉴权失败：Authorization头格式错误')
      }

      /** 检查token是否匹配 */
      const token = match[1]
      if (token !== options.accessToken) {
        socket.close(OneBotErrorType.AUTH_FAILED)
        throw new Error('WebSocket连接鉴权失败：无效的Token')
      }
    }

    const server = new OneBotWsServer(socket, request, options)
    return server
  }
}

export const oneBotWsServerManager = new OneBotWsServerManager()
