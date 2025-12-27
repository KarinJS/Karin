/**
 * Cache API - 极简高性能缓存
 * @module api/cache
 */

import type { PluginType, PackageCache, RegistryItem, PluginStatus } from '../types'
import type { PackageEnv } from '../config'

// 裸存储 - 零抽象
const packages = new Map<string, PackageCache>()
const fileIdx = new Map<string, string>() // file -> pkg 索引，O(1) 查找
const stores: Record<PluginType, Map<string, RegistryItem>> = {
  command: new Map(),
  accept: new Map(),
  handler: new Map(),
  button: new Map(),
  task: new Map(),
}
const data = new Map<string, unknown>()
const engines = new Map<string, { version: string, ignoreEngines: boolean }>()
const envs = new Map<string, PackageEnv>()
const publicDirs = new Map<string, string[]>()
const missingDeps = new Map<string, Map<string, Array<{ type: 'import' | 'error', deps?: string, error?: unknown }>>>()
let stats = { pkg: 0, command: 0, accept: 0, button: 0, task: 0, handler: { key: 0, fnc: 0 } }

export const cache = {
  package: {
    add (name: string, d: Omit<PackageCache, 'name'>) {
      const pkg: PackageCache = { name, ...d, files: d.files instanceof Set ? d.files : new Set() }
      packages.set(name, pkg)
      for (const f of pkg.files) fileIdx.set(f, name)
    },
    get: (n: string) => packages.get(n),
    has: (n: string) => packages.has(n),
    delete (n: string) {
      const p = packages.get(n)
      if (!p) return false
      for (const f of p.files) fileIdx.delete(f)
      return packages.delete(n)
    },
    getAll: () => new Map(packages),
    names: () => [...packages.keys()],
    setStatus (n: string, s: PluginStatus) { const p = packages.get(n); if (p) p.status = s },
    addFile (n: string, f: string) { const p = packages.get(n); if (p) { p.files.add(f); fileIdx.set(f, n) } },
    removeFile (n: string, f: string) { const p = packages.get(n); if (p) { p.files.delete(f); fileIdx.delete(f) } },
    getFiles: (n: string) => [...(packages.get(n)?.files ?? [])],
    findByFile: (f: string) => fileIdx.get(f) ?? null,
    clear () { packages.clear(); fileIdx.clear() },
    get size () { return packages.size },
  },

  instance: {
    add: (t: PluginType, id: string, item: RegistryItem) => stores[t].set(id, item),
    get: (t: PluginType, id: string) => stores[t].get(id),
    delete: (t: PluginType, id: string) => stores[t].delete(id),
    getAll: (t: PluginType) => [...stores[t].values()],
    getStore: (t: PluginType) => stores[t],
    getByPackage (pkg: string) {
      const r: RegistryItem[] = []
      for (const s of Object.values(stores)) {
        for (const i of s.values()) { if (i.pkg === pkg) r.push(i) }
      }
      return r
    },
    getByFile (file: string) {
      const r: RegistryItem[] = []
      for (const s of Object.values(stores)) {
        for (const i of s.values()) { if (i.file === file) r.push(i) }
      }
      return r
    },
    deleteByPackage (pkg: string) {
      let c = 0
      for (const s of Object.values(stores)) {
        for (const [id, i] of s) { if (i.pkg === pkg) { s.delete(id); c++ } }
      }
      return c
    },
    deleteByFile (file: string) {
      let c = 0
      for (const s of Object.values(stores)) {
        for (const [id, i] of s) { if (i.file === file) { s.delete(id); c++ } }
      }
      return c
    },
    clearType: (t: PluginType) => stores[t].clear(),
    clear () { for (const s of Object.values(stores)) s.clear() },
    count: (t: PluginType) => stores[t].size,
    get totalCount () { return Object.values(stores).reduce((s, m) => s + m.size, 0) },
  },

  data: {
    set: <T> (k: string, v: T) => data.set(k, v),
    get: <T> (k: string) => data.get(k) as T | undefined,
    has: (k: string) => data.has(k),
    delete: (k: string) => data.delete(k),
    clear: () => data.clear(),
  },

  engines: {
    set: (n: string, v: { version: string, ignoreEngines: boolean }) => engines.set(n, v),
    get: (n?: string) => n ? engines.get(n) : Object.fromEntries(engines),
    delete: (n: string) => engines.delete(n),
    clear: () => engines.clear(),
  },

  envs: {
    set: (n: string, v: PackageEnv) => envs.set(n, v),
    get: (n?: string) => n ? envs.get(n) : Object.fromEntries(envs),
    delete: (n: string) => envs.delete(n),
    clear: () => envs.clear(),
  },

  public: {
    set (n: string, d?: string | string[]) { if (d) publicDirs.set(n, Array.isArray(d) ? d : [d]) },
    get: (n?: string) => n ? (publicDirs.get(n) ?? []) : Object.fromEntries(publicDirs),
    delete: (n: string) => publicDirs.delete(n),
    clear: () => publicDirs.clear(),
  },

  stats: {
    get: () => ({ ...stats, handler: { ...stats.handler } }),
    set (s: Partial<typeof stats>) {
      Object.assign(stats, s)
      if (s.handler) Object.assign(stats.handler, s.handler)
    },
    inc (k: 'pkg' | 'command' | 'accept' | 'button' | 'task', n = 1) { stats[k] += n },
    incHandler (k: 'key' | 'fnc', n = 1) { stats.handler[k] += n },
    reset () { stats = { pkg: 0, command: 0, accept: 0, button: 0, task: 0, handler: { key: 0, fnc: 0 } } },
  },

  missingDeps: {
    add (pkg: string, file: string, dep: { type: 'import' | 'error', deps?: string, error?: unknown }) {
      let m = missingDeps.get(pkg)
      if (!m) { m = new Map(); missingDeps.set(pkg, m) }
      let l = m.get(file)
      if (!l) { l = []; m.set(file, l) }
      l.push(dep)
    },
    get (pkg?: string) {
      if (!pkg) return Object.fromEntries([...missingDeps].map(([k, v]) => [k, Object.fromEntries(v)]))
      const m = missingDeps.get(pkg)
      return m ? Object.fromEntries(m) : null
    },
    clear (pkg?: string) { pkg ? missingDeps.delete(pkg) : missingDeps.clear() },
    print () {
      if (!missingDeps.size) return
      console.warn('\n⚠️  缺失依赖警告\n' + '─'.repeat(50))
      for (const [p, files] of missingDeps) {
        console.warn(`📦 ${p}:`)
        for (const [f, deps] of files) {
          const im = deps.filter(d => d.type === 'import').map(d => d.deps)
          if (im.length) console.warn(`   ${f}: ${im.join(', ')}`)
        }
      }
      console.warn('─'.repeat(50) + '\n')
    },
  },

  clearAll () {
    packages.clear(); fileIdx.clear()
    for (const s of Object.values(stores)) s.clear()
    data.clear(); engines.clear(); envs.clear(); publicDirs.clear(); missingDeps.clear()
    stats = { pkg: 0, command: 0, accept: 0, button: 0, task: 0, handler: { key: 0, fnc: 0 } }
  },
}

export type CacheAPI = typeof cache
