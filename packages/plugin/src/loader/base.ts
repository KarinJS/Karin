import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { pluginEnv } from '../utils/env'
import { engines } from '../utils/engines'
import { isDev, isTs } from '@karinjs/envs'
import { karinPathBase } from '@karinjs/store'
import { registerModule } from '../utils/registerModule'
import { imports, requireFile, formatPath, findFiles } from '@karinjs/utils'
import { missingDeps, publicManager } from '../store'
import { pkgRegistry } from '../package/registry'

import type { DefineConfig } from '../config'
import type { Package, PluginsTypes } from '../package'

/**
 * 包元信息缓存项
 */
export interface PackageMetaInfoCache {
  /** 包名 */
  name: string
  /** 包绝对路径 */
  abs: string
  /** package.json 路径 */
  pkg: string
}

/** 入口配置项类型 */
export type EntryItem = Extract<DefineConfig['entry'], any[]>[number]

/**
 * 插件加载结果状态
 */
export enum LoadStatus {
  /** 加载成功 */
  Success = 'success',
  /** 配置不存在 */
  NotFound = 'not_found',
  /** 版本不兼容 */
  Incompatible = 'incompatible',
}

/**
 * 插件加载器
 * @description 负责插件系统的初始化、扫描和加载
 */
export class PluginsLoader {
  logger = global.logger.prefix('[plugins-loader]')

  /**
   * 调用钩子函数
   * @param hook - 钩子函数（可能是同步或异步）
   * @param args - 传递给钩子的参数
   * @description 统一处理同步和异步钩子函数的调用
   */
  async callHook<T extends any[]> (
    hook: ((...args: T) => void | Promise<void>) | undefined,
    ...args: T
  ): Promise<void> {
    if (typeof hook !== 'function') return
    const result = hook(...args)
    if (util.types.isPromise(result)) await result
  }

  /**
   * 获取绝对路径
   * @param abs - 插件包绝对路径
   * @param value - 相对路径值
   * @returns 格式化后的绝对路径或 null
   */
  getPath (abs: string, value?: string | null): string | null {
    return typeof value === 'string' ? formatPath(path.join(abs, value)) : null
  }

  /**
   * 获取 exports 字段路径
   * @param value - exports 字段的值
   * @returns 解析后的相对路径或 null
   */
  getExportsPath (value: string | Record<string, any> | undefined): string | null {
    if (!value || typeof value === 'string') return null
    return isDev() ? value.development || null : value['import'] || value['default'] || null
  }

  /**
   * 创建目录
   * @param dir - 目录路径
   */
  async createDir (dir: string): Promise<void> {
    try {
      await fs.promises.mkdir(dir, { recursive: true })
    } catch (error) {
      this.logger.error(new Error(`创建插件配置目录失败: ${dir}`, { cause: error }))
    }
  }

  /**
   * 读取 package.json
   * @param filePath - package.json 文件路径
   * @returns package.json 内容对象
   */
  readPkg (filePath: string): Promise<Package> {
    return requireFile<Package>(filePath, { ex: 0, type: 'json' })
  }

  /**
   * 获取 karin.config 配置
   * @param pkg - package.json 内容对象
   * @param abs - 插件包路径
   * @returns karin.config 内容对象或 null
   */
  async getConfig (pkg: Package, abs: string): Promise<DefineConfig | null> {
    const value = this.getExportsPath(pkg.exports?.['./karin.config'])
    if (!value) return null

    /** 无论任何环境不可以直接import 否则git、dev包会无法使用 */
    const filePath = path.join(abs, value)
    return imports<DefineConfig>(filePath, { import: 'default' }).catch(() => null)
  }

  /**
   * 创建插件配置目录
   * @param name - 插件包名称
   * @param files - 需要创建的文件夹列表
   */
  async createDirs (name: string, files?: string[]): Promise<void> {
    const dirs = Array.isArray(files) ? files : files === undefined ? ['config', 'data'] : []
    if (dirs.length === 0) return

    const paths = dirs.map((dir) => path.join(karinPathBase, name, dir))
    await Promise.all(paths.map((dir) => this.createDir(dir)))
  }

