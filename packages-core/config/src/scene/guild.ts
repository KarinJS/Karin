import { LRUCache } from '@karinjs/utils'
import { checkType, filterStringArray, convertAliasToRegex } from '../utils'

export interface GuildConfig {
  /**
   * 是否继承全局配置
   * @description
   * - true: 继承全局配置，缺失的配置将使用全局配置
   * - false: 不继承全局配置，缺失的配置将使用默认值 默认值不可变更
   * @default true
   */
  inherit: boolean
  /**
   * 当前频道的全局冷却时间
   * @description 单位秒
   * @default 1
   */
  cd: number
  /**
   * 当前频道每个用户的个人冷却时间
   * @description 单位秒
   * @default 1
   */
  user_cd: number
  /**
   * 机器人应答模式
   * @default 0
   * - 0: 回应所有消息
   * - 1: 仅回应机器人主人的消息
   * - 2: 仅回应机器人管理员的消息 `(包含主人)`
   * - 3: 仅回应包含at机器人的消息
   * - 4: 仅回应 `alias(机器人别名)` 的消息
   * - 5: 仅回应包含at机器人的消息或和别名消息
   * - 6: 非机器人主人仅回应at机器人消息 主人无限制
   * - 7: 非机器人管理员仅回应at机器人消息 管理员无限制 `(包含主人)`
   * - 8: 非机器人主人仅回应别名消息 主人无限制
   * - 9: 非机器人管理员仅回应别名消息 管理员无限制 `(包含主人)`
   * - 10: 非机器人主人仅回应别名消息或at机器人消息 主人无限制
   * - 11: 非机器人管理员仅回应别名消息或at机器人消息 管理员无限制 `(包含主人)`
   */
  mode: number
  /**
   * 机器人别名
   * @description 触发机器人时可使用别名+指令的方式
   * @since 2.0 引入支持正则表达式字符串 用//包裹表示为正则表达式字符串
   * @example
   * ```json
   * // 普通别名
   * "alias": ["小Q", "机器人"]
   * // -> 非表达式转换后为: [/^小Q/, /^机器人/]
   * // -> 匹配: 小Q 运行状态~
   *
   * "alias": ["/(小Q|机器人)/"] // 需要使用//包裹表示为正则表达式字符串
   * // -> 表达式转换后为: [/(小Q|机器人)/]
   * // -> 匹配: 查看小Q运行状态~
   * ```
   */
  alias: string[]
  /**
   * 启用的插件或功能列表
   * @default []
   */
  enable: string[]
  /**
   * 禁用的插件或功能列表
   * @default []
   */
  disable: string[]
  /**
   * 频道成员单独白名单
   * @description 配置在此列表中的用户不受其他限制
   * @default []
   */
  member_enable: string[]
  /**
   * 频道成员单独黑名单
   * @description 配置在此列表中的用户将被禁止使用
   * @default []
   */
  member_disable: string[]
}

/**
 * 运行时频道配置（alias 已转换为 RegExp[]）
 */
export interface GuildConfigRuntime extends Omit<GuildConfig, 'alias'> {
  /**
   * 机器人别名正则表达式数组
   */
  alias: RegExp[]
}

/**
 * `guild.json` 文件类型
 * @description
 * key语法说明:
 * - `global`: 全局默认配置 下方所有配置均可继承此配置
 * - `Bot:self_id:guild_id:channel_id`: 指定机器人在指定频道的指定子频道配置 `Bot` 为固定前缀
 * - `Bot:self_id:guild_id`: 指定机器人在指定频道的配置 `Bot` 为固定前缀
 * - `Bot:self_id`: 指定ID的机器人配置 `Bot` 为固定前缀
 * - `guild:guild_id:channel_id`: 指定频道的指定子频道配置 任何机器人在此频道均使用此配置
 * - `guild:guild_id`: 指定频道的配置 任何机器人在此频道均使用此配置
 * - `channel:channel_id`: 指定子频道的配置 任何机器人在此子频道均使用此配置
 * @example
 * ```json
 * {
 *  // 机器人123456789的全局配置
 *  "Bot:123456789": {
 *   "inherit": true,
 *   "cd": 2
 *  },
 *  // 机器人123456789在频道888888的配置
 *  "Bot:123456789:888888": {
 *   "user_cd": 3
 *  },
 *  // 机器人123456789在频道888888的子频道777777的配置
 *  "Bot:123456789:888888:777777": {
 *   "mode": 3
 *  }
 * }
 * ```
 *
 * @example 简单例子
 * ```json
 * {
 *   "global": {
 *     "inherit": true,
 *     "cd": 1,
 *     "user_cd": 1,
 *     "mode": 0,
 *     "alias": ["小Q", "机器人"],
 *     "enable": [],
 *     "disable": [],
 *     "member_enable": [],
 *     "member_disable": []
 *   }
 * }
 * ```
 */
