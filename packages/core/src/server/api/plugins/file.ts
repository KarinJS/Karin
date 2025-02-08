import { getPlugins } from '@/plugin/list'
import { raceRequest } from './source'
import path from 'path'
import fs from 'fs'
import type { RequestHandler } from 'express'
import { pluginDir as getPluginsDir } from '@/root'

import type { GetPluginType } from '@/types/plugin'
import type { PluginLists, OnlinePluginInfo } from '@/types/server/plugins'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

/**
 * 构建raw url
 * @param plugin 插件信息
 * @param github github URL转换函数
 * @returns 构建后的raw URL
 */
export const buildRawUrl = (plugin: PluginLists['repo'][number], github: (url: string) => string) => {
  const url = plugin.url.replace('.git', '')

  const urlMap = {
    github: () => {
      const rawUrl = url.replace('github.com', 'raw.githubusercontent.com')
      return github(`${rawUrl}/refs/heads/${plugin.branch}/package.json`)
    },
    gitee: () => `${url}/raw/${plugin.branch}/package.json`,
    gitlab: () => `${url}/raw/${plugin.branch}/package.json`,
    gitcode: () => {
      const rawUrl = url.replace('gitcode.com', 'raw.gitcode.com')
      return `${rawUrl}/raw/${plugin.branch}/package.json`
    },
    npm: () => '',
  }

  return urlMap?.[plugin.type]?.() ?? null
}

/**
 * 检查插件是否已安装
 * @param name 插件名称
 * @param type 插件类型
 * @returns 是否已安装
 */
export const checkPluginInstalled = async (name: string, type: GetPluginType): Promise<boolean> => {
  try {
    const plugins = await getPlugins(type, false)
    return plugins.some(plugin => plugin === name)
  } catch {
    return false
  }
}

/**
 * 处理 NPM 类型插件
 * @param plugin NPM插件信息
 * @returns 处理后的插件信息
 */
export const handleNpmPlugin = async (plugin: OnlinePluginInfo['plugins'][number]) => {
  const urls = [
    `https://registry.npmmirror.com/${plugin.name}/latest`,
    `https://registry.npmjs.com/${plugin.name}/latest`,
  ]

  const registry = await raceRequest<Record<string, any>>(urls)
  logger.debug(`[插件列表] 获取 ${plugin.name} 的最新版本: ${JSON.stringify(registry)}`)
  const version = registry?.version ?? '-'
  const installed = await checkPluginInstalled(plugin.name, 'npm')

  return {
    ...plugin,
    version,
    installed,
  }
}

/**
 * 处理 Git 类型插件
 * @param plugin Git插件信息
 * @param createUrl URL创建函数
 * @returns 处理后的插件信息
 */
export const handleGitPlugin = async (
  plugin: OnlinePluginInfo['plugins'][number],
  createUrl: (url: string) => string
) => {
  const installed = await checkPluginInstalled(plugin.name, 'git')
  const url = buildRawUrl(plugin.repo[0], createUrl)

  if (!url) {
    logger.error(`[插件列表] 无法获取 ${plugin.name} 的package.json`)
    return null
  }

  const pkg = await raceRequest<Record<string, any>>([url])
  logger.debug(`[插件列表] 获取 ${plugin.name} 的最新版本: ${JSON.stringify(pkg)}`)
  return {
    ...plugin,
    version: pkg?.version ?? '-',
    installed,
  }
}

/**
 * 处理 App 类型插件
 * @param plugin App插件信息
 * @returns 处理后的插件信息
 */
export const handleAppPlugin = async (plugin: OnlinePluginInfo['plugins'][number]) => {
  return {
    ...plugin,
    version: '-',
    installed: false,
  }
}

/**
 * 规范化并验证文件路径
 * @param filePath 文件路径
 * @returns 规范化后的文件路径
 * @throws 当检测到路径穿越或无效路径时抛出错误
 */
const normalizeAndValidatePath = (filePath: string): string => {
  // 解码 URL 编码的文件名
  const decodedPath = decodeURIComponent(filePath)

  // 规范化路径分隔符
  const url = path.normalize(decodedPath).replace(/\\/g, '/')

  // 检查是否存在路径穿越
  if (url.includes('..') || url.includes('~') || !url.match(/^[a-zA-Z0-9-_.]+$/)) {
    throw new Error('文件路径包含非法字符')
  }

  // 移除开头的斜杠
  return url.replace(/^[/\\]+/, '')
}

/**
 * 处理插件文件操作
 * @param req Express请求对象
 * @param res Express响应对象
 */
export const handlePluginFile: RequestHandler = async (req, res) => {
  const { pluginName, fileName, operation } = req.body

  try {
    /** 参数验证 */
    if (!pluginName || !fileName || !operation) {
      throw new Error('缺少必要参数')
    }

    /** 验证操作类型 */
    if (!['read', 'delete'].includes(operation)) {
      throw new Error('无效的操作类型')
    }

    /** 规范化并验证文件路径 */
    const safeFileName = normalizeAndValidatePath(fileName)

    /** 获取插件目录 */
    const pluginDir = path.join(getPluginsDir, pluginName)

    /** 验证插件目录是否存在 */
    if (!fs.existsSync(pluginDir)) {
      throw new Error('插件不存在')
    }

    /** 构建完整文件路径 */
    const filePath = path.join(pluginDir, safeFileName)

    /** 验证文件是否在插件目录内 */
    if (!filePath.startsWith(pluginDir)) {
      throw new Error('无效的文件路径：文件必须在插件目录内')
    }

    /** 验证文件是否存在 */
    if (!fs.existsSync(filePath)) {
      throw new Error('文件不存在')
    }

    /** 执行操作 */
    switch (operation) {
      case 'read': {
        const content = await fs.promises.readFile(filePath, 'utf-8')
        /** 确保空文件返回空字符串而不是null */
        createSuccessResponse(res, content || '')
        break
      }
      case 'delete': {
        await fs.promises.unlink(filePath)
        createSuccessResponse(res, null)
        break
      }
    }
  } catch (error) {
    logger.error(error)
    createServerErrorResponse(res, (error as Error).message || '操作失败，未知错误')
  }
}
