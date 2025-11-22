export interface ConfigRedis {
  /**
   * 是否启用Redis
   * @default true
   */
  enable: boolean,
  /**
   * Redis连接URL
   * @default redis://127.0.0.1:6379
   */
  url: string,
  /**
   * 用户名
   * @default ""
   */
  username: string,
  /**
   * 密码
   * @default ""
   */
  password: string,
  /**
   * 数据库编号
   * @default 0
   */
  database: number,
}

/**
 * 默认Redis配置
 */
export const configDefaultRedis: ConfigRedis = {
  enable: true,
  url: 'redis://127.0.0.1:6379',
  username: '',
  password: '',
  database: 0,
}

/**
 * 兼容性处理
 * @description 原样返回
 * @param config Redis配置
 */
export const configRedisCompat = (config: Partial<ConfigRedis>): ConfigRedis => {
  return config as ConfigRedis
}

/**
 * Redis配置 API
 */
export const redis = {
  /**
   * 默认Redis配置
   */
  default: configDefaultRedis,
  /**
   * 兼容性处理Redis配置
   */
  compat: configRedisCompat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
