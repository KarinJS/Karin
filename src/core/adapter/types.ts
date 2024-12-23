import { Contact } from '@/adapter/contact'
import { ElementTypes } from '@/adapter/segment'
import { RoleEnum, GroupSender, SexEnum } from '@/adapter/sender'

/** 基本消息返回值结构 */
export interface MessageResponse {
  /** 消息发送时间 */
  time: number
  /** 消息ID */
  messageId: string
  /** 消息序列号 */
  messageSeq: number
  /** 消息来源目标信息 */
  contact: Contact
  /** 消息发送者 */
  sender: GroupSender
  /** 消息元素 */
  elements: Array<ElementTypes>
}

/** 发送转发消息后返回值接口 */
export interface SendForwardMessageResponse {
  /** 消息ID */
  messageId: string
  /** resID 可通过长消息接口进行发送 */
  forwardId: string
}

/** 获取精华消息返回值结构 */
export interface GetGroupHighlightsResponse {
  /** 群ID */
  groupId: string
  /** 消息发送者ID */
  senderId: string
  /** 发送者昵称 */
  senderName: string
  /** 操作者ID */
  operatorId: string
  /** 操作者昵称 */
  operatorName: string
  /** 操作时间 */
  operationTime: number
  /** 消息发送时间 */
  messageTime: number
  /** 消息ID */
  messageId: string
  /** 消息序列号 */
  messageSeq: number
  /** 被设置的精华消息元素文本 */
  jsonElements: string
}

/**
 * 用户信息结构
 * @description 此接口仅可保证返回user_id、nick这两个字段
 */
export interface UserInfo {
  /** 用户ID */
  userId: string
  /** 名称 */
  nick: string
  /** 用户UID */
  uid: string
  /** 用户UIN */
  uin: string
  /** qid */
  qid?: string
  /** 备注 */
  remark?: string
  /** 用户等级 */
  level?: number
  /** 生日 */
  birthday?: string
  /** 登录天数 */
  loginDay?: number
  /** 点赞数 */
  likeCount?: number
  /** 学校是否已核实 */
  isSchoolVerified?: boolean
  /** 年龄 */
  age?: number
  /** 性别 */
  sex?: SexEnum
  /** 好莱坞/腾讯视频会员 */
  hollywoodVip?: boolean
  /** QQ会员 */
  qqVip?: boolean
  /** QQ超级会员 */
  qqSvip?: boolean
  /** 大会员 */
  bigVip?: boolean
  /** 是否已经赞过 */
  isLike?: boolean
  [key: string]: any
}

/**
 * 群信息结构
 * @description 此接口仅可保证返回group_id这个字段
 */
export interface GroupInfo {
  /** 群ID */
  groupId: string
  /** 群名称 */
  groupName?: string
  /** 群主ID */
  owner?: string
  /** 群备注 */
  groupRemark?: string
  /** 群管理员ID列表 */
  admins?: Array<string>
  /** 最大成员数 */
  maxMemberCount?: number
  /** 当前成员数 */
  memberCount?: number
  /** 群描述 */
  groupDesc?: string
}

/**
 * 群成员信息
 * @description 此接口仅可保证返回user_id这个字段
 */
export interface GroupMemberInfo {
  /** 用户ID */
  userId: string
  /** 用户角色 */
  role: RoleEnum
  /** 用户昵称 */
  nick?: string
  /** 年龄 */
  age?: number
  /** 群内头衔 */
  uniqueTitle?: string
  /** 群名片 */
  card?: string
  /** 加群时间 */
  joinTime?: number
  /** 最后活跃时间 */
  lastActiveTime?: number
  /** 用户等级 */
  level?: number
  /** 禁言时间 */
  shutUpTime?: number
  /** 距离 */
  distance?: number
  /** 荣誉列表 */
  honors?: Array<number>
  /** 是否好友 */
  unfriendly?: boolean
  /** 性别 */
  sex?: SexEnum
  /** 构建成发送者 方便使用 */
  get sender (): GroupSender
}

/**
 * 群荣誉信息
 * @description 此接口仅可在QQ协议端中使用
 */
