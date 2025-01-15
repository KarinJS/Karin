import fs from 'node:fs'
import path from 'node:path'
import { tempPath } from '@/root'
import Axios, { AxiosError } from 'axios'
import { YamlEditor } from '@/utils/fs/yaml'
import { ffprobe, ffmpeg } from '@/utils/system/ffmpeg'
import { formatTime as FormatTime } from '@/utils/system/time'
import { getPlugins as GetPlugin } from '@/plugin/list'

import { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { getAppPlugins, getNpmPlugins as GetNpmPlugins, getGitPlugins as GetGitPlugins } from '@/plugin/index'

export { isDir, existToMkdir as exists } from '@/utils/fs/fsPromises'
export { downFile, absPath } from '@/utils/fs/file'
export { mkdirSync as mkdir } from '@/utils/fs/fsSync'
export { base64, buffer, stream } from '@/utils/fs/data'
export { getRelPath, urlToPath, splitPath } from '@/utils/fs/path'
export { read as readYaml, write as writeYaml } from '@/utils/fs/yaml'
export { readJsonSync as readJson, writeJsonSync as writeJson } from '@/utils/fs/json'
export { pkgRoot as pkgroot, getPluginInfo as pkgJson, isPlugin } from '@/utils/fs/pkg'
export { karinToQQBot as buttonToQQBot, karinToQQBot, qqbotToKarin } from '@/utils/button/convert'
export { createRawMessage, createRawMessage as makeMessageLog, makeMessage, makeForward } from '@/utils/message/message'

export type AxiosFn = {
  /**
   * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
   * @param param axios参数
   */
  (param: AxiosRequestConfig): Promise<AxiosResponse<any> | null | undefined>
  /**
   * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
   * @param url 请求地址
   * @param type 请求类型
   * @param param axios参数
   */
  (url: string, type: 'get' | 'post', param?: AxiosRequestConfig): Promise<AxiosResponse<any> | null | undefined>
}

export interface NpmInfo {
  plugin: string,
  path: string,
  file: string,
  isMain: boolean
}

/**
 * 休眠函数
 * @param ms 毫秒
 * @example
 * ```ts
 * await sleep(1000)
 * ```
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * axios请求
 * @description 401时返回 `undefined`
 * @param paramOrUrl axios参数或url
 * @param type 请求类型 只有在传入url时有效
 * @param param axios参数 只有在传入url时有效
 * @example
 * ```ts
 * await axios({ url: 'https://example.com', method: 'get' })
 * await axios({ url: 'https://example.com', method: 'post', data: { key: 'value' } })
 * await axios('https://example.com', 'post', { data: { key: 'value' } })
 * await axios('https://example.com', 'get')
 * // -> null 或 axios返回值
 * ```
 */
export const axios: AxiosFn = async (
  paramOrUrl: AxiosRequestConfig | string,
  type?: 'get' | 'post',
  param?: AxiosRequestConfig
): Promise<AxiosResponse<any> | null | undefined> => {
  try {
    const config = typeof paramOrUrl === 'string' ? { ...param, url: paramOrUrl, method: type } : paramOrUrl
    return await Axios(config)
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) return undefined
    }
    logger.debug('[common] axios请求失败:')
    logger.debug((error as Error).stack || error)
    return null
  }
}

/**
 * 获取运行时间
 * @example
 * ```ts
 * uptime()
 * // -> '1天2小时3分钟4秒'
 * // -> '2小时3分钟4秒'
 * // -> '3分钟4秒'
 * // -> '4秒'
 * ```
 */
