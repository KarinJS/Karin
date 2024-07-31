import { KarinEventType, BaseEventDataType, EventType, NoticeSubType } from './event'

/**
 * - 私聊戳一戳
 */
export interface PrivatePokeType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 操作名称，如“戳了戳”
   */
  action: string
  /**
   * - 后缀，未设置则未空字符串
   */
  suffix: string
  /**
   * - 操作图标url
   */
  action_image: string
}

/**
 * - 私聊撤回消息
 */
export interface PrivateRecallType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 撤回的消息id
   */
  message_id: string
  /**
   * - 操作名称，如“撤回了一条消息”  一般此项为空字符串
   */
  tip_text: string
}

/**
 * - 私聊文件上传
 * - 文件信息最少需要提供一个url
 */
export interface PrivateFileUploadedType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 文件ID 此项没有则为空字符串
   */
  file_id: string
  /**
   * - 文件子ID 此项没有则为空字符串
   */
  file_sub_id: number
  /**
   * - 文件名 此项没有则为空字符串
   */
  file_name: string
  /**
   * - 文件大小 此项没有则为0
   */
  file_size: number
  /**
   * - 过期时间 此项没有则为0
   */
  expire_time: number
  /**
   * - 文件URL
   */
  file_url: string
}

/**
 * - 群聊戳一戳
 */
export interface GroupPokeType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid 一般为被戳的uid
   */
  target_uid: string
  /**
   * - 目标uin 一般为被戳的uin
   */
  target_uin: string
  /**
   * - 操作名称，如“戳了戳”
   */
  action: string
  /**
   * - 后缀，未设置则未空字符串
   */
  suffix: string
  /**
   * - 操作图标url
   */
  action_image: string
}

/**
 * - 群聊撤回
 * - 撤回自己消息时，operator和target为自己
 * - 撤回别人消息时，operator为操作者，target为被撤回者
 */
export interface GroupRecallType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 撤回的消息id
   */
  message_id: string
  /**
   * - 操作名称，如“撤回了一条消息”  一般此项为空字符串
   */
  tip_text: string
}

/**
 * - 群文件上传
 * - 文件信息最少需要提供一个url
 */
export interface GroupFileUploadedType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 文件ID 此项没有则为空字符串
   */
  file_id: string
  /**
   * - 文件子ID 此项没有则为0
   */
  file_sub_id: number
  /**
   * - 文件名 此项没有则为空字符串
   */
  file_name: string
  /**
   * - 文件大小 此项没有则为0
   */
  file_size: number
  /**
   * - 过期时间 此项没有则为0
   */
  expire_time: number
  /**
   * - 文件URL
   */
  file_url: string
}

/**
 * - 群名片变动
 */
export interface GroupCardChangedType {
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 新名片
   */
  new_card: string
}

/**
 * - 群成员头衔变动
 */
export interface GroupMemberUniqueTitleChangedType {
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 新头衔
   */
  title: string
}

/**
 * - 群精华消息变动
 */
export interface GroupEssenceChangedType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 被操作的消息id
   */
  message_id: string
  /**
   * - 设置、取消精华
   */
  is_set: boolean
}

/**
 * - 群成员增加
 */
export interface GroupMemberIncreaseType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 加入方式 APPROVE:管理员批准 INVITE:管理员邀请
   */
  type: 'invite' | 'approve'
}

/**
 * - 群成员减少
 */
export interface GroupMemberDecreaseType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 减少方式 leave:主动退群 kick:成员被踢 kick_me:机器人自身被踢
   */
  type: 'leave' | 'kick' | 'kick_me'
}

/**
 * - 群管理员变动
 */
export interface GroupAdminChangedType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 设置、取消管理员
   */
  is_admin: boolean
}

/**
 * - 群打卡
 */
export interface GroupSignInType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 操作名称，如“打卡了”
   */
  action: string
  /**
   * - 打卡图标url
   */
  rank_image: string
}

/**
 * - 群成员被禁言
 */
export interface GroupMemberBanType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 目标uid
   */
  target_uid: string
  /**
   * - 目标uin
   */
  target_uin: string
  /**
   * - 禁言时长，单位秒
   */
  duration: number
  /**
   * - 禁言类型 ban:禁言 lift_ban:解禁
   */
  type: 'ban' | 'lift_ban'
}

/**
 * - 群全员禁言
 */
export interface GroupWholeBanType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 是否开启全体禁言
   */
  is_ban: boolean
}

/**
 * - 群表情动态
 */
export interface GroupMessageReactionType {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 操作者uid
   */
  message_id: string
  /**
   * - 表情ID 参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType
   */
  face_id: number
  /**
   * - 添加、取消回应
   */
  is_set: boolean
}

/**
 * - 通知事件子类型
 */
