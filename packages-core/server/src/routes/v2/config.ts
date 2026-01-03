import { Router as ExpressRouter } from 'express'
import type { Request, Response } from 'express'
import { config } from '@karinjs/config'
import {
  createSuccessResponse,
  createBadRequestResponse,
  createServerErrorResponse,
} from '../../utils/response'

const router = ExpressRouter()

/**
 * 获取权限配置
 * GET /api/v1/config/permissions
 */
router.get('/permissions', (_req: Request, res: Response) => {
  try {
    const permissions = config.config()
    createSuccessResponse(res, {
      master: permissions.master,
      admin: permissions.admin,
    }, '获取成功')
  } catch (error) {
    console.error('获取权限配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新权限配置
 * POST /api/v1/config/permissions
 */
router.post('/permissions', (req: Request, res: Response) => {
  try {
    const { master, admin } = req.body

    if (!Array.isArray(master) || !Array.isArray(admin)) {
      return createBadRequestResponse(res, 'master 和 admin 必须是数组')
    }

    // 过滤无效值
    const validMaster = master.filter((id: unknown) => typeof id === 'string' && id.length > 0)
    const validAdmin = admin.filter((id: unknown) => typeof id === 'string' && id.length > 0)

    config.setRawConfig('admin/permissions.json', {
      master: validMaster,
      admin: validAdmin,
    })

    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存权限配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取过滤配置
 * GET /api/v1/config/filter
 */
router.get('/filter', (_req: Request, res: Response) => {
  try {
    const filterConfig = config.filter()
    createSuccessResponse(res, filterConfig, '获取成功')
  } catch (error) {
    console.error('获取过滤配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新过滤配置
 * POST /api/v1/config/filter
 */
router.post('/filter', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('filter/filter.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存过滤配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取群聊配置
 * GET /api/v1/config/group
 */
router.get('/group', (_req: Request, res: Response) => {
  try {
    const groupConfig = config.group()
    createSuccessResponse(res, groupConfig, '获取成功')
  } catch (error) {
    console.error('获取群聊配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新群聊配置
 * POST /api/v1/config/group
 */
router.post('/group', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('scene/group.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存群聊配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取好友配置
 * GET /api/v1/config/friend
 */
router.get('/friend', (_req: Request, res: Response) => {
  try {
    const friendConfig = config.friend()
    createSuccessResponse(res, friendConfig, '获取成功')
  } catch (error) {
    console.error('获取好友配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新好友配置
 * POST /api/v1/config/friend
 */
router.post('/friend', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('scene/friend.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存好友配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取频道配置
 * GET /api/v1/config/guild
 */
router.get('/guild', (_req: Request, res: Response) => {
  try {
    const guildConfig = config.guild()
    createSuccessResponse(res, guildConfig, '获取成功')
  } catch (error) {
    console.error('获取频道配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新频道配置
 * POST /api/v1/config/guild
 */
router.post('/guild', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('scene/guild.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存频道配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取私信配置
 * GET /api/v1/config/direct
 */
router.get('/direct', (_req: Request, res: Response) => {
  try {
    const directConfig = config.direct()
    createSuccessResponse(res, directConfig, '获取成功')
  } catch (error) {
    console.error('获取私信配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新私信配置
 * POST /api/v1/config/direct
 */
router.post('/direct', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('scene/direct.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存私信配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取服务器配置
 * GET /api/v1/config/server
 */
router.get('/server', (_req: Request, res: Response) => {
  try {
    const serverConfig = config.server()
    createSuccessResponse(res, serverConfig, '获取成功')
  } catch (error) {
    console.error('获取服务器配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新服务器配置
 * POST /api/v1/config/server
 */
router.post('/server', (req: Request, res: Response) => {
  try {
    const data = req.body

    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }

    config.setRawConfig('system/server.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存服务器配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取日志配置
 * GET /api/v1/config/logger
 */
router.get('/logger', (_req: Request, res: Response) => {
  try {
    const loggerConfig = config.logger()
    createSuccessResponse(res, loggerConfig, '获取成功')
  } catch (error) {
    console.error('获取日志配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新日志配置
 * POST /api/v1/config/logger
 */
router.post('/logger', (req: Request, res: Response) => {
  try {
    const data = req.body

    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }

    config.setRawConfig('system/logger.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存日志配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取 Redis 配置
 * GET /api/v1/config/redis
 */
router.get('/redis', (_req: Request, res: Response) => {
  try {
    const redisConfig = config.redis()
    createSuccessResponse(res, redisConfig, '获取成功')
  } catch (error) {
    console.error('获取Redis配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新 Redis 配置
 * POST /api/v1/config/redis
 */
router.post('/redis', (req: Request, res: Response) => {
  try {
    const data = req.body

    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }

    config.setRawConfig('system/redis.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存Redis配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

/**
 * 获取 PM2 配置
 * GET /api/v1/config/pm2
 */
router.get('/pm2', (_req: Request, res: Response) => {
  try {
    const pm2Config = config.pm2()
    createSuccessResponse(res, pm2Config, '获取成功')
  } catch (error) {
    console.error('获取PM2配置失败:', error)
    createServerErrorResponse(res, '获取配置失败')
  }
})

/**
 * 更新 PM2 配置
 * POST /api/v1/config/pm2
 */
router.post('/pm2', (req: Request, res: Response) => {
  try {
    const data = req.body
    if (!data || typeof data !== 'object') {
      return createBadRequestResponse(res, '请求体格式错误')
    }
    config.setRawConfig('system/pm2.json', data)
    createSuccessResponse(res, null, '保存成功')
  } catch (error) {
    console.error('保存PM2配置失败:', error)
    createServerErrorResponse(res, '保存配置失败')
  }
})

export default router
