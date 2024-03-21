import { logger } from '#Karin'
import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'stream'
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

  /** 创建文件夹 */
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
}

export default new Common()
