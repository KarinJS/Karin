import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { isDev, isTsx } from '@/env'
import { pathToFileURL } from 'node:url'
import { requireFileSync } from '@/utils/fs/require'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { Apps } from '@/types/plugin'
import type { RequestHandler } from 'express'
import type { PkgData } from '@/utils/fs/pkg'
import type { DefineConfig, GetConfigResponse } from '@/types/server/local'

interface BaseConfig {
  /** 插件类型 */
  type: Apps,
  /** 插件名称 */
  name: string,
}

/**
 * 检查文件是否存在
 * @param filepath 文件路径
 * @returns 存在返回true，否则返回false
 */
const fileExists = (filepath: string): boolean => {
  try {
    return fs.existsSync(filepath)
  } catch (error) {
    return false
  }
}

/**
 * 从package.json中获取web配置路径
 * @param pkg package.json内容
 * @param baseDir 插件根目录
 * @returns web配置路径或null
 */
const getWebConfigPathFromPkg = (pkg: PkgData, baseDir: string): string | null => {
  if (!pkg.karin) return null

  /** 如果该插件处于node_modules中 视其为正式插件的环境 仅加载web */
  if (baseDir.includes('node_modules')) {
    if (pkg.karin.web) {
      const configPath = path.join(baseDir, pkg.karin.web)
      return fileExists(configPath) ? configPath : null
    }
    return null
  }

  let configPath = null

  if (isTsx()) {
    if (pkg.karin['ts-web']) {
      configPath = path.join(baseDir, pkg.karin['ts-web'])
      if (fileExists(configPath)) return configPath
    }
  }

  if (pkg.karin.web) {
    configPath = path.join(baseDir, pkg.karin.web)
    if (fileExists(configPath)) return configPath
  }

  return null
}

/**
 * 获取NPM插件配置路径
 * @param name 插件名称
 * @returns 配置路径或null
 */
const getNpmPluginConfigPath = (name: string): string | null => {
  const dir = path.join(process.cwd(), 'node_modules', name)
  if (fileExists(dir)) {
    try {
      const pkgPath = path.join(dir, 'package.json')
      if (fileExists(pkgPath)) {
        const pkg = requireFileSync<PkgData>(pkgPath)
        const configPath = getWebConfigPathFromPkg(pkg, dir)
        if (configPath) return configPath
      }
    } catch (error) {
      return null
    }
  }

  /** 开发环境检查根目录 */
  if (isDev()) {
    try {
      const rootPkgPath = path.join(process.cwd(), 'package.json')
      if (fileExists(rootPkgPath)) {
        const pkg = requireFileSync<PkgData>(rootPkgPath)
        if (pkg?.name === name) {
          return getWebConfigPathFromPkg(pkg, process.cwd())
        }
      }
    } catch (error) {
      return null
    }
  }

  return null
}

/**
 * 获取本地插件配置路径
 * @param name 插件名称
 * @returns 配置路径或null
 */
const getLocalPluginConfigPath = (name: string): string | null => {
  const pluginDir = path.join(process.cwd(), 'plugins', name)
  if (fileExists(pluginDir)) {
    try {
      const pkgPath = path.join(pluginDir, 'package.json')
      if (fileExists(pkgPath)) {
        const pkg = requireFileSync<PkgData>(pkgPath)
        const configPath = getWebConfigPathFromPkg(pkg, pluginDir)
        if (configPath) return configPath
      }
    } catch (error) {
      return null
    }
  }

  try {
    const pkgPath = path.join(process.cwd(), 'package.json')
    if (fileExists(pkgPath)) {
      const pkg = requireFileSync<PkgData>(pkgPath)
      return getWebConfigPathFromPkg(pkg, process.cwd())
    }
  } catch (error) {
    return null
  }

  return null
}

/**
 * 获取插件配置路径
 * @param options 插件配置
 * @returns 配置路径
 */
