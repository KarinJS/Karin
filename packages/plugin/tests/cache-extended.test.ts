/**
 * cache.ts 未覆盖行测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache } from '../src/api/cache'

describe('cache extended coverage', () => {
  beforeEach(() => {
    cache.clearAll()
  })

  describe('engines', () => {
    it('should set and get single engine', () => {
      cache.engines.set('test-pkg', { version: '^1.0.0', ignoreEngines: false })
      expect(cache.engines.get('test-pkg')).toEqual({ version: '^1.0.0', ignoreEngines: false })
    })

    it('should get all engines when no name provided', () => {
      cache.engines.set('pkg1', { version: '^1.0.0', ignoreEngines: false })
      cache.engines.set('pkg2', { version: '^2.0.0', ignoreEngines: true })
      const all = cache.engines.get() as Record<string, { version: string, ignoreEngines: boolean }>
      expect(all.pkg1).toBeDefined()
      expect(all.pkg2).toBeDefined()
    })

    it('should delete engine', () => {
      cache.engines.set('pkg', { version: '1.0.0', ignoreEngines: false })
      cache.engines.delete('pkg')
      expect(cache.engines.get('pkg')).toBeUndefined()
    })

    it('should clear all engines', () => {
      cache.engines.set('pkg', { version: '1.0.0', ignoreEngines: false })
      cache.engines.clear()
      expect(cache.engines.get()).toEqual({})
    })
  })

  describe('envs', () => {
    it('should set and get single env', () => {
      const env = { KEY: { value: 'val', comment: 'test' } }
      cache.envs.set('pkg', env)
      expect(cache.envs.get('pkg')).toEqual(env)
    })

    it('should get all envs when no name provided', () => {
      cache.envs.set('pkg1', { A: { value: '1', comment: '' } })
      cache.envs.set('pkg2', { B: { value: '2', comment: '' } })
      const all = cache.envs.get() as Record<string, unknown>
      expect(all.pkg1).toBeDefined()
      expect(all.pkg2).toBeDefined()
    })

    it('should delete env', () => {
      cache.envs.set('pkg', { X: { value: 'x', comment: '' } })
      cache.envs.delete('pkg')
      expect(cache.envs.get('pkg')).toBeUndefined()
    })

    it('should clear all envs', () => {
      cache.envs.set('pkg', { Y: { value: 'y', comment: '' } })
      cache.envs.clear()
      expect(cache.envs.get()).toEqual({})
    })
  })

  describe('public', () => {
    it('should set string public dir', () => {
      cache.public.set('pkg', './public')
      expect(cache.public.get('pkg')).toEqual(['./public'])
    })

    it('should set array public dirs', () => {
      cache.public.set('pkg', ['./public', './dist'])
      expect(cache.public.get('pkg')).toEqual(['./public', './dist'])
    })

    it('should not set if dir is undefined', () => {
      cache.public.set('pkg', undefined)
      expect(cache.public.get('pkg')).toEqual([])
    })

    it('should get all public dirs when no name provided', () => {
      cache.public.set('pkg1', './p1')
      cache.public.set('pkg2', './p2')
      const all = cache.public.get() as Record<string, string[]>
      expect(all.pkg1).toEqual(['./p1'])
      expect(all.pkg2).toEqual(['./p2'])
    })

    it('should delete public dir', () => {
      cache.public.set('pkg', './public')
      cache.public.delete('pkg')
      expect(cache.public.get('pkg')).toEqual([])
    })

    it('should clear all public dirs', () => {
      cache.public.set('pkg', './public')
      cache.public.clear()
      expect(cache.public.get()).toEqual({})
    })
  })

  describe('stats', () => {
    it('should get initial stats', () => {
      const stats = cache.stats.get()
      expect(stats.pkg).toBe(0)
      expect(stats.command).toBe(0)
      expect(stats.handler.key).toBe(0)
    })

    it('should set partial stats', () => {
      cache.stats.set({ pkg: 5, command: 10 })
      const stats = cache.stats.get()
      expect(stats.pkg).toBe(5)
      expect(stats.command).toBe(10)
    })

    it('should set handler stats', () => {
      cache.stats.set({ handler: { key: 3, fnc: 7 } })
      const stats = cache.stats.get()
      expect(stats.handler.key).toBe(3)
      expect(stats.handler.fnc).toBe(7)
    })

    it('should increment stats', () => {
      cache.stats.inc('pkg', 2)
      cache.stats.inc('command')
      expect(cache.stats.get().pkg).toBe(2)
      expect(cache.stats.get().command).toBe(1)
    })

    it('should increment handler stats', () => {
      cache.stats.incHandler('key', 5)
      cache.stats.incHandler('fnc')
      expect(cache.stats.get().handler.key).toBe(5)
      expect(cache.stats.get().handler.fnc).toBe(1)
    })

    it('should reset stats', () => {
      cache.stats.inc('pkg', 10)
      cache.stats.incHandler('key', 5)
      cache.stats.reset()
      const stats = cache.stats.get()
      expect(stats.pkg).toBe(0)
      expect(stats.handler.key).toBe(0)
    })
  })

  describe('missingDeps', () => {
    it('should add missing import dep', () => {
      cache.missingDeps.add('pkg', 'file.ts', { type: 'import', deps: 'lodash' })
      const deps = cache.missingDeps.get('pkg') as Record<string, unknown[]>
      expect(deps['file.ts']).toBeDefined()
      expect(deps['file.ts'].length).toBe(1)
    })

    it('should add multiple deps to same file', () => {
      cache.missingDeps.add('pkg', 'file.ts', { type: 'import', deps: 'lodash' })
      cache.missingDeps.add('pkg', 'file.ts', { type: 'import', deps: 'axios' })
      const deps = cache.missingDeps.get('pkg') as Record<string, unknown[]>
      expect(deps['file.ts'].length).toBe(2)
    })

    it('should add error dep', () => {
      cache.missingDeps.add('pkg', 'file.ts', { type: 'error', error: new Error('test') })
      const deps = cache.missingDeps.get('pkg') as Record<string, unknown[]>
      expect(deps['file.ts'][0]).toHaveProperty('type', 'error')
    })

    it('should get all missing deps when no pkg provided', () => {
      cache.missingDeps.add('pkg1', 'a.ts', { type: 'import', deps: 'x' })
      cache.missingDeps.add('pkg2', 'b.ts', { type: 'import', deps: 'y' })
      const all = cache.missingDeps.get() as Record<string, unknown>
      expect(all.pkg1).toBeDefined()
      expect(all.pkg2).toBeDefined()
    })

    it('should return null for unknown pkg', () => {
      expect(cache.missingDeps.get('unknown')).toBeNull()
    })

    it('should clear specific pkg deps', () => {
      cache.missingDeps.add('pkg', 'file.ts', { type: 'import', deps: 'x' })
      cache.missingDeps.clear('pkg')
      expect(cache.missingDeps.get('pkg')).toBeNull()
    })

    it('should clear all deps', () => {
      cache.missingDeps.add('pkg1', 'a.ts', { type: 'import', deps: 'x' })
      cache.missingDeps.add('pkg2', 'b.ts', { type: 'import', deps: 'y' })
      cache.missingDeps.clear()
      expect(cache.missingDeps.get()).toEqual({})
    })

    it('should print nothing when no deps', () => {
      // 不应该抛出错误
      cache.missingDeps.print()
    })

    it('should print missing deps warning', () => {
      const warnSpy = vi.fn()
      const originalWarn = console.warn
      console.warn = warnSpy

      cache.missingDeps.add('pkg', 'file.ts', { type: 'import', deps: 'lodash' })
      cache.missingDeps.print()

      expect(warnSpy).toHaveBeenCalled()
      console.warn = originalWarn
    })
  })

  describe('clearAll', () => {
    it('should clear all caches', () => {
      // 添加各种数据
      cache.package.add('pkg', { files: ['/a.ts'], root: '/root', main: 'index.ts', mainPath: '/root/index.ts', type: 'apps' })
      cache.instance.add('command', 'id1', { id: 'id1', type: 'command', pkg: 'pkg', file: '/a.ts', name: 'test', reg: /t/, priority: 1, callback: () => { } })
      cache.data.set('key', 'value')
      cache.engines.set('pkg', { version: '1.0.0', ignoreEngines: false })
      cache.envs.set('pkg', {})
      cache.public.set('pkg', './public')
      cache.stats.inc('pkg', 5)
      cache.missingDeps.add('pkg', 'f.ts', { type: 'import', deps: 'x' })

      cache.clearAll()

      expect(cache.package.get('pkg')).toBeUndefined()
      expect(cache.data.get('key')).toBeUndefined()
      expect(cache.engines.get()).toEqual({})
      expect(cache.envs.get()).toEqual({})
      expect(cache.public.get()).toEqual({})
      expect(cache.stats.get().pkg).toBe(0)
      expect(cache.missingDeps.get()).toEqual({})
    })
  })
})
