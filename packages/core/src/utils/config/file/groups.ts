import fs from 'node:fs'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import { defaultConfig } from '../default'
import { isNumberInArray, strToBool } from '@/utils/common'
import { clearCache, createCount, getCacheCfg } from '../tools'

import type { Groups, GroupsObjectValue } from '@/types/config'

/** 缓存调用统计 */
const count = createCount()

/** groups.json 静态缓存(也就是文件原始数据) */
let staticCache: Record<string, GroupsObjectValue>
/** groups.json 动态缓存(obj映射 动态生成) */
let dynamicCache: Record<string, GroupsObjectValue>

/**
 * 获取群聊和频道配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(dynamicCache, count, keys)

/**
 * 判断是否为旧版本配置文件
 */
const isOld = (obj: Record<string, any>): obj is Record<string, Omit<GroupsObjectValue, 'key'>> => {
  if (Array.isArray(obj)) return false
  /** 如果是对象、键的值为对象则是旧版本 */
  return Object.keys(obj).every(key => typeof obj[key] === 'object')
}

/**
 * 旧版本配置文件迁移
 * @param file 配置文件路径
 * @param data 配置数据
 */
const migrate = (
  file: string,
  data: Record<string, Omit<GroupsObjectValue, 'key'>>
): Record<string, GroupsObjectValue> => {
  const list: Groups = []

  /** 转换为新版本 */
  Object.entries(data).forEach(([key, value]) => {
    list.push({ key, ...value })
  })

  /** 写入新版本 */
  fs.writeFileSync(file, JSON.stringify(list, null, 2))
  logger.mark('[migrate] 迁移 groups.json 配置文件成功')
  return format(list)
}

/**
 * 格式化并合并配置
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
const format = (data: Groups): Record<string, GroupsObjectValue> => {
  /** 初始: 全局配置 */
  const defaultGlobal = defaultConfig.groups[1]
  /** 初始: 群聊默认配置 */
  const defaultGroup = defaultConfig.groups[0]

  /** 用户: 全局配置 */
  const userGlobal = data.find(item => item.key === 'global') || defaultGlobal
  /** 用户: 群聊默认配置 */
  const userGroup = data.find(item => item.key === 'default') || defaultGroup

  /**
   * 合并全局配置或群聊默认配置
   * @param key 键
   * @param args 配置
   * @returns 合并后的配置
   */
  const merge = (
    key: string,
    ...args: GroupsObjectValue[]
  ): GroupsObjectValue => {
    return {
      key,
      cd: isNumberInArray(args.map(item => item.cd), 0),
      userCD: isNumberInArray(args.map(item => item.userCD), 0),
      mode: isNumberInArray(args.map(item => item.mode), 0),
      alias: strToBool.arrayString(args.map(item => item.alias)),
      enable: strToBool.arrayString(args.map(item => item.enable)),
      disable: strToBool.arrayString(args.map(item => item.disable)),
      member_enable: strToBool.arrayString(args.map(item => item.member_enable)),
      member_disable: strToBool.arrayString(args.map(item => item.member_disable)),
    }
  }

  /** 合并后的全局配置 */
  const global: GroupsObjectValue = merge('global', userGlobal, defaultGlobal)
  /** 合并后的群聊默认配置 */
  const def: GroupsObjectValue = merge('default', userGroup, defaultGroup)

  /** 将缓存修改为kv格式 方便调用 */
  const kv: Record<string, GroupsObjectValue> = {
    global,
    default: def,
  }

  /**
   * 将用户配置中的每个配置合并到kv中
   */
  data.forEach((item) => {
    kv[item.key] = merge(item.key, item, kv.global, kv.default)
  })

  return kv
}

/**
 * @internal
 * @description 初始化群聊和频道配置
 * @param dir 配置文件根目录
 */
const initGroups = async (dir: string) => {
  const name = 'groups.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Groups>(file, { type: 'json' })
  staticCache = isOld(data) ? migrate(file, data) : format(data)
  dynamicCache = format(data)

  watch<Groups>(file, async (old, data) => {
    staticCache = isOld(data) ? migrate(file, data) : format(data)
    dynamicCache = staticCache

    const options = { file: name, old, data: dynamicCache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })

  /** 定时清理缓存 */
  clearCache<GroupsObjectValue>(count, staticCache, dynamicCache)
}

/**
 * @public 公开Api
 * @description 获取群聊、频道配置
 * @returns 群聊、频道配置
 */
export const groups = () => {
  return {
    get: () => dynamicCache,
  }
}

/**
 * @public 公开Api
 * @description 获取指定群聊配置
 * @param groupId 群号
 * @param selfId 机器人ID
 */
export const getGroupCfg = (
  groupId: string,
  selfId: string
): Groups[number] => {
  const keys = [
    `Bot:${selfId}:${groupId}`,
    `Bot:${selfId}`,
    groupId,
    'global',
    'default',
  ]
  return getCfg(keys)
}

/**
 * @public 公开Api
 * @description 获取指定频道配置
 * @param guildId 频道ID
 * @param channelId 子频道ID
 * @param selfId 机器人ID
 */
export const getGuildCfg = (
  guildId: string,
  channelId: string,
  selfId: string
): Groups[number] => {
  const keys = [
    `Bot:${selfId}:${guildId}:${channelId}`,
    `Bot:${selfId}:${guildId}`,
    `Bot:${selfId}`,
    guildId,
    channelId,
    'global',
    'default',
  ]
  return getCfg(keys)
}

/**
 * @web 获取配置文件 不走缓存
 * @param dir 配置文件根目录
 * @returns 配置文件数据
 */
export const getGroupsFileData = (dir: string) => {
  const name = 'groups.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Groups>(file, { type: 'json' })
  return isOld(data) ? migrate(file, data) : format(data)
}

export default initGroups
