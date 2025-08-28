/**
 * Bot账号信息
 */
export interface AccountInfo {
  /**
   * Bot的uin
   * @description Bot的唯一标识符
   */
  uin: string
  /**
   * Bot的uid
   * @description 不推荐非专业用户使用
   */
  uid: string
  /** Bot的selfId 一般使用此参数即可 */
  selfId: string
  /** 账号名 不存在则是空字符串 */
  name: string
  /**
   * Bot的头像链接
   */
  avatar: string
  /**
   * - Bot的子账号键值对
   * - 结构约定: key=场景 value=id
   * - 此部分由适配器自行实现
   * @example
   * ```json
   * {
   *   "group": "123456",
   *   "guild": "123456",
   *   "friend": "123456",
   *   "direct": "123456"
   * }
   * ```
   */
  subId: Record<string, string>
  /**
   * Bot运行状态
   * - online: 已连接且在线
   * - offline: 已连接但离线
   * - disconnected: 连接断开，将保持3小时当前状态，3小时候转入 `uninstalled`
   * - uninstalled: 已卸载，如果保持当前状态1小时，则会卸载当前整个Bot实例
   */
  status: 'online' | 'offline' | 'disconnected' | 'uninstalled'

  /**
   * Bot启用状态
   * - true: 启用
   * - false: 禁用
   */
  enabled: boolean

  /**
   * Bot的时间信息
   */
  time: {
    /**
     * Bot的首次连接时间
     * - 也就是第一次注册Bot的时间
     * @description Unix时间戳
     * @example 1672531199000
     */
    firstConnectAt: number
    /**
     * Bot的总在线时长，不包含离线时间
     * @description 单位为毫秒
     */
    onlineDuration: number
    /**
     * Bot的总离线时间
     * @description 单位为毫秒
     */
    offlineDuration: number
    /**
     * Bot的最后在线时间
     * @description Unix时间戳
     * @example 1672531199000
     */
    lastOnlineAt: number
    /**
     * Bot的最后离线时间
     * @description Unix时间戳
     * @example 1672531199000
     */
    lastOfflineAt: number
    /**
     * Bot的当前状态开始时间
     * @description Unix时间戳，表示进入当前状态的时间
     * @example 1672531199000
     */
    currentStatusAt: number
  }

  /**
   * Bot的统计信息
   */
  stats: {
    /** 总在线次数(进入 online 状态的次数) */
    onlineCount: number

    /** 总离线次数(进入 offline 状态的次数) */
    offlineCount: number

    /** 总连接次数(尝试连接成功的次数) */
    connectCount: number

    /** 总断开次数(进入 disconnected 的次数) */
    disconnectCount: number
  }

  /**
   * Bot的事件信息统计
   * @description onebot元事件不参与统计
   */
  events: {
    /** 收到事件总数量 */
    received: {
      /** 总数量 */
      total: number
      /** 收到消息事件数量 */
      message: number
      /** 收到通知事件数量 */
      notification: number
      /** 收到请求事件数量 */
      request: number
      /** 收到其他事件数量 */
      other: number
    }
    /** 发送事件数量 */
    sent: {
      /** 发送消息数量 */
      message: number
    }
  }
}
