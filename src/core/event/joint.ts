import type { DirectMessage } from './message/direct'
import type { FriendMessage } from './message/friend'
import type { GroupMessage } from './message/group'
import type { GuildMessage } from './message/guild'
import type {
  FriendIncreaseNotice,
  PrivatePokeNotice,
  PrivateRecallNotice,
  PrivateFileUploadedNotice,
} from './notice/friend'
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
} from './notice/group'
import type { PrivateApplyRequest } from './request/friend'
import type { GroupApplyRequest, GroupInviteRequest } from './request/group'

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
