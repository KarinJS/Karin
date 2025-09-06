import { EventEmitter } from 'node:events'
import { OneBotMessageApiAction } from '../api'
import { OneBotFriendApiAction } from '../api/friend'
import { OneBotGroupApiAction } from '../api/group'
import { OneBotFileApiAction } from '../api/file'
import { OneBotBotApiAction } from '../api/bot'
import { OneBotOtherApiAction } from '../api/other'
import { EventPostType } from '../event'
import { OneBotEventKey, OneBotOnEvent } from '../ws/events'

import type { OneBotApi } from '../api'
import type { OneBotMessage, NodeMessage } from '../message'
import type { OneBotWsEvent, OneBotEvent, Echo } from '../event'

/**
 * OneBot核心类
 * @extends EventEmitter
 */
export abstract class OneBotCore extends EventEmitter {
  /** 是否主动关闭 */
  _manualClosed: boolean = false
  /** 协议信息 */
  protocol: {
    /** 协议名称 例如`NapCat` */
    name: string
    /** 协议版本 */
    version: string
    /** 协议连接时间 */
    connectTime: number
  }

  /** 机器人信息 */
  self: {
    /** 机器人ID */
    id: number
    /** 机器人昵称 */
    nickname: string
    /** 机器人头像 */
    avatar: string
  }

  /** 配置 */
  _options: {
    timeout: number
  }

  constructor (options?: {
    timeout?: number
  }) {
    super()

    this.protocol = {
      name: 'OneBot',
      version: '0.0.0',
      connectTime: Date.now(),
    }

    this._options = {
      ...options,
      timeout: options?.timeout || 120 * 1000,
    }

    this.self = {
      id: 0,
      nickname: '',
      avatar: '',
    }
  }

  /**
   * 判断是否为echo事件
   * @param data - 事件数据
   */
  isEcho (data: OneBotWsEvent): data is Echo {
    return 'echo' in data && 'status' in data
  }