  /**
   * 获取 package.exports 主文件
   * @param pkg - package.json 内容对象
   * @param abs - 插件包绝对路径
   * @returns 主文件绝对路径或 null
   */
  getMain (pkg: Package, abs: string): string | null {
    const main = pkg.exports?.['.']
    if (!main) return this.getPath(abs, pkg.main)
    if (typeof main === 'string') return this.getPath(abs, main)
    return this.getPath(abs, this.getExportsPath(main))
  }

  /**
   * 加载 package main
   * @param meta - 插件包元信息
   */
  async loadMain (meta: PackageMetaInfoCache): Promise<void> {
    const info = pkgRegistry.get(meta.name)
    if (!info) {
      this.logger.error(`加载 main 失败，未找到插件包信息: ${meta.name}`)
      return
    }

    if (!info.main) {
      this.logger.debug(`[${meta.name}] 插件包未定义 main 文件`)
      return
    }

    await this.execInit(meta.name, info.main)
  }

  /**
   * 执行插件初始化函数
   * @param name - 插件名称
   * @param mainPath - 主文件路径
   */
  async execInit (name: string, mainPath: string): Promise<void> {
    this.logger.debug(`[${name}] 加载插件 main 文件: ${mainPath}`)
    const init = await imports(mainPath, { import: 'KARIN_PLUGIN_INIT' }).catch((error) => {
      this.logger.error(new Error(`[${name}] 加载插件 main 文件失败: ${mainPath}`, { cause: error }))
      return null
    })

    if (typeof init !== 'function') {
      this.logger.debug(`[${name}] 插件 main 文件未导出 KARIN_PLUGIN_INIT 函数`)
      return
    }

    this.logger.debug(`[${name}] 执行 KARIN_PLUGIN_INIT`)
    await Promise.resolve(init()).catch((error: Error) => {
      this.logger.error(new Error(`[${name}] 执行插件 KARIN_PLUGIN_INIT 失败`, { cause: error }))
    })

    this.logger.debug(`[${name}] 插件 main 文件加载完成`)
  }

  /**
   * 导入单个入口文件
   * @internal 辅助函数 - 服务于 {@link loadEntry}
   * @param meta - 插件包元信息
   * @param file - 文件路径
   * @returns 导入的模块内容或 null
   * @see {@link loadEntry}
   */
  async importEntryFile (meta: PackageMetaInfoCache, file: string): Promise<Record<string, unknown> | null> {
    this.logger.debug(`[${meta.name}] 加载文件: ${file}`)
    const result = await imports<Record<string, unknown>>(file).catch((error) => {
      this.logger.debug(`[${meta.name}] imports error: ${file}\n`, error)
      /** 记录import错误 */
      missingDeps.add(meta.name, file, error)
      return null
    })

    return result
  }

  /**
   * 处理单个入口文件
   * @internal 辅助函数 - 服务于 {@link loadEntry}
   * @param meta - 插件包元信息
   * @param file - 文件路径
   * @see {@link loadEntry}
   */
  async processEntryFile (meta: PackageMetaInfoCache, file: string): Promise<void> {
    const result = await this.importEntryFile(meta, file)
    if (!result) return
    await registerModule(meta, file, result)
  }

  /**
   * 加载所有入口文件
   * @param meta - 插件包元信息
   */
  async loadEntry (meta: PackageMetaInfoCache): Promise<void> {
    const files = pkgRegistry.getFiles(meta.name)
    if (files.length === 0) {
      this.logger.debug(`[${meta.name}] 未定义任何入口文件或找不到对应的缓存`)
      return
    }

    await Promise.all(files.map((file) => this.processEntryFile(meta, file)))

    this.logger.debug(`[${meta.name}] 所有入口文件加载完成`)
  }

