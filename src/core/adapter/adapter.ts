import type { Contact } from '@/adapter/contact'
import type { LoggerLevel } from '@/utils/config/types'
import type { NodeElementType, SendElementTypes } from '@/adapter/segment'
import type {
  CreateGroupFolderResponse,
  DownloadFileOptions,
  DownloadFileResponse,
  GetAtAllCountResponse,
  GetGroupFileListResponse,
  GetGroupFileSystemInfoResponse,
  GetGroupHighlightsResponse,
  GetGroupMuteListResponse,
  GroupInfo,
  GroupMemberInfo,
  MessageResponse,
  QQGroupHonorInfo,
  UserInfo,
} from '@/adapter/types'
import type { Params, Request } from '@adapter/onebot/types'

/** 适配器平台枚举 */
export const enum AdapterPlatform {
  /** QQ */
  QQ = 'qq',
  /** Telegram */
  Telegram = 'telegram',
  /** Discord */
  Discord = 'discord',
  /** WeChat */
  WeChat = 'wechat',
  /** KOKO */
  KOKO = 'koko',
  /** Shell */
  Shell = 'shell',
  /** 未知 */
  Unknown = 'unknown',
}

/** 适配器标准协议枚举 */
export const enum AdapterStandard {
  /** 打不死的ICQQ */
  ICQQ = 'icqq',
  /** onebot11 */
  Onebot11 = 'onebot11',
  /** kritor */
  Kritor = 'kritor',
  /** onebot12 */
  Onebot12 = 'onebot12',
  /** karin */
  Internal = 'karin',
  /** 未知 */
  Unknown = 'unknown',
}

/** 适配器协议实现名称 目前仅收集已知的协议实现 */
export const enum AdapterProtocol {
  /** gocq */
  GOCQ = 'gocq-http',
  /** icqq */
  ICQQ = 'icqq',
  /** @icqqjs/icqq */
  ICQQJS = '@icqqjs/icqq',
  /** @link https://llonebot.github.io/zh-CN/ */
  LLOneBot = 'llonebot',
  /** lagrangejs */
  LagrangeJS = 'lagrangejs',
  /** @link https://lagrangedev.github.io/Lagrange.Doc/Lagrange.OneBot/ */
  LagrangeOneBot = 'lagrange-onebot',
  /** @link https://napneko.github.io/zh-CN/ */
  NapCatQQ = 'napcat',
  /** ws-plugin 小叶姐姐~ */
  WSPlugin = 'ws-plugin',
  /** @link https://justundertaker.github.io/ComWeChatBotClient/ */
  ComWeChat = 'comwechat',
}

/** 适配器通信方式 */
export const enum AdapterCommunication {
  /** HTTP */
  HTTP = 'http',
  /** 正向ws */
  WEBSOCKET = 'webSocketServer',
  /** 反向ws */
  REVERSE_WEBSOCKET = 'webSocketClient',
  /** gRPC */
  GRPC = 'grpc',
  /** 内部 例如插件式适配器 */
  INTERNAL = 'internal',
}

/** 发送消息后返回的结果 */
export interface SendMsgResults {
  /** @deprecated 已废弃 请使用 `messageId` */
  message_id: string
  /** 消息ID */
  messageId: string
  /** 消息发送时间戳 */
  messageTime: number
  /** 原始结果 一般是Object、Array */
  rawData: object | Array<any>
}

export interface ForwardOptions {
  /** 小卡片中间的外显 */
  news: Array<{ text: string }>,
  /** qwqa说这个叫不懂 消息列表的外显 */
  prompt: string,
  /** 小卡片底下文本: 查看1条转发消息 */
  summary: string,
  /** 小卡片标题 */
  source: string
}

/** 适配器类型 */
export interface AdapterType {
  /** 原生方法 请自行as为对应的适配器类型 */
  super: any
  /**
   * onebot专属方法
   * @param action 请求的方法
   * @param params 请求的参数
   * @param time 超时时间 默认为120s
   */
  sendApi?: <T extends keyof Params>(action: `${T}`, params: Params[T], time?: number) => Promise<Request[T]>
  /** 适配器信息 */
  adapter: {
    /** 适配器索引 默认为-1 在注册适配器时会自动更改为对应的索引 */
    index: number
    /** 适配器名称 */
    name: string
    /** 适配器版本 */
    version: string
    /** 适配器平台 */
    platform: `${AdapterPlatform}`
    /** 适配器使用的协议标准 如onebot11 */
    standard: `${AdapterStandard}`
    /** 适配器协议实现 如icqq、napcat */
    protocol: `${AdapterProtocol}`
    /** 适配器通信方式 */
    communication: `${AdapterCommunication}`
    /**
     * 适配器通信地址
     * @example `http://127.0.0.1:7000`
     * @example `ws://127.0.0.1:7000/ws`
     * @example `grpc://127.0.0.1:7001`
     * @example `internal://127.0.0.1`
     */
    address: string
    /** 鉴权秘钥 */
    secret: string | null
  }

