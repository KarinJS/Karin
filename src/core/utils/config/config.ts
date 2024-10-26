import util from 'node:util'
import chokidar from 'chokidar'
import { karinDir } from '@/init/dir'
import { defaultConfig, userConfig } from '@/utils/fs/root'
import { clearRequireFile, requireFile, requireFileSync } from '@/utils'

import type {
  ConfigType,
  ConfigMap,
  ConfigFileType,
  RedisType,
  ServerType,
  PackageType,
  GroupGuildFileCfg,
  FriendDirectFileCfg,
} from './types'

/**
 * 配置文件管理器
 * @class Config
 */
export class Config {
  /** 基本配置缓存key */
  configKey = 'change.config'
  /** http服务配置缓存key */
  serverKey = 'change.server'
  /** 监听文件 缓存监听器 */
  change: Map<string, any>
  /** 监听器缓存 */
  watcherMap: Map<string, chokidar.FSWatcher>
  /** 群、频道消息配置默认值 */
  groupCfgDef: GroupGuildFileCfg
  /** 好友、频道私信消息配置默认值 */
  friendCfgDef: FriendDirectFileCfg

  /** 调用次数统计 */
  callCount: Map<string, {
    /** 开始缓存时的调用数量 */
    start: number
    /** 当前调用数量 */
    count: number
    /** 是否已缓存 */
    cache: boolean
    /** 文件类型 */
    type: ConfigFileType
  }>

  constructor () {
    this.change = new Map()
    this.watcherMap = new Map()
    this.callCount = new Map()
    this.friendCfgDef = { cd: 0, mode: 0, alias: [], enable: [], disable: [] }
    this.groupCfgDef = { cd: 0, userCD: 0, mode: 0, alias: [], enable: [], disable: [], memberDisable: [], memberEnable: [] }
  }

  /** node-karin的package */
  get package (): PackageType {
    const data = requireFileSync(karinDir + '/package.json')
    return data
  }

  /** 主人列表 */
  get master () {
    const data = this.change.get(this.configKey)
    return data.master || []
  }

  /** 管理员列表 */
  get admin (): string[] {
    const data = this.change.get(this.configKey)
    return data.admin || []
  }

  /** 超时时间 */
  get timeout (): number {
    const data = this.change.get(this.serverKey)
    return data.timeout
  }

