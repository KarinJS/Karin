import fs from 'node:fs'
import lodash from 'lodash'
import puppeteer from 'puppeteer'
import Renderer from './Renderer.js'
import { logger, redis, common, Cfg, segment } from '#Karin'

class Puppeteer extends Renderer {
  constructor () {
    super({
      id: 'puppeteer',
      type: 'image',
      render: 'screenshot'
    })
    /** chromium实例 */
    this.chromium = false
    /** 当前是否正在初始化 */
    this.init = false
    /** 创建页面次数 */
    this.createPageCount = 0
    /** 图片生成次数 */
    this.renderNum = 0
  }

  /** 初始化chromium */
  async browserInit () {
    if (this.chromium) return this.chromium
    const key = Cfg.puppeteer.redisKey
    /** 先从缓存中拿 */
    const list = await redis.keys(key + '*')
    for (let item of list) {
      /** 先查redis中是否存在 */
      const chromiumRedis = await redis.get(item)
      if (chromiumRedis) {
        const chromium = await this.connect(chromiumRedis, item)
        if (chromium) {
          this.chromium = chromium
          return this.chromium
        }
      } else {
        await redis.del(item)
      }
    }

    /** 检查开发者是否传入websocket */
    if (Cfg.puppeteer.puppeteerWS) {
      const chromium = await this.connect(Cfg.puppeteer.puppeteerWS)
      if (chromium) {
        this.chromium = chromium
        return this.chromium
      }
    }

    /** puppeteer配置 */
    const { headless, args } = Cfg.puppeteer
    const config = { headless, args }

    /** 检查开发者是否传入自定义chromium地址 */
    if (Cfg.puppeteer.chromiumPath) {
      /** 使用fs检查 */
      if (fs.existsSync(Cfg.puppeteer.chromiumPath)) {
        /** 自定义路径 */
        config.executablePath = Cfg.puppeteer.chromiumPath
      } else {
        logger.error('puppeteer Chromium 自定义地址不存在：', Cfg.puppeteer.chromiumPath)
      }
    }

    logger.info('puppeteer Chromium 启动中...')

    /** 如果没有实例，初始化puppeteer chromium */
    try {
      const chromium = await puppeteer.launch(config)
      logger.info('puppeteer Chromium 启动成功')
      logger.info(`[Chromium] ${chromium.wsEndpoint()}`)
      /** redis缓存 */
      await redis.set(key + Date.now(), chromium.wsEndpoint())
      this.chromium = chromium
      /** 监听Chromium事件 */
      this.listen()
      return this.chromium
    } catch (error) {
      let errMsg = error.toString() + (error.stack ? error.stack.toString() : '')

      if (errMsg.includes('Could not find Chromium')) {
        logger.error('没有正确安装 Chromium，可以尝试执行安装命令：node node_modules/puppeteer/install.js')
      } else if (errMsg.includes('cannot open shared object file')) {
        logger.error('没有正确安装 Chromium 运行库')
      }

      logger.error(errMsg)
      return false
    }
  }

  /** 传入websocket，连接已有的chromium */
  async connect (browserWSEndpoint, redisKey) {
    try {
      logger.info(`puppeteer Chromium from ${browserWSEndpoint}`)
      const chromium = await puppeteer.connect({ browserWSEndpoint })
      logger.info('puppeteer Chromium 已连接启动的实例：', browserWSEndpoint)
      return chromium
    } catch {
      if (redisKey) redis.del(redisKey)
      return false
    }
  }

  /** 监听Chromium事件 */
  listen () {
    this.chromium.on('disconnected', () => {
      logger.error('Chromium 实例崩溃！')
      this.close()
    })

    /** 监听Chromium关闭 */
    this.chromium.on('close', () => {
      logger.error('Chromium 实例关闭！')
      this.close()
    })

    /** 监听Chromium错误 */
    this.chromium.on('error', (error) => {
      logger.error('Chromium 实例错误！', error)
    })
  }

  /** 关闭浏览器 */
  async close () {
    if (this.chromium) {
      await this.chromium.close()
      logger.info('Chromium 实例已关闭！')
      this.chromium = false
    }
  }

  /** 重启浏览器 */
  async restart (normal) {
    if (!this.init) {
      this.init = true
      if (normal) logger.mark('页面创建数量达到上限，5秒后将重启浏览器...')
      await common.sleep(5000)
      await this.close()
      await this.browserInit()
      this.init = false
      return true
    }
    await this.isInit()
  }

