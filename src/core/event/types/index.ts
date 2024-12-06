export * from '@/event/types/types'
import type { DirectMessage } from '@/event/create/message/direct'
import type { FriendMessage } from '@/event/create/message/friend'
import type { GroupMessage } from '@/event/create/message/group'
import type { GuildMessage } from '@/event/create/message/guild'
import type { PrivateNotice } from '@/event/create/notice/friend'
import type { GroupNotice } from '@/event/create/notice/group'
import type { PrivateApplyRequest } from '@/event/create/request/friend'
import type { GroupApplyRequest, GroupInviteRequest } from '@/event/create/request/group'

/** 消息事件 */
export type Message = FriendMessage | DirectMessage | GroupMessage | GuildMessage
/** 通知事件 */
export type Notice = PrivateNotice | GroupNotice

/** 请求事件 */
export type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest

/** 全部事件 */
export type Event = Message | Notice | Request
