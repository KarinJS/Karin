import type { OB11NodeSegment, OB11Segment } from './segment'

export const enum OB11ApiAction {
  /** 发送私聊消息 */
  sendPrivateMsg = 'send_private_msg',
  /** 发送群消息 */
  sendGroupMsg = 'send_group_msg',
  /** 发送消息 */
  sendMsg = 'send_msg',
  /** 撤回消息 */
  deleteMsg = 'delete_msg',
  /** 获取消息 */
  getMsg = 'get_msg',
  /** 获取转发消息 */
  getForwardMsg = 'get_forward_msg',
  /** 发送好友赞 */
  sendLike = 'send_like',
  /** 群组踢人 */
  setGroupKick = 'set_group_kick',
  /** 群组禁言 */
  setGroupBan = 'set_group_ban',
  /** 群组匿名用户禁言 */
  setGroupAnonymousBan = 'set_group_anonymous_ban',
  /** 群组全员禁言 */
  setGroupWholeBan = 'set_group_whole_ban',
  /** 设置群管理员 */
  setGroupAdmin = 'set_group_admin',
  /** 设置群匿名聊天 */
  setGroupAnonymous = 'set_group_anonymous',
  /** 设置群名片（群备注） */
  setGroupCard = 'set_group_card',
  /** 设置群名 */
  setGroupName = 'set_group_name',
  /** 退出群组 */
  setGroupLeave = 'set_group_leave',
  /** 设置群成员专属头衔 */
  setGroupSpecialTitle = 'set_group_special_title',
  /** 处理好友添加请求 */
  setFriendAddRequest = 'set_friend_add_request',
  /** 处理群添加请求／邀请 */
  setGroupAddRequest = 'set_group_add_request',
  /** 获取登录号信息 */
  getLoginInfo = 'get_login_info',
  /** 获取陌生人信息 */
  getStrangerInfo = 'get_stranger_info',
  /** 获取好友列表 */
  getFriendList = 'get_friend_list',
  /** 获取群信息 */
  getGroupInfo = 'get_group_info',
  /** 获取群列表 */
  getGroupList = 'get_group_list',
  /** 获取群成员信息 */
  getGroupMemberInfo = 'get_group_member_info',
  /** 获取群成员列表 */
  getGroupMemberList = 'get_group_member_list',
  /** 获取群荣誉信息 */
  getGroupHonorInfo = 'get_group_honor_info',
  /** 获取 Cookies */
  getCookies = 'get_cookies',
  /** 获取 CSRF Token */
  getCsrfToken = 'get_csrf_token',
  /** 获取 QQ 相关接口凭证 */
  getCredentials = 'get_credentials',
  /** 获取语音 */
  getRecord = 'get_record',
  /** 获取图片 */
  getImage = 'get_image',
  /** 是否可以发送图片 */
  canSendImage = 'can_send_image',
  /** 是否可以发送语音 */
  canSendRecord = 'can_send_record',
  /** 获取插件运行状态 */
  getStatus = 'get_status',
  /** 获取版本信息 */
  getVersionInfo = 'get_version_info',
  /** 获取版本信息 */
  getVersion = 'get_version',
  /** 重启插件 */
  setRestart = 'set_restart',
  /** 清理数据缓存 */
  cleanCache = 'clean_cache',
  /** 发送合并转发消息 */
  sendForwardMsg = 'send_forward_msg',
  /** 发送群聊合并转发消息 */
  sendGroupForwardMsg = 'send_group_forward_msg',
  /** 发送好友合并转发消息 */
  sendPrivateForwardMsg = 'send_private_forward_msg',
  /** 获取好友历史消息记录 */
  getFriendMsgHistory = 'get_friend_msg_history',
  /** 获取群组历史消息记录 */
  getGroupMsgHistory = 'get_group_msg_history',
  /** 对消息进行表情回应 */
  setMsgEmojiLike = 'set_msg_emoji_like',
  /** 上传群文件 */
  uploadGroupFile = 'upload_group_file',
  /** 上传私聊文件 */
  uploadPrivateFile = 'upload_private_file',
  /** 获取精华消息列表 */
  getEssenceMsgList = 'get_essence_msg_list',
  /** 设置精华消息 */
  setEssenceMsg = 'set_essence_msg',
  /** 删除精华消息 */
  deleteEssenceMsg = 'delete_essence_msg',
  /** 获取群文件url */
  getGroupFileUrl = 'get_group_file_url',
  /** 获取私聊文件url */
  getPrivateFileUrl = 'get_private_file_url',
}

