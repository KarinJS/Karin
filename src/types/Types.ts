import { KarinMessage } from '../event/KarinMessage'
import { KarinNotice } from '../event/KarinNotice'
import { KarinRequest } from '../event/KarinRequest'
import { KarinElement } from './Element'
import { Plugin, PluginRule } from './Plugin'

/**
 * - 事件类型
 */
export type Event = 'message' | 'notice' | 'request' | 'meta_event'

/**
 * - 事件来源
 */
export type Scene = 'group' | 'private' | 'guild' | 'nearby' | 'stranger' | 'stranger_from_group'

/**
 * - 事件子类型
 */
export type Sub_event = 'group_message' | 'friend_message' | 'guild_message' | 'nearby' | 'stranger' | 'stranger_from_group' | 'friend_poke' | 'friend_recall' | 'friend_file_uploaded' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_ban' | 'group_sign' | 'group_whole_ban' | 'group_file_uploaded' | 'friend_apply' | 'group_apply' | 'invited_group'

/**
 * - 类型映射
 */
export type EventToSubEvent = {
  message: 'group_message' | 'friend_message' | 'guild_message' | 'nearby' | 'stranger' | 'stranger_from_group'
  notice: 'friend_poke' | 'friend_recall' | 'friend_file_uploaded' | 'group_poke' | 'group_card_changed' | 'group_member_unique_title_changed' | 'group_essence_changed' | 'group_recall' | 'group_member_increase' | 'group_member_decrease' | 'group_admin_changed' | 'group_member_ban' | 'group_sign' | 'group_whole_ban' | 'group_file_uploaded'
  request: 'friend_apply' | 'group_apply' | 'invited_group'
  meta_event: 'group_message' | 'friend_message' | 'guild_message'
}

/**
 * - 事件子类型泛型
 */
export type SubEventForEvent<E extends Event> = E extends keyof EventToSubEvent ? EventToSubEvent[E] : never

/**
 * - 权限类型
 */
export type Permission = 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin'

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
  role: 'owner' | 'admin' | 'member' | 'unknown' | ''
}

/**
 * - 通知事件类型
 */
