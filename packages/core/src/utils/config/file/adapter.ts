import { watch } from '../../fs/watch'
import { FILE_CHANGE } from '@/utils/fs'
import { diffArray } from '@/utils/common/number'
import { requireFileSync } from '../../fs/require'
import { listeners } from '@/core/internal/listeners'
import { registerHttpBot, unregisterHttpBot } from '@/adapter/onebot/post/register'
import { createOneBot11Client, disconnectOneBot11Client } from '@/adapter/onebot/connect'

import type { Adapters } from '@/types/config'

/** adapter.json 缓存 */
let cache: Adapters

/**
 * @description 格式化配置
 * @param data 配置
 * @returns 格式化后的配置
 */
const format = (data: Adapters) => {
  return {
    console: {
      ...data.console,
      token: String(data.console.token),
    },
    onebot: {
      ws_server: {
        ...data.onebot.ws_server,
        timeout: Number(data.onebot.ws_server.timeout) || 120,
      },
      ws_client: data.onebot.ws_client.map(v => ({
        ...v,
        token: String(v.token),
      })),
      http_server: data.onebot.http_server.map(v => ({
        ...v,
        self_id: String(v.self_id),
        api_token: String(v?.api_token) || String(v.token),
        post_token: String(v.post_token),
      })),

    },

  }
}

/**
 * @internal
 * @description 初始化配置
 * @param listeners 事件监听器
 * @param dir 配置文件根目录
 */
const initAdapter = (dir: string,) => {
  const name = 'adapter.json'

  const file = `${dir}/${name}`

  const data = requireFileSync<Adapters>(file, { type: 'json' })
  cache = format(data)

  watch<Adapters>(file, (old, data) => {
    cache = format(data)

    const options = { file: name, old, data: cache }
    listeners.emit(FILE_CHANGE, options)
    listeners.emit(`${FILE_CHANGE}:${name}`, options)
    hmrOneBot(old, data)
  }, { type: 'json' })
}

/**
 * @internal
 * @description 热重载
 * @param old 旧配置
 * @param data 新配置
 */
const hmrOneBot = (old: Adapters, data: Adapters) => {
  const client = diffArray(
    Array.isArray(old?.onebot?.ws_client) ? old?.onebot?.ws_client : [],
    Array.isArray(data?.onebot?.ws_client) ? data?.onebot?.ws_client : []
  )

  client.removed.forEach(v => disconnectOneBot11Client(v.url))
  client.added.forEach(v => v.enable && createOneBot11Client(v.url, v.token))

  const http = diffArray(
    Array.isArray(old?.onebot?.http_server) ? old?.onebot?.http_server : [],
    Array.isArray(data?.onebot?.http_server) ? data?.onebot?.http_server : []
  )

  http.removed.forEach(v => unregisterHttpBot(v.self_id))
  http.added.forEach(v => v.enable && registerHttpBot(v.self_id, v.url, v.api_token, v.post_token))
}

/**
 * @public 公开Api
 * @description 获取adapter.json
 */
export const adapter = () => cache

/**
 * @public 公开Api
 * @description onebotWs请求超时时间
 */
export const timeout = () => adapter().onebot.ws_server.timeout

/**
 * @public 公开Api
 * @description wsServer 鉴权token
 */
export const webSocketServerToken = () => process.env.WS_SERVER_AUTH_KEY

export default initAdapter
