import { Client, createLevelDB, createRedis } from '@/core/db'

/**
 * @public
 * @description level 数据库
 */
export const level = createLevelDB()

/**
 * @public
 * @description redis 数据库
 */
export let redis: Client

(async () => {
  redis = await createRedis()
})()
