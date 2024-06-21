import { KarinElement, KarinNodeElement } from './element'
import { contact, PushMessageBody, EssenceMessageBody, FriendInfo, GroupInfo, GroupMemberInfo, GroupHonorInfo } from './types'

export interface KarinAdapter {
  /**
   * - 适配器版本信息
   */
  version: {
    /**
     * - 适配器名称
     */
    name: string
    /**
     * - 适配器名称
     * @deprecated 请使用`version.name`
     */
    app_name: string
    /**
     * - 适配器版本
     */
    version: string
  }

  /**
   * - 账号信息
   */
  account: {
    /**
     * - 账号uid
     */
    uid: string
    /**
     * - 账号uin
     */
    uin: string
    /**
     * - 账号名 不存在则是空字符串
     */
    name: string
  }

  /**
   * - 适配器信息
   */
  adapter: {
    /**
     * - 适配器ID
     */
    id: 'QQ' | 'WeChat' | 'Telegram' | 'QQBot' | string
    /**
     * - 适配器名称
     */
    name: 'ICQQ' | 'OneBot11' | 'OntBot12' | 'Kritor' | string
    /**
     * - 适配器类型
     */
    type: 'internal' | 'grpc' | 'http' | 'ws' | 'render'
    /**
     * - 适配器子类型
     */
    sub_type: 'server' | 'client' | 'internal'
    /**
     * - 连接时间
     */
    start_time: number
  }

  /**
   * 获取Bot自身UID
   */
  get self_id(): string

  /**
   * - 获取头像url
   */
  getAvatarUrl(
    /**
     * - 用户ID
     */
    user_id: string,
    /**
     * - 头像大小，默认需要为`0`，请开发者注意
     */
    size?: number,
  ): string

  /**
   * - 获取群头像
   */
  getGroupAvatar(
    /**
     * - 群号
     */
    group_id: string,
    /**
     * - 头像大小，默认`0`
     */
    size?: number,
    /**
     * - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
     */
    history?: number,
  ): string

  /**
   * - 发送消息
   */
  SendMessage(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 消息元素
     */
    elements: Array<KarinElement>,
    /**
     * 重试次数 默认为1
     */
    retry_count?: number,
  ): Promise<{
    /**
     * - 消息ID
     */
    message_id: string
  }>

  /**
   * - 上传合并转发消息返回一个资源ID
   * - 这一块会比较特殊，目前经测试有shamrock、Lagrange.OneBot支持这个功能(其他未测试)
   */
  UploadForwardMessage(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 转发消息元素
     */
    elements: Array<KarinNodeElement>,
  ): Promise<{
    /**
     * - 资源ID
     */
    res_id: string
  }>

  /**
   * - 通过资源ID发送转发消息
   */
  SendMessageByResId(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 资源ID
     */
    res_id: string,
  ): Promise<{
    /**
     * - 消息ID
     */
    message_id: string
    /**
     * - 消息发送成功时间
     */
    message_time: number
  }>

  /**
   * - 撤回消息
   */
  RecallMessage(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 消息ID
     */
    message_id: string,
  ): Promise<void>

  /**
   * - 获取消息
   */
  GetMessage(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 消息ID
     */
    message_id: string,
  ): Promise<object>

  /**
   * - 获取msg_id获取历史消息
   */
  GetHistoryMessage(
    /**
     * - 联系人信息
     */
    contact: contact,
    /**
     * - 起始消息ID
     */
    start_message_id: string,
    /**
     * - 获取消息数量 默认为1
     */
    count: number,
  ): Promise<Array<PushMessageBody>>

  /**
   * - 下载合并转发消息
   */
  DownloadForwardMessage(
    /**
     * - 资源ID
     */
    res_id: string,
  ): Promise<Array<PushMessageBody>>

  /**
   * - 获取精华消息
   */
  GetEssenceMessageList(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 页码
     */
    page: number,
    /**
     * - 每页数量
     */
    page_size: number,
  ): Promise<EssenceMessageBody>

  /**
   * - 设置精华消息
   */
  SetEssenceMessage(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 消息ID
     */
    message_id: string,
  ): Promise<void>

  /**
   * - 删除精华消息
   */
  DeleteEssenceMessage(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 消息ID
     */
    message_id: string,
  ): Promise<void>

  /**
   * - 发送好友赞
   */
  VoteUser(
    /**
     * - 好友UID或者UIN(QQ) 任选其一提供即可
     */
    target_uid_or_uin: string,
    /**
     * - 赞的次数，默认为10
     */
    vote_count: number,
  ): Promise<void>

  /**
   * - 群踢人
   */
  KickMember(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 被踢出目标的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * 是否拒绝再次申请，默认为false
     */
    reject_add_request?: boolean,
    /**
     * 踢出原因，可选
     */
    kick_reason?: string,
  ): Promise<void>

