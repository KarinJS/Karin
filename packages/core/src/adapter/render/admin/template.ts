import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import template from 'art-template'
import schedule from 'node-schedule'
import { htmlPath } from '@/root'
import { mkdirSync } from '@/utils/fs/fsSync'
import { getAllFiles } from '@/utils/fs/file'
import type { Options, Snapka } from './types'

/**
 * @description 处理模板
 * @param options 截图参数
 * @deprecated 请使用`renderTemplate`
 */
export const renderTpl = (options: Options) => {
  if (typeof options.file !== 'string') {
    throw TypeError('模板文件路径必须为字符串')
  }

  if (!options.name) {
    options.name = path.basename(options.file) || 'render'
  }

  /** 渲染模板数据 */
  if (options.data) {
    /** 他喵的 不会真的有笨比传个http吧... */
    if (options.file.startsWith('http')) {
      throw TypeError('他喵的 不会真的有笨比传个http来当做模板吧...')
    }

    const file = path.resolve(options.file)
    const tplData = fs.readFileSync(file, 'utf-8')
    const renderData = template.render(tplData, options.data)

    /** 保存文件的绝对路径 */
    const outputPath = getOutputPath(options.file, renderData, options.name)
    fs.writeFileSync(outputPath, renderData)

    delete options.data
    options.file = `file://${outputPath}`

    return options
  }

  if (!options.file.startsWith('http') && !options.file.startsWith('file')) {
    options.file = `file://${path.resolve(options.file)}`
  }

  delete options.data
  return options
}

/**
 * @description 处理模板
 * @param options 截图参数
 */
export const renderTemplate = <R extends Snapka> (options: Snapka): R => {
  if (typeof options.file !== 'string') {
    throw TypeError('模板文件路径必须为字符串')
  }

  if ('name' in options) {
    options.file_name = options.name as string
    delete options.name
  }

  if (!options.file_name) {
    options.file_name = path.basename(options.file) || 'render'
  }

  /** 渲染模板数据 */
  if (options.data) {
    /** 他喵的 不会真的有笨比传个http吧... */
    if (options.file.startsWith('http')) {
      throw TypeError('他喵的 不会真的有笨比传个http来当做模板吧...')
    }

    const file = path.resolve(options.file)
    const tplData = fs.readFileSync(file, 'utf-8')
    const renderData = template.render(tplData, options.data)

    /** 保存文件的绝对路径 */
    const outputPath = getOutputPath(options.file, renderData, options.file_name)
    fs.writeFileSync(outputPath, renderData)

    delete options.data
    options.file = `file://${outputPath}`

    return options as R
  }

  if (!options.file.startsWith('http') && !options.file.startsWith('file')) {
    options.file = `file://${path.resolve(options.file)}`
  }

  delete options.data
  return options as R
}

/**
 * 生成渲染模板后保存的文件路径并保存模板
 * @param file 模板文件路径
 * @param data 模板数据
 * @param name 保存文件的目录名称
 */
const getOutputPath = (file: string, data: string, name?: string) => {
  /** 后缀 */
  const extname = path.extname(file)
  /** 文件名称 不含后缀 */
  const basename = path.basename(file, extname)
  /** 保存文件的目录 */
  const fileDir = path.join(htmlPath, name || 'render')
  mkdirSync(fileDir)

  /** 内容哈希 */
  const contentHash = crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
    .substring(0, 8)
  const filePath = path.join(fileDir, `${basename}-${contentHash}${extname}`)

  /** 如果文件已存在 则更新文件的修改时间 */
  if (fs.existsSync(filePath)) {
    const now = new Date()
    try {
      fs.utimesSync(filePath, now, now)
    } catch (err) {
      logger.error(`[文件更新] 更新文件时出错: ${filePath}, ${err}`)
    }
    return filePath
  }

  fs.writeFileSync(filePath, data)
  return filePath
}

/**
 * 清理过期文件
 * 删除修改时间超过10分钟的HTML文件
 */
const cleanExpiredFiles = async () => {
  let count = 0
  const now = Date.now()
  const files = await getAllFiles(htmlPath, { suffixs: ['.html'], returnType: 'abs' })
  console.log('files:', files)
  if (files.length === 0) return
  const EXPIRE_TIME = 10 * 60 * 1000

  for (const file of files) {
    try {
      const stats = await fs.promises.stat(file)
      const lastModified = stats.mtimeMs

      // 如果文件最后修改时间超过10分钟，则删除
      if (now - lastModified > EXPIRE_TIME) {
        await fs.promises.unlink(file)
        count++
      }
    } catch (err) {
      logger.error(`[文件清理] 处理文件时出错: ${file}, ${err}`)
    }
  }

  logger.mark(`[文件清理] 清理HTML完成: ${count}/${files.length}`)
}

/**
 * 定时清理过期的html文件
 */
export const startCleanExpiredFiles = () => {
  schedule.scheduleJob(process.env.CLEAN_HTML_CRON || '*/10 * * * *', cleanExpiredFiles)
}
