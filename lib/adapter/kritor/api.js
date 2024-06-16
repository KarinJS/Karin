import { kritor } from 'kritor-proto'
import { KarinAdapter } from '../adapter.js'

/**
 * @extends KarinAdapter
 */
export default class Kritor extends KarinAdapter {
  constructor (grpc, account, logger, common, config, listener) {
    super()
    /**
     * @type {import('@grpc/grpc-js').ServerReadableStream<kritor.event.EventStructure, kritor.event.RequestPushEvent>}
     */
    this.grpc = grpc
    /** 自增 */
    this.seq = 0
    const { uid, uin } = account
    this.account.uid = uid
    this.account.uin = uin

    /** 适配器信息 */
    this.adapter.id = 'QQ'
    this.adapter.name = 'Kritor'
    this.adapter.type = 'grpc'
    this.adapter.sub_type = 'server'

    /** 监听响应事件 */
    grpc.on('data', data => listener.emit(data.seq, data))
    /** 监听关闭事件 */
    grpc.on('end', () => this.logger('warn', '连接已断开'))
    this.logger = logger
    this.common = common
    this.config = config
    this.listener = listener
    this.#init()
  }

  async #init () {
    const { account_name: name } = await this.GetCurrentAccount()
    this.account.name = name
    const { app_name, version } = await this.GetVersion()
    this.version.app_name = app_name
    this.version.version = version
  }

  // ============辅助=============

  /**
   * 编码
   * @param {string} service - 服务名
   * @param {string} cmd - 命令名
   * @param {string} type - 类型
   * @param {object} buf - 数据
   * @returns {Uint8Array}
   */
  encode (service, cmd, type, buf) {
    buf = kritor[type][`${cmd}Request`].encode(buf).finish()
    cmd = `${service}.${cmd}`
    return { cmd, buf }
  }

  /** 解码 */
  decode (cmd, type, buf) {
    return kritor[type][`${cmd}Response`].decode(buf)
  }

  /**
   *  todo 补充类型
   * @param elements
   * @return {*[]}
   */
  elements (elements) {
    const _elements = []
    const ElementType = kritor.common.Element.ElementType
    for (const i of elements) {
      switch (i.type) {
        case 'text': {
          const { TEXT: type } = ElementType
          const { text } = i
          _elements.push(new kritor.common.TextElement({ type, text: { text } }))
          break
        }
        case 'image': {
          const { IMAGE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.ImageElement({ type, image: { file } }))
          break
        }
        case 'at': {
          const { AT: type } = ElementType
          const { uid, uin = '' } = i
          _elements.push(new kritor.common.AtElement({ type, at: { uid, uin } }))
          break
        }
        case 'face': {
          const { FACE: type } = ElementType
          const { id, is_big = false } = i
          _elements.push(new kritor.common.FaceElement({ type, face: { id, is_big } }))
          break
        }
        case 'reply': {
          const { REPLY: type } = ElementType
          const { id } = i
          _elements.push(new kritor.common.ReplyElement({ type, reply: { id } }))
          break
        }
        case 'voice': {
          const { VOICE: type } = ElementType
          const { file } = i
          _elements.push(new kritor.common.VoiceElement({ type, voice: { file } }))
          break
        }
      }
    }

    return _elements
  }

  // ================消息事件api============

  /**
   * 发送消息
   * @param {KarinContact} contact
   * @param {Array<KarinElement>} elements 消息元素
   * @param {number} retry_count 重试次数
   * @returns {Promise<{message_id:string}>}
   */
  async SendMessage (contact, elements, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'SendMessage'
    const type = 'message'
    elements = this.elements(elements)
    const buf = { contact, elements, retry_count }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 通过资源id发送转发消息
   * @param {KarinContact} contact
   * @param {string} res_id
   * @param {number} retry_count
   * @returns {Promise<SendMessageByResIdResponse>}
   * */
  async SendMessageByResId (contact, res_id, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'SendMessageByResId'
    const type = 'message'
    const buf = { contact, res_id, retry_count }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 撤回消息 */
  async RecallMessage (contact, message_id) {
    const service = 'MessageService'
    const cmd = 'RecallMessage'
    const type = 'message'
    const buf = { contact, message_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 设置消息评论表情 */
  async ReactMessageWithEmoji (contact, message_id, face_id, is_set) {
    const service = 'MessageService'
    const cmd = 'ReactMessageWithEmoji'
    const type = 'message'
    const buf = { contact, message_id, face_id, is_set }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 获取msg_id获取消息 */
  async GetMessage (contact, message_id) {
    const service = 'MessageService'
    const cmd = 'GetMessage'
    const type = 'message'
    const buf = { contact, message_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 通过seq获取消息 */
  async GetMessageBySeq (contact, message_seq) {
    const service = 'MessageService'
    const cmd = 'GetMessageBySeq'
    const type = 'message'
    const buf = { contact, message_seq }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 获取msg_id获取历史消息 */
  async GetHistoryMessage (contact, start_message_id, count) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessage'
    const type = 'message'
    const buf = { contact, start_message_id, count }
    const res = await this.Serialization(service, cmd, type, buf)
    return res.messages
  }

  /** 通过seq获取历史消息 */
  async GetHistoryMessageBySeq (contact, start_message_seq, count) {
    const service = 'MessageService'
    const cmd = 'GetHistoryMessageBySeq'
    const type = 'message'
    const buf = { contact, start_message_seq, count }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 清空本地聊天记录 */
  async SetMessageReaded (contact) {
    const service = 'MessageService'
    const cmd = 'SetMessageReaded'
    const type = 'message'
    const buf = { contact }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 上传合并转发消息 */
  async UploadForwardMessage (contact, messages, retry_count = 1) {
    const service = 'MessageService'
    const cmd = 'UploadForwardMessage'
    const type = 'message'
    messages = this.elements(messages)
    const buf = { contact, messages, retry_count }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 下载合并转发消息 */
  async DownloadForwardMessage (res_id) {
    const service = 'MessageService'
    const cmd = 'DownloadForwardMessage'
    const type = 'message'
    const buf = { res_id }
    const res = await this.Serialization(service, cmd, type, buf)
    res.messages = this.elements(res.messages)
    return res
  }

  /** 获取精华消息 */
  async GetEssenceMessageList (group_id, page, page_size) {
    const service = 'MessageService'
    const cmd = 'GetEssenceMessageList'
    const type = 'message'
    const buf = { group_id, page, page_size }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 设置精华消息 */
  async SetEssenceMessage (group_id, message_id) {
    const service = 'MessageService'
    const cmd = 'SetEssenceMessage'
    const type = 'message'
    const buf = { group_id, message_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /** 删除精华消息 */
  async DeleteEssenceMessage (group_id, message_id) {
    const service = 'MessageService'
    const cmd = 'DeleteEssenceMessage'
    const type = 'message'
    const buf = { group_id, message_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  // ========================其他api===============

  logger (level, ...args) {
    this.logger.bot(level, this.account.uin, ...args)
  }

  /**
  * 获取用户头像
  * @param {string} uid - 用户id，默认为发送者uid
  * @param {number} [size] - 头像大小，默认`0`
  * @returns {string} - 头像的url地址
  */
  getAvatarUrl (uid, size = 0) {
    return `https://q1.qlogo.cn/g?b=qq&s=${size}&nk=` + uid
  }

  /**
   * 获取群头像
   * @param {string} group_id - 群号
   * @param {number} [size] - 头像大小，默认`0`
   * @param {number} [history] - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns {string} - 群头像的url地址
   */
  getGroupAvatar (group_id, size = 0, history = 0) {
    return `https://p.qlogo.cn/gh/${group_id}/${group_id}${history ? '_' + history : ''}/` + size
  }

  // =============核心api===============

  /**
   * 获取Kritor版本
   * @returns {Promise<GetVersionResponse>}
   */
  async GetVersion () {
    const service = 'CoreService'
    const cmd = 'GetVersion'
    const type = 'core'
    const buf = {}
    /** @type {GetVersionResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 让Kritor下载文件到Kritor本地
   * @param {string} file - url或者base64
   * @param {'url'|'base64'} file_type - 文件类型
   * @param {string} [root_path] - 下载文件的根目录 需要保证Kritor有该目录访问权限 可选
   * @param {string} [file_name] - 保存的文件名称 默认为文件MD5 可选
   * @param {Number} [thread_cnt] - 下载文件的线程数 默认为3 可选
   * @param {string} [headers] - 下载文件的请求头 可选
   * @returns {<Promise<{file_absolute_path:string,file_md5:string}>} - 下载成功的结果
   */
  async DownloadFile (file, file_type, root_path, file_name, thread_cnt = 3, headers) {
    const service = 'CoreService'
    const cmd = 'DownloadFile'
    const type = 'core'
    const buf = { [file_type]: file, root_path, file_name, thread_cnt, headers }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 获取当前账户的信息
   * @returns {Promise<{account_uid:string, account_uin:string, account_name:number}>}
   */
  async GetCurrentAccount () {
    const service = 'CoreService'
    const cmd = 'GetCurrentAccount'
    const type = 'core'
    const buf = {}
    const res = await this.Serialization(service, cmd, type, buf)
    /** 统一使用str */
    res.account_uin = String(res.account_uin)
    return res
  }

  /** 切换账户 */
  async SwitchAccount () {
    this.logger('warn', '暂未实现...')
  }

  // =============好友服务===========
  /**
   * 获取好友列表
   * @param {boolean} [refresh] - 是否刷新好友列表 可选
   * @returns {Promise<IFriendInfo[]>}} - 获取到的好友列表信息
   */
  async GetFriendList (refresh) {
    const service = 'FriendService'
    const cmd = 'GetFriendList'
    const type = 'friend'
    const buf = { refresh }
    /** @type {GetFriendListResponse} */
    const res = await this.Serialization(service, cmd, type, buf)
    return res.friends_info
  }

  /**
   * 获取好友名片信息
   * @param {Object} [options] - 名片信息选项
   * @param {Array<string>} [options.target_uids] - 目标用户的 uid 数组 可选
   * @param {Array<string>} [options.target_uins] - 目标用户的 uin 数组 可选
   * @returns {Promise<{friend_cards:Array<FriendCard>}>} - 获取到的好友名片信息
   */
  async GetFriendProfileCard (options) {
    const service = 'FriendService'
    const cmd = 'GetFriendProfileCard'
    const type = 'friend'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 获取陌生人信息
   * @param {Object} [options] - 陌生人信息选项
   * @param {Array<string>} [options.target_uids] - 目标用户的 uid 数组 可选
   * @param {Array<string>} [options.target_uins] - 目标用户的 uin 数组 可选
   * @returns {Promise<Array<IProfileCard>>} - 获取到的陌生人信息
   */
  async GetStrangerProfileCard (options) {
    const service = 'FriendService'
    const cmd = 'GetStrangerProfileCard'
    const type = 'friend'
    const buf = options
    /** @type {GetStrangerProfileCardResponse} */
    const res = await this.Serialization(service, cmd, type, buf)
    return res.strangers_profile_card
  }

  /**
   * 设置自己的名片
   * @param {Object} [options] - 名片信息对象
   * @param {string} [options.nick_name] - 昵称 可选
   * @param {string} [options.company] - 公司 可选
   * @param {string} [options.email] - 邮箱 可选
   * @param {string} [options.college] - 学校 可选
   * @param {string} [options.personal_note] - 个人备注 可选
   * @param {number} [options.birthday] - 生日 可选
   * @param {number} [options.age] - 年龄 可选
   * @returns {Promise<SetProfileCardResponse>} - 设置名片的响应
   */
  async SetProfileCard (options) {
    const service = 'FriendService'
    const cmd = 'SetProfileCard'
    const type = 'friend'
    const buf = options || {}
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 判断是否是黑名单用户
   * @param {string} [target_uid] - 目标用户的 uid 任选其一提供
   * @param {string} [target_uin] - 目标用户的 uin 任选其一提供
   * @returns {Promise<{is_black_list_user:boolean}>} - 是否是黑名单用户的结果
   */
  async IsBlackListUser (target_uid, target_uin) {
    const service = 'FriendService'
    const cmd = 'IsBlackListUser'
    const type = 'friend'
    const buf = { target_uid, target_uin }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 点赞好友
   * @param {{
   * target_uid?:string,
   * target_uin?:string,
   * vote_count:number
   * }} options - uid 或者 uin 任选其一提供
   * @param options.target_uid - 目标用户的 uid
   * @param options.target_uin - 目标用户的 uin
   * @param options.vote_count - 点赞数
   * @returns {Promise<null>} - 点赞的响应
   */
  async VoteUser (options) {
    const service = 'FriendService'
    const cmd = 'VoteUser'
    const type = 'friend'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 根据 uin 获取 uid
   * @param {Array<number>} [target_uins] - 目标用户的 uin 数组
   * @returns {Promise<{uid_map:Map<number, string>}>} - 获取到的 uid 映射表
   */
  async GetUidByUin (target_uins) {
    const service = 'FriendService'
    const cmd = 'GetUidByUin'
    const type = 'friend'
    const buf = { target_uins }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 根据 uid 获取 uin
   * @param {Array<string>} [target_uids] - 目标用户的 uid 数组
   * @returns {Promise<{uin_map:Map<string, number>}>} - 获取到的 uin 映射表
   */
  async GetUinByUid (target_uids) {
    const service = 'FriendService'
    const cmd = 'GetUinByUid'
    const type = 'friend'
    const buf = { target_uids }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  // ============群组服务=============
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
    const service = 'GroupService'
    const cmd = 'BanMember'
    const type = 'group'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 戳一戳用户头像
   * @param {Object} options - 戳一戳选项
   * @param {string} options.group_id - 群组ID
   * @param {string} [options.target_uid]  - 被戳一戳目标的 uid 任选其一
   * @param {string} [options.target_uin]  - 被戳一戳目标的 uin 任选其一
   * @returns {Promise<PokeMemberResponse>} - 戳一戳操作的响应
   */
  async PokeMember (options) {
    const service = 'GroupService'
    const cmd = 'PokeMember'
    const type = 'group'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
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
    const service = 'GroupService'
    const cmd = 'KickMember'
    const type = 'group'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 退出群组
   * @param {number} group_id - 群组ID
   * @returns {Promise<LeaveGroupResponse>} - 退出群组操作的响应
   */
  async LeaveGroup (group_id) {
    const service = 'GroupService'
    const cmd = 'LeaveGroup'
    const type = 'group'
    const buf = { group_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
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
    const service = 'GroupService'
    const cmd = 'ModifyMemberCard'
    const type = 'group'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 修改群名称
   * @param {number} group_id - 群组ID
   * @param {string} group_name - 新的群名称
   * @returns {Promise<ModifyGroupNameResponse>} - 修改群名称操作的响应
   */
  async ModifyGroupName (group_id, group_name) {
    const service = 'GroupService'
    const cmd = 'ModifyGroupName'
    const type = 'group'
    const buf = { group_id, group_name }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 修改群备注
   * @param {number} group_id - 群组ID
   * @param {string} remark - 新的群备注
   * @returns {Promise<ModifyGroupRemarkResponse>} - 修改群备注操作的响应
   */
  async ModifyGroupRemark (group_id, remark) {
    const service = 'GroupService'
    const cmd = 'ModifyGroupRemark'
    const type = 'group'
    const buf = { group_id, remark }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
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
    const service = 'GroupService'
    const cmd = 'SetGroupAdmin'
    const type = 'group'
    const buf = options
    /** @type {SetGroupAdminResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 设置群头衔
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
    const service = 'GroupService'
    const cmd = 'SetGroupUniqueTitle'
    const type = 'group'
    const buf = options
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 设置全员禁言
   * @param {number} group_id - 群组ID
   * @param {boolean} is_ban - 是否全员禁言
   * @returns {Promise<SetGroupWholeBanResponse>} - 设置全员禁言操作的响应
   */
  async SetGroupWholeBan (group_id, is_ban) {
    const service = 'GroupService'
    const cmd = 'SetGroupWholeBan'
    const type = 'group'
    const buf = { group_id, is_ban }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 获取群信息
   * @param {number} group_id - 群组ID
   * @param {boolean?} no_cache
   * @returns {Promise<IGroupInfo>} - 获取群信息操作的响应
   */
  async GetGroupInfo (group_id, no_cache = false) {
    const service = 'GroupService'
    const cmd = 'GetGroupInfo'
    const type = 'group'
    const buf = { group_id }
    /** @type {GetGroupInfoResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.group_info
  }

  /**
   * 获取群列表
   * @param {boolean} [refresh] - 是否刷新缓存
   * @returns {Promise<IGroupInfo[]>} - 获取群列表操作的响应
   */
  async GetGroupList (refresh) {
    const service = 'GroupService'
    const cmd = 'GetGroupList'
    const type = 'group'
    const buf = { refresh }
    /** @type {GetGroupListResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.groups_info
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
    const service = 'GroupService'
    const cmd = 'GetGroupMemberInfo'
    const type = 'group'
    const buf = options
    /** @type {GetGroupMemberInfoResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.group_member_info
  }

  /**
   * 获取群成员列表
   * @param {Object} options - 获取成员列表选项
   * @param {number} options.group_id - 群组ID
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupMemberInfo[]>} - 获取群成员列表操作的响应
   */
  async GetGroupMemberList (options) {
    const service = 'GroupService'
    const cmd = 'GetGroupMemberList'
    const type = 'group'
    const buf = {
      group_id: options.group_id,
      refresh: options.refresh || false,
    }
    /** @type {GetGroupMemberListResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.group_members_info
  }

  /**
   * 获取禁言用户列表
   * @param {number} group_id - 群组ID
   * @returns {Promise<GetProhibitedUserListResponse>} - 获取禁言用户列表操作的响应
   */
  async GetProhibitedUserList (group_id) {
    const service = 'GroupService'
    const cmd = 'GetProhibitedUserList'
    const type = 'group'
    const buf = { group_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 获取艾特全体成员剩余次数
   * @param {number} group_id - 群组ID
   * @returns {Promise<GetRemainCountAtAllResponse>} - 获取艾特全体成员剩余次数操作的响应
   */
  async GetRemainCountAtAll (group_id) {
    const service = 'GroupService'
    const cmd = 'GetRemainCountAtAll'
    const type = 'group'
    const buf = { group_id }
    const res = await this.Serialization(service, cmd, type, buf)
    return res
  }

  /**
   * 获取未加入群组信息
   * @param {number} group_id - 群号
   * @returns {Promise<INotJoinedGroupInfo>} - 获取未加入群组信息操作的响应
   */
  async GetNotJoinedGroupInfo (group_id) {
    const service = 'GroupService'
    const cmd = 'GetNotJoinedGroupInfo'
    const type = 'group'
    const buf = { group_id }
    /** @type {GetNotJoinedGroupInfoResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.group_info
  }

  /**
   * 获取群荣誉信息
   * @param {Object} options - 获取群荣誉信息选项
   * @param {number} options.group_id - 群号
   * @param {boolean} [options.refresh] - 是否刷新缓存
   * @returns {Promise<IGroupHonorInfo[]>} - 获取群荣誉信息操作的响应
   */
  async get_group_honor_info (options) {
    const service = 'GroupService'
    const cmd = 'GetGroupHonor'
    const type = 'group'
    const buf = {
      group_id: options.group_id,
      refresh: options.refresh || false,
    }
    /** @type {GetGroupHonorResponse} **/
    const res = await this.Serialization(service, cmd, type, buf)
    return res.group_honors_info
  }

  /**
   * 序列化请求后发送请求，并反序列化响应
   * @param {string} service - 服务名
   * @param {string} cmd - 命令名
   * @param {string} type - 类型
   * @param {object} buf - 请求参数
   * @returns {Promise<object>}
   */
  async Serialization (service, cmd, type, buf) {
    let data = this.encode(service, cmd, type, buf)
    data = await this.SendApi(data.cmd, data.buf)
    const res = this.decode(cmd, type, data.buf)
    return res
  }

  /**
   * 发送Api请求
   * @param {string} cmd - 命令
   * @param {protobuf} buf - 请求参数
   * @param {number} time - 请求超时时间 默认10s
   * @returns {Promise<protobuf>}
   */
  SendApi (cmd, buf, time) {
    if (!time) time = this.config.timeout('grpc')
    const seq = this.seq
    /** 立刻自增防止并发导致重复的seq... */
    this.seq++
    const params = { cmd, seq, buf }
    this.grpc.write(params)
    return new Promise((resolve, reject) => {
      const listener = (data) => {
        data.code === 'SUCCESS' ? resolve(data) : resolve(data)
        this.removeListener(seq, listener)
      }

      listener.once(seq, listener)

      /** 超时 */
      setTimeout(() => {
        this.removeListener(seq, listener)
        reject(new Error('超时未响应...'))
      }, time * 1000)
    })
  }
}
