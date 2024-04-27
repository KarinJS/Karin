import { randomUUID } from 'crypto'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import template from 'art-template'
import { logger, Renderer, Bot } from '#Karin'

class Puppeteer {
  constructor (socket, request) {
    this.socket = socket
    this.request = request
    this.dir = './temp/html'
    this.html = {}
    this.watcher = {}
    this.createDir(this.dir)
    this.#start()
  }

  async #start () {
    this.id = this.request.headers['renderer-id']
    this.type = this.request.headers['renderer-type']

    /** 注册渲染器 */
    this.host = this.request.headers.host
    this.url = `ws://${this.host + this.request.url}`

    logger.info(`[渲染器:${this.id}] 收到新的连接请求：${this.url}`)
    /** 监听上报事件 */
    this.socket.on('message', data => {
      data = JSON.parse(data)
      if (data.echo) {
        Bot.emit(data.echo, data)
      } else {
        logger.warn(`[渲染器:${this.id}] 收到未知数据：`, data)
      }
    })

    /** 监听断开 */
    this.socket.on('close', () => {
      logger.warn(`[渲染器:${this.id}] 连接断开：${this.url}`)
      /** 卸载渲染器 */
      Renderer.unapp(this.id)
    })

    /** 注册渲染器 */
    try {
      Renderer.app({
        id: this.id,
        type: this.type,
        render: this.render.bind(this)
      })
    } catch (error) {
      logger.error(`[渲染器:${this.id}] 注册渲染器失败：`, error)
      /** 断开连接 */
      this.socket.close()
    }
  }

  /**
   * `chromium` 截图
   * @param name 模板名称
   * @param data 模板参数
   * @param data.tplFile 模板路径，必传
   * @param data.saveId  生成html名称，为空name代替
   * @param data.imgType  screenshot参数，生成图片类型：jpeg，png
   * @param data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @param data.multiPage 是否分页截图，默认false
   * @param data.multiPageHeight 分页状态下页面高度，默认4000
   * @param data.pageGotoParams 页面goto时的参数
   * @return {<Promise{string|string[]}>} - 分片返回数组，单页返回base64://
   */
  async render (name, data = {}) {
    /** 渲染模板 并获取模板绝对路径 */
    let savePath = this.dealTpl(name, data)
    if (!savePath) return false
    data.savePath = path.resolve(savePath)

    const echo = randomUUID()
    this.socket.send(JSON.stringify({ echo, name, data }))

    return new Promise((resolve, reject) => {
      Bot.once(echo, data => {
        if (data.ok) return resolve(data.data)
        reject(new Error(data.data))
      })
    })
  }

  /** 创建文件夹 */
  createDir (dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.createDir(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }

  /** 模板 */
  dealTpl (name, data) {
    let { tplFile, saveId = name } = data
    let savePath = `./temp/html/${name}/${saveId}.html`

    /** 读取html模板 */
    if (!this.html[tplFile]) {
      this.createDir(`./temp/html/${name}`)

      try {
        this.html[tplFile] = fs.readFileSync(tplFile, 'utf8')
      } catch (error) {
        logger.error(`加载html错误：${tplFile}`)
        return false
      }

      this.watch(tplFile)
    }

    data.resPath = './resources/'

    /** 替换模板 */
    let tmpHtml = template.render(this.html[tplFile], data)

    /** 保存模板 */
    fs.writeFileSync(savePath, tmpHtml)

    logger.debug(`[图片生成][使用模板] ${savePath}`)

    return savePath
  }

  /** 监听配置文件 */
  watch (tplFile) {
    if (this.watcher[tplFile]) return

    const watcher = chokidar.watch(tplFile)
    watcher.on('change', () => {
      delete this.html[tplFile]
      logger.mark(`[修改html模板] ${tplFile}`)
    })

    this.watcher[tplFile] = watcher
  }
}

export default { url: '/puppeteer', adapter: Puppeteer }