  /** 账号信息 */
  account: {
    /** Bot的uin */
    uin: string
    /** Bot的uid */
    uid: string
    /** Bot的selfId 一般使用此参数即可 */
    selfId: string
    /** Bot的子ID 比如在QQ频道下Bot拥有一个和普通用户一样的ID */
    subId: string
    /** 账号名 不存在则是空字符串 */
    name: string
    /** Bot的头像链接 */
    avatar: string
  }

  /** 获取Bot的id */
  get selfId (): string
  /** 获取Bot的name */
  get selfName (): string
  /** 获取Bot的subId */
  get selfSubId (): string

  /**
   * 打印当前Bot的专属日志
   * @param level 日志等级
   * @param args 日志内容
   */
  logger (level: LoggerLevel, ...args: any[]): void

  /**
   * 发送消息
   * @param contact 目标信息
   * @param elements 消息元素
   * @param retryCount 重试次数 默认为0
   */
  sendMsg (contact: Contact, elements: Array<SendElementTypes>, retryCount?: number): Promise<SendMsgResults>

  /**
   * 发送长消息
   * @param contact 目标信息
   * @param resId 资源ID
   */
  sendLongMsg (contact: Contact, resId: string): Promise<SendMsgResults>

  /**
   * 发送合并转发消息
   * @param contact 目标信息
   * @param elements 消息元素
   * @param options 首层小卡片外显参数
   */
  sendForwardMsg (contact: Contact, elements: Array<NodeElementType>, options?: ForwardOptions): Promise<{ messageId: string }>

  /**
   * 撤回消息
   * @param contact 目标信息
   * @param messageId 消息ID
   * @returns 此接口的返回值不值得信任
   */
  recallMsg (contact: Contact, messageId: string): Promise<boolean>

  /**
   * 获取头像url
   * @param userId 用户ID
   * @param size 头像大小，默认需要为`0`，请开发者注意
   * @returns 头像的url地址
   */
  getAvatarUrl (userId: string, size?: 0 | 40 | 100 | 140): Promise<string>

  /**
   * 获取群头像url
   * @param groupId 群号
   * @param size 头像大小，默认`0`
   * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns 头像的url地址
   */
  getGroupAvatarUrl (groupId: string, size?: 0 | 40 | 100 | 140, history?: number): Promise<string>

  /**
   * 获取消息
   * @param contact 目标信息
   * @param messageId 消息ID
   * @returns MessageResponse对象
   */
  getMsg (contact: Contact, messageId: string): Promise<MessageResponse>

  /**
   * 获取msgId获取历史消息
   * @param contact 目标信息
   * @param startMsgId 起始消息ID
   * @param count 获取消息数量 默认为1
   * @returns 包含历史消息的数组
   */
  getHistoryMsg (contact: Contact, startMsgId: string, count: number): Promise<Array<MessageResponse>>

  /**
   * 获取合并转发消息
   * @param resId 资源ID
   * @returns 包含MessageResponse对象的数组
   */
  // TODO: 此处返回类型错误
  getForwardMsg (resId: string): Promise<Array<MessageResponse>>

  /**
   * 获取精华消息
   * @param groupId 群ID
   * @param page 页码
   * @param pageSize 每页数量
   * @returns EssenceMessageBody对象
   */
  getGroupHighlights (groupId: string, page: number, pageSize: number): Promise<Array<GetGroupHighlightsResponse>>

  /**
   * 构造一个资源ID 即上传合并转发消息后不进行发送
   * @param contact 目标信息
   * @param elements 转发消息元素
   * @description 此接口并不是所有协议端都支持的，因此在使用时请注意
   */
  createResId (contact: Contact, elements: Array<NodeElementType>): Promise<string>

  /**
   * 设置、取消群精华消息
   * @param groupId 群ID
   * @param messageId 群消息ID
   * @param create true为添加精华消息，false为删除精华消息 默认为true
   */
  setGgroupHighlights (groupId: string, messageId: string, create: boolean): Promise<boolean>

