import fs from 'node:fs'
import path from 'node:path'
import { store } from '@karinjs/store'
import { EventEmitter } from 'node:events'
import { requireFileSync, RequireOptions, watchs } from '@karinjs/utils'

import { filter } from '../filter/filter'
import { direct } from '../scene/direct'
import { friend } from '../scene/friend'
import { group } from '../scene/group'
import { guild } from '../scene/guild'
import { pm2 } from '../system/pm2'
import { permissions } from '../config/permissions'
import { logger as loggerApi } from '../system/logger'
import { redis as redisApi } from '../system/redis'
import { server as serverApi } from '../system/server'

import type { } from '@karinjs/logger'
import type { PackageJsonKarin } from '../types'

/**
 * 配置模块类型
 */
type ConfigModule = {
  default: any
  compat: (data: any) => any
  clearCache?: () => void
}

/**
 * 配置项类型
 */
type ConfigEntry<T extends ConfigModule> = {
  cfg: ReturnType<T['compat']>
  parse: T['compat']
  clear: T extends { clearCache: infer C } ? C : () => void
  cache: ReturnType<T['compat']> | null
}

/**
 * 配置模块映射表
 */
const configModules = {
  'admin/permissions.json': permissions,
  'filter/filter.json': filter,
  'scene/direct.json': direct,
  'scene/friend.json': friend,
  'scene/group.json': group,
  'scene/guild.json': guild,
  'system/logger.json': loggerApi,
  'system/pm2.json': pm2,
  'system/redis.json': redisApi,
  'system/server.json': serverApi,
} as const

/**
 * 配置文件映射
 */
export type ConfigFilesType = {
  [K in keyof typeof configModules]: ConfigEntry<typeof configModules[K]>
}

interface ConfigEventMap {
  change: {
    [K in keyof ConfigFilesType]: [
      file: K,
      prev: ConfigFilesType[K]['cfg'],
      next: ConfigFilesType[K]['cfg']
    ]
  }[keyof ConfigFilesType]
}

/**
 * 配置文件管理器
 */
