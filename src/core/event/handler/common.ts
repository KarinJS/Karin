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

type PluginTypes = CommandClass | CommandFnc | Accept
type EventCfg = FriendDirectFileCfg | GroupGuildFileCfg

type GroupEvent = GroupRequestEventMap[keyof GroupRequestEventMap]
  | GroupNoticeEventMap[keyof GroupNoticeEventMap]
  | MessageEventMap['message.group']

type FriendEvent = FriendRequestEventMap[keyof FriendRequestEventMap]
  | FriendNoticeEventMap[keyof FriendNoticeEventMap]
  | MessageEventMap['message.friend']

type GuildEvent = MessageEventMap['message.guild']
type DirectEvent = MessageEventMap['message.direct']
