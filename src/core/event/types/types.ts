import type { Contact } from '@/adapter/contact'
import type { ElementTypes } from '@/adapter/segment'
import type { AdapterType, SendMsgResults } from '@/adapter/adapter'
import type { FriendSender, GroupSender, NoticeAndRequestSender } from '@/adapter/sender'
import type {
  Message,
  Notice,
  Request,
  GroupMessage,
  FriendMessage,
  GuildMessage,
  DirectMessage,
  PrivatePokeNotice,
  PrivateRecallNotice,
  PrivateFileUploadedNotice,
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
  FriendIncreaseNotice,
  PrivateApplyRequest,
  GroupApplyRequest,
  GroupInviteRequest,
  ReceiveLikeNotice,
  FriendDecreaseNotice,
  GroupLuckKingNotice,
  GroupHonorChangedNotice,
} from '@/event/index'

/** 事件父类型枚举 */
export const enum EventParentEnum {
  /** 消息事件 */
  MESSAGE = 'message',
  /** 通知事件 */
  NOTICE = 'notice',
  /** 请求事件 */
  REQUEST = 'request',
}

/** 消息事件子类型枚举 */
export const enum MessageEventSubEnum {
  /** 群消息 */
  GROUP_MESSAGE = 'group',
  /** 好友消息 */
  FRIEND_MESSAGE = 'friend',
  /** 频道消息 */
  GUILD_MESSAGE = 'guild',
  /** 频道私信 */
  GUILD_DIRECT = 'direct',
  /** 群临时会话 */
  GROUP_TEMP = 'groupTemp',
}

/** 通知事件子类型枚举 */
export const enum NoticeEventSubEnum {
  /** 收到点赞 */
  RECEIVE_LIKE = 'receiveLike',

  /** 好友戳一戳 */
  FRIENT_POKE = 'privatePoke',
  /** 好友撤回消息 */
  FRIEND_RECALL = 'privateRecall',
  /** 好友发送文件 */
  FRIEND_FILE_UPLOADED = 'privateFileUploaded',
  /** 好友增加 */
  FRIEND_INCREASE = 'friendIncrease',
  /** 好友减少 */
  FRIEND_DECREASE = 'friendDecrease',

  /** 群聊戳一戳 */
  GROUP_POKE = 'groupPoke',
  /** 群聊名片变动 */
  GROUP_CARD_CHANGED = 'groupCardChanged',
  /** 群聊成员头衔变动 */
  GROUP_MEMBER_TITLE_UPDATED = 'groupMemberTitleUpdate',
  /** 群聊精华消息变动 */
  GROUP_HIGHLIGHTS_CHANGED = 'groupHighlightsChange',
  /** 群聊撤回消息 */
  GROUP_RECALL = 'groupRecall',
  /** 群聊成员增加 */
  GROUP_MEMBER_ADD = 'groupMemberAdd',
  /** 群聊成员减少 */
  GROUP_MEMBER_REMOVE = 'groupMemberRemove',
  /** 群聊管理员变动 */
  GROUP_ADMIN_CHANGED = 'groupAdminChanged',
  /** 群聊成员禁言 */
  GROUP_MEMBER_BAN = 'groupMemberBan',
  /** 群聊签到 */
  GROUP_SIGN_IN = 'groupSignIn',
  /** 群聊全员禁言 */
  GROUP_WHOLE_BAN = 'groupWholeBan',
  /** 群聊发送文件 */
  GROUP_FILE_UPLOADED = 'groupFileUploaded',
  /** 群聊消息表情动态回应 */
  GROUP_MESSAGE_REACTION = 'groupMessageReaction',
  /** 群聊运气王事件 */
  GROUP_LUCKY_KING = 'groupLuckyKing',
  /** 群聊荣誉变更事件 */
  GROUP_HONOR_CHANGE = 'groupHonorChange',

  // /** 机器人被加入某个频道 */
  // BOT_JOIN_GUILD = 'botJoinGuild',
  // /** 频道资料发生变更 */
  // GUILD_UPDATE = 'guildUpdate',
  // /** 频道被解散或机器人被移除 */
  // GUILD_DELETE = 'guildDelete',

  // /** 频道成员增加 */
  // GUILD_MEMBER_INCREASE = 'guildMemberIncrease',
  // /** 频道成员减少 */
  // GUILD_MEMBER_DECREASE = 'guildMemberDecrease',
  // /** 用户的频道属性发生变化，如频道昵称，或者身份组 */
  // GUILD_MEMBER_UPDATE = 'guildMemberUpdate',

  // /** 用户进入音视频/直播子频道时 */
  // AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER = 'audioOrLiveChannelMemberEnter',
  // /** 用户离开音视频/直播子频道时 */
  // AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT = 'audioOrLiveChannelMemberExit',

  // /** 子频道被创建 */
  // CHANNEL_CREATE = 'channelCreate',
  // /** 子频道信息变更 */
  // CHANNEL_UPDATE = 'channelUpdate',
  // /** 子频道被删除 */
  // CHANNEL_DELETE = 'channelDelete',
}

/** 请求事件子类型枚举 */
export const enum RequestEventSubEnum {
  /** 收到添加Bot为好友请求 */
  FRIEND = 'friendApply',
  /** 收到用户申请加入群聊请求 */
  GROUP_APPLY = 'groupApply',
  /** 收到邀请Bot加入群聊请求 */
  GROUP_INVITE = 'groupInvite',
}