export interface NoticeTytpe {
  /**
   * - 私聊戳一戳
   */
  friend_poke: {
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
  friend_recall: {
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
  friend_file_uploaded: {
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
    file_sub_id: string
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
    url: string
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
     * - 文件子ID 此项没有则为空字符串
     */
    file_sub_id: string
    /**
     * - 文件名 此项没有则为空字符串
     */
    file_name: string
    /**
     * - 文件大小 此项没有则为0
     */
    file_size: number
    /**
     * - 目前未知
     */
    bus_id: number
    /**
     * - 过期时间 此项没有则为0
     */
    expire_time: number
    /**
     * - 文件URL
     */
    url: string
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
    type: 'invite' | 'apply'
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
  group_sign: {
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
     * - 表情ID
     */
    face_id: number
    /**
     * - 添加、取消回应
     */
    is_set: boolean
  }
}
/**
 * - 通知事件泛型
 */
export type NoticeEvent<E extends keyof NoticeTytpe> = E extends keyof NoticeTytpe ? NoticeTytpe[E] : never

/**
 * - 请求事件类型
 */
export interface RequestType {
  /**
   * - 好友申请
   */
  friend_apply: {
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
 * - 请求事件泛型
 */
export type RequestEvent<E extends keyof RequestType> = E extends keyof RequestType ? RequestType[E] : never

/**
 * - 转发、历史消息返回的结构
 */
export interface PushMessageBody {
  /**
   * - 消息发送时间
   */
  time: number
  /**
   * - 消息ID
   */
  message_id: string
  /**
   * - 消息序列号
   */
  message_seq: number
  /**
   * - 消息来源
   */
  contact: contact
  /**
   * - 消息发送者
   */
  sender: Sender
  /**
   * - 消息元素
   */
  elements: Array<KarinElement>
}

/**
 * - 精华消息返回的结构
 */
export interface EssenceMessageBody {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 发送者uid
   */
  sender_uid: string
  /**
   * - 发送者uin
   */
  sender_uin: string
  /**
   * - 发送者昵称
   */
  sender_nick: string
  /**
   * - 操作者uid
   */
  operator_uid: string
  /**
   * - 操作者uin
   */
  operator_uin: string
  /**
   * - 操作者昵称
   */
  operator_nick: string
  /**
   * - 操作时间
   */
  operation_time: number
  /**
   * - 消息时间
   */
  message_time: number
  /**
   * - 消息ID
   */
  message_id: string
  /**
   * - 消息序列号
   */
  message_seq: string
  /**
   * - 被设置的精华消息元素文本
   */
  json_elements: string
}

/**
 * - QQ好友信息
 */
export interface FriendInfo {
  /**
   * - 用户UID
   */
  uid: string
  /**
   * - 用户UIN
   */
  uin: string
  /**
   * - qid
   */
  qid: string
  /**
   * - 名称
   */
  nick: string
  /**
   * - 备注
   */
  remark?: string
  /**
   * - 用户等级
   */
  level?: number
  /**
   * - 生日
   */
  birthday?: string
  /**
   * - 登录天数
   */
  login_day?: number
  /**
   * - 点赞数
   */
  vote_cnt?: number
  /**
   * - 学校是否已核实
   */
  is_school_verified?: boolean
  /**
   * - 年龄
   * - 拓展字段
   */
  age?: number
  /**
   * - 性别
   * - 拓展字段
   */
  sex?: 'male' | 'female' | 'unknown'
  ext?: {
    /**
     * 大会员
     */
    big_vip?: boolean
    /**
     * 好莱坞/腾讯视频会员
     */
    hollywood_vip?: boolean
    /**
     * QQ会员
     */
    qq_vip?: boolean
    /**
     * QQ超级会员
     */
    super_vip?: boolean
    /**
     * 是否已经赞过
     */
    voted?: boolean
  }
}

/**
 * - QQ群信息
 */
export interface GroupInfo {
  /**
   * - 群ID
   */
  group_id: string
  /**
   * - 群名称
   */
  group_name: string
  /**
   * - 群备注
   */
  group_remark?: string
  /**
   * - 群主UID
   */
  owner: string
  /**
   * - 群管理员UID列表
   */
  admins: Array<string>
  /**
   * - 最大成员数
   */
  max_member_count: number
  /**
   * - 当前成员数
   */
  member_count: number
  /**
   * - 群UIN
   */
  group_uin?: string
}

/**
 * - 群成员信息
 */
export interface GroupMemberInfo {
  /**
   * - 用户UID
   */
  uid: string
  /**
   * - 用户UIN
   */
  uin: string
  /**
   * - 用户昵称
   */
  nick: string
  /**
   * - 年龄
   */
  age: number
  /**
   * - 群内头衔
   */
  unique_title: string
  /**
   * - 群内头衔过期时间
   */
  unique_title_expire_time: number
  /**
   * - 群名片
   */
  card?: string
  /**
   * - 加群时间
   */
  join_time?: number
  /**
   * - 最后活跃时间
   */
  last_active_time?: number
  /**
   * - 用户等级
   */
  level: number
  /**
   * - 禁言时间
   */
  shut_up_time: number
  /**
   * - 距离
   */
  distance?: number
  /**
   * - 荣誉列表
   */
  honors?: Array<number>
  /**
   * - 是否好友
   */
  unfriendly?: boolean
  /**
   * - 是否可修改群名片
   */
  card_changeable?: boolean
}

/**
 * 群荣誉信息
 */
export interface GroupHonorInfo {
  /**
   * - 荣誉成员uid
   */
  uid: string
  /**
   * - 荣誉成员uin
   */
  uin: string
  /**
   * - 荣誉成员昵称
   */
  nick: string
  /**
   * - 荣誉名称
   */
  honor_name: string
  /**
   * - 荣誉图标url
   */
  avatar: string
  /**
   * - 荣誉id
   */
  id: number
  /**
   * - 荣誉描述
   */
  description: string
}

/**
 * - e
 */
export type E = KarinMessage | KarinNotice | KarinRequest

/**
 * - Apps
 */
export interface Apps {
  /**
   * - 插件Class
   */
  App: Plugin
  /**
   * - 插件路径信息
   */
  file: {
    /**
     * - 插件根目录名称 例如: karin-plugin-example
     */
    dir: string
    /**
     * - 插件名称 例如: index.js
     */
    name: string
  }
  /**
   * - 插件名称
   */
  name: string
  /**
   * - 插件事件
   */
  event: Event | `${Event}.${Sub_event}`
  priority: number
  permission: Permission
  accept: boolean
  rule: Array<PluginRule>
}
