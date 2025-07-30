import type { NoticeEventMap, RequestEventMap, ButtonElement, KeyboardElement } from 'node-karin'

/** 通知、请求事件联合类型 */
export type NoticeAndRequest = NoticeEventMap & RequestEventMap

/** 按钮类型 */
export type ButtonType = ButtonElement | KeyboardElement | Array<ButtonElement | KeyboardElement>