/** Api请求参数 */
export interface OB11ApiParams {
  /** 发送私聊消息 */
  [OB11ApiAction.sendPrivateMsg]: {
    /** 对方 QQ 号 */
    user_id: number
    /** 主动发起临时会话时的来源群号(可选, 机器人本身必须是管理员/群主) */
    group_id?: number
    /** 要发送的内容 */
    message: Array<OB11Segment>
    /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
    auto_escape?: boolean
  }
  /** 发送群消息 */
  [OB11ApiAction.sendGroupMsg]: {
    /** 群号 */
    group_id: number
    /** 要发送的内容 */
    message: Array<OB11Segment>
    /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
    auto_escape?: boolean
  }
  /** 发送消息 */
  [OB11ApiAction.sendMsg]: {
    /** 消息类型 */
    message_type: 'private' | 'group'
    /** 对方 QQ 号，当消息类型为 "private" 时有效 */
    user_id?: number
    /** 群号，当消息类型为 "group" 时有效 */
    group_id?: number
    /** 要发送的内容 */
    message: Array<OB11Segment>
    /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
    auto_escape?: boolean
  }
  /** 撤回消息 */
  [OB11ApiAction.deleteMsg]: {
    /** 消息 ID */
    message_id: number
  }
  /** 获取消息 */
  [OB11ApiAction.getMsg]: {
    /** 消息 ID */
    message_id: number
  }
  /** 获取转发消息 */
  [OB11ApiAction.getForwardMsg]: {
    /** 转发消息 ID */
    id: string
  }
  /** 发送好友赞 */
  [OB11ApiAction.sendLike]: {
    /** 对方 QQ 号 */
    user_id: number
    /** 赞的次数，每个赞为一个好友赞，每个用户每天最多赞 10 次 */
    times?: number
  }
  /** 群组踢人 */
  [OB11ApiAction.setGroupKick]: {
    /** 群号 */
    group_id: number
    /** 要踢的 QQ 号 */
    user_id: number
    /** 拒绝此人的加群请求 */
    reject_add_request?: boolean
  }
  /** 群组禁言 */
  [OB11ApiAction.setGroupBan]: {
    /** 群号 */
    group_id: number
    /** 要禁言的 QQ 号 */
    user_id: number
    /** 禁言时长，单位秒，0 表示取消禁言 */
    duration?: number
  }
  /** 群组匿名用户禁言 */
  [OB11ApiAction.setGroupAnonymousBan]: {
    /** 群号 */
    group_id: number
    /** 匿名用户对象 */
    anonymous?: object
    /** 匿名用户标识，使用匿名用户对象时此参数无效 */
    anonymous_flag?: string
    /** 禁言时长，单位秒，无法取消匿名用户禁言 */
    duration?: number
  }
  /** 群组全员禁言 */
  [OB11ApiAction.setGroupWholeBan]: {
    /** 群号 */
    group_id: number
    /** 是否禁言，true 为开启，false 为关闭 */
    enable?: boolean
  }
  /** 设置群管理员 */
  [OB11ApiAction.setGroupAdmin]: {
    /** 群号 */
    group_id: number
    /** 要设置管理员的 QQ 号 */
    user_id: number
    /** 是否设置为管理员，true 为设置，false 为取消 */
    enable?: boolean
  }
  /** 设置群匿名聊天 */
  [OB11ApiAction.setGroupAnonymous]: {
    /** 群号 */
    group_id: number
    /** 是否允许匿名聊天，true 为开启，false 为关闭 */
    enable?: boolean
  }
  /** 设置群名片（群备注） */
  [OB11ApiAction.setGroupCard]: {
    /** 群号 */
    group_id: number
    /** 要设置的 QQ 号 */
    user_id: number
    /** 名片内容，不填或空字符串表示删除群名片 */
    card?: string
  }
  /** 设置群名 */
  [OB11ApiAction.setGroupName]: {
    /** 群号 */
    group_id: number
    /** 新群名 */
    group_name: string
  }
  /** 退出群组 */
  [OB11ApiAction.setGroupLeave]: {
    /** 群号 */
    group_id: number
    /** 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散 */
    is_dismiss?: boolean
  }
  /** 设置群成员专属头衔 */
  [OB11ApiAction.setGroupSpecialTitle]: {
    /** 群号 */
    group_id: number
    /** 要设置的 QQ 号 */
    user_id: number
    /** 专属头衔，不填或空字符串表示删除专属头衔 */
    special_title?: string
    /** 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果 */
    duration?: number
  }
  /** 处理好友添加请求 */
  [OB11ApiAction.setFriendAddRequest]: {
    /** 请求 flag，在调用处理请求的事件中返回 */
    flag: string
    /** 是否同意请求 */
    approve?: boolean
    /** 添加后的好友备注 */
    remark?: string
  }
  /** 处理群添加请求／邀请 */
  [OB11ApiAction.setGroupAddRequest]: {
    /** 请求 flag，在调用处理请求的事件中返回 */
    flag: string
    /** 请求子类型，add 或 invite，请求子类型为 invite 时为邀请 */
    sub_type: 'add' | 'invite'
    /** 是否同意请求／邀请 */
    approve?: boolean
    /** 拒绝理由，仅在拒绝时有效 */
    reason?: string
  }
  /** 获取登录号信息 */
  [OB11ApiAction.getLoginInfo]: {}
  /** 获取陌生人信息 */
  [OB11ApiAction.getStrangerInfo]: {
    /** QQ 号 */
    user_id: number
    /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
    no_cache?: boolean
  }
  /** 获取好友列表 */
  [OB11ApiAction.getFriendList]: {}
  /** 获取群信息 */
  [OB11ApiAction.getGroupInfo]: {
    /** 群号 */
    group_id: number
    /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
    no_cache?: boolean
  }
  /** 获取群列表 */
  [OB11ApiAction.getGroupList]: {}
  /** 获取群成员信息 */
  [OB11ApiAction.getGroupMemberInfo]: {
    /** 群号 */
    group_id: number
    /** QQ 号 */
    user_id: number
    /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
    no_cache?: boolean
  }
  /** 获取群成员列表 */
  [OB11ApiAction.getGroupMemberList]: {
    /** 群号 */
    group_id: number
    /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
    no_cache?: boolean
  }
  /** 获取群荣誉信息 */
  [OB11ApiAction.getGroupHonorInfo]: {
    /** 群号 */
    group_id: number
    /** 荣誉类型，可选值为 "talkative"（龙王）、"performer"（群聊之火）、"legend"（群聊炽焰）、"strong_newbie"（新人王）、"emotion"（快乐源泉）、"all"（所有类型） */
    type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'
  }
  /** 获取 Cookies */
  [OB11ApiAction.getCookies]: {
    /** 指定域名，不填或空字符串表示获取当前域名下的 Cookies */
    domain?: string
  }
  /** 获取 CSRF Token */
  [OB11ApiAction.getCsrfToken]: {}
  /** 获取 QQ 相关接口凭证 */
  [OB11ApiAction.getCredentials]: {
    /** 指定域名，不填或空字符串表示获取当前域名下的凭证 */
    domain?: string
  }
  /** 获取语音 */
  [OB11ApiAction.getRecord]: {
    /** 文件路径 */
    file: string
    /** 输出格式，可选值为 "amr"、"silk"、"mp3"、"wav"，默认为 "amr" */
    out_format: string
  }
  /** 获取图片 */
  [OB11ApiAction.getImage]: {
    /** 文件路径 */
    file: string
  }
  /** 是否可以发送图片 */
  [OB11ApiAction.canSendImage]: {}
  /** 是否可以发送语音 */
  [OB11ApiAction.canSendRecord]: {}
  /** 获取插件运行状态 */
  [OB11ApiAction.getStatus]: {}
  /** 获取版本信息 */
  [OB11ApiAction.getVersionInfo]: {}
  /** 获取版本信息 */
  [OB11ApiAction.getVersion]: {}
  /** 重启插件 */
  [OB11ApiAction.setRestart]: {
    /** 延迟重启时间，单位毫秒，不填或留空表示立即重启 */
    delay?: number
  }
  /** 清理数据缓存 */
  [OB11ApiAction.cleanCache]: {}