  /**
   * - 禁言用户
   */
  BanMember(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 被禁言目标的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * - 禁言时长 单位:秒
     */
    duration: number,
  ): Promise<void>

  /**
   * - 群全员禁言
   */
  SetGroupWholeBan(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 是否开启全员禁言
     */
    enable: boolean,
  ): Promise<void>

  /**
   * - 设置群管理员
   */
  SetGroupAdmin(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 目标用户的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * - 是否设置为管理员
     */
    is_admin: boolean,
  ): Promise<void>

  /**
   * - 修改群名片
   */
  ModifyMemberCard(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 目标用户的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * - 新的群名片
     */
    card: string,
  ): Promise<void>

  /**
   * - 设置群名
   */
  ModifyGroupName(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 新的群名
     */
    group_name: string,
  ): Promise<void>

  /**
   * - 退出群组
   */
  LeaveGroup(
    /**
     * - 群ID
     */
    group_id: number,
    /**
     * - 如果Bot是群主，是否解散群
     * - 此项属于拓展选项，Kritor标准没有，仅在OneBot11中有效
     */
    is_dismiss: boolean,
  ): Promise<void>

  /**
   * - 设置群专属头衔
   */
  SetGroupUniqueTitle(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 目标用户的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * - 专属头衔
     */
    unique_title: string,
  ): Promise<void>

  /**
   * - 获取登录账号信息
   */
  GetCurrentAccount(): Promise<{
    /**
     * - 登录账户UID
     */
    account_uid: string
    /**
     * - 登录账户UIN
     */
    account_uin: string
    /**
     * - 登录账户名称
     */
    account_name: number
  }>

  /**
   * - 获取陌生人信息 不支持批量获取
   * - 此接口的请求参数需要明确是target_uid还是target_uin，请开发者注意
   */
  GetStrangerProfileCard(
    /**
     * - 用户UID或者UIN 任选其一
     */
    target_uid_or_uin: string[],
  ): Promise<Array<FriendInfo>>

  /**
   * - 获取好友列表
   */
  GetFriendList(
    /**
     * - 是否刷新好友列表
     */
    refresh?: boolean,
  ): Promise<Array<FriendInfo>>

  /**
   * - 获取群信息
   */
  GetGroupInfo(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 是否刷新缓存
     */
    no_cache?: boolean,
  ): Promise<GroupInfo>

  /**
   * - 获取群列表
   */
  GetGroupList(
    /**
     * - 是否刷新好友列表
     */
    refresh?: boolean,
  ): Promise<Array<GroupInfo>>

  /**
   * - 获取群成员信息
   * - 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
   */
  GetGroupMemberInfo(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 目标用户的UID或者UIN 任选其一
     */
    target_uid_or_uin: string,
    /**
     * - 是否刷新缓存
     */
    refresh?: boolean,
  ): Promise<GroupMemberInfo>

  /**
   * - 获取群成员列表
   */
  GetGroupMemberList(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 是否刷新缓存
     */
    refresh?: boolean,
  ): Promise<Array<GroupMemberInfo>>

  /**
   * - 获取群荣誉信息
   */
  GetGroupHonor(
    /**
     * - 群ID
     */
    group_id: string,
    /**
     * - 是否刷新缓存
     */
    refresh?: boolean,
  ): Promise<Array<GroupHonorInfo>>

  /**
   * - 获取版本信息
   */
  GetVersion(): Promise<{
    version: string
    app_name: string
  }>

  /**
   * - 设置好友请求结果
   */
  SetFriendApplyResult(
    /**
     * - 请求ID
     */
    request_id: string,
    /**
     * - 是否同意
     */
    is_approve: boolean,
    /**
     * - 好友备注 同意时有效
     */
    remark?: string,
  ): Promise<void>

  /**
   * - 设置申请加入群请求结果
   */
  SetGroupApplyResultRequest(
    /**
     * - 请求ID
     */
    request_id: string,
    /**
     * - 是否同意
     */
    is_approve: boolean,
    /**
     * - 拒绝理由 拒绝时有效
     */
    deny_reason?: string,
  ): Promise<void>

  /**
   * - 设置邀请加入群请求结果
   */
  SetInvitedJoinGroupResult(
    /**
     * - 请求ID
     */
    request_id: string,
    is_approve: boolean,
  ): Promise<void>

  /**
   * 发送合并转发消息
   * @param {contact} contact
   * @param {Array<KarinNodeElement>} elements
   * @return {Promise<void>}
   */
  sendForwardMessage(contact: contact, elements: Array<KarinNodeElement>): Promise<{ message_id?: string }>
}