  /**
   * 获取入口路径对应的文件列表
   * @internal 辅助函数 - 服务于 {@link getEntry}
   * @param meta - 插件包信息
   * @param entryPath - 相对路径
   * @returns 文件绝对路径列表
   * @see {@link getEntry}
   */
  async getFiles (meta: PackageMetaInfoCache, entryPath: string): Promise<string[]> {
    if (!entryPath) return []

    const ts = isTs()
    const filePath = path.join(meta.abs, entryPath)
    const stat = await fs.promises.stat(filePath)

    if (stat.isFile()) {
      /** 是文件，直接返回 */
      const reg = ts
        ? /\.(mts|mjs|ts|js)$/
        : /\.(mjs|js)$/
      if (!reg.test(filePath)) {
        this.logger.debug(`[${meta.name}] 入口文件扩展名不符合要求: ${filePath}`)
        return []
      }
      return [formatPath(filePath)]
    }

    if (stat.isDirectory()) {
      /** 是文件夹，查找其中的所有入口文件 */
      return findFiles(filePath, {
        ext: ts ? ['.js', '.mjs', '.ts', '.mts'] : ['.js', '.mjs'],
        pathsType: 'abs',
        recursive: false,
      })
    }

    return []
  }

  /**
   * 从入口配置项收集路径
   * @internal 辅助函数 - 服务于 {@link getEntry}
   * @param val - 入口配置项
   * @returns 路径列表
   * @see {@link getEntry}
   */
  collectEntry (val: EntryItem): string[] {
    if (typeof val === 'string') return [val]

    const isMatch = (val?.type === 'dev' && isDev()) || (val?.type === 'prod' && !isDev())
    if (!isMatch) return []

    if (typeof val.path === 'string') return [val.path]
    return Array.isArray(val.path) ? val.path : []
  }

  /**
   * 获取入口文件列表
   * @param meta - 插件包列表缓存对象
   * @param entry - 入口配置
   * @returns 入口绝对路径列表
   */
  async getEntry (
    meta: PackageMetaInfoCache,
    entry: DefineConfig['entry']
  ): Promise<string[]> {
    if (!entry) return []

    const entries = Array.isArray(entry) ? entry : [entry]
    const paths = entries.flatMap((val) => this.collectEntry(val))
    const results = await Promise.all(paths.map((p) => this.getFiles(meta, p)))

    return [...new Set(results.flat())].filter(Boolean)
  }

  /**
   * 检查版本兼容性
   * @param name - 插件名称
   * @param version - 版本要求
   * @param ignoreEngines - 是否忽略引擎检查
   * @returns 是否兼容
   */
  checkVersion (name: string, version: string | undefined, ignoreEngines: boolean): boolean {
    if (typeof version !== 'string') return true
    return engines.check(name, version, ignoreEngines)
  }

  /**
   * 设置插件环境
   * @param meta - 插件包元信息
   * @param options - 配置选项
   */
  async setup (
    meta: PackageMetaInfoCache,
    options: { files?: string[], public?: any, env?: any }
  ): Promise<void> {
    await this.createDirs(meta.name, options.files)
    publicManager.set(meta.name, options.public)
    pluginEnv.create(meta.name, options.env)
  }

  /**
   * 添加插件缓存
   * @param meta - 插件包元信息
   * @param type - 插件类型
   * @param main - 主文件路径
   * @param entry - 入口文件列表
   */
  addCache (meta: PackageMetaInfoCache, type: PluginsTypes, main: string | null, entry: string[]): void {
    pkgRegistry.register({
      name: meta.name,
      abs: meta.abs,
      pkgPath: meta.pkg,
      type: type as 'npm' | 'apps' | 'dev',
      main,
    })

    entry.forEach((file) => {
      pkgRegistry.addFile(meta.name, file)
    })
  }
}
