import fs from 'node:fs'
import path from 'node:path'
import { watchs } from './watch'
import { karinPathBase } from '@karinjs/paths'
import { findFiles, findFilesSync } from '../path'
import { DEFAULT_CREATE_FILES } from '@karinjs/envs'
import { requireFileSync, writeFileSync } from '../require'

import type { RequireOptions } from '../require'
import type { Callback, WatchOptions } from './watch'

/**
 * 文件覆盖策略
 * - srcPath: 源文件路径
 * - targetPath: 目标文件路径
 * - fileName: 文件名
 *
 * @returns 仅在返回true时覆盖文件
 */
export type Overwrite<T extends boolean> = (
  /** 源文件路径 */
  srcPath: string,
  /** 目标文件路径 */
  targetPath: string,
  /** 文件名 */
  fileName: string
) => T extends true ? Promise<boolean | undefined> : boolean | undefined

export interface CopyConfigOptions<T extends boolean> {
  /**
   * 目标文件夹名称
   * @default 'config'
   */
  target?: 'config'
  /**
   * 仅复制该后缀的文件
   * @default undefined
   */
  ext?: string | string[]
  /**
   * 如文件已经存在是否覆盖
   * @default false
   */
  overwrite?: boolean | Overwrite<T>
}

/**
 * @class
 */
export class CreateConfig {
  /** 插件配置文件路径 */
  #dir: string

