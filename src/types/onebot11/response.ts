import { OB11Api } from './api'
import { OB11Role, ob11Sender, OB11Sex } from './sender'
import { CustomNodeSegment, OB11Segment } from './segment'
import { MessageType } from './params'

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
  sex: OB11Sex
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
  role: OB11Role
  /** 是否不良记录成员 */
  unfriendly: boolean
  /** 专属头衔 */
  title: string
  /** 专属头衔过期时间戳 */
  title_expire_time: number
  /** 是否允许修改群名片 */
  card_changeable: boolean
}

/** OneBot11公开Api返回值 response */
export type OB11ApiResponse = {
  /** 发送私聊消息 */
  [OB11Api.sendPrivateMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 发送群消息 */
  [OB11Api.sendGroupMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 发送消息 */
  [OB11Api.sendMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 撤回消息 */
  [OB11Api.deleteMsg]: {
    /** 消息 ID */
    message_id: number
  }

  /** 获取消息 */
  [OB11Api.getMsg]: {
    /** 发送时间 */
    time: number
    /** 消息类型 */
    message_type: MessageType
    message_id: number
    real_id: number
    sender: ob11Sender
    message: OB11Segment[]
  }

  /** 获取转发消息 */
  [OB11Api.getForwardMsg]: {
    message: Array<CustomNodeSegment>
  }

  /** 发送好友赞 */
  [OB11Api.sendLike]: {}

  /** 群组踢人 */
  [OB11Api.setGroupKick]: {}

  /** 群组禁言 */
  [OB11Api.setGroupBan]: {}

  /** 群组匿名用户禁言 */
  [OB11Api.setGroupAnonymousBan]: {}

  /** 群组全员禁言 */
  [OB11Api.setGroupWholeBan]: {}

  /** 设置群管理员 */
  [OB11Api.setGroupAdmin]: {}

  /** 设置群匿名聊天 */
  [OB11Api.setGroupAnonymous]: {}

  /** 设置群名片（群备注） */
  [OB11Api.setGroupCard]: {}

  /** 设置群名 */
  [OB11Api.setGroupName]: {}

  /** 退出群组 */
  [OB11Api.setGroupLeave]: {}

  /** 设置群成员专属头衔 */
  [OB11Api.setGroupSpecialTitle]: {}

  /** 处理好友添加请求 */
  [OB11Api.setFriendAddRequest]: {}

  /** 处理群添加请求／邀请 */
  [OB11Api.setGroupAddRequest]: {}

  /** 获取登录号信息 */
  [OB11Api.getLoginInfo]: {
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nickname: string
  }

  /** 获取陌生人信息 */
  [OB11Api.getStrangerInfo]: {
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nickname: string
    /** 性别 */
    sex: 'male' | 'female' | 'unknown'
    /** 年龄 */
    age: number
  }

  /** 获取好友列表 */
  [OB11Api.getFriendList]: Array<{
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nickname: string
    /** 性别 */
    sex: 'male' | 'female' | 'unknown'
    /** 年龄 */
    age: number
  }>

  /** 获取群信息 */
  [OB11Api.getGroupInfo]: GetGroupInfo

  /** 获取群列表 */
  [OB11Api.getGroupList]: Array<GetGroupInfo>

  /** 获取群成员信息 */
  [OB11Api.getGroupMemberInfo]: GetGroupMemberInfo

  /** 获取群成员列表 */
  [OB11Api.getGroupMemberList]: Array<GetGroupMemberInfo>

  /** 获取群荣誉信息 */
  [OB11Api.getGroupHonorInfo]: {
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
  [OB11Api.getCookies]: {
    cookies: string
  }

  /** 获取 CSRF Token */
  [OB11Api.getCsrfToken]: {
    token: number
  }

  /** 获取 QQ 相关接口凭证 */
  [OB11Api.getCredentials]: {
    cookies: string
    csrf_token: number
  }

  /** 获取语音 */
  [OB11Api.getRecord]: {
    /** 转换后的语音文件绝对路径 如 /home/somebody/cqhttp/data/record/0B38145AA44505000B38145AA4450500.mp3 */
    file: string
  }

  /** 获取图片 */
  [OB11Api.getImage]: {
    /** 下载后的图片文件路径，如 /home/somebody/cqhttp/data/image/6B4DE3DFD1BD271E3297859D41C530F5.jpg */
    file: string
  }

  /** 是否可以发送图片 */
  [OB11Api.canSendImage]: {
    yes: boolean
  }

  /** 是否可以发送语音 */
  [OB11Api.canSendRecord]: {
    yes: boolean
  }

  /** 获取插件运行状态 */
  [OB11Api.getStatus]: {
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean
    /** 状态符合预期，意味着各模块正常运行、功能正常，且 QQ 在线 */
    good: boolean
    [key: string]: any
  }

  /** 获取版本信息 */
  [OB11Api.getVersionInfo]: {
    /** 应用标识，如 mirai-native */
    app_name: string
    /** 应用版本，如 1.2.3 */
    app_version: string
    /** OneBot 标准版本，如 v11 */
    protocol_version: string
    [key: string]: any
  }

  /** 获取版本信息 */
  [OB11Api.getVersion]: {
    /** 应用标识，如 mirai-native */
    app_name: string
    /** 应用版本，如 1.2.3 */
    app_version: string
    /** OneBot 标准版本，如 v11 */
    protocol_version: string
    [key: string]: any
  }

  /** 重启插件 */
  [OB11Api.setRestart]: {
    /** 延迟重启时间，单位毫秒，不填或留空表示立即重启 */
    delay?: number
  }

  /** 清理数据缓存 */
  [OB11Api.cleanCache]: {}

  /** 发送合并转发消息 */
  [OB11Api.sendForwardMsg]: string

  /** 获取好友历史消息记录 */
  [OB11Api.getFriendMsgHistory]: Array<OB11Segment>

  /** 获取群组历史消息记录 */
  [OB11Api.getGroupMsgHistory]: Array<OB11Segment>

  /** 对消息进行表情回应 */
  [OB11Api.setMsgEmojiLike]: {}

  /**
   * 上传群文件
   */
  [OB11Api.uploadGroupFile]: {}

  /**
   * 上传私聊文件
   */
  [OB11Api.uploadPrivateFile]: {}

  /**
   * 获取精华消息列表
   */
  [OB11Api.getEssenceMsgList]: Array<{
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
  [OB11Api.setEssenceMsg]: {}
  /**
   * 移除精华消息
   */
  [OB11Api.deleteEssenceMsg]: {}
}
