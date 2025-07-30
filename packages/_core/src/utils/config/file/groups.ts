import fs from 'node:fs'
import lodash from 'lodash'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import { defaultConfig } from '../default'
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
  return lodash.every(obj, value => typeof value === 'object')
}

/**
 * 从数组中查找第一个数字，如果没有则返回默认值
 * @param arr 数组
 * @param defaultValue 默认值
 * @returns 找到的数字或默认值
 */
const findFirstNumber = <T = number> (arr: unknown[], defaultValue: number = 0): T => {
  const num = lodash.first(lodash.filter(arr, item => typeof item === 'number'))
  return (num !== undefined ? num : defaultValue) as T
}

/**
 * 合并多个数组并去重
 * @param arrays 多个数组
 * @returns 合并后的数组
 */
const mergeArrays = <T> (...arrays: unknown[]): T[] => {
  const validArrays = lodash.filter(arrays, Array.isArray)
  return lodash.uniq(lodash.flatten(validArrays)) as T[]
}

/**
 * 从数组中提取字符串数组
 * @param arrays 数组
 * @returns 字符串数组
 */
const extractStringArray = (arrays: unknown[]): string[] => {
  for (const item of arrays) {
    if (!Array.isArray(item)) continue
    return lodash.filter<string>(item, value => typeof value === 'string' && value.length > 0)
  }
  return []
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
  lodash.forEach(lodash.entries(data), ([key, value]) => {
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
  const userGlobal = lodash.find(data, item => item.key === 'global') || defaultGlobal
  /** 用户: 群聊默认配置 */
  const userGroup = lodash.find(data, item => item.key === 'default') || defaultGroup

  /**
   * 合并全局配置或群聊默认配置
   * @param key 键
   * @param inherit 是否继承全局配置
   * @param args 配置
   * @returns 合并后的配置
   * @description 合并配置 如果args有3个参数 则说明索引1是全局配置 应该进行继承
   */
  const mergeConfigs = (
    key: string,
    inherit: boolean,
    ...args: GroupsObjectValue[]
  ): GroupsObjectValue => {
    if (typeof inherit !== 'boolean') {
      inherit = true
    }

    let alias = lodash.map(args, item => item.alias)
    let enable = lodash.map(args, item => item.enable)
    let disable = lodash.map(args, item => item.disable)
    let memberEnable = lodash.map(args, item => item.member_enable)
    let memberDisable = lodash.map(args, item => item.member_disable)

    if (inherit && args.length === 3) {
      /** 需要将01合并 */
      alias = [mergeArrays(alias[0], alias[1]), alias[2]]
      enable = [mergeArrays(enable[0], enable[1]), enable[2]]
      disable = [mergeArrays(disable[0], disable[1]), disable[2]]
      memberEnable = [mergeArrays(memberEnable[0], memberEnable[1]), memberEnable[2]]
      memberDisable = [mergeArrays(memberDisable[0], memberDisable[1]), memberDisable[2]]
    }

    return {
      key,
      inherit,
      cd: findFirstNumber(lodash.map(args, item => item.cd), 0),
      userCD: findFirstNumber(lodash.map(args, item => item.userCD), 0),
      mode: findFirstNumber(lodash.map(args, item => item.mode), 0),
      alias: extractStringArray(alias),
      enable: extractStringArray(enable),
      disable: extractStringArray(disable),
      member_enable: extractStringArray(memberEnable),
      member_disable: extractStringArray(memberDisable),
    }
  }

  /** 合并后的全局配置 */
  const global: GroupsObjectValue = mergeConfigs(
    'global',
    true,
    userGlobal,
    defaultGlobal
  )
  /** 合并后的群聊默认配置 */
  const def: GroupsObjectValue = mergeConfigs(
    'default',
    true,
    userGroup,
    defaultGroup
  )

  /** 将缓存修改为kv格式 方便调用 */
  const kv: Record<string, GroupsObjectValue> = {
    global,
    default: def,
  }

  /**
   * 将用户配置中的每个配置合并到kv中
   */
  lodash.forEach(data, (item) => {
    kv[item.key] = mergeConfigs(item.key, item.inherit, item, kv.global, kv.default)
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
  dynamicCache = lodash.cloneDeep(staticCache)

  watch<Groups>(file, async (old, data) => {
    staticCache = isOld(data) ? migrate(file, data) : format(data)
    dynamicCache = lodash.cloneDeep(staticCache)

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
    get: () => lodash.cloneDeep(dynamicCache),
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
