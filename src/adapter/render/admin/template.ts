import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'
import template from 'art-template'
import { Options } from './types'
import { htmlPath } from '@/root'
import { existToMkdirSync } from '@/utils/fs/fsSync'

/** 模板缓存 */
const cache = new Map<string, string>()
/** 监听器缓存 */
const watcherCache = new Map<string, chokidar.FSWatcher>()

/**
 * @description 处理模板
 * @param options 截图参数
 */
export const renderTpl = (options: Omit<Options, 'name'> & { name?: string }) => {
  if (options.data) {
    /** 他喵的 不会真的有笨比传个http吧... */
    if (options.file.startsWith('http')) {
      throw TypeError('他喵的 不会真的有笨比传个http来当做模板吧...')
    }

    const file = path.resolve(options.file)
    const tplData = getCacheData(file)
    const renderData = template.render(tplData, options.data)

    /** 保存文件的绝对路径 */
    const outputPath = getOutputPath(options.file, renderData, options.name)
    fs.writeFileSync(outputPath, renderData)

    delete options.data
    delete options.name
    options.file = `file://${outputPath}`

    return options
  }

  if (!options.file.startsWith('http') && !options.file.startsWith('file')) {
    options.file = `file://${options.file}`
  }

  delete options.data
  delete options.name
  return options
}

/**
 * @description 获取模板数据
 * @param file 模板文件路径
 */
const getCacheData = (file: string) => {
  const CachingData = cache.get(file)
  if (CachingData) {
    return CachingData
  }

  const tplData = fs.readFileSync(file, 'utf-8')
  watch(file, tplData)
  return tplData
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
  /** 保存文件的绝对路径 */
  const filePath = path.join(fileDir, `${basename}-${Date.now()}${extname}`)

  existToMkdirSync(fileDir)
  fs.writeFileSync(filePath, data)
  return filePath
}

/**
 * @description 监听模板文件
 * @param file 模板文件路径
 * @param data 模板数据
 */
const watch = async (file: string, data: string) => {
  cache.set(file, data)
  if (watcherCache.has(file)) return

  const watcher = chokidar.watch(file)
  watcherCache.set(file, watcher)
  watcher.on('change', () => {
    cache.set(file, fs.readFileSync(file, 'utf-8'))
    logger.info(`[文件变动] html模板发送变动: ${file}`)
  })
  watcher.on('unlink', () => {
    cache.delete(file)
    watcher.close()
    watcherCache.delete(file)
    watcher.removeAllListeners()
    logger.info(`[文件删除] html模板被删除: ${file}`)
  })
}
