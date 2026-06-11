import type { ComponentConfig } from '../components'

/**
 * 插件作者
 */
export interface Author {
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
 * 插件图标
 */
export interface Icon {
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
  /** 自定义配置页面 */
  page?: WebConfigPage
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

/**
 * 插件自定义 Web 配置页面。
 *
 * 当插件不想使用 Karin 内置表单渲染配置项时，可以声明一个自定义页面。
 * Karin WebUI 会在插件配置页中加载该地址。插件可以使用同源路由提供页面，
 * 也可以指向一个外部公共配置管理平台。
 */
export interface WebConfigPage {
  /**
   * 页面地址。
   *
   * 支持两种形式：
   * - 同源绝对路径，例如 `/my-plugin/`。插件需要在 Karin 后端自行注册对应静态路由。
   * - `http://` 或 `https://` 外部地址，例如 `https://config.example.com/plugin?id=my-plugin`。
   *
   * 外部公共配置管理平台可以通过 query 或 hash 携带插件标识。
   */
  url: string
  /** 页面标题，会展示在 Karin 插件配置页的页面容器中。 */
  title?: string
  /** 页面描述，会作为配置页的辅助说明文本。 */
  description?: string
}

/**
 * 自定义配置页面工厂。
 *
 * 适用于页面地址需要异步计算的场景，例如读取运行时端口或配置文件。
 */
export type WebConfigPageFactory = () => WebConfigPage | Promise<WebConfigPage>

/** webui配置基础信息 */
export interface DefineConfigBase {
  /** 插件信息 */
  info: {
    /** 插件id 也就是插件的包名 */
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
  /**
   * 自定义组件配置
   * @description 未完成
   */
  customComponent?: () => unknown
}

/** 使用 Karin 内置组件渲染的 WebUI 配置。 */
export interface DefineComponentConfig<T = any> extends DefineConfigBase {
  /**
   * 内置组件配置。
   *
   * 返回值会交给 Karin WebUI 渲染为配置表单。
   */
  components?: () => ComponentConfig[] | Promise<ComponentConfig[]>
  /**
   * 保存配置。
   *
   * @param config Karin WebUI 提交的配置数据。类型由 `defineConfig<T>` 的泛型决定。
   * @returns 保存结果。`success` 控制前端保存反馈，`message` 会展示给用户。
   */
  save?: (config: T) => SaveConfigResponse | Promise<SaveConfigResponse>
}

/**
 * 使用插件自定义页面渲染的 WebUI 配置。
 *
 * 声明 `page` 后，Karin WebUI 会加载该页面，而不是渲染 `components` 表单。
 * 自定义页面需要自行处理配置读取与保存，不再接入 Karin 的通用组件保存接口。
 */
export interface DefinePageConfig extends DefineConfigBase {
  /** 插件自定义配置页面，或返回页面配置的工厂函数。 */
  page: WebConfigPage | WebConfigPageFactory
  /** 自定义页面模式不使用 Karin 内置组件配置。 */
  components?: never
  /** 自定义页面模式不使用 Karin 通用保存接口。 */
  save?: never
}

/** 插件 WebUI 配置，支持内置组件表单或自定义页面两种模式。 */
export type DefineConfig<T = any> = DefineComponentConfig<T> | DefinePageConfig