export const uptime = () => {
  const time = process.uptime()
  const day = Math.floor(time / 86400)
  const hour = Math.floor((time % 86400) / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  const parts = [day ? `${day}天` : '', hour ? `${hour}小时` : '', min ? `${min}分钟` : '', !day && sec ? `${sec}秒` : '']

  return parts.filter(Boolean).join('')
}

/**
 * @description 传入一个或两个时间戳
 * @description 传入一个返回当前时间 - 时间1
 * @description 传入两个返回时间2 - 时间1
 * @param time - 时间戳
 * @example
 * common.formatTime(1620000000)
 * // -> '18天'
 * common.formatTime(1620000000, 1620000000)
 * // -> '18天'
 */
export const formatTime = FormatTime

/**
 * @deprecated 已废弃 建议使用`yaml`模块
 * 更新yaml文件
 * @param filePath - 文件路径
 * @param settings - 设置项
 */
export const updateYaml = (filePath: string, settings: Array<{
  /** 键路径 */
  key: string,
  /** 要写入的内容 */
  val: any,
  /** 需要写入的注释 */
  comment: string
  /** 注释在开头还是结尾 */
  type?: 'top' | 'end'
}>) => {
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
  settings.forEach(({ key, comment, type }) => {
    try {
      yaml.comment(key, comment, type === 'top')
    } catch (error: any) {
      logger.error(`[common] 更新yaml文件时出错：${error.stack || error.message || error}`)
    }
  })
  yaml.save()
}

/**
 * @deprecated 已废弃 请使用`getNpmPlugins`、`getNpmPluginsInfo`
 * 获取npm插件列表
 * @param showDetails - 是否返回详细信息
 * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
 */
export const getNpmPlugins = async (showDetails = false) => GetPlugin('npm', showDetails)

/**
 * @deprecated 已废弃
 * 获取git插件列表
 * @param isPack - 是否屏蔽不带package.json的插件，默认为false
 */
export const getPlugins = async (isPack = false) => GetPlugin('git', false)

/**
 * @deprecated 已废弃
 * 获取git插件列表
 * @param isPack - 是否屏蔽不带package.json的插件，默认为false
 */
export const getGitPlugins = async (isPack = false) => GetPlugin('git', isPack)

/**
 * 传入图片数组，拼接成一个图片
 * @param images - 图片数组 支持路径和带前缀base64字符串`(base64://...)`
 * @param perRow - 每行图片数量 默认3
 * @returns 返回base64 不含`data:image/png;base64` `base64://`等前缀
 */
export const mergeImage = async (images: string[], perRow = 3) => {
  if (images.length < 2) throw Error('图片数量必须大于1')

  /** 函数临时目录 */
  const root = path.join(tempPath, 'mergeImage')
  /** 本次任务的临时目录 */
  const rootTemp = path.join(root, Date.now().toString())
  fs.mkdirSync(rootTemp, { recursive: true })

  /** 图片文件路径合集 */
  const files = getAbsPath(images, rootTemp)
  /** 构建filter_complex */
  const filterComplex = await buildFilterComplex(files, perRow)
  /** 构建图片路径 */
  const inputImages = files.map((file) => `-i "${file}"`).join(' ')

  /** 输出图片路径 */
  const output = path.join(rootTemp, 'output.png')
  /** 最终的 ffmpeg 命令 */
  const ffmpegCmd = `${inputImages} -filter_complex "${filterComplex}" -map "[out]" ${output}`
  const result = await ffmpeg(ffmpegCmd)
  if (!result.status) {
    logger.error('[common] 合并图片失败:')
    throw result.error
  }

  const { height, width } = await getImageSize(output)
  const base64 = await fs.promises.readFile(output, 'base64')

  /** 异步清理临时目录 */
  setTimeout(() => fs.promises.rm(rootTemp, { recursive: true, force: true }), 100)
  return { base64, height, width }
}

/**
 * 将全部图片转为绝对路径
 * @param images - 图片数组
 * @param root - 根目录
 * @returns 返回绝对路径数组
 */
export const getAbsPath = (images: string[], root: string) => {
  const files: string[] = []
  images.forEach((image, index) => {
    if (typeof image !== 'string') throw TypeError('传入的图片只支持本地路径 或 带前缀base64://字符串')

    /** base64保存到本地 */
    if (image.startsWith('base64://')) {
      const base64 = image.replace(/^base64:\/\//, '')
      const buffer = Buffer.from(base64, 'base64')
      const file = path.join(root, `${index}.png`)
      fs.writeFileSync(file, buffer)
      files.push(file)
      return
    }

    /** 复制过来 不然删除的时候会把源文件一起删了 */
    if (!fs.existsSync(image)) throw Error(`图片路径不存在: ${image}`)
    const file = path.join(root, path.basename(image))
    fs.copyFileSync(image, file)
    files.push(file)
  })

  return files
}

/**
 * 传入图片路径，返回图片尺寸
 * @param file - 图片路径
 */
const getImageSize = async (file: string) => {
  const { stdout } = await ffprobe(`-v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${file}"`)
  const [width, height] = stdout.trim().split(',').map(Number)
  return { width, height }
}

/**
 * 为 xstack 生成布局
 * @param dimensions - 图片尺寸
 * @param perRow - 每行图片数量
 * @param maxWidth - 最大宽度
 * @param maxHeight - 最大高度
 */
const generateLayout = (dimensions: { width: number, height: number }[], perRow: number, maxWidth: number, maxHeight: number) => {
  const layouts = dimensions.map((_, index) => {
    const row = Math.floor(index / perRow)
    const col = index % perRow
    return `${col * maxWidth}_${row * maxHeight}`
  }).join('|')
  return layouts
}

/**
 * 构建filterComplex
 * @param dimensions - 图片尺寸
 * @param perRow - 每行图片数量
 * @param maxWidth - 最大宽度
 * @param maxHeight - 最大高度
 * @param output - 输出路径
 * @returns ffmpeg命令
 */
const buildFilterComplex = async (files: string[], perRow: number) => {
  /** 读取每张图片的尺寸 */
  const list = await Promise.all(
    files.map(async (file) => {
      const { width, height } = await getImageSize(file)
      return { file, width, height }
    })
  )

  const maxWidth = Math.max(...list.map((d) => d.width))
  const maxHeight = Math.max(...list.map((d) => d.height))

  let cmd = ''
  list.forEach((dim, index) => {
    // 将每个图像填充到最大宽度和高度 居中图像
    cmd += `[${index}:v]pad=${maxWidth}:${maxHeight}:(ow-iw)/2:(oh-ih)/2[p${index}]; `
  })

  /** 为 xstack 生成布局 */
  const layouts = generateLayout(list, perRow, maxWidth, maxHeight)
  cmd += `${list.map((_, index) => `[p${index}]`).join('')}xstack=inputs=${list.length}:layout=${layouts}[out]`
  return cmd
}
