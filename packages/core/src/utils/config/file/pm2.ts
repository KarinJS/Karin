import { configPath } from '@/root'
import { requireFileSync } from '../../fs/require'
import type { PM2 } from '@/types/config'

/** pm2配置 */
export const pm2 = () => requireFileSync<PM2>(`${configPath}/pm2.json`, { ex: 30 })
