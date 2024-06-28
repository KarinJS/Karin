import { logger } from 'karin/utils'
import { KarinRender, KarinRenderApp, KarinRenderType } from 'karin/types'

class Renderer {
  index: number
  Apps: Array<KarinRenderApp>
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
   * @param data 渲染器数据
   * @param data.id 渲染器ID
   * @param data.type 渲染器类型
   * @param ata.render 渲染器标准方法
   * @returns 渲染器索引
   */
  app (data: { id: string, type?: 'image' | string, render: KarinRender['render'] }) {
    this.index++
    const index = this.index
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
   * @param index 渲染器索引
   * @returns 是否卸载成功
   */
  unapp (index: number): boolean {
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
   * @param id 渲染器ID
   * @returns 渲染器实例
   */
  App (id: string = ''): KarinRenderApp {
    if (this.Apps.length === 0) throw new Error('[调用渲染器失败] 渲染器列表为空')
    if (!id) return this.Apps[0]

    /** 筛选出id一致的渲染器 */
    const app = this.Apps.find(app => app.id === id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
    return app
  }

  /**
   * 调用标准渲染器
   */
  async render (options: KarinRenderType, id?: string) {
    const res = this.App(id)
    return res.render(options)
  }

  /**
   * 快速渲染
   * @param data html路径、http地址
   * @returns 返回图片base64或数组
   */
  async renderHtml (data: string) {
    const app = this.App()
    return app.render({
      file: data,
      name: 'render',
      pageGotoParams: {
        waitUntil: 'networkidle2',
      },
    })
  }
}

/**
 * 渲染器管理器
 */
export const render = new Renderer()
