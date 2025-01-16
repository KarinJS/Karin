/**
 * `config.yaml` 类型
 */
export interface Config {
  /** 主人列表 */
  master: string[]
  /** 管理员列表 */
  admin: string[]
  /** 用户管理 */
  user: {
    /** 是否启用用户事件 */
    enable: boolean
    /** 用户白名单 */
    enable_list: string[]
    /** 用户黑名单 */
    disable_list: string[]
  }
  /** 好友管理 */
  friend: {
    /** 是否启用好友消息事件 */
    enable: boolean
    /** 好友白名单 */
    enable_list: string[]
    /** 好友黑名单 */
    disable_list: string[]
    /** 好友日志白名单 */
    log_enable_list: string[]
    /** 好友日志黑名单 */
    log_disable_list: string[]
  }
  /** 群管理 */
  group: {
    /** 是否启用群消息事件 */
    enable: boolean
    /** 群白名单 */
    enable_list: string[]
    /** 群黑名单 */
    disable_list: string[]
    /** 群日志白名单 */
    log_enable_list: string[]
    /** 群日志黑名单 */
    log_disable_list: string[]
  }
  /** 频道私信管理 */
  directs: {
    /** 是否启用私信消息事件 */
    enable: boolean
    /** 私信白名单 */
    enable_list: string[]
    /** 私信黑名单 */
    disable_list: string[]
    /** 私信日志白名单 */
    log_enable_list: string[]
    /** 私信日志黑名单 */
    log_disable_list: string[]
  }
  /** 频道管理 */
  guilds: {
    /** 是否启用频道消息事件 */
    enable: boolean
    /** 频道白名单 */
    enable_list: string[]
    /** 频道黑名单 */
    disable_list: string[]
    /** 频道日志白名单 */
    log_enable_list: string[]
    /** 频道日志黑名单 */
    log_disable_list: string[]
  }
  /** 频道消息管理 */
  channels: {
    /** 是否启用频道消息事件 */
    enable: boolean
    /** 频道白名单 */
    enable_list: string[]
    /** 频道黑名单 */
    disable_list: string[]
    /** 频道日志白名单 */
    log_enable_list: string[]
    /** 频道日志黑名单 */
    log_disable_list: string[]
  }
}
