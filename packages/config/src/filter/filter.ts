import { filterStringArray, checkType } from '../utils'

export interface FilterConfig {
  /** 启用配置 - 控制是否启用各场景的事件 */
  enable: {
    /** 是否启用好友事件 */
    friend: boolean
    /** 是否启用群事件 */
    group: boolean
    /** 是否启用私信事件 */
    direct: boolean
    /** 是否启用频道事件 */
    guild: boolean
    /** 是否启用子频道事件 */
    channel: boolean
  }
  /** 白名单配置 - 符合条件的才会处理 */
  enable_list: {
    /** 全局用户白名单 */
    user: string[]
    /** 好友白名单 */
    friend: string[]
    /** 群白名单 */
    group: string[]
    /** 私信白名单 */
    direct: string[]
    /** 频道白名单 */
    guild: string[]
    /** 子频道白名单 */
    channel: string[]
  }
  /** 黑名单配置 - 符合条件的会被过滤 */
  disable_list: {
    /** 全局用户黑名单 */
    user: string[]
    /** 好友黑名单 */
    friend: string[]
    /** 群黑名单 */
    group: string[]
    /** 私信黑名单 */
    direct: string[]
    /** 频道黑名单 */
    guild: string[]
    /** 子频道黑名单 */
    channel: string[]
  }
  /** 日志白名单配置 - 符合条件的才会打印日志 */
  log_enable_list: {
    /** 好友日志白名单 */
    friend: string[]
    /** 群日志白名单 */
    group: string[]
    /** 私信日志白名单 */
    direct: string[]
    /** 频道日志白名单 */
    guild: string[]
    /** 子频道日志白名单 */
    channel: string[]
  }
  /** 日志黑名单配置 - 符合条件的不会打印日志 */
  log_disable_list: {
    /** 好友日志黑名单 */
    friend: string[]
    /** 群日志黑名单 */
    group: string[]
    /** 私信日志黑名单 */
    direct: string[]
    /** 频道日志黑名单 */
    guild: string[]
    /** 子频道日志黑名单 */
    channel: string[]
  },
  /**
   * 全局插件过滤配置
   */
  plugin: {
    /** 启用的插件列表 */
    enable: string[]
    /** 禁用的插件列表 */
    disable: string[]
  }
}

export const defaultFilterConfig: FilterConfig = {
  enable: {
    friend: true,
    group: true,
    direct: true,
    guild: true,
    channel: true,
  },
  enable_list: {
    user: [],
    friend: [],
    group: [],
    direct: [],
    guild: [],
    channel: [],
  },
  disable_list: {
    user: [],
    friend: [],
    group: [],
    direct: [],
    guild: [],
    channel: [],
  },
  log_enable_list: {
    friend: [],
    group: [],
    direct: [],
    guild: [],
    channel: [],
  },
  log_disable_list: {
    friend: [],
    group: [],
    direct: [],
    guild: [],
    channel: [],
  },
  plugin: {
    enable: [],
    disable: [],
  },
}

/**
 * 兼容性处理
 * @param config 过滤器配置
 */
export const filterConfigCompat = (config: Partial<FilterConfig>): FilterConfig => {
  return {
    enable: {
      friend: checkType('boolean', config.enable?.friend, defaultFilterConfig.enable.friend),
      group: checkType('boolean', config.enable?.group, defaultFilterConfig.enable.group),
      direct: checkType('boolean', config.enable?.direct, defaultFilterConfig.enable.direct),
      guild: checkType('boolean', config.enable?.guild, defaultFilterConfig.enable.guild),
      channel: checkType('boolean', config.enable?.channel, defaultFilterConfig.enable.channel),
    },
    enable_list: {
      user: filterStringArray(config.enable_list?.user),
      friend: filterStringArray(config.enable_list?.friend),
      group: filterStringArray(config.enable_list?.group),
      direct: filterStringArray(config.enable_list?.direct),
      guild: filterStringArray(config.enable_list?.guild),
      channel: filterStringArray(config.enable_list?.channel),
    },
    disable_list: {
      user: filterStringArray(config.disable_list?.user),
      friend: filterStringArray(config.disable_list?.friend),
      group: filterStringArray(config.disable_list?.group),
      direct: filterStringArray(config.disable_list?.direct),
      guild: filterStringArray(config.disable_list?.guild),
      channel: filterStringArray(config.disable_list?.channel),
    },
    log_enable_list: {
      friend: filterStringArray(config.log_enable_list?.friend),
      group: filterStringArray(config.log_enable_list?.group),
      direct: filterStringArray(config.log_enable_list?.direct),
      guild: filterStringArray(config.log_enable_list?.guild),
      channel: filterStringArray(config.log_enable_list?.channel),
    },
    log_disable_list: {
      friend: filterStringArray(config.log_disable_list?.friend),
      group: filterStringArray(config.log_disable_list?.group),
      direct: filterStringArray(config.log_disable_list?.direct),
      guild: filterStringArray(config.log_disable_list?.guild),
      channel: filterStringArray(config.log_disable_list?.channel),
    },
    plugin: {
      enable: filterStringArray(config.plugin?.enable),
      disable: filterStringArray(config.plugin?.disable),
    },
  }
}

/**
 * 过滤器配置 API
 */
export const filter = {
  /**
   * 默认过滤器配置
   */
  default: defaultFilterConfig,
  /**
   * 兼容性处理过滤器配置
   */
  compat: filterConfigCompat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
