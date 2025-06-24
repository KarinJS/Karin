import type { OneBotMessageApi } from './message'
import type { OneBotFriendApi } from './friend'
import type { OneBotGroupApi } from './group'
import type { OneBotBotApi } from './bot'
import type { OneBotOtherApi } from './other'
import type { OneBotFileApi } from './file'

export * from './message'
export * from './friend'
export * from './group'
export * from './bot'
export * from './other'
export * from './file'

/**
 * OneBot API 接口
 */
export interface OneBotApi extends OneBotMessageApi, OneBotFriendApi, OneBotGroupApi, OneBotBotApi, OneBotOtherApi, OneBotFileApi {
}
