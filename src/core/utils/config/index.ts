import { watch } from './watch'
import { configKey } from './types'
import { karinDir } from '@/init/dir'
import { isExists } from '../fs/exists'
import { requireFileSync } from '@/utils'
import { copyConfigSync } from './initCfg'
import { defaultConfigPath, configPath, basePath, dataPath, tempPath } from '@/utils/fs/root'

import type {
  ConfigMap,
  PackageType,
  GroupGuildFileCfg,
  FriendDirectFileCfg,
} from './types'

import {
  cache,
  getFriendOrDirectCache,
  getGroupOrGuildCache,
  setFriendOrDirectCache,
  setGroupOrGuildCache,
  setStr,
} from './cache'

/** node-karin的package */
export const pkg = requireFileSync<PackageType>(karinDir + '/package.json')
/** http端口 */
export const port = () => cache.file[configKey.SERVER].port
/** 主人列表 */
export const master = () => cache.file[configKey.CONFIG].master || []
/** 管理员列表 */
export const admin = () => cache.file[configKey.CONFIG].admin || []
/** 超时时间 */
export const timeout = () => cache.file[configKey.SERVER].timeout || 60
/** Redis 配置 */
export const redis = () => getConfig('redis')
/** Pm2配置 */
export const pm2 = () => getConfig('pm2')
/** Config */
export const config = () => {
  if (cache.file[configKey.CONFIG]) {
    return cache.file[configKey.CONFIG]
  }
  const data = getConfig('config')
  data.admin = setStr(data.admin)
  data.master = setStr(data.master)
  data.private.disable = setStr(data.private.disable)
  Object.keys(data.enable).forEach((key) => {
    data.enable[key as keyof typeof data.enable] = setStr(data.enable[key as keyof typeof data.enable])
  })
  cache.file[configKey.CONFIG] = data
  return data
}

/**
 * 获取好友配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getFriendCfg = (userId: string, selfId?: string) => getFriendOrDirectCfg(userId, selfId)
/**
 * 获取频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getDirectCfg = (userId: string, selfId?: string) => getFriendOrDirectCfg(userId, selfId)
/**
 * 获取指定群配置
 * @param groupId 群号
 * @param selfId 机器人ID
 */
export const getGroupCfg = (groupId: string, selfId?: string) => getGroupOrGuildCfg(groupId, selfId)
/**
 * 获取指定频道配置
 * @param guildId 频道ID
 * @param channelId 子频道ID
 * @param selfId 机器人ID
 */
export const getGuildCfg = (guildId: string, channelId?: string, selfId?: string) => {
  return getGroupOrGuildCfg(guildId, channelId, selfId)
}

/**
 * 获取配置 包含默认配置和用户配置
 * @param name 文件名称
 */
export const getConfig = <T extends keyof ConfigMap> (name: T): ConfigMap[T] => {
  const defaultCfg = getUserYaml(name, 'default')
  const userCfg = getUserYaml(name, 'user')
  return { ...defaultCfg, ...userCfg }
}

/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 */
export const getUserYaml = <T extends keyof ConfigMap> (name: T, type: 'user' | 'default'): ConfigMap[T] => {
  const file = `${type === 'default' ? defaultConfigPath : configPath}/${name}.yaml`
  /** tips: 不设置永不过期的缓存是因为group这些配置会另外解析缓存 */
  return requireFileSync(file)
}

/** Server 配置 */
export const server = () => {
  if (cache.file[configKey.SERVER]) {
    return cache.file[configKey.SERVER]
  }
  const data = getConfig('server')
  cache.file[configKey.SERVER] = data
  return data
}

/**
 * 更新日志等级
 * @param level 日志等级
 */
export const updateLevel = (level?: string) => {
  if (level) {
    logger.level = level
    return
  }
  const data = getConfig('config')
  logger.level = data.log4jsCfg.level || 'info'
}

/**
 * 获取群配置、频道配置
 * @param groupOrGuildId 群号或频道ID
 * @param selfIdOrChannelId 机器人ID或子频道ID
 * @param selfId 机器人ID
 */
const getGroupOrGuildCfg = (groupOrGuildId: string, selfIdOrChannelId?: string, selfId?: string): GroupGuildFileCfg => {
  try {
    const cache = getGroupOrGuildCache(groupOrGuildId, selfIdOrChannelId, selfId)
    if (cache.ok) return cache.config!

    const data = getConfig('groupGuild')
    return setGroupOrGuildCache(cache.keys!, data)
  } catch (error) {
    logger.error(error)
    return cache.groupCfgDef
  }
}

/**
 * 获取好友、频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
const getFriendOrDirectCfg = (userId: string, selfId?: string): FriendDirectFileCfg => {
  try {
    const cache = getFriendOrDirectCache(userId, selfId)
    if (cache.ok) return cache.config!

    const data = getConfig('friendDirect')
    return setFriendOrDirectCache(cache.keys!, data)
  } catch (error) {
    logger.error(error)
    return cache.friendCfgDef
  }
}

/**
 * 获取自定义配置yaml
 * @param file 文件路径
 * @param watch 是否监听文件变动 | 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
 */
export const getYaml: {
  /**
   * 获取自定义配置yaml
   * @description 此方法默认监听文件变动
   * @param file 文件路径
   * @param watch 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
   */
  (file: string, watch: (file: string) => Promise<boolean>): any;
  /**
   * 获取自定义配置yaml
   * @description 此方法由框架管理缓存
   * @param file 文件路径
   * @param isWatch 是否监听文件 由框架来管理缓存 发生变动自动清除缓存
   */
  (file: string, isWatch: boolean): any
} = (file: string, fnc?: ((file: string) => Promise<boolean>) | boolean): any => {
  if (typeof fnc === 'function') {
    watch(file, fnc)
  } else if (typeof fnc === 'boolean' && watch) {
    watch(file, () => true)
  }

  return requireFileSync(file)
}

/** 初始化 */
export const init = () => {
  config()
  const list = [basePath, configPath, dataPath, tempPath]
  list.map(v => isExists(v))

  copyConfigSync(defaultConfigPath, configPath, ['.yaml'])
}
