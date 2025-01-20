import { lint } from './tools'
import { configPath } from '@/root'
import { watch } from '../fs/watch'
import { requireFileSync } from '../fs/require'
import { defaultConfig } from './default'
import type { Config } from '@/types/config'

const FILE = `${configPath}/config.json`

let cache = await lint<Config>(defaultConfig.config, await requireFileSync(FILE))

/** 基本配置 */
export const config = () => cache
/** 主人列表 */
export const master = (): string[] => config().master
/** 管理员列表 */
export const admin = (): string[] => config().admin

watch<Config>(FILE, async (_, data) => {
  cache = await lint<Config>(defaultConfig.config, data)
})
