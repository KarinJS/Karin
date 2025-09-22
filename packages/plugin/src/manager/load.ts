import path from 'node:path'
import { cache, core } from '../core'
import { loadClass } from '../builders'
import { hmrProduction } from './simple'
import { errorHandler } from '../utils/error'
import { register } from './register'
import { DEFAULT_CREATE_FILES, canUseNodeInternals } from '@karinjs/envs'
import { createPluginDir, imports, satisfies } from '@karinjs/utils'

import type { PluginCacheKeyPkg } from '../builders'

/**
 * @class
 * 加载插件
 */
class PluginLoader {
  #isInit = false

  async run () {
    if (this.#isInit) {
      throw new Error('PluginLoader has already been initialized')
    }

    const map = await core.promise.getPluginsMap()
    const list = Array.from(map.values())
    await Promise.allSettled(list.map(plugin => this.loadPackage(plugin)))

    /** 当前插件数量 */
    let lastLength = cache.command.length
    /** 稳定计数 */
    let stableCount = 0
    /** 检查计数 */
    let checkCount = 0

    /** 检查间隔 加载完成后排序 */
    const timer = setInterval(() => {
      checkCount++

      if (cache.command.length === lastLength) {
        stableCount++
      } else {
        stableCount = 0
      }

      lastLength = cache.command.length

      if (stableCount >= 3 || checkCount >= 30) {
        clearInterval(timer)
        register.sort()
      }
    }, 200)

    this.#isInit = true

    const pluginsCount =
      cache.plugins.apps.length +
      cache.plugins.git.length +
      cache.plugins.npm.length +
      cache.plugins.root.length

    logger.info(`${logger.chalk.magentaBright('plugin')}: ${pluginsCount}`)
    Object.keys(cache.count).forEach((v) => {
      if (v === 'handler') {
        const { key, fnc } = cache.count.handler
        logger.info(`${logger.chalk.magentaBright(v + '.key')} ${key}`)
        logger.info(`${logger.chalk.magentaBright(v + '.fnc')} ${fnc}`)
        return
      }
      logger.info(`${logger.chalk.magentaBright(v)}: ${cache.count[v as keyof typeof cache.count]}`)
    })

    logger.info(logger.green('-----------'))

    if (canUseNodeInternals()) return
    setTimeout(() => {
      const target: string[] = []
      list.forEach(plugin => {
        if (plugin.type !== 'apps') return
        target.push(...plugin.appsDirs)
      })

      hmrProduction(target)
    }, 2000)
  }

  /**
   * 加载插件包
   * @param plugin 插件包
   * @param isRefresh 是否强制刷新
   */
  async loadPackage (plugin: PluginCacheKeyPkg, isRefresh = false) {
    try {
      const pkg = plugin.data
      /** 检查版本号是否符合加载要求 */
      if (!this.checkVersion(pkg)) return
      /** 写入环境变量 */
      this.collectEnv(pkg.data)

      /** 加载入口文件 */
      if (pkg.data) {
        const main = plugin.getMain
        if (main) await this.loadMain(plugin.name, main, isRefresh)
      }

      /** 加载每个app */
      await Promise.allSettled(plugin.apps.map(async (file) => {
        try {
          const result = await imports(file, { eager: isRefresh })
          /** tips: class类型的插件还是需要进行导出加载... */
          return loadClass(plugin.name, file, result)
        } catch (error) {
          logger.debug(new Error(`加载模块失败: ${plugin.name} ${file}`, { cause: error }))
          errorHandler.loaderPlugin(plugin.name, file, error)
        }
      }))

      /** 收集插件的静态资源目录 */
      this.getStaticDir(plugin)

      /** 计数器+1 */
      cache.count.pkg++
    } catch (error) {
      errorHandler.loaderPlugin(plugin.name, '未知', error)
    }
  }

  /**
   * 创建插件目录
   * @param pkg 插件包数据
   */
  async createPluginDir (pkg: PluginCacheKeyPkg['data']) {
    const files: string[] = []
    if (!Array.isArray(pkg?.karin?.files)) {
      files.push(...DEFAULT_CREATE_FILES)
    } else {
      files.push(...pkg.karin.files)
    }

    await createPluginDir(pkg.name, files)
  }

  /**
   * 检查插件版本
   * @param pkg 插件包数据
   */
  checkVersion (pkg: PluginCacheKeyPkg['data']) {
    if (!pkg) return true
    if (!pkg.karin) return true

    /** 检查版本兼容性 */
    const engines = pkg.karin?.engines?.karin || pkg.engines?.karin
    if (!engines) return true

    if (satisfies(engines, process.env.KARIN_VERSION)) return true
    logger.error(`[getPlugins][npm] ${pkg.name} 要求 node-karin 版本为 ${engines}，当前不符合要求，跳过加载插件`)
    return false
  }

  /**
   * 收集环境变量
   * @param pkg 插件包数据
   */
  collectEnv (pkg: PluginCacheKeyPkg['data']) {
    if (!pkg) return
    if (!pkg.karin || !Array.isArray(pkg.karin.env)) return

    core.createAddEnv(pkg.karin.env)
  }

  /**
   * 加载入口文件
   * @param name 插件名称
   * @param file 入口文件路径
   * @param eager 重新加载，不使用缓存
   */
  async loadMain (name: string, file: string, eager: boolean = false) {
    try {
      const result = await imports<() => Promise<void> | undefined>(file, {
        import: 'KARIN_PLUGIN_INIT',
        eager,
      })

      if (!result || typeof result !== 'function') return
      await result()
      logger.debug(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数成功`)
    } catch (error) {
      errorHandler.loaderPlugin(name, file, error)
      logger.error(new Error(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数失败`, { cause: error }))
    }
  }

  /**
   * 获取静态资源目录
   * @param pkg 插件包数据
   */
  getStaticDir (pkg: PluginCacheKeyPkg) {
    if (!pkg.data || !pkg.data.karin) return
    if (!pkg.data.karin?.static) {
      cache.static.push(path.resolve(pkg.dir, 'resource'))
      cache.static.push(path.resolve(pkg.dir, 'resources'))
      return
    }

    /** 静态资源目录处理 */
    if (typeof pkg.data.karin?.static === 'string') {
      return cache.static.push(path.resolve(pkg.dir, pkg.data.karin.static))
    }

    if (Array.isArray(pkg.data.karin?.static)) {
      return cache.static.push(...pkg.data.karin.static?.map(file => path.resolve(pkg.dir, file)))
    }
  }
}

/**
 * 单例
 */
export const getPluginLoader = (() => {
  let instance: PluginLoader
  return () => {
    if (!instance) {
      instance = new PluginLoader()
    }
    return instance
  }
})()
