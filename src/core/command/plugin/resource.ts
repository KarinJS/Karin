import fs from 'node:fs'
import path from 'node:path'
import { pluginPkg } from '../fs/pkg'
import { defaultConfig, userConfig } from '../fs/path'
import { copyConfigSync } from '../createConfig'

/**
 * 为每个插件创建基本文件夹结构
 * @param name 插件名称
 */
export const createPluginDir = async (name: string) => {
  const pkg = await pluginPkg(name)
  const files = pkg?.data?.karin?.files || [
    'data',
    'config',
    'resource',
  ]

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
  copyConfigSync(defaultConfig, userConfig, ['.yaml'])
}
