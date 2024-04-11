import { logger } from '#Karin'

class Renderer {
  /**
   * 渲染器
   * @param data.id 渲染器ID
   * @param data.type 渲染器类型
   * @param data.render 渲染器标准方法
   */
  constructor () {
    /** 渲染器列表 */
    this.Apps = new Map()
  }

  /** 注册渲染器 */
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
  App (id = 'puppeteer') {
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
   *   data: any
   * }}
   */
  render ({ id = 'puppeteer', name, data }) {
    const app = this.App(id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
    return app.render(name, data)
  }
}

export default new Renderer()
