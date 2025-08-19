import { listeners } from '@/core/internal'
import { WS_CONNECTION_ONEBOT } from '@/utils/fs/key'
import { adapter } from '@/utils/config/file/adapter'
import { createOneBotEventDispatchRouter } from './router'
import { createOneBotClient, createOneBotHttp, createOneBotWsServer } from '@/adapter/onebot'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

/**
 * @internal
 * @description 初始化OneBot适配器
 */
export const initOneBotAdapter = async () => {
  /** 初始化OneBot WebSocket 服务 */
  listeners.on(WS_CONNECTION_ONEBOT, (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    call()
    createOneBotWsServer(socket, request)
  })

  const cfg = adapter()

  /** 初始化OneBot WebSocket 客户端 */
  if (cfg.onebot.ws_client && Array.isArray(cfg.onebot.ws_client)) {
    for (const item of cfg.onebot.ws_client) {
      if (!item?.enable || !item?.url) continue
      createOneBotClient(item.url, item.token)
    }
  }

  /** 初始化OneBot HTTP 服务 */
  if (cfg.onebot.http_server && Array.isArray(cfg.onebot.http_server)) {
    for (const item of cfg.onebot.http_server) {
      if (!item?.enable || !item?.url || !item?.self_id) continue
      createOneBotHttp(item)
    }
  }

  createOneBotEventDispatchRouter()
}
