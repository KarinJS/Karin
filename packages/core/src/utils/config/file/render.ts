import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'

import type { Renders } from '@/types/config'

/** render.json 缓存 */
let cache: Renders

/**
 * @description 格式化配置
 * @param data 配置
 * @returns 格式化后的配置
 */
const format = (data: Renders) => {
  return {
    ws_server: data.ws_server,
    ws_client: data.ws_client.map(v => ({
      ...v,
      token: String(v.token),
    })),
    http_server: data.http_server.map(v => ({
      ...v,
      token: String(v.token),
    })),
  }
}

/**
 * @description 初始化渲染配置
 * @param dir 配置文件根目录
 */
const initRender = (dir: string) => {
  const name = 'render.json'
  const file = `${dir}/${name}`

  const data = requireFileSync<Renders>(file, { type: 'json' })
  cache = format(data)

  watch<Renders>(file, (old, data) => {
    cache = format(data)

    const options = { file: name, old, data: cache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })
}

/**
 * @public 公开Api
 * @description 获取渲染配置
 */
export const render = () => cache

export default initRender
