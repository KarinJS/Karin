import { router } from '../router'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'
import { config, adapter, groups, privates, render, pm2, redis, setConfig } from '@/utils/config'

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
      case 'groups': {
        const cfg = groups()
        setConfig('groups', { ...cfg, ...data })
        break
      }
      case 'privates': {
        const cfg = privates()
        setConfig('privates', { ...cfg, ...data })
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

router.post('/set_file', setFileRouter)
