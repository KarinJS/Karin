/** redis: 插件市场缓存键名 */
export const REDIS_PLUGIN_LIST_CACHE_KEY = 'karin:market:plugin:list'
/** redis: 依赖列表缓存键名 */
export const REDIS_DEPENDENCIES_LIST_CACHE_KEY = 'karin:dependencies:list'
/** redis: 插件市场列表缓存键名 */
export const REDIS_PLUGIN_MARKET_LIST_CACHE_KEY = 'karin:market:plugin:list:v2'
/** redis: 本地插件列表缓存键名 */
export const REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY = 'karin:local:plugin:list'

/** redis: 依赖列表缓存过期时间 24小时 */
export const REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE = 24 * 60 * 60
/** redis: 插件市场列表缓存过期时间 24小时 */
export const REDIS_PLUGIN_MARKET_LIST_CACHE_EXPIRE = 24 * 60 * 60
/** redis: 本地插件列表缓存过期时间 24小时 */
export const REDIS_PLUGIN_LIST_CACHE_EXPIRE = 24 * 60 * 60

/** redis: webui 侧边栏、插件卡片信息缓存键名  */
export const REDIS_LOCAL_PLUGIN_LIST_CACHE_KEY_FRONTEND = 'karin:local:plugin:list:frontend'
/** redis: webui 侧边栏、插件卡片信息缓存过期时间 24小时 */
export const REDIS_LOCAL_PLUGIN_LIST_CACHE_EXPIRE_FRONTEND = 24 * 60 * 60
