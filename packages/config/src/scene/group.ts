import { LRUCache } from '@karinjs/utils'
import { checkType, filterStringArray, convertAliasToRegex } from '../utils'

export interface GroupConfig {
  /**
   * 是否继承全局配置
   * @description
   * - true: 继承全局配置，缺失的配置将使用全局配置
   * - false: 不继承全局配置，缺失的配置将使用默认值 默认值不可变更
   * @default true
   */
  inherit: boolean
  /**
   * 当前群的全局冷却时间
   * @description 单位秒
   * @default 1
   */
  cd: number
  /**
   * 当前群每个用户的个人冷却时间
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
   * 群员单独白名单
   * @description 配置在此列表中的用户不受其他限制
   * @default []
   */
  member_enable: string[]
  /**
   * 群员单独黑名单
   * @description 配置在此列表中的用户将被禁止使用
   * @default []
   */
  member_disable: string[]
}

/**
 * 运行时群聊配置（alias 已转换为 RegExp[]）
 */
export interface GroupConfigRuntime extends Omit<GroupConfig, 'alias'> {
  /**
   * 机器人别名正则表达式数组
   */
  alias: RegExp[]
}

/**
 * `group.json` 文件类型
 * @description
 * key语法说明:
 * - `global`: 全局默认配置 下方所有配置均可继承此配置
 * - `group_id`: 指定群聊的配置 任何机器人在此群聊均使用此配置
 * - `Bot:self_id`: 指定ID的机器人配置 `Bot` 为固定前缀
 * - `Bot:self_id:group_id`: 指定机器人在指定群聊的配置 `Bot` 为固定前缀
 * @example
 * ```json
 * {
 *  // QQ号为123456789的机器人全局配置
 *  "Bot:123456789": {
 *   "inherit": true, // 继承全局配置
 *   "cd": 2 // 覆盖全局冷却时间为2秒
 *  },
 *  // QQ号为123456789的机器人在QQ群号为987654321的群聊中的配置
 *  "Bot:123456789:987654321": {
 *   "inherit": false, // 不继承全局配置 缺失的配置将使用默认值
 *   "mode": 2 // 仅回应管理员消息
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
 *     "enable": ["karin-plugin-test:app.js"],
 *     "disable": [],
 *     "member_enable": [],
 *     "member_disable": []
 *   }
 * }
 * ```
 */
export type ConfigGroup = Record<string, GroupConfigRuntime>

const defaultCfg: GroupConfigRuntime = {
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
 * 默认群聊配置
 */
const defaultGroup: ConfigGroup = {
  global: defaultCfg,
}

/**
 * 群聊配置LRU缓存
 */
const lruCache = new LRUCache<string, GroupConfigRuntime>(1000, 0)

/**
 * 兼容性处理
 * @param config 群聊配置
 * @param defaultConfig 默认配置
 */
const compatGroup = (config: ConfigGroup): ConfigGroup => {
  /** 兜底 */
  if (typeof config !== 'object' || config === null) {
    logger.warn('配置损坏，使用默认配置 defaultGroup 进行兜底')
    return defaultGroup
  }

  /** 清空缓存，因为配置已更新 */
  lruCache.clear()

  /** 先标准化全局配置 */
  const globalCfg = compatGroupItem(config.global, defaultCfg)
  const result: ConfigGroup = { global: globalCfg }

  for (const [key, value] of Object.entries(config)) {
    if (key === 'global') continue
    if (typeof value !== 'object') continue
    result[key] = compatGroupItem(value, globalCfg)
  }

  return result
}

/**
 * 兼容性处理单个群聊配置
 * @param cfg 群聊配置
 * @param globalCfg 默认配置
 */
const compatGroupItem = (
  cfg: Partial<GroupConfigRuntime>,
  globalCfg: GroupConfigRuntime
): GroupConfigRuntime => {
  const inherit = checkType('boolean', cfg.inherit, globalCfg.inherit)
  const inheritCfg = inherit ? globalCfg : defaultCfg
  return {
    inherit,
    cd: checkType('number', cfg.cd, inheritCfg.cd),
    mode: checkType('number', cfg.mode, inheritCfg.mode),
    user_cd: checkType('number', cfg.user_cd, inheritCfg.user_cd),
    alias: convertAliasToRegex(cfg.alias),
    enable: filterStringArray(cfg.enable),
    disable: filterStringArray(cfg.disable),
    member_enable: filterStringArray(cfg.member_enable),
    member_disable: filterStringArray(cfg.member_disable),
  }
}

/**
 * 获取指定群聊的配置
 * @description 通过优先级规则获取最终配置
 * @param config 群聊配置
 * @param selfId 机器人ID
 * @param groupId 群号
 * @returns 群聊配置
 */
const getConfig = (
  config: ConfigGroup,
  selfId: string,
  groupId: string
): GroupConfigRuntime => {
  const keys = [
    `Bot:${selfId}:${groupId}`,
    `Bot:${selfId}`,
    `group:${groupId}`,
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
  return defaultGroup.global
}

/**
 * 群聊配置 API
 */
export const group = {
  /**
   * 默认群聊配置
   */
  default: defaultGroup,
  /**
   * 兼容性处理群聊配置
   */
  compat: compatGroup,
  /**
   * 兼容性处理单个群聊配置项
   */
  compatItem: compatGroupItem,
  /**
   * 获取指定群聊的配置
   */
  get: getConfig,
  /**
   * 清空LRU缓存
   */
  clearCache: () => lruCache.clear(),
}
