export type Status = 'online' | 'offline' | 'initializing'

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
   * - online: 在线
   * - offline: 离线
   * - initializing: 初始化
   */
  status: Status

  /**
   * Bot启用状态
   * - true: 启用
   * - false: 禁用
   */
  enabled: boolean

  /**
   * Bot的状态变化日志
   * @deprecated 请不要直接操作此字段 请使用 `setStatus` 方法
   */
  statusLog: {
    /** 状态 */
    status: Status,
    /** 变更时间 */
    time: number
  }[]

  /**
   * Bot的时间信息
   */
  time: {
    /**
     * Bot的首次注册时间
     */
    startTime: number
    /**
     * Bot的总在线时长，不包含离线时间
     * @description 单位为毫秒
     */
    get onlineDuration (): number
    /**
     * Bot的总离线时间
     * @description 单位为毫秒
     */
    get offlineDuration (): number
    /**
     * Bot的最后一次在线时间
     * @description 如果当前在线则返回当前时间 Unix时间戳
     */
    get lastOnlineAt (): number
    /**
     * Bot的最后一次离线时间
     * @description Unix时间戳
     * @example 1672531199000
     */
    get lastOfflineAt (): number
    /**
     * Bot的当前状态持续时间
     * - 在线状态则为在线时长
     * - 离线状态则为离线时长
     */
    get currentStatusDuration (): number
  }

  /**
   * Bot的统计信息
   */
  count: {
    /** 总在线次数(进入 online 状态的次数) */
    online: number

    /** 总离线次数(进入 offline 状态的次数) */
    offline: number
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
      notice: number
      /** 收到请求事件数量 */
      request: number
      /** 收到其他事件数量 */
      other: number
    }
    /** 发送事件数量 */
    sent: {
      /** 发送消息数量 */
      message: number
      /** 发送转发消息数量 */
      forward: number
    }
  }
}
