import type { AdapterOneBot } from './core'
import type { OneBotHttp, OneBotWsClient, OneBotWsServer } from '@karinjs/onebot'

/** OneBot适配器缓存Map */
export const cacheMap = {
  wsServer: new Map<string, AdapterOneBot<OneBotWsServer>>(),
  wsClient: new Map<string, AdapterOneBot<OneBotWsClient>>(),
  http: new Map<string, AdapterOneBot<OneBotHttp>>(),
}
