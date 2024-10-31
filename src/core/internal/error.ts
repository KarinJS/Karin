import path from 'node:path'
import { cache } from '@plugin/cache/cache'
import { listeners } from './listeners'

interface ErrorParams {
  loaderPlugin: {
    /** 插件包名 */
    name: string,
    /** 报错的文件名称 */
    file: string
    /** 错误信息 */
    error: any,
  },
  taskStart: {
    /** 插件包名 */
    name: string,
    /** 任务名称 */
    task: string,
    /** 错误信息 */
    error: any,
  }
}

/**
 * @description 处理错误
 * @param key 错误类型
 * @param params 错误参数
 */
export const handleError = <T extends keyof ErrorParams = keyof ErrorParams> (key: T, params: ErrorParams[T]) => {
  if (key === 'loaderPlugin') {
    const { name, error, file } = params as ErrorParams['loaderPlugin']
    const pkg = /Cannot find package '(.+?)'/.exec(error)?.[1]
    if (pkg) {
      const key = `${name}.${pkg}`
      cache.missing.set(key, pkg)
    } else {
      logger.error(`载入插件错误：${logger.red(`${name}/${path.basename(file)}`)}`)
      listeners.emit('error', error)
    }
    return
  }

  if (key === 'taskStart') {
    const { name, task, error } = params as ErrorParams['taskStart']
    logger.error(`[定时任务][${name}][${task}] 执行错误`)
    listeners.emit('error', error)
  }
}
