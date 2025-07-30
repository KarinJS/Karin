import type { NoticeEventMap, RequestEventMap } from '../types/event'
import type { ButtonElement, KeyboardElement } from '../types/segment'
import type { PluginPackageType } from '@/core/karin/base'

export * from './package'

export { PluginPackageType }
/** 获取插件的方式 */
export type GetPluginType = PluginPackageType | 'all'

/** 通知、请求事件联合类型 */
export type NoticeAndRequest = NoticeEventMap & RequestEventMap

/** 按钮类型 */
export type ButtonType = ButtonElement | KeyboardElement | Array<ButtonElement | KeyboardElement>
