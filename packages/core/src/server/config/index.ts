import { karinPathConfig } from '@/root'
import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse,
} from '@/server/utils/response'
import {
  adapter,
  groups,
  privates,
  getRenderCfg,
  pm2,
  redis,
  getEnv,
  setConfig,
  writeEnv,
  readConfig,
} from '@/utils/config'

import type { RequestHandler } from 'express'

/**
 * 获取配置
 * @param req 请求
 * @param res 响应
 * @returns 配置
 */
export const getConfig: RequestHandler = async (req, res) => {
  const { type } = req.body as { type: string }
  if (type === 'config') {
    const cfg = readConfig(karinPathConfig)
    return createSuccessResponse(res, cfg)
  }

  if (type === 'adapter') {
    const cfg = adapter()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'groups') {
    const cfg = groups()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'privates') {
    const cfg = privates()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'render') {
    const cfg = getRenderCfg()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'redis') {
    const cfg = redis()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'pm2') {
    const cfg = pm2()
    return createSuccessResponse(res, cfg)
  }

  if (type === 'env') {
    const cfg = getEnv()
    return createSuccessResponse(res, cfg)
  }

  return createBadRequestResponse(res, '无效的配置类型')
}

/**
 * 保存配置
 * @param req 请求
 * @param res 响应
 * @returns 保存配置
 */
export const saveConfig: RequestHandler = async (req, res) => {
  const list = ['config', 'adapter', 'render', 'pm2', 'redis', 'groups', 'privates', 'env'] as const
  const { type, data } = req.body as { type: typeof list[number], data: Record<string, any> }
  const save = () => {
    if (type === 'env') {
      const result = Object.entries(data).map(([key, value]) => ({
        key,
        value: value.value,
        comment: value.comment,
      }))
      writeEnv(result, undefined, true)
      return true
    }

    if (list.includes(type)) {
      return setConfig(type, data)
    }

    return false
  }

  try {
    const result = save()
    if (!result) {
      return createBadRequestResponse(res, '配置保存失败')
    }

    createSuccessResponse(res, '配置保存成功')
  } catch (error) {
    logger.error(error)
    createServerErrorResponse(res, (error as Error).message)
  }
}
