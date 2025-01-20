import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFile } from '../fs/require'
import { clearCache, createCount, getCacheCfg, setStr } from './tools'
import type { Privates, PrivatesObjectValue } from '@/types/config'

/** 文件路径 */
const FILE = `${configPath}/privates.json`
/** 缓存调用统计 */
const count = createCount()

/** 缓存 去掉Promise */
let cache: Awaited<ReturnType<typeof merge>>

/**
 * 判断是否为旧版本配置文件
 */
const isOld = (obj: Record<string, any>): obj is Record<string, Omit<PrivatesObjectValue, 'key'>> => {
  if (Array.isArray(obj)) return false
  /** 如果是对象、键的值为对象则是旧版本 */
  return Object.keys(obj).every(key => typeof obj[key] === 'object')
}

/**
 * 旧版本配置文件迁移
 */
const migrate = async (
  data: Record<string, Omit<PrivatesObjectValue, 'key'>>
): Promise<Record<string, PrivatesObjectValue>> => {
  const list: Privates = []
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
  logger.mark('[migrate] 迁移 privates.json 配置文件成功')
  return await merge(defaultConfig.privates, list)
}

/**
 * 合并默认配置
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
const merge = async (
  defData: Privates,
  data: Privates
): Promise<Record<string, PrivatesObjectValue>> => {
  /** 处理缓存 方便调用 */
  const list: Record<string, PrivatesObjectValue> = {
    default: defData[0],
  }

  await Promise.all(data.map(async (value) => {
    list[value.key] = {
      ...list.default,
      key: value.key,
      cd: isNaN(Number(value.cd)) ? list.default.cd : Number(value.cd),
      mode: Number(value.mode) as PrivatesObjectValue['mode'] ?? list.default.mode,
      alias: setStr(Array.isArray(value.alias) ? value.alias : list.default.alias),
      enable: setStr(Array.isArray(value.enable) ? value.enable : list.default.enable),
      disable: setStr(Array.isArray(value.disable) ? value.disable : list.default.disable),
    }
  }))

  return list
}

/** 初始化缓存 */
const data = await requireFile(FILE, { type: 'json' })
cache = isOld(data) ? await migrate(data) : await merge(defaultConfig.privates, data)

/** 监听文件变化 */
watch<Privates>(FILE, async (_, data) => {
  cache = await merge(defaultConfig.privates, data)
})

/** 定时清理缓存 */
clearCache(count, cache)

/**
 * 获取群聊和频道配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(cache, count, keys)

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
