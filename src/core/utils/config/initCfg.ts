import { mkdir, mkdirSync } from '@/utils/fs/mkdir'
import fs from 'node:fs'
import path from 'node:path'
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
export const copyFilesAsync = async (files: string[], defaulPath: string, userPath: string): Promise<void> => {
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
 * @description 从模板配置文件复制到用户配置文件
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
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
    mkdirSync(userPath)
    mkdirSync(defaulPath)
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
    await Promise.all([mkdir(userPath), mkdir(defaulPath)])
    await copyFilesAsync(files, defaulPath, userPath)
    return true
  } catch (error) {
    if (isThrow) throw error
    return false
  }
}