  /** 发送合并转发消息 */
  [OB11ApiAction.sendForwardMsg]: {
    /** 对方 QQ 号，当消息类型为 "private" 时有效 */
    user_id?: number
    /** 群号，当消息类型为 "group" 时有效 */
    group_id?: number
    /** 要发送的内容 */
    messages: Array<OB11NodeSegment>
  }

  /** 发送群聊合并转发消息 */
  [OB11ApiAction.sendGroupForwardMsg]: {
    /** 群号 */
    group_id: number
    /** 要发送的内容 */
    messages: Array<OB11NodeSegment>
  }

  /** 发送好友合并转发消息 */
  [OB11ApiAction.sendPrivateForwardMsg]: {
    /** 对方 QQ 号 */
    user_id: number
    /** 要发送的内容 */
    messages: Array<OB11NodeSegment>
  }

  /** 获取好友历史消息记录 */
  [OB11ApiAction.getFriendMsgHistory]: {
    /** 对方 QQ 号 */
    user_id: number
    /** 起始消息序号 */
    message_seq?: number
    /** 起始消息ID lgl */
    message_id?: number
    /** 消息数量 */
    count: number
  }

  /** 获取群组历史消息记录 */
  [OB11ApiAction.getGroupMsgHistory]: {
    /** 群号 */
    group_id: number
    /** 起始消息序号 */
    message_seq?: number
    /** 起始消息ID lgl */
    message_id?: number
    /** 消息数量 */
    count: number
  }
  /** 对消息进行表情回应 */
  [OB11ApiAction.setMsgEmojiLike]: {
    /** 需要回应的消息 ID */
    message_id: string
    /** 回应的表情 ID */
    emoji_id: number
    /** 设置、取消 */
    is_set: boolean
  },
  /**
   * 上传群文件
   */
  [OB11ApiAction.uploadGroupFile]: {
    /** 群号 */
    group_id: number
    /** 文件路径 需要提供绝对路径 */
    file: string
    /** 文件名称 必须提供 */
    name: string
    /** 父目录ID 不提供则上传到根目录 */
    folder?: string
  }
  /**
   * 上传私聊文件
   */
  [OB11ApiAction.uploadPrivateFile]: {
    /** 对方 QQ 号 */
    user_id: number
    /** 文件路径 需要提供绝对路径 */
    file: string
    /** 文件名称 必须提供 */
    name: string
  },
  /**
   * 获取精华消息列表
   */
  [OB11ApiAction.getEssenceMsgList]: {
    /** 群号 */
    group_id: number
  }
  /**
   * 设置精华消息
   */
  [OB11ApiAction.setEssenceMsg]: {
    /** 消息ID */
    message_id: number
  }
  /**
   * 移除精华消息
   */
  [OB11ApiAction.deleteEssenceMsg]: {
    /** 消息ID */
    message_id: number
  }
  /**
   * 获取群文件url
   */
  [OB11ApiAction.getGroupFileUrl]: {
    /** 群号 */
    group_id: number
    /** 文件ID */
    file_id: string
  },
  /**
   * 获取私聊文件url
   */
  [OB11ApiAction.getPrivateFileUrl]: {
    /** 对方 QQ 号 napcat不需要这个 随便传一个就行 */
    user_id: number
    /** 文件ID */
    file_id: string
  }
}

