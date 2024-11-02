import { Middleware } from './../cache/types'
import lodash from 'lodash'
import util from 'node:util'
import schedule from 'node-schedule'
import { gitAllPlugin } from '../list/all'
import { handleError } from '@/internal/error'
import { isClass } from '@/utils/system/class'
import { cache, createLogger } from '../cache/cache'
import type { Plugin } from '../class'
import type {
  Accept,
  CommandClass,
  CommandFnc,
  Task,
  Button,
  Handler,
} from '../cache/types'
import type { PluginInfo } from '../list/types'
import path from 'node:path'
import { exists } from '@/utils/fs/exists'
import { basePath } from '@/utils/fs/root'

type List = { index: number, plugin: PluginInfo }[]
type FncType = Accept
  | CommandClass
  | CommandFnc
  | Task
  | Button
  | Handler
  | Middleware
type Fnc = Record<string, FncType | FncType[]>

let index = 0
const load: {
  main: (() => Promise<void>)[]
  pkg: (Promise<void>)[]
  apps: (Promise<void>)[]
} = {
  main: [],
  pkg: [],
  apps: [],
}

/**
 * 初始化插件
 */
export const loaderPlugin = async () => {
  logger.info(logger.green('-----------'))
  logger.info('加载插件中...')

  const list: List = []
  const all = await gitAllPlugin()
  all.forEach(info => {
    const index = createIndex(info)
    list.push({ index, plugin: info })
  })

  await Promise.all([loaderMain(list), loaderPkg(list)])
  await Promise.all(load.pkg)
  await Promise.all(load.apps)
  clearCache()
  sort()
}

/**
 * 创建插件索引
 * @param name 插件包名
 * @param type 插件类型
 * @param dir 插件根目录绝对路径
 */
export const createIndex = (info: PluginInfo) => {
  const id = ++index
  cache.index[id] = {
    dir: info.path,
    name: info.name,
    pkgPath: path.join(info.path, 'package.json'),
    type: info.type,
  }
  return id
}

/** 清理收集的缓存 */
export const clearCache = () => {
  load.main.length = 0
  load.pkg.length = 0
  load.apps.length = 0
}

/**
 * 加载入口文件
 * @param list 插件列表详细信息
 * @param isRefresh 是否刷新
 */
const loaderMain = async (list: List, isRefresh = false) => {
  list.forEach(({ plugin }) => {
    load.main.push(async () => {
      try {
        await import(`file://${plugin.main}${isRefresh ? `?t=${Date.now()}` : ''}`)
      } catch (error) {
        handleError('loaderPlugin', { name: plugin.name, error, file: plugin.main })
      }
    })
  })
}

/**
 * 加载插件包
 * @param list 插件列表详细信息
 * @param isRefresh 是否刷新
 */
const loaderPkg = async (list: List, isRefresh = false) => {
  for (const info of list) {
    createPluginDir(info.plugin)
    for (const file of info.plugin.apps) {
      load.pkg.push(importPlugin(file, info, isRefresh))
    }
  }
}

/**
 * 导入插件
 * @param path 插件路径
 */
export const importPlugin = async (file: string, info: List[number], isRefresh = false) => {
  const dirname = path.dirname(file)
  const basename = path.basename(file)
  try {
    /** 导入文件 */
    const data: Fnc = await import(`file://${dirname}/${basename}${isRefresh ? `?t=${Date.now()}` : ''}`)
    for (const key in data) {
      load.apps.push(loaderApp(info, dirname, basename, key, data[key]))
    }
  } catch (error) {
    handleError('loaderPlugin', { name: info.plugin.name, error, file: `${dirname}/${basename}` })
  }
}

/**
 * 加载每个插件
 * @param info 插件信息
 * @param dirname app目录：`/root/karin/plugins/karin-plugin-example`
 * @param basename app文件名：`index.ts` `index.js`
 * @param key 插件方法名称
 * @param val 插件方法
 */
