import { karin } from '@/karin'
import { config as cfg } from '@/utils'
import { context as ctx } from '@/event/handler/message/context'
import type { AdapterProtocol } from '@/adapter/adapter'
import type { Accept, CommandClass, CommandFnc } from '@/plugin/cache/types'
import type { FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'
import type {
  FriendNoticeEventMap,
  FriendRequestEventMap,
  GroupNoticeEventMap,
  GroupRequestEventMap,
  MessageEventMap,
} from '@/event/types/types'
import type {
  Message,
  GroupMessage,
  FriendMessage,
  Event,
  FriendNotice,
  GroupNotice,
  GroupRequest,
  FriendRequest,
  GuildMessage,
} from '@/event'

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
