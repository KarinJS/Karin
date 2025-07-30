import { ini, getNpmConfig, getNpmConfigList, setNpmConfig } from '@karinjs/utils'
import { createBadRequestResponse, createServerErrorResponse, createSuccessResponse } from '../utils/response'
import type { RequestHandler } from 'express'
import type { NpmBaseConfigResponse } from '@karinjs/utils'

/**
 * 获取.npmrc文件列表
 */
export const getNpmrcListRouter: RequestHandler = async (_, res) => {
  try {
    const list = await getNpmConfigList()
    return createSuccessResponse(res, list)
  } catch (error) {
    logger.error('[getNpmrcListRouter]', error)
    return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 获取npm config文件内容
 */
export const getNpmrcContentRouter: RequestHandler = async (req, res) => {
  try {
    const { path } = req.body
    const list = await getNpmConfigList()
    if (!list.find(item => item.path === path)) {
      return createBadRequestResponse(res, '文件不存在')
    }

    const content = ini.read(path)
    return createSuccessResponse(res, content)
  } catch (error) {
    logger.error('[getNpmrcContentRouter]', error)
    return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 获取registry、proxy、https-proxy配置
 */
export const getNpmBaseConfigRouter: RequestHandler = async (_, res) => {
  try {
    const [registry, proxy, httpsProxy] = await Promise.all([
      getNpmConfig('registry'),
      getNpmConfig('proxy'),
      getNpmConfig('https-proxy'),
    ])

    const data: NpmBaseConfigResponse = {
      registry,
      proxy,
      'https-proxy': httpsProxy,
    }

    return createSuccessResponse(res, data)
  } catch (error) {
    logger.error('[getNpmConfigRouter]', error)
    return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 保存npmrc文件
 */
export const saveNpmrcRouter: RequestHandler = async (req, res) => {
  try {
    const { path, content, baseConfig } = req.body
    const list = await getNpmConfigList()

    const promises: Promise<void>[] = []

    if (baseConfig.registry) {
      promises.push(setNpmConfig('registry', baseConfig.registry))
    }

    if (baseConfig.proxy) {
      promises.push(setNpmConfig('proxy', baseConfig.proxy))
    }

    if (baseConfig['https-proxy']) {
      promises.push(setNpmConfig('https-proxy', baseConfig['https-proxy']))
    }

    await Promise.all(promises)

    if (path && content) {
      if (!list.find(item => item.path === path)) {
        return createBadRequestResponse(res, '文件不存在')
      }
      ini.write(content, path)
    }

    return createSuccessResponse(res, '保存成功')
  } catch (error) {
    logger.error('[saveNpmrcRouter]', error)
    return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}