  /**
   * 构造函数
   * @constructor
   * @param name 插件名称
   * @param files 插件配置文件列表
   */
  constructor (name: string, files = DEFAULT_CREATE_FILES) {
    if (!name || typeof name !== 'string' || !name.length) {
      throw new TypeError('插件名称必须是 string 类型')
    }

    this.#dir = path.join(karinPathBase, name).replace(/\\/g, '/')
    files.forEach(v => this.mkdir(path.join(this.#dir, v)))
  }

  /**
   * 获取配置目录绝对路径
   */
  get configDir () {
    return this.#dir
  }

  /**
   * 递归创建目录 已存在会跳过
   * @param dir 目录路径
   */
  mkdir (dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  /**
   * 复制配置文件
   * @param src 源目录路径
   * @param target 目标文件夹路径 `默认'config'`
   */
  copyConfigSync (src: string, options: CopyConfigOptions<false> = {}) {
    if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
      throw new Error(`源目录不存在或无效: ${src}`)
    }

    if (typeof options.target !== 'undefined' && typeof options.target !== 'string') {
      throw new TypeError('target 必须是 string 类型')
    }

    const overwrite = (() => {
      if (typeof options.overwrite === 'function') {
        return (...args: Parameters<Overwrite<false>>) => {
          // @ts-ignore
          const result = options.overwrite(...args)
          return result === true
        }
      }

      if (options.overwrite === true) {
        return () => true
      }

      return () => false
    })()

    const targetDir = path.join(this.#dir, options.target || 'config')
    this.mkdir(targetDir)

    const files = findFilesSync(src, { ext: options.ext })
    files.forEach(name => {
      const srcFile = path.join(src, name)
      const targetFile = path.join(targetDir, name)

      if (fs.existsSync(targetFile)) {
        const result = overwrite(srcFile, targetFile, name)
        if (!result) return
        fs.rmSync(targetFile, { recursive: true, force: true })
      }

      fs.copyFileSync(srcFile, targetFile)
    })
  }

  /**
   * 异步复制配置文件
   * @param src 源目录路径
   * @param options 配置选项
   */
  async copyConfig (src: string, options: CopyConfigOptions<true> = {}) {
    const srcStats = await fs.promises.stat(src)
    if (!srcStats.isDirectory()) {
      throw new Error(`源目录不存在或无效: ${src}`)
    }

    if (typeof options.target !== 'undefined' && typeof options.target !== 'string') {
      throw new TypeError('target 必须是 string 类型')
    }

    const overwrite = (() => {
      if (typeof options.overwrite === 'function') {
        return async (...args: Parameters<Overwrite<true>>) => {
          // @ts-ignore
          const result = await options.overwrite(...args)
          return result === true
        }
      }

      if (options.overwrite === true) {
        return async () => true
      }

      return async () => false
    })()

    const targetDir = path.join(this.#dir, options.target || 'config')
    this.mkdir(targetDir)

    const files = await findFiles(src, { ext: options.ext })

    await Promise.all(files.map(async name => {
      const srcFile = path.join(src, name)
      const targetFile = path.join(targetDir, name)

      try {
        await fs.promises.access(targetFile)
        const result = await overwrite(srcFile, targetFile, name)
        if (!result) return
        await fs.promises.rm(targetFile, { recursive: true, force: true })
      } catch { }

      await fs.promises.copyFile(srcFile, targetFile)
    }))
  }

  /**
   * 在 config 下创建配置文件
   * @param name 文件名 `config.json` `config.yaml`...
   * @param content 文件内容
   * @param options fs 写入选项
   * - 在 `name` 包含 `.json` 时，会调用 `JSON.stringify` 格式化内容
   * - 在 `name` 包含 `.yml` `.yaml` 时，会调用 `yaml.stringify` 格式化内容
   * - 参数 `options` 会被传递给 `fs.writeFileSync` 方法，默认为 `utf-8`
   * @description 需要注意，文件如果已存在则不会做任何覆盖操作
   */
  createConfigFile (name: string, content: unknown, options?: fs.WriteFileOptions) {
    const filePath = path.join(this.#dir, 'config', name)
    if (fs.existsSync(filePath)) {
      return
    }

    writeFileSync(filePath, content, options)
  }

  /**
   * 读取配置文件
   * @param name 文件名 `config.json` `config.yaml`...
   * @param options `requireFileSync` 参数
   * @description 如果需要读取非config目录下的文件，可以通过 `options.dir` 指定目录名称
   * @throws 需要注意，文件如果不存在则会抛出错误
   */
  readConfigFile<T> (name: string, options?: {
    /**
     * 配置文件目录 例如想读取data下的配置文件
     * @default `config`
     */
    dir: string
  } & RequireOptions): T {
    const dir = path.join(this.#dir, options?.dir || 'config')
    if (!fs.existsSync(dir)) {
      throw new Error(`配置目录不存在: ${dir}`)
    }

    const filePath = path.join(dir, name)
    if (!fs.existsSync(filePath)) {
      throw new Error(`配置文件不存在: ${filePath}`)
    }

    return requireFileSync<T>(filePath, options)
  }

  /**
   * 写入配置文件
   * @param name 文件名 `config.json` `config.yaml`...
   * @param content 文件内容
   * @param options fs 写入选项
   * @description 如果需要读取非config目录下的文件，可以通过 `options.dir` 指定目录名称
   * - 在 `name` 包含 `.json` 时，会调用 `JSON.stringify` 格式化内容
   * - 在 `name` 包含 `.yml` `.yaml` 时，会调用 `yaml.stringify` 格式化内容
   * - 参数 `options` 会被传递给 `fs.writeFileSync` 方法，默认为 `utf-8`
   * @description 默认为覆盖写入，如需追加写入，请设置 `options.flag` 为 `'a'`
   */
  writeConfigFile (name: string, content: unknown, options?: fs.WriteFileOptions) {
    const filePath = path.join(this.#dir, 'config', name)
    writeFileSync(filePath, content, options)
  }

  /**
   * 监听文件变动
   * @param paths 监听的目录名称
   * @param callback 文件变动时的回调函数
   * @param options 配置选项
   * @returns FSWatcher 实例
   */
  watch<T = any> (paths: string | string[], callback: Callback<T>, options?: WatchOptions) {
    if (!paths?.length) {
      throw new TypeError('请正确传递 paths 参数，接受 string | string[] 类型，例如 [\'config\', \'data\']')
    }

    let files = typeof paths === 'string' ? [paths] : paths
    files = files.map(v => path.join(this.#dir, v))
    return watchs<T>(files, callback, options)
  }
}
