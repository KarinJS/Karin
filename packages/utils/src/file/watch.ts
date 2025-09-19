import path from 'node:path'
import chokidar from 'chokidar'
import { formatPath } from '../path'
import { clearRequire, requireFileSync, requireFile } from '../require'

import type { Stats } from 'node:fs'
import type { RequireOptions } from '../require'
import type { ChokidarOptions, FSWatcher } from 'chokidar'

export interface CallbackOptions {
  /** 文件变动的状态 */
  stats?: Stats
  /** 获取变动的文件名称 `file.txt` */
  name: string
  /** 获取变动的文件后缀: `.txt` */
  extname: string
  /** 获取变动的文件目录 */
  dirname: string
  /** 获取格式化之后的文件路径 */
  formattedPath: string
}

export type Callback<T> = (
  /** 文件变动的路径 */
  path: string,
  /** 变动之间的数据 */
  old: T,
  /** 变动之后的数据 */
  data: T,
  options: CallbackOptions
) => void | Promise<void>

export interface WatchOptions {
  /**
   * 操作文件数据使用的函数
   * - `requireFile`: 异步
   * - `requireFileSync`： 同步
   *
   * @default 'requireFileSync'
   * @description 两者在本质上并无区别，仅在调用方式上有所不同，缓存也是共享的
   */
  write?: 'requireFileSync' | 'requireFile'
  /** 操作文件数据参数 */
  require?: RequireOptions
  /** 传递给 `chokidar` 的参数 */
  chokidar?: ChokidarOptions
}

const cache = new Map<string, FSWatcher>()

/**
 * 监听文件变动
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 * @deprecated 推荐使用 `watchs`
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
  const watcher = chokidar.watch(file, {
    atomic: true,
    ignoreInitial: true,
    ignored: /(^|[/\\])\../,
  })
  /** 缓存监听器 */
  cache.set(file, watcher)
  /** 监听文件变动 */
  watcher.on('change', async () => {
    logger.info(`[watch][change] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`)
    const oldData = requireFileSync<T>(file, { ...options, readCache: true })
    clearRequire(file)
    const newData = requireFileSync<T>(file, { ...options, force: true })
    typeof fnc === 'function' && fnc(oldData, newData)
  })

  /** 监听删除 */
  watcher.on('unlink', () => {
    logger.info(`[watch][unlink] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`)
    clearRequire(file)
  })

  // @ts-ignore TODO: 严格意义来说可能不需要这个...
  watcher.once('close', () => {
    cache.delete(file)
    clearRequire(file)
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
 * @deprecated 推荐使用 `watchs`
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
    clearRequire(this.file)
    /** 关闭监听器 */
    return this.watcher.close()
  }
}

/**
 * 监听管理器
 * @param dynamicFile 动态配置文件路径
 * @param defaultCFile 默认配置文件路径
 * @deprecated 推荐使用 `watchs`
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
    clearRequire(this.defaultCFile)
    /** 关闭监听器 */
    return this.watcher.close()
  }
}

/**
 * 监听文件变动
 * @param paths 文件路径或路径数组
 * @param callback 文件变动时的回调函数
 * @param options 配置选项
 * @returns FSWatcher 实例
 */
export const watchs = <T = unknown> (paths: string | string[], callback: Callback<T>, options?: WatchOptions): FSWatcher => {
  if (!paths?.length) {
    throw new TypeError('请正确传递 paths 参数，接受 string | string[] 类型')
  }

  if (typeof callback !== 'function') {
    throw new TypeError('请正确传递 callback 参数，接受 function 类型')
  }

  const watcher = chokidar.watch(paths, {
    ...options?.chokidar,
    atomic: options?.chokidar?.atomic ?? true,
    ignoreInitial: options?.chokidar?.ignoreInitial ?? true,
    ignored: options?.chokidar?.ignored ?? /(^|[/\\])\../,
  })

  watcher.on('change', async (_path, stats) => {
    const read = (() => {
      if (options?.write === 'requireFileSync') {
        return (file: string) => Promise.resolve(requireFileSync(file, options?.require))
      }

      return async (file: string) => await requireFile(file, options?.require)
    })()

    const oldData = await read(_path)
    clearRequire(_path)

    const newData = await read(_path)

    callback(_path, oldData, newData, {
      stats,
      get name () {
        return path.basename(_path)
      },
      get extname () {
        return path.extname(_path)
      },
      get dirname () {
        return formatPath(path.dirname(_path))
      },
      get formattedPath () {
        return formatPath(_path)
      },
    })
  })

  return watcher
}
