/**
 * 2.0 WebUI 兼容接口 - 插件商店路由
 */

import type { RequestHandler } from 'express'

type PluginCategory = 'all' | 'adapter' | 'tool' | 'fun' | 'utils'
type PluginSortKey = 'downloads' | 'updatedAt' | 'rating'

interface PluginFeature {
  title: string
  description: string
  icon: 'flash' | 'shield' | 'box' | 'pulse'
}

interface PluginListItem {
  packageName: string
  displayName: string
  version: string
  author: string
  authorHandle: string
  description: string
  category: Exclude<PluginCategory, 'all'>
  downloads: number
  stars: number
  rating: number
  iconText: string
  accentColor: string
  installed: boolean
  isOfficial: boolean
  githubUrl: string
}

interface PluginMetaInfo {
  license: string
  lastUpdateLabel: string
  compatibility: string
  sizeLabel: string
}

interface PluginDetail {
  packageName: string
  displayName: string
  version: string
  author: string
  authorHandle: string
  verified: boolean
  installLabel: string
  githubUrl: string
  downloads: number
  rating: number
  overviewMarkdown: string
  changelogMarkdown: string
  dependenciesMarkdown: string
  features: PluginFeature[]
  metaInfo: PluginMetaInfo
  isProFeature: boolean
  proFeatureDescription: string
}

interface PluginStoreListPayload {
  items: PluginListItem[]
  total: number
  page: number
  pageSize: number
}

interface PluginStoreDetailPayload {
  detail: PluginDetail
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const pluginCategoryPool: Exclude<PluginCategory, 'all'>[] = ['adapter', 'tool', 'fun', 'utils']
const pluginNamePool = [
  '消息总线加速器',
  '流量热图分析',
  '指令调试工具箱',
  '群聊娱乐工坊',
  '插件依赖医生',
  '事件追踪审计',
  '缓存分层管理',
  '高可用通知中心',
  '结构化日志拓展',
  '定时任务编排器',
  '机器人欢迎助手',
  '多实例同步桥接',
]
const pluginDescriptionPool = [
  '增强 KarinJS 的事件分发和多实例同步能力。',
  '提供高维可观测图表和异常流量自动标注。',
  '把插件调试信息与运行时日志统一收敛到一个面板。',
  '内置互动小游戏与排行榜，提升群聊活跃度。',
  '自动分析依赖冲突并给出升级建议。',
  '支持结构化告警路由和细粒度权限控制。',
]
const categoryLabelMap: Record<Exclude<PluginCategory, 'all'>, string> = {
  adapter: '适配器',
  tool: '工具',
  fun: '娱乐',
  utils: '功能',
}
const iconTextMap: Record<Exclude<PluginCategory, 'all'>, string> = {
  adapter: '适',
  tool: '工',
  fun: '乐',
  utils: '能',
}
const accentColorMap: Record<Exclude<PluginCategory, 'all'>, string> = {
  adapter: 'from-blue-500/25 via-blue-500/10 to-transparent',
  tool: 'from-emerald-500/25 via-emerald-500/10 to-transparent',
  fun: 'from-amber-500/25 via-amber-500/10 to-transparent',
  utils: 'from-violet-500/25 via-violet-500/10 to-transparent',
}

/**
 * 规范化排序键
 */
const normalizePluginSortKey = (rawSortKey: string): PluginSortKey => {
  if (rawSortKey === 'updatedAt') {
    return 'updatedAt'
  }
  if (rawSortKey === 'rating') {
    return 'rating'
  }
  return 'downloads'
}

/**
 * 随机挑选插件分类
 */
const pickPluginCategory = (): Exclude<PluginCategory, 'all'> => {
  return pluginCategoryPool[Math.floor(Math.random() * pluginCategoryPool.length)]
}

/**
 * 随机挑选插件名称
 */
const pickPluginName = (): string => {
  return pluginNamePool[Math.floor(Math.random() * pluginNamePool.length)]
}

/**
 * 随机挑选插件描述
 */
const pickPluginDescription = (): string => {
  return pluginDescriptionPool[Math.floor(Math.random() * pluginDescriptionPool.length)]
}

/**
 * 构建能力卡片
 */
const pickPluginFeatures = (): PluginFeature[] => {
  return [
    {
      title: '低延迟',
      description: '请求路径开销控制在 2ms 以内。',
      icon: 'flash',
    },
    {
      title: '安全钩子',
      description: '外部 API 调用支持端到端校验。',
      icon: 'shield',
    },
  ]
}

/**
 * 根据序号构建随机插件列表项
 */
const buildRandomPluginListItem = (seedIndex: number): PluginListItem => {
  const category = pickPluginCategory()
  const pluginName = pickPluginName()
  return {
    packageName: `karin-plugin-random-${seedIndex}`,
    displayName: pluginName,
    version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    author: `${categoryLabelMap[category]}团队`,
    authorHandle: `@${category}-lab-${Math.floor(Math.random() * 90) + 10}`,
    description: pickPluginDescription(),
    category,
    downloads: Math.floor(Math.random() * 24000) + 1000,
    stars: Math.floor(Math.random() * 8920) + 80,
    rating: Math.round((Math.random() * 1.2 + 3.8) * 10) / 10,
    iconText: iconTextMap[category],
    accentColor: accentColorMap[category],
    installed: Math.random() > 0.5,
    isOfficial: Math.random() > 0.75,
    githubUrl: `https://github.com/karinjs/random-plugin-${seedIndex}`,
  }
}

/**
 * 根据包名构建随机详情
 */
const buildRandomPluginDetail = (packageName: string): PluginDetail => {
  const category = pickPluginCategory()
  const displayName = pickPluginName()
  return {
    packageName,
    displayName,
    version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    author: `${categoryLabelMap[category]}团队`,
    authorHandle: `@${category}-lab-${Math.floor(Math.random() * 90) + 10}`,
    verified: Math.random() > 0.75,
    installLabel: '安装插件',
    githubUrl: `https://github.com/karinjs/${packageName || 'random-plugin'}`,
    downloads: Math.floor(Math.random() * 25700) + 300,
    rating: Math.round((Math.random() * 1.2 + 3.8) * 10) / 10,
    overviewMarkdown: `# ${displayName}\n\n这是随机生成的插件概览。\n\n- 支持基础插件生命周期。\n- 支持配置热重载。\n- 支持可观测性数据输出。`,
    changelogMarkdown: `## ${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}\n\n- 修复稳定性问题。\n- 优化配置加载流程。`,
    dependenciesMarkdown: '- @karinjs/core\n- @karinjs/plugin-runtime',
    features: pickPluginFeatures(),
    metaInfo: {
      license: 'MIT',
      lastUpdateLabel: `${Math.floor(Math.random() * 20) + 1} 天前`,
      compatibility: 'KarinJS v3.0+',
      sizeLabel: `${Math.round((Math.random() * 10 + 2) * 10) / 10} MB`,
    },
    isProFeature: Math.random() > 0.5,
    proFeatureDescription: '该功能模块需要高级套餐支持。',
  }
}

/**
 * 获取插件列表
 */
export const getPluginStoreListRouter: RequestHandler = (req, res) => {
  const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1)
  const pageSize = Math.min(16, Math.max(1, Number.parseInt(String(req.query.pageSize || '6'), 10) || 6))
  const keyword = String(req.query.keyword || '').trim().toLowerCase()
  const category = String(req.query.category || 'all') as PluginCategory
  const sortBy = normalizePluginSortKey(String(req.query.sortBy || 'downloads'))

