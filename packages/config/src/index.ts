import fs from 'node:fs'
import path from 'node:path'
import paths from '@karinjs/paths'
import { logger } from '@karinjs/logger'
import { Formatter } from './formatter'
import { defaultConfig } from './default'
import { EventEmitter } from 'node:events'
import { requireFileSync, watch, watchs } from '@karinjs/utils'

import type { PackageJson, RequireOptions } from '@karinjs/utils'
import type { ConfigFormatMap, ConfigMap, ConfigPrivateValue, ConfigGroupValue, ConfigEnv } from './types'

export type TypedEventMap = {
  [K in keyof ConfigMap]: [file: K, old: ConfigMap[K], data: ConfigMap[K]]
}

export interface EventMap {
  change: TypedEventMap[keyof ConfigMap]
}

export type ConfigFiles = {
  [K in keyof ConfigFormatMap]: {
    dir: string
    cache: ConfigFormatMap[K]['result'] | null
  }
}

export { Formatter } from './formatter'
export type * from './types'

/**
 * 配置文件管理器
 */
export class Config extends EventEmitter<EventMap> {
  #isWatch = false
  /** 初始化状态 */
  #isInitialized = false
  /** 配置文件根目录 */
  #dir: string
  /** 配置文件路径 */
  #files: ConfigFiles
  /** privates 缓存计数 */
  #privateCount: Record<string, { start: number; count: number }>
  /** privates 静态缓存(原始数据) */
  #privateStaticCache: Record<string, ConfigPrivateValue>
  /** privates 动态缓存 */
  #privateCache: Record<string, ConfigPrivateValue>
  /** groups 缓存计数 */
  #groupCount: Record<string, { start: number; count: number }>
  /** groups 静态缓存(原始数据) */
  #groupStaticCache: Record<string, ConfigGroupValue>
  /** groups 动态缓存 */
  #groupCache: Record<string, ConfigGroupValue>
  /** 清理缓存定时器 */
  #clearCacheInterval: NodeJS.Timeout | null = null
  /** 配置文件列表 */
  #configFiles = [
    'config.json',
    'adapter.json',
    'groups.json',
    'privates.json',
    'redis.json',
    'render.json',
    'pm2.json',
  ]

  constructor () {
    super()

    this.#dir = paths.karinPathConfig
    this.#files = {
      adapter: { dir: '', cache: null },
      groups: { dir: '', cache: null },
      privates: { dir: '', cache: null },
      config: { dir: '', cache: null },
      redis: { dir: '', cache: null },
      render: { dir: '', cache: null },
      pm2: { dir: '', cache: null },
      env: { dir: '', cache: null },
    }

    this.#privateCount = {}
    this.#privateStaticCache = {}
    this.#privateCache = {}
    this.#groupCount = {}
    this.#groupStaticCache = {}
    this.#groupCache = {}
  }

  async init (): Promise<Config> {
    // 防止重复初始化
    if (this.#isInitialized) {
      logger.debug('配置管理器已经初始化，跳过重复初始化')
      return this
    }

    /** 检查env文件 */
    const env = path.join(process.cwd(), process.env.EBV_FILE || '.env')
    if (!fs.existsSync(env)) {
      throw new Error(`初始化环境变量失败，未找到 .env 文件，请执行 ${logger.green('npx ki init')} 初始化项目`)
    }

    const files = this.#configFiles.map(file => path.join(this.#dir, file))
    files.push(env)

    /**
     * - 创建必要的目录
     * - 创建缓存对象
     * - 创建对应的配置文件
     */
    await Promise.all([
      ...Object.values(paths).map(async (value) => {
        if (typeof value !== 'string') return
        /** 屏蔽非 karinPath 开头的 */
        if (!value.startsWith(paths.karinPathRoot)) return
        /** 屏蔽带后缀的路径 带后缀的是一个文件而不是目录 */
        if (path.extname(value).length > 0) return
        await fs.promises.mkdir(value, { recursive: true })
        logger.debug(`创建目录 ${value}`)
      }),
      ...files.map(async (file) => {
        const key = path.basename(file, path.extname(file)).replace(/^\./, '') as keyof ConfigFormatMap
        this.#files[key] = { dir: file, cache: null }
      }),
      ...Object.entries(defaultConfig).map(async ([key, value]) => {
        const name = `${key}.json`
        const filePath = path.join(this.#dir, name)
        const exists = await fs.promises.access(filePath).then(() => true).catch(() => false)
        if (exists) return

        /** 兜底 */
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
        await fs.promises.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8')
        logger.debug(`创建配置文件 ${name} => ${filePath}`)
      }),
    ])

    this.#initCacheCleaner()
    this.groups(true)
    this.privates(true)

    // 标记为已初始化
    this.#isInitialized = true
    logger.debug('配置管理器初始化完成')

    return this
  }

  /**
   * 初始化缓存清理器
   */
  #initCacheCleaner () {
    if (this.#clearCacheInterval) return
    this.#clearCacheInterval = setInterval(() => {
      // 清理 privates 缓存
      Object.keys(this.#privateCount).forEach((key) => {
        const item = this.#privateCount[key]
        if (item.count - item.start < 10) {
          /** 如果源数据中存在这个key 这个key在缓存中是不允许删除的 */
          if (this.#privateStaticCache[key]) {
            delete this.#privateCount[key]
            return
          }
          delete this.#privateCount[key]
          delete this.#privateCache[key]
        } else {
          item.start = item.count
        }
      })

      // 清理 groups 缓存
      Object.keys(this.#groupCount).forEach((key) => {
        const item = this.#groupCount[key]
        if (item.count - item.start < 10) {
          /** 如果源数据中存在这个key 这个key在缓存中是不允许删除的 */
          if (this.#groupStaticCache[key]) {
            delete this.#groupCount[key]
            return
          }
          delete this.#groupCount[key]
          delete this.#groupCache[key]
        } else {
          item.start = item.count
        }
      })
    }, 60000)
  }

  /**
   * 获取私聊缓存配置
   * @param keys 键组
   * @returns 配置
   */
  #getPrivateCacheCfg (keys: string[]): ConfigPrivateValue {
    const key = keys[0]

    /** 优先走缓存 */
    if (this.#privateCache[key]) {
      this.#initPrivateCount(key)
      return this.#privateCache[key]
    }

    /** 如果缓存不存在 需要遍历keys生成事件key */
    for (let i = 0; i < keys.length; i++) {
      const v = keys[i]
      if (!this.#privateCache[v]) {
        continue
      }

      /**
       * 如果是索引0 说明有键有对应的缓存
       */
      if (i === 0 && v === key) {
        this.#initPrivateCount(v)
        return this.#privateCache[v]
      }

      /** 可能已经存在缓存了 */
      if (v === key) {
        this.#initPrivateCount(v)
        return this.#privateCache[v]
      }

      /** 最后创建缓存 */
      this.#privateCache[key] = this.#privateCache[v]
      this.#initPrivateCount(key)
      return this.#privateCache[key]
    }

    /** 如果缓存不存在 需要创建默认缓存 */
    this.#privateCache[key] = this.#privateCache.default
    return this.#privateCache.default
  }

  /**
   * 获取群组缓存配置
   * @param keys 键组
   * @returns 配置
   */
  #getGroupCacheCfg (keys: string[]): ConfigGroupValue {
    const key = keys[0]

    /** 优先走缓存 */
    if (this.#groupCache[key]) {
      this.#initGroupCount(key)
      return this.#groupCache[key]
    }

    /** 如果缓存不存在 需要遍历keys生成事件key */
    for (let i = 0; i < keys.length; i++) {
      const v = keys[i]
      if (!this.#groupCache[v]) {
        continue
      }

      /**
       * 如果是索引0 说明有键有对应的缓存
       */
      if (i === 0 && v === key) {
        this.#initGroupCount(v)
        return this.#groupCache[v]
      }

      /** 可能已经存在缓存了 */
      if (v === key) {
        this.#initGroupCount(v)
        return this.#groupCache[v]
      }

      /** 最后创建缓存 */
      this.#groupCache[key] = this.#groupCache[v]
      this.#initGroupCount(key)
      return this.#groupCache[key]
    }

    /** 如果缓存不存在 需要创建默认缓存 */
    this.#groupCache[key] = this.#groupCache.default

    return this.#groupCache.default
  }

  /**
   * 初始化私聊计数器
   * @param key 键
   */
  #initPrivateCount (key: string) {
    if (!this.#privateCount[key]) {
      this.#privateCount[key] = { start: 0, count: 1 }
    } else {
      this.#privateCount[key].count++
    }
  }

  /**
   * 初始化群组计数器
   * @param key 键
   */
  #initGroupCount (key: string) {
    if (!this.#groupCount[key]) {
      this.#groupCount[key] = { start: 0, count: 1 }
    } else {
      this.#groupCount[key].count++
    }
  }

  watch () {
    if (this.#isWatch) return
    this.#isWatch = true

    /** 排除env */
    const files = Object.values(this.#files).map(v => v.dir).filter(v => v !== this.#files.env.dir)

    watchs(files, (file, old, data) => {
      /** 获取文件名称 不含后缀 */
      const name = path.basename(file, path.extname(file))
      this.emit('change', name as any, old as any, data as any)

      if (!this.#files[name as keyof ConfigFormatMap]) return
      this.#files[name as keyof ConfigFormatMap].cache = Formatter.format(name as any, data)

      // 当 privates.json 更新时，清空缓存
      if (name === 'privates') {
        const formattedData = this.privates(true) as Record<string, ConfigPrivateValue>
        this.#privateStaticCache = formattedData
        this.#privateCache = { ...formattedData }
        this.#privateCount = {}
      }

      // 当 groups.json 更新时，清空缓存
      if (name === 'groups') {
        const formattedData = this.groups(true) as Record<string, ConfigGroupValue>
        this.#groupStaticCache = formattedData
        this.#groupCache = { ...formattedData }
        this.#groupCount = {}
      }
    }, { require: { type: 'json' } })

    /** 监听env */
    watch<ConfigFormatMap['env']['result']>(this.#files.env.dir, (old, data) => {
      this.emit('change', 'env', old, data)
      this.#files.env.cache = data
    }, { parser: (...args) => Formatter.envParse(...args) })
  }

  /**
   * 格式化文件配置
   * @param file 文件名
   * @param data 数据
   * @returns 格式化后的数据
   */
  format<T extends keyof ConfigFormatMap> (file: T, data: ConfigFormatMap[T]) {
    return Formatter.format(file, data)
  }

  /**
   * 获取配置
   * @param isRefresh 是否刷新
   * @returns 配置
   */
  config (isRefresh: boolean = false): ConfigFormatMap['config']['result'] {
    if (!isRefresh && this.#files.config.cache) return this.#files.config.cache

    const data = requireFileSync<ConfigFormatMap['config']['params']>(this.#files.config.dir, { type: 'json' })
    this.#files.config.cache = Formatter.format('config', data)

    return this.#files.config.cache
  }

  /**
   * 获取适配器配置
   * @param isRefresh 是否刷新
   * @returns 适配器配置
   */
  adapter (isRefresh: boolean = false): ConfigFormatMap['adapter']['result'] {
    if (!isRefresh && this.#files.adapter.cache) return this.#files.adapter.cache

    const data = requireFileSync<ConfigFormatMap['adapter']['params']>(this.#files.adapter.dir, { type: 'json' })
    this.#files.adapter.cache = Formatter.format('adapter', data)

    return this.#files.adapter.cache
  }

  /**
   * 获取群组配置
   * @param isRefresh 是否刷新
   * @returns 群组配置
   */
  groups (isRefresh: boolean = false): ConfigFormatMap['groups']['result'] {
    if (!isRefresh && this.#files.groups.cache) return this.#files.groups.cache

    const data = requireFileSync<ConfigFormatMap['groups']['params']>(this.#files.groups.dir, { type: 'json' })
    this.#files.groups.cache = Formatter.format('groups', data)

    // 重置缓存
    if (isRefresh) {
      const formattedData = this.#files.groups.cache as Record<string, ConfigGroupValue>
      this.#groupStaticCache = formattedData
      this.#groupCache = { ...formattedData }
      this.#groupCount = {}
    }

    return this.#files.groups.cache
  }

  /**
   * 获取指定群聊配置
   * @param groupId 群号
   * @param selfId 机器人ID
   * @returns 群聊配置
   */
  getGroupCfg (groupId: string, selfId: string): ConfigGroupValue {
    const keys = [
      `Bot:${selfId}:${groupId}`,
      `Bot:${selfId}`,
      groupId,
      'global',
      'default',
    ]
    return this.#getGroupCacheCfg(keys)
  }

  /**
   * 获取指定频道配置
   * @param guildId 频道ID
   * @param channelId 子频道ID
   * @param selfId 机器人ID
   * @returns 频道配置
   */
  getGuildCfg (guildId: string, channelId: string, selfId: string): ConfigGroupValue {
    const keys = [
      `Bot:${selfId}:${guildId}:${channelId}`,
      `Bot:${selfId}:${guildId}`,
      `Bot:${selfId}`,
      guildId,
      channelId,
      'global',
      'default',
    ]
    return this.#getGroupCacheCfg(keys)
  }

  /**
   * 获取私聊配置
   * @param isRefresh 是否刷新
   * @returns 私聊配置
   */
  privates (isRefresh: boolean = false): ConfigFormatMap['privates']['result'] {
    if (!isRefresh && this.#files.privates.cache) return this.#files.privates.cache

    const data = requireFileSync<ConfigFormatMap['privates']['params']>(this.#files.privates.dir, { type: 'json' })
    this.#files.privates.cache = Formatter.format('privates', data)

    // 重置缓存
    if (isRefresh) {
      const formattedData = this.#files.privates.cache as Record<string, ConfigPrivateValue>
      this.#privateStaticCache = formattedData
      this.#privateCache = { ...formattedData }
      this.#privateCount = {}
    }

    return this.#files.privates.cache
  }

  /**
   * 获取指定私聊配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   * @returns 私聊配置
   */
  getFriendCfg (userId: string, selfId: string): ConfigPrivateValue {
    const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'global', 'default']
    return this.#getPrivateCacheCfg(keys)
  }

  /**
   * 获取指定频道私信配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   * @returns 频道私信配置
   */
  getDirectCfg (userId: string, selfId: string): ConfigPrivateValue {
    const keys = [`Bot:${selfId}:${userId}`, `Bot:${selfId}`, userId, 'global', 'default']
    return this.#getPrivateCacheCfg(keys)
  }

  /**
   * 获取Redis配置
   * @param isRefresh 是否刷新
   * @returns Redis配置
   */
  redis (isRefresh: boolean = false): ConfigFormatMap['redis']['result'] {
    if (!isRefresh && this.#files.redis.cache) return this.#files.redis.cache

    const data = requireFileSync<ConfigFormatMap['redis']['params']>(this.#files.redis.dir, { type: 'json' })
    this.#files.redis.cache = Formatter.format('redis', data)

    return this.#files.redis.cache
  }

  /**
   * 获取渲染配置
   * @param isRefresh 是否刷新
   * @returns 渲染配置
   */
  render (isRefresh: boolean = false): ConfigFormatMap['render']['result'] {
    if (!isRefresh && this.#files.render.cache) return this.#files.render.cache

    const data = requireFileSync<ConfigFormatMap['render']['params']>(this.#files.render.dir, { type: 'json' })
    this.#files.render.cache = Formatter.format('render', data)

    return this.#files.render.cache
  }

  /**
   * 获取渲染配置
   * @param isRefresh 是否刷新
   * @returns 渲染配置
   */
  getRenderCfg (isRefresh: boolean = false): ConfigFormatMap['render']['result'] {
    return this.render(isRefresh)
  }

  /**
   * 获取PM2配置
   * @param isRefresh 是否刷新
   * @returns PM2配置
   */
  pm2 (isRefresh: boolean = false): ConfigFormatMap['pm2']['result'] {
    if (!isRefresh && this.#files.pm2.cache) return this.#files.pm2.cache

    const data = requireFileSync<ConfigFormatMap['pm2']['params']>(this.#files.pm2.dir, { type: 'json' })
    this.#files.pm2.cache = Formatter.format('pm2', data)

    return this.#files.pm2.cache
  }

  /**
   * 获取环境变量配置
   * @param isRefresh 是否刷新
   * @returns 环境变量配置
   */
  env (isRefresh: boolean = false): ConfigEnv {
    /** 转换函数 */
    const transform = (data: ConfigFormatMap['env']['result']) => {
      return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.value]))
    }

    if (!isRefresh && this.#files.env.cache) return transform(this.#files.env.cache) as unknown as ConfigEnv

    const data = requireFileSync<ConfigFormatMap['env']['params']>(this.#files.env.dir)
    this.#files.env.cache = Formatter.format('env', data)

    return transform(this.#files.env.cache) as unknown as ConfigEnv
  }

  /**
   * 获取环境变量
   * @param key 键
   * @returns 环境变量
   */
  getEnv (dir: string = this.#files.env.dir): Record<string, {
    /** 值 */
    value: string
    /** 注释 */
    comment: string
  }> {
    return requireFileSync<ConfigFormatMap['env']['result']>(
      dir,
      { parser: (...args) => Formatter.envParse(...args) }
    )
  }

  /**
 * 写入单个或多个环境变量
 * @param data 要写入的环境变量
 * @param cwd env文件路径 默认系统.env文件
 * @param isCover 如果键已经存在 是否覆盖已有的值 默认否
   */
  writeEnv (
    data: { key: string, value: string, comment: string } | { key: string, value: string, comment: string }[],
    cwd?: string,
    isCover: boolean = false
  ) {
    if (!cwd) cwd = this.#files.env.dir
    const env = this.getEnv(cwd)
    const result = { ...env }
    if (!Array.isArray(data)) data = [data]

    data.forEach((item) => {
      const { key, value, comment } = item
      if (!key || typeof key !== 'string') {
        logger.error('[writeEnv]', 'key 必须为字符串')
        return
      }

      if (result[key]) {
        if (!isCover) {
          logger.debug(`[writeEnv] key: ${key} 已存在 跳过`)
          return
        }
      }

      result[key] = {
        value,
        comment: comment || result?.[key]?.comment || '',
      }
    })

    const content = Object.entries(result)
      .map(([key, value]) => {
        /** 统一处理value前后的注释 */
        const val = /^".*"$/.test(value.value) ? value.value : `"${value.value}"`

        if (value.comment) {
          const comment = /^#/.test(value.comment) ? value.comment : `# ${value.comment}`
          return `${comment}\n${key}=${val}`
        }

        return `${key}=${val}`
      })
      .join('\n')

    fs.writeFileSync(cwd, content)
  }

  /**
   * 设置配置文件的值
   * @param name 文件名称
   * @param data 配置数据
   */
  setConfig<T extends keyof ConfigMap> (
    name: T,
    data: ConfigMap[T]
  ) {
    if (!this.#configFiles.includes(`${name}.json`) && `.${name}` !== '.env') {
      logger.error('[setConfig]', `文件 ${name} 不存在`)
      return
    }

    if (name === 'env') {
      const env = Object.entries(data as ConfigMap['env']).map(([key, value]) => ({
        key,
        value: value.value,
        comment: value.comment,
      }))
      this.writeEnv(env, this.#files.env.dir, true)
      return
    }

    const file = `${this.#dir}/${name}.json`
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
  }

  /**
   * 获取package.json文件
   * @param dir 目录
   * @param options 选项
   *
   * @default 'karin -> package.json'
   * @description 无需传递 `package.json` 默认缓存永不过期
   * @returns package.json内容
   */
  pkg (dir = paths.karinPathRoot, options: RequireOptions = { type: 'json', ex: 0 }): PackageJson {
    dir = `${dir}/package.json`
    return requireFileSync<PackageJson>(dir, options)
  }
}
