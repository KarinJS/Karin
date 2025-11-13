import { LRUCache } from '@karinjs/utils'
import { checkType, filterStringArray, convertAliasToRegex } from '../utils'

export interface FriendConfig {
  /**
   * 是否继承全局配置
   * @description
   * - true: 继承全局配置，缺失的配置将使用全局配置
   * - false: 不继承全局配置，缺失的配置将使用默认值 默认值不可变更
   * @default true
   */
  inherit: boolean
  /**
   * 好友冷却时间
   * @description 单位秒 好友场景下使用cd作为每个用户的冷却时间
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
 * 运行时好友配置（alias 已转换为 RegExp[]）
 */
export interface FriendConfigRuntime extends Omit<FriendConfig, 'alias'> {
  /**
   * 机器人别名正则表达式数组
   */
  alias: RegExp[]
}

/**
 * `friend.json` 文件类型
 * @description
 * key语法说明:
 * - `global`: 全局默认配置 下方所有配置均可继承此配置
 * - `Bot:self_id:user_id`: 指定机器人与指定好友的配置 `Bot` 为固定前缀
 * - `Bot:self_id`: 指定ID的机器人配置 `Bot` 为固定前缀
 * @example
 * ```json
 * {
 *  // 机器人123456789的全局好友配置
 *  "Bot:123456789": {
 *   "inherit": true,
 *   "cd": 2
 *  },
 *  // 机器人123456789与好友888888的配置
 *  "Bot:123456789:888888": {
 *   "mode": 1
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
export type ConfigFriend = Record<string, FriendConfigRuntime>

const defaultCfg: FriendConfigRuntime = {
  inherit: true,
  cd: 1,
  mode: 0,
  alias: [],
  enable: [],
  disable: [],
}

/**
 * 默认好友配置
 */
const defaultFriend: ConfigFriend = {
  global: defaultCfg,
}

/**
 * 好友配置LRU缓存
 */
const lruCache = new LRUCache<string, FriendConfigRuntime>(200, 0)

/**
 * 兼容性处理
 * @param config 好友配置
 * @param defaultConfig 默认配置
 */
const compatFriend = (config: ConfigFriend): ConfigFriend => {
  /** 兜底 */
  if (typeof config !== 'object' || config === null) {
    logger.warn('配置损坏，使用默认配置 defaultFriend 进行兜底')
    return defaultFriend
  }

  /** 清空缓存，因为配置已更新 */
  lruCache.clear()

  const result: ConfigFriend = {}
  /** 先标准化全局配置 */
  const globalCfg = compatFriendItem(config.global, defaultCfg)
  result.global = globalCfg

  for (const key of Object.keys(config)) {
    if (key === 'global') continue
    const value = config[key]
    if (typeof value !== 'object') continue
    result[key] = compatFriendItem(value, globalCfg)
  }

  return result
}

/**
 * 兼容性处理单个好友配置
 * @param cfg 好友配置
 * @param globalCfg 默认配置
 */
const compatFriendItem = (
  cfg: Partial<FriendConfigRuntime>,
  globalCfg: FriendConfigRuntime
): FriendConfigRuntime => {
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
 * 获取指定好友的配置
 * @description 通过优先级规则获取最终配置
 * @param config 好友配置
 * @param selfId 机器人ID
 * @param userId 用户ID
 * @returns 好友配置
 */
const getConfig = (
  config: ConfigFriend,
  selfId: string,
  userId: string
): FriendConfigRuntime => {
  const keys = [
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
  return defaultFriend.global
}

/**
 * 好友配置 API
 */
export const friend = {
  /**
   * 默认好友配置
   */
  default: defaultFriend,
  /**
   * 兼容性处理好友配置
   */
  compat: compatFriend,
  /**
   * 兼容性处理单个好友配置项
   */
  compatItem: compatFriendItem,
  /**
   * 获取指定好友的配置
   */
  get: getConfig,
  /**
   * 清空LRU缓存
   */
  clearCache: () => lruCache.clear(),
}