export type ConfigGuild = Record<string, GuildConfigRuntime>

const defaultCfg: GuildConfigRuntime = {
  inherit: true,
  cd: 1,
  user_cd: 1,
  mode: 0,
  alias: [],
  enable: [],
  disable: [],
  member_enable: [],
  member_disable: [],
}

/**
 * 默认频道配置
 */
const defaultGuild: ConfigGuild = {
  global: defaultCfg,
}

/**
 * 频道配置LRU缓存
 */
const lruCache = new LRUCache<string, GuildConfigRuntime>(1000, 0)

/**
 * 兼容性处理
 * @param config 频道配置
 * @param defaultConfig 默认配置
 */
const compatGuild = (config: ConfigGuild): ConfigGuild => {
  /** 兜底 */
  if (typeof config !== 'object' || config === null) {
    logger.warn('配置损坏，使用默认配置 defaultGuild 进行兜底')
    return defaultGuild
  }

  /** 清空缓存，因为配置已更新 */
  lruCache.clear()

  const result: ConfigGuild = {}
  /** 先标准化全局配置 */
  const globalCfg = compatGuildItem(config.global, defaultCfg)
  result.global = globalCfg

  for (const key of Object.keys(config)) {
    if (key === 'global') continue
    const value = config[key]
    if (typeof value !== 'object') continue
    result[key] = compatGuildItem(value, globalCfg)
  }

  return result
}

/**
 * 兼容性处理单个频道配置
 * @param cfg 频道配置
 * @param globalCfg 默认配置
 */
const compatGuildItem = (
  cfg: Partial<GuildConfigRuntime>,
  globalCfg: GuildConfigRuntime
): GuildConfigRuntime => {
  const inherit = checkType('boolean', cfg.inherit, globalCfg.inherit)
  const cd = checkType('number', cfg.cd, inherit ? globalCfg.cd : defaultCfg.cd)
  const mode = checkType('number', cfg.mode, inherit ? globalCfg.mode : defaultCfg.mode)
  const userCd = checkType('number', cfg.user_cd, inherit ? globalCfg.user_cd : defaultCfg.user_cd)

  return {
    inherit,
    cd,
    mode,
    user_cd: userCd,
    alias: convertAliasToRegex(cfg.alias),
    enable: filterStringArray(cfg.enable),
    disable: filterStringArray(cfg.disable),
    member_enable: filterStringArray(cfg.member_enable),
    member_disable: filterStringArray(cfg.member_disable),
  }
}

/**
 * 获取指定频道的配置
 * @description 通过优先级规则获取最终配置
 * @param config 频道配置
 * @param selfId 机器人ID
 * @param guildId 频道ID
 * @param channelId 子频道ID
 * @returns 频道配置
 */
const getConfig = (
  config: ConfigGuild,
  selfId: string,
  guildId: string,
  channelId: string
): GuildConfigRuntime => {
  const keys = [
    `Bot:${selfId}:${guildId}:${channelId}`,
    `Bot:${selfId}:${guildId}`,
    `Bot:${selfId}`,
    `guild:${guildId}:${channelId}`,
    `guild:${guildId}`,
    `channel:${channelId}`,
    'global',
  ]

  /** 使用优先级最高的规则作为缓存键 */
  const key = keys[0]
  const chche = lruCache.get(key)
  if (chche) return chche

  /** 走配置进行兜底 */
  for (const key of keys) {
    const cfg = config[key]
    if (cfg) {
      lruCache.set(key, cfg)
      return cfg
    }
  }

  /** 走不到这里的... */
  return defaultGuild.global
}

/**
 * 频道配置 API
 */
export const guild = {
  /**
   * 默认频道配置
   */
  default: defaultGuild,
  /**
   * 兼容性处理频道配置
   */
  compat: compatGuild,
  /**
   * 兼容性处理单个频道配置项
   */
  compatItem: compatGuildItem,
  /**
   * 获取指定频道的配置
   */
  get: getConfig,
  /**
   * 清空LRU缓存
   */
  clearCache: () => lruCache.clear(),
}