  const allItems = Array.from({ length: 32 }, (_, seedIndex) => buildRandomPluginListItem(seedIndex + 1))
  const filteredItems = allItems.filter((item) => {
    const matchedCategory = category === 'all' ? true : item.category === category
    const matchedKeyword = keyword.length === 0
      ? true
      : `${item.displayName} ${item.description} ${item.author} ${item.authorHandle} ${item.packageName}`.toLowerCase().includes(keyword)
    return matchedCategory && matchedKeyword
  })

  const sortedItems = [...filteredItems].sort((firstItem, secondItem) => {
    if (sortBy === 'rating') {
      return secondItem.rating - firstItem.rating
    }
    if (sortBy === 'updatedAt') {
      return secondItem.stars - firstItem.stars
    }
    return secondItem.downloads - firstItem.downloads
  })

  const startIndex = (page - 1) * pageSize
  const pagedItems = sortedItems.slice(startIndex, startIndex + pageSize)

  const response: ApiResponse<PluginStoreListPayload> = {
    code: 0,
    message: 'success',
    data: {
      items: pagedItems,
      total: sortedItems.length,
      page,
      pageSize,
    },
  }
  res.json(response)
}

/**
 * 获取插件详情
 */
export const getPluginStoreDetailRouter: RequestHandler = (req, res) => {
  const packageName = String(req.query.packageName || '').trim()
  const resolvedPackageName = packageName || `karin-plugin-random-${Math.floor(Math.random() * 999) + 1}`
  const detail = buildRandomPluginDetail(resolvedPackageName)

  const response: ApiResponse<PluginStoreDetailPayload> = {
    code: 0,
    message: 'success',
    data: {
      detail,
    },
  }
  res.json(response)
}