  /**
   * 发送好友赞
   * @param targetId 目标ID
   * @param count 赞的次数，默认为10
   * @returns 此接口的返回值不值得信任
   */
  sendLike (targetId: string, count: number): Promise<boolean>

  /**
   * 群踢人
   * @param groupId 群ID
   * @param targetId 被踢出目标的ID 任选其一
   * @param rejectAddRequest 是否拒绝再次申请，默认为false
   * @param kickReason 踢出原因，可选
   * @returns 此接口的返回值不值得信任
   */
  groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>

  /**
   * 禁言群成员
   * @param groupId 群ID
   * @param targetId 被禁言目标的ID 任选其一
   * @param duration 禁言时长 单位:秒
   * @returns 此接口的返回值不值得信任
   */
  setGroupMute (groupId: string, targetId: string, duration: number): Promise<boolean>
  /**
   * 群全员禁言
   * @param groupId 群ID
   * @param isBan 是否开启全员禁言
   * @returns 此接口的返回值不值得信任
   */
  setGroupAllMute (groupId: string, isBan: boolean): Promise<boolean>

  /**
   * 设置群管理员
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param isAdmin 是否设置为管理员
   * @returns 此接口的返回值不值得信任
   */
  setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>

  /**
   * 设置群名片
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param card 新的群名片
   * @returns 此接口的返回值不值得信任
   */
  setGroupMemberCard (groupId: string, targetId: string, card: string): Promise<boolean>

  /**
   * 设置群名
   * @param groupId 群ID
   * @param groupName 新的群名
   * @returns 此接口的返回值不值得信任
   */
  setGroupName (groupId: string, groupName: string): Promise<boolean>

  /**
   * 退出群组
   * @param groupId 群ID
   * @param isDismiss 如果Bot是群主，是否解散群
   * @returns 此接口的返回值不值得信任
   */
  setGroupQuit (groupId: string, isDismiss: boolean): Promise<boolean>

  /**
   * 设置群专属头衔 仅群主可用
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param title 新的专属头衔
   * @returns 此接口的返回值不值得信任
   */
  setGroupMemberTitle (groupId: string, targetId: string, title: string): Promise<boolean>

  /**
   * 获取陌生人信息
   * @param targetId 用户ID 任选其一
   * @returns 陌生人信息数组
   */
  getStrangerInfo (targetId: string): Promise<UserInfo>

  /**
   * 获取好友列表
   * @param refresh 是否刷新好友列表
   * @returns 好友列表数组
   */
  getFriendList (refresh?: boolean): Promise<Array<UserInfo>>

  /**
   * 获取群信息
   * @param groupId 群ID
   * @param noCache 是否刷新缓存
   * @returns 群信息
   */
  getGroupInfo (groupId: string, noCache?: boolean): Promise<GroupInfo>

  /**
   * 获取群列表
   * @param refresh 是否刷新好友列表
   * @returns 群列表数组
   */
  getGroupList (refresh?: boolean): Promise<Array<GroupInfo>>

