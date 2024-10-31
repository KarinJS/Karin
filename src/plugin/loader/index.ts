import lodash from 'lodash'
import util from 'node:util'
import schedule from 'node-schedule'
import { gitAllPlugin } from '../list/all'
import { handleError } from '@/internal/error'
import { isClass } from '@/utils/system/class'
import { cache, createCommandClassCache as createCommandClass } from '../cache/cache'
import type { Plugin } from '../class'
import type {
  Accept,
  CommandClass,
  CommandFnc,
  Task,
  Button,
  Handler,
  RecvMsg,
  ReplyMsg,
  SendMsg,
  ForwardMsg,
  NotFoundMsg,
} from '../cache/types'
import type { PluginInfo, PluginsType } from '../list/types'

type List = { index: number, plugin: PluginInfo }[]
type FncType = Accept
  | CommandClass
  | CommandFnc
  | Task
  | Button
  | Handler
  | RecvMsg
  | ReplyMsg
  | SendMsg
  | ForwardMsg
  | NotFoundMsg
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
  all.forEach(plugin => {
    const index = createIndex(plugin.name, plugin.type, plugin.path)
    list.push({ index, plugin })
  })

  await Promise.all([loaderMain(list), loaderPkg(list)])
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
export const createIndex = (name: string, type: PluginsType, dir: string) => {
  const id = ++index
  cache.index[id] = { name, type, dir }
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
  const createPkg = async (index: number, name: string, file: string) => {
    try {
      const data: Fnc = await import(`file://${file}${isRefresh ? `?t=${Date.now()}` : ''}`)
      for (const key in data) {
        load.apps.push(loaderApp(index, data[key], key))
      }
    } catch (error) {
      handleError('loaderPlugin', { name, error, file })
    }
  }

  for (const { index, plugin } of list) {
    const { name, apps } = plugin
    for (const file of apps) {
      load.pkg.push(createPkg(index, name, file))
    }
  }
}

/**
 * 加载每个插件
 * @param index 插件索引
 * @param fnc 插件方法
 * @param key 插件方法名称
 */
const loaderApp = async (index: number, fnc: FncType | FncType[], key: string) => {
  if (typeof fnc === 'function') {
    if (!isClass(fnc)) return
    const App = fnc as new () => Plugin
    const app = new App()
    /** 非插件 */
    if (!app?.rule) return

    for (const v of app.rule) {
      /** 没有对应方法跳过 */
      if (!(v.fnc in app)) continue
      /** 没有正则跳过 */
      if (typeof v.reg !== 'string' && !(v.reg instanceof RegExp)) continue

      createCommandClass({
        index,
        log: v.log,
        name: app.name,
        fname: v.fnc,
        adapter: v.adapter,
        dsbAdapter: v.dsbAdapter,
        cls: fnc,
        reg: v.reg,
        permission: v.permission,
        priority: v.priority,
      })
    }
    return
  }

  const list: FncType[] = Array.isArray(fnc) ? fnc : [fnc]
  list.forEach(fnc => {
    if (!fnc.fncType) return
    if (!fnc.fname) fnc.fname = key
    fnc.index = index
    switch (fnc.fncType) {
      case 'accept':
        cache.count.accept++
        return cache.accept.push(fnc)
      case 'button':
        cache.count.button++
        return cache.button.push(fnc)
      case 'handler': {
        if (!cache.handler[fnc.key]) {
          cache.count.handler.key++
          cache.handler[fnc.key] = []
        }
        cache.count.handler.fnc++
        cache.handler[fnc.key].push(fnc)
        return
      }
      case 'middleware':
        cache.count.middleware++
        return cache.middleware[fnc.type].push(fnc as any)
      case 'command':
        cache.count.command++
        return cache.command.push(fnc)
      case 'task': {
        fnc.schedule = schedule.scheduleJob(fnc.cron, async () => {
          try {
            fnc.log(`[定时任务][${fnc.name}][${fnc.fname}]: 开始执行`)
            const result = fnc.fnc()
            if (util.types.isPromise(result)) await result
            fnc.log(`[定时任务][${fnc.name}][${fnc.fname}]: 执行完成`)
          } catch (error) {
            handleError('taskStart', { name: fnc.name, task: fnc.fname, error })
          }
        })
        cache.count.task++
        return cache.task.push(fnc)
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
