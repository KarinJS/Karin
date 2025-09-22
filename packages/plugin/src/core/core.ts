import path from 'node:path'
import { PluginCoreSync } from './sync'
import { errorHandler } from '../utils/error'
import { getPluginLoader } from '../manager/load'
import { formatPath, isPathEqual, isSubPath, requireFileSync } from '@karinjs/utils'

import type { PackageEnv } from './types'
import type { PluginCacheKeyFile } from '../builders/base'

/**
 * 插件管理器类
 */
export class PluginCore extends PluginCoreSync {
  /**
   * @public
   * 获取文件缓存
   * @param dir 文件目录
   * @returns 文件缓存
   */
  getFileCache (dir: string): PluginCacheKeyFile {
    return {
      get absPath () {
        return formatPath(dir)
      },
      get dirname () {
        return formatPath(path.dirname(dir))
      },
      get basename () {
        return formatPath(path.basename(dir))
      },
    }
  }

  /**
   * @public
   * 传入一个路径 返回包名
   * @param appPath 文件路径
   * @returns 包名
   */
  getPackageName (appPath: string): string | null {
    appPath = formatPath(appPath)
    /** npm */
    if (appPath.includes('node_modules')) {
      // /root/node_modules/.pnpm/@karinjs+plugin-basic@1.1.0/node_modules/@karinjs/plugin-basic/dist/apps/exit.js
      const idx = appPath.lastIndexOf('node_modules/')
      if (idx === -1) return null

      const suffix = appPath.slice(idx + 13)
      const parts = suffix.split('/').filter(Boolean)
      if (parts.length === 0) return null

      if (parts[0].startsWith('@')) {
        return `${parts[0]}/${parts[1]}`
      } else {
        return parts[0]
      }
    }

    /** git、apps */
    if (isSubPath(this.dir, appPath)) {
      return appPath.split(this.dir)[1].split('/')[1]
    }

    /** root */
    if (isPathEqual(appPath, process.cwd())) {
      return requireFileSync(path.join(appPath, 'package.json'), { ex: 0 }).name
    }

    return null
  }

  createAddEnv (list?: PackageEnv[]): (
    /** 插件名称 */
    name: string,
    /** 环境变量 */
    data: PackageEnv[]
  ) => void {
    if (!list) {
      return () => { }
    }

    return (name: string, data: PackageEnv[]) => {
      if (!Array.isArray(data)) {
        logger.error(`[addEnv] 插件${name}的env字段不符合规范 已跳过写入`)
        return
      }

      data.forEach(val => {
        const { key, value, comment = '' } = val
        if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
          logger.warn(
            `[addEnv] 插件${name}的env不符合规范 已跳过\n` +
            `key: ${key}\n` +
            `value: ${value}\n` +
            `comment: ${comment}`
          )
          return
        }

        list.push({
          key,
          value,
          comment: typeof comment !== 'string' ? String(comment) : comment,
        })
      })
    }
  }

  async load () {
    logger.info(logger.green('-----------'))
    logger.info('加载插件中...')

    await getPluginLoader().run()

    logger.info('插件加载完成')
    /** 打印加载错误的插件 */
    errorHandler.printMissing()
  }
}

/**
 * @public
 * 插件核心实例
 * @description 该实例用于提供插件相关的核心功能
 */
export const core = new PluginCore()
export default core
