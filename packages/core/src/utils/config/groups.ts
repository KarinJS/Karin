import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFile } from '../fs/require'
import { clearCache, createCount, getCacheCfg, setStr } from './tools'
import type { Groups, GroupsObjectValue } from '@/types/config'

/** 文件路径 */
const FILE = `${configPath}/groups.json`
/** 缓存调用统计 */
const count = createCount()

/** 缓存 去掉Promise */
let cache: Awaited<ReturnType<typeof merge>>

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
 */
const migrate = async (
  data: Record<string, Omit<GroupsObjectValue, 'key'>>
): Promise<Record<string, GroupsObjectValue>> => {
  const list: Groups = []
  /** 转换为新版本 */
  Object.entries(data).forEach(([key, value]) => {
    list.push({
      key,
      ...value,
    })
  })

  /** 写入新版本 */
  const fs = await import('node:fs')
  await fs.promises.writeFile(FILE, JSON.stringify(list, null, 2))
  logger.mark('[migrate] 迁移 groups.json 配置文件成功')
  return await merge(defaultConfig.groups, list)
}

/**
 * 合并配置
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
const merge = async (
  defData: Groups,
  data: Groups
): Promise<Record<string, GroupsObjectValue>> => {
  /** 处理缓存 方便调用 */
  const list: Record<string, GroupsObjectValue> = {
    default: defData[0],
  }

  await Promise.all(data.map(async (value) => {
    list[value.key] = {
      ...list.default,
      key: value.key,
      cd: Number(value.cd) ?? list.default.cd,
      userCD: Number(value.userCD) ?? list.default.userCD,
      mode: Number(value.mode) as GroupsObjectValue['mode'] ?? list.default.mode,
      alias: setStr(Array.isArray(value.alias) ? value.alias : list.default.alias),
      enable: setStr(Array.isArray(value.enable) ? value.enable : list.default.enable),
      disable: setStr(Array.isArray(value.disable) ? value.disable : list.default.disable),
      member_enable: setStr(Array.isArray(value.member_enable) ? value.member_enable : list.default.member_enable),
      member_disable: setStr(Array.isArray(value.member_disable) ? value.member_disable : list.default.member_disable),
    }
  }))

  return list
}

/** 初始化缓存 */
const data = await requireFile(FILE, { type: 'json' })
cache = isOld(data) ? await migrate(data) : await merge(defaultConfig.groups, data)

/** 监听文件变化 */
watch<Groups>(FILE, async (_, data) => {
  cache = await merge(defaultConfig.groups, data)
})

/** 定时清理缓存 */
clearCache(count, cache)

/**
 * 获取群聊和频道配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(cache, count, keys)

/**
 * 获取群聊、频道配置
 * @returns 群聊、频道配置
 */
export const groups = () => cache

/**
 * 获取指定群聊配置
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
 * 获取指定频道配置
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
