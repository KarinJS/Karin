/**
 * KarinAdapter
 *
 * @description KarinAdapter 适配器，所有适配器都应该继承它。用户直接看到的应该是这个继承器
 * @todo 补全方法
 * @class KarinAdapter
 */

import { segment } from '#Karin'

export class KarinAdapter {
  constructor () {
    this.index = 0
    this.self_id = ''
    this.account = { uid: '', uin: '', name: '' }
    this.version = { name: '', app_name: '', version: '' }
    this.adapter = { id: '', name: '', type: '', sub_type: '', url: '', start_time: Date.now() }
  }

  /**
   * @type {number} 重连次数
   */
  index

  /**
   * @type {string} 机器人id 一般情况为QQ号
   */
  self_id

  /**
   * @type {account} 账号信息
   * @typedef account 账号信息
   * @property {string} account.uid - 账号uid
   * @property {string} account.uin - 账号uin
   * @property {string} account.name - 账号名
   */
  account

  /**
   * @type {adapter} 适配器信息
   * @typedef {object} adapter 适配器信息
   * @property {'QQ' | 'WeChat' | 'Telegram' | string} adapter.id - 适配器ID
   * @property {'icqq'|'onebot11'|'ontbot12'|'kritor'|string} adapter.name - 适配器名称
   * @property {'internal'|'websocket'|'grpc'|'http'|'render'} adapter.type - 适配器类型
   * @property {'server'|'client'|undefined} adapter.sub_type - 适配器子类型
   * @property {string|undefined} adapter.url - 适配器连接地址 internal和render下为undefined
   * @property {number} adapter.start_time - 适配器连接时间
   */
  adapter

  /**
   * @type {version} 适配器版本信息
   * @typedef {object} version 适配器版本信息
   * @property {string} version.name - 适配器名称
   * @property {string} version.app_name - 适配器名称
   * @property {string} version.version - 适配器版本
   */
  version

  /**
   * 获取头像url
   * @param {number} _size 头像大小，默认`0`
   * @param {string|number} _uid 用户qq，默认为机器人QQ
   * @returns {string} 头像的url地址
   */
  getAvatarUrl (_uid = this.self_id, _size = 0) {
    throw new Error('Not implemented')
  }

  /**
   * 获取群头像
   * @param {string} _group_id - 群号
   * @param {number?} _size - 头像大小，默认`0`
   * @param {number?} _history - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns {string} - 群头像的url地址
   */
  getGroupAvatar (_group_id, _size = 0, _history = 0) {
    throw new Error('Not implemented')
  }

  /**
   * 发送私聊消息
   * @param {number} user_id - 用户ID
   * @param {Array<KarinElement>} message - 要发送的内容
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async send_private_msg (user_id, message) {
    throw new Error('Not implemented')
  }

  /**
   * 发送群消息
   * @param {number} group_id - 群号
   * @param {Array<KarinElement>} message - 要发送的内容
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async send_group_msg (group_id, message) {
    throw new Error('Not implemented')
  }

  /**
   * 发送消息
   *
   * @param {KarinContact} contact
   * @param {Array<KarinElement>} elements
   * @returns {Promise<{message_id:string}>} - 消息ID
   */
  async SendMessage (contact, elements) {
    throw new Error('Not implemented')
  }

  /**
   * 上传合并转发消息
   * @param {KarinContact} contact - 联系人信息
   * @param {KarinNodeElement[] | KarinNodeElement} elements - nodes
   * @returns {Promise<string>} - 资源id
   * */
  async UploadForwardMessage (contact, elements) {
    throw new Error('Not implemented')
  }

  /**
   * 撤回消息
   * @param {string?} _contact - ob11无需提供contact参数
   * @param {number} _message_id - 消息ID
   * @returns {Promise<void>}
   */
  async RecallMessage (_contact, _message_id) {
    throw new Error('Not implemented')
  }

  /**
   * 获取消息
   * @param {string?} _contact - ob11无需提供contact参数
   * @param {number} _message_id - 消息ID
   * @returns {Promise<object>} - 消息内容
   */
  async GetMessage (_contact, _message_id) {
    throw new Error('Not implemented')
  }

