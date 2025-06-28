import type { OneBotHttp } from '../http'
import type { OneBotWsClient, OneBotWsServer } from '../ws'

/**
 * OneBot实例类型
 */
export type OneBotType = OneBotHttp | OneBotWsClient | OneBotWsServer
