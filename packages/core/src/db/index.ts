import { config } from '../config'
import { db, redis, createDB, createRedis } from '@karinjs/db'
import { karinPathDb, karinPathRedisSqlite3 } from '@karinjs/paths'

/**
 * 初始化数据库
 */
export const initDB = async () => {
  await Promise.all([
    createDB(karinPathDb),
    createRedis(config.redis(), karinPathRedisSqlite3),
  ])
}

export { db, redis }