  /**
   * 获取群成员信息
   * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
   * @param groupId 群ID
   * @param targetId 目标用户的ID
   * @param refresh 是否刷新缓存
   * @returns 群成员信息
   */
  getGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean): Promise<GroupMemberInfo>

  /**
   * 获取群成员列表
   * @param groupId 群ID
   * @param refresh 是否刷新缓存
   * @returns 群成员列表数组
   */
  getGroupMemberList (groupId: string, refresh?: boolean): Promise<Array<GroupMemberInfo>>

  /**
   * 获取群荣誉信息
   * @param groupId 群ID
   * @returns 群荣誉信息数组
   */
  getGroupHonor (groupId: string): Promise<Array<QQGroupHonorInfo>>

  /**
   * 设置好友请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @param remark 好友备注 同意时有效
   * @returns 设置结果
   */
  setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string): Promise<boolean>

  /**
   * 设置申请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @param denyReason 拒绝理由 拒绝时有效
   * @returns 此接口的返回值不值得信任
   */
  setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>

  /**
   * 设置邀请加入群请求结果
   * @param requestId 请求事件ID
   * @param isApprove 是否同意
   * @returns 此接口的返回值不值得信任
   */
  setInvitedJoinGroupResult (requestId: string, isApprove: boolean): Promise<boolean>

  /**
   * 设置消息表情回应
   * @param contact 目标信息
   * @param messageId 消息ID
   * @param faceId 表情ID
   * @returns 此接口的返回值不值得信任
   */
  setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean): Promise<boolean>

  /**
   * 上传群文件、私聊文件
   * @param contact 目标信息
   * @param file 本地文件绝对路径
   * @param name 文件名称 必须提供
   * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
   * @returns 此接口的返回值不值得信任
   */
  uploadFile (contact: Contact, file: string, name: string, folder?: string): Promise<boolean>

  /**
   * 让协议端下载文件到协议端本地
   * @param options 下载文件的选项
   * @returns 下载文件的绝对路径和文件MD5
   */
  downloadFile (options?: DownloadFileOptions): Promise<DownloadFileResponse>

  /**
   * 创建群文件夹
   * @param groupId 群号
   * @param name 文件夹名
   * @returns 返回文件夹id和已使用空间
   */
  createGroupFolder (groupId: string, name: string): Promise<CreateGroupFolderResponse>

  /**
   * 重命名群文件的文件夹
   * @param groupId 群号
   * @param folderId 文件夹id
   * @param name 文件夹名
   * @returns 无返回值
   */
  renameGroupFolder (groupId: string, folderId: string, name: string): Promise<boolean>

  /**
   * 删除群文件的文件夹
   * @param groupId 群号
   * @param folderId 文件夹id
   * @returns 无返回值
   */
  delGroupFolder (groupId: string, folderId: string): Promise<boolean>

  /**
   * 上传群文件
   * @description 此接口仅可以在Bot和协议端在同一台设备上时使用
   * @param groupId 群号
   * @param file 文件绝对路径
   * @param name 文件名
   * @returns 无返回值
   */
  uploadGroupFile (groupId: string, file: string, name?: string): Promise<boolean>

  /**
   * 删除群文件
   * @param groupId 群号
   * @param fileId 文件id
   * @param busId 文件类型ID
   * @returns 无返回值
   */
  delGroupFile (groupId: string, fileId: string, busId: number): Promise<boolean>

  /**
   * 获取群文件系统信息
   * @param groupId 群号
   * @returns 返回文件数量、文件数量上限、已使用空间和空间上限
   */
  getGroupFileSystemInfo (groupId: string): Promise<GetGroupFileSystemInfoResponse>

  /**
   * 获取群文件夹下文件列表
   * @param groupId 群号
   * @param folderId 文件夹id，空则为根目录
   * @returns 返回文件和文件夹的列表
   */
  getGroupFileList (groupId: string, folderId?: string): Promise<GetGroupFileListResponse>

  /**
   * 设置群备注
   * @param groupId 群号
   * @param remark 新的备注
   * @returns 此接口的返回值不值得信任
   */
  setGroupRemark (groupId: string, remark: string): Promise<boolean>

  /**
   * 获取陌生群信息
   * @param groupId 群号
   */
  getNotJoinedGroupInfo?(groupId: string): Promise<GroupInfo>

  /**
   * 获取艾特全体成员剩余次数
   * @param groupId 群号
   * @returns 返回是否允许at全体成员和全群剩余次数、个人剩余次数
   */
  getAtAllCount (groupId: string): Promise<GetAtAllCountResponse>

  /**
   * 获取群被禁言用户列表
   * @param groupId
   * @returns 返回禁言用户列表
   */
  getGroupMuteList (groupId: string): Promise<Array<GetGroupMuteListResponse>>

  /**
   * 戳一戳用户 支持群聊和私聊
   * @param contact 目标信息
   * @param count 戳一戳次数 默认为1
   * @returns 此接口的返回值不值得信任
   */
  pokeUser (contact: Contact, count?: number): Promise<boolean>

  /**
   * 获取 Cookies
   * @param domain The domain to get cookies from
   */
  getCookies (domain: string): Promise<{ cookie: string }>

  /**
   * 获取 QQ 相关接口凭证
   * @param domain The domain to get credentials from
   */
  getCredentials (domain: string): Promise<{ cookies: string, csrf_token: number }>

  /**
   * 获取 CSRF Token
   * @param domain The domain to get the CSRF token from
   */
  getCSRFToken (domain: string): Promise<{ token: number }>

  /**
   * 获取 HTTP Cookies
   * @param appid The appid
   * @param daid The daid
   * @param jumpUrl The jump url
   */
  getHttpCookies (appid: string, daid: string, jumpUrl: string): Promise<{ cookie: string }>
}
