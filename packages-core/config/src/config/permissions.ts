export interface ConfigPermissions {
  /** 主人列表 */
  master: string[]
  /** 管理员列表 */
  admin: string[]
}

/**
 * 默认配置
 */
export const configDefaultPermissions: ConfigPermissions = {
  master: [],
  admin: [],
}

/**
 * 兼容性处理
 * @param config 配置
 */
export const configPermissionsCompat = (config: Partial<ConfigPermissions>): ConfigPermissions => {
  const master = Array.isArray(config.master) ? config.master : configDefaultPermissions.master
  const admin = Array.isArray(config.admin) ? config.admin : configDefaultPermissions.admin
  return {
    master: master.filter(i => typeof i === 'string' && i.length > 0),
    admin: admin.filter(i => typeof i === 'string' && i.length > 0),
  }
}

/**
 * 权限配置 API
 */
export const permissions = {
  /**
   * 默认权限配置
   */
  default: configDefaultPermissions,
  /**
   * 兼容性处理权限配置
   */
  compat: configPermissionsCompat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
