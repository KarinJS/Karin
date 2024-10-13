import { Sender } from '../adapter/sender'
import { Contact, Scene } from '../adapter/contact'
import { AdapterType, SendMsgResults } from '../adapter/adapter'
import { ElementTypes, segment } from '../adapter/segment'

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
  GROUP_MEMBER_TITLE_UPDATED = 'GroupMemberTitleUpdate',
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

  /** 机器人被加入某个频道 */
  BOT_JOIN_GUILD = 'botJoinGuild',
  /** 频道资料发生变更 */
  GUILD_UPDATE = 'guildUpdate',
  /** 频道被解散或机器人被移除 */
  GUILD_DELETE = 'guildDelete',

  /** 频道成员增加 */
  GUILD_MEMBER_INCREASE = 'guildMemberIncrease',
  /** 频道成员减少 */
  GUILD_MEMBER_DECREASE = 'guildMemberDecrease',
  /** 用户的频道属性发生变化，如频道昵称，或者身份组 */
  GUILD_MEMBER_UPDATE = 'guildMemberUpdate',

  /** 用户进入音视频/直播子频道时 */
  AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER = 'audioOrLiveChannelMemberEnter',
  /** 用户离开音视频/直播子频道时 */
  AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT = 'audioOrLiveChannelMemberExit',

  /** 子频道被创建 */
  CHANNEL_CREATE = 'channelCreate',
  /** 子频道信息变更 */
  CHANNEL_UPDATE = 'channelUpdate',
  /** 子频道被删除 */
  CHANNEL_DELETE = 'channelDelete',
}

/** 请求事件子类型枚举 */
export const enum RequestEventSubEnum {
  /** 收到添加Bot为好友请求 */
  FRIEND = 'friendApply',
  /** 收到用户申请加入群聊请求 */
  GROUP = 'groupApply',
  /** 收到邀请Bot加入群聊请求 */
  GROUP_INVITE = 'groupInvite',
}

/** 事件父类型和子类型映射 */
export type EventToSubEvent = {
  [EventParentEnum.MESSAGE]: MessageEventSubEnum
  [EventParentEnum.NOTICE]: NoticeEventSubEnum
  [EventParentEnum.REQUEST]: RequestEventSubEnum
}

/** 事件子类型联合 */
export type EventSubType<T extends EventParentEnum = EventParentEnum> = EventToSubEvent[T]

/** 快速回复源函数 适配器实现 */
export type SrcReply = (
  /** 发送的消息 */
  elements: ElementTypes[]
) => Promise<SendMsgResults>

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
) => Promise<SendMsgResults>

/**
 * 事件基类定义
 * @description 所有的事件都拥有这些基本属性
 */
export interface BaseEvent {
  /** 机器人ID */
  self_id: string
  /** 用户ID */
  user_id: string
  /** 事件类型 */
  event: EventParentEnum
  /** 事件子类型 */
  subEvent: EventSubType
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
  /** bot自身实例 */
  bot: AdapterType
}

/**
 * 事件处理基类定义
 */
export interface BaseEventHandle extends BaseEvent {
  // /** 序列化的纯文本 消息事件专属 */
  // msg: string
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

/**
 * 事件实现基类
 */
export class BaseEvent implements BaseEventHandle {
  /** 机器人ID */
  self_id: BaseEventHandle['self_id']
  /** 用户ID */
  user_id: BaseEventHandle['user_id']
  /** 事件类型 */
  event: BaseEventHandle['event']
  /** 事件子类型 */
  subEvent: BaseEventHandle['subEvent']
  /** 事件ID */
  eventId: BaseEventHandle['eventId']
  /** 原始事件 */
  rawEvent: BaseEventHandle['rawEvent']
  /** 事件触发时间戳 */
  time: BaseEventHandle['time']
  /** 事件联系人信息 */
  contact: BaseEventHandle['contact']
  /** 事件发送者信息 */
  sender: BaseEventHandle['sender']
  /** 快速回复源函数 适配器实现 */
  srcReply: BaseEventHandle['srcReply']
  /** bot自身实例 */
  bot: BaseEventHandle['bot']

  /** 快速回复 */
  reply: BaseEventHandle['reply']
  /** 存储器 由开发者自行调用 */
  store: BaseEventHandle['store']
  /** 日志函数字符串 */
  logFnc: BaseEventHandle['logFnc']
  /** 日志用户字符串 */
  logText: BaseEventHandle['logText']
  /** 是否为主人 */
  isMaster: BaseEventHandle['isMaster']
  /** 是否为Bot管理员 */
  isAdmin: BaseEventHandle['isAdmin']
  /** 是否为私聊场景 */
  isPrivate: BaseEventHandle['isPrivate']
  /** 是否为群聊场景 */
  isGroup: BaseEventHandle['isGroup']
  /** 是否为频道场景 */
  isGuild: BaseEventHandle['isGuild']
  /** 是否为群临时会话场景 */
  isGroupTemp: BaseEventHandle['isGroupTemp']
  /** 是否为频道私信场景 */
  isDirect: BaseEventHandle['isDirect']

  constructor ({
    self_id: selfId,
    user_id: userId,
    event,
    subEvent,
    eventId,
    rawEvent,
    time,
    contact,
    sender,
    srcReply,
    bot,
  }: BaseEvent) {
    this.self_id = selfId
    this.user_id = userId
    this.event = event
    this.subEvent = subEvent
    this.eventId = eventId
    this.rawEvent = rawEvent
    this.time = time
    this.contact = contact
    this.sender = sender
    this.srcReply = srcReply
    this.bot = bot

    this.store = new Map()
    this.logFnc = ''
    this.logText = ''
    this.isMaster = false
    this.isAdmin = false
    this.isPrivate = false
    this.isGroup = false
    this.isGuild = false
    this.isGroupTemp = false
    this.isDirect = false

    this.reply = async (elements, options) => {
      const request: SendMsgResults = {
        message_id: '',
        message_time: 0,
        raw_data: undefined,
      }

      /** 参数归一化 */
      if (!Array.isArray(elements)) elements = [elements]
      elements = elements.map((element) => typeof element === 'string' ? segment.text(element) : element)

      const at = options?.at ?? false
      const reply = options?.reply ?? false
      const recallMsg = options?.recallMsg ?? 0
      // const retryCount = options?.retryCount ?? 0

      /** 加入at */
      if (at && this.contact.scene !== Scene.GUILD_DIRECT && this.contact.scene !== Scene.FRIEND) {
        elements.unshift(segment.at(this.user_id))
      }

      /** 加入引用回复 */
      if (reply && 'message_id' in this) {
        elements.unshift(segment.reply(this.message_id as string))
      }

      /** 快速撤回 */
      if (recallMsg > 0 && request.message_id) {
        setTimeout(() => {
          this.bot.recallMsg(this.contact, request.message_id)
        }, recallMsg * 1000)
      }

      return request
    }
  }
}
