import type { PM2 } from './pm2'
import type { Redis } from './redis'
import type { Config } from './config'
import type { Server } from './server'
import type { FSWatcher } from 'chokidar'
import type { GroupGuild } from './groupGuild'
import type { FriendDirect } from './friendDirect'

/** ConfigEnum与返回值映射 用于泛型 */
export interface ConfigMap {
  /** `config.yaml` */
  config: Config
  /** `friendDirect.yaml` */
  friendDirect: Record<string, FriendDirect>
  /** `groupGuild.yaml` */
  groupGuild: Record<string, GroupGuild>
  /** `pm2.yaml` */
  pm2: PM2
  /** `redis.yaml` */
  redis: Redis
  /** `server.yaml` */
  server: Server
}

/**
 * 文件原始缓存类型
 */
export interface OriginalFileCache {
  config: Config
  server: Server
}

/**
 * 配置文件缓存类型
 */
export interface FileCache {
  /** 好友、频道私信消息配置默认值 */
  friendCfgDef: FriendDirect
  /** 群、频道消息配置默认值 */
  groupCfgDef: GroupGuild
  /** 配置文件对应缓存 */
  file: OriginalFileCache
  /** 监听器缓存 */
  watcher: Map<string, FSWatcher>
  /** 单独群、频道配置缓存 */
  groupGuild: Record<string, {
    /** 前一分钟调用数量 */
    start: number
    /** 当前调用数量 */
    count: number
    /** 配置 */
    config: GroupGuild
  }>
  /** 单独好友、频道私信配置缓存 */
  friendDirect: Record<string, {
    /** 前一分钟调用数量 */
    start: number
    /** 当前调用数量 */
    count: number
    /** 配置 */
    config: FriendDirect
  }>
}
