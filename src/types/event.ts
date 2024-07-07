import { KarinAdapter } from './adapter'
import { KarinElement } from './element'
import { Reply, replyCallback } from './reply'

/**
 * - 事件类型
 */
export type Event = 'message' | 'notice' | 'request' | 'meta_event' | 'message_sent'

/**
 * - 事件来源
 */
export type Scene = 'group' | 'friend' | 'guild' | 'nearby' | 'stranger' | 'stranger_from_group'

/**
 * - 类型映射
 */
export type EventToSubEvent = {
  message: 'group_message' | 'private_message' | 'guild_message' | 'nearby' | 'stranger' | 'stranger_from_group'
  notice: 'private_poke' | 'private_recall' | 'private_file_uploaded' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_ban' | 'group_sign_in' | 'group_whole_ban' | 'group_file_uploaded' | 'group_message_reaction'
  request: 'private_apply' | 'group_apply' | 'invited_group'
  meta_event: 'group_message' | 'private_message' | 'guild_message' | 'nearby' | 'stranger' | 'stranger_from_group'
  message_sent: 'group_message' | 'private_message' | 'guild_message' | 'nearby' | 'stranger' | 'stranger_from_group'
}

/**
 * - 事件子类型
 */
export type SubEvent = EventToSubEvent['message'] | EventToSubEvent['notice'] | EventToSubEvent['request']

/**
 * - 权限类型
 */
export type Permission = 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin'

/**
 * - 群角色
 */
export type Role = 'owner' | 'admin' | 'member' | 'unknown' | ''

/**
 * - 事件联系人信息
 */
export interface contact {
  /**
   * - 事件来源场景
   */
  scene: Scene
  /**
   * - 事件来源id 群号或者用户id
   */
  peer: string
  /**
   * - 事件来源子id 仅在频道和临时会话中存在
   */
  sub_peer?: string
}

/**
 * - 事件发送者信息
 */
export interface Sender {
  /**
   * - 发送者uid
   */
  uid: string
  /**
   * - 发送者uin
   */
  uin: string
  /**
   * - 发送者昵称
   */
  nick: string | ''
  /**
   * - 发送者在群的角色身份
   */
  role: Role
}

/**
 * - 通知事件类型
 */
