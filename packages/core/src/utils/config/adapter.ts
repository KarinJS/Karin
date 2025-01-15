import { lint } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFileSync } from '../fs/require'

import type { Adapters } from '@/types/config'
import { listeners } from '@/core/internal'

const FILE = `${configPath}/adapter.json`
let cache = await lint<Adapters>(defaultConfig.adapter, requireFileSync(FILE))

export const adapter = () => cache

/**
 * onebot ws timeout
 */
export const timeout = () => adapter().onebot.ws_server.timeout

/**
 * ws server 鉴权
 */
export const webSocketServerToken = () => process.env.WS_SERVER_AUTH_KEY

watch<Adapters>(FILE, async (old, data) => {
  listeners.emit('file:change', 'adapter', old, data)
  cache = await lint<Adapters>(defaultConfig.adapter, data)
})
