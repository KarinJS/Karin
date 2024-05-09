import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import template from 'art-template'

/**
 * 渲染器基类 所有渲染器都应该继承这个类
 */
export default class RenderClass {
  constructor () {
    this.dir = './temp/html'
    this.html = {}
    this.watcher = {}
    this.createDir(this.dir)
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
  // eslint-disable-next-line no-unused-vars
  async render (name, data) {
    // ...方法实现
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
