// eslint-disable-next-line no-unused-vars
import { logger, RenderBase } from '#Karin'

/**
 * 渲染器管理器
 */
class Renderer {
  constructor () {
    /** 索引 */
    this.index = 0
    /**
     * 渲染器列表
     * @type {APP[]}
     */
    this.Apps = []
  }

  /**
   * 注册渲染器
   * @param {object} data 渲染器数据
   * @param {string} data.id 渲染器ID
   * @param {'image'|string} data.type 渲染器类型
   * @param {RenderBase.render} data.render 渲染器标准方法
   * @returns {number} 渲染器索引
   */
  app (data) {
    const index = this.index
    this.index++
    const { id, type = 'image', render } = data
    if (!id) throw new Error('[注册渲染器失败] 缺少渲染器ID')
    if (!type) throw new Error('[注册渲染器失败] 缺少渲染器类型')
    if (!render) throw new Error('[注册渲染器失败] 缺少渲染器标准方法')

    const time = Date.now()
    const options = { index, id, type, render, time }
    this.Apps.push(options)
    logger.mark(`${logger.violet(`[渲染器:${index}]`)} 注册成功: ` + logger.green(id))
    return index
  }

  /**
   * 卸载渲染器
   * @param {number} index 渲染器索引
   * @returns {boolean} 是否卸载成功
   */
  unapp (index) {
    const app = this.Apps.find(app => app.index === index)
    if (!app) {
      logger.error(`[卸载渲染器失败] 未找到渲染器索引：${index}`)
      return false
    }

    this.Apps = this.Apps.filter(app => app.index !== index)
    logger.mark(`[卸载渲染器] ${app.id}`)
    return true
  }

  /**
   * 返回渲染器实例 未键入id返回第一个
   * @param {string} id 渲染器ID
   * @returns {Promise<APP>} 渲染器实例
   */
  App (id) {
    if (this.Apps.length === 0) throw new Error('[调用渲染器失败] 渲染器列表为空')
    if (!id) return this.Apps[0]

    /** 筛选出id一致的渲染器 */
    const app = this.Apps.find(app => app.id === id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
    return app
  }

  /**
   * 调用标准渲染器
   * @param {object} options 渲染参数
   * @param {string} options.file http地址或本地文件路径
   * @param {string} [options.name] 模板名称
   * @param {string} [options.fileID] art-template后的文件名
   * @param {object} [options.data] 传递给模板的数据 template.render(data)
   * @param {'png'|'jpeg'|'webp'} [options.type] 截图类型 默认'webp'
   * @param {number} [options.quality] 截图质量 默认90 1-100
   * @param {boolean} options.omitBackground 是否隐藏背景 默认false
   * @param {object} [options.setViewport] 设置视窗大小和设备像素比 默认1920*1080、1
   * @param {number} [options.setViewport.width] 视窗宽度
   * @param {number} [options.setViewport.height] 视窗高度
   * @param {string} [options.setViewport.deviceScaleFactor] 设备像素比
   * @param {number|boolean} [options.multiPage] 分页截图 传递数字则视为视窗高度 返回数组
   * @param {object} [options.pageGotoParams] 页面goto时的参数
   * @param {number} [options.pageGotoParams.timeout] 页面加载超时时间
   * @param {'load'|'domcontentloaded'|'networkidle0'|'networkidle2'} [options.pageGotoParams.waitUntil] 页面加载状态
   * @param {string} [id] 渲染器ID 1
   * @returns {Promise<string|string[]>} 返回图片base64或数组
   */
  async render (options, id) {
    const res = await this.App(id)
    return res.render(options)
  }

  /**
   * 快速渲染
   * @param {string} data html路径、http地址
   * @returns {Promise<string|string[]>} 返回图片base64或数组
   */
  async renderHtml (data) {
    const app = this.App()
    const options = {
      file: data,
      name: 'render',
      pageGotoParams: {
        waitUntil: 'networkidle2'
      }
    }
    return app.render(options)
  }
}

export default new Renderer()

/**
 * @typedef {object} APP 渲染器实例
 * @property {number} index 渲染器索引
 * @property {string} id 渲染器ID
 * @property {string} type 渲染器类型
 * @property {number} time 注册时间
 * @property {RenderBase.render} render 渲染器标准方法
 */
