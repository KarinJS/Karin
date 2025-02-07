import path from 'node:path'
import chokidar, { type FSWatcher } from 'chokidar'
import { clearRequireFile, requireFileSync } from './require'

const cache = new Map<string, FSWatcher>()

/**
 * 监听文件变动
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export const watch = <T> (
  file: string,
  fnc: (
    /** 旧数据 */
    oldData: T,
    /** 新数据 */
    newData: T
  ) => void,
  options?: Parameters<typeof requireFileSync>[1]
) => {
  /** 检查此文件是否已有监听器 已有则先将原来的停止 */
  const isWatch = cache.get(file)
  if (isWatch) {
    isWatch.close()
    cache.delete(file)
  }

  /** 新的监听 */
  const watcher = chokidar.watch(file)
  /** 缓存监听器 */
  cache.set(file, watcher)
  /** 监听文件变动 */
  watcher.on('change', async () => {
    logger.info(`[配置文件变动] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`)
    const oldData = requireFileSync<T>(file, { ...options, readCache: true })
    clearRequireFile(file)
    const newData = requireFileSync<T>(file, { ...options, force: true })
    typeof fnc === 'function' && fnc(oldData, newData)
  })

  /** 监听删除 */
  watcher.on('unlink', () => {
    logger.info(`[配置文件删除] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`)
    clearRequireFile(file)
  })

  /** 如果watcher被关闭 则当前实例移除全部监听器并清理watcherMap中的缓存 */
  watcher.once('close', () => {
    watcher.removeAllListeners()
    cache.delete(file)
    clearRequireFile(file)
  })

  return new Watch<T>(file, watcher, options)
}

/**
 * 传入两个配置文件路径，监听第一个的变动并返回合并后的配置
 * @param dynamicFile 动态配置文件路径
 * @param defaultCFile 默认配置文件路径
 */
export const watchAndMerge = <T> (
  dynamicFile: string,
  defaultCFile: string,
  fnc: (oldData: T, newData: T) => T
) => {
  /** 监听器 */
  const watcher = watch(dynamicFile, fnc)
  return new Watcher<T>(dynamicFile, defaultCFile, watcher.watcher, watcher.options)
}

/**
 * 监听管理器
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export class Watch<T> {
  watcher: FSWatcher
  file: string
  options?: Parameters<typeof requireFileSync>[1]
  constructor (
    file: string,
    watcher: FSWatcher,
    options?: Parameters<typeof requireFileSync>[1]
  ) {
    /** 监听器 */
    this.watcher = watcher
    /** 动态配置文件路径 */
    this.file = file
    /** 选项 */
    this.options = options
  }

  /**
   * @description 获取配置数据
   */
  get value () {
    return requireFileSync<T>(this.file, this.options)
  }

  /**
   * @description 关闭监听器并清理全部缓存
   */
  close () {
    /** 清理缓存 */
    clearRequireFile(this.file)
    /** 关闭监听器 */
    return this.watcher.close()
  }
}

/**
 * 监听管理器
 * @param dynamicFile 动态配置文件路径
 * @param defaultCFile 默认配置文件路径
 */
export class Watcher<T> {
  watcher: FSWatcher
  dynamicFile: string
  defaultCFile: string
  options?: Parameters<typeof requireFileSync>[1]
  constructor (
    dynamicFile: string,
    defaultCfgFile: string,
    watcher: FSWatcher,
    options?: Parameters<typeof requireFileSync>[1]
  ) {
    /** 监听器 */
    this.watcher = watcher
    /** 动态配置文件路径 */
    this.dynamicFile = dynamicFile
    /** 默认配置文件路径 */
    this.defaultCFile = defaultCfgFile
    /** 选项 */
    this.options = options
  }

  /**
   * @description 获取配置数据
   */
  get value () {
    const dynamicData = requireFileSync<T>(this.dynamicFile, this.options)
    const defaultData = requireFileSync<T>(this.defaultCFile, this.options)
    if (typeof defaultData === 'object' && typeof dynamicData === 'object') {
      return { ...defaultData, ...dynamicData }
    }

    if (Array.isArray(defaultData) && Array.isArray(dynamicData)) {
      return [...defaultData, ...dynamicData]
    }

    return dynamicData
  }

  /**
   * @description 关闭监听器并清理全部缓存
   */
  close () {
    /** 清理缓存 */
    clearRequireFile(this.defaultCFile)
    /** 关闭监听器 */
    return this.watcher.close()
  }
}
