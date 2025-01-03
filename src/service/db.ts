import { createLevelDB, createRedis } from '@/core/db'

/**
 * @public
 * @description level 数据库
 */
export const level = createLevelDB()

/**
 * @public
 * @description redis 数据库
 */
export const redis = await createRedis()
