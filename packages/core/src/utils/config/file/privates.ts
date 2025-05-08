import fs from 'node:fs'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import { defaultConfig } from '../default'
import { clearCache, createCount, getCacheCfg, mergeDegAndCfg } from '../tools'

import type { Privates, PrivatesObjectValue } from '@/types/config'

/** 缓存调用统计 */
const count = createCount()

/** privates.json 缓存 */
let cache: Record<string, PrivatesObjectValue>

/**
 * 获取私聊配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(cache, count, keys)

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
 * @param file 配置文件路径
 * @param data 配置数据
 */
const migrate = (
  file: string,
  data: Record<string, Omit<PrivatesObjectValue, 'key'>>
): Record<string, PrivatesObjectValue> => {
  const list: Privates = []

  /** 转换为新版本 */
  Object.entries(data).forEach(([key, value]) => {
    list.push({ key, ...value })
  })

  /** 写入新版本 */
  fs.writeFileSync(file, JSON.stringify(list, null, 2))
  logger.mark('[migrate] 迁移 privates.json 配置文件成功')
  return format(list)
}

/**
 * 格式化并合并配置
 * @param data 配置
 * @returns 合并后的配置
 */
const format = (data: Privates): Record<string, PrivatesObjectValue> => {
  /** 将缓存修改为kv格式 方便调用 */
  const kv: Record<string, PrivatesObjectValue> = {
    default: defaultConfig.privates[0],
  }

  data.forEach((value) => {
    kv[value.key] = mergeDegAndCfg(kv.default, value)
  })

  return kv
}

/**
 * @internal
 * @description 初始化私聊配置
 * @param dir 配置文件根目录
 */
const initPrivates = async (dir: string) => {
  const name = 'privates.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Privates>(file, { type: 'json' })
  cache = isOld(data) ? migrate(file, data) : format(data)

  watch<Privates>(file, async (old, data) => {
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
 * @description 获取私聊配置
 * @returns 私聊配置
 */
export const privates = () => cache

/**
 * @public 公开Api
 * @description 获取指定好友配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getFriendCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'default']
  return getCfg(keys)
}

/**
 * @public 公开Api
 * @description 获取指定频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getDirectCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'default']
  return getCfg(keys)
}

/**
 * @web 获取配置文件 不走缓存
 * @param dir 配置文件根目录
 * @returns 配置文件数据
 */
export const getPrivatesFileData = (dir: string) => {
  const name = 'privates.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Privates>(file, { type: 'json' })
  return isOld(data) ? migrate(file, data) : format(data)
}

export default initPrivates