  /** 初始化 */
  async init () {
    /** 启动后每隔10秒调用一次 6次之后每60秒固定调用一次 */
    let count = 0
    const intervalId = setInterval(() => {
      if (count >= 6) {
        /** 清除定时器 */
        clearInterval(intervalId)
        setInterval(() => this.#checkCallCount(), 60000)
        return
      }
      this.#checkCallCount()
      count++
    }, 10000)

    /** 必须先调用一次产生缓存 */
    await Promise.all([this.Config(), this.groupCfg('default')])
    return this
  }

  /**
   * 监听文件变动
   * @param file 文件路径
   * @param fn 文件变动后调用的函数
   */
  watch (file: string, fn: Function) {
    /** 检查此文件是否已有监听器 已有则先将原来的停止 */
    const iswatch = this.watcherMap.get(file)
    if (iswatch) {
      iswatch.close()
      this.watcherMap.delete(file)
    }

    /** 新的监听 */
    const watcher = chokidar.watch(file)
    /** 缓存监听器 */
    this.watcherMap.set(file, watcher)
    /** 监听文件变动 */
    watcher.on('change', async () => {
      const result = fn(file)
      if (util.types.isPromise(result)) {
        const res = await result
        if (res === true) clearRequireFile(file)
        return
      }
      if (result === true) clearRequireFile(file)
      if (file === `${userConfig}/config.yaml`) this.updateLevel()
    })

    /** 如果watcher被关闭 则当前实例移除全部监听器并清理watcherMap中的缓存 */
    watcher.once('close', () => {
      watcher.removeAllListeners()
      this.watcherMap.delete(file)
    })
    return watcher
  }

  /** 基本配置 同步 */
  ConfigSync (): ConfigType {
    if (this.change.has(this.configKey)) return this.change.get(this.configKey)

    const defaultCfg = this.getUserYamlSync('config', 'default')
    const userCfg = this.getUserYamlSync('config', 'user')

    const data = { ...defaultCfg, ...userCfg }
    this.change.set(this.configKey, data)
    return data
  }

  /** 基本配置 异步 */
  async Config (): Promise<ConfigType> {
    if (this.change.has(this.configKey)) return this.change.get(this.configKey)

    const [defaultCfg, userCfg] = await Promise.all([
      this.getUserYaml('config', 'default'),
      this.getUserYaml('config', 'user'),
    ])

    const data = { ...defaultCfg, ...userCfg }
    this.change.set(this.configKey, data)
    return data
  }

  /**
   * 获取群配置 同步
   * @param groupId - 群号
   * @param selfId - 机器人ID
   */
  groupCfgSync (groupId: string, selfId?: string): GroupGuildFileCfg {
    try {
      const keys = selfId ? [`Bot:${selfId}:${groupId}`, `Bot:${selfId}`, groupId] : [groupId]
      /** 先走缓存 */
      for (const k of keys) {
        if (this.change.has(k)) {
          this.#addCallCount(k, 'group')
          return this.change.get(k)
        }
      }

      const defaultCfg = this.getUserYamlSync('groupGuild', 'default')
      const userCfg = this.getUserYamlSync('groupGuild', 'user')
      const data = { ...defaultCfg, ...userCfg }
      for (const k of keys) {
        if (!data[k]) continue
        this.#addCallCount(k, 'group')
        return data[k]
      }

      return data['default'] || this.groupCfgDef
    } catch (error) {
      logger.error(error)
      return this.groupCfgDef
    }
  }

  /**
   * 获取群配置 异步
   * @param groupId - 群号
   * @param selfId - 机器人ID
   */
  async groupCfg (groupId: string, selfId?: string): Promise<GroupGuildFileCfg> {
    try {
      const keys = selfId ? [`Bot:${selfId}:${groupId}`, `Bot:${selfId}`, groupId] : [groupId]
      /** 先走缓存 */
      for (const k of keys) {
        if (this.change.has(k)) {
          this.#addCallCount(k, 'group')
          return this.change.get(k)
        }
      }

      const [defaultCfg, userCfg] = await Promise.all([
        this.getUserYaml('groupGuild', 'default'),
        this.getUserYaml('groupGuild', 'user'),
      ])
      const data = { ...defaultCfg, ...userCfg }
      for (const k of keys) {
        if (!data[k]) continue
        this.#addCallCount(k, 'group')
        return data[k]
      }

      return data['default'] || this.groupCfgDef
    } catch (error) {
      logger.error(error)
      return this.groupCfgDef
    }
  }

  /** Redis 配置 同步 */
  redisSync (): RedisType {
    const defaultCfg = this.getUserYamlSync('redis', 'default')
    const userCfg = this.getUserYamlSync('redis', 'user')

    const data = { ...defaultCfg, ...userCfg }
    return data
  }

  /** Redis 配置 异步 */
  async redis (): Promise<RedisType> {
    const [defaultCfg, userCfg] = await Promise.all([
      this.getUserYaml('redis', 'default'),
      this.getUserYaml('redis', 'user'),
    ])

    const data = { ...defaultCfg, ...userCfg }
    return data
  }

  /** Server 配置 同步 */
  ServerSync (): ServerType {
    if (this.change.has(this.serverKey)) return this.change.get(this.serverKey)

    const defaultCfg = this.getUserYamlSync('server', 'default')
    const userCfg = this.getUserYamlSync('server', 'user')

    const data = { ...defaultCfg, ...userCfg }
    this.change.set(this.serverKey, data)
    return data
  }

  /** Server 配置 异步 */
  async Server (): Promise<ServerType> {
    if (this.change.has(this.serverKey)) return this.change.get(this.serverKey)

    const [defaultCfg, userCfg] = await Promise.all([
      this.getUserYaml('server', 'default'),
      this.getUserYaml('server', 'user'),
    ])

    const data = { ...defaultCfg, ...userCfg }
    this.change.set(this.serverKey, data)
    return data
  }

  /** 更新日志等级 同步 */
  updateLevelSync (level?: string) {
    if (level) {
      logger.level = level
      return
    }
    const data = this.ConfigSync()
    logger.level = data.log4jsCfg.level || 'info'
  }

  /** 更新日志等级 异步 */
  async updateLevel (level?: string) {
    if (level) {
      logger.level = level
      return
    }
    const data = await this.Config()
    logger.level = data.log4jsCfg.level || 'info'
  }

  /**
   * 获取用户配置yaml 同步
   * @param name 文件名称
   * @param type 文件类型 用户配置/默认配置
   */
  getUserYamlSync<T extends keyof ConfigMap = keyof ConfigMap> (name: T, type: 'user' | 'default'): ConfigMap[T] {
    const file = `${type === 'default' ? defaultConfig : userConfig}/${name}.yaml`
    this.watch(file, () => true)
    /** tips: 不设置永不过期的缓存是因为group这些配置会另外解析缓存 */
    return requireFileSync(file)
  }

  /**
   * 获取系统配置yaml 异步
   * @param name 文件名称
   * @param type 文件类型 用户配置/默认配置
   */
  async getUserYaml<T extends keyof ConfigMap = keyof ConfigMap> (name: T, type: 'user' | 'default'): Promise<ConfigMap[T]> {
    const file = `${type === 'default' ? defaultConfig : userConfig}/${name}.yaml`
    this.watch(file, () => true)
    /** tips: 不设置永不过期的缓存是因为group这些配置会另外解析缓存 */
    return requireFile(file)
  }

  /**
   * 获取配置yaml 同步
   * @description 此方法默认监听文件变动
   * @param file 文件路径
   * @param watch 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
   */
  getYamlSync (file: string, watch: (file: string) => Promise<boolean>): any
  /**
   * 获取配置yaml 同步
   * @param file 文件路径
   * @param isWatch 是否监听文件 由框架来管理缓存 发生变动自动清除缓存
   */
  getYamlSync (file: string, isWatch: boolean): any
  /**
   * 获取配置yaml 同步
   * @param file 文件路径
   * @param watch 是否监听文件变动 | 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
   */
  getYamlSync (file: string, watch: boolean | ((file: string) => Promise<boolean>)): any {
    if (typeof watch === 'function') {
      this.watch(file, watch)
    } else if (typeof watch === 'boolean' && watch) {
      this.watch(file, () => true)
    }

    return requireFileSync(file)
  }

  /**
   * 获取配置yaml 异步
   * @description 此方法默认监听文件变动
   * @param file 文件路径
   * @param watch 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
   */
  getYaml (file: string, watch: (file: string) => Promise<boolean>): Promise<any>
  /**
   * 获取配置yaml 异步
   * @param file 文件路径
   * @param isWatch 是否监听文件 由框架来管理缓存 发生变动自动清除缓存
   */
  getYaml (file: string, isWatch: boolean): Promise<any>
  /**
   * 获取配置yaml 异步
   * @param file 文件路径
   * @param watch 是否监听文件变动 | 自定义监听函数 文件发生变动时调用 根据返回值判断是否清除缓存
   */
  async getYaml (file: string, watch: boolean | ((file: string) => Promise<boolean>)) {
    if (typeof watch === 'function') {
      this.watch(file, watch)
    } else if (typeof watch === 'boolean' && watch) {
      this.watch(file, () => true)
    }

    return requireFile(file)
  }

  /**
   * 增加调用次数
   * @param key - 键
   * @param type - 文件类型
   */
  async #addCallCount (key: string, type: ConfigFileType) {
    const count = this.callCount.get(key)
    count ? count.count++ : this.callCount.set(key, { start: 0, count: 1, cache: false, type })
  }

  /**
   * @description 检查调用次数 生成缓存、清除缓存
   */
  async #checkCallCount () {
    await Promise.all(Array.from(this.callCount).map(async ([key, value]) => {
      /** 已缓存 */
      if (value.cache) {
        /** 缓存和实际调用次数差距小于10则清除缓存 */
        if (value.count - value.start < 10) {
          this.change.delete(key)
          this.callCount.delete(key)
          return
        }

        /** 刷新缓存时调用数量 */
        const data = this.callCount.get(key)
        if (!data) return
        data.start = value.count
        return
      }

      /** 缓存和实际调用次数差距大于10则缓存 */
      if (value.count - value.start >= 10) {
        switch (value.type) {
          case 'group': {
            const keys = key.split(':')
            const data = keys.length === 3 ? this.groupCfg(keys[2], keys[1]) : this.groupCfg(keys[1] ?? keys[0])
            this.change.set(key, data)
            break
          }
        }

        const data = this.callCount.get(key)
        if (!data) return
        data.start = value.count
        data.cache = true
        return
      }

      /** 缓存和实际调用次数差距小于10则清除缓存 */
      this.callCount.delete(key)
      if (this.change.has(key)) this.change.delete(key)
    }))
  }
}
