import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { promisify } from 'util'
import { pipeline, Readable } from 'stream'

/**
 * 常用方法
 */
export default class Common {
  /**
   * 日志模块
   * @type {import('../index.js').logger}
   */
  #logger
  /**
   * 日志模块
   * @type {import('../index.js').segment}
   */
  #segment

  /**
   * 常用方法
   * @param {import('../index.js').logger} logger - 日志模块
   * @param {import('../index.js').segment} segment - 消息体模块
   */
  constructor (logger, segment) {
    this.#logger = logger
    this.#segment = segment
    this.streamPipeline = promisify(pipeline)
  }

  /**
   * 休眠函数
   * @param ms 毫秒
   */
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * 下载保存文件
   * @param {string} fileUrl 下载地址
   * @param {string} savePath 保存路径
   * @param {import('axios').AxiosRequestConfig} [param] axios参数
   */
  async downFile (fileUrl, savePath, param = {}) {
    try {
      this.mkdir(path.dirname(savePath))
      this.#logger && this.#logger.debug(`[下载文件] ${fileUrl}`)
      const response = await axios.get(fileUrl, { ...param, responseType: 'stream' })
      await this.streamPipeline(response.data, fs.createWriteStream(savePath))
      return true
    } catch (err) {
      this.#logger && this.#logger.error(`下载文件错误：${err}`)
      return false
    }
  }