  /**
   * 获取msg_id获取历史消息
   * @param {KarinContact} contact - 联系人信息
   * @param {string} start_message_id - 起始消息ID
   * @param {number} count - 获取消息数量
   * @return {Promise<Array<PushMessageBody>>} - 消息内容
   * */
  async GetHistoryMessage (contact, start_message_id, count) {
    throw new Error('Not implemented')
  }

  /**
   * todo
   * 获取合并转发消息
   * @param {string} id - 合并转发 ID
   * @returns {Promise<object>} - 消息内容，使用消息的数组格式表示，数组中的消息段全部为 node 消息段
   */
  async get_forward_msg (id) {
    throw new Error('Not implemented')
  }

  /**
   * 发送好友赞
   * @param {{
   *  target_uid?: string,
   *  target_uin?: string,
   *  times: number
   * }} options
   * @param options.target_uid - 好友 QQ 号 任选其一
   * @param options.target_uin - 好友 QQ 号 任选其一
   * @param options.times - 赞的次数，默认为 10
   */
  async VoteUser (options) {
    throw new Error('Not implemented')
  }

  /**
   * 群组踢人
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  reject_add_request?:boolean,
   *  kick_reason?:string
   * }} options
   * @param options.group_id - 群组ID
   * @param options.target_uid - 被踢出目标的 uid 任选其一
   * @param options.target_uin - 被踢出目标的 uin 任选其一
   * @param options.reject_add_request - 是否拒绝再次申请，默认为false
   * @param options.kick_reason - 踢出原因，可选
   * @returns {Promise<KickMemberResponse>} - 踢出操作的响应
   */
  async KickMember (options) {
    throw new Error('Not implemented')
  }

  /**
   * 禁言用户
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  duration:number
   * }} options
   * @param options.group_id - 群组ID
   * @param options.target_uid - 被禁言目标的uin 任选其一
   * @param options.target_uin - 被禁言目标的uid 任选其一
   * @param options.duration - 禁言时长（单位：秒）
   * @returns {Promise<BanMemberResponse>} - 禁言操作的响应
   */
  async BanMember (options) {
    throw new Error('Not implemented')
  }

  /**
   * 群组匿名用户禁言
   * @param {number} group_id - 群号
   * @param {object} anonymous - 要禁言的匿名用户对象（群消息上报的 anonymous 字段）
   * @param {string} [anonymous_flag] - 要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @param {number} [duration=1800] - 禁言时长，单位秒，无法取消匿名用户禁言
   */
  async set_group_anonymous_ban (group_id, anonymous, anonymous_flag, duration = 1800) {
    throw new Error('Not implemented')
  }

  /**
   * 群组全员禁言
   * @param {number} group_id - 群号
   * @param {boolean} [enable=true] - 是否全员禁言
   */
  async SetGroupWholeBan (group_id, enable = true) {
    throw new Error('Not implemented')
  }

  /**
   * 设置群管理员
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  is_admin:boolean
   * }} options - 设置管理员选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 要设置为管理员的用户uid
   * @param options.target_uin - 要设置为管理员的用户uin
   * @param options.is_admin - 是否设置为管理员
   * @returns {Promise<SetGroupAdminResponse>} - 设置群管理员操作的响应
   */
  async SetGroupAdmin (options) {
    throw new Error('Not implemented')
  }

  /**
   * 群组匿名
   * @param {number} group_id - 群号
   * @param {boolean} [enable=true] - 是否允许匿名聊天
   */
  async set_group_anonymous (group_id, enable = true) {
    throw new Error('Not implemented')
  }

  /**
   * 修改群名片
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  card:string
   * }} options
   * @param {number} options.group_id - 群组ID
   * @param {string|number} options.target_uid - 目标用户的 uid 任选其一
   * @param {string|number} options.target_uin - 目标用户的 uin 任选其一
   * @param {string} options.card - 新的群名片
   * @returns {Promise<ModifyMemberCardResponse>} - 修改群名片操作的响应
   */
  async ModifyMemberCard (options) {
    throw new Error('Not implemented')
  }