export interface GetGroupInfo {
  /** 群号 */
  group_id: number
  /** 群名称 */
  group_name: string
  /** 成员数 */
  member_count: number
  /** 最大成员数（群容量） */
  max_member_count: number
}

export interface HonorInfoList {
  /** QQ 号 */
  user_id: number
  /** QQ 昵称 */
  nickname: string
  /** 头像url */
  avatar: string
  /** 荣誉描述 */
  description: string
}

export interface GetGroupMemberInfo {
  /** 群号 */
  group_id: number
  /** QQ 号 */
  user_id: number
  /** 昵称 */
  nickname: string
  /** 群名片／备注 */
  card: string
  /** 性别 */
  sex: 'male' | 'female' | 'unknown'
  /** 年龄 */
  age: number
  /** 地区 */
  area: string
  /** 加群时间戳 */
  join_time: number
  /** 最后发言时间戳 */
  last_sent_time: number
  /** 成员等级 */
  level: string
  /** 角色 */
  role: 'owner' | 'admin' | 'member' | 'unknown'
  /** 是否不良记录成员 */
  unfriendly: boolean
  /** 专属头衔 */
  title: string
  /** 专属头衔过期时间戳 */
  title_expire_time: number
  /** 是否允许修改群名片 */
  card_changeable: boolean
}

