import { contact, Sender, KarinElement } from './index'

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
  message_seq: number
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
