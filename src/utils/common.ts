import fs from 'fs'
import path from 'path'
import Yaml from 'yaml'
import axios from 'axios'
import lodash from 'lodash'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { AxiosRequestConfig } from 'axios'
import { pipeline, Readable } from 'stream'
import { logger, segment, YamlEditor } from 'karin/utils'
import { dirName, fileName, KarinElement, NodeElement } from 'karin/types'

/**
 * 常用方法
 */
class Common {
  streamPipeline: (stream1: Readable, stream2: fs.WriteStream) => Promise<void>
  constructor () {
    this.streamPipeline = promisify(pipeline)
  }

  /**
   * 休眠函数
   * @param ms 毫秒
   */
  sleep (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 下载保存文件
   * @param  fileUrl 下载地址
   * @param  savePath 保存路径
   * @param param axios参数
   */
  async downFile (fileUrl: string, savePath: string, param: AxiosRequestConfig = {}) {
    try {
      this.mkdir(path.dirname(savePath))
      logger && logger.info(`[下载文件] ${fileUrl}`)
      const response = await axios.get(fileUrl, { ...param, responseType: 'stream' })
      await this.streamPipeline(response.data, fs.createWriteStream(savePath))
      return true
    } catch (err) {
      logger && logger.error(`下载文件错误：${err}`)
      return false
    }
  }

  /**
   * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
   * @param url 请求地址
   * @param type 请求类型
   * @param param axios参数
   */
  async axios (url: string, type: 'get' | 'post' = 'get', param: AxiosRequestConfig = {}): Promise<any | null> {
    try {
      if (type === 'post') return await axios.post(url, param.data, param)
      return await axios.get(url, param)
    } catch (error) {
      logger.debug(error)
      return null
    }
  }

  /**
   * 递归创建目录
   * @param dirname - 要创建的文件夹路径
   */
  mkdir (dirname: string): boolean {
    if (fs.existsSync(dirname)) return true
    /** 递归自调用 */
    if (this.mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
    return true
  }

  /**
   * 标准化文件路径
   * @param file - 相对路径
   * @param isDir - 返回绝对路径
   * @param isFile - 添加file://前缀
   * @returns 标准化后的路径
   */
  absPath (file: string, isDir = true, isFile = false): string {
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
   * @param path - 路径
   * @returns 返回true为文件夹
   */
  isDir (path: string): boolean {
    try {
      return fs.statSync(path).isDirectory()
    } catch {
      return false
    }
  }

  /**
   * 判断是否为插件包
   * @param path - 路径
   * @returns 返回true为插件包
   */
  isPlugin (path: string): boolean {
    return this.exists(`${path}/package.json`)
  }

  /**
   * 判断路径是否存在
   * @param path - 路径
   * @returns 返回true为存在
   */
  exists (path: string): boolean {
    try {
      return fs.existsSync(path)
    } catch {
      return false
    }
  }

  /**
   * - 解析json文件
   */
  readJson (file: string): any {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      logger.error('[common] 读取json文件错误：' + error)
      return null
    }
  }

  /**
   * - 写入json文件
   */
  writeJson (file: string, data: any): boolean {
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      logger.error('[common] 写入json文件错误：' + error)
      return false
    }
  }

  /**
   * - 解析yaml文件
   */
  readYaml (file: string): any {
    try {
      return Yaml.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      logger.error('[common] 读取yaml文件错误：' + error)
      return null
    }
  }

  /**
   * - 写入yaml文件
   */
  writeYaml (file: string, data: any): boolean {
    try {
      fs.writeFileSync(file, Yaml.stringify(data))
      return true
    } catch (error) {
      logger.error('[common] 写入yaml文件错误：' + error)
      return false
    }
  }

  /**
   * 根据文件后缀名从指定路径下读取符合要求的文件
   * @param path - 路径
   * @param ext - 后缀名、或后缀名列表
   * @example common.readDir('./plugins', '.js')
   * @example common.readDir('./plugins', ['.js', '.ts'])
   */
  readDir (_path: string, ext: string | string[]): string[] | null {
    if (!this.isDir(_path)) return null
    const files = fs.readdirSync(_path, { withFileTypes: true })
    const list: string[] = []
    if (!Array.isArray(ext)) ext = [ext]
    // 排除文件夹 和不符合后缀名的文件
    files.forEach(v => {
      if (v.isDirectory()) return
      if (ext.includes(path.extname(v.name))) list.push(v.name)
    })
    return list
  }

  /**
   * 根据传入的 import.meta.url 计算相对于项目根目录的路径，返回需要的 '../' 层级。
   * @param url - import.meta.url
   * @returns 相对路径的层级数量，用 '../' 表示
   * @example
   * // 在 plugins/karin-plugin-example/index.ts 中使用
   * common.urlToPath(import.meta.url) // 返回 '../../'
   */
  urlToPath (url: string): string {
    /** 当前文件的绝对路径 */
    const filePath = fileURLToPath(url)
    /** 当前文件所在目录的绝对路径 */
    const dirPath = path.dirname(filePath)
    /** 项目根目录 */
    const rootPath = process.cwd()
    /** 当前文件到项目根目录的相对路径 */
    const relativePath = path.relative(dirPath, rootPath)
    /** 相对路径的层级数量 */
    const upLevelsCount = relativePath.split(path.sep).length
    /** 返回构建的路径 */
    const upPath = lodash.repeat('../', upLevelsCount)
    return upPath
  }

  /**
   * 传入相对路径 分割为两部分 1为文件夹路径 2为文件名 文件夹路径无前缀开头
   * @param _path - 路径
   */
  splitPath (_path: string): { dir: string; pop: string } {
    const list = _path.replace(/\\/g, '/').split('/')
    if (list[0] === '.') list.shift()
    const pop = list.pop() || ''
    const dir = path.join(...list)
    return { dir, pop }
  }

  /**
   * 将文件转换为不带前缀的base64字符串
   * @param file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param - 附加数据
   * @param - 为true时，http地址会直接返回，否则会下载文件并转换为base64字符串
   * @returns 返回base64字符串
   */
  async base64 (file: any, options = { http: false }): Promise<string> {
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
  stream (stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', error => reject(error))
    })
  }

