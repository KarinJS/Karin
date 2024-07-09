/* eslint-disable no-unused-vars */
import { OB11Api } from './api'
import { CustomNodeSegment, OB11Segment } from './segment'

export enum MessageType {
  Private = 'private',
  Group = 'group'
}

/**
 * - OneBot11公开Api参数 params
 */
export type OB11ApiParams = {
  /**
   * - 发送私聊消息
   */
  [OB11Api.send_private_msg]: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 要发送的内容
     */
    message: string
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 发送群消息
   */
  [OB11Api.send_group_msg]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要发送的内容
     */
    message: string
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 发送消息
   */
  [OB11Api.send_msg]: {
    /**
     * - 消息类型
     */
    message_type: MessageType
    /**
     * - 对方 QQ 号，当消息类型为 "private" 时有效
     */
    user_id?: number
    /**
     * - 群号，当消息类型为 "group" 时有效
     */
    group_id?: number
    /**
     * - 要发送的内容
     */
    message: Array<OB11Segment>
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 撤回消息
   */
  [OB11Api.delete_msg]: {
    /**
     * - 消息 ID
     */
    message_id: number
  }
  /**
   * - 获取消息
   */
  [OB11Api.get_msg]: {
    /**
     * - 消息 ID
     */
    message_id: number
  }
  /**
   * - 获取转发消息
   */
  [OB11Api.get_forward_msg]: {
    /**
     * - 转发消息 ID
     */
    id: string
  }
  /**
   * - 发送好友赞
   */
  [OB11Api.send_like]: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 赞的次数，每个赞为一个好友赞，每个用户每天最多赞 10 次
     */
    times?: number
  }
  /**
   * - 群组踢人
   */
  [OB11Api.set_group_kick]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要踢的 QQ 号
     */
    user_id: number
    /**
     * - 拒绝此人的加群请求
     */
    reject_add_request?: boolean
  }
  /**
   * - 群组禁言
   */
  [OB11Api.set_group_ban]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要禁言的 QQ 号
     */
    user_id: number
    /**
     * - 禁言时长，单位秒，0 表示取消禁言
     */
    duration?: number
  }
  /**
   * - 群组匿名用户禁言
   */
  [OB11Api.set_group_anonymous_ban]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 匿名用户对象
     */
    anonymous?: object
    /**
     * - 匿名用户标识，使用匿名用户对象时此参数无效
     */
    anonymous_flag?: string
    /**
     * - 禁言时长，单位秒，无法取消匿名用户禁言
     */
    duration?: number
  }
  /**
   * - 群组全员禁言
   */
  [OB11Api.set_group_whole_ban]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否禁言，true 为开启，false 为关闭
     */
    enable?: boolean
  }
  /**
   * - 设置群管理员
   */
  [OB11Api.set_group_admin]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置管理员的 QQ 号
     */
    user_id: number
    /**
     * - 是否设置为管理员，true 为设置，false 为取消
     */
    enable?: boolean
  }
  /**
   * - 设置群匿名聊天
   */
  [OB11Api.set_group_anonymous]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否允许匿名聊天，true 为开启，false 为关闭
     */
    enable?: boolean
  }
  /**
   * - 设置群名片（群备注）
   */
  [OB11Api.set_group_card]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置的 QQ 号
     */
    user_id: number
    /**
     * - 名片内容，不填或空字符串表示删除群名片
     */
    card?: string
  }
  /**
   * - 设置群名
   */
  [OB11Api.set_group_name]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 新群名
     */
    group_name: string
  }
  /**
   * - 退出群组
   */
  [OB11Api.set_group_leave]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
     */
    is_dismiss?: boolean
  }
  /**
   * - 设置群成员专属头衔
   */
  [OB11Api.set_group_special_title]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置的 QQ 号
     */
    user_id: number
    /**
     * - 专属头衔，不填或空字符串表示删除专属头衔
     */
    special_title?: string
    /**
     * - 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果
     */
    duration?: number
  }
  /**
   * - 处理好友添加请求
   */
  [OB11Api.set_friend_add_request]: {
    /**
     * - 请求 flag，在调用处理请求的事件中返回
     */
    flag: string
    /**
     * - 是否同意请求
     */
    approve?: boolean
    /**
     * - 添加后的好友备注
     */
    remark?: string
  }
  /**
   * - 处理群添加请求／邀请
   */
  [OB11Api.set_group_add_request]: {
    /**
     * - 请求 flag，在调用处理请求的事件中返回
     */
    flag: string
    /**
     * - 请求子类型，add 或 invite，请求子类型为 invite 时为邀请
     */
    sub_type: 'add' | 'invite'
    /**
     * - 是否同意请求／邀请
     */
    approve?: boolean
    /**
     * - 拒绝理由，仅在拒绝时有效
     */
    reason?: string
  }
  /**
   * - 获取登录号信息
   */
  [OB11Api.get_login_info]: {}
  /**
   * - 获取陌生人信息
   */
  [OB11Api.get_stranger_info]: {
    /**
     * - QQ 号
     */
    user_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取好友列表
   */
  [OB11Api.get_friend_list]: {}
  /**
   * - 获取群信息
   */
  [OB11Api.get_group_info]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取群列表
   */
  [OB11Api.get_group_list]: {}
  /**
   * - 获取群成员信息
   */
  [OB11Api.get_group_member_info]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - QQ 号
     */
    user_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取群成员列表
   */
  [OB11Api.get_group_member_list]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取群荣誉信息
   */
  [OB11Api.get_group_honor_info]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 荣誉类型，可选值为 "talkative"（龙王）、"performer"（群聊之火）、"legend"（群聊炽焰）、"strong_newbie"（新人王）、"emotion"（快乐源泉）、"all"（所有类型）
     */
    type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'
  }
  /**
   * - 获取 Cookies
   */
  [OB11Api.get_cookies]: {
    /**
     * - 指定域名，不填或空字符串表示获取当前域名下的 Cookies
     */
    domain?: string
  }
  /**
   * - 获取 CSRF Token
   */
  [OB11Api.get_csrf_token]: {}
  /**
   * - 获取 QQ 相关接口凭证
   */
  [OB11Api.get_credentials]: {
    /**
     * - 指定域名，不填或空字符串表示获取当前域名下的凭证
     */
    domain?: string
  }
  /**
   * - 获取语音
   */
  [OB11Api.get_record]: {
    /**
     * - 文件路径
     */
    file: string
    /**
     * - 输出格式，可选值为 "amr"、"silk"、"mp3"、"wav"，默认为 "amr"
     */
    out_format: string
  }
  /**
   * - 获取图片
   */
  [OB11Api.get_image]: {
    /**
     * - 文件路径
     */
    file: string
  }
  /**
   * - 是否可以发送图片
   */
  [OB11Api.can_send_image]: {}
  /**
   * - 是否可以发送语音
   */
  [OB11Api.can_send_record]: {}
  /**
   * - 获取插件运行状态
   */
  [OB11Api.get_status]: {}
  /**
   * - 获取版本信息
   */
  [OB11Api.get_version_info]: {}
  /**
   * - 获取版本信息
   */
  [OB11Api.get_version]: {}
  /**
   * - 重启插件
   */
  [OB11Api.set_restart]: {
    /**
     * - 延迟重启时间，单位毫秒，不填或留空表示立即重启
     */
    delay?: number
  }
  /**
   * - 清理数据缓存
   */
  [OB11Api.clean_cache]: {}

  /**
   * - 发送合并转发消息
   */
  [OB11Api.send_forward_msg]: {
    /**
     * - 对方 QQ 号，当消息类型为 "private" 时有效
     */
    user_id?: number
    /**
     * - 群号，当消息类型为 "group" 时有效
     */
    group_id?: number
    /**
     * - 要发送的内容
     */
    messages: Array<CustomNodeSegment>
  }

  /**
   * - 获取好友历史消息记录
   */
  [OB11Api.get_friend_msg_history]: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 起始消息序号
     */
    message_seq?: number
    /**
     * - 起始消息ID
     */
    message_id?: number
    /**
     * - 消息数量
     */
    message_count: number
  }

  /**
   * - 获取群组历史消息记录
   */
  [OB11Api.get_group_msg_history]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 起始消息序号
     */
    message_seq?: number
    /**
     * - 起始消息ID
     */
    message_id?: number
    /**
     * - 消息数量
     */
    message_count: number
  }
  /**
   * - 对消息进行表情回应
   */
  [OB11Api.set_msg_emoji_like]: {
    /**
     * - 需要回应的消息 ID
     */
    message_id: string
    /**
     * - 回应的表情 ID
     */
    emoji_id: number
    /**
     * - 设置、取消
     */
    is_set: boolean
  },
  /**
   * 上传群文件
   */
  [OB11Api.upload_group_file]: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 文件路径 需要提供绝对路径
     */
    file: string
    /**
     * - 文件名称 必须提供
     */
    name: string
    /**
     * - 父目录ID 不提供则上传到根目录
     */
    folder?: string
  }
  /**
   * 上传私聊文件
   */
  [OB11Api.upload_private_file]: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 文件路径 需要提供绝对路径
     */
    file: string
    /**
     * - 文件名称 必须提供
     */
    name: string
  },
  /**
   * 获取精华消息列表
   */
  [OB11Api.get_essence_msg_list]: {
    /**
     * - 群号
     */
    group_id: number
  }
  /**
   * 设置精华消息
   */
  [OB11Api.set_essence_msg]: {
    /**
     * - 消息ID
     */
    message_id: number
  }
  /**
   * 移除精华消息
   */
  [OB11Api.delete_essence_msg]: {
    /**
     * - 消息ID
     */
    message_id: number
  }
}
