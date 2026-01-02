/**
 * 生命周期模块
 *
 * 提供插件生命周期钩子：
 * - onLoad: 插件加载时执行
 * - onUnload: 插件卸载时执行
 * - onReload: 插件热重载时执行
 *
 * @module lifecycle
 */

import { store } from '../store'
import { pkgRegistry } from '../package/registry'

// ==================== 类型定义 ====================

/** 生命周期钩子函数 */
export type LifecycleHook = () => void | Promise<void>

/** 钩子信息 */
interface HookInfo {
  file: string
  pkg: string
  fn: LifecycleHook
}

// ==================== 内部状态 ====================

/** onLoad 钩子队列 */
const loadHooks: HookInfo[] = []

/** onUnload 钩子映射: file -> hooks */
const unloadHooks = new Map<string, LifecycleHook[]>()

/** onReload 钩子映射: file -> hooks */
const reloadHooks = new Map<string, LifecycleHook[]>()

// ==================== 调用栈追踪 ====================

/** 当前加载的文件（由 loader 设置） */
let currentLoadingFile: string | null = null
let currentLoadingPkg: string | null = null

/**
 * 设置当前加载上下文（由 loader 调用）
 */
export function setLoadingContext (file: string, pkg: string): void {
  currentLoadingFile = file
  currentLoadingPkg = pkg
}

/**
 * 清除加载上下文
 */
export function clearLoadingContext (): void {
  currentLoadingFile = null
  currentLoadingPkg = null
}

/**
 * 获取当前加载上下文
 */
export function getLoadingContext (): { file: string; pkg: string } | null {
  if (!currentLoadingFile) return null
  return { file: currentLoadingFile, pkg: currentLoadingPkg ?? '' }
}

// ==================== 生命周期钩子注册 ====================

/**
 * 注册 onLoad 钩子
 *
 * @example
 * ```ts
 * onLoad(() => {
 *   console.log('插件已加载')
 *   // 初始化数据库连接等
 * })
 * ```
 */
export function onLoad (fn: LifecycleHook): void {
  const ctx = getLoadingContext()
  if (!ctx) {
    // 立即执行（在模块顶层调用时）
    Promise.resolve().then(() => fn())
    return
  }

  loadHooks.push({
    file: ctx.file,
    pkg: ctx.pkg,
    fn,
  })
}

/**
 * 注册 onUnload 钩子
 *
 * @example
 * ```ts
 * onUnload(() => {
 *   console.log('插件即将卸载')
 *   // 清理资源、关闭连接等
 * })
 * ```
 */
export function onUnload (fn: LifecycleHook): void {
  const ctx = getLoadingContext()
  const file = ctx?.file ?? '__global__'

  if (!unloadHooks.has(file)) {
    unloadHooks.set(file, [])
  }
  unloadHooks.get(file)!.push(fn)
}

/**
 * 注册 onReload 钩子
 *
 * @example
 * ```ts
 * onReload(() => {
 *   console.log('插件正在热重载')
 *   // 保存状态等
 * })
 * ```
 */
export function onReload (fn: LifecycleHook): void {
  const ctx = getLoadingContext()
  const file = ctx?.file ?? '__global__'

  if (!reloadHooks.has(file)) {
    reloadHooks.set(file, [])
  }
  reloadHooks.get(file)!.push(fn)
}

// ==================== 钩子执行 ====================

/**
 * 执行文件的 onLoad 钩子
 */
export async function runLoadHooks (file: string): Promise<void> {
  const hooks = loadHooks.filter(h => h.file === file)
  for (const hook of hooks) {
    try {
      await hook.fn()
    } catch (e) {
      console.error(`[lifecycle] onLoad error in ${file}:`, e)
    }
  }
}

/**
 * 执行文件的 onUnload 钩子
 */
export async function runUnloadHooks (file: string): Promise<void> {
  const hooks = unloadHooks.get(file)
  if (!hooks || hooks.length === 0) return

  for (const fn of hooks) {
    try {
      await fn()
    } catch (e) {
      console.error(`[lifecycle] onUnload error in ${file}:`, e)
    }
  }

  // 清理
  unloadHooks.delete(file)
}

/**
 * 执行文件的 onReload 钩子
 */
export async function runReloadHooks (file: string): Promise<void> {
  const hooks = reloadHooks.get(file)
  if (!hooks || hooks.length === 0) return

  for (const fn of hooks) {
    try {
      await fn()
    } catch (e) {
      console.error(`[lifecycle] onReload error in ${file}:`, e)
    }
  }
}

/**
 * 执行包的所有 onUnload 钩子
 */
export async function runPackageUnloadHooks (pkgName: string): Promise<void> {
  const files = pkgRegistry.getFiles(pkgName)
  for (const file of files) {
    await runUnloadHooks(file)
  }
}

// ==================== 集成到 store 事件 ====================

// 监听 store 的 del 事件，在插件被删除时执行 unload 钩子
store.on('del', async (_type, _id, plugin) => {
  const file = (plugin as any).file?.absPath ?? (plugin as any).callerPath
  if (file) {
    // 检查该文件是否还有其他插件
    const remaining = store.getByFile(file)
    if (remaining.length === 0) {
      // 文件的所有插件都已卸载，执行 unload 钩子
      await runUnloadHooks(file)
    }
  }
})

// ==================== 清理函数 ====================

/**
 * 清理所有钩子（用于测试或重置）
 */
export function clearAllHooks (): void {
  loadHooks.length = 0
  unloadHooks.clear()
  reloadHooks.clear()
}

/**
 * 获取钩子统计
 */
export function getHookStats (): {
  load: number
  unload: number
  reload: number
} {
  let unloadCount = 0
  let reloadCount = 0

  for (const hooks of unloadHooks.values()) {
    unloadCount += hooks.length
  }
  for (const hooks of reloadHooks.values()) {
    reloadCount += hooks.length
  }

  return {
    load: loadHooks.length,
    unload: unloadCount,
    reload: reloadCount,
  }
}
