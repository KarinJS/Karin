export * from './types'
import type { DirectMessage } from '../create/message/direct'
import type { FriendMessage } from '../create/message/friend'
import type { GroupMessage } from '../create/message/group'
import type { GuildMessage } from '../create/message/guild'
import type { PrivateNotice } from '../create/notice/friend'
import type { GroupNotice } from '../create/notice/group'
import type { PrivateApplyRequest } from '../create/request/friend'
import type { GroupApplyRequest, GroupInviteRequest } from '../create/request/group'

/** 消息事件 */
export type Message = FriendMessage | DirectMessage | GroupMessage | GuildMessage
/** 通知事件 */
export type Notice = PrivateNotice | GroupNotice

/** 请求事件 */
export type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest

/** 全部事件 */
export type Event = Message | Notice | Request