export interface NoticeType {
  [NoticeSubType.PrivatePoke]: PrivatePokeType
  [NoticeSubType.PrivateRecall]: PrivateRecallType
  [NoticeSubType.PrivateFileUploaded]: PrivateFileUploadedType
  [NoticeSubType.GroupPoke]: GroupPokeType
  [NoticeSubType.GroupRecall]: GroupRecallType
  [NoticeSubType.GroupFileUploaded]: GroupFileUploadedType
  [NoticeSubType.GroupCardChanged]: GroupCardChangedType
  [NoticeSubType.GroupMemberUniqueTitleChanged]: GroupMemberUniqueTitleChangedType
  [NoticeSubType.GroupEssenceChanged]: GroupEssenceChangedType
  [NoticeSubType.GroupMemberIncrease]: GroupMemberIncreaseType
  [NoticeSubType.GroupMemberDecrease]: GroupMemberDecreaseType
  [NoticeSubType.GroupAdminChanged]: GroupAdminChangedType
  [NoticeSubType.GroupSignIn]: GroupSignInType
  [NoticeSubType.GroupMemberBan]: GroupMemberBanType
  [NoticeSubType.GroupWholeBan]: GroupWholeBanType
  [NoticeSubType.GroupMessageReaction]: GroupMessageReactionType
}

/**
 * - 请求事件基类
 */
export interface KarinNoticeEventBase extends KarinEventType {
  event: EventType.Notice
}

/**
 * - 辅助类型，用于生成 KarinRequestEvent 的联合类型来自动推导content的类型
 */
type NoticeEvent<T extends NoticeSubType> = KarinNoticeEventBase & {
  sub_event: T
  content: NoticeType[T]
}

/**
 * - 通知事件定义
 */
export type KarinNoticeType = NoticeEvent<NoticeSubType.PrivatePoke>
  | NoticeEvent<NoticeSubType.PrivateRecall>
  | NoticeEvent<NoticeSubType.PrivateFileUploaded>
  | NoticeEvent<NoticeSubType.GroupPoke>
  | NoticeEvent<NoticeSubType.GroupRecall>
  | NoticeEvent<NoticeSubType.GroupFileUploaded>
  | NoticeEvent<NoticeSubType.GroupCardChanged>
  | NoticeEvent<NoticeSubType.GroupMemberUniqueTitleChanged>
  | NoticeEvent<NoticeSubType.GroupEssenceChanged>
  | NoticeEvent<NoticeSubType.GroupMemberIncrease>
  | NoticeEvent<NoticeSubType.GroupMemberDecrease>
  | NoticeEvent<NoticeSubType.GroupAdminChanged>
  | NoticeEvent<NoticeSubType.GroupSignIn>
  | NoticeEvent<NoticeSubType.GroupMemberBan>
  | NoticeEvent<NoticeSubType.GroupWholeBan>
  | NoticeEvent<NoticeSubType.GroupMessageReaction>

/**
 * - 创建一个通知事件
 */
export class KarinNotice implements KarinNoticeEventBase {
  self_id: KarinNoticeType['self_id']
  user_id: KarinNoticeType['user_id']
  group_id: KarinNoticeType['group_id']
  event: KarinNoticeType['event']
  sub_event: KarinNoticeType['sub_event']
  event_id: KarinNoticeType['event_id']
  time: KarinNoticeType['time']
  contact: KarinNoticeType['contact']
  sender: KarinNoticeType['sender']
  isMaster: KarinNoticeType['isMaster']
  isAdmin: KarinNoticeType['isAdmin']
  isPrivate: KarinNoticeType['isPrivate']
  isGroup: KarinNoticeType['isGroup']
  isGuild: KarinNoticeType['isGuild']
  isGroupTemp: KarinNoticeType['isGroupTemp']
  logFnc: KarinNoticeType['logFnc']
  logText: KarinNoticeType['logText']
  store: KarinNoticeType['store']
  raw_message: KarinNoticeType['raw_message']
  raw_event: KarinNoticeType['raw_event']
  reply!: KarinNoticeType['reply']
  replyCallback!: KarinNoticeType['replyCallback']
  bot!: KarinNoticeType['bot']

  content: KarinNoticeType['content']
  constructor ({
    event_id,
    self_id,
    user_id,
    group_id = '',
    time,
    contact,
    sender,
    sub_event,
    content,
    raw_event,
  }: BaseEventDataType & {
    sub_event: KarinNoticeType['sub_event']
    content: KarinNoticeType['content']
  }) {
    this.raw_event = raw_event
    this.self_id = self_id
    this.user_id = user_id
    this.group_id = contact.scene === 'group' ? (contact.peer || group_id) : group_id
    this.time = time
    this.event = EventType.Notice
    this.event_id = event_id
    this.contact = contact
    this.sender = sender
    this.sub_event = sub_event
    this.isMaster = false
    this.isAdmin = false
    this.isPrivate = false
    this.isGroup = false
    this.isGuild = false
    this.isGroupTemp = false
    this.logFnc = ''
    this.logText = ''
    this.store = new Map()
    this.raw_message = ''
    this.content = content
  }
}
