import lodash from 'lodash'
import logger from './logger'
import { EventType, PluginType } from 'karin/types'
import { Plugin, pluginLoader as loader } from 'karin/core'

/**
 * 事件处理器类
 */
export const handler = new (class EventHandler {
  /**
   * 添加事件处理器
   * @param index 插件索引
   * @param Class 插件类
   */
  add (index: string, Class: PluginType) {
    lodash.forEach(Class.handler, val => {
      if (!val.key) logger.error(`[Handler][Add]: [${Class.name}] 缺少 key`)
      if (!val.fnc) logger.error(`[Handler][Add]: [${Class.name}] 缺少 fnc`)
      logger.debug(`[Handler][Reg]: [${Class.name}][${val.key}]`)
      if (!Array.isArray(loader.handlerIds[val.key])) loader.handlerIds[val.key] = []
      loader.handlerIds[val.key].push({ index, fnc: val.fnc, priority: val.priority || Class.priority })
      loader.handlerIds[val.key] = lodash.orderBy(loader.handlerIds[val.key], ['priority'], ['asc'])
    })
  }

  /**
   * 删除事件处理器
   * 如果不传参数则删除所有处理器
   */
  del ({ index = '', key = '' }: {
    /**
     * 插件索引
     */
    index: string | ''
    /**
     * 事件键
     */
    key: string | ''
  }) {
    /** 无参 */
    if (!key && !index) {
      loader.handlerIds = {}
      return true
    }

    /** 删除指定索引插件 */
    if (!key) {
      for (const v of Object.keys(loader.handlerIds)) {
        loader.handlerIds[v] = loader.handlerIds[v].filter(v => v.index !== index)
        // 如果处理器为空则删除键
        if (!loader.handlerIds[v].length) {
          delete loader.handlerIds[v]
        } else {
          loader.handlerIds[v] = lodash.orderBy(loader.handlerIds[v], ['priority'], ['asc'])
        }
      }
      return true
    }

    /** 删除指定key */
    if (!index) {
      loader.handlerIds[key] && delete loader.handlerIds[key]
      return true
    }

    /** 删除指定key的index */
    if (!loader.handlerIds[key]) return false
    loader.handlerIds[key] = loader.handlerIds[key].filter(v => v.index !== index)
    if (!loader.handlerIds[key].length) {
      delete loader.handlerIds[key]
      return true
    }
    loader.handlerIds[key] = lodash.orderBy(loader.handlerIds[key], ['priority'], ['asc'])

    return true
  }

  /**
   * 调用事件处理器
   * @param key 事件键
   * @param args 自定义参数 一般用来传递e之类的
   */
  async call (key: string, args: { [key: string]: any, e?: EventType<unknown> }) {
    let res
    for (const v of loader.handlerIds[key] || []) {
      const info = loader.PluginList[v.index]

      try {
        let done = true
        /**
         * 拒绝处理器 调用后则不再继续执行下一个处理器
         * @param msg 错误信息
         */
        const reject = (msg = '') => {
          if (msg) logger.mark(`[Handler][Reject]: [${info.file.dir}][${info.file.name}][${key}] ${msg}`)
          done = false
        }

        if (info.file.type === 'function' && typeof v.fnc === 'function') {
          res = await v.fnc(args, reject)
        } else {
          const cla = new (info.file.Fnc as new () => Plugin)()
          cla.e = args.e as EventType<typeof args.e>
          res = await (cla[v.fnc as keyof typeof cla] as Function)(args, reject)
        }

        if (done) {
          logger.mark(`[Handler][Done]: [${info.file.dir}][${info.file.name}][${key}]`)
          return res
        }
      } catch (e) {
        // 产生错误继续下一个处理器
        logger.error(`[Handler][Error]: [${info.file.dir}][${info.file.name}][${key}] ${e}`)
      }
    }
    return res
  }

  /**
   * 检查是否存在指定键的事件处理器
   */
  has (key: string): boolean {
    return !!loader.handlerIds[key]
  }
})()
