import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { Contact, ReplyReturn } from '../event'
import { KarinElement, NodeElement } from '../element/element'
import { LoggerLevel } from '../logger/logger'
import { PushMessageBody, EssenceMessageBody, FriendInfo, GroupInfo, GroupMemberInfo, GroupHonorInfo, GroupFileInfo, GroupFolderInfo, GetRemainCountAtAllResponse } from './api'

export interface KarinAdapter {
  /**
   * 适配器版本信息
   */
  version: {
    /**
     * 适配器名称
     */
    name: string
    /**
     * 适配器名称
     * @deprecated 请使用`version.name`
     */
    app_name: string
    /**
     * 适配器版本
     */
    version: string
  }

  /**
   * 账号信息
   */
  account: {
    /**
     * 账号uid
     */
    uid: string
    /**
     * 账号uin
     */
    uin: string
    /**
     * 账号名 不存在则是空字符串
     */
    name: string
  }

  /**
   * 适配器信息
   */
  adapter: {
    /**
     * 适配器注册之后的索引
     */
    index: number,
    /**
     * 适配器ID
     */
    id: 'QQ' | 'WeChat' | 'Telegram' | 'QQBot' | string
    /**
     * 适配器名称
     */
    name: 'ICQQ' | 'OneBot11' | 'OntBot12' | 'Kritor' | 'input' | string
    /**
     * 适配器类型
     */
    type: 'internal' | 'grpc' | 'http' | 'ws' | 'render'
    /**
     * 适配器子类型
     */
    sub_type: 'server' | 'client' | 'internal'
    /**
     * 连接时间
     */
    start_time: number
    /**
     * 适配器连接地址
     * 仅在`http`、`ws`、`grpc`有效 比如 ws://127.0.0.1:7000
     */
    connect?: string
  }

  /**
   * 获取Bot自身UID
   */
  get self_id (): string

  /**
   * 专属当前Bot的日志打印方法
   * @param level - 日志等级
   * @param args - 日志内容
   */
  logger (level: LoggerLevel, ...args: any[]): void

  /**
   * 可选方法 仅ws有效 在注册适配器后 如果有符合的path则会调用此方法
   * @param socket - WebSocket实例
   * @param request - http请求实例
   */
  server?(socket: WebSocket, request: IncomingMessage): void

  /**
   * 可选方法 仅ws有效 处理正向ws连接
   * @param connect - 连接地址
   */
  client?(connect: string): void

  /**
   * 获取头像url
   * @param user_id - 用户ID
   * @param size - 头像大小，默认需要为`0`，请开发者注意
   * @returns 头像的url地址
   */
  getAvatarUrl (user_id: string, size?: 0 | 40 | 100 | 140): string

  /**
   * 获取群头像url
   * @param group_id - 群号
   * @param size - 头像大小，默认`0`
   * @param history - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns 头像的url地址
   */
  getGroupAvatarUrl (group_id: string, size?: 0 | 40 | 100 | 140, history?: number): string

  /**
   * 发送消息
   * @param contact - 联系人信息
   * @param elements - 消息元素
   * @param retry_count - 重试次数 默认为1
   * @returns 此接口因各平台问题，允许返回更多自定义数据
   */
  SendMessage (contact: Contact, elements: Array<KarinElement>, retry_count?: number): Promise<ReplyReturn>

  /**
   * 上传合并转发消息返回一个资源ID
   * @param contact - 联系人信息
   * @param elements - 转发消息元素
   * @returns 有可能返回资源id 有可能返回消息id 自行区别
   */
  UploadForwardMessage (contact: Contact, elements: Array<NodeElement>): Promise<string>

  /**
   * 通过资源ID发送转发消息
   * @param contact - 联系人信息
   * @param res_id - 资源ID
   * @returns 包含消息ID和消息发送成功时间的对象
   */
  SendMessageByResId (contact: Contact, res_id: string): Promise<{ message_id: string, message_time: number }>

  /**
   * 撤回消息
   * @param contact - 联系人信息
   * @param message_id - 消息ID
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  RecallMessage (contact: Contact, message_id: string): Promise<void | boolean>

  /**
   * 获取消息
   * @param contact - 联系人信息
   * @param message_id - 消息ID
   * @returns PushMessageBody对象
   */
  GetMessage (contact: Contact, message_id: string): Promise<PushMessageBody>

