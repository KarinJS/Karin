import fs from 'node:fs'
import path from 'node:path'
import { basePath } from '@/root'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import axios, { AxiosError } from 'axios'

import type { AxiosRequestConfig } from 'axios'

/** promisify stream.pipeline */
const streamPipeline = promisify(pipeline)

/** 当前运行环境的路径标准协议前缀 */
export const sep = path.sep === '/' ? /^file:\/\// : /^file:[/]{2,3}/

/**
 * 下载保存文件
 * @param fileUrl 下载地址
 * @param savePath 保存路径
 * @param param axios参数
 */
export const downFile = async (fileUrl: string, savePath: string, param: AxiosRequestConfig = {}) => {
  try {
    await fs.promises.mkdir(path.dirname(savePath), { recursive: true })
    const response = await axios.get(fileUrl, { ...param, responseType: 'stream' })
    await streamPipeline(response.data, fs.createWriteStream(savePath))
    return true
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(`下载文件错误：${error.stack}`)
    } else {
      logger.error(`下载文件错误：${error}`)
    }
    return false
  }
}

/**
 * 标准化文件路径 统一使用/分隔符
 * @param file - 路径
 * @param absPath - 返回绝对路径 默认为true
 * @param prefix - 添加file://前缀 默认为false
 * @returns 标准化后的路径
 */
export const absPath = (file: string, absPath = true, prefix = false) => {
  file = file.replace(/\\/g, '/')
  if (file.startsWith('file://')) file = file.replace(sep, '')

  file = path.normalize(file)
  if (absPath) file = path.resolve(file)
  if (prefix) file = 'file://' + file
  return file.replace(/\\/g, '/')
}

/**
 * 为每个插件创建基本文件夹结构
 * @param name 插件名称
 * @param files 需要创建的文件夹列表
 */
export const createPluginDir = async (name: string, files?: string[]) => {
  if (!Array.isArray(files)) files = ['config', 'data', 'resources']
  if (files.length === 0) return
  const pluginPath = path.join(basePath, name)
  if (!fs.existsSync(pluginPath)) await fs.promises.mkdir(pluginPath, { recursive: true })

  await Promise.all(files.map(file => {
    const filePath = path.join(pluginPath, file)
    if (!fs.existsSync(filePath)) return fs.promises.mkdir(filePath, { recursive: true })
    return Promise.resolve()
  }))
}

/**
 * 获取符合后缀的文件列表(仅包含文件名称)
 * @param filePath 文件路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @returns 符合条件的文件列表
 */
export const getFiles = (filePath: string, suffixs: string[] = []): string[] => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`路径不存在: ${filePath}`)
  }

  /** 读取默认配置文件列表，只保留文件，排除文件夹 */
  let files = fs.readdirSync(filePath, { withFileTypes: true })
    .filter(file => file.isFile())
    .map(file => file.name)

  if (suffixs.length) {
    /** 统一后缀格式为 .suffix */
    const normalizedSuffixs = suffixs.map(suffix => (suffix.startsWith('.') ? suffix : `.${suffix}`))
    files = files.filter(file => {
      const suffix = path.extname(file)
      return suffix && normalizedSuffixs.includes(suffix)
    })
  }

  return files
}

/**
 * 复制文件 同步
 * @param files 需要复制的文件列表
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 */
export const copyFilesSync = (files: string[], defaulPath: string, userPath: string): void => {
  files.forEach(file => {
    const defaulFile = path.join(defaulPath, file)
    const userFile = path.join(userPath, file)
    if (!fs.existsSync(userFile)) {
      fs.copyFileSync(defaulFile, userFile)
    }
  })
}

/**
 * 复制文件 异步
 * @param files 需要复制的文件列表
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 */
export const copyFiles = async (files: string[], defaulPath: string, userPath: string): Promise<void> => {
  await Promise.all(files.map(async file => {
    const defaulFile = path.join(defaulPath, file)
    const userFile = path.join(userPath, file)
    if (!fs.existsSync(userFile)) {
      await fs.promises.copyFile(defaulFile, userFile)
    }
  }))
}

/**
 * 创建配置文件 同步
 * @description 从模板配置文件复制到目标文件夹
 * @param defaulPath 模板配置文件路径
 * @param userPath 目标文件夹路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @param isThrow 是否抛出异常 默认不抛出
 * @returns 是否复制成功
 * @example
 * ```ts
 * copyConfigSync('defaultPath', 'userPath')
 * copyConfigSync('defaultPath', 'userPath', ['yaml'])
 * copyConfigSync('defaultPath', 'userPath', ['.yaml', 'json'])
 * copyConfigSync('defaultPath', 'userPath', [], true)
 * ```
 */
export const copyConfigSync = (
  defaulPath: string,
  userPath: string,
  suffixs: string[] = [],
  isThrow = false
): boolean => {
  try {
    const files = getFiles(defaulPath, suffixs)
    fs.mkdirSync(userPath, { recursive: true })
    fs.mkdirSync(defaulPath, { recursive: true })
    copyFilesSync(files, defaulPath, userPath)
    return true
  } catch (error) {
    if (isThrow) throw error
    return false
  }
}

/**
 * 创建配置文件 异步
 * @description 从模板配置文件复制到用户配置文件
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @param isThrow 是否抛出异常 默认不抛出
 * @returns 是否复制成功
 * @example
 * ```ts
 * await copyConfig('defaultPath', 'userPath')
 * await copyConfig('defaultPath', 'userPath', ['yaml'])
 * await copyConfig('defaultPath', 'userPath', ['.yaml', 'json'])
 * await copyConfig('defaultPath', 'userPath', [], true)
 * ```
 */
export const copyConfig = async (
  defaulPath: string,
  userPath: string,
  suffixs: string[] = [],
  isThrow = false
): Promise<boolean> => {
  try {
    const files = getFiles(defaulPath, suffixs)
    await Promise.all([
      fs.promises.mkdir(userPath, { recursive: true }),
      fs.promises.mkdir(defaulPath, { recursive: true }),
    ])
    await copyFiles(files, defaulPath, userPath)
    return true
  } catch (error) {
    if (isThrow) throw error
    return false
  }
}