  /**
   * 将`base64://`转为`base64://...`
   */
  _formatBase64 (base64: string) {
    return base64.replace(/(["']?(?:base64|base):\/\/)[^"',}\s]*["']?/g, '$1...')
  }

  /**
   * 格式化API动作
   * @param action - API动作
   * @returns 格式化后的API动作
   */
  _formatAction (action: string) {
    return action.replace(/^(|nc_|lgl_)/, '')
  }

  /**
   * 格式化Api返回错误
   */
  _formatApiError (
    action: string,
    params: string,
    error: unknown
  ) {
    return new Error([
      `[${this.self_id}][sendApi] 请求错误:`,
      `  action: ${action}`,
      `  params: ${this._formatBase64(params)}`,
    ].join('\n'), { cause: error }
    )
  }

  /**
   * 初始化Bot基本信息
   * @param maxRetries - 最大重试次数
   * @param retryInterval - 重试间隔(毫秒)
   * @returns 是否初始化成功
   */
  async _initBotInfo (maxRetries: number = 3, retryInterval: number = 1000) {
    const fetchBotInfo = async (): Promise<void> => {
      /** 获取账号信息 */
      const { user_id, nickname } = await this.getLoginInfo()
      this.self.id = user_id
      this.self.nickname = nickname
      this.self.avatar = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`

      /** 获取协议信息 */
      const { app_name, app_version } = await this.getVersionInfo()
      this.protocol.name = app_name
      this.protocol.version = app_version
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        await fetchBotInfo()
        return true
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error(`初始化Bot信息失败，已重试${maxRetries}次`, { cause: error })
        }
        await new Promise(resolve => setTimeout(resolve, retryInterval))
      }
    }

    return false
  }

  /**
 * 添加事件监听
 * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
 * @param listener - 事件监听器
 */
  on<K extends keyof OneBotOnEvent> (event: K, listener: (arg: OneBotOnEvent[K]) => void) {
    return super.on(event, listener)
  }

  /**
   * 添加一次性事件监听
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @param listener - 事件监听器
   */
  once<K extends keyof OneBotOnEvent> (event: K, listener: (arg: OneBotOnEvent[K]) => void) {
    return super.once(event, listener)
  }

  /**
   * 触发事件
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @param arg - 事件参数
   */
  emit<K extends keyof OneBotOnEvent> (event: K, arg: OneBotOnEvent[K] = {} as OneBotOnEvent[K]) {
    return super.emit(event, arg)
  }

  /**
   * 移除事件监听
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @param listener - 事件监听器
   */
  off<K extends keyof OneBotOnEvent> (event: K, listener: (arg: OneBotOnEvent[K]) => void) {
    return super.off(event, listener)
  }

  /**
   * 移除事件监听
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @param listener - 事件监听器
   */
  removeListener<K extends keyof OneBotOnEvent> (event: K, listener: (arg: OneBotOnEvent[K]) => void) {
    return super.removeListener(event, listener)
  }

  /**
   * 移除所有事件监听
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   */
  removeAllListeners<K extends keyof OneBotOnEvent> (event?: K) {
    return super.removeAllListeners(event)
  }

  /**
   * 获取事件监听器
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @returns 事件监听器
   */
  listeners<K extends keyof OneBotOnEvent> (event: K) {
    return super.listeners(event)
  }

  /**
   * 获取事件监听器数量
   * @param event - 事件名称 请导入`OneBotEventKey`枚举使用
   * @returns 事件监听器数量
   */
  listenerCount<K extends keyof OneBotOnEvent> (event: K) {
    return super.listenerCount(event)
  }

  /** 机器人ID */
  get self_id () {
    return this.self.id
  }

  /**
   * 初始化
   */
  async init () {
    throw new Error('Not implemented')
  }

  /**
   * 事件分发
   * @param data - 事件数据
   */
  _dispatch (data: OneBotEvent) {
    this.emit(OneBotEventKey.EVENT, data)

    if (data.post_type === EventPostType.Message) {
      this.emit(OneBotEventKey.MESSAGE, data)
      return
    }

    if (data.post_type === EventPostType.MessageSent) {
      this.emit(OneBotEventKey.MESSAGE_SENT, data)
      return
    }

    if (data.post_type === EventPostType.Notice) {
      this.emit(OneBotEventKey.NOTICE, data)
      return
    }

    if (data.post_type === EventPostType.Request) {
      this.emit(OneBotEventKey.REQUEST, data)
      return
    }

    if (data.post_type === EventPostType.MetaEvent) {
      this.emit(OneBotEventKey.META_EVENT, data)
      return
    }

    throw new Error(`[OneBot][WebSocket] 未知事件类型: ${JSON.stringify(data)}`)
  }

  /**
   * 发送API请求
   * @param action - API动作
   * @param params - API参数
   * @param timeout - 超时时间
   * @returns
   */
  async sendApi<T extends keyof OneBotApi> (
    _action: T,
    _params: OneBotApi[T]['params'],
    _timeout: number = this._options.timeout
  ): Promise<OneBotApi[T]['response']> {
    throw new Error('Not implemented')
  }

  /**
   * 发送消息
   * @param message_type - 消息类型
   * @param user_id - 用户ID
   * @param message - 消息
   * @returns 消息ID
   */
  async sendMsg (
    message_type: 'private' | 'group',
    user_id: number,
    message: OneBotMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendMsg, {
      message_type,
      user_id,
      message,
      auto_escape: false,
    })
  }

  /**
   * 发送私聊消息
   * @param user_id - 用户ID
   * @param message - 消息
   * @returns 消息ID
   */
  async sendPrivateMsg (
    user_id: number,
    message: OneBotMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendPrivateMsg, {
      user_id,
      message,
      auto_escape: false,
    })
  }

  /**
   * 发送群消息
   * @param group_id - 群ID
   * @param message - 消息
   * @returns 消息ID
   */
  async sendGroupMsg (
    group_id: number,
    message: OneBotMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendGroupMsg, {
      group_id,
      message,
      auto_escape: false,
    })
  }

  /**
   * 撤回消息
   * @param message_id - 消息ID
   * @returns
   */
  async deleteMsg (
    message_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.deleteMsg, {
      message_id,
    })
  }

  /**
   * 获取消息
   * @param message_id - 消息ID
   * @returns 消息详情
   */
  async getMsg (
    message_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.getMsg, {
      message_id,
    })
  }

  /**
   * 获取合并转发消息
   * @param id - 合并转发ID
   * @returns 合并转发消息
   */
  async getForwardMsg (
    id: string
  ) {
    return this.sendApi(OneBotMessageApiAction.getForwardMsg, {
      id,
    })
  }

  /**
   * 设置消息表情回应
   * @param message_id - 消息ID
   * @param emoji_id - 表情ID
   * @param set - 设置或取消
   * @returns 操作结果
   */
  async setMessageReaction (
    message_id: number,
    emoji_id: string,
    set: boolean
  ) {
    return this.sendApi(OneBotMessageApiAction.setMessageReaction, {
      message_id,
      emoji_id,
      set,
    })
  }

  /**
   * NapCat扩展: 获取消息的表情已回应列表
   * @param message_id - 消息ID
   * @param user_id - 用户ID
   * @param emojiType - 表情类型
   * @param count - 数量
   * @returns 表情回应列表
   */
  async nc_fetchEmojiLike (
    message_id: number,
    user_id: number,
    emojiType: number,
    count?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_fetchEmojiLike, {
      message_id,
      user_id,
      emojiType,
      count,
    })
  }

  /**
   * Lagrange扩展: 加入群聊表情接龙
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @param emoji_id - 表情ID
   * @returns
   */
  async lgl_joinGroupEmojiChain (
    group_id: number,
    message_id: number,
    emoji_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_joinGroupEmojiChain, {
      group_id,
      message_id,
      emoji_id,
    })
  }

  /**
   * Lagrange扩展: 加入好友表情接龙
   * @param user_id - 用户ID
   * @param message_id - 消息ID
   * @param emoji_id - 表情ID
   * @returns
   */
  async lgl_joinFriendEmojiReaction (
    user_id: number,
    message_id: number,
    emoji_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_joinFriendEmojiReaction, {
      user_id,
      message_id,
      emoji_id,
    })
  }

  /**
   * Lagrange扩展: 调用群机器人回调
   * @param group_id - 群ID
   * @param bot_id - 机器人ID
   * @param data_1 - 数据1
   * @param data_2 - 数据2
   * @returns 机器人Uin
   */
  async lgl_sendGroupBotCallback (
    group_id: number,
    bot_id: number,
    data_1: string,
    data_2: string
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_sendGroupBotCallback, {
      group_id,
      bot_id,
      data_1,
      data_2,
    })
  }

  /**
   * NapCat扩展: 标记私聊消息为已读
   * @param user_id - 用户ID
   * @param message_id - 消息ID
   * @returns
   */
  async nc_markPrivateMsgAsRead (
    user_id?: number,
    message_id?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_markPrivateMsgAsRead, {
      user_id,
      message_id,
    })
  }

  /**
   * NapCat扩展: 标记群消息为已读
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @returns
   */
  async nc_markGroupMsgAsRead (
    group_id?: number,
    message_id?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_markGroupMsgAsRead, {
      group_id,
      message_id,
    })
  }

  /**
   * NapCat扩展: 标记所有消息为已读
   * @returns
   */
  async nc_markAllAsRead () {
    return this.sendApi(OneBotMessageApiAction.nc_markAllAsRead, {})
  }

  /**
   * NapCat扩展: 转发好友单条消息
   * @param user_id - 用户ID
   * @param message_id - 消息ID
   * @returns
   */
  async nc_forwardFriendSingleMsg (
    user_id: number,
    message_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_forwardFriendSingleMsg, {
      user_id,
      message_id,
    })
  }

  /**
   * NapCat扩展: 转发群单条消息
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @returns
   */
  async nc_forwardGroupSingleMsg (
    group_id: number,
    message_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_forwardGroupSingleMsg, {
      group_id,
      message_id,
    })
  }

  /**
   * GoCQ扩展: 发送合并转发消息
   * @param messages - 消息节点列表
   * @returns 消息ID
   */
  async sendForwardMsg (
    messages: NodeMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendForwardMsg, {
      messages,
    })
  }

  /**
   * GoCQ扩展: 发送合并转发(群聊)
   * @param group_id - 群ID
   * @param messages - 消息节点列表
   * @returns 消息ID
   */
  async sendGroupForwardMsg (
    group_id: number,
    messages: NodeMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendGroupForwardMsg, {
      group_id,
      messages,
    })
  }

  /**
   * GoCQ扩展: 发送合并转发(好友)
   * @param user_id - 用户ID
   * @param messages - 消息节点列表
   * @returns 消息ID
   */
  async sendPrivateForwardMsg (
    user_id: number,
    messages: NodeMessage[]
  ) {
    return this.sendApi(OneBotMessageApiAction.sendPrivateForwardMsg, {
      user_id,
      messages,
    })
  }

  /**
   * GoCQ扩展: 获取群消息历史记录
   * @param group_id - 群ID
   * @param message_seq - 起始消息序号
   * @param count - 获取消息条数 (扩展)
   * @returns 消息历史记录
   */
  async getGroupMsgHistory (
    group_id: number,
    message_seq: number,
    count?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.getGroupMsgHistory, {
      group_id,
      message_seq,
      count,
    })
  }

  /**
   * NapCat扩展: 获取群消息历史记录
   * @param group_id - 群ID
   * @param message_seq - 起始消息序列号
   * @param count - 获取消息条数 (扩展)
   * @param reverse - 是否倒序 (扩展)
   * @returns 消息历史记录
   */
  async nc_getGroupMsgHistory (
    group_id: number,
    message_seq: number,
    count?: number,
    /** 是否倒序 可选 默认false */
    reverse?: boolean
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_getGroupMsgHistory, {
      group_id,
      message_seq,
      count,
      reverse,
    })
  }

  /**
   * Lagrange扩展: 获取群消息历史记录
   * @param group_id - 群ID
   * @param message_id - 起始消息ID
   * @param count - 获取消息条数 (扩展)
   * @returns 消息历史记录
   */
  async lgl_getGroupMsgHistory (
    group_id: number,
    message_id: number,
    count?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_getGroupMsgHistory, {
      group_id,
      message_id,
      count,
    })
  }

  /**
   * NapCat扩展: 获取好友消息历史记录
   * @param user_id - 用户ID
   * @param message_seq - 起始消息序列号
   * @param count - 获取消息条数 (扩展)
   * @param reverse - 是否倒序 (扩展)
   * @returns 消息历史记录
   */
  async nc_getFriendMsgHistory (
    user_id: number,
    message_seq: number,
    count?: number,
    /** 是否倒序 可选 默认false */
    reverse?: boolean
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_getFriendMsgHistory, {
      user_id,
      message_seq,
      count,
      reverse,
    })
  }

  /**
   * Lagrange扩展: 获取好友消息历史记录
   * @param user_id - 用户ID
   * @param message_id - 起始消息ID
   * @param count - 获取消息条数 (扩展)
   * @returns 消息历史记录
   */
  async lgl_getFriendMsgHistory (
    user_id: number,
    message_id: number,
    count?: number
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_getFriendMsgHistory, {
      user_id,
      message_id,
      count,
    })
  }

  /**
   * 获取 Ai 声色列表
   * @returns Ai声色列表
   */
  async getAiCharacters () {
    return this.sendApi(OneBotMessageApiAction.getAiCharacters, {})
  }

  /**
   * 发送群 Ai 语音
   * @param group_id - 群ID
   * @param text - 文本内容
   * @param character_id - 角色ID
   * @returns 消息ID
   */
  async sendGroupAiRecord (
    group_id: number,
    text: string,
    character_id: string
  ) {
    return this.sendApi(OneBotMessageApiAction.sendGroupAiRecord, {
      group_id,
      text,
      character_id,
    })
  }

  /**
   * Lagrange扩展: 标记消息为已读
   * @param message_id - 消息ID
   * @returns
   */
  async lgl_markMsgAsRead (
    message_id: number
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_markMsgAsRead, {
      message_id,
    })
  }

  /**
   * Lagrange扩展: 给消息添加表情回应
   * @param group_id - 群ID
   * @param message_id - 消息ID
   * @param code - 表情ID
   * @param is_add - 是否为添加
   * @returns
   */
  async lgl_setGroupReaction (
    group_id: number,
    message_id: number,
    code: string,
    is_add: boolean
  ) {
    return this.sendApi(OneBotMessageApiAction.lgl_setGroupReaction, {
      group_id,
      message_id,
      code,
      is_add,
    })
  }

  /**
   * NapCat扩展: 给消息添加表情回应
   * @param message_id - 消息ID
   * @param emoji_id - 表情ID
   * @param set - 设置或取消
   * @returns 操作结果
   */
  async nc_setMsgEmojiLike (
    message_id: number,
    emoji_id: string,
    set: boolean
  ) {
    return this.sendApi(OneBotMessageApiAction.nc_setMsgEmojiLike, {
      message_id,
      emoji_id,
      set,
    })
  }

  /**
   * 发送好友赞
   * @param user_id - 用户ID
   * @param times - 赞的次数
   */
  async sendLike (
    user_id: number,
    times?: number
  ) {
    return this.sendApi(OneBotFriendApiAction.sendLike, {
      user_id,
      times,
    })
  }

  /**
   * 处理加好友请求
   * @param flag - 请求标识
   * @param approve - 是否同意
   * @param remark - 备注
   */
  async setFriendAddRequest (
    flag: string,
    approve: boolean,
    remark?: string
  ) {
    return this.sendApi(OneBotFriendApiAction.setFriendAddRequest, {
      flag,
      approve,
      remark,
    })
  }

  /**
   * Lagrange扩展: 处理加好友请求
   * @param flag - 请求标识
   * @param approve - 是否同意
   * @param reason - 理由
   */
  async lgl_setFriendAddRequest (
    flag: string,
    approve: boolean,
    reason?: string
  ) {
    return this.sendApi(OneBotFriendApiAction.lgl_setFriendAddRequest, {
      flag,
      approve,
      reason,
    })
  }

  /**
   * 获取陌生人信息
   * @param user_id - 用户ID
   * @param no_cache - 是否不使用缓存
   */
  async getStrangerInfo (
    user_id: number,
    no_cache?: boolean
  ) {
    return this.sendApi(OneBotFriendApiAction.getStrangerInfo, {
      user_id,
      no_cache,
    })
  }

  /**
   * NapCat扩展: 获取陌生人信息
   * @param user_id - 用户ID
   */
  async nc_getStrangerInfo (
    user_id: number
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_getStrangerInfo, {
      user_id,
    })
  }

  /**
   * 获取好友列表
   */
  async getFriendList () {
    return this.sendApi(OneBotFriendApiAction.getFriendList, {})
  }

  /**
   * NapCat扩展: 获取好友列表
   * @param no_cache - 是否不使用缓存
   */
  async nc_getFriendList (
    no_cache?: boolean
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_getFriendList, {
      no_cache,
    })
  }

  /**
   * Lagrange扩展: 获取好友列表
   */
  async lgl_getFriendList () {
    return this.sendApi(OneBotFriendApiAction.lgl_getFriendList, {})
  }

  /**
   * GoCQ扩展: 获取单向好友列表
   */
  async getUnidirectionalFriendList () {
    return this.sendApi(OneBotFriendApiAction.getUnidirectionalFriendList, {})
  }

  /**
   * NapCat扩展: 获取单向好友列表
   */
  async nc_getUnidirectionalFriendList () {
    return this.sendApi(OneBotFriendApiAction.nc_getUnidirectionalFriendList, {})
  }

  /**
   * GoCQ扩展: 删除好友
   * @param user_id - 用户ID
   */
  async deleteFriend (
    user_id: number
  ) {
    return this.sendApi(OneBotFriendApiAction.deleteFriend, {
      user_id,
    })
  }

  /**
   * NapCat扩展: 删除好友
   * @param user_id - 用户ID
   * @param friend_id - 好友ID
   * @param temp_block - 临时拉黑
   * @param temp_both_del - 临时双向删除
   */
  async nc_deleteFriend (
    user_id: number,
    friend_id?: number,
    temp_block?: boolean,
    temp_both_del?: boolean
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_deleteFriend, {
      user_id,
      friend_id,
      temp_block,
      temp_both_del,
    })
  }

  /**
   * Lagrange扩展: 删除好友
   * @param user_id - 用户ID
   * @param block - 是否拉黑
   */
  async lgl_deleteFriend (
    user_id: number,
    block: boolean
  ) {
    return this.sendApi(OneBotFriendApiAction.lgl_deleteFriend, {
      user_id,
      block,
    })
  }

  /**
   * GoCQ扩展: 删除单向好友
   * @param user_id - 用户ID
   */
  async deleteUnidirectionalFriend (
    user_id: number
  ) {
    return this.sendApi(OneBotFriendApiAction.deleteUnidirectionalFriend, {
      user_id,
    })
  }

  /**
   * NapCat扩展: 设置好友备注
   * @param user_id - 用户ID
   * @param remark - 备注
   */
  async nc_setFriendRemark (
    user_id: number,
    remark: string
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_setFriendRemark, {
      user_id,
      remark,
    })
  }

  /**
   * NapCat扩展: 获取分类的好友列表
   */
  async nc_getFriendsWithCategory () {
    return this.sendApi(OneBotFriendApiAction.nc_getFriendsWithCategory, {})
  }

  /**
   * NapCat扩展: 获取可疑好友请求
   */
  async nc_getDoubtFriendsAddRequest () {
    return this.sendApi(OneBotFriendApiAction.nc_getDoubtFriendsAddRequest, {})
  }

  /**
   * NapCat扩展: 处理可疑好友请求
   * @param request_id - 请求ID
   * @param approve - 是否同意
   */
  async nc_setDoubtFriendsAddRequest (
    request_id: string,
    approve: boolean
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_setDoubtFriendsAddRequest, {
      request_id,
      approve,
    })
  }

  /**
   * NapCat扩展: 好友戳一戳
   * @param user_id - 用户ID
   * @param target_id - 目标ID
   */
  async nc_friendPoke (
    user_id?: number,
    target_id?: number
  ) {
    return this.sendApi(OneBotFriendApiAction.nc_friendPoke, {
      user_id,
      target_id,
    })
  }

  /**
   * 群组踢人
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param reject_add_request - 是否拒绝再次加群
   */
  async setGroupKick (
    group_id: number,
    user_id: number,
    reject_add_request?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupKick, {
      group_id,
      user_id,
      reject_add_request,
    })
  }

  /**
   * 群组单人禁言
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param duration - 禁言时长
   */
  async setGroupBan (
    group_id: number,
    user_id: number,
    duration?: number
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupBan, {
      group_id,
      user_id,
      duration,
    })
  }

  /**
   * 群组匿名用户禁言
   * @param group_id - 群ID
   * @param anonymous - 匿名对象
   * @param flag - 匿名标识
   * @param duration - 禁言时长
   */
  async setGroupAnonymousBan (
    group_id: number,
    anonymous?: { id: number; name: string; flag: string },
    flag?: string,
    duration?: number
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupAnonymousBan, {
      group_id,
      anonymous,
      flag,
      duration,
    })
  }

  /**
   * 群组全员禁言
   * @param group_id - 群ID
   * @param enable - 是否启用
   */
  async setGroupWholeBan (
    group_id: number,
    enable?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupWholeBan, {
      group_id,
      enable,
    })
  }

  /**
   * 群组设置管理员
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param enable - 是否设置为管理员
   */
  async setGroupAdmin (
    group_id: number,
    user_id: number,
    enable?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupAdmin, {
      group_id,
      user_id,
      enable,
    })
  }

  /**
   * 群组匿名
   * @param group_id - 群ID
   * @param enable - 是否启用
   */
  async setGroupAnonymous (
    group_id: number,
    enable?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupAnonymous, {
      group_id,
      enable,
    })
  }

  /**
   * 设置群名片（群备注）
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param card - 名片
   */
  async setGroupCard (
    group_id: number,
    user_id: number,
    card?: string
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupCard, {
      group_id,
      user_id,
      card,
    })
  }

  /**
   * 设置群名
   * @param group_id - 群ID
   * @param group_name - 群名
   */
  async setGroupName (
    group_id: number,
    group_name: string
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupName, {
      group_id,
      group_name,
    })
  }

  /**
   * 退出群组
   * @param group_id - 群ID
   * @param is_dismiss - 是否解散
   */
  async setGroupLeave (
    group_id: number,
    is_dismiss?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupLeave, {
      group_id,
      is_dismiss,
    })
  }

  /**
   * Lagrange扩展: 退出群组
   * @param group_id - 群ID
   */
  async lgl_setGroupLeave (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.lgl_setGroupLeave, {
      group_id,
    })
  }

  /**
   * 设置群组专属头衔
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param special_title - 头衔
   * @param duration - 时长
   */
  async setGroupSpecialTitle (
    group_id: number,
    user_id: number,
    special_title?: string,
    duration?: number
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupSpecialTitle, {
      group_id,
      user_id,
      special_title,
      duration,
    })
  }

  /**
   * 获取群信息
   * @param group_id - 群ID
   * @param no_cache - 是否不使用缓存
   */
  async getGroupInfo (
    group_id: number,
    no_cache?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupInfo, {
      group_id,
      no_cache,
    })
  }

  /**
   * 获取群列表
   */
  async getGroupList () {
    return this.sendApi(OneBotGroupApiAction.getGroupList, {})
  }

  /**
   * 获取群成员信息
   * @param group_id - 群ID
   * @param user_id - 用户ID
   * @param no_cache - 是否不使用缓存
   */
  async getGroupMemberInfo (
    group_id: number,
    user_id: number,
    no_cache?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupMemberInfo, {
      group_id,
      user_id,
      no_cache,
    })
  }

  /**
   * 获取群成员列表
   * @param group_id - 群ID
   * @param no_cache - 是否不使用缓存
   */
  async getGroupMemberList (
    group_id: number,
    no_cache?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupMemberList, {
      group_id,
      no_cache,
    })
  }

  /**
   * 获取群荣誉信息
   * @param group_id - 群ID
   * @param type - 荣誉类型
   */
  async getGroupHonorInfo (
    group_id: number,
    type: string
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupHonorInfo, {
      group_id,
      type,
    })
  }

  /**
   * 处理加群请求/邀请
   * @param flag - 请求标识
   * @param sub_type - 类型
   * @param approve - 是否同意
   * @param reason - 理由
   */
  async setGroupAddRequest (
    flag: string,
    sub_type: 'add' | 'invite',
    approve: boolean,
    reason?: string
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupAddRequest, {
      flag,
      sub_type,
      approve,
      reason,
    })
  }

  /**
   * GoCQ拓展: 设置群头像
   * @param group_id - 群ID
   * @param file - 文件
   * @param cache - 缓存
   */
  async setGroupPortrait (
    group_id: number,
    file: string,
    cache?: number
  ) {
    return this.sendApi(OneBotGroupApiAction.setGroupPortrait, {
      group_id,
      file,
      cache,
    })
  }

  /**
   * GoCQ拓展: 设置精华消息
   * @param message_id - 消息ID
   */
  async setEssenceMsg (
    message_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.setEssenceMsg, {
      message_id,
    })
  }

  /**
   * GoCQ拓展: 移出精华消息
   * @param message_id - 消息ID
   */
  async deleteEssenceMsg (
    message_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.deleteEssenceMsg, {
      message_id,
    })
  }

  /**
   * GoCQ拓展: 获取精华消息列表
   * @param group_id - 群ID
   */
  async getEssenceMsgList (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.getEssenceMsgList, {
      group_id,
    })
  }

  /**
   * GoCQ拓展: 群打卡
   * @param group_id - 群ID
   */
  async sendGroupSign (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.sendGroupSign, {
      group_id,
    })
  }

  /**
   * GoCQ拓展: 获取群公告
   * @param group_id - 群ID
   */
  async getGroupNotice (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupNotice, {
      group_id,
    })
  }

  /**
   * GoCQ拓展: 发送群公告
   * @param group_id - 群ID
   * @param content - 内容
   * @param image - 图片
   */
  async sendGroupNotice (
    group_id: number,
    content: string,
    image?: string
  ) {
    return this.sendApi(OneBotGroupApiAction.sendGroupNotice, {
      group_id,
      content,
      image,
    })
  }

  /**
   * GoCQ拓展: 删除群公告
   * @param group_id - 群ID
   * @param notice_id - 公告ID
   */
  async delGroupNotice (
    group_id: number,
    notice_id: string
  ) {
    return this.sendApi(OneBotGroupApiAction.delGroupNotice, {
      group_id,
      notice_id,
    })
  }

  /**
   * GoCQ拓展: 获取群系统消息
   */
  async getGroupSystemMsg () {
    return this.sendApi(OneBotGroupApiAction.getGroupSystemMsg, {})
  }

  /**
   * GoCQ拓展: 获取群@全体成员剩余次数
   * @param group_id - 群ID
   */
  async getGroupAtAllRemain (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.getGroupAtAllRemain, {
      group_id,
    })
  }

  /**
   * Lagrange拓展: 设置群Bot发言状态
   * @param group_id - 群ID
   * @param status - 状态
   */
  async lgl_setGroupBotStatus (
    group_id: number,
    status: 'normal' | 'readonly'
  ) {
    return this.sendApi(OneBotGroupApiAction.lgl_setGroupBotStatus, {
      group_id,
      status,
    })
  }

  /**
   * NapCat拓展: 群组踢多人
   * @param group_id - 群ID
   * @param user_ids - 用户ID数组
   * @param reject_add_request - 是否拒绝再次加群
   */
  async nc_setGroupKickMembers (
    group_id: number,
    user_ids: number[],
    reject_add_request?: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_setGroupKickMembers, {
      group_id,
      user_ids,
      reject_add_request,
    })
  }

  /**
   * NapCat拓展: 设置机器人进群选项
   * @param group_id - 群ID
   * @param option - 选项
   */
  async nc_setGroupRobotAddOption (
    group_id: number,
    option: 'ignore' | 'discuss' | 'agree' | 'reject'
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_setGroupRobotAddOption, {
      group_id,
      option,
    })
  }

  /**
   * NapCat拓展: 设置群添加选项
   * @param group_id - 群ID
   * @param option - 选项
   */
  async nc_setGroupAddOption (
    group_id: number,
    option: 'ignore' | 'discuss' | 'agree' | 'reject'
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_setGroupAddOption, {
      group_id,
      option,
    })
  }

  /**
   * NapCat拓展: 设置群搜索
   * @param group_id - 群ID
   * @param enable - 是否启用
   */
  async nc_setGroupSearch (
    group_id: number,
    enable: boolean
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_setGroupSearch, {
      group_id,
      enable,
    })
  }

  /**
   * NapCat拓展: 设置群备注
   * @param group_id - 群ID
   * @param remark - 备注
   */
  async nc_setGroupRemark (
    group_id: number,
    remark: string
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_setGroupRemark, {
      group_id,
      remark,
    })
  }

  /**
   * NapCat拓展: 群内戳一戳
   * @param group_id - 群ID
   * @param user_id - 用户ID
   */
  async nc_groupPoke (
    group_id: number,
    user_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_groupPoke, {
      group_id,
      user_id,
    })
  }

  /**
   * NapCat拓展: 获取群信息扩展
   * @param group_id - 群ID
   */
  async nc_getGroupInfoEx (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_getGroupInfoEx, {
      group_id,
    })
  }

  /**
   * NapCat拓展: 获取群详细信息
   * @param group_id - 群ID
   */
  async nc_getGroupDetailInfo (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_getGroupDetailInfo, {
      group_id,
    })
  }

  /**
   * NapCat拓展: 获取群忽略添加请求
   * @param group_id - 群ID
   */
  async nc_getGroupIgnoreAddRequest (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_getGroupIgnoreAddRequest, {
      group_id,
    })
  }

  /**
   * NapCat拓展: 获取群禁言列表
   * @param group_id - 群ID
   */
  async nc_getGroupShutList (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_getGroupShutList, {
      group_id,
    })
  }

  /**
   * NapCat扩展: 获取群过滤系统消息
   * @param group_id - 群ID
   */
  async nc_getGroupIgnoredNotifies (
    group_id: number
  ) {
    return this.sendApi(OneBotGroupApiAction.nc_getGroupIgnoredNotifies, {
      group_id,
    })
  }

  /**
   * GoCQ扩展: 获取群文件资源链接
   * @param group_id - 群ID
   * @param file_id - 文件ID
   * @param busid - 业务ID 废弃属性
   */
  async getGroupFileUrl (
    group_id: number,
    file_id: string,
    busid?: number
  ) {
    return this.sendApi(OneBotFileApiAction.getGroupFileUrl, {
      group_id,
      file_id,
      busid,
    })
  }

  /**
   * GoCQ扩展: 获取私聊文件资源链接
   * @param user_id - 用户ID
   * @param file_id - 文件ID
   * @param busid - 业务ID 废弃属性
   */
  async getPrivateFileUrl (
    user_id: number,
    file_id: string,
    busid?: number
  ) {
    return this.sendApi(OneBotFileApiAction.getPrivateFileUrl, {
      user_id,
      file_id,
      busid,
    })
  }

  /**
   * Lagrange扩展: 获取私聊文件资源链接
   * @param user_id - 用户ID
   * @param file_id - 文件ID
   * @param file_hash - 文件哈希
   */
  async lgl_getPrivateFileUrl (
    user_id: number,
    file_id: string,
    file_hash?: string
  ) {
    return this.sendApi(OneBotFileApiAction.lgl_getPrivateFileUrl, {
      user_id,
      file_id,
      file_hash,
    })
  }

  /**
   * GoCQ扩展: 上传群文件
   * @param group_id - 群ID
   * @param file - 文件路径
   * @param name - 文件名
   * @param folder - 文件夹
   */
  async uploadGroupFile (
    group_id: number,
    file: string,
    name: string,
    folder?: string
  ) {
    return this.sendApi(OneBotFileApiAction.uploadGroupFile, {
      group_id,
      file,
      name,
      folder,
    })
  }

  /**
   * GoCQ扩展: 上传私聊文件
   * @param user_id - 用户ID
   * @param file - 文件路径
   * @param name - 文件名
   */
  async uploadPrivateFile (
    user_id: number,
    file: string,
    name: string
  ) {
    return this.sendApi(OneBotFileApiAction.uploadPrivateFile, {
      user_id,
      file,
      name,
    })
  }

  /**
   * GoCQ扩展: 获取群文件系统信息
   * @param group_id - 群ID
   */
  async getGroupFileSystemInfo (
    group_id: number
  ) {
    return this.sendApi(OneBotFileApiAction.getGroupFileSystemInfo, {
      group_id,
    })
  }

  /**
   * GoCQ扩展: 获取群根目录文件列表
   * @param group_id - 群ID
   */
  async getGroupRootFiles (
    group_id: number
  ) {
    return this.sendApi(OneBotFileApiAction.getGroupRootFiles, {
      group_id,
    })
  }

  /**
   * GoCQ扩展: 获取群子目录文件列表
   * @param group_id - 群ID
   * @param folder_id - 文件夹ID
   */
  async getGroupFilesByFolder (
    group_id: number,
    folder_id: string
  ) {
    return this.sendApi(OneBotFileApiAction.getGroupFilesByFolder, {
      group_id,
      folder_id,
    })
  }

  /**
   * GoCQ扩展: 创建群文件文件夹
   * @param group_id - 群ID
   * @param name - 文件夹名
   */
  async createGroupFileFolder (
    group_id: number,
    name: string
  ) {
    return this.sendApi(OneBotFileApiAction.createGroupFileFolder, {
      group_id,
      name,
    })
  }

  /**
   * GoCQ扩展: 删除群文件文件夹
   * @param group_id - 群ID
   * @param folder_id - 文件夹ID
   */
  async deleteGroupFolder (
    group_id: number,
    folder_id: string
  ) {
    return this.sendApi(OneBotFileApiAction.deleteGroupFolder, {
      group_id,
      folder_id,
    })
  }

  /**
   * GoCQ扩展: 删除群文件
   * @param group_id - 群ID
   * @param file_id - 文件ID
   * @param busid - 业务ID
   */
  async deleteGroupFile (
    group_id: number,
    file_id: string,
    busid: number
  ) {
    return this.sendApi(OneBotFileApiAction.deleteGroupFile, {
      group_id,
      file_id,
      busid,
    })
  }

  /**
   * NapCat/Lagrange扩展: 删除群文件
   * @param group_id - 群ID
   * @param file_id - 文件ID
   */
  async nc_deleteGroupFile (
    group_id: number,
    file_id: string
  ) {
    return this.sendApi(OneBotFileApiAction.nc_deleteGroupFile, {
      group_id,
      file_id,
    })
  }

  /**
   * Lagrange扩展: 上传图片
   * @param file - 文件路径
   */
  async lgl_uploadImage (
    file: string
  ) {
    return this.sendApi(OneBotFileApiAction.lgl_uploadImage, {
      file,
    })
  }

  /**
   * 社区扩展: 移动群文件
   * @param group_id - 群ID
   * @param file_id - 文件ID
   * @param folder_id - 文件夹ID
   */
  async moveGroupFile (
    group_id: number,
    file_id: string,
    folder_id: string
  ) {
    return this.sendApi(OneBotFileApiAction.moveGroupFile, {
      group_id,
      file_id,
      folder_id,
    })
  }

  /**
   * Lagrange扩展: 重命名群文件文件夹
   * @param group_id - 群ID
   * @param folder_id - 文件夹ID
   * @param new_name - 新名称
   */
  async lgl_renameGroupFileFolder (
    group_id: number,
    folder_id: string,
    new_name: string
  ) {
    return this.sendApi(OneBotFileApiAction.lgl_renameGroupFileFolder, {
      group_id,
      folder_id,
      new_name,
    })
  }

  /**
   * NapCat扩展: 转发群文件
   * @param group_id - 群ID
   * @param file_id - 文件ID
   */
  async nc_transGroupFile (
    group_id: number,
    file_id: string
  ) {
    return this.sendApi(OneBotFileApiAction.nc_transGroupFile, {
      group_id,
      file_id,
    })
  }

  /**
   * NapCat扩展: 重命名群文件
   * @param group_id - 群ID
   * @param file_id - 文件ID
   * @param current_parent_directory - 当前父目录
   * @param new_name - 新名称
   */
  async nc_renameGroupFile (
    group_id: number,
    file_id: string,
    current_parent_directory: string,
    new_name: string
  ) {
    return this.sendApi(OneBotFileApiAction.nc_renameGroupFile, {
      group_id,
      file_id,
      current_parent_directory,
      new_name,
    })
  }

  /**
   * NapCat扩展: 获取文件
   * @param file_id - 文件ID
   */
  async nc_getFile (file: string) {
    return this.sendApi(OneBotFileApiAction.nc_getFile, {
      file,
    })
  }

  /**
   * 获取登录号信息
   */
  async getLoginInfo () {
    return this.sendApi(OneBotBotApiAction.getLoginInfo, {})
  }

  /**
   * 获取版本信息
   */
  async getVersionInfo () {
    return this.sendApi(OneBotBotApiAction.getVersionInfo, {})
  }

  /**
   * 获取状态
   */
  async getStatus () {
    return this.sendApi(OneBotBotApiAction.getStatus, {})
  }

  /**
   * 获取Cookies
   * @param domain - 域名
   */
  async getCookies (domain: string) {
    return this.sendApi(OneBotBotApiAction.getCookies, { domain })
  }

  /**
   * NapCat扩展: 获取Cookies
   * @param domain - 域名
   */
  async nc_getCookies (domain: string) {
    return this.sendApi(OneBotBotApiAction.nc_getCookies, { domain })
  }

  /**
   * 获取CSRF Token
   */
  async getCsrfToken () {
    return this.sendApi(OneBotBotApiAction.getCsrfToken, {})
  }

  /**
   * 获取QQ相关接口凭证
   * @param domain - 域名
   */
  async getCredentials (domain: string) {
    return this.sendApi(OneBotBotApiAction.getCredentials, { domain })
  }

  /**
   * 获取语音
   * @param file - 文件名
   * @param out_format - 输出格式
   */
  async getRecord (file: string, out_format: string) {
    return this.sendApi(OneBotBotApiAction.getRecord, { file, out_format })
  }

  /**
   * NapCat扩展: 获取语音
   * @param out_format - 输出格式
   * @param file - 文件名
   * @param file_id - 文件ID
   */
  async nc_getRecord (out_format: string, file?: string, file_id?: string) {
    return this.sendApi(OneBotBotApiAction.nc_getRecord, { file, file_id, out_format })
  }

  /**
   * 获取图片
   * @param file - 文件名
   */
  async getImage (file: string) {
    return this.sendApi(OneBotBotApiAction.getImage, { file })
  }

  /**
   * NapCat扩展: 获取图片
   * @param file - 文件名
   * @param file_id - 文件ID
   */
  async nc_getImage (file?: string, file_id?: string) {
    return this.sendApi(OneBotBotApiAction.nc_getImage, { file, file_id })
  }

  /**
   * 检查是否可以发送图片
   */
  async canSendImage () {
    return this.sendApi(OneBotBotApiAction.canSendImage, {})
  }

  /**
   * 检查是否可以发送语音
   */
  async canSendRecord () {
    return this.sendApi(OneBotBotApiAction.canSendRecord, {})
  }

  /**
   * 设置登录号资料
   * @param nickname - 昵称
   * @param company - 公司
   * @param email - 邮箱
   * @param college - 学校
   * @param personal_note - 个性签名
   */
  async setQqProfile (nickname: string, company: string, email: string, college: string, personal_note: string) {
    return this.sendApi(OneBotBotApiAction.setQqProfile, { nickname, company, email, college, personal_note })
  }

  /**
   * 获取企点账号信息
   */
  async qidianGetAccountInfo () {
    return this.sendApi(OneBotBotApiAction.qidianGetAccountInfo, {})
  }

  /**
   * 获取在线机型
   * @param model - 机型
   */
  async getModelShow (model: string) {
    return this.sendApi(OneBotBotApiAction.getModelShow, { model })
  }

  /**
   * 设置在线机型
   * @param model - 机型
   * @param model_show - 展示名
   */
  async setModelShow (model: string, model_show: string) {
    return this.sendApi(OneBotBotApiAction.setModelShow, { model, model_show })
  }

  /**
   * 获取当前账号在线客户端列表
   * @param no_cache - 是否不使用缓存
   */
  async getOnlineClients (no_cache?: boolean) {
    return this.sendApi(OneBotBotApiAction.getOnlineClients, { no_cache })
  }

  /**
   * 社区扩展: 获取已收藏的QQ表情列表
   */
  async fetchCustomFace () {
    return this.sendApi(OneBotBotApiAction.fetchCustomFace, {})
  }

  /**
   * 社区扩展: 设置QQ头像
   * @param file - 文件路径
   */
  async setQqAvatar (file: string) {
    return this.sendApi(OneBotBotApiAction.setQqAvatar, { file })
  }

  /**
   * 社区扩展: 获取rkey
   */
  async getRkey () {
    return this.sendApi(OneBotBotApiAction.getRkey, {})
  }

  /**
   * NapCat扩展: 获取NC版rkey
   */
  async nc_getRkey () {
    return this.sendApi(OneBotBotApiAction.nc_getRkey, {})
  }

  /**
   * Lagrange扩展: 获取mface key
   */
  async lgl_getMfaceKey () {
    return this.sendApi(OneBotBotApiAction.lgl_getMfaceKey, {})
  }

  /**
   * NapCat扩展: 获取rkey服务器
   */
  async nc_getRkeyServer () {
    return this.sendApi(OneBotBotApiAction.nc_getRkeyServer, {})
  }

  /**
   * NapCat扩展: 设置自定义在线状态
   * @param face - 头像
   * @param text - 状态文本
   */
  async nc_setDiyOnlineStatus (face: number, text: string) {
    return this.sendApi(OneBotBotApiAction.nc_setDiyOnlineStatus, { face, text })
  }

  /**
   * NapCat扩展: 设置在线状态
   * @param status - 状态
   */
  async nc_setOnlineStatus (status: number) {
    return this.sendApi(OneBotBotApiAction.nc_setOnlineStatus, { status })
  }

  /**
   * NapCat扩展: 设置输入状态
   * @param user_id - 用户ID
   * @param typing - 是否正在输入
   */
  async nc_setInputStatus (user_id: number, typing: boolean) {
    return this.sendApi(OneBotBotApiAction.nc_setInputStatus, { user_id, typing })
  }

  /**
   * NapCat扩展: 获取个人资料点赞
   * @param user_id - 用户ID
   */
  async nc_getProfileLike (user_id: number) {
    return this.sendApi(OneBotBotApiAction.nc_getProfileLike, { user_id })
  }

  /**
   * NapCat扩展: 获取官方机器人账号范围
   */
  async nc_getRobotUinRange () {
    return this.sendApi(OneBotBotApiAction.nc_getRobotUinRange, {})
  }

  /**
   * NapCat扩展: 设置自己的个性签名
   * @param longNick - 个性签名
   */
  async nc_setSelfLongnick (longNick: string) {
    return this.sendApi(OneBotBotApiAction.nc_setSelfLongnick, { longNick })
  }

  /**
   * NapCat扩展: 获取最近联系人
   * @param count - 数量
   */
  async nc_getRecentContact (count?: number) {
    return this.sendApi(OneBotBotApiAction.nc_getRecentContact, { count })
  }

  /**
   * NapCat扩展: 获取用户状态
   * @param user_id - 用户ID
   */
  async nc_getUserStatus (user_id: number) {
    return this.sendApi(OneBotBotApiAction.nc_getUserStatus, { user_id })
  }

  /**
   * NapCat扩展: 获取clientkey
   */
  async nc_getClientkey () {
    return this.sendApi(OneBotBotApiAction.nc_getClientkey, {})
  }

  /**
   * 重启 OneBot 实现
   * @param delay - 延迟
   */
  async restartOneBot (delay?: number) {
    return this.sendApi(OneBotOtherApiAction.restartOneBot, { delay })
  }

  /**
   * 清理缓存
   */
  async cleanCache () {
    return this.sendApi(OneBotOtherApiAction.cleanCache, {})
  }

  /**
   * 下载文件到缓存目录
   * @param url - 链接
   * @param thread_count - 线程数
   * @param headers - 请求头
   */
  async downloadFile (url: string, thread_count?: number, headers?: Array<string>) {
    return this.sendApi(OneBotOtherApiAction.downloadFile, { url, thread_count, headers })
  }

  /**
   * NapCat扩展: 下载文件到缓存目录
   * @param url - 链接
   * @param base64 - base64
   * @param name - 文件名
   * @param headers - 请求头
   */
  async nc_downloadFile (url: string, base64?: string, name?: string, headers?: Array<string>) {
    return this.sendApi(OneBotOtherApiAction.nc_downloadFile, { url, base64, name, headers })
  }

  /**
   * 检查链接安全性
   * @param url - 链接
   */
  async checkUrlSafely (url: string) {
    return this.sendApi(OneBotOtherApiAction.checkUrlSafely, { url })
  }

  /**
   * 获取中文分词
   * @param content - 内容
   */
  async getWordSlices (content: string) {
    return this.sendApi(OneBotOtherApiAction.getWordSlices, { content })
  }

  /**
   * 对事件执行快速操作
   * @param context - 上下文
   * @param operation - 操作
   */
  async handleQuickOperation (context: object, operation: object) {
    return this.sendApi(OneBotOtherApiAction.handleQuickOperation, { context, operation })
  }

  /**
   * OCR图片
   * @param image - 图片
   */
  async ocrImage (image: string) {
    return this.sendApi(OneBotOtherApiAction.ocrImage, { image })
  }

  /**
   * OCR图片 (别名)
   * @param image - 图片
   */
  async dotOcrImage (image: string) {
    return this.sendApi(OneBotOtherApiAction.dotOcrImage, { image })
  }

  /**
   * NapCat扩展: OCR图片
   * @param image - 图片
   */
  async nc_ocrImage (image: string) {
    return this.sendApi(OneBotOtherApiAction.nc_ocrImage, { image })
  }

  /**
   * NapCat扩展: 英文翻译为中文
   * @param text - 英文
   */
  async nc_translateEn2zh (text: string) {
    return this.sendApi(OneBotOtherApiAction.nc_translateEn2zh, { text })
  }

  /**
   * NapCat扩展: 点击按钮
   * @param message_id - 消息ID
   * @param button_index - 按钮索引
   */
  async nc_clickInlineKeyboardButton (message_id: number, button_index: number) {
    return this.sendApi(OneBotOtherApiAction.nc_clickInlineKeyboardButton, { message_id, button_index })
  }

  /**
   * NapCat扩展: 获取推荐好友/群聊卡片
   * @param user_id - 用户ID
   */
  async nc_arkSharePeer (user_id: number) {
    return this.sendApi(OneBotOtherApiAction.nc_arkSharePeer, { user_id })
  }

  /**
   * NapCat扩展: 获取推荐群聊卡片
   * @param group_id - 群ID
   */
  async nc_arkShareGroup (group_id: number) {
    return this.sendApi(OneBotOtherApiAction.nc_arkShareGroup, { group_id })
  }

  /**
   * NapCat扩展: 创建收藏
   * @param message_id - 消息ID
   */
  async nc_createCollection (message_id: number) {
    return this.sendApi(OneBotOtherApiAction.nc_createCollection, { message_id })
  }

  /**
   * NapCat扩展: 获取收藏列表
   */
  async nc_getCollectionList () {
    return this.sendApi(OneBotOtherApiAction.nc_getCollectionList, {})
  }

  /**
   * NapCat扩展: 退出机器人
   */
  async nc_botExit () {
    return this.sendApi(OneBotOtherApiAction.nc_botExit, {})
  }

  /**
   * NapCat扩展: 发送自定义组包
   * @param args - 参数
   */
  async nc_sendPacket (args: Record<string, any>) {
    return this.sendApi(OneBotOtherApiAction.nc_sendPacket, args)
  }

  /**
   * NapCat扩展: 获取packet状态
   */
  async nc_getPacketStatus () {
    return this.sendApi(OneBotOtherApiAction.nc_getPacketStatus, {})
  }

  /**
   * NapCat扩展: 获取小程序卡片
   * @param args - 参数
   */
  async nc_getMiniAppArk (args: {
    type?: string,
    title?: string,
    desc?: string,
    picUrl?: string,
    jumpUrl?: string,
    webUrl?: string,
    iconUrl?: string,
    appId?: string,
    scene?: string,
    templateType?: string,
    businessType?: string,
    verType?: string,
    shareType?: string,
    versionId?: string,
    sdkId?: string,
    withShareTicket?: string,
    rawArkData?: boolean
  }) {
    return this.sendApi(OneBotOtherApiAction.nc_getMiniAppArk, args)
  }

  /**
   * NapCat扩展: 发送戳一戳
   * @param args - 参数
   */
  async nc_sendPoke (args: {
    user_id?: string,
    group_id?: string,
    target_id?: string
  }) {
    return this.sendApi(OneBotOtherApiAction.nc_sendPoke, args)
  }
}
