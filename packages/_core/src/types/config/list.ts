import type { Adapters } from './adapter'
import type { Config } from './config'
import type { Env } from './env'
import type { Groups } from './groups'
import type { PM2 } from './pm2'
import type { Privates } from './privates'
import type { Redis } from './redis'
import type { Renders } from './render'

/**
 * 文件列表
 * - `config`: 基本配置
 * - `adapter`: 适配器配置
 * - `pm2`: pm2配置
 * - `redis`: redis配置
 * - `render`: 渲染配置
 * - `package`: 框架配置
 * - `groups`: 群组配置
 * - `privates`: 私信配置
 */
export type FileList = 'config'
  | 'adapter'
  | 'pm2'
  | 'redis'
  | 'render'
  | 'groups'
  | 'privates'

/** 文件列表类型映射 */
export interface FileListMap {
  config: Config
  adapter: Adapters
  pm2: PM2
  redis: Redis
  render: Renders
  groups: Groups
  privates: Privates
  env: Env
}
