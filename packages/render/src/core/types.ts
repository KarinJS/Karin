/**
 * @public
 */
export declare interface Point {
  x: number
  y: number
}

/**
 * @public
 */
export declare interface BoundingBox extends Point {
  /** 元素的宽度（以像素为单位） */
  width: number
  /** 元素的高度（以像素为单位） */
  height: number
}

/**
 * @public
 */
export declare interface ScreenshotClip extends BoundingBox {
  /**
   * @defaultValue `1`
   */
  scale?: number
}

/**
 * @public
 */
export declare interface ScreenshotOptions {
  /**
   * @defaultValue `false`
   */
  optimizeForSpeed?: boolean
  /**
   * @defaultValue `'png'`
   */
  type?: 'png' | 'jpeg' | 'webp'
  /**
   * 图像的质量，范围为 0-100。不适用于 `png` 图像。
   */
  quality?: number
  /**
   * 从表面捕获屏幕截图，而不是从视图捕获。
   *
   * @defaultValue `true`
   */
  fromSurface?: boolean
  /**
   * 当设置为 `true` 时，将捕获整个页面的屏幕截图。
   *
   * @defaultValue `false`
   */
  fullPage?: boolean
  /**
   * 隐藏默认的白色背景，允许捕获具有透明背景的屏幕截图。
   *
   * @defaultValue `false`
   */
  omitBackground?: boolean
  /**
   * 保存图像的文件路径。屏幕截图的类型将从文件扩展名推断得出。
   * 如果路径是相对路径，则会相对于当前工作目录解析。
   * 如果未提供路径，则图像不会保存到磁盘。
   */
  path?: string
  /**
   * 指定页面/元素需要裁剪的区域。
   */
  clip?: ScreenshotClip
  /**
   * 图像的编码方式。
   *
   * @deprecated 这是无效选项，强制性返回string<base64>
   */
  encoding?: 'base64' | 'binary'
  /**
   * 捕获视口之外的屏幕截图。
   *
   * @defaultValue `false` 如果没有 `clip` 的情况下为 `false`。否则为 `true`。
   */
  captureBeyondViewport?: boolean
}

/**
 * @public
 */
export declare type PuppeteerLifeCycleEvent =
  /**
  * 等待`load`事件。
  */
  'load'
  /**
  * 等待`DOMContentLoaded`事件。
  */
  | 'domcontentloaded'
  /**
  * 等待至少 `500` 毫秒，直至网络连接不超过 0 个
  */
  | 'networkidle0'
  /**
  * 等待至少 `500` 毫秒，直至网络连接不超过 2 个
  */
  | 'networkidle2'

/**
 * @public
 */
export declare interface WaitForOptions {
  /**
   * 最大等待时间（以毫秒为单位）。传递 0 可禁用超时
   *
   * The default value can be changed by using the
   * {@link Page.setDefaultTimeout} or {@link Page.setDefaultNavigationTimeout}
   * methods.
   *
   * @defaultValue `30000`
   */
  timeout?: number
  /**
   * 何时认为等待成功。给定一个事件字符串数组，当所有事件都触发后，等待才被视为成功
   *
   * @defaultValue `'load'`
   */
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[]
  /** 允许您取消呼叫的信号对象 */
  signal?: AbortSignal
}

/**
 * @public
 */
export declare interface GoToOptions extends WaitForOptions {
  /**
   * 如果提供，它将优先于由以下项设置的 referer 标头值：
   * {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
   */
  referer?: string
  /**
   * 如果提供，它将优先于 referer-policy 标头值
   * set by {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
   */
  referrerPolicy?: string
}

export interface screenshot extends ScreenshotOptions {
  /** http地址或本地文件路径 */
  file: string
  /**
 * 选择的元素截图
 * fullPage为false时生效
 * 如果未找到指定元素则使用body
 * @default 'body'
 */
  selector?: string
  /**
   * 截图类型
   * @default 'jpeg'
  */
  type?: 'png' | 'jpeg' | 'webp'
  /**
   * 截图质量 默认90
   * @default 90
   */
  quality?: number
  /**
   * - 额外的 HTTP 头信息将随页面发起的每个请求一起发送
   * - 标头值必须是字符串
   * - 所有 HTTP 标头名称均小写。(HTTP 标头不区分大小写，因此这不会影响服务器代码）。
   */
  headers?: Record<string, string>
  /**
   * 截图整个页面
   * @default false
   */
  fullPage?: boolean
  /**
   * 控制截图的优化速度
   * @default false
   */
  optimizeForSpeed?: boolean
  /**
   * 捕获视口之外的屏幕截图
   * @default false
   */
  captureBeyondViewport?: boolean
  /** 设置视窗大小和设备像素比 */
  setViewport?: {
    /** 视窗宽度 */
    width?: number
    /** 视窗高度 */
    height?: number
    /**
     * 设备像素比
     * @default 1
     */
    deviceScaleFactor?: number
  }
  /** 分页截图 传递数字则视为视窗高度 返回数组 */
  multiPage?: number | boolean
  /** 页面goto时的参数 */
  pageGotoParams?: GoToOptions,
  /** 等待指定元素加载完成 */
  waitForSelector?: string | string[]
  /** 等待特定函数完成 */
  waitForFunction?: string | string[]
  /** 等待特定请求完成 */
  waitForRequest?: string | string[]
  /** 等待特定响应完成 */
  waitForResponse?: string | string[]
}

/** 截图参数 */
export interface KarinScreenshotOptions extends screenshot {
  /** 保存文件目录 推荐使用插件名称 */
  name?: string
  /** 传递给 art-template 的参数 */
  data?: Record<string, any>
}

/** 单页或多页截图返回 */
export type RenderResult<T extends screenshot> = T['multiPage'] extends true | number
  ? string[]
  : string

/**
 * snapka截图参数
 */
export interface Snapka extends screenshot {
  /**
   * 截图类型
   * @default 'png'
   */
  type?: 'png' | 'jpeg' | 'webp'
  /** http地址、本地文件路径、html字符串 */
  file: string
  /**
   * file类型
   * @default 'auto'
   * @description 如果传递的是URL、HTML绝对路径则无需传递此项
   * - auto: 自动识别、支持URL、HTML绝对路径
   * - htmlString: 传递HTML字符串
   * - vue3: 传递Vue3组件路径
   * - vueString: 传递Vue3组件字符串
   * - react: 传递React组件路径 `(暂未支持)`
   */
  file_type?: 'auto' | 'htmlString' | 'vue3' | 'vueString' | 'react'
  /** 文件名 推荐在传递字符串时使用 */
  file_name?: string
  /** 重试次数 */
  retry?: number
  /** 渲染参数 */
  data?: Record<string, any>
}

/** snapka截图返回 */
export type SnapkaResult<T extends Snapka> = T['multiPage'] extends true | number
  ? string[]
  : string