  /**
   * 递归创建目录
   * @param {string} dirname - 要创建的文件夹路径
   */
  mkdir (dirname) {
    if (fs.existsSync(dirname)) return true
    /** 递归自调用 */
    if (this.mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
    return true
  }

  /**
   * 标准化文件路径
   * @param {string} file - 相对路径
   * @param {boolean} [isDir] - 返回绝对路径
   * @param {boolean} [isFile] - 添加file://前缀
   * @returns {string} - 标准化后的路径
   */
  absPath (file, isDir = true, isFile = false) {
    file = file.replace(/\\/g, '/')
    if (file.startsWith('file://')) {
      /** linux */
      if (path.sep === '/') {
        file = file.replace('file://', '')
      } else {
        /** windows */
        file = file.replace(/^file:[/]{2,3}/g, '')
      }
    }

    file = path.normalize(file)

    /** 判断路径是否为绝对路径 否则转为绝对路径 */
    if (isDir && !path.isAbsolute(file)) {
      file = path.resolve(file)
    }
    if (isFile) file = 'file://' + file
    file = file.replace(/\\/g, '/')
    return file
  }

  /**
   * 判断是否为文件夹
   * @param {string} path - 路径
   * @returns {boolean} - 返回true为文件夹
   */
  isDir (path) {
    try {
      return fs.statSync(path).isDirectory()
    } catch {
      return false
    }
  }

  /**
   * 判断路径是否存在
   * @param {string} path - 路径
   * @returns {boolean} - 返回true为存在
   */
  exists (path) {
    try {
      return fs.existsSync(path)
    } catch {
      return false
    }
  }

  /**
   * 将文件转换为不带前缀的base64字符串
   * @param {string|Buffer|http|stream.Readable} file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param {object} options - 附加数据
   * @param {boolean} options.http - 为true时，http地址会直接返回，否则会下载文件并转换为base64字符串
   * @returns {Promise<string>} - 返回base64字符串
   */
  async base64 (file, options = { http: false }) {
    /** 先判断是否非字符串情况 */
    if (typeof file !== 'string') {
      /** buffer */
      if (Buffer.isBuffer(file)) {
        return file.toString('base64')
      }
      /** 可读流 */
      if (file instanceof Readable) {
        const data_1 = await this.stream(file)
        return data_1.toString('base64')
      }
      /** 未知类型 */
      throw new Error('未知类型')
    }

    /** base64:// */
    if (file.startsWith('base64://')) {
      return file.replace('base64://', '')
    }

    /** url */
    if (file.startsWith('http://') || file.startsWith('https://')) {
      if (options.http) return file
      const response = await axios.get(file, { responseType: 'arraybuffer' })
      return Buffer.from(response.data, 'binary').toString('base64')
    }

    /** file:/// */
    if (fs.existsSync(file.replace(/^file:\/\/\//, ''))) {
      file = file.replace(/^file:\/\/\//, '')
      return fs.readFileSync(file).toString('base64')
    }

    /** file:// */
    if (fs.existsSync(file.replace(/^file:\/\//, ''))) {
      file = file.replace(/^file:\/\//, '')
      return fs.readFileSync(file).toString('base64')
    }

    /** 无前缀base64:// */
    const buffer = Buffer.from(file, 'base64').toString('base64') === file
    if (buffer) return file

    throw new Error('未知类型')
  }

  /**
   * 将数据流对象转换为Buffer对象
   * @param {stream.Readable} stream - 要转换的数据流对象
   * @returns {Promise<Buffer>} - 返回Buffer
   */
  stream (stream) {
    return new Promise((resolve, reject) => {
      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', (error) => reject(error))
    })
  }

  /**
   * 将文件转换为Buffer对象
   * @param {string|Buffer|http|stream.Readable} file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param {object} options - 附加数据
   * @param {boolean} options.http - 为true时，http地址会直接返回，否则会下载文件并转换为Buffer对象
   * @returns {Promise<Buffer>} - 返回Buffer对象
   */
  async buffer (file, options = { http: false }) {
    if (typeof file !== 'string') {
      if (Buffer.isBuffer(file)) return file
      if (file instanceof Readable) return this.stream(file)
      throw new Error('未知文件类型：', file)
    }

    if (file.startsWith('base64://')) return Buffer.from(file.replace('base64://', ''), 'base64')

    if (file.startsWith('http://') || file.startsWith('https://')) {
      if (options.http) return file
      const response = await axios.get(file, { responseType: 'arraybuffer' })
      return Buffer.from(response.data)
    }

    /** file:/// */
    if (fs.existsSync(file.replace(/^file:\/\/\//, ''))) {
      file = file.replace(/^file:\/\/\//, '')
      return fs.readFileSync(file)
    }

    /** file:// */
    if (fs.existsSync(file.replace(/^file:\/\//, ''))) {
      file = file.replace(/^file:\/\//, '')
      return fs.readFileSync(file)
    }

    /** 无前缀base64:// */
    const buffer = Buffer.from(file, 'base64')
    if (buffer.toString('base64') === file) return buffer

    throw new Error('未知类型')
  }

  /**
   * 标准化发送的消息内容
   * @param {string|import('../bot/KarinElement.js').KarinElement|import('../bot/KarinElement.js').KarinElement[]} elements - 消息内容
   * @returns {import('../bot/KarinElement.js').KarinElement[]} - 返回标准化处理后的消息内容
   */
  makeMessage (elements) {
    /** 将msg格式化为数组 */
    if (!Array.isArray(elements)) elements = [elements]
    elements = elements.map(element => {
      /** 对字符串进行标准化处理 */
      if (typeof element === 'string') element = this.#segment.text(element)
      return element
    })
    return elements
  }

  /**
   * 制作简单转发，返回segment.node[]。仅简单包装node，也可以自己组装
   * @param {Array<{object}> | object} elements
   * @param fakeUin 用户id
   * @param fakeNick 用户昵称
   * @return {Array<KarinNodeElement>}
   */
  makeForward (elements, fakeUin = '', fakeNick = '') {
    if (!Array.isArray(elements)) {
      elements = [elements]
    }
    return elements.map((element) => {
      element = this.makeMessage(element)
      return this.#segment.node(fakeUin, fakeNick, element)
    })
  }

  /**
   * 获取所有插件列表
   * @param {boolean} [isDir] - 返回绝对路径
   * @param {boolean} [isPack] - 屏蔽不带package.json的插件
   * @returns {Array<getPlugins>} - 返回插件列表
   */
  getPlugins (isDir = false, isPack = false) {
    const dir = this.absPath('./plugins', isDir)
    let list = fs.readdirSync(dir, { withFileTypes: true })
    // 忽略非文件夹、非 karin-plugin-、karin-adapter- 开头的文件夹
    list = list.filter(v => v.isDirectory() && (v.name.startsWith('karin-plugin-') || v.name.startsWith('karin-adapter-')))
    if (isPack) list = list.filter(v => fs.existsSync(`${dir}/${v.name}/package.json`))

    return list
  }

  /**
   * 获取运行时间
   * @returns {string} - 返回运行时间
   */
  uptime () {
    const time = process.uptime()
    const day = Math.floor(time / 86400)
    const hour = Math.floor((time % 86400) / 3600)
    const min = Math.floor((time % 3600) / 60)
    const sec = Math.floor(time % 60)

    const parts = [
      day ? `${day}天` : '',
      hour ? `${hour}小时` : '',
      min ? `${min}分钟` : '',
      (!day && sec) ? `${sec}秒` : '',
    ]

    return parts.filter(Boolean).join('')
  }

  /**
   * 构建消息体日志
   * @param {import('../bot/KarinElement.js').KarinElement[]} message - 消息体
   * @returns {string} - 返回标准化处理后的日志
   */
  makeMessageLog (message) {
    const logs = []
    for (const val of message) {
      switch (val.type) {
        case 'text':
          logs.push(val.text)
          break
        case 'face':
          logs.push(`[face:${val.id}]`)
          break
        case 'video':
        case 'image':
        case 'voice':
        case 'record':
        case 'file': {
          let file
          if (Buffer.isBuffer(val.file)) {
            file = 'Buffer://...'
          } else if (/^http|^file/.test(val.file)) {
            file = val.file
          } else {
            file = 'base64://...'
          }
          logs.push(`[${val.type}:${file}]`)
          break
        }
        case 'at':
          logs.push(`[at:${val.uid}]`)
          break
        case 'rps':
          logs.push(`[rps:${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice:${val.id}]`)
          break
        case 'shake':
          logs.push('[shake:窗口抖动]')
          break
        case 'poke':
          logs.push(`[poke:${val.id}]`)
          break
        case 'anonymous':
          logs.push(`[anonymous:${val.ignore}]`)
          break
        case 'share':
          logs.push(`[share:${JSON.stringify(val)}]`)
          break
        case 'contact':
          logs.push(`[contact:${JSON.stringify(val)}]`)
          break
        case 'location':
          logs.push(`[location:${JSON.stringify(val)}]`)
          break
        case 'music':
          logs.push(`[music:${JSON.stringify(val)}]`)
          break
        case 'reply':
          logs.push(`[reply:${val.message_id}]`)
          break
        case 'forward':
          logs.push(`[forward:${val.id}]`)
          break
        case 'node':
          logs.push(`[node:${JSON.stringify(val)}]`)
          break
        case 'xml':
          logs.push(`[xml:${val.data}]`)
          break
        case 'json':
          logs.push(`[json:${val.data}]`)
          break
        case 'markdown': {
          if (val.content) {
            logs.push(`[markdown:${val.content}]`)
          } else {
            const content = { id: val.custom_template_id }
            for (const v of val.params) content[v.key] = v.values[0]
            logs.push(`[markdown:${JSON.stringify(content)}]`)
          }
          break
        }
        case 'rows': {
          const rows = []
          for (const v of val.rows) rows.push(v.log)
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${val.log}]`)
          break
        case 'long_msg':
          logs.push(`[long_msg:${val.id}]`)
          break
        default:
          logs.push(`[未知:${JSON.stringify(val)}]`)
      }
    }
    return logs.join('')
  }
}

/**
 * @typedef {object} getPlugins 插件列表
 * @property {string} getPlugins.dir 插件目录
 * @property {string} getPlugins.name 插件名称
 */
