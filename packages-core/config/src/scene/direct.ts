import { LRUCache } from '@karinjs/utils'
import { checkType, filterStringArray, convertAliasToRegex } from '../utils'

export interface DirectConfig {
  /**
   * 是否继承全局配置
   * @description
   * - true: 继承全局配置，缺失的配置将使用全局配置
   * - false: 不继承全局配置，缺失的配置将使用默认值 默认值不可变更
   * @default true
   */
  inherit: boolean
  /**
   * 频道私聊冷却时间
   * @description 单位秒 私聊场景下使用cd作为每个用户的冷却时间
   * @default 1
   */
  cd: number
  /**
   * 机器人应答模式
   * @default 0
   * - 0: 回应所有消息
   * - 1: 仅回应机器人主人的消息
   * - 2: 仅回应机器人管理员的消息 `(包含主人)`
   * - 3: 仅回应 `alias(机器人别名)` 的消息
   * - 4: 非机器人主人仅回应别名消息 主人无限制
   * - 5: 非机器人管理员仅回应别名消息 管理员无限制 `(包含主人)`
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
}

/**
 * 运行时频道私聊配置（alias 已转换为 RegExp[]）
 */
export interface DirectConfigRuntime extends Omit<DirectConfig, 'alias'> {
  /**
   * 机器人别名正则表达式数组
   */
  alias: RegExp[]
}

/**
 * `direct.json` 文件类型
 * @description
 * key语法说明:
 * - `global`: 全局默认配置 下方所有配置均可继承此配置
 * - `Bot:self_id:guild_id:user_id`: 指定机器人在指定频道与指定成员的私聊配置 `Bot` 为固定前缀
 * - `Bot:self_id:guild_id`: 指定机器人在指定频道的私聊配置 `Bot` 为固定前缀
 * - `Bot:self_id`: 指定ID的机器人配置 `Bot` 为固定前缀
 * - `guild:guild_id`: 指定频道的私聊配置 任何机器人在此频道均使用此配置
 * @example
 * ```json
 * {
 *  // 机器人123456789的全局频道私聊配置
 *  "Bot:123456789": {
 *   "inherit": true,
 *   "cd": 2
 *  },
 *  // 机器人123456789在频道888888的私聊配置
 *  "Bot:123456789:888888": {
 *   "mode": 1
 *  },
 *  // 机器人123456789在频道888888与成员777777的私聊配置
 *  "Bot:123456789:888888:777777": {
 *   "mode": 0
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
 *     "mode": 0,
 *     "alias": ["小Q", "机器人"],
 *     "enable": [],
 *     "disable": []
 *   }
 * }
 * ```
 */
export type ConfigDirect = Record<string, DirectConfigRuntime>

const defaultCfg: DirectConfigRuntime = {
  inherit: true,
  cd: 1,
  mode: 0,
  alias: [],
  enable: [],
  disable: [],
}

/**
 * 默认频道私聊配置
 */
const defaultDirect: ConfigDirect = {
  global: defaultCfg,
}

/**
 * 频道私聊配置LRU缓存
 */
const lruCache = new LRUCache<string, DirectConfigRuntime>(200, 0)

/**
 * 兼容性处理
 * @param config 频道私聊配置
 * @param defaultConfig 默认配置
 */
const compatDirect = (config: ConfigDirect): ConfigDirect => {
  /** 兜底 */
  if (typeof config !== 'object' || config === null) {
    logger.warn('配置损坏，使用默认配置 defaultDirect 进行兜底')
    return defaultDirect
  }

  /** 清空缓存，因为配置已更新 */
  lruCache.clear()

  const result: ConfigDirect = {}
  /** 先标准化全局配置 */
  const globalCfg = compatDirectItem(config.global, defaultCfg)
  result.global = globalCfg

  for (const key of Object.keys(config)) {
    if (key === 'global') continue
    const value = config[key]
    if (typeof value !== 'object') continue
    result[key] = compatDirectItem(value, globalCfg)
  }

  return result
}

/**
 * 兼容性处理单个频道私聊配置
 * @param cfg 频道私聊配置
 * @param globalCfg 默认配置
 */
const compatDirectItem = (
  cfg: Partial<DirectConfigRuntime>,
  globalCfg: DirectConfigRuntime
): DirectConfigRuntime => {
  const inherit = checkType('boolean', cfg.inherit, globalCfg.inherit)
  const cd = checkType('number', cfg.cd, inherit ? globalCfg.cd : defaultCfg.cd)
  const mode = checkType('number', cfg.mode, inherit ? globalCfg.mode : defaultCfg.mode)

  return {
    inherit,
    cd,
    mode,
    alias: convertAliasToRegex(cfg.alias),
    enable: filterStringArray(cfg.enable),
    disable: filterStringArray(cfg.disable),
  }
}

/**
 * 获取指定频道私聊的配置
 * @description 通过优先级规则获取最终配置
 * @param config 频道私聊配置
 * @param selfId 机器人ID
 * @param guildId 频道ID
 * @param userId 用户ID
 * @returns 频道私聊配置
 */
const getConfig = (
  config: ConfigDirect,
  selfId: string,
  userId: string,
  guildId?: string
): DirectConfigRuntime => {
  const keys =
    guildId
      ? [
        `Bot:${selfId}:${guildId}:${userId}`,
        `Bot:${selfId}:${guildId}`,
        `Bot:${selfId}`,
        `guild:${guildId}`,
        'global',
      ]
      : [
        `Bot:${selfId}:${userId}`,
        `Bot:${selfId}`,
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
  return defaultDirect.global
}

/**
 * 频道私聊配置 API
 */
export const direct = {
  /**
   * 默认频道私聊配置
   */
  default: defaultDirect,
  /**
   * 兼容性处理频道私聊配置
   */
  compat: compatDirect,
  /**
   * 兼容性处理单个频道私聊配置项
   */
  compatItem: compatDirectItem,
  /**
   * 获取指定频道私聊的配置
   */
  get: getConfig,
  /**
   * 清空LRU缓存
   */
  clearCache: () => lruCache.clear(),
}
