import fs from 'node:fs'
import lodash from 'lodash'
import path from 'node:path'
import util from 'node:util'
import schedule from 'node-schedule'

import { isTs } from '@/env'
import { cache } from '../system/cache'
import { formatPath } from '@/utils'
import { createLogger } from '../tools'
import { isClass } from '@/utils/system/class'
import { createPluginDir } from '@/utils/fs/file'
import { importModule } from '@/utils/system/import'
import { errorHandler } from '@/core/internal'
import { getPluginsInfo } from '../system/list'

import type {
  Task,
  Accept,
  Button,
  Command,
  Handler,
  PkgInfo,
  PluginFile,
  PluginFncTypes,
  LoadPluginResult,
  AllPluginMethods,
  KarinPluginAppsType,
} from '@/types/plugin'
import type { Plugin as ClassPluginType } from '../class'

/** 插件ID */
let seq = 0

/**
 * 加载插件包
 * @param pkg 插件包
 * @param allPromises 所有Promise
 * @param entryPromises 入口文件Promise
 *
 * @description 此处所有的加载都是异步的 所以需要传入Promise数组
 */
export const pkgLoads = async (
  pkg: PkgInfo,
  allPromises: Promise<void>[],
  entryPromises: Promise<void>[]
) => {
  pkg.id = ++seq
  cache.index[pkg.id] = pkg

  const files: string[] = []
  if (pkg.type === 'app') {
    files.push('config', 'data', 'resources')
  } else if (Array.isArray(pkg.pkgData.karin?.files)) {
    files.push(...pkg.pkgData.karin.files)
  }

  /** 创建插件基本文件夹 - 这个需要立即执行 */
  await createPluginDir(pkg.name, files)
  debug('debug: createPluginDir', pkg.name, files)

  /** 收集所有app加载的Promise */
  pkg.apps.forEach(app => {
    const promise = async () => {
      const result = await pkgLoadModule(pkg.name, app)
      pkgCache(result, pkg, app)
    }
    allPromises.push(promise())
  })

  /** 收集入口文件加载的Promise */
  if (pkg.type !== 'app') {
    if (pkg.type === 'npm' || !isTs()) {
      loadMainFile(entryPromises, pkg, pkg.pkgData?.main)
    } else {
      loadMainFile(entryPromises, pkg, pkg.pkgData?.karin?.main)
    }
  }

  /** 静态资源目录处理 */
  if (pkg.type !== 'app' && pkg?.pkgData?.karin?.static) {
    const list = Array.isArray(pkg.pkgData.karin.static)
      ? pkg.pkgData.karin.static
      : [pkg.pkgData.karin.static]
    cache.static.push(...list.map(file => path.resolve(pkg.dir, file)))
  } else {
    /** 如果没有配置 默认使用 resource、resources 目录 */
    cache.static.push(path.resolve(pkg.dir, 'resource'))
    cache.static.push(path.resolve(pkg.dir, 'resources'))
  }
}

/**
 * 加载入口文件
 * @param entryPromises 入口文件Promise
 * @param pkg 插件包
 * @param dir 入口文件路径
 */
const loadMainFile = async (entryPromises: Promise<void>[], pkg: PkgInfo, dir?: string) => {
  if (!dir) return
  const file = path.join(pkg.dir, dir)
  if (fs.existsSync(file)) {
    entryPromises.push(pkgLoadModule(pkg.name, file))
  }
}

/**
 * 加载模块 ts、js
 * @param name 插件名称
 * @param file 文件路径
 * @param isRefresh 是否刷新
 */
export const pkgLoadModule = async (name: string, file: string, isRefresh = false) => {
  const { status, data } = await importModule(file, isRefresh)
  if (status) return data

  logger.debug(new Error(`加载模块失败: ${name} ${file}`, { cause: data }))
  errorHandler.loaderPlugin(name, file, data)
  return {}
}

/**
 * 判断是否为指定类型
 * @param val 插件方法
 * @param type 插件类型
 */
const isType = <T extends AllPluginMethods> (val: any, type: T['file']['type']): val is T => {
  return val.file?.type === type
}

/**
 * 缓存插件
 * @param result 插件导入结果
 * @param info 插件信息
 */
