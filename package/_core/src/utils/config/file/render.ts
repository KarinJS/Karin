import { watch } from '../../fs/watch'
import { FILE_CHANGE } from '@/utils/fs'
import { diffArray } from '@/utils/common/number'
import { requireFileSync } from '../../fs/require'
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
      isSnapka: v.isSnapka ?? false,
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

  watch<Renders>(file, async (old, data) => {
    cache = format(data)

    const wsClient = diffArray(
      Array.isArray(old?.ws_client) ? old?.ws_client : [],
      Array.isArray(data?.ws_client) ? data?.ws_client : []
    )

    const {
      disconnectSnapkaClient,
      createSnapkaClient,
      disconnectSnapkaHttp,
      createSnapkaHttp,
    } = await import('@/adapter/snapka')

    wsClient.removed.forEach(v => disconnectSnapkaClient(v.url))
    wsClient.added.forEach(v => createSnapkaClient(v))

    const httpServer = diffArray(
      Array.isArray(old?.http_server) ? old?.http_server : [],
      Array.isArray(data?.http_server) ? data?.http_server : []
    )

    httpServer.removed.forEach(v => disconnectSnapkaHttp(v.url))
    httpServer.added.forEach(v => createSnapkaHttp(v))

    const options = { file: name, old, data: cache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
  }, { type: 'json' })
}

/**
 * @public 公开Api
 * @description 获取渲染配置
 * @deprecated 请使用 `getRenderCfg` 代替
 */
export const render = () => cache

/**
 * @public 公开Api
 * @description 获取渲染配置
 */
export const getRenderCfg = () => cache

export default initRender