export interface NoticeType {
  /**
   * - 私聊戳一戳
   */
  private_poke: {
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
  private_recall: {
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
  private_file_uploaded: {
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
  group_poke: {
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
   * - 群聊消息撤回
   * - 撤回自己消息时，operator和target为自己
   * - 撤回别人消息时，operator为操作者，target为被撤回者
   */
  group_recall: {
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
  group_file_uploaded: {
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
  group_card_changed: {
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
  group_member_unique_title_changed: {
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
  group_essence_changed: {
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
  group_member_increase: {
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
  group_member_decrease: {
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
  group_admin_changed: {
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
  group_sign_in: {
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
  group_member_ban: {
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
  group_whole_ban: {
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
  group_message_reaction: {
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
}

/**
 * - 请求事件类型
 */
export interface RequestType {
  /**
   * - 好友申请
   */
  private_apply: {
    /**
     * - 申请者uid
     */
    applier_uid: string
    /**
     * - 申请者uin
     */
    applier_uin: string
    /**
     * - 申请理由
     */
    message: string
  }
  /**
   * - 群申请
   */
  group_apply: {
    /**
     * - 群ID
     */
    group_id: string
    /**
     * - 申请者uid
     */
    applier_uid: string
    /**
     * - 申请者uin
     */
    applier_uin: string
    /**
     * - 邀请者uid
     */
    inviter_uid: string
    /**
     * - 邀请者uin
     */
    inviter_uin: string
    /**
     * - 申请理由
     */
    reason: string
  }
  /**
   * - 邀请入群
   */
  invited_group: {
    /**
     * - 群ID
     */
    group_id: string
    /**
     * - 邀请者uid
     */
    inviter_uid: string
    /**
     * - 邀请者uin
     */
    inviter_uin: string
  }
}

/**
 * - 事件基类
 */
export interface KarinEventType {
  /**
    * - 机器人ID 请尽量使用UID
    */
  self_id: string
  /**
   * - 用户ID
   */
  user_id: string
  /**
   * - 群ID 仅在群聊中存在
   * @default ''
   */
  group_id: string
  /**
   * - 事件类型
   */
  event: Event
  /**
   * - 事件子类型
   */
  sub_event: EventToSubEvent[Event]
  /**
   * - 事件ID
   */
  event_id: string
  /**
   * - 事件触发时间戳
   */
  time: number
  /**
   * - 事件联系人信息
   */
  contact: contact
  /**
   * - 事件发送者信息
   */
  sender: Sender
  /**
   * - 是否为主人
   * @default false
   */
  isMaster: boolean
  /**
   * - 是否为管理员
   * @default false
   */
  isAdmin: boolean
  /**
   * - 是否为私聊
   * @default false
   */
  isPrivate: boolean
  /**
   * - 是否为群聊
   * @default false
   */
  isGroup: boolean
  /**
   * - 是否为频道
   * @default false
   */
  isGuild: boolean
  /**
   * - 是否为群临时会话
   * @default false
   */
  isGroupTemp: boolean
  /**
   * - 日志函数字符串
   */
  logFnc: string
  /**
   * - 日志用户字符串
   */
  logText: string
  /**
   * - 存储器 由开发者自行调用
   */
  store: Map<string, any>
  /**
   * - 标准含义是代表原始事件文本，在karin是指经过karin处理后的事件文本
   */
  raw_message: string
  /**
   * - 回复函数
   */
  reply: Reply
  /**
   * - 回复函数 由适配器实现，开发者不应该直接调用
   */
  replyCallback: replyCallback
  /**
   * - bot实现
   */
  bot: KarinAdapter

}

/**
 * - 消息事件基类
 */
export interface KarinMessageEvent extends KarinEventType {
  /**
   * - 消息体
   */
  event: 'message' | 'message_sent'
  /**
     * - 消息ID
     */
  message_id: string
  /**
   * - 消息序列号
   */
  message_seq?: number
  /**
   * - 原始消息文本
   */
  raw_message: string
  /**
   * - 消息体元素
   */
  elements: Array<KarinElement>
  /**
   * - 框架处理后的文本
   */
  msg: string
  /**
   * - 图片数组
   */
  image: Array<string>
  /**
   * - AT数组
   */
  at: Array<string>
  /**
   * - 是否AT机器人
   */
  atBot: boolean
  /**
   * - 是否AT全体
   */
  atAll: boolean
  /**
   * - 文件元素
   */
  file: object
  /**
   * - 引用消息ID
   */
  reply_id: string
  /**
   * - 消息别名
   */
  alias: string
}

/**
 * - 基础通知事件接口，包含所有共同属性
 */
export interface KarinNoticeEventBase extends KarinEventType {
  event: 'notice'
}

/**
 * - 辅助类型，用于生成 KarinNoticeEvent 的联合类型
 */
export type NoticeEvent<T extends keyof NoticeType> = KarinNoticeEventBase & {
  sub_event: T
  content: NoticeType[T]
}

/**
 * - 通知事件基类
 */
export type KarinNoticeEvent = NoticeEvent<'private_poke'>
  | NoticeEvent<'private_recall'>
  | NoticeEvent<'private_file_uploaded'>
  | NoticeEvent<'group_poke'>
  | NoticeEvent<'group_card_changed'>
  | NoticeEvent<'group_member_unique_title_changed'>
  | NoticeEvent<'group_essence_changed'>
  | NoticeEvent<'group_recall'>
  | NoticeEvent<'group_member_increase'>
  | NoticeEvent<'group_member_decrease'>
  | NoticeEvent<'group_admin_changed'>
  | NoticeEvent<'group_member_ban'>
  | NoticeEvent<'group_sign_in'>
  | NoticeEvent<'group_whole_ban'>
  | NoticeEvent<'group_file_uploaded'>
  | NoticeEvent<'group_message_reaction'>

/**
 * - 请求事件基类
 */
export interface KarinRequestEventBase extends KarinEventType {
  event: 'request'
}

/**
 * - 辅助类型，用于生成 KarinRequestEvent 的联合类型
 */
export type RequestEvent<T extends keyof RequestType> = KarinRequestEventBase & {
  sub_event: T
  content: RequestType[T]
}

/**
 * - 请求事件基类
 */
export type KarinRequestEvent = RequestEvent<'private_apply'>
  | RequestEvent<'group_apply'>
  | RequestEvent<'invited_group'>

export interface EMap {
  message: KarinMessageEvent
  notice: KarinNoticeEvent
  request: KarinRequestEvent
  message_sent: KarinMessageEvent
  // 元事件不进入插件 不需要定义
  meta_event: any
}

export type EType = KarinMessageEvent | KarinNoticeEvent | KarinRequestEvent
/**
 * 根据accept函数是否存在来决定e的类型
 */
export type EventType<T> = T extends { accept: (e: KarinNoticeEvent | KarinRequestEvent) => Promise<void> } ? KarinNoticeEvent | KarinRequestEvent : KarinMessageEvent