/** 事件父类型和子类型映射 */
export type EventToSubEvent = {
  [EventParentEnum.MESSAGE]: MessageEventSubEnum
  [EventParentEnum.NOTICE]: NoticeEventSubEnum
  [EventParentEnum.REQUEST]: RequestEventSubEnum
}

/** 消息事件对应的对象类型 */
export interface MessageEventMap {
  message: Message
  'message.group': GroupMessage
  'message.friend': FriendMessage
  'message.guild': GuildMessage
  'message.direct': DirectMessage
}

/** 私聊通知事件对应的对象类型 */
export interface FriendNoticeEventMap {
  'notice.receiveLike': ReceiveLikeNotice
  'notice.friendDecrease': FriendDecreaseNotice
  'notice.friendIncrease': FriendIncreaseNotice
  'notice.privatePoke': PrivatePokeNotice
  'notice.privateRecall': PrivateRecallNotice
  'notice.privateFileUploaded': PrivateFileUploadedNotice
}

/** 群聊通知事件对应的对象类型 */
export interface GroupNoticeEventMap {
  'notice.groupPoke': GroupPokeNotice
  'notice.groupRecall': GroupRecallNotice
  'notice.groupFileUploaded': GroupFileUploadedNotice
  'notice.groupCardChanged': GroupCardChangedNotice
  'notice.groupMemberTitleUpdate': GroupMemberTitleUpdatedNotice
  'notice.groupHighlightsChange': GroupHlightsChangedNotice
  'notice.groupMemberAdd': GroupMemberIncreaseNotice
  'notice.groupMemberRemove': GroupMemberDecreaseNotice
  'notice.groupAdminChanged': GroupAdminChangedNotice
  'notice.groupSignIn': GroupSignInNotice
  'notice.groupMemberBan': GroupMemberBanNotice
  'notice.groupWholeBan': GroupWholeBanNotice
  'notice.groupMessageReaction': GroupMessageReactionNotice
  'notice.groupLuckyKing': GroupLuckKingNotice
  'notice.groupHonorChange': GroupHonorChangedNotice
}

/** 通知事件对应的对象类型 */
export interface NoticeEventMap extends FriendNoticeEventMap, GroupNoticeEventMap {
  notice: Notice
}

/** 好友请求事件对应的对象类型 */
export interface FriendRequestEventMap {
  'request.friendApply': PrivateApplyRequest
}

/** 群聊请求事件对应的对象类型 */
export interface GroupRequestEventMap {
  'request.groupApply': GroupApplyRequest
  'request.groupInvite': GroupInviteRequest
}

/** 请求事件对应的对象类型 */
export interface RequestEventMap extends FriendRequestEventMap, GroupRequestEventMap {
  request: Request
}

/** 事件子类型联合 */
export type EventSubType<T extends EventParentEnum = EventParentEnum> = EventToSubEvent[T]

/** 快速回复源函数 适配器实现 */
export type SrcReply = (
  /** 发送的消息 */
  elements: ElementTypes[]
) => Promise<SendMsgResults> | SendMsgResults

/** 快速回复函数 */
export type Reply = (
  /** 发送的消息 */
  elements: string | ElementTypes | Array<ElementTypes | string>,
  /** 发送消息选项 */
  options?: {
    /** 是否@发送者 */
    at?: boolean
    /** 是否引用回复发送者 */
    reply?: boolean
    /** 撤回消息时间 默认为0不撤回 */
    recallMsg?: number
    /** 重试次数 默认为0 */
    retryCount?: number
  }
) => Promise<SendMsgResults> | SendMsgResults

/**
 * 事件基类定义
 * @description 所有的事件都拥有这些基本属性
 */
export interface BaseEventType {
  /** 机器人ID */
  selfId: string
  /** 用户ID */
  userId: string
  /** 事件类型 */
  event: `${EventParentEnum}`
  /** 事件子类型 */
  subEvent: `${EventSubType}`
  /** 事件ID */
  eventId: string
  /** 原始事件 */
  rawEvent: any
  /** 事件触发时间戳 */
  time: number
  /** 事件联系人信息 */
  contact: Contact
  /** 事件发送者信息 */
  sender: FriendSender | GroupSender | NoticeAndRequestSender
  /** 快速回复源函数 适配器实现 */
  srcReply: SrcReply
  /** bot自身实例 所有标准Api都通过这里调用 */
  bot: AdapterType
}

/** 构建基本事件所需的参数 */
export type BaseEventOptions = Omit<BaseEventType, 'user_id' | 'self_id'>

/**
 * 事件处理基类定义
 */
export interface BaseEventHandle extends BaseEventType {
  /** 快速回复 */
  reply: Reply
  /** 存储器 由开发者自行调用 */
  store: Map<any, any>

  /** 日志函数字符串 */
  logFnc: string
  /** 日志用户字符串 */
  logText: string
  /** 是否为主人 */
  isMaster: boolean
  /** 是否为Bot管理员 */
  isAdmin: boolean
  /** 是否为私聊场景 */
  isPrivate: boolean
  /** 是否为群聊场景 */
  isGroup: boolean
  /** 是否为频道场景 */
  isGuild: boolean
  /** 是否为群临时会话场景 */
  isGroupTemp: boolean
  /** 是否为频道私信场景 */
  isDirect: boolean
}
