import { Level } from 'level'

const path = process.cwd() + '/data/db/Level'

/**
 * @type {Level}
 */
export default class LevelDB extends Level {
  constructor () {
    super(path, { valueEncoding: 'json' })
    /**
     * @type {'Level'} 唯一标识符 用于区分不同的数据库
     */
    this.id = 'Level'
  }

  /**
   * 对get方法进行重写 找不到数据时返回null
   * @param {string} key 键
   * @returns {Promise<object|string|null>}
   */
  async get (key) {
    try {
      return await super.get(key)
    } catch {
      return null
    }
  }
}
