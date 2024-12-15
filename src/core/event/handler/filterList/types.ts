import type { Accept, CommandClass, CommandFnc } from '@/plugin/cache/types'
import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'
import type {
  FriendNoticeEventMap,
  FriendRequestEventMap,
  GroupNoticeEventMap,
  GroupRequestEventMap,
  MessageEventMap,
} from '@/event/types/types'

export type PluginTypes = CommandClass | CommandFnc | Accept
export type EventCfg = FriendDirectFileCfg | GroupGuildFileCfg

export type GroupEvent = GroupRequestEventMap[keyof GroupRequestEventMap]
  | GroupNoticeEventMap[keyof GroupNoticeEventMap]
  | MessageEventMap['message.group']

export type FriendEvent = FriendRequestEventMap[keyof FriendRequestEventMap]
  | FriendNoticeEventMap[keyof FriendNoticeEventMap]
  | MessageEventMap['message.friend']

export type GuildEvent = MessageEventMap['message.guild']
export type DirectEvent = MessageEventMap['message.direct']
