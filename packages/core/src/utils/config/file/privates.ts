import fs from 'node:fs'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'
import { defaultConfig } from '../default'
import { isNumberInArray, strToBool } from '@/utils/common'
import { clearCache, createCount, getCacheCfg } from '../tools'

import type { Privates, PrivatesObjectValue } from '@/types/config'

/** 缓存调用统计 */
const count = createCount()

/** privates.json 静态缓存(也就是文件原始数据) */
let staticCache: Record<string, PrivatesObjectValue>
/** privates.json 动态缓存(obj映射 动态生成) */
let dynamicCache: Record<string, PrivatesObjectValue>

/**
 * 获取私聊配置
 * @param keys 键组
 */
const getCfg = (keys: string[]) => getCacheCfg(dynamicCache, count, keys)

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
  /** 确保数据是数组 */
  if (!Array.isArray(data)) {
    logger.warn('[privates.json] 配置文件格式错误，使用默认配置')
    data = defaultConfig.privates
  }

  /** 初始: 全局配置 */
  const defaultGlobal = defaultConfig.privates[1]
  /** 初始: 好友默认配置 */
  const defaultPrivates = defaultConfig.privates[0]

  /** 用户: 全局配置 */
  const userGlobal = data.find(item => item.key === 'global') || defaultGlobal
  /** 用户: 好友默认配置 */
  const userPrivates = data.find(item => item.key === 'default') || defaultPrivates

  /**
   * 合并全局配置或群聊默认配置
   * @param key 键
   * @param inherit 是否继承全局配置
   * @param args 配置
   * @returns 合并后的配置
   * @description 合并配置 如果args有3个参数 则说明索引1是全局配置 应该进行继承
   */
  const merge = (
    key: string,
    inherit: boolean,
    ...args: PrivatesObjectValue[]
  ): PrivatesObjectValue => {
    if (typeof inherit !== 'boolean') {
      inherit = true
    }

    let alias = args.map(item => item.alias)
    let enable = args.map(item => item.enable)
    let disable = args.map(item => item.disable)

    if (inherit && args.length === 3) {
      /** 需要将01合并 */
      alias = [strToBool.mergeArray(alias[0], alias[1]), alias[2]]
      enable = [strToBool.mergeArray(enable[0], enable[1]), enable[2]]
      disable = [strToBool.mergeArray(disable[0], disable[1]), disable[2]]
    }
    return {
      key,
      inherit,
      cd: isNumberInArray(args.map(item => item.cd), 0),
      mode: isNumberInArray(args.map(item => item.mode), 0),
      alias: strToBool.arrayString(alias),
      enable: strToBool.arrayString(enable),
      disable: strToBool.arrayString(disable),
    }
  }

  /** 合并后的全局配置 */
  const global: PrivatesObjectValue = merge('global', true, userGlobal, defaultGlobal)
  /** 合并后的好友默认配置 */
  const def: PrivatesObjectValue = merge('default', true, userPrivates, defaultPrivates)

  /** 将缓存修改为kv格式 方便调用 */
  const kv: Record<string, PrivatesObjectValue> = {
    global,
    default: def,
  }

  data.forEach((value) => {
    kv[value.key] = merge(value.key, value.inherit, value, kv.global, kv.default)
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
  staticCache = isOld(data) ? migrate(file, data) : format(data)
  dynamicCache = format(data)

  watch<Privates>(file, async (old, data) => {
    staticCache = isOld(data) ? migrate(file, data) : format(data)
    dynamicCache = staticCache

    const options = { file: name, old, data: dynamicCache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })

  /** 定时清理缓存 */
  clearCache<PrivatesObjectValue>(count, staticCache, dynamicCache)
}

/**
 * @public 公开Api
 * @description 获取私聊配置
 * @returns 私聊配置
 */
export const privates = () => dynamicCache

/**
 * @public 公开Api
 * @description 获取指定好友配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getFriendCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'global', 'default']
  return getCfg(keys)
}

/**
 * @public 公开Api
 * @description 获取指定频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export const getDirectCfg = (userId: string, selfId: string) => {
  const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'global', 'default']
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
