import fs from 'node:fs/promises'
import { watch, type Watch } from './watch'
import { configKey } from './types'
import { exists, existsSync } from '@/utils/fs'
import { requireFileSync } from '@/utils/fs/require'
import { copyConfigSync } from './initCfg'
import {
  basePath,
  dataPath,
  tempPath,
  karinDir,
  configPath,
  defaultConfigPath,
  commentPath,
  htmlPath,
  consolePath,
} from '@/utils/fs/root'

import type {
  ConfigMap,
  PackageType,
  GroupGuildFileCfg,
  FriendDirectFileCfg,
} from './types'

import {
  cache,
  setStr,
  getFriendOrDirectCache,
  getGroupOrGuildCache,
  setFriendOrDirectCache,
  setGroupOrGuildCache,
} from './cache'
import { updateHttpBotToken } from '@/service/server'
import { setPort, setVersion } from '@/env/env'
import { save } from '@/utils/fs/yaml'
import { mkdir } from '@/utils/fs/mkdir'

/** node-karin的package */
export const pkg = () => requireFileSync<PackageType>(karinDir + '/package.json')
/** http端口 */
export const port = () => cache.file[configKey.SERVER].port
/** host */
export const host = () => cache.file[configKey.SERVER].host
/** 根路由文案 */
export const rootMsg = () => cache.file[configKey.SERVER].rootMsg
/** 主人列表 */
export const master = () => cache.file[configKey.CONFIG].master || []
/** 管理员列表 */
export const admin = () => cache.file[configKey.CONFIG].admin || []
/** 超时时间 */
export const timeout = () => cache.file[configKey.SERVER].timeout || 60
/** Redis 配置 */
export const redis = () => getMergeYaml('redis')
/** Pm2配置 */
export const pm2 = () => getMergeYaml('pm2')

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

/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 * @param isRefresh 是否刷新缓存
 */
export const getYaml = <
  T extends keyof ConfigMap,
  K extends boolean = false
> (name: T, type: 'user' | 'default', isRefresh?: K): K extends true ? ConfigMap[T] : Watch<ConfigMap[T]> => {
  const file = `${type === 'default' ? defaultConfigPath : configPath}/${name}.yaml`

  if (type === 'default') {
    return requireFileSync<ConfigMap[T]>(file, { force: isRefresh }) as K extends true ? ConfigMap[T] : Watch<ConfigMap[T]>
  }

  if (isRefresh) {
    return requireFileSync<ConfigMap[T]>(file, { force: true }) as K extends true ? ConfigMap[T] : Watch<ConfigMap[T]>
  }

  const fnc = (name: T) => {
    if (name === 'config') {
      return (old: any, data: any) => updateLevel(data?.log4jsCfg?.level || 'info')
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
      }
    }

    return () => true
  }

  return watch<ConfigMap[T]>(file, fnc(name)) as K extends true ? ConfigMap[T] : Watch<ConfigMap[T]>
}

/**
 * Config 配置
 * @param isRefresh 是否刷新缓存
 */
export const config = (isRefresh = false) => {
  if (!isRefresh && cache.file[configKey.CONFIG]) {
    return cache.file[configKey.CONFIG]
  }
  const data = getMergeYaml('config')
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
 * Server 配置
 * @param isRefresh 是否刷新缓存
 */
export const server = (isRefresh = false) => {
  if (!isRefresh && cache.file[configKey.SERVER]) {
    return cache.file[configKey.SERVER]
  }

  const data = getMergeYaml('server')
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
const getGroupOrGuildCfg = (groupOrGuildId: string, selfIdOrChannelId?: string, selfId?: string, isRefresh = false): GroupGuildFileCfg => {
  try {
    const cache = getGroupOrGuildCache(groupOrGuildId, selfIdOrChannelId, selfId)
    if (!isRefresh && cache.ok) return cache.config!

    const data = getMergeYaml('groupGuild')
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
const getFriendOrDirectCfg = (userId: string, selfId?: string, isRefresh = false): FriendDirectFileCfg => {
  try {
    const cache = getFriendOrDirectCache(userId, selfId)
    if (!isRefresh && cache.ok) return cache.config!

    const data = getMergeYaml('friendDirect')
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
  const file = `${configPath}/${name}.yaml`
  const comment = `${commentPath}/${name}.json`

  if (!existsSync(file)) return false
  if (existsSync(comment)) {
    save(file, data, comment)
    return
  }

  save(file, data)
  return true
}

/** 每次启动清空临时文件夹 */
const clearTemp = () => {
  const list = [htmlPath, consolePath]
  list.forEach(async (path) => {
    if (await exists(path)) {
      const files = await fs.readdir(path)
      for (const file of files) fs.unlink(`${path}/${file}`)
    }
  })
}

/**
 * @description 创建基本配置
 */

/** 初始化 */
export const init = () => {
  copyConfigSync(defaultConfigPath, configPath, ['.yaml'])
  config()
  server()
  setPort(port())
  setVersion(pkg().version)
  mkdir(htmlPath)
  mkdir(consolePath)
  clearTemp()
  const list = [basePath, configPath, dataPath, tempPath]
  list.map(v => existsSync(v))
}
