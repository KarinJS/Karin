import { Router as ExpressRouter } from 'express'
import type { Request, Response } from 'express'
import { packageList, dev, store } from '@karinjs/plugin'
import {
  createSuccessResponse,
  createServerErrorResponse,
} from '../../utils/response'

const router = ExpressRouter()

/**
 * 插件包信息（用于前端展示）
 */
export interface PluginPackageInfo {
  /** 包名 */
  name: string
  /** 包类型: npm | dev | apps */
  type: 'npm' | 'dev' | 'apps'
  /** 包绝对路径 */
  path: string
  /** 插件数量 */
  pluginCount: number
}

/**
 * 插件信息（用于前端展示）
 */
export interface PluginInfo {
  /** 插件 ID */
  id: string
  /** 插件名称 */
  name: string
  /** 插件类型: command | accept | handler | button | task */
  type: string
  /** 所属包名 */
  pkg: string
  /** 文件路径 */
  file: string
  /** 优先级 */
  priority: number
}

/**
 * 获取所有插件包列表
 * GET /api/v2/plugin/packages
 */
router.get('/packages', (_req: Request, res: Response) => {
  try {
    const packages = packageList.getAll()

    // 统计每个包的插件数量
    const result: PluginPackageInfo[] = packages.map(pkg => {
      const plugins = store.getByPkg(pkg.name)
      return {
        name: pkg.name,
        type: pkg.type,
        path: pkg.abs,
        pluginCount: plugins.length,
      }
    })

    createSuccessResponse(res, result, '获取成功')
  } catch (error) {
    console.error('获取插件包列表失败:', error)
    createServerErrorResponse(res, '获取插件包列表失败')
  }
})

/**
 * 获取包名列表（简化版本，用于下拉选择等场景）
 * GET /api/v2/plugin/package-names
 */
router.get('/package-names', (_req: Request, res: Response) => {
  try {
    const names = packageList.names('all')
    createSuccessResponse(res, names, '获取成功')
  } catch (error) {
    console.error('获取包名列表失败:', error)
    createServerErrorResponse(res, '获取包名列表失败')
  }
})

/**
 * 获取所有插件列表
 * GET /api/v2/plugin/list
 *
 * Query params:
 * - type: 可选，过滤插件类型 (command | accept | handler | button | task)
 * - pkg: 可选，过滤所属包名
 */
router.get('/list', (req: Request, res: Response) => {
  try {
    const { type, pkg } = req.query

    let plugins = dev.listPlugins(type as any)

    // 按包名过滤
    if (pkg && typeof pkg === 'string') {
      plugins = plugins.filter(p => p.pkg === pkg)
    }

    const result: PluginInfo[] = plugins.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      pkg: p.pkg,
      file: p.file,
      priority: p.priority,
    }))

    createSuccessResponse(res, result, '获取成功')
  } catch (error) {
    console.error('获取插件列表失败:', error)
    createServerErrorResponse(res, '获取插件列表失败')
  }
})

/**
 * 获取插件统计信息
 * GET /api/v2/plugin/stats
 */
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const storeStats = store.stats()
    const pkgStats = packageList.stats()

    createSuccessResponse(res, {
      plugins: storeStats,
      packages: pkgStats,
    }, '获取成功')
  } catch (error) {
    console.error('获取插件统计失败:', error)
    createServerErrorResponse(res, '获取插件统计失败')
  }
})

/**
 * 获取 store 快照（调试用）
 * GET /api/v2/plugin/snapshot
 */
router.get('/snapshot', (_req: Request, res: Response) => {
  try {
    const snapshotData = dev.snapshot()
    createSuccessResponse(res, snapshotData, '获取成功')
  } catch (error) {
    console.error('获取快照失败:', error)
    createServerErrorResponse(res, '获取快照失败')
  }
})

export default router