  /**
   * 设置群名
   * @param {number} group_id - 群号
   * @param {string} group_name - 新群名
   */
  async ModifyGroupName (group_id, group_name) {
    throw new Error('Not implemented')
  }

  /**
   * 退出群组
   * @param {number} group_id - 群号
   * @param {boolean} [is_dismiss=false] - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  async LeaveGroup (group_id, is_dismiss = false) {
    throw new Error('Not implemented')
  }

  /**
   * 设置群专属头衔
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  unique_title:string
   * }} options - 设置头衔选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 目标用户的uid
   * @param options.target_uin - 目标用户的uin
   * @param options.unique_title - 新的群头衔
   * @returns {Promise<SetGroupUniqueTitleResponse>} - 设置群头衔操作的响应
   */
  async SetGroupUniqueTitle (options) {
    throw new Error('Not implemented')
  }

  /**
   * 处理加好友请求
   * @param {string} flag - 加好友请求的 flag（需从上报的数据中获得）
   * @param {boolean} [approve=true] - 是否同意请求
   * @param {string} [remark=''] - 添加后的好友备注（仅在同意时有效）
   */
  async set_friend_add_request (flag, approve = true, remark = '') {
    throw new Error('Not implemented')
  }

  /**
   * 处理加群请求／邀请
   * @param {string} flag - 加群请求的 flag（需从上报的数据中获得）
   * @param {string} sub_event - add 或 invite，请求类型（需要和上报消息中的 sub_event 字段相符）
   * @param {boolean} [approve=true] - 是否同意请求／邀请
   * @param {string} [reason=''] - 拒绝理由（仅在拒绝时有效）
   */
  async set_group_add_request (flag, sub_event, approve = true, reason = '') {
    throw new Error('Not implemented')
  }

  /**
   * 获取登录号信息
   * @returns {Promise<{account_uid:string, account_uin:string, account_name:number}>} - 登录号信息
   */
  async GetCurrentAccount () {
    throw new Error('Not implemented')
  }

  /**
   * 获取陌生人信息 不支持批量获取
   * @param {Object} [options] - 陌生人信息选项
   * @param {Array<string>} [options.target_uids] - 目标用户的 uid 数组 可选
   * @param {Array<string>} [options.target_uins] - 目标用户的 uin 数组 可选
   * @param {boolean} [options.no_cache=false] - 是否不使用缓存
   * @returns {Promise<IProfileCard[]>} - 获取到的陌生人信息
   */
  async GetStrangerProfileCard (options) {
    throw new Error('Not implemented')
  }

  /**
   * 获取好友列表
   * @returns {Promise<Array<IFriendInfo>>} - 好友列表
   */
  async GetFriendList () {
    throw new Error('Not implemented')
  }

  /**
   * 获取群信息
   * @param {number} group_id - 群号
   * @param {boolean} [no_cache=false] - 是否不使用缓存
   * @returns {Promise<IGroupInfo>} - 群信息
   */
  async GetGroupInfo (group_id, no_cache = false) {
    throw new Error('Not implemented')
  }

  /**
   * 获取群列表
   * @returns {Promise<Array<IGroupInfo>>} - 群列表
   */
  async GetGroupList () {
    throw new Error('Not implemented')
  }

  /**
   * 获取群成员信息
   * @param {{
   *  group_id:string,
   *  target_uid?:string,
   *  target_uin?:string,
   *  refresh?:boolean
   * }} options - 获取成员信息选项
   * @param options.group_id - 群组ID
   * @param options.target_uid - 目标用户的uid
   * @param options.target_uin - 目标用户的uin
   * @param options.refresh - 是否刷新缓存，默认为 false
   * @returns {Promise<IGroupMemberInfo>} - 获取群成员信息操作的响应
   */
  async GetGroupMemberInfo (options) {
    throw new Error('Not implemented')
  }

  /**
   * 获取群成员列表
   * @param {Object} options - 获取成员列表选项
   * @param {number} options.group_id - 群组ID
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupMemberInfo[]>} - 获取群成员列表操作的响应
   */
  async GetGroupMemberList (options) {
    throw new Error('Not implemented')
  }

