import fs from 'node:fs'
import * as root from '@/root'
import { setEnv } from './file/env'
import { requireFileSync } from '../fs/require'

import type { LogMethodNames } from '@/service/logger/types'
import type { FileListMap, Groups, Privates } from '@/types/config'

/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 * @param isRefresh 是否刷新缓存
 */
export const getYaml = <T extends keyof FileListMap> (
  name: T,
  type: 'user' | 'default',
  isRefresh?: boolean
): FileListMap[T] => {
  const file = `${type === 'user' ? root.configPath : root.defaultConfigPath}/${name}.json`
  if (!fs.existsSync(file)) {
    throw new TypeError(`${file} 文件不存在`)
  }

  return requireFileSync(file, { force: isRefresh })
}

/**
 * @description 修改框架配置
 * @param name 文件名称
 * @param data 配置数据
 */
export const setYaml = <T extends keyof FileListMap> (
  name: T,
  data: T extends 'groups' ? Groups : T extends 'privates' ? Privates : Record<string, any>
) => {
  if (name === 'env') return setEnv(data)
  const file = `${root.configPath}/${name}.json`
  if (!fs.existsSync(file)) return false

  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return true
}

/**
 * @description 修改框架配置 修改系统配置
 * @param name 文件名称
 * @param data 配置数据
 */
export const setConfig = <T extends keyof FileListMap> (
  name: T,
  data: T extends 'groups' ? Groups : T extends 'privates' ? Privates : Record<string, any>
) => {
  return setYaml(name, data)
}

/**
 * 清空指定目录下的全部文件 不删除目录
 * @param dir 目录
 */
export const clearFiles = (dir: string) => {
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    fs.promises.rm(file, { recursive: true, force: true })
  })
}

// /** 每次启动清空临时文件夹 */
// export const clearTemp = () => {
//   const list = [root.htmlPath, root.consolePath]
//   list.forEach(file => {
//     /** console html例外 */
//     if (file === root.consolePath || file === root.htmlPath) return
//     if (fs.existsSync(file)) {
//       fs.rmSync(file, { recursive: true, force: true })
//     }
//   })
// }

/**
 * 更新日志等级
 * @param level 日志等级
 * @returns 返回更新后的日志等级
 */
export const updateLevel = (level?: LogMethodNames): string => {
  if (level) {
    logger.level = level
    return level
  }

  const newLevel = (process.env.LOG_LEVEL || 'info') as LogMethodNames
  logger.level = newLevel
  return newLevel
}
