import { Echo } from './echo'
import type { OneBotMessageEvent } from './message'
import type { OneBotMessageSentEvent } from './message_sent'
import type { OneBotMetaEvent } from './meta_event'
import type { OneBotNoticeEvent } from './notice'
import type { OneBotRequestEvent } from './request'

/** OneBot 上报事件类型 */
export type OneBotEvent =
  | OneBotMessageEvent
  | OneBotMessageSentEvent
  | OneBotMetaEvent
  | OneBotNoticeEvent
  | OneBotRequestEvent

/** OneBot WebSocket 上报事件类型 */
export type OneBotWsEvent = OneBotEvent | Echo

export * from './echo'
export * from './event'
export * from './message'
export * from './message_sent'
export * from './meta_event'
export * from './notice'
export * from './request'
export * from './sender'