export interface GetMsg {
  /** 发送时间 */
  time: number
  /** 消息类型 */
  message_type: 'private' | 'group'
  message_id: number
  message_seq: number
  real_id: number
  sender: {
    /** 发送者 QQ 号 */
    user_id: number
    /** 昵称 不存在则为空字符串 */
    nickname: string
    /** 性别 */
    sex?: 'male' | 'female' | 'unknown'
    /** 年龄 */
    age?: number
    /** 群名片/备注 */
    card?: string
    /** 地区 */
    area?: string
    /** 成员等级 */
    level?: string
    /** 角色 不存在则为空字符串 */
    role: 'owner' | 'admin' | 'member' | 'unknown'
    /** 专属头衔 */
    title?: string
  }
  message: OB11Segment[]
}

export interface OB11serInfo {
  /** QQ 号 */
  uid?: string
  /** QQ 号 */
  user_id: number
  /** QQ 昵称 */
  nick?: string
  /** QQ 昵称 */
  nickname: string
  /** 备注名 */
  remark?: string
  /** 星座 */
  constellation?: number
  /** 生肖 */
  shengXiao?: number
  /** 血型 */
  kBloodType?: number
  /** 家乡地址 */
  homeTown?: string
  /** 交友行业 */
  makeFriendCareer?: number
  /** 职位 */
  pos?: string
  /** 大学 */
  college?: string
  /** 国家 */
  country?: string
  /** 省份 */
  province?: string
  /** 城市 */
  city?: string
  /** 邮政编码 */
  postCode?: string
  /** 详细地址 */
  address?: string
  /** 注册时间戳 */
  regTime?: number
  /** 注册时间戳 */
  reg_time?: number
  /** 兴趣爱好 */
  interest?: string
  /** 标签 */
  labels?: string[]
  /** QQ 等级 */
  qqLevel?: number
  /** qid */
  qid?: string
  /** 个性签名 */
  longNick?: string
  /** 个性签名 */
  long_nick?: string
  /** 生日年份 */
  birthday_year?: number
  /** 生日月份 */
  birthday_month?: number
  /** 生日日期 */
  birthday_day?: number
  /** 年龄 */
  age?: number
  /** 性别 */
  sex?: 'male' | 'female' | 'unknown'
  /** 邮箱地址 */
  eMail?: string
  /** 手机号码 */
  phoneNum?: string
  /** 用户分类 ID */
  categoryId?: number
  /** 财富时间戳 */
  richTime?: number
  /** 财富缓存 */
  richBuffer?: Record<number, number>
  /** 用户状态 */
  status?: number
  /** 扩展状态 */
  extStatus?: number
  /** 电池状态 */
  batteryStatus?: number
  /** 终端类型 */
  termType?: number
  /** 网络类型 */
  netType?: number
  /** 头像类型 */
  iconType?: number
  /** 自定义状态 */
  customStatus?: string | null
  /** 设置时间 */
  setTime?: string
  /** 特殊标记 */
  specialFlag?: number
  /** ABI 标志 */
  abiFlag?: number
  /** 网络类型扩展 */
  eNetworkType?: number
  /** 显示名称 */
  showName?: string
  /** 终端描述 */
  termDesc?: string
  /** 音乐信息 */
  musicInfo?: {
    /** 音乐缓存 */
    buf?: Record<string, unknown>
  }
  /** 扩展在线业务信息 */
  extOnlineBusinessInfo?: {
    /** 缓存 */
    buf?: Record<string, unknown>
    /** 自定义状态 */
    customStatus?: string | null
    /** 视频业务信息 */
    videoBizInfo?: {
      /** 视频 ID */
      cid?: string
      /** 视频 URL */
      tvUrl?: string
      /** 同步类型 */
      synchType?: string
    }
    /** 视频信息 */
    videoInfo?: {
      /** 视频名称 */
      name?: string
    }
  }
  /** 扩展缓冲 */
  extBuffer?: {
    /** 缓存 */
    buf?: Record<string, unknown>
  }
  /** 是否为 VIP 用户 */
  is_vip?: boolean
  /** 是否为年费 VIP */
  is_years_vip?: boolean
  /** VIP 等级 */
  vip_level?: number
  /** 登录天数 */
  login_days?: number
}

