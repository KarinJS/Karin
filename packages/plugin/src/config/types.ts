/**
 * 插件作者
 */
export interface WebConfigAuthor {
  /** 名字 */
  name: string
  /** 主页 */
  home: string
  /**
   * 头像
   * @description https://github.com/[owner].png
   */
  avatar: string
}

/**
 * 保存配置函数返回值
 */
export interface WebConfigSaveResponse {
  /** 是否成功 */
  success: boolean
  /** 消息 */
  message: string
}

/**
 * 插件图标
 */
export interface WebConfigIcon {
  /**
   * 图标名称
   * @see https://fonts.google.com/icons
   */
  name?: string
  /** 图标大小 */
  size?: number
  /** 图标颜色 */
  color?: string
}

/**
 * 插件元信息
 */
export interface PluginMeta {
  /**
   * 插件名称 前端优先展示
   * @description 如果未提供则使用package.json中的name
   */
  name?: string
  /**
   * 插件作者
   * @example
   * ```json
   * {
   *   "name": "插件作者",
   *   "home": "https://example.com",
   *   "avatar": "https://github.com/[owner].png"
   * }
   *
   * // 多个作者
   * [
   *   {
   *     "name": "插件作者1",
   *     "home": "https://example.com",
   *     "avatar": "https://github.com/[owner].png"
   *   },
   *   {
   *     "name": "插件作者2",
   *     "home": "https://example.com",
   *     "avatar": "https://gitee.com/[owner].png"
   *   }
   * ]
   * ```
   */
  author?: WebConfigAuthor | WebConfigAuthor[]
  /**
   * 插件图标
   * @see https://fonts.google.com/icons
   * @example
   * {
   *   "name": "插件图标",
   *   "size": 24,
   *   "color": "#000000"
   * }
   */
  icon?: WebConfigIcon
  /**
   * 插件描述
   * @description 如果未提供则使用package.json中的description
   */
  description?: string
}
