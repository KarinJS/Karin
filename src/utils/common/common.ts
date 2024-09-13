import fs from 'fs'
import path from 'path'
import Yaml from 'yaml'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import lodash from 'lodash'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { pipeline, Readable } from 'stream'
import { logger, segment, YamlEditor } from 'karin/utils'
import { ButtonElement, ButtonType, dirName, KarinElement, NodeElement, KeyBoardElement } from 'karin/types'
import os from 'os'
import { readJson } from 'karin/api/readJson'
import { getNpmPlugins } from 'karin/api/npm'
import { getGitPlugins } from 'karin/api/git'
export interface NpmInfo {
  plugin: string,
  path: string,
  file: string,
  isMain: boolean
}

/**
 * 常用方法
 */
export class Common {
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
      logger.info(`[下载文件] ${fileUrl}`)
      const response = await axios.get(fileUrl, { ...param, responseType: 'stream' })
      await this.streamPipeline(response.data, fs.createWriteStream(savePath))
      return true
    } catch (err) {
      if (err instanceof AxiosError) { logger.error(`下载文件错误：${err.stack}`) } else { logger.error(`下载文件错误：${err}`) }
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
      error instanceof AxiosError ? logger.debug(error.stack) : logger.debug(error)
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
   * 去掉相对路径的前缀和后缀
   * @param root - 相对路径路径
   */
  getRelPath (root: string): string {
    return root.replace(/\\+/g, '/').replace(/\.+\/+|\/+$/g, '')
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
   * @param file - 文件路径
   * @param isThrow - 解析失败是否抛出错误
   */
  readJson (file: string, isThrow = false): any {
    try {
      return readJson(file)
    } catch (error) {
      logger.debug(`[common][error] 读取json文件错误: ${file} ` + error)
      if (isThrow) throw error
      return null
    }
  }

  /**
   * - 写入json文件
   * @param file - 文件路径
   * @param data - 要写入的数据
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
   * @param file - 文件路径
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
   * @param file - 文件路径
   * @param data - 要写入的数据
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
   * 获取局域网IP地址
   * @returns 局域网IP地址
   */
  getLocalIP (): string {
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
      const iface = interfaces[devName]
      if (!iface) continue

      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
    return '0.0.0.0'
  }

  /**
   * 传入插件名称 返回解析后的package.json的内容
   * @param name - 插件名称
   */
  pkgJson (name: string): {
    name: string,
    version: string,
    [key: string]: any
  } | null {
    try {
      /** 先查git插件 */
      const gitPath = `./plugins/${name}`
      if (fs.existsSync(gitPath)) return this.readJson(`${gitPath}/package.json`)
      /** 查npm插件 */
      const require = createRequire(import.meta.url)
      return require(`${name}/package.json`)
    } catch {
      return null
    }
  }

  /**
   * 输入包名 返回包根目录的绝对路径 仅简单查找
   * @param name - 包名
   * @param _path - 导入包的路径 此项适用于在插件中读取插件的依赖包
   * @returns - 包根目录的绝对路径
   * @example
   * common.pkgroot('axios')
   * common.pkgroot('axios', import.meta.url)
   */
  pkgroot (name: string, _path?: string): string {
    const require = createRequire(_path || import.meta.url)
    let dir = require.resolve(name)
    if (fs.existsSync(path.join(dir, 'package.json'))) return path.resolve(dir)

    /** 递归查找 如果跳过了node_modules 则返回null */
    while (true) {
      /** 向上 */
      dir = path.dirname(dir)

      if (fs.existsSync(path.join(dir, 'package.json'))) return path.resolve(dir)
      /** 加个处理 防止无线递归 */
      if (dir === path.dirname(dir)) {
        throw new Error(`[common] 未找到包${name}的根目录`)
      }
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
   * @param options - 选项 http为true时返回http地址
   * @returns 返回base64字符串
   */
  async base64 (file: string | Buffer | Readable, options = { http: false }): Promise<string> {
    /** 非字符串 */
    if (typeof file !== 'string') {
      if (Buffer.isBuffer(file)) return file.toString('base64')
      if (file instanceof Readable) return (await this.stream(file)).toString('base64')
      return file
    }

    /** base64:// */
    if (file.startsWith('base64://')) return file.replace('base64://', '')

    /** http */
    if (file.startsWith('http')) {
      if (options.http) return file
      const response = await axios.get(file, { responseType: 'arraybuffer' })
      return Buffer.from(response.data, 'binary').toString('base64')
    }

    /** file:// */
    const files = file.replace(/^file:\/\//, '')
    if (fs.existsSync(files)) return fs.readFileSync(files).toString('base64')

    /** 无前缀base64:// */
    return Buffer.from(file, 'base64').toString('base64')
  }

  /**
   * 将文件转换为Buffer对象 仅支持标准格式
   * @param file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param options - 选项 http为true时返回http地址
   * @returns - 返回Buffer对象
   */
  async buffer<T extends { http: boolean }> (file: string | Buffer | Readable, options?: T): Promise<T extends { http: true } ? string : Buffer> {
    type ResultType = T extends { http: true } ? string : Buffer

    /** 非字符串 */
    if (typeof file !== 'string') {
      if (Buffer.isBuffer(file)) return file as ResultType
      if (file instanceof Readable) return await this.stream(file) as ResultType
      return file
    }

    /** base64 */
    if (file.startsWith('base64://')) {
      return Buffer.from(file.replace('base64://', ''), 'base64') as ResultType
    }

    /** http */
    if (file.startsWith('http')) {
      if (options?.http) return file as ResultType
      const response = await axios.get(file, { responseType: 'arraybuffer' })
      return Buffer.from(response.data) as ResultType
    }

    /** file:// */
    const files = file.replace(/^file:\/\//, '')
    if (fs.existsSync(files)) return fs.readFileSync(files) as ResultType

    /** 无前缀base64:// */
    return Buffer.from(file, 'base64') as ResultType
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
   * 标准化发送的消息内容
   * @param elements - 消息内容
   */
  makeMessage (elements: string | KarinElement | (string | KarinElement)[]): Array<KarinElement> {
    if (!Array.isArray(elements)) elements = [elements]
    const message: Array<KarinElement> = []
    elements.forEach(v => { typeof v === 'string' ? message.push(segment.text(v)) : message.push(v) })
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
    return this.getGitPlugins(isPack)
  }

  /**
   * 获取git插件列表
   * @param isPack - 是否屏蔽不带package.json的插件，默认为false
   */
  getGitPlugins (isPack = false): Array<dirName> {
    return getGitPlugins(isPack)
  }

  /**
   * 获取npm插件列表
   * @param showDetails - 是否返回详细信息
   * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
   */
  async getNpmPlugins<T extends boolean> (showDetails: T): Promise<T extends true ? NpmInfo[] : string[]> {
    return getNpmPlugins(showDetails)
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
   * 传入一个时间戳
   * 返回距今已过去的时间
   * @param time - 时间戳
   *
   * @example
   * common.formatTime(1620000000)
   * // -> '18天'
   */
  formatTime (time: number): string {
    /** 判断是几位时间戳 进行对应处理 */
    time = time.toString().length === 10 ? time * 1000 : time
    /** 减去当前时间 */
    time = Math.floor((Date.now() - time) / 1000)

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
          logs.push(`[face: ${val.id}]`)
          break
        case 'video':
        case 'image':
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
          logs.push(`[${val.type}: ${file}]`)
          break
        }
        case 'at':
          logs.push(`[at: ${val.uid}]`)
          break
        case 'rps':
          logs.push(`[rps: ${val.id}]`)
          break
        case 'dice':
          logs.push(`[dice: ${val.id}]`)
          break
        case 'poke':
          logs.push(`[poke: ${val.id}]`)
          break
        case 'share':
          logs.push(`[share: ${JSON.stringify(val)}]`)
          break
        case 'contact':
          logs.push(`[contact: ${JSON.stringify(val)}]`)
          break
        case 'location':
          logs.push(`[location: ${JSON.stringify(val)}]`)
          break
        case 'music':
          logs.push(`[music: ${JSON.stringify(val)}]`)
          break
        case 'reply':
          logs.push(`[reply: ${val.message_id}]`)
          break
        case 'forward':
          logs.push(`[forward: ${val.res_id}]`)
          break
        case 'xml':
          logs.push(`[xml: ${val.data}]`)
          break
        case 'json':
          logs.push(`[json: ${val.data}]`)
          break
        case 'markdown': {
          logs.push(`[markdown: ${val.content}]`)
          break
        }
        case 'markdown_tpl': {
          const params = val.params
          if (!params) break
          const content: {
            [key: string]: string
          } = { id: val.custom_template_id }
          for (const v of params) content[v.key] = v.values[0]
          logs.push(`[markdown_tpl: ${JSON.stringify(content)}]`)
          break
        }
        case 'keyboard': {
          logs.push(`[rows: ${JSON.stringify(val.rows)}]`)
          break
        }
        case 'button':
          logs.push(`[button: ${JSON.stringify(val.data)}]`)
          break
        case 'long_msg':
          logs.push(`[long_msg: ${val.id}]`)
          break
        default:
          logs.push(`[未知: ${JSON.stringify(val)}]`)
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

  /**
   * karin按钮转换为QQBot官方按钮 返回官方按钮结构
   * @param button - 按钮
   */
  buttonToQQBot (button: ButtonElement | KeyBoardElement): Array<{ buttons: Array<ButtonType> }> {
    let id = 0
    const rows: Array<{ buttons: Array<ButtonType> }> = []
    /** 格式化为多行 */
    const list: KeyBoardElement['rows'] = []

    button.type === 'button' ? list.push(button.data) : list.push(...button.rows)
    for (const row of list) {
      const buttons: Array<ButtonType> = []
      for (const i of row) {
        const type = i.link ? 0 : (i.callback ? 1 : i.type ?? 2)

        const data: ButtonType = {
          id: String(id),
          render_data: {
            label: i.text,
            style: i.style ?? 0,
            visited_label: i.show || i.text,
          },
          action: {
            type,
            data: i.data || i.link || i.text,
            unsupport_tips: i.tips || '.',
            permission: { type: 2 },
          },
        }

        if (i.enter) data.action.enter = true
        if (i.reply) data.action.reply = true
        if (i.admin) data.action.permission.type = 1
        if (i.list) {
          data.action.permission.type = 0
          data.action.permission.specify_user_ids = i.list
        } else if (i.role) {
          data.action.permission.type = 3
          data.action.permission.specify_role_ids = i.role
        }
        buttons.push(data)
        id++
      }
      rows.push({ buttons })
    }
    return rows
  }
}

/**
 * 常用方法
 */
export const common = new Common()
