/**
 * 开发工具模块
 *
 * 提供开发环境下的调试和诊断工具
 *
 * @module dev
 */

import { store } from '../store'
import { pkgRegistry } from '../package/registry'
import { getHookStats } from '../lifecycle'

// ==================== 类型定义 ====================

/** 插件诊断信息 */
export interface PluginDiagnostic {
  id: string
  type: string
  name: string
  file: string
  pkg: string
  priority: number
}

/** Store 快照 */
export interface StoreSnapshot {
  timestamp: number
  stats: ReturnType<typeof store.stats>
  plugins: {
    command: PluginDiagnostic[]
    accept: PluginDiagnostic[]
    handler: PluginDiagnostic[]
    button: PluginDiagnostic[]
    task: PluginDiagnostic[]
  }
  packages: string[]
  lifecycle: ReturnType<typeof getHookStats>
}

// ==================== 诊断工具 ====================

/**
 * 获取插件诊断信息
 */
function getPluginDiagnostic (plugin: any): PluginDiagnostic {
  return {
    id: plugin.id ?? 'unknown',
    type: plugin.type ?? 'unknown',
    name: plugin.name ?? plugin.options?.name ?? 'unknown',
    file: plugin.file?.absPath ?? plugin.callerPath ?? 'unknown',
    pkg: plugin.packageName ?? 'unknown',
    priority: plugin.priority ?? plugin.options?.priority ?? 10000,
  }
}

/**
 * 创建 store 快照
 */
export function snapshot (): StoreSnapshot {
  return {
    timestamp: Date.now(),
    stats: store.stats(),
    plugins: {
      command: store.getAll('command').map(getPluginDiagnostic),
      accept: store.getAll('accept').map(getPluginDiagnostic),
      handler: store.getAll('handler').map(getPluginDiagnostic),
      button: store.getAll('button').map(getPluginDiagnostic),
      task: store.getAll('task').map(getPluginDiagnostic),
    },
    packages: pkgRegistry.list(),
    lifecycle: getHookStats(),
  }
}

/**
 * 打印插件状态报告
 */
export function printReport (): void {
  const stats = store.stats()
  const pkgStats = pkgRegistry.stats()
  const hookStats = getHookStats()

  console.log('\n========== Plugin Status Report ==========')
  console.log('[Plugins]')
  console.log(`  Command: ${stats.command.total} (active: ${stats.command.active})`)
  console.log(`  Accept:  ${stats.accept.total} (active: ${stats.accept.active})`)
  console.log(`  Handler: ${stats.handler.total} (keys: ${stats.handler.keys})`)
  console.log(`  Button:  ${stats.button.total} (active: ${stats.button.active})`)
  console.log(`  Task:    ${stats.task.total} (active: ${stats.task.active})`)
  console.log('[Registry]')
  console.log(`  Packages: ${pkgStats.packages}`)
  console.log(`  Files:    ${pkgStats.files}`)
  console.log('[Lifecycle Hooks]')
  console.log(`  onLoad:   ${hookStats.load}`)
  console.log(`  onUnload: ${hookStats.unload}`)
  console.log(`  onReload: ${hookStats.reload}`)
  console.log('===========================================\n')
}

/**
 * 列出所有插件
 */
export function listPlugins (type?: 'command' | 'accept' | 'handler' | 'button' | 'task'): PluginDiagnostic[] {
  if (type) {
    return store.getAll(type).map(getPluginDiagnostic)
  }

  return [
    ...store.getAll('command'),
    ...store.getAll('accept'),
    ...store.getAll('handler'),
    ...store.getAll('button'),
    ...store.getAll('task'),
  ].map(getPluginDiagnostic)
}

/**
 * 按文件列出插件
 */
export function listByFile (file: string): PluginDiagnostic[] {
  return store.getByFile(file).map(getPluginDiagnostic)
}

/**
 * 按包列出插件
 */
export function listByPackage (pkg: string): PluginDiagnostic[] {
  return store.getByPkg(pkg).map(getPluginDiagnostic)
}

/**
 * 查找插件
 */
export function findPlugin (query: {
  id?: string
  name?: string
  file?: string
  pkg?: string
}): PluginDiagnostic[] {
  const all = listPlugins()

  return all.filter(p => {
    if (query.id && !p.id.includes(query.id)) return false
    if (query.name && !p.name.includes(query.name)) return false
    if (query.file && !p.file.includes(query.file)) return false
    if (query.pkg && !p.pkg.includes(query.pkg)) return false
    return true
  })
}

// ==================== 调试工具 ====================

/**
 * 监控 store 事件
 */
export function monitorStore (options?: {
  add?: boolean
  del?: boolean
  sort?: boolean
}): () => void {
  const opts = { add: true, del: true, sort: false, ...options }
  const listeners: (() => void)[] = []

  if (opts.add) {
    const handler = (type: string, plugin: any) => {
      console.log(`[store:add] ${type} - ${plugin.id ?? 'unknown'}`)
    }
    store.on('add', handler as any)
    listeners.push(() => store.off('add', handler as any))
  }

  if (opts.del) {
    const handler = (type: string, id: string) => {
      console.log(`[store:del] ${type} - ${id}`)
    }
    store.on('del', handler as any)
    listeners.push(() => store.off('del', handler as any))
  }

  if (opts.sort) {
    const handler = (type: string) => {
      console.log(`[store:sort] ${type}`)
    }
    store.on('sort', handler as any)
    listeners.push(() => store.off('sort', handler as any))
  }

  // 返回停止监控的函数
  return () => listeners.forEach(fn => fn())
}

/**
 * 性能计时器
 */
export function createTimer (name: string) {
  const start = performance.now()

  return {
    lap: (label?: string) => {
      const elapsed = performance.now() - start
      console.log(`[timer:${name}] ${label ?? 'lap'}: ${elapsed.toFixed(2)}ms`)
      return elapsed
    },
    end: () => {
      const elapsed = performance.now() - start
      console.log(`[timer:${name}] done: ${elapsed.toFixed(2)}ms`)
      return elapsed
    },
  }
}

// ==================== 导出开发工具集 ====================

/**
 * 开发工具集
 */
export const dev = {
  snapshot,
  printReport,
  listPlugins,
  listByFile,
  listByPackage,
  findPlugin,
  monitorStore,
  createTimer,
}
