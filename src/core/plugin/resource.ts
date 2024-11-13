import fs from 'node:fs'
import path from 'node:path'
import { defaultConfigPath, configPath } from '../utils/fs/root'
import { copyConfigSync } from '../utils/config/initCfg'

/**
 * 为每个插件创建基本文件夹结构
 * @param name 插件名称
 * @param files 需要创建的文件夹列表
 */
export const createPluginDir = async (name: string, files?: string[]) => {
  if (!Array.isArray(files)) files = ['config', 'data', 'resource']
  if (files.length === 0) return
  const pluginPath = path.join(process.cwd(), 'config', name)
  if (!fs.existsSync(pluginPath)) await fs.promises.mkdir(pluginPath)

  await Promise.all(files.map(file => {
    const filePath = path.join(pluginPath, file)
    if (!fs.existsSync(filePath)) return fs.promises.mkdir(filePath)
    return Promise.resolve()
  }))
}

/**
 * 创建框架基本文件夹结构
 */
export const createKarinDir = () => {
  copyConfigSync(defaultConfigPath, configPath, ['.yaml'])
}
