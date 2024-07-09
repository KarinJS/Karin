import { KarinMessageType } from './message'
import { KarinNoticeType } from './notice'
import { KarinRequestType } from './request'

export * from './message'
export * from './notice'
export * from './request'
export * from './event'
export * from './contact'
export * from './reply'
export * from './sender'

export type KarinEventTypes = KarinMessageType | KarinNoticeType | KarinRequestType
export type KarinETypes<T> = T extends KarinMessageType ? 'message' : T extends KarinNoticeType ? 'notice' : T extends KarinRequestType ? 'request' : never
