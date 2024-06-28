import fs from 'fs'
import chokidar from 'chokidar'
import template from 'art-template'
import { common, logger } from 'karin/utils'
import { KarinRender, KarinRenderType } from 'karin/types/render'

/**
 * 渲染器基类 所有渲染器都应该继承这个类
 */
export class RenderBase implements KarinRender {
  dir: './temp/html'
  html: {
    [key: string]: string
  }

  watcher: {
    [key: string]: chokidar.FSWatcher
  }

  constructor () {
    this.dir = './temp/html'
    this.html = {}
    this.watcher = {}
    common.mkdir(this.dir)
  }

  /**
   * 模板渲染
   * @param options 模板名称
   * @param isAbs 是否返回绝对路径
   */
  dealTpl (options: KarinRenderType, isAbs: boolean = true): string {
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
        return ''
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
   * @param tplFile 模板文件路径
   */
  watch (tplFile: string) {
    if (this.watcher[tplFile]) return

    const watcher = chokidar.watch(tplFile)
    watcher.on('change', () => {
      delete this.html[tplFile]
      logger.mark(`[修改html模板] ${tplFile}`)
    })

    this.watcher[tplFile] = watcher
  }

  /**
   * 渲染标准方法
   */
  async render (options: KarinRenderType): Promise<string | Array<string>> {
    logger.error('未实现渲染方法')
    return ''
  }
}