  /**
   * 获取群荣誉信息
   * @param {Object} options - 获取群荣誉信息选项
   * @param {number} options.group_id - 群号
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupHonorInfo[]>} - 获取群荣誉信息操作的响应
   */
  async get_group_honor_info (options) {
    throw new Error('Not implemented')
  }

  /**
   * 对消息进行表情回应
   * @param {KarinContact} Contact - 联系人信息
   * @param {string} message_id - 消息ID
   * @param {string} face_id - 表情ID
   */
  async ReactMessageWithEmojiRequest (Contact, message_id, face_id, is_set = true) {
    throw new Error('Not implemented')
  }

  /**
   * 上传群文件
   * @param {string} group_id - 群号
   * @param {string} file - 本地文件绝对路径
   * @param {string} name - 文件名称 必须提供
   * @param {string} [folder] - 父目录ID 不提供则上传到根目录
   */
  async UploadGroupFile (group_id, file, name) {
    throw new Error('Not implemented')
  }

  /**
   * 上传私聊文件
   * @param {string} user_id - 用户ID
   * @param {string} file - 本地文件绝对路径
   * @param {string} name - 文件名称 必须提供
   */
  async UploadPrivateFile (user_id, file, name) {
    throw new Error('Not implemented')
  }

  /**
   * 获取 Cookies
   * @param {string} domain - 需要获取 cookies 的域名
   * @returns {Promise<{string}>} - Cookies
   */
  async get_cookies (domain) {
    throw new Error('Not implemented')
  }

  /**
   * 获取 CSRF Token
   * @returns {Promise<string>} - CSRF Token
   */
  async get_csrf_token () {
    throw new Error('Not implemented')
  }

  /**
   * 获取 QQ 相关接口凭证
   * @param {string} domain - 需要获取 cookies 的域名
   * @returns {Promise<{
   *   cookies: string,
   *   cstf_token: number
   * }>} - QQ 相关接口凭证
   */
  async get_credentials (domain) {
    throw new Error('Not implemented')
  }

  /**
   * 获取语音
   * @param {string} file - 收到的语音文件名
   * @param {string} out_format - 要转换到的格式
   * @returns {Promise<{
   *   file: string,
   *   out_format: 'mp3' | 'amr' | 'wma' | 'm4a' | 'spx' | 'ogg' | 'wav' | 'flac'
   * }>} - 转换后的语音文件路径
   */
  async get_record (file, out_format) {
    throw new Error('Not implemented')
  }

  /**
   * 获取图片
   * @param {string} file - 收到的图片文件名
   * @returns {Promise<{
   *   size: number,
   *   filename: string,
   *   url: string
   * }>} - 下载后的图片文件路径
   */
  async get_image (file) {
    throw new Error('Not implemented')
  }

  /**
   * 检查是否可以发送图片
   * @returns {Promise<boolean>} - 是否可以发送图片
   */
  async can_send_image () {
    throw new Error('Not implemented')
  }

  /**
   * 检查是否可以发送语音
   * @returns {Promise<boolean>} - 是否可以发送语音
   */
  async can_send_record () {
    throw new Error('Not implemented')
  }

  /**
   * 获取运行状态
   * @returns {Promise<object>} - 运行状态
   */
  async get_status () {
    throw new Error('Not implemented')
  }

  /**
   * 获取版本信息
   * @returns {Promise<GetVersionResponse>} - 版本信息
   */
  async GetVersion () {
    throw new Error('Not implemented')
  }

  /**
   * 发送合并转发消息
   * @param {KarinContact} contact
   * @param {Array<KarinNodeElement>} elements
   * @return {Promise<{message_id}>}
   */
  async sendForwardMessage (contact, elements) {
    let message_id = await this.UploadForwardMessage(contact, elements)
    if (this.version.name === 'Lagrange.OneBot') {
      message_id = await this.SendMessage(contact, [segment.forward(message_id)])
    }
    return { message_id }
  }
}
