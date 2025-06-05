import type { Sender } from './sender'
import type { SrcReply } from './reply'
import type { Contact } from './contact'
import type { AdapterType } from '../adapter'
import type { Elements } from '../segment'
import type {
  FriendDecreaseType,
  FriendIncreaseType,
  GroupPokeType,
  PrivateFileUploadedType,
  PrivatePokeType,
  PrivateRecallType,
  ReceiveLikeType,
  GroupRecallType,
  GroupFileUploadedType,
  GroupCardChangedType,
  GroupMemberUniqueTitleChangedType,
  GroupHlightsChangedType,
  GroupMemberIncreaseType,
  GroupMemberDecreaseType,
  GroupAdminChangedType,
  GroupSignInType,
  GroupMemberBanType,
  GroupWholeBanType,
  GroupMessageReactionType,
  GroupLuckKingType,
  GroupHonorChangedType,
  PrivateApplyType,
  GroupApply,
  GroupInvite,
} from './content'

/**
 * 事件父类型
 * - `message`: 消息事件
 * - `notice`: 通知事件
 * - `request`: 请求事件
 */
export type EventParent = 'message' | 'notice' | 'request'

/**
 * `消息`事件子类型
 * - `group`: 群消息
 * - `friend`: 好友消息
 * - `guild`: 频道消息
 * - `direct`: 频道私信
 * - `groupTemp`: 群临时会话
 */
export type MessageEventSub = 'group' | 'friend' | 'guild' | 'direct' | 'groupTemp'

/**
 * `通知`事件子类型
 * - `receiveLike`: 收到点赞
 * - `friendPoke`: 好友戳一戳
 * - `friendRecall`: 好友撤回消息
 * - `privateFileUploaded`: 好友发送文件
 * - `friendIncrease`: 好友增加
 * - `friendDecrease`: 好友减少
 *
 * - `groupPoke`: 群聊戳一戳
 * - `groupCardChanged`: 群聊名片变动
 * - `groupMemberTitleUpdate`: 群聊成员头衔变动
 * - `groupHighlightsChange`: 群聊精华消息变动
 * - `groupRecall`: 群聊撤回消息
 * - `groupMemberAdd`: 群聊成员增加
 * - `groupMemberRemove`: 群聊成员减少
 * - `groupAdminChanged`: 群聊管理员变动
 * - `groupMemberBan`: 群聊成员禁言
 * - `groupSignIn`: 群聊签到
 * - `groupWholeBan`: 群聊全员禁言
 * - `groupFileUploaded`: 群聊发送文件
 * - `groupMessageReaction`: 群聊消息表情动态回应
 * - `groupLuckyKing`: 群聊运气王事件
 * - `groupHonorChange`: 群聊荣誉变更事件
 */
export type NoticeEventSub =
  /** 收到点赞 */
  'receiveLike'
  /** 好友戳一戳 */
  | 'friendPoke'
  /** 好友撤回消息 */
  | 'friendRecall'
  /** 好友发送文件 */
  | 'privateFileUploaded'
  /** 好友增加 */
  | 'friendIncrease'
  /** 好友减少 */
  | 'friendDecrease'
  /** 群聊戳一戳 */
  | 'groupPoke'
  /** 群聊名片变动 */
  | 'groupCardChanged'
  /** 群聊成员头衔变动 */
  | 'groupMemberTitleUpdate'
  /** 群聊精华消息变动 */
  | 'groupHighlightsChange'
  /** 群聊撤回消息 */
  | 'groupRecall'
  /** 群聊成员增加 */
  | 'groupMemberAdd'
  /** 群聊成员减少 */
  | 'groupMemberRemove'
  /** 群聊管理员变动 */
  | 'groupAdminChanged'
  /** 群聊成员禁言 */
  | 'groupMemberBan'
  /** 群聊签到 */
  | 'groupSignIn'
  /** 群聊全员禁言 */
  | 'groupWholeBan'
  /** 群聊发送文件 */
  | 'groupFileUploaded'
  /** 群聊消息表情动态回应 */
  | 'groupMessageReaction'
  /** 群聊运气王事件 */
  | 'groupLuckyKing'
  /** 群聊荣誉变更事件 */
  | 'groupHonorChange'

