import fs from 'fs'
import { common } from '#Karin'
import chokidar from 'chokidar'
import template from 'art-template'

/**
 * 渲染器基类 所有渲染器都应该继承这个类
 */
export default class RenderBase {
  /**
   * @type {RenderFunction}
   */
  RenderFunction
  constructor () {
    this.dir = './temp/html'
    this.html = {}
    this.watcher = {}
    common.mkdir(this.dir)
  }

  /**
   * 模板渲染
   * @param {options} options 模板名称
   * @param {boolean} isAbs 是否返回绝对路径
   * @return {string} 渲染完成的文件路径
   */
  dealTpl (options, isAbs = true) {
    let { name, fileID, file: tplFile } = options
    fileID = fileID || name
    const filePath = `./temp/html/${name}/${fileID}.html`

    /** 读取html模板 */
    if (!this.html[tplFile]) {
      common.mkdir(`./temp/html/${name}`)

      try {
        this.html[tplFile] = fs.readFileSync(tplFile, 'utf8')
      } catch (error) {
        logger.error(`加载html错误：${tplFile}`)
        return false
      }

      this.watch(tplFile)
    }

    /** 替换模板 */
    const tmpHtml = template.render(this.html[tplFile], options.data)

    /** 保存模板 */
    fs.writeFileSync(filePath, tmpHtml)

    logger.debug(`[图片生成][使用模板] ${filePath}`)

    /** 是否返回绝对路径 */
    if (isAbs) return `${process.cwd()}/temp/html/${name}/${fileID}.html`

    return filePath
  }

  /**
   * 监听模板文件
   * @param {string} tplFile 模板文件路径
   */
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

/**
 * @typedef {function(options): Promise<string|string[]>} RenderFunction
 * @returns {string|string[]} 返回图片base64或数组
 */

/**
 * @typedef {object} options 渲染参数
 * @property {string} options.file http地址或本地文件路径
 * @property {string} [options.name] 模板名称
 * @property {string} [options.fileID] art-template后的文件名
 * @property {object} [options.data] 传递给模板的数据 template.render(data)
 * @property {'png'|'jpeg'|'webp'} [options.type] 截图类型 默认'webp'
 * @property {number} [options.quality] 截图质量 默认90 1-100
 * @property {boolean} options.omitBackground 是否隐藏背景 默认false
 * @property {object} [options.setViewport] 设置视窗大小和设备像素比 默认1920*1080、1
 * @property {number} [options.setViewport.width] 视窗宽度
 * @property {number} [options.setViewport.height] 视窗高度
 * @property {string} [options.setViewport.deviceScaleFactor] 设备像素比
 * @property {number|boolean} [options.multiPage] 分页截图 传递数字则视为视窗高度 返回数组
 * @property {object} [options.pageGotoParams] 页面goto时的参数
 * @property {number} [options.pageGotoParams.timeout] 页面加载超时时间
 * @property {'load'|'domcontentloaded'|'networkidle0'|'networkidle2'} [options.pageGotoParams.waitUntil] 页面加载状态
 */
