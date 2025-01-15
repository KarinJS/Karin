import { setStr } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFileSync } from '../fs/require'

import type { Privates } from '@/types/config'

const FILE = `${configPath}/privates.json`

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
  data: Privates
): Promise<Privates> => {
  const list = defData as Privates

  await Promise.all(Object.keys(data).map(async (key) => {
    list[key] = {
      key,
      cd: Number(data[key].cd) ?? defData.default.cd,
      mode: Number(data[key].mode) as Privates['default']['mode'] ?? defData.default.mode,
      alias: setStr(Array.isArray(data[key].alias) ? data[key].alias : []),
      enable: setStr(Array.isArray(data[key].enable) ? data[key].enable : []),
      disable: setStr(Array.isArray(data[key].disable) ? data[key].disable : []),
    }
  }))

  return list
}

let cache = await lint(defaultConfig.privates, requireFileSync<Privates>(FILE))

/**
 * 获取好友、频道私信配置
 * @returns 好友、频道私信配置
 */
export const privates = () => cache

/**
 * 获取指定好友配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getFriendCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'default']
  return getCfg(keys)
}

/**
 * 获取指定频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getDirectCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'default']
  return getCfg(keys)
}

/**
 * 获取指定配置
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

watch<Privates>(FILE, async (_, data) => {
  cache = await lint(defaultConfig.privates, data)
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
