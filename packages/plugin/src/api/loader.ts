/**
 * Loader API - 极简加载器
 * @module api/loader
 */

import { cache } from './cache'
import { event } from './event'
import { registry } from './registry'
import { moduleApi } from './module'
import type { LoadFileOptions, LoadResult, PluginSource } from '../types'

export const loader = {
  async loadFile (path: string, opts: LoadFileOptions = {}): Promise<LoadResult> {
    const { force = false, pkg, silent = false } = opts
    try {
      if (force) {
        registry.unregisterByFile(path)
        moduleApi.clearCache(path, true)
      }

      const pkgName = pkg || moduleApi.getPackageByFile(path)
      const url = moduleApi.getImportUrl(path, force)
      const mod = await import(url)
      const count = processModule(mod)

      if (!silent && count > 0) console.log(`[loader] loaded: ${path} (${count} components)`)
      return { success: true, file: path, pkg: pkgName ?? undefined, registered: count }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      if (!silent) console.error(`[loader] failed: ${path}`, err)
      return { success: false, file: path, registered: 0, error: err }
    }
  },

  async loadPackage (pkgPath: string, _source: PluginSource = 'npm'): Promise<LoadResult[]> {
    event.emit('plugin:load:start', { pkg: pkgPath })
    const files = cache.package.getFiles(pkgPath)
    const results: LoadResult[] = []
    let total = 0
    for (const f of files) {
      const r = await loader.loadFile(f, { pkg: pkgPath })
      results.push(r)
      total += r.registered
    }
    event.emit('plugin:load:done', { pkg: pkgPath, registered: total })
    return results
  },

  reloadFile: (path: string) => loader.loadFile(path, { force: true }),

  async reloadPackage (pkg: string): Promise<LoadResult[]> {
    registry.unregisterByPackage(pkg)
    for (const f of moduleApi.getFilesByPackage(pkg)) moduleApi.clearCache(f, true)
    event.emit('plugin:reload', { pkg, result: { success: true, file: pkg, registered: 0 } })
    return loader.loadPackage(pkg)
  },

  async importModule (path: string, bust = false) {
    return import(moduleApi.getImportUrl(path, bust))
  },

  addPackage (name: string, path: string, source: PluginSource, version = '0.0.0') {
    cache.package.add(name, { version, path, source, status: 'loaded', files: new Set() })
  },

  addFileToPackage: (pkg: string, file: string) => cache.package.addFile(pkg, file),
}

function processModule (mod: unknown): number {
  if (!mod || typeof mod !== 'object') return 0
  let c = 0
  for (const v of Object.values(mod as Record<string, unknown>)) {
    if (typeof v === 'function' || (typeof v === 'object' && v !== null)) c++
  }
  return c
}

export type LoaderAPI = typeof loader
