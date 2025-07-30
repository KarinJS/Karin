import path from 'node:path'
import { kvPath } from '@/root'
import { SQLiteWrapper } from './sqlite'

/**
 * @description kv数据库
 */
export let db: SQLiteWrapper

/**
 * @description 初始化状态，防止重复初始化
 */
let initialized = false

/**
 * @description 正在进行的初始化Promise
 */
let initializingPromise: Promise<SQLiteWrapper> | null = null

/**
 * @description 初始化
 * @param dbPath 数据库路径
 * @returns 数据库实例
 */
const init = async (dbPath: string) => {
  db = await new SQLiteWrapper(dbPath)._init()
  return db
}

/**
 * @description 创建一个kv数据库
 * @returns 数据库实例的Promise
 */
export const createDB = (): Promise<SQLiteWrapper> => {
  if (initialized && db) {
    return Promise.resolve(db)
  }

  if (initializingPromise) {
    return initializingPromise
  }

  initializingPromise = init(path.join(kvPath, 'kv.db')).then(result => {
    initialized = true
    initializingPromise = null
    return result
  }).catch(error => {
    initializingPromise = null
    throw error
  })

  return initializingPromise
}
