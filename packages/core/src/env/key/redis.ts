/** redis: 插件列表缓存键名 */
export const REDIS_PLUGIN_LIST_CACHE_KEY = 'karin:market:plugin:list'
/** redis: 依赖列表缓存键名 */
export const REDIS_DEPENDENCIES_LIST_CACHE_KEY = 'karin:dependencies:list'

/** redis: 依赖列表缓存过期时间 3小时 */
export const REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE = 3 * 60 * 60
/** redis: 插件市场列表缓存键名 */
export const REDIS_PLUGIN_MARKET_LIST_CACHE_KEY = 'karin:market:plugin:list:v2'
/** redis: 插件市场列表缓存过期时间 12小时 */
export const REDIS_PLUGIN_MARKET_LIST_CACHE_EXPIRE = 12 * 60 * 60
