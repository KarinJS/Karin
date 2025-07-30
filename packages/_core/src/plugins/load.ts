import path from 'node:path'
import * as manager from './manager'
import { errorHandler } from '../core/internal'
import { createAddEnv } from '@/plugins/env'
import { loadClass } from '@/core/karin/class'
import { sort } from '@/plugins/register'
import { initPluginHmr } from '@/plugins/hmr'
import { createPluginDir, importModule, PkgData, satisfies } from '@/utils'
import { PluginCacheKeyPkg } from '@/core/karin/base'

/** 是否初始化 */
let isInit = false

/**
 * 初始化插件系统
 */
export const init = async () => {
  if (isInit) return
  await manager.getPluginDetails()
  const list = await manager.getPlugins()
  await Promise.all(list.map(async (v) => {
    const [, name] = v.split(':')
    await load(name)
  }))

  /** 当this.cache.command的lengt在500ms没变化 则认为加载完成 */
  await new Promise((resolve) => {
    let lastLength = manager.cache.command.length
    const timer = setInterval(() => {
      if (manager.cache.command.length === lastLength) {
        clearInterval(timer)
        resolve(true)
      }

      lastLength = manager.cache.command.length
    }, 500)
  })

  sort()
  isInit = true

  logger.info('插件加载完成')

  logger.info(`${logger.chalk.magentaBright('plugin')}: ${manager.cache.plugins.length}`)
  Object.keys(manager.cache.count).forEach((v) => {
    if (v === 'handler') {
      const { key, fnc } = manager.cache.count.handler
      logger.info(`${logger.chalk.magentaBright(v + '.key')} ${key}`)
      logger.info(`${logger.chalk.magentaBright(v + '.fnc')} ${fnc}`)
      return
    }
    logger.info(`${logger.chalk.magentaBright(v)}: ${manager.cache.count[v as keyof typeof manager.cache.count]}`)
  })

  logger.info(logger.green('-----------'))

  setTimeout(() => {
    initPluginHmr()
  }, 2000)
}

/**
 * 加载插件
 * @param pluginName 插件名称 不带前缀
 */
export const load = async (pluginName: string) => {
  const pkg = manager.getPluginPackageDetail(pluginName)
  const files = getFiles(pkg!.data!)

  /** 检查版本号是否符合加载要求 */
  if (!checkVersion(pkg!.data!)) return
  /** 写入环境变量 */
  collectEnv(pkg!.data!)

  /** 创建插件基本文件夹 - 这个需要立即执行 */
  await createPluginDir(pkg?.name || '', files)

  /** 加载入口文件 */
  if (pkg?.data) {
    const main = manager.getMain(pkg.data, pkg.dir)
    if (main) await loadMain(pluginName, main)
  }

  /** 加载全部app */
  pkg && await Promise.all(pkg.apps.map(async (file) => {
    const { status, data } = await importModule(file)
    if (status) {
      /** 加载class插件 */
      return loadClass(pluginName, file, data)
    }

    logger.debug(new Error(`加载模块失败: ${pluginName} ${file}`, { cause: data }))
    errorHandler.loaderPlugin(pluginName, file, data)
  }))

  /** 获取静态资源目录 */
  getStaticDir(pkg!)
  manager.cache.count.pkg++
}

/**
 * 获取插件文件列表
 * @param pkg 插件包
 * @returns 文件列表
 */
export const getFiles = (pkg: PkgData) => {
  const files: string[] = []
  if (!Array.isArray(pkg?.karin?.files)) {
    files.push('config', 'data', 'resources')
  } else {
    files.push(...pkg.karin.files)
  }

  return files
}

/**
 * 获取静态资源目录
 * @param pkg 插件包
 * @returns 静态资源目录
 */
const getStaticDir = (pkg: PluginCacheKeyPkg) => {
  if (!pkg.data || !pkg.data.karin) return
  if (!pkg.data.karin?.static) {
    manager.cache.static.push(path.resolve(pkg.dir, 'resource'))
    manager.cache.static.push(path.resolve(pkg.dir, 'resources'))
    return
  }

  /** 静态资源目录处理 */
  if (typeof pkg.data.karin?.static === 'string') {
    return manager.cache.static.push(path.resolve(pkg.dir, pkg.data.karin.static))
  }

  if (Array.isArray(pkg.data.karin?.static)) {
    return manager.cache.static.push(...pkg.data.karin.static?.map(file => path.resolve(pkg.dir, file)))
  }
}

/**
 * 加载入口文件
 * @param name 插件名称
 * @param file 入口文件路径
 */
const loadMain = async (name: string, file: string) => {
  const { status, data } = await importModule<{ KARIN_PLUGIN_INIT?: () => Promise<void> }>(file)
  if (!status) {
    errorHandler.loaderPlugin(name, file, data)
    return
  }

  if (!data || typeof data.KARIN_PLUGIN_INIT !== 'function') return

  try {
    await data.KARIN_PLUGIN_INIT()
    logger.debug(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数成功`)
  } catch (error) {
    logger.error(new Error(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数失败`, { cause: error }))
  }
}

/**
 * 检查版本号是否符合加载要求
 * @param pkg 插件包
 * @returns 是否符合加载要求
 */
export const checkVersion = (pkg: PkgData) => {
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
 * @param pkg 插件包
 */
const collectEnv = (pkg: PkgData) => {
  if (!pkg) return
  if (!pkg.karin || !Array.isArray(pkg.karin.env)) return

  createAddEnv(pkg.karin.env)
}
