import { watch } from '../../fs/watch'
import { requireFileSync } from '../../fs/require'
import { FILE_CHANGE } from '@/utils/fs'
import { listeners } from '@/core/internal/listeners'

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
        token: String(v.token),
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
  }, { type: 'json' })
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
