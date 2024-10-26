import { Cache } from './types'

/** 获取插件列表时的缓存 */
export const getPlgsCache = new Map<string, any>()

/** 缓存 */
export const cache: Cache = {
  accept: [],
  command: [],
  task: [],
  button: [],
  handler: [],
  middleware: [],
}
