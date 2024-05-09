import path from 'path'
import axios from 'axios'
import Cfg from '../config/config.js'
import RenderClass from './RenderClass.js'

export default class HttpRenderer extends RenderClass {
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
   * `chromium` 截图
   * @param {string} name 模板名称
   * @param {{
   * tplFile: string,
   * saveId?: string,
   * imgType?: "jpeg" | "png",
   * quality?: number,
   * omitBackground?: boolean,
   * path?: string,
   * multiPage?: boolean,
   * multiPageHeight?: number,
   * setViewport?: { width: number, height: number, deviceScaleFactor: number },
   * pageGotoParams?: any
   * }} data 模板参数
   * @param data.tplFile 模板路径或http地址，必传
   * @param data.saveId  生成html名称，为空name代替
   * @param data.imgType  screenshot参数，生成图片类型：jpeg，png
   * @param data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @param data.multiPage 是否分页截图，默认false
   * @param data.multiPageHeight 分页状态下页面高度，默认4000
   * @param data.setViewport 页面视窗大小和设备像素比 默认1920*1080、1
   * @param data.pageGotoParams 页面goto时的参数
   * @return {Promise<string|string[]>} - 分片返回数组，单页返回base64://
   */
  async render (name, data) {
    /** 渲染模板 并获取模板绝对路径 */
    let savePath = this.dealTpl(name, data)
    if (!savePath) return false
    data.savePath = path.resolve(savePath)
    data.cwd = process.cwd()
    data.host = this.host

    const res = await axios({
      method: 'post',
      url: this.url,
      data: { name, data },
      headers: { token: this.token },
      timeout: Cfg.Config.http_render.timeout * 1000 || 30000
    })
    return res.data.data
  }
}
