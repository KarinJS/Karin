import type { ComponentConfig } from './types'

/**
 * @types web.config
 * 插件作者
 */
export interface WebConfigAuthor {
  /** 名字 */
  name?: string
  /** 主页 */
  home?: string
  /**
   * 头像
   * @description https://github.com/[owner].png
   */
  avatar?: string
}

/**
 * @types web.config
 * 保存配置函数返回值
 */
export interface WebConfigSaveResponse {
  /** 是否成功 */
  success: boolean
  /** 消息 */
  message: string
}

/**
 * @types web.config
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
 * @types web.config
 * webui配置函数类型
 */
export interface DefineConfig<T = any> {
  /** 插件信息 */
  info: {
    /**
     * 插件id 也就是插件的包名
     * @deprecated 无需手动提供
     */
    id?: string
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
     *     "avatar": "https://github.com/[owner].png"
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
    /** 插件描述 可不填 会自动读取package.description */
    description?: string
  },
  /** 模板组件配置参数 */
  components?: () => ComponentConfig[] | Promise<ComponentConfig[]>
  /**
   * 保存配置
   * @param config 配置
   * @returns 保存结果
   */
  save?: (config: T) => WebConfigSaveResponse | Promise<WebConfigSaveResponse>
  /**
   * 自定义组件配置
   * @description 未完成
   */
  customComponent?: () => unknown
}

/**
 * webui 配置
 * @param config 配置
 * @returns 配置
 */
export const defineConfig = <T> (
  config: DefineConfig<T>
): DefineConfig<T> => {
  return config
}
