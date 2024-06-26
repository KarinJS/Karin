import chokidar from 'chokidar'

/**
 * 渲染标准方法传参
 */
export interface KarinRenderType {
  /**
   * - 渲染文件路径或HTTP地址 与vue二选一
   */
  file: string
  /**
   * - vue文件路径 与file二选一
   */
  vue?: string
  /**
   * - 模板名称
   */
  name?: string
  /**
   * - art-template后的文件名
   */
  fileID?: string
  /**
   * - 传递给模板的数据 template.render(data)
   */
  data?: object
  /**
   * - 截图类型 默认'webp'
   */
  type?: 'png' | 'jpeg' | 'webp'
  /**
   * - 截图质量 默认90 1-100
   */
  quality?: number
  /**
   * - 是否隐藏背景 默认false
   */
  omitBackground?: boolean
  /**
   * - 设置视窗大小和设备像素比 默认1920*1080、1
   */
  setViewport?: {
    /**
     * - 视窗宽度
     */
    width?: number
    /**
     * - 视窗高度
     */
    height?: number
    /**
     * - 设备像素比
     */
    deviceScaleFactor?: string
  }
  /**
   * - 分页截图 传递数字则视为视窗高度 返回数组
   */
  multiPage?: number | boolean
  /**
   * - 页面goto时的参数
   */
  pageGotoParams?: {
    /**
     * - 页面加载超时时间
     */
    timeout?: number
    /**
     * - 页面加载状态
     */
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2'
    [key: string]: any
  }
}

/**
 * 渲染基类
 */
export interface KarinRender {
  dir: './temp/html'
  html: {
    [key: string]: string
  }
  watcher: {
    [key: string]: chokidar.FSWatcher
  }

  /**
   * 模板渲染
   * @param options - 渲染参数
   * @param isAbs - 是否返回绝对路径 默认true
   */
  dealTpl (options: KarinRenderType, isAbs: boolean): string
  /**
   * 监听模板文件
   * @param tplFile 模板文件路径
   */
  watch (tplFile: string): void
  /**
   * 渲染
   * @param options - 标准渲染方法
   */
  render: (options: KarinRenderType) => Promise<string | Array<string>>
}

/**
 * 渲染器管理
 */
export interface KarinRenderApp {
  index: number
  id: string
  type: string
  time: number
  render: KarinRender['render']
}
