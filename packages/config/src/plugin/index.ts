import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { store } from '@karinjs/store'
import { copyConfigSync, requireFile, requireFileSync, writeFile, writeFileSync, types } from '@karinjs/utils'
import type { RequireOptions, WriteFileOptions, WriteFileOptionsSync } from '@karinjs/utils'

/**
 * 为插件包提供一个快捷的配置文件操作类
 */
export class PluginConfig<T extends Record<string, any>> {
  /** 插件名称 */
  pluginName: string
  /** 数据操作工具 */
  types = types

  /**
   * 构建函数
   * @param pluginName 插件名称
   */
  constructor (
    pluginName: string
  ) {
    this.pluginName = pluginName
  }

  /**
   * 获取插件配置相关目录
   */
  get dir () {
    return {
      /**
       * 插件数据根目录
       * @example
       * ```ts
       * console.log(config.dir.base)
       * // -> /root/karin/.karin/karin-plugin-example
       * ```
       */
      base: store.plugin.getBaseDir(this.pluginName),
      /**
       * 插件配置目录
       * @example
       * ```ts
       * console.log(config.dir.config)
       * // -> /root/karin/.karin/karin-plugin-example/config
       * ```
       */
      config: store.plugin.getConfigDir(this.pluginName),
      /**
       * 插件数据目录
       * @example
       * ```ts
       * console.log(config.dir.data)
       * // -> /root/karin/.karin/karin-plugin-example/data
       * ```
       */
      data: store.plugin.getDataDir(this.pluginName),
      /**
       * 插件临时文件目录
       * @example
       * ```ts
       * console.log(config.dir.temp)
       * // -> /root/karin/.karin/karin-plugin-example/temp
       * ```
       */
      temp: store.plugin.getTempDir(this.pluginName),
    }
  }

  /**
   * 获取插件配置文件路径
   * @param filename 配置文件名称
   * @returns 配置文件路径
   * @example
   * ```ts
   * const pluginConfig = new PluginConfig('karin-plugin-example')
   * const configPath = pluginConfig.getConfigPath('config.json')
   * console.log(configPath)
   * // -> /root/karin/.karin/karin-plugin-example/config/config.json
   * ```
   */
  getConfigPath (filename: string) {
    return path.join(this.dir.config, filename).replaceAll('\\', '/')
  }

  /**
   * 获取指定配置文件内容
   * @param filename 配置文件名称
   * @description 底层使用 requireFile 方法加载文件 默认缓存300秒
   * @returns 配置文件内容
   */
  getConfig<K extends keyof T> (filename: K, options?: RequireOptions): Promise<T[K]> {
    const filePath = this.getConfigPath(filename as string)
    return requireFile(filePath, options)
  }

  /**
   * 获取指定配置文件内容
   * @param filename 配置文件名称
   * @description 底层使用 requireFileSync 方法加载文件 默认缓存300秒
   * @returns 配置文件内容
   */
  getConfigSync<K extends keyof T> (filename: K, options?: RequireOptions): T[K] {
    const filePath = this.getConfigPath(filename as string)
    return requireFileSync(filePath, options)
  }

  /**
   * 写入配置文件
   * @param filename 配置文件名称
   * @param data 配置文件内容
   */
  setConfig<K extends keyof T> (
    filename: K,
    data: T[K]
  ) {
    const filePath = this.getConfigPath(filename as string)
    writeFileSync(filePath, data)
  }

  /**
   * 复制指定文件夹的配置文件到插件配置目录
   * @param sourceDir 源文件夹路径
   * @param suffixs 需要复制的文件后缀 可带点
   * @param isThrow 是否抛出异常 默认不抛出
   * @returns 是否复制成功
   * @example
   * ```ts
   * const pluginConfig = new PluginConfig('karin-plugin-example')
   * pluginConfig.copySourceConfigDir('defaultPath', ['.yaml', '.json'], true)
   * ```
   */
  copySourceConfigDir (sourceDir: string, suffixs: string[] = [], isThrow = false): boolean {
    return copyConfigSync(sourceDir, this.dir.config, suffixs, isThrow)
  }

  /**
   * 通过源数据初始化配置文件
   * @param filename 配置文件名称
   * @param data 源数据
   * @param options 写入选项，可提供自定义的stringify方法
   * @description 支持自动识别yaml与json格式 已经存在的文件内容不会被覆盖
   */
  createConfig<K extends keyof T> (
    filename: K,
    data: T[K]
  ): void
  createConfig<K extends keyof T> (
    filename: K,
    data: T[K],
    options: WriteFileOptionsSync<T[K]>
  ): void
  createConfig<K extends keyof T> (
    filename: K,
    data: T[K],
    options: WriteFileOptions<T[K]>
  ): Promise<void>
  createConfig<K extends keyof T> (
    filename: K,
    data: T[K],
    options?: WriteFileOptionsSync<T[K]> | WriteFileOptions<T[K]>
  ): void | Promise<void> {
    const filePath = this.getConfigPath(filename as string)
    if (fs.existsSync(filePath)) return
    if (options?.stringify) {
      const content = options.stringify(data)
      if (!util.types.isPromise(content)) {
        return writeFileSync(filePath, data, options as WriteFileOptionsSync<T[K]>)
      }
      return writeFile(filePath, data, options as WriteFileOptions<T[K]>)
    }

    writeFileSync(filePath, data)
  }
}