  /**
   * 获取msg_id获取历史消息
   * @param contact - 联系人信息
   * @param start_message_id - 起始消息ID
   * @param count - 获取消息数量 默认为1
   * @returns 包含历史消息的数组
   */
  GetHistoryMessage (contact: Contact, start_message_id: string, count: number): Promise<Array<PushMessageBody>>

  /**
   * 下载合并转发消息
   * @param res_id - 资源ID
   * @returns 包含PushMessageBody对象的数组
   */
  DownloadForwardMessage (res_id: string): Promise<Array<PushMessageBody>>

  /**
   * 获取精华消息
   * @param group_id - 群ID
   * @param page - 页码
   * @param page_size - 每页数量
   * @returns EssenceMessageBody对象
   */
  GetEssenceMessageList (group_id: string, page: number, page_size: number): Promise<Array<EssenceMessageBody>>

  /**
   * 设置精华消息
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetEssenceMessage (group_id: string, message_id: string): Promise<void | boolean>

  /**
   * 删除精华消息
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  DeleteEssenceMessage (group_id: string, message_id: string): Promise<void | boolean>

  /**
   * 发送好友赞
   * @param target_uid_or_uin - 好友UID或者UIN(QQ) 任选其一提供即可
   * @param vote_count - 赞的次数，默认为10
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  VoteUser (target_uid_or_uin: string, vote_count: number): Promise<void | boolean>

  /**
   * 群踢人
   * @param group_id - 群ID
   * @param target_uid_or_uin - 被踢出目标的UID或者UIN 任选其一
   * @param reject_add_request - 是否拒绝再次申请，默认为false
   * @param kick_reason - 踢出原因，可选
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  KickMember (group_id: string, target_uid_or_uin: string, reject_add_request?: boolean, kick_reason?: string): Promise<void | boolean>

  /**
   * 禁言用户
   * @param group_id - 群ID
   * @param target_uid_or_uin - 被禁言目标的UID或者UIN 任选其一
   * @param duration - 禁言时长 单位:秒
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  BanMember (group_id: string, target_uid_or_uin: string, duration: number): Promise<void | boolean>

  /**
   * 群全员禁言
   * @param group_id - 群ID
   * @param is_ban - 是否开启全员禁言
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetGroupWholeBan (group_id: string, is_ban: boolean): Promise<void | boolean>

  /**
   * 设置群管理员
   * @param group_id - 群ID
   * @param target_uid_or_uin - 目标用户的UID或者UIN 任选其一
   * @param is_admin - 是否设置为管理员
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetGroupAdmin (group_id: string, target_uid_or_uin: string, is_admin: boolean): Promise<void | boolean>

  /**
   * 修改群名片
   * @param group_id - 群ID
   * @param target_uid_or_uin - 目标用户的UID或者UIN 任选其一
   * @param card - 新的群名片
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  ModifyMemberCard (group_id: string, target_uid_or_uin: string, card: string): Promise<void | boolean>

  /**
   * 设置群名
   * @param group_id - 群ID
   * @param group_name - 新的群名
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  ModifyGroupName (group_id: string, group_name: string): Promise<void | boolean>

  /**
   * 退出群组
   * @param group_id - 群ID
   * @param is_dismiss - 如果Bot是群主，是否解散群。此项属于拓展选项，Kritor标准没有，仅在OneBot11中有效
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  LeaveGroup (group_id: string, is_dismiss: boolean): Promise<void | boolean>

  /**
   * 设置群专属头衔
   * @param group_id - 群ID
   * @param target_uid_or_uin - 目标用户的UID或者UIN 任选其一
   * @param unique_title - 专属头衔
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetGroupUniqueTitle (group_id: string, target_uid_or_uin: string, unique_title: string): Promise<void | boolean>

  /**
   * 获取登录账号信息
   * @returns 包含登录账户UID、UIN和名称的对象
   */
  GetCurrentAccount (): Promise<{ account_uid: string, account_uin: string, account_name: string }>

  /**
   * 获取陌生人信息 不支持批量获取
   * 此接口的请求参数需要明确是target_uid还是target_uin，请开发者注意
   * @param target_uid_or_uin - 用户UID或者UIN 任选其一
   * @returns 陌生人信息数组
   */
  GetStrangerProfileCard (target_uid_or_uin: string[]): Promise<Array<FriendInfo>>

  /**
   * 获取好友列表
   * @param refresh - 是否刷新好友列表
   * @returns 好友列表数组
   */
  GetFriendList (refresh?: boolean): Promise<Array<FriendInfo>>

