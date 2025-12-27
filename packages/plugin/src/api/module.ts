/**
 * Module API - 极简模块操作
 * @module api/module
 */

import { formatPath } from '@karinjs/utils'
import { cache } from './cache'

const isDev = process.env.NODE_ENV === 'development' || process.env.KARIN_DEV === 'true'
let esmCache: Map<string, unknown> | null = null
let exclude: string[] = []
const versions = new Map<string, number>()
const deps = new Map<string, Set<string>>()     // from -> [to]
const depents = new Map<string, Set<string>>()  // to -> [from]

/** 加载 ESM 缓存（仅开发环境） */
/* istanbul ignore next -- @preserve */
async function loadEsmCache (): Promise<Map<string, unknown> | null> {
  if (!isDev || esmCache) return esmCache
  try {
    // @ts-ignore
    const m = await import('node:internal/modules/esm/loader')
    return (esmCache = m.default.getOrInitializeCascadedLoader().loadCache)
  } catch {
    try {
      // @ts-ignore
      const m = await import('node:internal/process/esm_loader')
      return (esmCache = m.default.esmLoader)
    } catch { return null }
  }
}

/** 清理 ESM 缓存 */
async function clearEsm (urls: string | string[]) {
  const c = await loadEsmCache()
  if (!c) return
  for (const u of Array.isArray(urls) ? urls : [urls]) c.delete(u)
}

/** 查找依赖模块 */
/* istanbul ignore next -- @preserve */
async function findDeps (url: string): Promise<string[]> {
  const c = await loadEsmCache()
  if (!c) return [url]

  const result: string[] = []
  const visited = new Set(exclude)

  const collect = async (u: string) => {
    if (visited.has(u)) return
    visited.add(u)
    result.push(u)

    const dependent: string[] = []
    for (const [k, v] of c.entries()) {
      if (k.includes('node_modules') || k.includes('node:') || visited.has(k)) continue
      try {
        const linked = await ((v as any).javascript?.linked || (v as any).linked)
        if (linked && [...linked].some((m: any) => m.url === u)) dependent.push(k)
      } catch { }
    }
    await Promise.allSettled(dependent.map(d => collect(d)))
  }

  await collect(url)
  return result
}

export const moduleApi = {
  get isDev () { return isDev },

  setExclude (paths: string[]) {
    exclude = paths.filter(p => p?.trim()).map(p => formatPath(p, { type: 'fileURL' }))
  },

  getImportUrl (path: string, bust = false) {
    if (!bust) return path
    if (!isDev) {
      const v = (versions.get(path) ?? 0) + 1
      versions.set(path, v)
      return `${path}?v=${v}`
    }
    return `${path}?t=${Date.now()}`
  },

  resetVersion: (path: string) => versions.delete(path),

  async clearCache (path: string, recursive = false) {
    const url = formatPath(path, { type: 'fileURL' })
    if (recursive) {
      await clearEsm(await findDeps(url))
    } else {
      await clearEsm(url)
    }
  },

  clearCaches: (urls: string[]) => clearEsm(urls.filter(u => u?.trim())),

  findDependentModules: (path: string) => findDeps(formatPath(path, { type: 'fileURL' })),

  findDependents (path: string) {
    const result: string[] = []
    const visited = new Set<string>()
    const go = (f: string) => {
      if (visited.has(f)) return
      visited.add(f)
      const d = depents.get(f)
      if (d) for (const x of d) { result.push(x); go(x) }
    }
    go(path)
    return result
  },

  findDependencies (path: string) {
    const result: string[] = []
    const visited = new Set<string>()
    const go = (f: string) => {
      if (visited.has(f)) return
      visited.add(f)
      const d = deps.get(f)
      if (d) for (const x of d) { result.push(x); go(x) }
    }
    go(path)
    return result
  },

  getPackageByFile: (path: string) => cache.package.findByFile(path),
  getFilesByPackage: (pkg: string) => cache.package.getFiles(pkg),

  addDependency (from: string, to: string) {
    if (!deps.has(from)) deps.set(from, new Set())
    deps.get(from)!.add(to)
    if (!depents.has(to)) depents.set(to, new Set())
    depents.get(to)!.add(from)
  },

  clearDependencies (path: string) {
    const d = deps.get(path)
    if (d) { for (const x of d) depents.get(x)?.delete(path); deps.delete(path) }
    const t = depents.get(path)
    if (t) { for (const x of t) deps.get(x)?.delete(path); depents.delete(path) }
  },

  clear () { deps.clear(); depents.clear() },
}

export type ModuleAPI = typeof moduleApi
