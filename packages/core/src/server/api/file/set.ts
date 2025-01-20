import { router } from '../router'
import { config, adapter, render, pm2, redis, setConfig } from '@/utils/config'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'

/**
 * 保存配置文件
 */
const setFileRouter: RequestHandler = async (req, res) => {
  const { type, data } = req.body

  if (!data || typeof data !== 'object') {
    res.status(400).json({ error: '无效的配置数据' })
    return
  }

  try {
    switch (type) {
      case 'config': {
        const cfg = config()
        setConfig('config', { ...cfg, ...data })
        break
      }
      case 'adapter': {
        const cfg = adapter()
        setConfig('adapter', { ...cfg, ...data })
        break
      }
      case 'render': {
        const cfg = render()
        setConfig('render', { ...cfg, ...data })
        break
      }
      case 'pm2': {
        const cfg = pm2()
        setConfig('pm2', { ...cfg, ...data })
        break
      }
      case 'redis': {
        const cfg = redis()
        setConfig('redis', { ...cfg, ...data })
        break
      }
      case 'env': {
        setConfig('env', data)
        break
      }
      case 'groups': {
        if (!Array.isArray(data.groups) || !data.groups.every((item: unknown) => typeof item === 'object')) {
          createServerErrorResponse(res, 'groups 数据格式错误')
          return
        }
        setConfig('groups', data.groups)
        break
      }
      case 'privates': {
        if (!Array.isArray(data.privates) || !data.privates.every((item: unknown) => typeof item === 'object')) {
          createServerErrorResponse(res, 'privates 数据格式错误')
          return
        }

        setConfig('privates', data.privates)
        break
      }
      default: {
        res.status(400).json({ error: '不支持的配置类型' })
        return
      }
    }

    createSuccessResponse(res, { message: '配置保存成功' })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
  }
}

router.post('/config/set', setFileRouter)
