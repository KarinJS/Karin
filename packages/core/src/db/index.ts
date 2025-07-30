import { config } from '../config'
import { db, redis, createDB, createRedis } from '@karinjs/db'
import { karinPathDb, karinPathRedisSqlite3 } from '@karinjs/paths'

await Promise.all([
  createDB(karinPathDb),
  createRedis(config.redis(), karinPathRedisSqlite3),
])

export { db, redis }
