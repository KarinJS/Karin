import { setStr } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFileSync } from '../fs/require'

import type { Groups } from '@/types/config'

const FILE = `${configPath}/groups.json`

/**
 * 缓存管理
 */
const count = {} as Record<string, {
  /** 上一分钟调用次数 */
  start: number,
  /** 当前调用次数 */
  count: number
}>

/**
 * 合并配置
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
const lint = async (
  defData: Record<string, any>,
  data: Groups
): Promise<Groups> => {
  const list = defData as Groups

  await Promise.all(Object.keys(data).map(async (key) => {
    list[key] = {
      key,
      cd: Number(data[key].cd) ?? defData.default.cd,
      userCD: Number(data[key].userCD) ?? defData.default.userCD,
      mode: Number(data[key].mode) as Groups['default']['mode'] ?? defData.default.mode,
      alias: setStr(Array.isArray(data[key].alias) ? data[key].alias : []),
      enable: setStr(Array.isArray(data[key].enable) ? data[key].enable : []),
      disable: setStr(Array.isArray(data[key].disable) ? data[key].disable : []),
      memberDisable: setStr(Array.isArray(data[key].memberDisable) ? data[key].memberDisable : []),
      memberEnable: setStr(Array.isArray(data[key].memberEnable) ? data[key].memberEnable : []),
    }
  }))

  return list
}

let cache = await lint(defaultConfig.groups, requireFileSync<Groups>(FILE))

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

/**
 * 获取好友配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => {
  /** 优先走缓存 */
  if (cache[keys[0]]) {
    count[keys[0]].count++
    return cache[keys[0]]
  }

  for (const index in keys) {
    if (cache[keys[index]]) {
      if (index === '0') {
        /** 如果是索引0 说明有键有对应的缓存 */
        count[keys[index]] = { start: 0, count: 1 }
      } else {
        /** 如果索引不为0 说明有键没有对应的缓存 此时创建缓存 */
        count[keys['0']] = { start: 0, count: 1 }
        cache[keys['0']] = cache[keys[index]]
      }

      return cache[keys[index]]
    }
  }

  return cache.default
}

watch<Groups>(FILE, async (_, data) => {
  cache = await lint(defaultConfig.groups, data)
})

setInterval(() => {
  Object.keys(count).forEach((key) => {
    if (count[key].count - count[key].start < 10) {
      delete count[key]
      delete cache[key]
    } else {
      count[key].start = count[key].count
    }
  })
}, 60000)
