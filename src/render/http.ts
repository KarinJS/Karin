import axios from 'axios'
import { RenderBase } from './base'
import logger from 'karin/utils/logger'
import { KarinRenderType } from 'karin/types/render'

export class HttpRenderer extends RenderBase {
  id: string
  host: string
  url: string
  token: string
  /**
   * 构造函数
   * @param host - 静态服务器地址
   * @param url - 渲染接口
   * @param token - token
   */
  constructor (host: string, url: string, token: string) {
    super()
    this.id = 'puppeteer'
    this.host = host
    this.url = url
    this.token = token
  }

  /**
   * 渲染
   */
  async render<T extends KarinRenderType> (options: T) {
    const name = options.name || 'render'
    let file = options.file
    /** 非http渲染模板并转为http静态资源 */
    if (!options.file.includes('http') && !options.vue) {
      const isLocalhost = this.host.includes('127.0.0.1') || this.host.includes('localhost')
      file = this.dealTpl(options, isLocalhost)
      if (!file) {
        logger.error(`[渲染器:${this.id}] 模板文件不存在：${name}`)
        return ''
      }

      options.file = isLocalhost ? 'file://' + file : `${this.host}/api/renderHtml?html=${file}`
    }

    delete options.data
    const data = options
    const headers = {
      Authorization: this.token,
    }
    logger.debug(`[渲染器:${this.id}][POST] \n请求:${this.url} \nhtml: ${options.file} \ndata: ${JSON.stringify(data)}`)
    const res = await axios({ method: 'post', url: this.url, headers, data })
    if (res.status === 200 && res.data.ok) {
      return res.data.data
    }
    throw new Error(`渲染失败：${JSON.stringify(res.data)}`)
  }
}
