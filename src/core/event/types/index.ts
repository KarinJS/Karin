import type {
  GroupMessage,
  FriendMessage,
  GuildMessage,
  DirectMessage,
} from '@/event/create/message/index'

import type { FriendNotice } from '@/event/create/notice/friend'
import type { GroupNotice } from '@/event/create/notice/group'
import type { PrivateApplyRequest } from '@/event/create/request/friend'
import type { GroupApplyRequest, GroupInviteRequest } from '@/event/create/request/group'

/** 消息事件 */
export type Message = FriendMessage | DirectMessage | GroupMessage | GuildMessage
/** 通知事件 */
export type Notice = FriendNotice | GroupNotice

/** 请求事件 */
export type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest

/** 全部事件 */
export type Event = Message | Notice | Request