  /**
   * 获取群信息
   * @param group_id - 群ID
   * @param no_cache - 是否刷新缓存
   * @returns 群信息
   */
  GetGroupInfo (group_id: string, no_cache?: boolean): Promise<GroupInfo>

  /**
   * 获取群列表
   * @param refresh - 是否刷新好友列表
   * @returns 群列表数组
   */
  GetGroupList (refresh?: boolean): Promise<Array<GroupInfo>>

  /**
   * 获取群成员信息
   * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
   * @param group_id - 群ID
   * @param target_uid_or_uin - 目标用户的UID或者UIN 任选其一
   * @param refresh - 是否刷新缓存
   * @returns 群成员信息
   */
  GetGroupMemberInfo (group_id: string, target_uid_or_uin: string, refresh?: boolean): Promise<GroupMemberInfo>

  /**
   * 获取群成员列表
   * @param group_id - 群ID
   * @param refresh - 是否刷新缓存
   * @returns 群成员列表数组
   */
  GetGroupMemberList (group_id: string, refresh?: boolean): Promise<Array<GroupMemberInfo>>

  /**
   * 获取群荣誉信息
   * @param group_id - 群ID
   * @param refresh - 是否刷新缓存
   * @returns 群荣誉信息数组
   */
  GetGroupHonor (group_id: string, refresh?: boolean): Promise<Array<GroupHonorInfo>>

  /**
   * 获取版本信息
   * @returns 版本信息
   */
  GetVersion (): Promise<{
    version: string
    app_name: string
  }>

  /**
   * 设置好友请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   * @param remark - 好友备注 同意时有效
   * @returns 设置结果
   */
  SetFriendApplyResult (request_id: string, is_approve: boolean, remark?: string): Promise<void | boolean>

  /**
   * 设置申请加入群请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   * @param deny_reason - 拒绝理由 拒绝时有效
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetGroupApplyResult (request_id: string, is_approve: boolean, deny_reason?: string): Promise<void | boolean>

  /**
   * 设置邀请加入群请求结果
   * @param request_id - 请求ID
   * @param is_approve - 是否同意
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetInvitedJoinGroupResult (request_id: string, is_approve: boolean): Promise<void | boolean>

  /**
   * 发送合并转发消息
   * @param contact 联系人信息
   * @param elements 消息元素
   */
  sendForwardMessage (contact: Contact, elements: Array<NodeElement>): Promise<{ message_id: string }>

  /**
   * 对消息进行表情回应 icqq需要传递seq
   * @param Contact - 联系人信息
   * @param message_id - 消息ID
   * @param face_id - 表情ID
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  ReactMessageWithEmoji (contact: Contact, message_id: string, face_id: number, is_set: boolean): Promise<void | boolean>

  /**
   * 上传群文件
   * @param group_id - 群号
   * @param file - 本地文件绝对路径
   * @param name - 文件名称 必须提供
   * @param folder - 父目录ID 不提供则上传到根目录
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  UploadGroupFile (group_id: string, file: string, name: string, folder?: string): Promise<void | boolean>

  /**
   * 上传私聊文件
   * @param user_id - 用户ID
   * @param file - 本地文件绝对路径
   * @param name - 文件名称 必须提供
   * @returns 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  UploadPrivateFile (user_id: string, file: string, name: string): Promise<void | boolean>

  /**
   * 让Kritor下载文件到Kritor本地
   * @param options.url - 下载文件的URL 二选一
   * @param options.base64 - 下载文件的base64 二选一
   * @param options.root_path - 下载文件的根目录 需要保证Kritor有该目录访问权限 可选
   * @param options.file_name - 保存的文件名称 默认为文件MD5 可选
   * @param options.thread_cnt - 下载文件的线程数 默认为3 可选
   * @param options.headers - 下载文件的请求头 可选
   * @returns 下载文件的绝对路径和文件MD5
   */
  DownloadFile (options?: {
    /**
     * 下载文件的URL 二选一
     */
    url?: string,
    /**
     * 下载文件的base64 二选一
     */
    base64?: string,
    /**
     * 下载文件的根目录 需要保证Kritor有该目录访问权限 可选
     */
    root_path?: string,
    /**
     * 保存的文件名称 默认为文件MD5 可选
     */
    file_name?: string,
    /**
     * 下载文件的线程数 默认为3 可选
     */
    thread_cnt?: number,
    /**
     * 下载文件的请求头 可选
     */
    headers?: string
  }): Promise<{ file_absolute_path: string, file_md5: string }>