const getConfigPath = (options: BaseConfig): string | null => {
  try {
    switch (options.type) {
      case 'npm':
        return getNpmPluginConfigPath(options.name)
      case 'git':
        return getLocalPluginConfigPath(options.name)
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

/**
 * 加载插件配置
 * @param configPath 配置路径
 */
const loadConfig = async (configPath: string) => {
  try {
    /** 如果处于开发环境，则使用动态导入 */
    const fileUrl = pathToFileURL(configPath).toString()
    const result = await import(
      `${fileUrl}${isDev() ? '?t=' + Date.now() : ''}`
    ) as {
      default: DefineConfig
    }
    return result.default
  } catch (error) {
    throw new Error(`加载插件配置失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 传入type id 返回web.config配置
 * @param type 插件类型
 * @param id 插件id
 * @param fnc 配置文件不符合要求时回调
 * @returns web.config配置
 */
export const getWebConfig = async (type: Apps, id: string, _?: () => void) => {
  /** 只支持git npm */
  if (!['git', 'npm'].includes(type)) {
    return null
  }

  const webConfig = getConfigPath({ type, name: id })

  if (!webConfig) {
    return null
  }

  /** 获取文件名称 不包含后缀 */
  const baseName = path.basename(webConfig, path.extname(webConfig))
  if (baseName !== 'web.config') {
    return null
  }

  const result = await loadConfig(webConfig)
  /** 检查一下version description是否存在 不存在则从插件对应的package.json中获取 */
  if (!result.info.version || !result.info.description) {
    let dir = ''
    if (type === 'npm') {
      dir = path.join(process.cwd(), 'node_modules', id)
    } else {
      dir = path.join(process.cwd(), 'plugins', id)
      if (!fs.existsSync(dir)) {
        dir = process.cwd()
      }
    }

    const pkg = requireFileSync<PkgData>(path.join(dir, 'package.json'))
    if (!pkg || pkg.name !== id) {
      if (!result.info.version) result.info.version = ''
      if (!result.info.description) result.info.description = ''
    } else {
      if (!result.info.version) result.info.version = ''
      if (!result.info.description) result.info.description = ''
    }
  }

  return result
}

/**
 * 标准化插件作者字段
 * @param author 插件作者
 * @returns 标准化后的作者
 */
export const normalizeAuthor = (author: DefineConfig['info']['author']) => {
  const list: GetConfigResponse['info']['author'] = []
  if (Array.isArray(author)) {
    list.push(...author)
  } else if (author) {
    list.push(author)
  }

  return list
}

/**
 * 获取插件配置 不存在则返回null
 * @param req 请求
 * @param res 响应
 */
export const pluginGetConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig
  if (!options.type || !options.name) {
    createServerErrorResponse(res, '参数错误')
    return
  }

  const config = await getWebConfig(options.type, options.name, () => {
    logger.error(`[plugin] 插件${options.name}的web配置文件名称不正确: 需要以 web.config 命名`)
    createSuccessResponse(res, null)
  })

  if (!config) {
    return createServerErrorResponse(res, '参数错误')
  }

  const list: Record<string, any>[] = []
  let result = config.components()
  result = util.types.isPromise(result) ? await result : result

  result.forEach((item: any) => {
    if (typeof item?.toJSON === 'function') {
      list.push(item.toJSON())
    } else {
      if (typeof item === 'object' && item !== null) {
        list.push(item)
      }
    }
  })

  const data: GetConfigResponse = {
    options: list as GetConfigResponse['options'],
    info: {
      ...config.info,
      author: normalizeAuthor(config.info.author),
    },
  }

  createSuccessResponse(res, data)
}

/**

 * 保存插件配置
 */
export const pluginSaveConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig & { config: Record<string, any> }
  const configPath = getConfigPath(options)
  if (!configPath) return createServerErrorResponse(res, '参数错误')

  const { save } = await loadConfig(configPath)
  const result = save(options.config)
  const response = util.types.isPromise(result) ? await result : result
  createSuccessResponse(res, response || { success: true, message: '没有返回值哦 φ(>ω<*) ' })
}

/**
 * 判断插件是否存在配置
 */
export const pluginIsConfigExist: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig
  const configPath = getConfigPath(options)
  createSuccessResponse(res, typeof configPath === 'string')
}
