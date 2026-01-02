import path from 'node:path'
import crypto from 'node:crypto'
import callsites from 'callsites'
import { fileURLToPath } from 'node:url'
import { pkgRegistry } from '../package/registry'
import type { PluginType } from '../store/types'

/** 插件缓存 package.file 属性类型 */
export interface PluginCacheFile {
  /** 绝对路径 */
  absPath: string
  /** 相对于插件包根目录的路径 */
  get relPath (): string
  /** 目录 */
  get dirname (): string
  /** 文件名 */
  get basename (): string
}

let index = 0

/**
 * 构建插件唯一ID
 * @description 格式：`{packageName}:{type}:{filename}:{index}:{timestamp}`
 * @param packageName 包名
 * @param type 插件类型
 * @param filename 文件名
 * @returns 返回唯一ID
 * @example
 * ```ts
 * const id = createID('karin-plugin-example', 'command', 'index.mjs')
 * // -> 'karin-plugin-example:command:index.mjs:0:1700000000000'
 * ```
 */
export const createID = (
  packageName: string,
  type: PluginType,
  filename: string
): string => {
  const _index = index++
  const id = `${packageName}:${type}:${filename}:${_index}:${Date.now()}`
  return id
}

/**
 * 所有插件方法构建器基类
 * @description 所有方法都应该继承此类
 */
export abstract class BuilderBase {
  /**
   * 当前方法的唯一 ID
   * - 格式：`{packageName}:{type}:{filename}:{index}:{timestamp}`
   * @example
   * ```ts
   * const command = new CreateCommand()
   * console.log(command.id)
   * // -> 'karin-plugin-example:command:index.mjs:0:1700000000000'
   * ```
   */
  #id: string | null = null
  /**
   * 当前方法所属插件包名称
   */
  #packageName: string | null = null
  /**
   * 当前方法创建者绝对路径
   */
  #callerPath: string | null = null
  /**
   * 相对于插件包目录的相对路径
   */
  #relPath: string | null = null

  /**
   * 调用者绝对路径
   * @return 返回调用者绝对路径
   * @example
   * ```ts
   * const command = new CreateCommand()
   * console.log(command.callerPath)
   * // -> /user/karin/plugins/karin-plugin-example/dist/index.mjs
   * // -> c:/user/karin/plugins/karin-plugin-example/dist/index.mjs
   * ```
   */
  get callerPath (): string {
    // TODO: 需要处理生产环境
    if (this.#callerPath) return this.#callerPath
    const file = callsites()
    let files = Array.from(new Set(file.map(f => f.getFileName())
      // "node:internal/modules/esm/module_job"
      .filter(f => f !== null)
      .filter(f => !f.startsWith('node:internal/'))
    ))

    // 处于 karin-core 开发环境下
    if (process.env.KARIN_ENV === 'development') {
      files = files.filter(f => !f.includes('/packages/'))
    } else {
      // 生产环境下，排除掉 node_modules/karin
      files = files.filter(f => !f.includes('node_modules/karin'))
    }

    const filename = files[0]
    if (!filename) {
      throw new Error('获取插件的绝对路径失败')
    }

    // 处理 file:// 协议和普通路径
    const caller = filename.startsWith('file://')
      ? fileURLToPath(filename)
      : filename
    this.#callerPath = caller.replaceAll('\\', '/')
    return this.#callerPath
  }

  /**
   * 当前文件信息
   * @return 返回当前文件信息
   * @example
   * ```ts
   * console.log(this.file)
   * // -> {
   * //      absPath: '/user/karin/plugins/karin-plugin-example/dist/index.mjs',
   * //      dirname: '/user/karin/plugins/karin-plugin-example/dist',
   * //      relPath: 'dist/index.mjs',
   * //      basename: 'index.mjs'
   * //    }
   * ```
   */
  get file (): PluginCacheFile {
    const abs = this.callerPath
    const _this = this

    return {
      get absPath () {
        return abs
      },
      get relPath () {
        let relPath = _this.#relPath
        if (!relPath) {
          const absPath = pkgRegistry.getAbsPath(_this.packageName)
          relPath = absPath ? absPath.replaceAll('\\', '/') : ''
          _this.#relPath = relPath
        }
        return relPath
      },
      get dirname () {
        return path.dirname(abs).replaceAll('\\', '/')
      },
      get basename () {
        return path.basename(abs)
      },
    }
  }

  /**
   * 插件类型
   * - command: 命令
   * - accept: 接受器
   * - task: 任务
   * - button: 按钮
   * - handler: 事件处理器
   *
   * @return 返回插件类型
   */
  get type (): PluginType {
    return 'command'
  }

  /**
   * 获取插件包名称
   * @description 如果无法获取包名，则返回`{type}:unknown:{filename}`
   * @example
   * ```ts
   * const command = new CreateCommand()
   * console.log(command.packageName)
   * // -> 'karin-plugin-example'
   * ```
   */
  get packageName (): string {
    if (this.#packageName) return this.#packageName
    const callerDir = this.file.absPath
    const name = pkgRegistry.getPackageNameByFile(callerDir)
    if (!name) {
      throw new Error(`无法通过路径获取插件包名称: ${callerDir}`)
    }

    this.#packageName = name
    return this.#packageName
  }

  /**
   * 当前方法的唯一 ID
   * - 格式：`{packageName}:{type}:{filename}:{index}:{timestamp}`
   * @example
   * ```ts
   * const command = new CreateCommand()
   * console.log(command.id)
   * // -> 'karin-plugin-example:command:index.mjs:0:1700000000000'
   * ```
   */
  get id (): string {
    if (this.#id) return this.#id
    this.#id = createID(
      this.packageName,
      this.type,
      this.file.basename
    )

    return this.#id
  }

  /**
   * 插件相关日志方法
   * @description 自动添加前缀:`[${packageName}:${basename}]`
   * @param args 日志参数
   */
  log (...args: unknown[]) {
    const prefix = `[${this.packageName}:${this.file.basename}]`
    logger.mark(prefix, ...args)
  }

  /**
   * 默认 app 名称
   * @description 使用 callerPath 哈希的前7位作为默认名称
   */
  get defaultAppName (): string {
    return crypto.createHash('md5').update(this.callerPath).digest('hex').slice(0, 7)
  }
}
