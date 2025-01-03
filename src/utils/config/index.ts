import fs from '@/utils/fs/main'
import * as root from '@root'
import { setPort, setVersion } from '@/env'
import { updateHttpBotToken } from '@/core/service/server'
import {
  cache,
  setStr,
  getFriendOrDirectCache,
  getGroupOrGuildCache,
  setFriendOrDirectCache,
  setGroupOrGuildCache,
} from './cache'

import type {
  ConfigMap,
  FriendDirect,
  GroupGuild,
  Package,
} from '@/types/config'

/** node-karin的package */
export const pkg = () => fs.requireFileSync<Package>(root.karinDir + '/package.json')
/** http端口 */
export const port = () => cache.file.server.port
/** host */
export const host = () => cache.file.server.host
/** 根路由文案 */
export const rootMsg = () => cache.file.server.rootMsg
/** 主人列表 */
export const master = () => cache.file.config.master || []
/** 管理员列表 */
export const admin = () => cache.file.config.admin || []
/** 超时时间 */
export const timeout = () => cache.file.server.timeout || 60
/** Redis 配置 */
export const redis = () => getMergeYaml('redis')
/** Pm2配置 */
export const pm2 = () => getMergeYaml('pm2')
/** 鉴权秘钥 */
export const authKey = () => server().authKey
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
 * @param isRefresh 是否刷新缓存
 */
export const getMergeYaml = <T extends keyof ConfigMap> (name: T, isRefresh = false): ConfigMap[T] => {
  if (isRefresh) {
    const defaultCfg = getYaml(name, 'default', true)
    const userCfg = getYaml(name, 'user', true)
    return { ...defaultCfg, ...userCfg }
  }

  const defaultCfg = getYaml(name, 'default', false)
  const userCfg = getYaml(name, 'user', false)
  return { ...defaultCfg.value, ...userCfg.value }
}

type GetYaml<T extends keyof ConfigMap, K> = K extends true ? ConfigMap[T] : fs.Watch<ConfigMap[T]>

/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 * @param isRefresh 是否刷新缓存
 */
export const getYaml = <
  T extends keyof ConfigMap,
  K extends boolean = false
> (name: T, type: 'user' | 'default', isRefresh?: K): GetYaml<T, K> => {
  const file = `${type === 'default' ? root.defaultConfigPath : root.configPath}/${name}.yaml`

  if (type === 'default') {
    return fs.requireFileSync<ConfigMap[T]>(file, { force: isRefresh }) as GetYaml<T, K>
  }

  if (isRefresh) {
    return fs.requireFileSync<ConfigMap[T]>(file, { force: true }) as GetYaml<T, K>
  }

  const fnc = (name: T) => {
    if (name === 'config') {
      return (old: any, data: any) => {
        updateLevel(data?.log4jsCfg?.level || 'info')
        cache.file.config = data
      }
    }

    if (name === 'groupGuild') {
      return () => {
        cache.groupGuild = {}
      }
    }

    if (name === 'friendDirect') {
      return () => {
        cache.friendDirect = {}
      }
    }

    if (name === 'server') {
      return (old: any, data: any) => {
        if (!data.onebotHttp || !Array.isArray(data.onebotHttp)) {
          logger.debug('没有配置onebotHttp 已跳过')
          return true
        }

        for (let { selfId, api, token } of data.onebotHttp) {
          if (selfId === 'default') {
            continue
          }
          selfId = String(selfId)
          token = String(token)
          if (!selfId || !api || !api.startsWith('http')) {
            logger.bot('error', selfId, '请配置正确的 onebot http 信息')
            continue
          }
          updateHttpBotToken(selfId, token)
        }

        cache.file.server = data
      }
    }

    return () => true
  }

  return fs.watch<ConfigMap[T]>(
    file,
    fnc(name)
  ) as GetYaml<T, K>
}

/**
 * Config 配置
 * @param isRefresh 是否刷新缓存
 */
export const config = (isRefresh = false) => {
  if (!isRefresh && cache.file.config) {
    return cache.file.config
  }
  const data = getMergeYaml('config', isRefresh)
  data.admin = setStr(data.admin)
  data.master = setStr(data.master)
  data.private.disable = setStr(data.private.disable)
  Object.keys(data.enable).forEach((key) => {
    data.enable[key as keyof typeof data.enable] = setStr(data.enable[key as keyof typeof data.enable])
  })
  cache.file.config = data
  return data
}

/**
 * Server 配置
 * @param isRefresh 是否刷新缓存
 */
export const server = (isRefresh = false) => {
  if (!isRefresh && cache.file.server) {
    return cache.file.server
  }

  const data = getMergeYaml('server', isRefresh)
  cache.file.server = data
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
  const data = getMergeYaml('config')
  logger.level = data.log4jsCfg.level || 'info'
}

/**
 * 获取群配置、频道配置
 * @param groupOrGuildId 群号或频道ID
 * @param selfIdOrChannelId 机器人ID或子频道ID
 * @param selfId 机器人ID
 * @param isRefresh 是否刷新缓存
 */
const getGroupOrGuildCfg = (groupOrGuildId: string, selfIdOrChannelId?: string, selfId?: string, isRefresh = false): GroupGuild => {
  try {
    const cache = getGroupOrGuildCache(groupOrGuildId, selfIdOrChannelId, selfId)
    if (!isRefresh && cache.ok) return cache.config!

    const data = getMergeYaml('groupGuild', isRefresh)
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
 * @param isRefresh 是否刷新缓存
 */
const getFriendOrDirectCfg = (userId: string, selfId?: string, isRefresh = false): FriendDirect => {
  try {
    const cache = getFriendOrDirectCache(userId, selfId)
    if (!isRefresh && cache.ok) return cache.config!

    const data = getMergeYaml('friendDirect', isRefresh)
    return setFriendOrDirectCache(cache.keys!, data)
  } catch (error) {
    logger.error(error)
    return cache.friendCfgDef
  }
}

/**
 * @description 修改框架配置
 * @param name 文件名称
 * @param data 配置数据
 */
export const setYaml = <T extends keyof ConfigMap> (name: T, data: Record<string, any>) => {
  const file = `${root.configPath}/${name}.yaml`
  const comment = `${root.commentPath}/${name}.json`

  if (!fs.existsSync(file)) return false
  fs.save(file, data, fs.existsSync(comment) ? comment : undefined)
  return true
}

/** 每次启动清空临时文件夹 */
const clearTemp = () => {
  const list = [root.htmlPath, root.consolePath]
  list.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.rmSync(file, { recursive: true, force: true })
    }
  })
}

/**
 * @description 创建基本配置
 */

/** 初始化 */
export const init = () => {
  fs.copyConfigSync(root.defaultConfigPath, root.configPath, ['.yaml'])
  config()
  server()
  setPort(port())
  setVersion(pkg().version)
  clearTemp()
  const list = [
    root.basePath,
    root.configPath,
    root.dataPath,
    root.tempPath,
    root.htmlPath,
    root.consolePath,
  ]
  list.map(v => fs.existToMkdirSync(v))
}
