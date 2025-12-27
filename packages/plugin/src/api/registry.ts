/**
 * Registry API - 极简注册中心
 * @module api/registry
 */

import { cache } from './cache'
import { event } from './event'
import type { PluginType, RegistryItem, RegisterOptions } from '../types'

let id = 0
const genId = (t: PluginType) => `${t}_${++id}_${Date.now().toString(36)}`

export const registry = {
  register<T> (type: PluginType, instance: T, pkg: string, file: string, opts: RegisterOptions = {}): string {
    const item: RegistryItem<T> = {
      id: genId(type),
      type,
      pkg,
      file,
      priority: opts.priority ?? 0,
      enabled: true,
      instance,
      metadata: opts.metadata,
    }
    cache.instance.add(type, item.id, item as RegistryItem)
    event.emit('registry:add', { type, id: item.id, item: item as RegistryItem })
    return item.id
  },

  unregister (type: PluginType, id: string) {
    const ok = cache.instance.delete(type, id)
    if (ok) event.emit('registry:remove', { type, id })
    return ok
  },

  unregisterByFile (file: string) {
    const c = cache.instance.deleteByFile(file)
    if (c) event.emit('file:remove', { file, unregistered: c })
    return c
  },

  unregisterByPackage: (pkg: string) => cache.instance.deleteByPackage(pkg),

  get: (type: PluginType, id: string) => cache.instance.get(type, id),
  getAll: (type: PluginType) => cache.instance.getAll(type),
  getByFile: (file: string) => cache.instance.getByFile(file),
  getByPackage: (pkg: string) => cache.instance.getByPackage(pkg),
  getEnabled: (type: PluginType) => cache.instance.getAll(type).filter(i => i.enabled),

  sort (type?: PluginType) {
    const types: PluginType[] = type ? [type] : ['command', 'accept', 'handler', 'button', 'task']
    for (const t of types) {
      const store = cache.instance.getStore(t)
      const sorted = [...store.entries()].sort(([, a], [, b]) => b.priority - a.priority)
      store.clear()
      for (const [k, v] of sorted) store.set(k, v)
    }
    event.emit('registry:sort', { type })
  },

  enable (type: PluginType, id: string) {
    const item = cache.instance.get(type, id)
    if (item) { item.enabled = true; return true }
    return false
  },

  disable (type: PluginType, id: string) {
    const item = cache.instance.get(type, id)
    if (item) { item.enabled = false; return true }
    return false
  },

  stats: () => ({
    command: cache.instance.count('command'),
    accept: cache.instance.count('accept'),
    handler: cache.instance.count('handler'),
    button: cache.instance.count('button'),
    task: cache.instance.count('task'),
  }),
}

export type RegistryAPI = typeof registry