  /**
   * 创建文件夹
   * @param group_id - 群号
   * @param name - 文件夹名
   * @returns - 返回文件夹id和已使用空间
   */
  CreateFolder (group_id: number, name: string): Promise<{ id: string; used_space: number }>

  /**
   * 重命名文件夹
   * @param group_id - 群号
   * @param folder_id - 文件夹id
   * @param name - 文件夹名
   * @returns - 无返回值
   */
  RenameFolder (group_id: number, folder_id: string, name: string): Promise<void>

  /**
   * 删除文件夹
   * @param group_id - 群号
   * @param folder_id - 文件夹id
   * @returns - 无返回值
   */
  DeleteFolder (group_id: number, folder_id: string): Promise<void>

  /**
   * 上传文件
   * @param group_id - 群号
   * @param data - 文件数据，包含文件内容、文件名、文件路径或文件URL
   * @returns - 无返回值
   */
  UploadFile (group_id: number, data: { file?: Uint8Array; file_name?: string; file_path?: string; file_url?: string }): Promise<void>

  /**
   * 删除文件
   * @param group_id - 群号
   * @param file_id - 文件id
   * @param bus_id - 文件类型ID
   * @returns - 无返回值
   */
  DeleteFile (group_id: number, file_id: string, bus_id: number): Promise<void>

  /**
   * 获取文件系统信息
   * @param group_id - 群号
   * @returns - 返回文件数量、文件数量上限、已使用空间和空间上限
   */
  GetFileSystemInfo (group_id: number): Promise<{ file_count: number; total_count: number; used_space: number; total_space: number }>

  /**
   * 获取文件夹下文件
   * @param group_id - 群号
   * @param folder_id - 文件夹id，空则为根目录
   * @returns - 返回文件和文件夹的列表
   */
  GetFileList (group_id: number, folder_id?: string): Promise<{ files: GroupFileInfo[]; folders: GroupFolderInfo[] }>

  /**
   * 修改群备注
   * @param group_id - 群号
   * @param remark - 新的备注
   * @returns - 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  ModifyGroupRemark: (group_id: string, remark: string) => Promise<void | boolean>

  /**
   * 获取未加入群组信息 此api不建议实现
   * @param group_id - 群号
   */
  GetNotJoinedGroupInfo?(group_id: string): Promise<GroupInfo[]>

  /**
   * 获取艾特全体成员剩余次数
   * @param group_id - 群号
   * @returns - 返回是否允许at全体成员和全群剩余次数、个人剩余次数
   */
  GetRemainCountAtAll (group_id: string): Promise<GetRemainCountAtAllResponse>

  /**
   * 获取禁言用户列表
   * @param group_id
   * @returns - 返回禁言用户列表
   */
  GetProhibitedUserList (group_id: string): Promise<Array<{ uid: string, uin: string, prohibited_time: number }>>

  /**
   * 戳一戳用户
   * @param group_id - 群号
   * @param target_uid_or_uin - 目标用户的UID或者UIN 任选其一
   * @returns - 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  PokeMember: (group_id: string, target_uid_or_uin: string) => Promise<void | boolean>

  /**
   * 清空本地聊天记录
   * @param contact - 联系人信息
   * @returns - 此接口标准是无返回值的，karin在此拓展可选返回一个boolean
   */
  SetMessageReaded (contact: Contact): Promise<void | boolean>

  /**
   * Get general cookie
   * 什么，你问我这是干啥的？我也不知道，反正是个接口
   * @param domain - The domain to get cookies from
   */
  GetCookies?(domain: string): Promise<{ cookie: string }>

  /**
   * Get bkn and cookie
   * 什么，你问我这是干啥的？我也不知道，反正是个接口
   * @param domain - The domain to get credentials from
   */
  GetCredentials?(domain: string): Promise<{ bkn: string, cookie: string }>

  /**
   * Get bkn
   * 什么，你问我这是干啥的？我也不知道，反正是个接口
   * @param domain - The domain to get the CSRF token from
   */
  GetCSRFToken?(domain: string): Promise<{ bkn: string }>

  /**
   * Get http request cookie
   * 什么，你问我这是干啥的？我也不知道，反正是个接口
   * @param appid - The appid
   * @param daid - The daid
   * @param jump_url - The jump url
   */
  GetHttpCookies?(appid: string, daid: string, jump_url: string): Promise<{ cookie: string }>
}