// /** 机器人被加入某个频道 */
// | 'botJoinGuild'
// /** 频道资料发生变更 */
// | 'guildUpdate'
// /** 频道被解散或机器人被移除 */
// | 'guildDelete'
// /** 频道成员增加 */
// | 'guildMemberIncrease'
// /** 频道成员减少 */
// | 'guildMemberDecrease'
// /** 用户的频道属性发生变化，如频道昵称，或者身份组 */
// | 'guildMemberUpdate'
// /** 用户进入音视频/直播子频道时 */
// | 'audioOrLiveChannelMemberEnter'
// /** 用户离开音视频/直播子频道时 */
// | 'audioOrLiveChannelMemberExit'
// /** 子频道被创建 */
// | 'channelCreate'
// /** 子频道信息变更 */
// | 'channelUpdate'
// /** 子频道被删除 */
// | 'channelDelete'

/**
 * `请求`事件子类型
 * - `friendApply`: 收到添加Bot为好友请求
 * - `groupApply`: 收到用户申请加入群聊请求
 * - `groupInvite`: 收到邀请Bot加入群聊请求
 */
export type RequestEventSub = 'friendApply' | 'groupApply' | 'groupInvite'

/**
 * 事件父类型与子类型的映射
 */
export interface EventToSubEvent {
  message: MessageEventSub
  notice: NoticeEventSub
  request: RequestEventSub
}

/**
 * 事件基类定义
 * @description 所有的事件都拥有这些基本属性
 */
export interface BaseEventType<T extends EventParent> {
  /** 机器人ID */
  selfId: string
  /** 用户ID */
  userId: string
  /** 事件类型 */
  event: T
  /** 事件子类型 */
  subEvent: EventToSubEvent[T]
  /** 事件ID */
  eventId: string
  /** 原始事件 */
  rawEvent: any
  /** 事件触发时间戳 */
  time: number
  /** 事件联系人信息 */
  contact: Contact
  /** 事件发送者信息 */
  sender: Sender
  /** 快速回复源函数 适配器实现 */
  srcReply: SrcReply
  /** bot自身实例 所有标准Api都通过这里调用 */
  bot: AdapterType
}

/** 事件基类参数 */
export type BaseEventOptions<T extends EventParent> = Omit<BaseEventType<T>, 'userId' | 'selfId'>

/** 创建消息事件类所需参数类型 */
export type MessageOptions = Omit<BaseEventOptions<'message'>, 'event'> & {
  /** 消息ID */
  messageId: string
  /** 消息序列号 */
  messageSeq: number
  /** 消息体元素 */
  elements: Elements[]
}

/** 创建好友消息事件所需参数类型 */
export type FriendMessageOptions = Omit<
  MessageOptions,
  'subEvent' | 'contact' | 'sender'
> & {
  /** 事件来源好友信息 */
  contact: Contact<'friend'>
  /** 好友发送者信息 */
  sender: Sender<'friend'>
}

/** 创建群消息事件所需参数类型 */
export type GroupMessageOptions = Omit<
  MessageOptions,
  'subEvent' | 'contact' | 'sender'
> & {
  /** 事件来源群信息 */
  contact: Contact<'group'>
  /** 群发送者信息 */
  sender: Sender<'group'>
}

/** 创建频道消息事件所需参数类型 */
export type GuildMessageOptions = Omit<
  MessageOptions,
  'subEvent' | 'contact' | 'sender'
> & {
  /** 事件来源频道信息 */
  contact: Contact<'guild'>
  /** 频道发送者信息 */
  sender: Sender<'guild'>
}

/** 创建频道私信消息事件所需参数类型 */
export type DirectMessageOptions = Omit<
  MessageOptions,
  'subEvent' | 'contact' | 'sender'
