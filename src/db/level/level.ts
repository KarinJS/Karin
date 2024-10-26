import { Level } from 'level'

const levelPath = process.cwd() + '/data/db/level'

class LevelDB extends Level {
  id: string
  constructor (path: string) {
    super(path, { valueEncoding: 'json' })
    this.id = 'Level'
  }

  /**
   * 和get方法一样
   * @param key 键
   * @param value 值
   */
  async set (key: string, value: string | object) {
    return await super.put(key, value as string)
  }

  /**
   * 和get方法一样 但是不抛出错误
   * @param key 键
   */
  async has (key: string) {
    try {
      return await super.get(key)
    } catch {
      return null
    }
  }
}

/**
 * 创建 LevelDB 数据库实例
 * @param path 数据库存储路径
 */
export const createLevelDB = (path = levelPath) => {
  const level = new LevelDB(path)

  /** 代理get方法 使其不抛出错误 */
  const levelProxy = new Proxy(level, {
    get (target, prop) {
      if (prop === 'get') {
        return async (key: string) => {
          try {
            const res = await target.get(key)
            return res
          } catch {
            return null
          }
        }
      }
      return Reflect.get(target, prop)
    },
  })
  return levelProxy
}
