import type { ComponentConfig } from '../components'

/**
 * 插件作者
 */
export interface Author {
  /** 名字 */
  name?: string
  /** 主页 */
  home?: string
  /** 头像 */
  avatar?: string
}

/**
 * 插件图标
 */
export interface Icon {
  /** 图标名称 */
  name?: string
  /** 图标大小 */
  size?: number
  /** 图标颜色 */
  color?: string
}

/** 本地插件列表 请自行添加[] */
export interface LocalApiResponse {
  /** 插件id */
  id: string
  /** 是否存在配置文件 无需配置 */
  hasConfig?: boolean
  /** 插件类型 无需配置 */
  type?: 'git' | 'npm' | 'app'
  /** 插件名称 前端优先展示 */
  name?: string
  /** 插件版本 可不填 会自动读取package.json中的version */
  version?: string
  /** 插件描述 可不填 会自动读取package.json中的version */
  description?: string
  /** 插件作者 */
  author?: Author[]
  /** 插件图标 前端优先展示 */
  icon?: Icon
}

/** 获取配置请求参数 */
export interface GetConfigRequest {
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: 'git' | 'npm' | 'app'
}

/** 获取配置响应 */
export interface GetConfigResponse {
  /** 组件配置参数 */
  options: ComponentConfig[]
  /** 插件信息 */
  info: LocalApiResponse
}

/**
 * 保存配置返回值
 */
export interface SaveConfigResponse {
  /** 是否成功 */
  success: boolean
  /** 消息 */
  message: string
}

/** webui配置 */
export interface DefineConfig {
  /** 插件信息 */
  info: {
    /** 插件id */
    id: string
    /** 插件名称 前端优先展示 */
    name?: string
    /** 插件作者 */
    author?: Author | Author[]
    /** 插件图标 前端优先展示 */
    icon?: Icon
    /** 插件版本 可不填 会自动读取package.json中的version */
    version?: string
    /** 插件描述 可不填 会自动读取package.json中的version */
    description?: string
  },
  /** 组件配置参数 */
  components: () => ComponentConfig[] | Promise<ComponentConfig[]>
  /**
   * 保存配置
   * @param config 配置
   * @param T 支持传递泛型~
   */
  save: <T = Record<string, any>>(config: T) => SaveConfigResponse | Promise<SaveConfigResponse>
}
