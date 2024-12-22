import type {
  CacheType,
  FileCache,
  FriendDirectFileCfg,
  GroupGuildFileCfg,
} from './types'

/** 缓存对象 */
export const cache: CacheType = {
  file: {} as FileCache,
  watcher: new Map(),
  groupGuild: {},
  friendDirect: {},
  friendCfgDef: {
    cd: 0,
    mode: 0,
    alias: [],
    enable: [],
    disable: [],
    get key () {
      return 'default'
    },
  },
  groupCfgDef: {
    cd: 0,
    userCD: 0,
    mode: 0,
    alias: [],
    enable: [],
    disable: [],
    memberDisable: [],
    memberEnable: [],
    get key () { return 'default' },
  },
}

/**
 * 读取群、频道配置文件缓存
 * @param groupOrGuildId 群号或频道ID
 * @param selfIdOrChannelId 机器人ID或子频道ID
 * @param selfId 机器人ID
 */
export const getGroupOrGuildCache = (groupOrGuildId: string, selfIdOrChannelId?: string, selfId?: string) => {
  let keys
  if (selfId) {
    keys = [
      `Bot:${selfId}:${groupOrGuildId}:${selfIdOrChannelId}`,
      `Bot:${selfId}:${groupOrGuildId}`,
      `Bot:${selfId}`,
      groupOrGuildId,
      'default',
    ]
  } else {
    keys = selfId
      ? [`Bot:${selfId}:${groupOrGuildId}`, `Bot:${selfId}`, groupOrGuildId, 'default']
      : [groupOrGuildId, 'default']
  }

  for (const key of keys) {
    if (cache.groupGuild[key]) {
      cache.groupGuild[key].count++
      return { ok: true, config: cache.groupGuild[key].config }
    }
  }

  return { ok: false, keys }
}

/**
 * 统一转换为字符串数组
 * @param data 数据
 */
export const setStr = (data: any[]) => {
  try {
    return data.map((v: string) => String(v)) || []
  } catch {
    return []
  }
}

/**
 * 初始化群、频道配置 统一用户id为str
 * @param config 配置
 */
export const initGroupOrGuildCfg = (config: GroupGuildFileCfg) => {
  config.alias = setStr(config.alias)
  config.memberEnable = setStr(config.memberEnable)
  config.memberDisable = setStr(config.memberDisable)
  return config
}

/**
 * 加上get value属性
 * @param data 数据
 * @param key 键
 */
export const addValue = (data: any, key: string) => {
  Object.defineProperty(data, 'key', {
    get () { return key },
    enumerable: false,
    configurable: false,
  })
}

/**
 * 缓存并返回群、频道配置文件
 * @param keys 键组
 * @param data 配置
 */
export const setGroupOrGuildCache = (keys: string[], data: Record<string, GroupGuildFileCfg>) => {
  for (const key of keys) {
    if (cache.groupGuild[key]) {
      if (!data[key]) continue
      const config = initGroupOrGuildCfg(data[key])
      addValue(config, key)
      cache.groupGuild[key] = { start: 0, count: 1, config }
      return config
    }
  }

  const config = initGroupOrGuildCfg(data['default'] || cache.groupCfgDef)
  cache.groupGuild['default'] = { start: 0, count: 1, config }
  return config
}

/**
 * 初始化好友、频道私信配置 统一用户id为str
 * @param config 配置
 */
export const initFriendDirectCfg = (config: FriendDirectFileCfg) => {
  config.alias = setStr(config.alias)
  return config
}

/**
 * 读取好友、频道私信配置文件缓存
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getFriendOrDirectCache = (userId: string, selfId?: string) => {
  let keys
  if (selfId) {
    keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'default']
  } else {
    keys = [userId, 'default']
  }

  for (const key of keys) {
    if (cache.friendDirect[key]) {
      cache.friendDirect[key].count++
      return { ok: true, config: cache.friendDirect[key].config }
    }
  }

  return { ok: false, keys }
}

/**
 * 缓存并返回好友、频道私信配置文件
 * @param keys 键组
 * @param data 配置
 */
export const setFriendOrDirectCache = (keys: string[], data: Record<string, FriendDirectFileCfg>) => {
  for (const key of keys) {
    if (cache.friendDirect[key]) {
      if (!data[key]) continue
      const config = initFriendDirectCfg(data[key])
      addValue(config, key)
      cache.friendDirect[key] = { start: 0, count: 1, config }
      return config
    }
  }

  const config = initFriendDirectCfg(data['default'] || cache.friendCfgDef)
  cache.friendDirect['default'] = { start: 0, count: 1, config }
  return config
}

/**
 * 每分钟检查调用次数 如果1分钟内调用次数不超过10次则清空缓存
 */
setInterval(() => {
  for (const key in cache.groupGuild) {
    if (cache.groupGuild[key].count - cache.groupGuild[key].start < 10) {
      delete cache.groupGuild[key]
    } else {
      cache.groupGuild[key].start = cache.groupGuild[key].count
    }
  }
  for (const key in cache.friendDirect) {
    if (cache.friendDirect[key].count - cache.friendDirect[key].start < 10) {
      delete cache.friendDirect[key]
    } else {
      cache.friendDirect[key].start = cache.friendDirect[key].count
    }
  }
}, 60000)