class Config extends EventEmitter<ConfigEventMap> {
  get #logger () {
    return global?.logger || console
  }

  get files (): ConfigFilesType {
    return Object.fromEntries(
      Object.entries(configModules).map(([key, module]) => [
        key,
        {
          cfg: module.default,
          parse: module.compat,
          clear: module.clearCache,
          cache: null,
        },
      ])
    ) as ConfigFilesType
  }

  /**
   * 获取主人列表
   */
  get master () {
    return this.config().master
  }

  /**
   * 获取管理员列表
   */
  get admin () {
    return this.config().admin
  }

  async init (): Promise<Config> {
    Object.entries(this.files).forEach(([p, { cfg }]) => {
      const filePath = path.join(store.core.config, p)
      if (fs.existsSync(filePath)) return

      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      try {
        fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf-8')
      } catch (e: any) {
        if (e?.code === 'ENOENT') {
          fs.mkdirSync(path.dirname(filePath), { recursive: true })
          fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), 'utf-8')
        } else {
          throw e
        }
      }

      const relPath = path.relative(process.cwd(), filePath).replaceAll('\\', '/')
      this.#logger.debug(`[config] 创建配置文件: ${relPath}`)
    });

    /** 创建一些基础目录 */
    [
      store.core.html,
      store.core.resource,
    ].forEach((p) => {
      if (fs.existsSync(p)) return
      fs.mkdirSync(p, { recursive: true })
    })
    return this
  }

  /**
   * 辅助函数：通用的配置获取逻辑
   * @param file 配置文件路径
   * @param isRefresh 是否刷新
   * @returns 配置数据
   */
  private getConfigWithCache<K extends keyof ConfigFilesType> (
    file: K,
    isRefresh: boolean = false
  ): ConfigFilesType[K]['cache'] extends infer T ? Exclude<T, null> : never {
    const cfg = this.files[file]
    if (!isRefresh && cfg.cache) return cfg.cache as ConfigFilesType[K]['cache'] extends infer T ? Exclude<T, null> : never

    const data = requireFileSync<ConfigFilesType[K]['cfg']>(
      file,
      {
        ex: 0,
        type: 'json',
        force: isRefresh,
        cwd: store.core.config,
      }
    )

    const cache = cfg.parse(data as any)
    cfg.cache = cache as any
    return cache as ConfigFilesType[K]['cache'] extends infer T ? Exclude<T, null> : never
  }

  /**
   * 获取配置
   * @param isRefresh 是否刷新
   * @returns 配置
   */
  config (isRefresh: boolean = false) {
    return this.getConfigWithCache('admin/permissions.json', isRefresh)
  }

  /**
   * 获取好友场景配置
   * @param isRefresh 是否刷新
   */
  friend (isRefresh: boolean = false) {
    return this.getConfigWithCache('scene/friend.json', isRefresh)
  }

  /**
   * 获取频道私信场景配置
   * @param isRefresh 是否刷新
   */
  direct (isRefresh: boolean = false) {
    return this.getConfigWithCache('scene/direct.json', isRefresh)
  }

  /**
   * 获取群聊场景配置
   * @param isRefresh 是否刷新
   * @returns 群组配置
   */
  group (isRefresh: boolean = false) {
    return this.getConfigWithCache('scene/group.json', isRefresh)
  }

  /**
   * 获取频道场景配置
   * @param isRefresh 是否刷新
   */
  guild (isRefresh: boolean = false) {
    return this.getConfigWithCache('scene/guild.json', isRefresh)
  }

  /**
   * 获取过滤配置
   * @param isRefresh 是否刷新
   */
  filter (isRefresh: boolean = false) {
    return this.getConfigWithCache('filter/filter.json', isRefresh)
  }

  /**
   * 获取指定群聊配置
   * @param groupId 群号
   * @param selfId 机器人ID
   * @returns 群聊配置
   */
  getGroupCfg (groupId: string, selfId: string) {
    return group.get(this.group(), selfId, groupId)
  }

  /**
   * 获取指定频道配置
   * @param guildId 频道ID
   * @param channelId 子频道ID
   * @param selfId 机器人ID
   * @returns 频道配置
   */
  getGuildCfg (guildId: string, channelId: string, selfId: string) {
    return guild.get(this.guild(), selfId, guildId, channelId)
  }

  /**
   * 获取指定私聊配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   * @returns 私聊配置
   */
  getFriendCfg (userId: string, selfId: string) {
    return friend.get(this.friend(), selfId, userId)
  }

  /**
   * 获取指定频道私信配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   * @returns 频道私信配置
   */
  getDirectCfg (userId: string, selfId: string, guild?: string) {
    return direct.get(this.direct(), selfId, userId, guild)
  }

  /**
   * 获取服务器配置
   * @param isRefresh 是否刷新
   * @returns 服务器配置
   */
  server (isRefresh: boolean = false) {
    return this.getConfigWithCache('system/server.json', isRefresh)
  }

  /**
   * 获取日志配置
   * @param isRefresh 是否刷新
   * @returns 日志配置
   */
  logger (isRefresh: boolean = false) {
    return this.getConfigWithCache('system/logger.json', isRefresh)
  }

  /**
   * 获取Redis配置
   * @description 实时读取
   * @returns Redis配置
   */
  redis () {
    return this.getRawConfig('system/redis.json')
  }

  /**
   * 获取PM2配置
   * @description 实时读取
   * @returns PM2配置
   */
  pm2 () {
    return this.getRawConfig('system/pm2.json')
  }

  /**
   * 读取原始配置文件内容
   * @param name 文件名称
   * @description 实时读取
   * @returns 配置文件内容
   */
  getRawConfig<T extends keyof ConfigFilesType> (
    name: T
  ): ConfigFilesType[T]['cfg'] {
    return requireFileSync(name, { type: 'json', cwd: store.core.config, force: true })
  }

  /**
   * 写入原始配置文件内容
   * @param name 文件名称
   * @param data 配置文件内容
   * @description 不会经过格式化处理，直接写入
   */
  setRawConfig<T extends keyof ConfigFilesType> (
    name: T,
    data: ConfigFilesType[T]['cfg']
  ) {
    const file = path.join(store.core.config, name)
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }

  /**
   * 获取package.json文件
   * @param dir 目录
   * @param options 选项
   * @description 无需传递 `package.json` 默认缓存永不过期
   * @returns package.json内容
   */
  pkg (dir = store.pkg.karin, options: RequireOptions = { type: 'json', ex: 0 }): PackageJsonKarin {
    return requireFileSync<PackageJsonKarin>(dir, options)
  }

  watch () {
    watchs<any>(Object.keys(this.files), async (filePath, prev, next) => {
      const relPath = filePath as keyof ConfigFilesType
      if (!(relPath in this.files)) {
        this.#logger.debug(`未找到配置文件对应的处理模块：${relPath}`)
        return
      }

      const cfg = this.files[relPath]

      cfg.clear()
      cfg.cache = null

      if (relPath === 'system/logger.json') {
        if (prev?.level !== next?.level && this.#logger?.level) {
          this.#logger.level = next?.level || 'info'
          this.#logger.mark(`日志等级已更新为 ${this.#logger.level}`)
        }
      }
    }, { chokidar: { cwd: store.core.config } })
    return this
  }
}

export type { Config }

/**
 * karin内部配置管理器
 */
export const config = new Config()
