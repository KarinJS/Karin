import fs from 'node:fs'
import lodash from 'lodash'
import path from 'node:path'
import util from 'node:util'
import schedule from 'node-schedule'
import { errorHandler } from '@/core/internal/error'

import { getPlugins } from './list'
import { cache } from './cache'
import { isClass } from '@/utils/system/class'
import { createLogger } from './tools'
import { isTsx } from '@/env'
import { createPluginDir } from '@/utils/fs/file'
import { listeners } from '@/core/internal'
import { WatcherPlugin } from './watcher'
import type { Plugin } from './class'
import type {
  Accept,
  AllPluginMethods,
  Button,
  Command,
  Handler,
  PkgInfo,
  PluginFile,
  PluginFncTypes,
  Task,
} from '@/types/plugin'

let seq = 0

type Result = Record<string,
  AllPluginMethods | AllPluginMethods[]>

/**
 * 插件加载
 * @description 插件加载
 * @class LoaderPlugin
 */
export class LoaderPlugin {
  private watcher: WatcherPlugin

  constructor () {
    this.watcher = new WatcherPlugin(this)
  }

  /**
   * @description 初始化插件
   */
  public async init () {
    debug('debug: init loader')

    logger.info(logger.green('-----------'))
    logger.info('加载插件中...')

    /** 收集所有插件加载的Promise */
    const allPromises: Promise<any>[] = []
    /** 收集入口文件加载的Promise */
    const entryPromises: Promise<any>[] = []

    /** 并发加载所有插件 */
    const list = await getPlugins('all', true, false, true)
    debug('debug: getPlugins', list)

    await Promise.all(list.map(async (pkg) => {
      pkg.id = ++seq
      cache.index[pkg.id] = pkg

      const files: string[] = []
      if (pkg.type === 'app') {
        files.push('config', 'data', 'resources')
      } else if (Array.isArray(pkg.pkgData.karin?.files)) {
        files.push(...pkg.pkgData.karin.files)
      }

      /** 创建插件基本文件夹 - 这个需要立即执行 */
      await createPluginDir(pkg.name.replace(/\//g, '-'), files)
      debug('debug: createPluginDir', pkg.name, files)

      /** 收集所有app加载的Promise */
      pkg.apps.forEach(app => {
        const promise = async () => {
          const result = await this.importApp(pkg.name, app)
          this.cachePlugin(result, pkg, app)
        }
        allPromises.push(promise())
      })

      /** 收集入口文件加载的Promise */
      if (pkg.type !== 'app') {
        if (isTsx() && pkg?.pkgData?.karin?.main) {
          const file = path.join(pkg.dir, pkg.pkgData.karin.main)
          if (fs.existsSync(file)) {
            entryPromises.push(this.loaderMain(pkg.name, file))
          }
        }

        if (!isTsx() && pkg?.pkgData?.main) {
          const file = path.join(pkg.dir, pkg.pkgData.main)
          if (fs.existsSync(file)) {
            entryPromises.push(this.loaderMain(pkg.name, file))
          }
        }
      }

      /** 静态资源目录处理 */
      if (pkg.type !== 'app' && pkg?.pkgData?.karin?.static) {
        const list = Array.isArray(pkg.pkgData.karin.static)
          ? pkg.pkgData.karin.static
          : [pkg.pkgData.karin.static]
        cache.static.push(...list.map(file => path.resolve(pkg.dir, file)))
      } else {
        /** 如果没有配置 默认使用 resource 目录 */
        cache.static.push(path.resolve(pkg.dir, 'resource'))
      }
    }))

    /** 等待所有Promise完成 */
    await Promise.all([...allPromises, ...entryPromises])

    allPromises.length = 0
    entryPromises.length = 0

    debug('debug: cache', cache)
    this.sort()
    errorHandler.printMissing()
    logger.info('插件加载完成')

    const color = (text: string) => logger.chalk.magentaBright(text)
    logger.info(`${color('plugin')}: ${Object.keys(cache.index).length}`)
    Object.keys(cache.count).forEach((v) => {
      if (v === 'handler') {
        const { key, fnc } = cache.count.handler
        logger.info(`${color(v + '.key')} ${key}`)
        logger.info(`${color(v + '.fnc')} ${fnc}`)
        return
      }
      logger.info(`${color(v)}: ${cache.count[v as keyof typeof cache.count]}`)
    })

    logger.info(logger.green('-----------'))
    logger.mark(`karin 启动完成: 耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
    debug('debug: 插件加载完成')
    listeners.emit('online', {})

    // 初始化热更新
    this.watcher.init()
  }

  /**
   * @description 热更新收集
   */

  /**
   * 处理导入的模块
   * @param app app文件绝对路径
   * @param type 插件类型
   * @param method 插件方法名称
   */
  private createFile<T extends PluginFncTypes> (
    app: string,
    type: T,
    method: string,
    name: string
  ): PluginFile<T> {
    return {
      absPath: app,
      get dirname () {
        return path.dirname(this.absPath)
      },
      get basename () {
        return path.basename(this.absPath)
      },
      type,
      method,
      name: name || type,
    }
  }

  /**
   * 导入插件
   * @param name 插件包名称 `karin-plugin-example`
   * @param app 插件文件绝对路径 `/root/karin/plugins/karin-plugin-example/index.js`
   * @param isRefresh 是否加载新模块
   */
  async importApp (name: string, app: string, isRefresh = false): Promise<Result> {
    try {
      const result = await import(`file://${app}${isRefresh ? `?t=${Date.now()}` : ''}`)
      return result
    } catch (error) {
      errorHandler.loaderPlugin(name, app, error)
      return {}
    }
  }

  /**
   * 加载入口文件
   * @param name 插件名称
   * @param file 入口文件
   * @param isRefresh 是否刷新
   */
  private async loaderMain (name: string, file: string, isRefresh = false) {
    try {
      await import(`file://${file}${isRefresh ? `?t=${Date.now()}` : ''}`)
    } catch (error) {
      errorHandler.loaderPlugin(name, file, error)
    }
  }

  /**
   * 判断是否为指定类型
   * @param val 插件方法
   * @param type 插件类型
   */
  private isType<T extends AllPluginMethods> (val: any, type: T['file']['type']): val is T {
    return val.file?.type === type
  }

  /**
   * 缓存插件
   * @param result 插件导入结果
   * @param info 插件信息
   */
  public cachePlugin (result: Result, pkg: PkgInfo, app: string) {
    for (const key of Object.keys(result)) {
      /** 跳过默认导出 */
      if (key === 'default') continue

      if (typeof result[key] === 'function') {
        if (!isClass(result[key])) continue
        // TODO: 可以使用 instanceof 判断是否为插件类
        // if (result[key].prototype instanceof Plugin) {
        // }
        this.cacheClassPlugin(result[key], pkg, app, key)
        continue
      }

      const data = result[key]
      for (const val of (Array.isArray(data) ? data : [data])) {
        if (typeof val !== 'object') continue
        if (!val?.pkg || !val.file) continue

        val.pkg = pkg
        val.file = this.createFile(app, val.file.type, key, val.file.name)

        if (this.isType<Accept>(val, 'accept')) {
          cache.count.accept++
          cache.accept.push(val as Accept)
          continue
        }

        if (this.isType<Command>(val, 'command')) {
          cache.count.command++
          cache.command.push(val as Command)
          continue
        }

        if (this.isType<Button>(val, 'button')) {
          cache.count.button++
          cache.button.push(val as Button)
          continue
        }

        if (this.isType<Handler>(val, 'handler')) {
          if (!cache.handler[val.key]) {
            cache.count.handler.key++
            cache.handler[val.key] = []
          }
          cache.count.handler.fnc++
          cache.handler[val.key].push(val)
          continue
        }

        if (this.isType<Task>(val, 'task')) {
          val.schedule = schedule.scheduleJob(val.cron, async () => {
            try {
              val.log(`[定时任务][${val.name}][${val.cron}]: 开始执行`)
              const result = val.fnc()
              if (util.types.isPromise(result)) await result
              val.log(`[定时任务][${val.name}][${val.cron}]: 执行完成`)
            } catch (error) {
              errorHandler.taskStart(val.name, val.name, error)
            }
          })

          cache.count.task++
          continue
        }
      }
    }
  }

  /**
   * 缓存类命令插件
   * @param result 插件导入结果
   * @param info 插件信息
   * @param pkg 插件包信息
   * @param app app文件绝对路径
   * @param key 插件方法名称
   */
  private cacheClassPlugin (
    Method: Function,
    pkg: PkgInfo,
    app: string,
    key: string
  ) {
    const command = new (Method as new () => Plugin)()
    if (!command.name) {
      logger.error(`[load][${app}] plugin.name 不能为空`)
      return
    }

    if (!command.rule || !Array.isArray(command.rule) || command.rule?.length === 0) {
      logger.error(`[load][${app}] ${command.name} plugin.rule 不能为空`)
      return
    }

    command.rule.forEach((v, i) => {
      /** 没有对应方法跳过 */
      if (!(v.fnc in command)) return
      /** 没有正则跳过 */
      if (typeof v.reg !== 'string' && !(v.reg instanceof RegExp)) return

      cache.command.push({
        pkg,
        type: 'class',
        log: createLogger(v.log, true),
        adapter: v.adapter || [],
        dsbAdapter: v.dsbAdapter || [],
        Cls: Method as new () => Plugin,
        reg: v.reg instanceof RegExp ? v.reg : new RegExp(v.reg),
        permission: v.permission || 'all',
        event: v.event || command.event || 'message',
        priority: v.priority || 10000,
        file: this.createFile(app, 'command', v.fnc, command.name),
        authFailMsg: v.authFailMsg || true,
      })
    })
  }

  /**
   * 排序
   */
  public sort () {
    cache.accept = lodash.sortBy(cache.accept, ['rank'], ['asc'])
    cache.command = lodash.sortBy(cache.command, ['rank'], ['asc'])
    cache.task = lodash.sortBy(cache.task, ['rank'], ['asc'])
    cache.button = lodash.sortBy(cache.button, ['rank'], ['asc'])
    for (const key of Object.keys(cache.handler)) {
      cache.handler[key] = lodash.sortBy(cache.handler[key], ['rank'], ['asc'])
    }
  }
}