const loaderApp = async (info: List[number], dirname: string, basename: string, key: string, val: FncType | FncType[]) => {
  logger.debug(`加载插件：[index:${info.index}][${info.plugin.name}][${basename}][${key}]`)
  if (typeof val === 'function') {
    if (!isClass(val)) return
    const Cls = val as new () => Plugin
    const app = new Cls()
    /** 非插件 */
    if (!app?.rule) return

    for (const v of app.rule) {
      /** 没有对应方法跳过 */
      if (!(v.fnc in app)) continue
      /** 没有正则跳过 */
      if (typeof v.reg !== 'string' && !(v.reg instanceof RegExp)) continue

      cache.command.push({
        type: 'class',
        index: info.index,
        log: createLogger(v.log, false),
        name: app.name,
        adapter: v.adapter || [],
        dsbAdapter: v.dsbAdapter || [],
        Cls,
        reg: v.reg instanceof RegExp ? v.reg : new RegExp(v.reg),
        perm: v.permission || 'all',
        event: v.event || app.event || 'message',
        rank: v.priority || 10000,
        get info () {
          return cache.index[this.index]
        },
        file: {
          basename,
          dirname,
          method: key,
          type: 'command',
          get path () {
            return path.join(this.dirname, this.basename)
          },
        },
      })
    }
    return
  }

  if (typeof val !== 'object') return

  const list: FncType[] = Array.isArray(val) ? val : [val]
  list.forEach(fnc => {
    if (!fnc?.file?.type) return
    fnc.index = info.index
    fnc.file.dirname = dirname
    fnc.file.basename = basename
    fnc.file.method = key
    switch (fnc.file.type) {
      case 'accept':
        cache.count.accept++
        return cache.accept.push(fnc as Accept)
      case 'command':
        cache.count.command++
        return cache.command.push(fnc as CommandFnc)
      case 'button':
        cache.count.button++
        return cache.button.push(fnc as Button)
      case 'handler': {
        const fn = fnc as Handler
        if (!cache.handler[fn.key]) {
          cache.count.handler.key++
          cache.handler[fn.key] = []
        }
        cache.count.handler.fnc++
        cache.handler[fn.key].push(fn)
        return
      }
      case 'middleware':
        cache.count.middleware++
        return cache.middleware[(fnc as Middleware).type].push(fnc as any)
      case 'task': {
        const fn = fnc as Task
        fn.schedule = schedule.scheduleJob(fn.cron, async () => {
          try {
            fn.log(`[定时任务][${fnc.name}][${fn.name}]: 开始执行`)
            const result = fn.fnc()
            if (util.types.isPromise(result)) await result
            fn.log(`[定时任务][${fn.name}][${fn.name}]: 执行完成`)
          } catch (error) {
            handleError('taskStart', { name: fnc.name, task: fn.name, error })
          }
        })
        cache.count.task++
        return cache.task.push(fn)
      }
      default:
    }
  })
}

/** 排序 */
export const sort = () => {
  cache.accept = lodash.sortBy(cache.accept, ['rank'], ['asc'])
  cache.command = lodash.sortBy(cache.command, ['rank'], ['asc'])
  cache.task = lodash.sortBy(cache.task, ['rank'], ['asc'])
  cache.button = lodash.sortBy(cache.button, ['rank'], ['asc'])
  cache.middleware.recvMsg = lodash.sortBy(cache.middleware.recvMsg, ['rank'], ['asc'])
  cache.middleware.replyMsg = lodash.sortBy(cache.middleware.replyMsg, ['rank'], ['asc'])
  cache.middleware.sendMsg = lodash.sortBy(cache.middleware.sendMsg, ['rank'], ['asc'])
  cache.middleware.forwardMsg = lodash.sortBy(cache.middleware.forwardMsg, ['rank'], ['asc'])
  cache.middleware.notFoundMsg = lodash.sortBy(cache.middleware.notFoundMsg, ['rank'], ['asc'])
  for (const key of Object.keys(cache.handler)) {
    cache.handler[key] = lodash.sortBy(cache.handler[key], ['rank'], ['asc'])
  }
}

/**
 * 为插件创建基本的数据文件夹
 * @param info 插件的paclage.json文件对象
 */
export const createPluginDir = (info: PluginInfo) => {
  /** 不管任何情况下 都创建插件包名的根文件夹 */
  exists(path.join(basePath, info.name))
  const list: string[] = []
  /** 如果没有这个配置，则默认创建基本目录 */
  if (!info?.pkg?.karin?.files) {
    list.push('config', 'data', 'resource')
  } else if (Array.isArray(info?.pkg?.karin?.files)) {
    list.push(...info.pkg.karin.files)
  }

  list.forEach(dir => {
    exists(path.join(basePath, info.name, dir))
  })
}