  /**
   * 将文件转换为Buffer对象
   * @param file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param options - 选项
   * @returns - 返回Buffer对象
   */
  async buffer (file: any, options = { http: false }): Promise<Buffer | Error | string> {
    if (typeof file !== 'string') {
      if (Buffer.isBuffer(file)) return file
      if (file instanceof Readable) return this.stream(file)
      throw new Error('未知文件类型：' + file)
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
   * @param elements - 消息内容
   */
  makeMessage (elements: string | KarinElement | (string | KarinElement)[]): Array<KarinElement> {
    /** 将msg格式化为数组 */
    if (!Array.isArray(elements)) elements = [elements]
    const message: Array<KarinElement> = []
    elements.forEach(v => {
      if (typeof v === 'string') {
        message.push(segment.text(v))
      } else {
        message.push(v)
      }
    })
    return message
  }

  /**
   * 制作简单转发，返回segment.node[]。仅简单包装node，也可以自己组装
   * @param elements
   * @param fakeUin 转发用户的QQ号 必填
   * @param fakeNick 转发用户显示的昵称 必填
   */
  makeForward (elements: KarinElement | KarinElement[], fakeUin: string, fakeNick: string): Array<NodeElement> {
    if (!Array.isArray(elements)) elements = [elements]
    return elements.map(element => {
      const NodeElement = this.makeMessage(element)
      return segment.node(fakeUin, fakeNick, NodeElement)
    })
  }

  /**
   * 获取git插件列表
   * @param isPack - 是否屏蔽不带package.json的插件，默认为false
   */
  getPlugins (isPack = false): Array<dirName> {
    const dir = this.absPath('./plugins', false)
    let list = fs.readdirSync(dir, { withFileTypes: true })
    /** 忽略非文件夹、非 karin-plugin-开头的文件夹 */
    list = list.filter(v => v.isDirectory() && v.name.startsWith('karin-plugin-'))
    if (isPack) list = list.filter(v => fs.existsSync(`${dir}/${v.name}/package.json`))
    const arr: dirName[] = []
    list.map(v => arr.push(v.name as dirName))
    return arr
  }

  /**
   * 获取npm插件列表
   * @param showDetails - 是否返回详细信息，默认为false
   * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
   */
  async getNpmPlugins<T extends boolean> (showDetails: T): Promise<T extends true ? { dir: string; name: fileName, isMain: boolean }[] : string[]> {
    /** 屏蔽的依赖包列表 */
    const pkgdependencies = [
      '@grpc/grpc-js',
      '@grpc/proto-loader',
      'art-template',
      'axios',
      'chalk',
      'chokidar',
      'express',
      'kritor-proto',
      'level',
      'lodash',
      'log4js',
      'moment',
      'node-karin',
      'node-schedule',
      'redis',
      'ws',
      'yaml',
    ]
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    const dependencies = Object.keys(pkg.dependencies).filter((name) => !pkgdependencies.includes(name))

    if (!showDetails) {
      const list: string[] = []
      // 检查pkg是否存在karin字段
      const readPackageJson = async (name: string) => {
        try {
          const pkgPath = path.join(process.cwd(), 'node_modules', name, 'package.json')
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
          if (pkg?.karin) list.push(name)
        } catch { }
      }

      await Promise.all(dependencies.map(readPackageJson))
      return list as T extends true ? { dir: dirName; name: fileName, isMain: boolean }[] : string[]
    } else {
      const list: { dir: dirName; name: string, isMain: boolean }[] = []

      const readPackageJson = async (files: string) => {
        try {
          const pkgPath = path.join(process.cwd(), 'node_modules', files, 'package.json')
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
          if (pkg?.karin) {
            if (pkg?.main) {
              const dir = `${files}/${path.dirname(pkg.main).replace(/\.\//, '')}`
              list.push({ dir, name: path.basename(pkg.main), isMain: true })
            }

            if (pkg?.karin?.apps?.length) {
              pkg.karin.apps.forEach((app: string) => {
                fs.readdirSync(`./node_modules/${files}/${app}`).forEach((filename: string) => {
                  /** 忽略非js */
                  if (!filename.endsWith('.js')) return
                  const dir = `${files}/${app}`
                  list.push({ dir, name: filename, isMain: false })
                })
              })
            }
          }
        } catch { }
      }

      await Promise.all(dependencies.map(readPackageJson))
      return list as T extends true ? { dir: dirName; name: fileName, isMain: boolean }[] : string[]
    }
  }

  /**
   * 获取运行时间
   */
  uptime (): string {
    const time = process.uptime()
    const day = Math.floor(time / 86400)
    const hour = Math.floor((time % 86400) / 3600)
    const min = Math.floor((time % 3600) / 60)
    const sec = Math.floor(time % 60)

    const parts = [day ? `${day}天` : '', hour ? `${hour}小时` : '', min ? `${min}分钟` : '', !day && sec ? `${sec}秒` : '']

    return parts.filter(Boolean).join('')
  }

  /**
   * 构建消息体日志
   * @param - 消息体
   */
  makeMessageLog (message: Array<KarinElement>) {
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
        case 'poke':
          logs.push(`[poke:${val.id}]`)
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
          logs.push(`[forward:${val.res_id}]`)
          break
        case 'xml':
          logs.push(`[xml:${val.data}]`)
          break
        case 'json':
          logs.push(`[json:${val.data}]`)
          break
        case 'markdown': {
          logs.push(`[markdown:${val.content}]`)
          break
        }
        case 'markdown_tpl': {
          const params = val.params
          if (!params) break
          const content: {
            [key: string]: string
          } = { id: val.custom_template_id }
          for (const v of params) content[v.key] = v.values[0]
          logs.push(`[markdown_tpl:${JSON.stringify(content)}]`)
          break
        }
        case 'rows': {
          const rows = []
          for (const v of val.rows) rows.push(JSON.stringify(v.data))
          logs.push(`[rows:${JSON.stringify(rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button:${JSON.stringify(val.data)}]`)
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

  /**
   * 更新yaml文件
   * @param filePath - 文件路径
   * @param settings - 设置项
   */
  updateYaml (filePath: string, settings: {
    /** 键路径 */
    key: string,
    /** 要写入的 */
    val: any,
    /** 需要写入的注释 */
    comment: string
  }[]) {
    let yaml = new YamlEditor(filePath)

    /** 先添加内容 */
    settings.forEach(({ key, val }) => {
      try {
        if (!yaml.has(key)) yaml.set(key, val)
      } catch (error: any) {
        logger.error(`[common] 更新yaml文件时出错：${error.stack || error.message || error}`)
      }
    })
    /** 先保存 */
    yaml.save()

    /** 重新解析 再次写入注释 直接写入注释会报错 写入的不是node节点模式 */
    yaml = new YamlEditor(filePath)
    settings.forEach(({ key, comment }) => {
      try {
        yaml.comment(key, comment, true)
      } catch (error: any) {
        logger.error(`[common] 更新yaml文件时出错：${error.stack || error.message || error}`)
      }
    })
    yaml.save()
  }
}

/**
 * 常用方法
 */
export const common = new Common()