export const pkgCache = (result: LoadPluginResult, pkg: PkgInfo, app: string) => {
  const cacheHandler = (val: AllPluginMethods, key: string) => {
    if (typeof val !== 'object') return
    if (!val?.pkg || !val.file) return

    val.pkg = pkg
    val.file = createFile(app, val.file.type, key, val.file.name)

    if (isType<Accept>(val, 'accept')) {
      cache.count.accept++
      cache.accept.push(val as Accept)
      return
    }

    if (isType<Command>(val, 'command')) {
      cache.count.command++
      cache.command.push(val as Command)
      return
    }

    if (isType<Button>(val, 'button')) {
      cache.count.button++
      cache.button.push(val as Button)
      return
    }

    if (isType<Handler>(val, 'handler')) {
      if (!cache.handler[val.key]) {
        cache.count.handler.key++
        cache.handler[val.key] = []
      }
      cache.count.handler.fnc++
      cache.handler[val.key].push(val)
      return
    }

    if (isType<Task>(val, 'task')) {
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
      cache.task.push(val)
    }
  }

  for (const key of Object.keys(result)) {
    if (key === 'default') continue

    if (typeof result[key] === 'function') {
      if (!isClass(result[key])) continue
      // TODO: 可以使用 instanceof 判断是否为插件类
      // if (result[key].prototype instanceof Plugin) {
      // }
      cacheClassPlugin(result[key], pkg, app, key)
      continue
    }

    const data = result[key]
    /** 支持导出数组 */
    for (const val of (Array.isArray(data) ? data : [data])) {
      cacheHandler(val, key)
    }
  }
}

/**
 * 处理导入的模块
 * @param app app文件绝对路径
 * @param type 插件类型
 * @param method 插件方法名称
 */
const createFile = <T extends PluginFncTypes> (
  app: string,
  type: T,
  method: string,
  name: string
): PluginFile<T> => {
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
 * 缓存类命令插件
 * @param result 插件导入结果
 * @param info 插件信息
 * @param pkg 插件包信息
 * @param app app文件绝对路径
 * @param key 插件方法名称
 */
const cacheClassPlugin = (
  Method: Function,
  pkg: PkgInfo,
  app: string,
  _: string
) => {
  const command = new (Method as new () => ClassPluginType)()
  if (!command.name) {
    logger.error(`[load][${app}] plugin.name 不能为空`)
    return
  }

  if (!command.rule || !Array.isArray(command.rule) || command.rule?.length === 0) {
    logger.error(`[load][${app}] ${command.name} plugin.rule 不能为空`)
    return
  }

  command.rule.forEach((v) => {
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
      Cls: Method as new () => ClassPluginType,
      reg: v.reg instanceof RegExp ? v.reg : new RegExp(v.reg),
      permission: v.permission || 'all',
      event: v.event || command.event || 'message',
      priority: v.priority || 10000,
      file: createFile(app, 'command', v.fnc, command.name),
      authFailMsg: v.authFailMsg || true,
    })
  })
}

/**
 * 根据文件路径查找对应的插件包
 */
export const findPkgByFile = (file: string): PkgInfo | null => {
  file = formatPath(file)
  return Object.values(cache.index).find(pkg =>
    pkg.apps.includes(file) ||
    pkg.allApps.some(dir => file.startsWith(dir)) ||
    /**
     * 第三种情况
     * - 例如karin-plugin-example文件夹为空 则需要判断pkg是否为app类型
     * - 并且文件是否处于karin-plugin-example文件夹下
     */
    (pkg.type === 'app' && path.normalize(file).startsWith(path.normalize(pkg.dir)))
  ) || null
}

/**
 * 排序插件
 * @description 按照插件的优先度从小到大进行排序插件
 */
export const pkgSort = () => {
  cache.accept = lodash.sortBy(cache.accept, ['rank'], ['asc'])
  cache.command = lodash.sortBy(cache.command, ['rank'], ['asc'])
  cache.task = lodash.sortBy(cache.task, ['rank'], ['asc'])
  cache.button = lodash.sortBy(cache.button, ['rank'], ['asc'])
  for (const key of Object.keys(cache.handler)) {
    cache.handler[key] = lodash.sortBy(cache.handler[key], ['rank'], ['asc'])
  }
}

/**
 * 热加载一个插件包
 * @version 1.8.0
 * @param type 插件类型
 * @param name 插件名称
 */
export const pkgHotReload = async (
  type: KarinPluginAppsType,
  name: string
) => {
  /** 收集所有插件加载的Promise */
  const allPromises: Promise<void>[] = []
  /** 收集入口文件加载的Promise */
  const entryPromises: Promise<void>[] = []

  const pkg = await getPluginsInfo([`${type}:${name}`], true, true)
  if (pkg.length === 0) {
    throw new Error(`[load][${type}:${name}] 插件不存在`)
  }

  await pkgLoads(pkg[0], allPromises, entryPromises)
  await Promise.allSettled([...allPromises, ...entryPromises])
  /** 回收缓存 */
  allPromises.length = 0
  entryPromises.length = 0
  /** 排序 */
  pkgSort()
}