/** Api返回参数 */
export interface OB11ApiRequest {
  /** 发送私聊消息 */
  [OB11ApiAction.sendPrivateMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 发送群消息 */
  [OB11ApiAction.sendGroupMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 发送消息 */
  [OB11ApiAction.sendMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 撤回消息 */
  [OB11ApiAction.deleteMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 获取消息 */
  [OB11ApiAction.getMsg]: GetMsg

  /** 获取转发消息 */
  [OB11ApiAction.getForwardMsg]: {
    message: Array<OB11NodeSegment>
  }

  /** 发送好友赞 */
  [OB11ApiAction.sendLike]: {}

  /** 群组踢人 */
  [OB11ApiAction.setGroupKick]: {}

  /** 群组禁言 */
  [OB11ApiAction.setGroupBan]: {}

  /** 群组匿名用户禁言 */
  [OB11ApiAction.setGroupAnonymousBan]: {}

  /** 群组全员禁言 */
  [OB11ApiAction.setGroupWholeBan]: {}

  /** 设置群管理员 */
  [OB11ApiAction.setGroupAdmin]: {}

  /** 设置群匿名聊天 */
  [OB11ApiAction.setGroupAnonymous]: {}

  /** 设置群名片（群备注） */
  [OB11ApiAction.setGroupCard]: {}

  /** 设置群名 */
  [OB11ApiAction.setGroupName]: {}

  /** 退出群组 */
  [OB11ApiAction.setGroupLeave]: {}

  /** 设置群成员专属头衔 */
  [OB11ApiAction.setGroupSpecialTitle]: {}

  /** 处理好友添加请求 */
  [OB11ApiAction.setFriendAddRequest]: {}

  /** 处理群添加请求／邀请 */
  [OB11ApiAction.setGroupAddRequest]: {}

  /** 获取登录号信息 */
  [OB11ApiAction.getLoginInfo]: {
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nickname: string
  }

  /** 获取陌生人信息 */
  [OB11ApiAction.getStrangerInfo]: OB11serInfo

  /** 获取好友列表 */
  [OB11ApiAction.getFriendList]: Array<OB11serInfo>

  /** 获取群信息 */
  [OB11ApiAction.getGroupInfo]: GetGroupInfo

  /** 获取群列表 */
  [OB11ApiAction.getGroupList]: Array<GetGroupInfo>

  /** 获取群成员信息 */
  [OB11ApiAction.getGroupMemberInfo]: GetGroupMemberInfo

  /** 获取群成员列表 */
  [OB11ApiAction.getGroupMemberList]: Array<GetGroupMemberInfo>

  /** 获取群荣誉信息 */
  [OB11ApiAction.getGroupHonorInfo]: {
    /** 群号 */
    group_id: number
    /**
     * 当前龙王
     */
    current_talkative?: {
      /** QQ 号 */
      user_id: number
      /** QQ 昵称 */
      nickname: string
      /** 头像url */
      avatar: string
      /** 持续天数 */
      day_count: number
    }
    /** 历史龙王 */
    talkative_list: Array<HonorInfoList>
    /** 群聊之火 */
    performer_list: Array<HonorInfoList>
    /** 群聊炽焰 */
    legend_list: Array<HonorInfoList>
    /** 冒尖小春笋 */
    strong_newbie_list: Array<HonorInfoList>
    /** 快乐之源 */
    emotion_list: Array<HonorInfoList>
  }

  /** 获取 Cookies */
  [OB11ApiAction.getCookies]: {
    cookies: string
  }

  /** 获取 CSRF Token */
  [OB11ApiAction.getCsrfToken]: {
    token: number
  }

  /** 获取 QQ 相关接口凭证 */
  [OB11ApiAction.getCredentials]: {
    cookies: string
    csrf_token: number
  }

  /** 获取语音 */
  [OB11ApiAction.getRecord]: {
    /** 转换后的语音文件绝对路径 如 /home/somebody/cqhttp/data/record/0B38145AA44505000B38145AA4450500.mp3 */
    file: string
  }

  /** 获取图片 */
  [OB11ApiAction.getImage]: {
    /** 下载后的图片文件路径，如 /home/somebody/cqhttp/data/image/6B4DE3DFD1BD271E3297859D41C530F5.jpg */
    file: string
  }

  /** 是否可以发送图片 */
  [OB11ApiAction.canSendImage]: {
    yes: boolean
  }

  /** 是否可以发送语音 */
  [OB11ApiAction.canSendRecord]: {
    yes: boolean
  }

  /** 获取插件运行状态 */
  [OB11ApiAction.getStatus]: {
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean
    /** 状态符合预期，意味着各模块正常运行、功能正常，且 QQ 在线 */
    good: boolean
    [key: string]: any
  }

  /** 获取版本信息 */
  [OB11ApiAction.getVersionInfo]: {
    /** 应用标识，如 mirai-native */
    app_name: string
    /** 应用版本，如 1.2.3 */
    app_version: string
    /** OneBot 标准版本，如 v11 */
    protocol_version: string
    [key: string]: any
  }

  /** 获取版本信息 */
  [OB11ApiAction.getVersion]: {
    /** 应用标识，如 mirai-native */
    app_name: string
    /** 应用版本，如 1.2.3 */
    app_version: string
    /** OneBot 标准版本，如 v11 */
    protocol_version: string
    [key: string]: any
  }

  /** 重启插件 */
  [OB11ApiAction.setRestart]: {
    /** 延迟重启时间，单位毫秒，不填或留空表示立即重启 */
    delay?: number
  }

  /** 清理数据缓存 */
  [OB11ApiAction.cleanCache]: {}

  /** 发送合并转发消息 */
  [OB11ApiAction.sendForwardMsg]: {
    /** 消息 ID */
    message_id: number
    /** res_id 可通过长消息接口发送 */
    forward_id: string
  }

  /** 发送群聊合并转发消息 */
  [OB11ApiAction.sendGroupForwardMsg]: {
    /** 消息 ID */
    message_id: number
    /** res_id 可通过长消息接口发送 */
    forward_id: string
  }

  /** 发送好友合并转发消息 */
  [OB11ApiAction.sendPrivateForwardMsg]: {
    /** 消息 ID */
    message_id: number
    /** res_id 可通过长消息接口发送 */
    forward_id: string
  }

  /** 获取好友历史消息记录 */
  [OB11ApiAction.getFriendMsgHistory]: { messages: GetMsg[] }

  /** 获取群组历史消息记录 */
  [OB11ApiAction.getGroupMsgHistory]: { messages: GetMsg[] }

  /** 对消息进行表情回应 */
  [OB11ApiAction.setMsgEmojiLike]: {}

  /**
   * 上传群文件
   */
  [OB11ApiAction.uploadGroupFile]: {}

  /**
   * 上传私聊文件
   */
  [OB11ApiAction.uploadPrivateFile]: {}

  /**
   * 获取精华消息列表
   */
  [OB11ApiAction.getEssenceMsgList]: Array<{
    /** 发送者QQ号 */
    sender_id: number
    /** 发送者昵称 */
    sender_nick: string
    /** 消息发送时间 */
    sender_time: number
    /** 操作者QQ号 */
    operator_id: number
    /** 操作者昵称 */
    operator_nick: string
    /** 精华设置时间 */
    operator_time: number
    /** 消息ID */
    message_id: number
  }>

  /**
   * 设置精华消息
   */
  [OB11ApiAction.setEssenceMsg]: {}
  /**
   * 移除精华消息
   */
  [OB11ApiAction.deleteEssenceMsg]: {}
  /**
   * 获取群文件url
   */
  [OB11ApiAction.getGroupFileUrl]: {
    url: string
  }
  /**
   * 获取私聊文件url
   */
  [OB11ApiAction.getPrivateFileUrl]: {
    url: string
  }
}
