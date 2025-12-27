/**
 * Registry API 单元测试
 * @module tests/registry.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { registry } from '../src/api/registry'
import { cache } from '../src/api/cache'
import { event } from '../src/api/event'

describe('Registry API', () => {
  beforeEach(() => {
    cache.clearAll()
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should register a component and return id', () => {
      const id = registry.register('command', { test: true }, 'test-pkg', '/file.ts')

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('command')
    })

    it('should generate unique ids', () => {
      const id1 = registry.register('command', {}, 'pkg', '/file.ts')
      const id2 = registry.register('command', {}, 'pkg', '/file.ts')

      expect(id1).not.toBe(id2)
    })

    it('should store component in cache', () => {
      const instance = { callback: () => { } }
      const id = registry.register('command', instance, 'pkg', '/file.ts')

      const item = cache.instance.get('command', id)
      expect(item).toBeDefined()
      expect(item?.instance).toBe(instance)
    })

    it('should set default priority to 0', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')

      const item = cache.instance.get('command', id)
      expect(item?.priority).toBe(0)
    })

    it('should set custom priority', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts', { priority: 100 })

      const item = cache.instance.get('command', id)
      expect(item?.priority).toBe(100)
    })

    it('should set metadata', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts', {
        metadata: { rule: '^test$', desc: 'Test command' },
      })

      const item = cache.instance.get('command', id)
      expect(item?.metadata).toEqual({ rule: '^test$', desc: 'Test command' })
    })

    it('should emit registry:add event', () => {
      registry.register('command', {}, 'pkg', '/file.ts')

      expect(event.emit).toHaveBeenCalledWith(
        'registry:add',
        expect.objectContaining({
          type: 'command',
          id: expect.any(String),
        })
      )
    })

    it('should set enabled to true by default', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')

      const item = cache.instance.get('command', id)
      expect(item?.enabled).toBe(true)
    })
  })

  describe('unregister', () => {
    it('should unregister a component', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      const result = registry.unregister('command', id)

      expect(result).toBe(true)
      expect(cache.instance.get('command', id)).toBeUndefined()
    })

    it('should return false for non-existent component', () => {
      const result = registry.unregister('command', 'non-existent')
      expect(result).toBe(false)
    })

    it('should emit registry:remove event', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      vi.clearAllMocks()

      registry.unregister('command', id)

      expect(event.emit).toHaveBeenCalledWith('registry:remove', { type: 'command', id })
    })

    it('should not emit event when unregister fails', () => {
      vi.clearAllMocks()
      registry.unregister('command', 'non-existent')

      expect(event.emit).not.toHaveBeenCalledWith(
        'registry:remove',
        expect.anything()
      )
    })
  })

  describe('unregisterByFile', () => {
    it('should unregister all components from a file', () => {
      registry.register('command', {}, 'pkg', '/file1.ts')
      registry.register('accept', {}, 'pkg', '/file1.ts')
      registry.register('command', {}, 'pkg', '/file2.ts')

      const count = registry.unregisterByFile('/file1.ts')

      expect(count).toBe(2)
      expect(cache.instance.getByFile('/file1.ts').length).toBe(0)
      expect(cache.instance.getByFile('/file2.ts').length).toBe(1)
    })

    it('should emit file:remove event when components are removed', () => {
      registry.register('command', {}, 'pkg', '/file1.ts')
      vi.clearAllMocks()

      registry.unregisterByFile('/file1.ts')

      expect(event.emit).toHaveBeenCalledWith('file:remove', {
        file: '/file1.ts',
        unregistered: 1,
      })
    })

    it('should not emit event when no components are removed', () => {
      vi.clearAllMocks()
      registry.unregisterByFile('/non-existent.ts')

      expect(event.emit).not.toHaveBeenCalledWith('file:remove', expect.anything())
    })
  })

  describe('unregisterByPackage', () => {
    it('should unregister all components from a package', () => {
      registry.register('command', {}, 'pkg1', '/file1.ts')
      registry.register('accept', {}, 'pkg1', '/file2.ts')
      registry.register('command', {}, 'pkg2', '/file3.ts')

      const count = registry.unregisterByPackage('pkg1')

      expect(count).toBe(2)
      expect(cache.instance.getByPackage('pkg1').length).toBe(0)
      expect(cache.instance.getByPackage('pkg2').length).toBe(1)
    })
  })

  describe('get', () => {
    it('should get a component by type and id', () => {
      const id = registry.register('command', { test: true }, 'pkg', '/file.ts')

      const item = registry.get('command', id)
      expect(item).toBeDefined()
      expect(item?.instance).toEqual({ test: true })
    })

    it('should return undefined for non-existent component', () => {
      expect(registry.get('command', 'non-existent')).toBeUndefined()
    })
  })

  describe('getAll', () => {
    it('should get all components of a type', () => {
      registry.register('command', {}, 'pkg', '/file.ts')
      registry.register('command', {}, 'pkg', '/file.ts')
      registry.register('accept', {}, 'pkg', '/file.ts')

      const commands = registry.getAll('command')
      expect(commands.length).toBe(2)
      expect(commands.every(c => c.type === 'command')).toBe(true)
    })

    it('should return empty array when no components exist', () => {
      expect(registry.getAll('command')).toEqual([])
    })
  })

  describe('getByFile', () => {
    it('should get all components from a file', () => {
      registry.register('command', {}, 'pkg', '/file1.ts')
      registry.register('accept', {}, 'pkg', '/file1.ts')
      registry.register('command', {}, 'pkg', '/file2.ts')

      const items = registry.getByFile('/file1.ts')
      expect(items.length).toBe(2)
      expect(items.every(i => i.file === '/file1.ts')).toBe(true)
    })
  })

  describe('getByPackage', () => {
    it('should get all components from a package', () => {
      registry.register('command', {}, 'pkg1', '/file1.ts')
      registry.register('accept', {}, 'pkg1', '/file2.ts')
      registry.register('command', {}, 'pkg2', '/file3.ts')

      const items = registry.getByPackage('pkg1')
      expect(items.length).toBe(2)
      expect(items.every(i => i.pkg === 'pkg1')).toBe(true)
    })
  })

  describe('sort', () => {
    it('should sort components by priority (descending)', () => {
      registry.register('command', { name: 'low' }, 'pkg', '/file.ts', { priority: 10 })
      registry.register('command', { name: 'high' }, 'pkg', '/file.ts', { priority: 100 })
      registry.register('command', { name: 'mid' }, 'pkg', '/file.ts', { priority: 50 })

      registry.sort('command')

      const commands = registry.getAll('command')
      expect((commands[0].instance as any).name).toBe('high')
      expect((commands[1].instance as any).name).toBe('mid')
      expect((commands[2].instance as any).name).toBe('low')
    })

    it('should sort all types when no type specified', () => {
      registry.register('command', { name: 'cmd-low' }, 'pkg', '/file.ts', { priority: 10 })
      registry.register('command', { name: 'cmd-high' }, 'pkg', '/file.ts', { priority: 100 })
      registry.register('accept', { name: 'acc-low' }, 'pkg', '/file.ts', { priority: 10 })
      registry.register('accept', { name: 'acc-high' }, 'pkg', '/file.ts', { priority: 100 })

      registry.sort()

      const commands = registry.getAll('command')
      const accepts = registry.getAll('accept')

      expect((commands[0].instance as any).name).toBe('cmd-high')
      expect((accepts[0].instance as any).name).toBe('acc-high')
    })

    it('should emit registry:sort event', () => {
      vi.clearAllMocks()
      registry.sort('command')

      expect(event.emit).toHaveBeenCalledWith('registry:sort', { type: 'command' })
    })

    it('should emit registry:sort event with undefined type when sorting all', () => {
      vi.clearAllMocks()
      registry.sort()

      expect(event.emit).toHaveBeenCalledWith('registry:sort', { type: undefined })
    })
  })

  describe('enable / disable', () => {
    it('should enable a component', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      const item = cache.instance.get('command', id)!
      item.enabled = false

      const result = registry.enable('command', id)

      expect(result).toBe(true)
      expect(item.enabled).toBe(true)
    })

    it('should disable a component', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')

      const result = registry.disable('command', id)

      expect(result).toBe(true)
      expect(cache.instance.get('command', id)?.enabled).toBe(false)
    })

    it('should return false when enabling non-existent component', () => {
      expect(registry.enable('command', 'non-existent')).toBe(false)
    })

    it('should return false when disabling non-existent component', () => {
      expect(registry.disable('command', 'non-existent')).toBe(false)
    })
  })

  describe('getEnabled', () => {
    it('should get only enabled components', () => {
      const id1 = registry.register('command', { name: 'enabled' }, 'pkg', '/file.ts')
      const id2 = registry.register('command', { name: 'disabled' }, 'pkg', '/file.ts')

      registry.disable('command', id2)

      const enabled = registry.getEnabled('command')
      expect(enabled.length).toBe(1)
      expect((enabled[0].instance as any).name).toBe('enabled')
    })

    it('should return empty array when all components are disabled', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      registry.disable('command', id)

      expect(registry.getEnabled('command')).toEqual([])
    })
  })

  describe('stats', () => {
    it('should return correct stats', () => {
      registry.register('command', {}, 'pkg', '/file.ts')
      registry.register('command', {}, 'pkg', '/file.ts')
      registry.register('accept', {}, 'pkg', '/file.ts')
      registry.register('handler', {}, 'pkg', '/file.ts')

      const stats = registry.stats()

      expect(stats.command).toBe(2)
      expect(stats.accept).toBe(1)
      expect(stats.handler).toBe(1)
      expect(stats.button).toBe(0)
      expect(stats.task).toBe(0)
    })

    it('should return all zeros when no components registered', () => {
      const stats = registry.stats()

      expect(stats.command).toBe(0)
      expect(stats.accept).toBe(0)
      expect(stats.handler).toBe(0)
      expect(stats.button).toBe(0)
      expect(stats.task).toBe(0)
    })
  })
})