  /** 检查初始化 */
  async isInit () {
    /** 未初始化 进行初始化 */
    if (!this.init) {
      this.init = true
      await this.browserInit()
      this.init = false
      return true
    }

    /** 初始化中 */
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.chromium) {
          clearInterval(timer)
          resolve(true)
        }
      }, 500)
    })
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
   * @return img 不做segment包裹
   */
  async screenshot (name, data = {}) {
    /** 初始化 */
    if (!this.chromium) await this.isInit()

    /** 页面创建数量到达上限 重启浏览器 */
    if (this.createPageCount >= 100) await this.restart(true)

    /** 打开页面数+1 */
    this.createPageCount++

    /** 分页状态下页面高度，默认4000 */
    const pageHeight = data.multiPageHeight || 4000

    /** html模板路径 */
    let savePath = this.dealTpl(name, data)
    if (!savePath) return false

    /** 截图数据 */
    let buff = ''
    /** 开始时间 */
    let start = Date.now()

    /** 截图返回值 */
    let ret = []

    try {
      /** 创建页面 */
      const page = await this.chromium.newPage()
      /** 页面goto时的参数 */
      let pageGotoParams = lodash.extend({ timeout: Cfg.puppeteer.timeout }, data.pageGotoParams || {})
      /** 加载html */
      await page.goto(`file://${process.cwd()}${lodash.trim(savePath, '.')}`, pageGotoParams)
      /** 获取页面元素 */
      let body = await page.$('#container') || await page.$('body')
      /** 计算页面高度 */
      const boundingBox = await body.boundingBox()
      /** 默认分页数 */
      let num = 1
      /** 截图参数 */
      let randData = {
        type: data.imgType || 'jpeg',
        omitBackground: data.omitBackground || false,
        quality: data.quality || 90,
        path: data.path || ''
      }

      /** 分页截图 */
      if (data.multiPage) {
        randData.type = 'jpeg'
        num = Math.round(boundingBox.height / pageHeight) || 1
      }

      if (data.imgType === 'png') {
        delete randData.quality
      }

      if (!data.multiPage) {
        buff = await body.screenshot(randData)
        /** 计算图片大小 */
        const kb = (buff.length / 1024).toFixed(2) + 'KB'
        /** 次数+1 */
        this.renderNum++
        logger.mark(`[图片生成][${name}][${this.renderNum}次] ${kb} ${logger.green(`${Date.now() - start}ms`)}`)
        ret.push(buff)
      } else {
        /** 分页截图 */
        if (num > 1) {
          await page.setViewport({
            width: boundingBox.width,
            height: pageHeight + 100
          })
        }

        for (let i = 1; i <= num; i++) {
          if (i !== 1 && i === num) {
            await page.setViewport({
              width: boundingBox.width,
              height: parseInt(boundingBox.height) - pageHeight * (num - 1)
            })
          }
          if (i !== 1 && i <= num) {
            await page.evaluate(pageHeight => window.scrollBy(0, pageHeight), pageHeight)
          }
          /** 截图 */
          buff = num === 1 ? await body.screenshot(randData) : buff = await page.screenshot(randData)
          if (num > 2) await common.sleep(200)

          /** 计算图片大小 */
          const kb = (buff.length / 1024).toFixed(2) + 'KB'
          /** 次数+1 */
          this.renderNum++
          logger.mark(`[图片生成][${name}][${i}/${num}] ${kb}`)
          ret.push(buff)
        }
        if (num > 1) {
          logger.mark(`[图片生成][${name}] 处理完成`)
        }
      }
      /** 关闭页面 */
      page.close().catch((err) => logger.error(err))
    } catch (error) {
      logger.error(`[图片生成][${name}] 图片生成失败：${error}`)
      /** 关闭浏览器 */
      if (this.chromium) await this.restart()
      ret = []
      return false
    }

    if (ret.length === 0 || !ret[0]) {
      logger.error(`[图片生成][${name}] 图片生成为空`)
      return false
    }

    return data.multiPage ? ret : ret[0]
  }
}

let chromium = new Puppeteer()
logger.info(`渲染后端：${chromium.id} 加载完成...`)
const renderer = {
  /**
   * 截图
   * @param {string} name - 模板名称
   * @param {object} data - 模板参数
   * @returns {Promise<object>} - 截图数据
   */
  screenshot: async (name, data) => {
    let img = await chromium.screenshot(name, data)
    return img ? segment.image(img) : img
  },
  /**
   * 分页截图
   * @param {string} name - 模板名称
   * @param {object} data - 模板参数
   * @returns {Promise<Array>|Promise<false>} - 截图数据
   */
  screenshots: async (name, data) => {
    data.multiPage = true
    let imgs = await chromium.screenshot(name, data) || []
    let ret = []
    for (let img of imgs) {
      ret.push(img ? segment.image(img) : img)
    }
    return ret.length > 0 ? ret : false
  }
}

export default renderer