> & {
  /** 事件来源频道私信信息 */
  contact: Contact<'direct'>
  /** 频道私信发送者信息 */
  sender: Sender<'direct'>
  /** 来源频道ID */
  srcGuildId: string
}

/** 创建群临时会话消息事件所需参数类型 */
export type GroupTempMessageOptions = Omit<
  MessageOptions,
  'subEvent' | 'contact' | 'sender'
> & {
  /** 事件来源群临时会话信息 */
  contact: Contact<'groupTemp'>
  /** 群临时会话发送者信息 */
  sender: Sender<'groupTemp'>
}

/** 通知事件: 创建通知事件类所需参数类型 */
export type NoticeOptions = Omit<BaseEventOptions<'notice'>, 'event' | 'sender'> & {
  sender: Sender
}

/** 创建收到点赞通知事件 */
export type ReceiveLikeOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: ReceiveLikeType
}

/** 创建好友增加通知事件 */
export type FriendIncreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: FriendIncreaseType
}

/** 创建好友减少通知事件 */
export type FriendDecreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: FriendDecreaseType
}

/** 创建私聊戳一戳通知事件 */
export type PrivatePokeOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: PrivatePokeType
}

/** 创建私聊撤回消息通知事件 */
export type PrivateRecallOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: PrivateRecallType
}

/** 创建私聊文件上传通知事件 */
export type PrivateFileUploadedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: PrivateFileUploadedType
}

/** 创建群聊戳一戳通知事件 */
export type GroupPokeOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupPokeType
}

/** 创建群聊撤回通知事件 */
export type GroupRecallOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupRecallType
}

/** 创建群聊文件上传通知事件 */
export type GroupFileUploadedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupFileUploadedType
}

/** 创建群名片变动通知事件 */
export type GroupCardChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupCardChangedType
}

/** 创建群成员头衔变动通知事件 */
export type GroupMemberUniqueTitleChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupMemberUniqueTitleChangedType
}

/** 创建群精华消息变动通知事件 */
export type GroupHlightsChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupHlightsChangedType
}

/** 创建群成员增加通知事件 */
export type GroupMemberIncreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupMemberIncreaseType
}

/** 创建群成员减少通知事件 */
export type GroupMemberDecreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupMemberDecreaseType
}

/** 创建群管理员变动通知事件 */
export type GroupAdminChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupAdminChangedType
}

/** 创建群打卡通知事件 */
export type GroupSignInOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupSignInType
}

/** 创建群成员被禁言通知事件 */
export type GroupMemberBanOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupMemberBanType
}

/** 创建群全员禁言通知事件 */
export type GroupWholeBanOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupWholeBanType
}

/** 创建群表情动态通知事件 */
export type GroupMessageReactionOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupMessageReactionType
}

/** 创建群聊运气王通知事件 */
export type GroupLuckKingOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupLuckKingType
}

/** 创建群聊荣誉变更通知事件 */
export type GroupHonorChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupHonorChangedType
}

/** 创建请求事件类所需参数类型 */
export type RequestOptions = Omit<BaseEventOptions<'request'>, 'event'> & {
  /** 请求内容 */
  content: any
}

/** 创建好友申请请求事件 */
export type PrivateApplyRequestOptions = RequestOptions & {
  /** 事件来源信息 */
  contact: Contact<'friend'>
  /** 事件创建者信息 */
  sender: Sender<'friend'>
  /** 请求内容 */
  content: PrivateApplyType
}

export type FriendRequestOptions = PrivateApplyRequestOptions

/** 创建新成员加入群聊申请请求事件 */
export type GroupApplyRequestOptions = RequestOptions & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupApply
}

/** 创建邀请机器人加入群聊请求事件 */
export type GroupInviteRequestOptions = RequestOptions & {
  /** 事件来源信息 */
  contact: Contact<'group'>
  /** 事件创建者信息 */
  sender: Sender<'group'>
  /** 请求内容 */
  content: GroupInvite
}
