import { lint } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { defaultConfig } from './default'
import { requireFileSync } from '../fs/require'

import type { Adapters } from '@/types/config'

const FILE = `${configPath}/adapter.json`
let cache = await lint<Adapters>(defaultConfig.adapter, requireFileSync(FILE))

export const adapter = () => cache

/**
 * onebot ws timeout
 */
export const timeout = () => adapter().onebot.ws_server.timeout

watch<Adapters>(FILE, async (_, data) => {
  cache = await lint<Adapters>(defaultConfig.adapter, data)
})
