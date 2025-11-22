import { createOneBotRouter } from './router'
import { createWebSocketServer } from './ws-server'
import {
  cache,
  initOneBotWsClients,
  initOneBotHttpClients,
  createWsServer,
  createClient,
  createHttp,
} from './create'

/**
 * 初始化并运行 OneBot 适配器
 * @public
 */
export const KARIN_ADAPTER_RUN = async () => {
  await Promise.allSettled([
    initOneBotWsClients(),
    initOneBotHttpClients(),
  ])

  createOneBotRouter()
  createWebSocketServer()
}

export {
  cache,
  initOneBotWsClients,
  initOneBotHttpClients,
  createWsServer,
  createClient,
  createHttp,
}
