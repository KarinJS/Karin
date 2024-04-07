import { logger } from '#Karin'
import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline, Readable } from 'stream'
import { promisify } from 'util'

class Common {
  /**
   * 休眠函数
   * @param ms 毫秒
   */
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
     * 下载保存文件
     * @param fileUrl 下载地址
     * @param savePath 保存路径
     * @param param
     */
  async downFile (fileUrl, savePath, param = {}) {
    try {
      this.mkdir(path.dirname(savePath))
      logger.debug(`[下载文件] ${fileUrl}`)
      const response = await axios.get(fileUrl, {
        ...param,
        responseType: 'stream' // 设置响应类型为流
      })
      const streamPipeline = promisify(pipeline)
      await streamPipeline(response.data, fs.createWriteStream(savePath))
      return true
    } catch (err) {
      logger.error(`下载文件错误：${err}`)
      return false
    }
  }

  /**
   * 递归创建文件夹。
   * 如果指定的路径不存在，则递归创建该路径中的所有文件夹。
   * 如果指定的路径已存在，则不执行任何操作。
   * @param {string} dirname - 要创建的文件夹路径。
   * @returns {boolean} 如果文件夹已经存在或创建成功，则返回true
   */
  mkdir (dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }

  /**
   * 添加一个触发账号前缀
   * @param {string} id 触发账号
   * @param {string[]}args 日志参数
   * @returns {string} 带触发账号前缀的日志
   */
  logger (id, ...args) {
    return logger.violet(`[Bot:${id}] `) + args.join(' ')
  }

  /**
   * 获取绝对路径，支持file://前缀
   * @param {string} _path - 相对路径
   * @returns {string} 绝对路径
   */
  absPath (_path) {
    _path = _path.replace('file://', '')
    return path.resolve(_path)
  }

  /**
   * 将文件转换为不带前缀的base64字符串
   * @param {string|Buffer|http|stream.Readable} file - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param {object} data - 附加数据
   * @param {boolean} data.http - 为true时，http地址会直接返回，否则会下载文件并转换为base64字符串
   * @returns {Promise<string>} - 返回base64字符串
   */
  async base64 (file, data = { http: false }) {
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
      return file
    }

    /** url */
    if (file.startsWith('http://') || file.startsWith('https://')) {
      if (data.http) return file
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
   * @param {object} data - 附加数据
   * @param {boolean} data.http - 为true时，http地址会直接返回，否则会下载文件并转换为Buffer对象
   * @returns {Promise<Buffer>} - 返回Buffer对象
   */
  async buffer (file, { http = false }) {
    if (typeof file !== 'string') {
      if (Buffer.isBuffer(file)) return file
      if (file instanceof Readable) return this.stream(file)
      throw new Error('未知文件类型：', file)
    }

    if (file.startsWith('base64://')) return Buffer.from(file.replace('base64://', ''), 'base64')

    if (file.startsWith('http://') || file.startsWith('https://')) {
      if (http) return file
      const response = await axios.get(file, { responseType: 'arraybuffer' })
      return Buffer.from(response.data)
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
}

export default new Common()
