import { configPath } from '@/root'
import { requireFileSync } from '../fs/require'
import type { Redis } from '@/types/config'

/** redis配置 */
export const redis = () => requireFileSync<Redis>(`${configPath}/redis.json`, { ex: 30 })
