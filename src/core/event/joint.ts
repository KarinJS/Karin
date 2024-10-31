import type { DirectMessage } from './create/message/direct'
import type { FriendMessage } from './create/message/friend'
import type { GroupMessage } from './create/message/group'
import type { GuildMessage } from './create/message/guild'
import type {
  FriendIncreaseNotice,
  PrivatePokeNotice,
  PrivateRecallNotice,
  PrivateFileUploadedNotice,
} from './create/notice/friend'
import type {
  GroupPokeNotice,
  GroupRecallNotice,
  GroupFileUploadedNotice,
  GroupCardChangedNotice,
  GroupMemberTitleUpdatedNotice,
  GroupHlightsChangedNotice,
  GroupMemberIncreaseNotice,
  GroupMemberDecreaseNotice,
  GroupAdminChangedNotice,
  GroupSignInNotice,
  GroupMemberBanNotice,
  GroupWholeBanNotice,
  GroupMessageReactionNotice,
} from './create/notice/group'
import type { PrivateApplyRequest } from './create/request/friend'
import type { GroupApplyRequest, GroupInviteRequest } from './create/request/group'

/** 消息事件 */
export type Message = FriendMessage | DirectMessage | GroupMessage | GuildMessage
/** 通知事件 */
export type Notice = PrivatePokeNotice
  | PrivateRecallNotice
  | PrivateFileUploadedNotice
  | GroupPokeNotice
  | GroupRecallNotice
  | GroupFileUploadedNotice
  | GroupCardChangedNotice
  | GroupMemberTitleUpdatedNotice
  | GroupHlightsChangedNotice
  | GroupMemberIncreaseNotice
  | GroupMemberDecreaseNotice
  | GroupAdminChangedNotice
  | GroupSignInNotice
  | GroupMemberBanNotice
  | GroupWholeBanNotice
  | GroupMessageReactionNotice
  | FriendIncreaseNotice

/** 请求事件 */
export type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest

/** 全部事件 */
export type Event = Message | Notice | Request
