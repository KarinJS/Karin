import { logger } from '#Karin'

/**
 * 渲染器管理器
 */
class Renderer {
  constructor () {
    /** 渲染器列表 */
    this.Apps = new Map()
  }

  /**
   * 注册渲染器
   * @param data.id 渲染器ID
   * @param data.type 渲染器类型
   * @param data.render 渲染器标准方法
   */
  app (data) {
    const { id, type, render } = data
    if (!id) throw new Error('[注册渲染器失败] 缺少渲染器ID')
    if (!type) throw new Error('[注册渲染器失败] 缺少渲染器类型')
    if (!render) throw new Error('[注册渲染器失败] 缺少渲染器标准方法')
    if (this.Apps.has(id)) throw new Error(`[注册渲染器失败] 已存在渲染器ID：${id}`)

    this.Apps.set(id, data)
    logger.mark(`[注册渲染器] ${id}`)
  }

  /** 卸载渲染器 */
  unapp (id) {
    if (!this.Apps.has(id)) throw new Error(`[卸载渲染器失败] 不存在渲染器ID：${id}`)
    this.Apps.delete(id)
    logger.mark(`[卸载渲染器] ${id}`)
  }

  /**
   * 返回渲染器实例
   * @param {string} id 渲染器ID
   * @returns {Promise<{
   *  id: string,
   *  type: string,
   *  render: Function
   * }>}
   */
  App (id) {
    /** 如果未键入渲染器id 默认返回第一个 */
    if (!id) {
      if (this.Apps.size === 0) throw new Error('[调用渲染器失败] 未找到任何渲染器')
      return this.Apps.values().next().value
    }

    /**
     * 渲染器
     * @type {{
     *   id: string,
     *   type: string,
     *   render: Function
     * }}
     */
    const app = this.Apps.get(id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器ID：${id}`)
    return app
  }

  /**
   * 键入对应渲染器，调用标准方法进行渲染
   * @param {{
   *   id: string,
   *   name: string,
   *   data: {
   *    tplFile: string,
   *    saveId?: string,
   *    imgType?: "jpeg" | "png",
   *    quality?: number,
   *    omitBackground?: boolean,
   *    path?: string,
   *    multiPage?: boolean,
   *    multiPageHeight?: number,
   *    setViewport?: { width: number, height: number, deviceScaleFactor: number },
   *    pageGotoParams?: any
   * }
   * }} options
   * @param options.data.tplFile 模板路径或http地址，必传
   * @param options.data.saveId  生成html名称，为空name代替
   * @param options.data.imgType  screenshot参数，生成图片类型：jpeg，png
   * @param options.data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param options.data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param options.data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @param options.data.multiPage 是否分页截图，默认false
   * @param options.data.multiPageHeight 分页状态下页面高度，默认4000
   * @param options.data.setViewport 页面视窗大小和设备像素比 默认1920*1080、1
   * @param options.data.pageGotoParams 页面goto时的参数
   * @return {Promise<string|string[]>} - 分片返回数组，单页返回base64://
   */
  async render ({ id, name, data }) {
    const app = this.App(id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
    return app.render(name, data)
  }

  /**
   * 快速渲染
   * @param {string} file html路径或者http地址
   */
  async renderHtml (file) {
    const app = this.App()
    return app.render('renderHtml', { tplFile: file })
  }
}

export default new Renderer()