export interface QQGroupHonorInfo {
  /** 荣誉成员ID */
  userId: string
  /** 荣誉成员昵称 */
  nick: string
  /** 荣誉名称 */
  honorName: string
  /** 荣誉图标url */
  avatar: string
  /** 荣誉id */
  id: number
  /** 荣誉描述 */
  description: string
}

/**
 * 群文件信息
 * @description 此接口仅可在QQ协议端中使用
 */
export interface QQGroupFileInfo {
  /** 文件ID */
  id: string
  /** 文件名 */
  name: string
  /** 文件大小 */
  size: number
  /** 上传时间 */
  uploadTime: number
  /** 过期时间 */
  expireTime: number
  /** 修改时间 */
  modifyTime: number
  /** 下载次数 */
  downloadCount: number
  /** 上传者ID */
  uploadId: string
  /** 上传者昵称 */
  uploadName: string
  /** SHA1 */
  sha1: string
  /** SHA3 */
  sha3: string
  /** MD5 */
  md5: string
}

/**
 * 群文件夹信息
 * @description 此接口仅可在QQ协议端中使用
 */
export interface QQGroupFolderInfo {
  /** 文件夹ID */
  id: string
  /** 文件夹名 */
  name: string
  /** 文件数量 */
  fileCount: number
  /** 创建时间 */
  createTime: number
  /** 创建者UID */
  creatorId: string
  /** 创建者昵称 */
  creatorName: string
}

/** 获取at全体成员剩余次数返回值结构 */
export interface GetAtAllCountResponse {
  /** 是否允许at全体成员 */
  accessAtAll: boolean
  /** 全群剩余次数 */
  groupRemainCount: number
  /** 个人剩余次数 */
  userRremainCount: number
}

/** 获取群被禁言用户列表返回值结构 */
export interface GetGroupMuteListResponse {
  /** 用户ID */
  userId: string
  /** 禁言时间 */
  muteTime: number
}

/** 获取群文件夹下文件列表返回值结构 */
export interface GetGroupFileListResponse {
  /** 文件列表 */
  files: QQGroupFileInfo[]
  /** 文件夹列表 */
  folders: QQGroupFolderInfo[]
}

/** 获取群文件系统信息返回值结构 */
export interface GetGroupFileSystemInfoResponse {
  /** 文件数量 */
  fileCount: number
  /** 文件夹数量 */
  totalCount: number
  /** 已使用空间 */
  usedSpace: number
  /** 总空间 */
  totalSpace: number
}

/** 创建群文件夹返回值结构 */
export interface CreateGroupFolderResponse {
  /** 文件夹ID */
  id: string
  /** 已使用空间 */
  usedSpace: string
}

/** 基础选项，不包含 url 和 base64 */
interface DownloadFileOptionsBase {
  /** 下载文件的根目录，需确保 Kritor 有该目录访问权限，可选 */
  rootPath?: string
  /** 保存的文件名称，默认为文件 MD5，可选 */
  fileName?: string
  /** 下载文件的线程数，默认为 3，可选 */
  threadCnt?: number
  /** 下载文件的请求头，可选 */
  headers?: string
}

/** 包含 url 的选项，base64 必须为 never */
interface DownloadFileOptionsWithUrl extends DownloadFileOptionsBase {
  /** 下载文件的 URL，二选一 */
  url: string
  /** 下载文件的 base64，不允许 */
  base64?: never
}

/** 包含 base64 的选项，url 必须为 never */
interface DownloadFileOptionsWithBase64 extends DownloadFileOptionsBase {
  /** 下载文件的 base64，二选一 */
  base64: string
  /** 下载文件的 URL，不允许 */
  url?: never
}

/** 让协议端下载文件到协议端本地请求参数结构 */
export type DownloadFileOptions = DownloadFileOptionsWithUrl | DownloadFileOptionsWithBase64

/** 让协议端下载文件到协议端本地返回值结构 */
export interface DownloadFileResponse {
  /** 下载后文件的绝对路径 */
  filePath: string
}
