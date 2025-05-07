import { formatObject } from '../tools'
import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'

import type { Config } from '@/types/config'

/** config.json 缓存 */
let cache: Config

/**
 * @internal
 * @description 初始化config.json
 * @param file 配置文件根目录
 */
const initConfig = (dir: string) => {
  const name = 'config.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Config>(file, { type: 'json' })
  cache = formatObject<Config>(data)

  watch<Config>(file, (old, data) => {
    cache = formatObject<Config>(data)

    const options = { file: name, old, data: cache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })
}

/**
 * 读取config.json 不走缓存
 */
export const readConfig = (dir: string) => {
  const name = 'config.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Config>(file, { type: 'json' })
  return formatObject<Config>(data)
}

/**
 * @public 公开Api
 * @description 获取配置 `config.json`
 */
export const config = () => cache
/**
 * @public 公开Api
 * @description 获取Bot主人列表
 */
export const master = (): string[] => config().master
/**
 * @public 公开Api
 * @description 获取Bot管理员列表
 */
export const admin = (): string[] => config().admin

export default initConfig
