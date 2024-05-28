import axios from 'axios'
import { Cfg } from '#Karin'
import RenderBase from './Base.js'

export default class HttpRenderer extends RenderBase {
  /**
   * 构造函数
   * @param {string} host - 静态服务器地址
   * @param {string} url - 渲染接口
   * @param {string} token - token
   */
  constructor (host, url, token) {
    super()
    this.host = host
    this.url = url
    this.token = token
  }

  /**
   * 渲染
   * @param {RenderBase.RenderFunction} options - 渲染参数
   * @returns {Promise<string|string[]>} 渲染结果
   */
  async render (options) {
    const name = options.name || 'render'
    let file = options.file
    /** 非http渲染模板并转为http静态资源 */
    if (!options.file.includes('http')) {
      file = this.dealTpl(options, false)
      if (!file) {
        logger.error(`[渲染器:${this.id}] 模板文件不存在：${name}`)
        return false
      }
      /** url编码 */
      file = `${Cfg.Server.HttpRender.host}/api/render?html=${encodeURIComponent(file)}`
    }

    delete options.data
    const data = options
    const res = await axios({ method: 'post', data, token: this.token })
    return res.data.data
  }
}

/**
 * @typedef {function(RenderBase.render): Promise<string|string[]>} RenderFunction
 * @param {RenderBase.render} options 渲染参数
 * @returns {string|string[]} 返回图片base64或数组
 */
