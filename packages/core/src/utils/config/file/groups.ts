import fs from 'node:fs'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import { defaultConfig } from '../default'
import { clearCache, createCount, getCacheCfg, mergeDegAndCfg } from '../tools'

import type { Groups, GroupsObjectValue } from '@/types/config'

/** 缓存调用统计 */
const count = createCount()

/** groups.json 缓存 */
let cache: Record<string, GroupsObjectValue>

/**
 * 获取群聊和频道配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(cache, count, keys)

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
  /** 将缓存修改为kv格式 方便调用 */
  const kv: Record<string, GroupsObjectValue> = {
    default: defaultConfig.groups[0],
  }

  data.forEach((value) => {
    kv[value.key] = mergeDegAndCfg(kv.default, value)
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
  cache = isOld(data) ? migrate(file, data) : format(data)

  watch<Groups>(file, async (old, data) => {
    cache = format(data)

    const options = { file: name, old, data: cache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })

  /** 定时清理缓存 */
  clearCache(count, cache)
}

/**
 * @public 公开Api
 * @description 获取群聊、频道配置
 * @returns 群聊、频道配置
 */
export const groups = () => cache

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
    'default',
  ]
  return getCfg(keys)
}

export default initGroups
