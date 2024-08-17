import { Level } from 'level'

const path = process.cwd() + '/data/db/Level'

/**
 * @type {Level}
 */
export default class LevelDB extends Level {
  id: string
  constructor () {
    super(path, { valueEncoding: 'json' })
    /**
     * @type {'Level'} 唯一标识符 用于区分不同的数据库
     */
    this.id = 'Level'
  }

  /**
   * 对get方法进行重写 找不到数据时返回null
   */
  async get (key: string): Promise<string> {
    try {
      const res = await super.get(key)
      return res
    } catch {
      return ''
    }
  }

  /**
   * 增加set方法
   * @param {string} key 键
   * @param {object|string} value 值
   */
  async set (key: string, value: string | object) {
    return await super.put(key, value as string)
  }
}

export const level = new LevelDB()
level.open()
