/**
 * Store 深度边缘情况测试
 * 测试 Store 的各种极端场景和并发操作
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { store } from '../src/store'
import type { PluginType } from '../src/store'

function createPlugin (
  type: PluginType,
  id: string,
  opts: { file?: string; pkg?: string; priority?: number; key?: string; name?: string } = {}
) {
  return {
    id,
    type,
    name: opts.name ?? id,
    packageName: opts.pkg ?? 'test-pkg',
    priority: opts.priority ?? 10000,
    file: { absPath: opts.file ?? '/test/plugin.ts' },
    callerPath: opts.file ?? '/test/plugin.ts',
    key: opts.key,
    options: { priority: opts.priority ?? 10000, name: opts.name ?? id },
  } as any
}

describe('Store 深度测试', () => {
  beforeEach(() => {
    store.clear()
  })

  afterEach(() => {
    store.clear()
  })

  describe('插件添加边缘情况', () => {
    it('应该处理 ID 包含特殊字符', () => {
      const specialIds = [
        'id:with:colons',
        'id/with/slashes',
        'id.with.dots',
        'id-with-dashes',
        'id_with_underscores',
        'id@with@at',
        'id#with#hash',
        'id$with$dollar',
        'id with spaces',
        'id\twith\ttabs',
        'id\nwith\nnewlines',
        '中文ID',
        'emoji🔥id',
        '!@#$%^&*()',
      ]

      for (const id of specialIds) {
        const plugin = createPlugin('command', id)
        store.add('command', plugin)
        expect(store.has(id)).toBe(true)
        expect(store.getById(id)).toBe(plugin)
      }
    })

    it('应该处理空字符串 ID (应该被忽略)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      store.add('command', createPlugin('command', ''))

      expect(store.has('')).toBe(false)
      warnSpy.mockRestore()
    })

    it('应该处理 undefined ID (应该被忽略)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      store.add('command', { type: 'command', id: undefined } as any)

      expect(store.get('command').length).toBe(0)
      warnSpy.mockRestore()
    })

    it('应该处理 null ID (应该被忽略)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      store.add('command', { type: 'command', id: null } as any)

      expect(store.get('command').length).toBe(0)
      warnSpy.mockRestore()
    })

    it('应该处理所有插件类型', () => {
      const types: PluginType[] = ['command', 'accept', 'handler', 'button', 'task']

      for (const type of types) {
        store.add(type, createPlugin(type, `${type}-plugin`))
        expect(store.get(type).length).toBe(1)
      }
    })

    it('应该处理大量插件添加', () => {
      const count = 10000

      for (let i = 0; i < count; i++) {
        store.add('command', createPlugin('command', `cmd-${i}`, { priority: i }))
      }

      expect(store.get('command').length).toBe(count)
      expect(store.stats().command.total).toBe(count)
    })

    it('应该处理同一文件的多个插件', () => {
      const file = '/shared/file.ts'

      store.add('command', createPlugin('command', 'c1', { file }))
      store.add('command', createPlugin('command', 'c2', { file }))
      store.add('accept', createPlugin('accept', 'a1', { file }))
      store.add('handler', createPlugin('handler', 'h1', { file, key: 'test' }))
      store.add('button', createPlugin('button', 'b1', { file }))
      store.add('task', createPlugin('task', 't1', { file }))

      expect(store.getByFile(file).length).toBe(6)
    })
  })

  describe('插件删除边缘情况', () => {
    it('应该正确清理文件索引', () => {
      const file = '/cleanup/file.ts'
      store.add('command', createPlugin('command', 'c1', { file }))

      expect(store.getByFile(file).length).toBe(1)

      store.del('c1')

      expect(store.getByFile(file).length).toBe(0)
    })

    it('应该正确清理包索引', () => {
      const pkg = 'cleanup-pkg'
      store.registerPackage({ name: pkg, type: 'npm', abs: '/path', pkgPath: '/path/package.json' })
      store.add('command', createPlugin('command', 'c1', { pkg }))

      expect(store.getByPkg(pkg).length).toBe(1)

      store.del('c1')

      expect(store.getByPkg(pkg).length).toBe(0)
    })

    it('应该正确清理 handler key 索引', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: 'render' }))
      store.add('handler', createPlugin('handler', 'h2', { key: 'render' }))

      expect(store.getHandler('render').length).toBe(2)

      store.del('h1')

      expect(store.getHandler('render').length).toBe(1)
    })

    it('应该处理删除后重新添加同 ID', () => {
      store.add('command', createPlugin('command', 'reuse', { priority: 100 }))
      store.del('reuse')
      store.add('command', createPlugin('command', 'reuse', { priority: 200 }))

      expect(store.getById('reuse')?.priority).toBe(200)
    })

    it('应该处理 delByFile 部分删除', () => {
      store.add('command', createPlugin('command', 'c1', { file: '/file1.ts' }))
      store.add('command', createPlugin('command', 'c2', { file: '/file2.ts' }))
      store.add('command', createPlugin('command', 'c3', { file: '/file1.ts' }))

      const deleted = store.delByFile('/file1.ts')

      expect(deleted).toBe(2)
      expect(store.has('c1')).toBe(false)
      expect(store.has('c2')).toBe(true)
      expect(store.has('c3')).toBe(false)
    })
  })

  describe('优先级排序边缘情况', () => {
    it('应该处理相同优先级', () => {
      store.add('command', createPlugin('command', 'c1', { priority: 100 }))
      store.add('command', createPlugin('command', 'c2', { priority: 100 }))
      store.add('command', createPlugin('command', 'c3', { priority: 100 }))

      const commands = store.get('command')
      expect(commands.length).toBe(3)
    })

    it('应该处理负优先级', () => {
      store.add('command', createPlugin('command', 'c1', { priority: -100 }))
      store.add('command', createPlugin('command', 'c2', { priority: 100 }))
      store.add('command', createPlugin('command', 'c3', { priority: 0 }))

      const commands = store.get('command')
      expect(commands[0].priority).toBe(100)
      expect(commands[1].priority).toBe(0)
      expect(commands[2].priority).toBe(-100)
    })

    it('应该处理优先级更新后的重排序', () => {
      store.add('command', createPlugin('command', 'c1', { priority: 100 }))
      store.add('command', createPlugin('command', 'c2', { priority: 200 }))

      // c2 应该在前
      expect(store.get('command')[0].id).toBe('c2')

      // 更新 c1 的优先级
      store.update('c1', 'priority', 300)
      store.markDirty('command')

      // c1 现在应该在前
      expect(store.get('command')[0].id).toBe('c1')
    })

    it('应该正确使用排序缓存', () => {
      store.add('command', createPlugin('command', 'c1', { priority: 100 }))
      store.add('command', createPlugin('command', 'c2', { priority: 200 }))

      // 第一次获取会排序
      const first = store.get('command')

      // 第二次获取应该使用缓存
      const second = store.get('command')

      expect(first).toBe(second) // 应该是同一个数组引用
    })

    it('应该在添加新插件后标记为 dirty', () => {
      store.add('command', createPlugin('command', 'c1', { priority: 100 }))

      // 获取一次以建立缓存
      store.get('command')

      // 添加新插件
      store.add('command', createPlugin('command', 'c2', { priority: 200 }))

      // 再次获取应该重新排序
      const commands = store.get('command')
      expect(commands[0].id).toBe('c2')
    })
  })

  describe('Handler Key 索引边缘情况', () => {
    it('应该处理空 key (空字符串被视为 falsy，不会索引)', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: '' }))

      const handlers = store.getHandler('')
      // 空字符串 key 在 store.add 中因为 `if (key)` 检查会被跳过
      expect(handlers.length).toBe(0)
    })

    it('应该处理 undefined key', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: undefined }))

      const handlers = store.getHandler(undefined as any)
      expect(handlers.length).toBe(0)
    })

    it('应该处理特殊字符 key', () => {
      const keys = ['key:with:colons', 'key.with.dots', 'key/with/slashes', '中文key', 'emoji🔥key']

      for (const key of keys) {
        store.add('handler', createPlugin('handler', `h-${key}`, { key }))
        expect(store.getHandler(key).length).toBe(1)
      }
    })

    it('应该按优先级排序 handlers', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: 'render', priority: 100 }))
      store.add('handler', createPlugin('handler', 'h2', { key: 'render', priority: 300 }))
      store.add('handler', createPlugin('handler', 'h3', { key: 'render', priority: 200 }))

      const handlers = store.getHandler('render')
      expect(handlers[0].id).toBe('h2')
      expect(handlers[1].id).toBe('h3')
      expect(handlers[2].id).toBe('h1')
    })
  })

  describe('事件系统边缘情况', () => {
    it('应该支持多个监听器', () => {
      const listeners = [vi.fn(), vi.fn(), vi.fn()]

      for (const listener of listeners) {
        store.on('add', listener)
      }

      store.add('command', createPlugin('command', 'c1'))

      for (const listener of listeners) {
        expect(listener).toHaveBeenCalledOnce()
      }
    })

    it('应该支持 off 移除监听器', () => {
      const listener = vi.fn()
      store.on('add', listener)
      store.off('add', listener)

      store.add('command', createPlugin('command', 'c1'))

      expect(listener).not.toHaveBeenCalled()
    })

    it('应该支持 once 一次性监听', () => {
      const listener = vi.fn()
      store.once('add', listener)

      store.add('command', createPlugin('command', 'c1'))
      store.add('command', createPlugin('command', 'c2'))

      expect(listener).toHaveBeenCalledOnce()
    })

    it('应该在 clear 时触发事件', () => {
      const listener = vi.fn()
      store.on('clear', listener)

      store.add('command', createPlugin('command', 'c1'))
      store.clear()

      expect(listener).toHaveBeenCalled()
    })

    it('应该在 sort 时触发事件', () => {
      const listener = vi.fn()
      store.on('sort', listener)

      store.add('command', createPlugin('command', 'c1'))
      store.get('command') // 触发排序

      expect(listener).toHaveBeenCalledWith('command')
    })
  })

  describe('文件和包注册边缘情况', () => {
    it('应该正确注册文件', () => {
      store.registerFile('/test/file.ts', 'test-pkg')

      const fileInfo = store.getFileInfo('/test/file.ts')
      expect(fileInfo).toBeDefined()
      expect(fileInfo?.pkg).toBe('test-pkg')
    })

    it('应该忽略重复注册的文件', () => {
      store.registerFile('/test/file.ts', 'pkg1')
      store.registerFile('/test/file.ts', 'pkg2') // 应该被忽略

      const fileInfo = store.getFileInfo('/test/file.ts')
      expect(fileInfo?.pkg).toBe('pkg1')
    })

    it('应该正确注册包', () => {
      store.registerPackage({
        name: 'test-pkg',
        type: 'npm',
        abs: '/path/to/pkg',
        pkgPath: '/path/to/pkg/package.json',
      })

      const pkgInfo = store.getPackageInfo('test-pkg')
      expect(pkgInfo).toBeDefined()
      expect(pkgInfo?.type).toBe('npm')
    })

    it('应该忽略重复注册的包', () => {
      store.registerPackage({
        name: 'dup-pkg',
        type: 'npm',
        abs: '/old',
        pkgPath: '/old/package.json',
      })

      store.registerPackage({
        name: 'dup-pkg',
        type: 'apps',
        abs: '/new',
        pkgPath: '/new/package.json',
      })

      const pkgInfo = store.getPackageInfo('dup-pkg')
      expect(pkgInfo?.abs).toBe('/old') // 第一个注册的
    })
  })

  describe('统计信息边缘情况', () => {
    it('应该正确统计空 store', () => {
      const stats = store.stats()

      expect(stats.command.total).toBe(0)
      expect(stats.accept.total).toBe(0)
      expect(stats.handler.total).toBe(0)
      expect(stats.button.total).toBe(0)
      expect(stats.task.total).toBe(0)
      expect(stats.files).toBe(0)
      expect(stats.packages).toBe(0)
    })

    it('应该正确统计 handler keys', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: 'render' }))
      store.add('handler', createPlugin('handler', 'h2', { key: 'render' }))
      store.add('handler', createPlugin('handler', 'h3', { key: 'puppeteer' }))

      const stats = store.stats()
      expect(stats.handler.keys).toBe(2) // render 和 puppeteer
      expect(stats.handler.total).toBe(3)
    })

    it('应该正确统计 active/disabled', () => {
      store.add('command', {
        ...createPlugin('command', 'c1'),
        info: { disable: false },
      })

      store.add('command', {
        ...createPlugin('command', 'c2'),
        info: { disable: true },
      })

      const stats = store.stats()
      expect(stats.command.active).toBe(1)
      expect(stats.command.disabled).toBe(1)
    })
  })

  describe('dump 调试功能', () => {
    it('应该导出所有数据', () => {
      store.registerPackage({ name: 'pkg', type: 'npm', abs: '/path', pkgPath: '/path/package.json' })
      store.registerFile('/path/file.ts', 'pkg')
      store.add('command', createPlugin('command', 'c1', { file: '/path/file.ts', pkg: 'pkg' }))
      store.add('handler', createPlugin('handler', 'h1', { key: 'render' }))

      const dump = store.dump() as any

      expect(dump.command).toBeDefined()
      expect(dump.handler).toBeDefined()
      expect(dump.fileIndex).toBeDefined()
      expect(dump.pkgIndex).toBeDefined()
    })
  })

  describe('clear 边缘情况', () => {
    it('应该清空特定类型', () => {
      store.add('command', createPlugin('command', 'c1'))
      store.add('accept', createPlugin('accept', 'a1'))

      store.clear('command')

      expect(store.get('command').length).toBe(0)
      expect(store.get('accept').length).toBe(1)
    })

    it('应该清空所有类型', () => {
      store.add('command', createPlugin('command', 'c1'))
      store.add('accept', createPlugin('accept', 'a1'))
      store.add('handler', createPlugin('handler', 'h1', { key: 'test' }))
      store.add('button', createPlugin('button', 'b1'))
      store.add('task', createPlugin('task', 't1'))

      store.clear()

      expect(store.get('command').length).toBe(0)
      expect(store.get('accept').length).toBe(0)
      expect(store.get('handler').length).toBe(0)
      expect(store.get('button').length).toBe(0)
      expect(store.get('task').length).toBe(0)
    })

    it('应该清空 handler key 索引', () => {
      store.add('handler', createPlugin('handler', 'h1', { key: 'render' }))

      expect(store.getHandler('render').length).toBe(1)

      store.clear('handler')

      expect(store.getHandler('render').length).toBe(0)
    })
  })

  describe('update 边缘情况', () => {
    it('应该更新任意属性', () => {
      store.add('command', createPlugin('command', 'c1', { name: 'original' }))

      store.update('c1', 'name', 'updated')

      expect((store.getById('c1') as any).name).toBe('updated')
    })

    it('应该触发 update 事件', () => {
      const listener = vi.fn()
      store.on('update', listener)

      store.add('command', createPlugin('command', 'c1', { priority: 100 }))
      store.update('c1', 'priority', 200)

      expect(listener).toHaveBeenCalledWith('command', 'c1', 'priority', 200, 100)
    })

    it('应该在更新 priority 后标记 dirty', () => {
      store.add('command', createPlugin('command', 'c1', { priority: 100 }))
      store.add('command', createPlugin('command', 'c2', { priority: 200 }))

      // 获取一次建立缓存
      store.get('command')

      // 更新 priority
      store.update('c1', 'priority', 300)

      // 再次获取应该重新排序
      const commands = store.get('command')
      expect(commands[0].id).toBe('c1')
    })
  })

  describe('disable/enable 边缘情况', () => {
    it('disable 应该返回是否存在', () => {
      store.add('command', createPlugin('command', 'c1'))

      expect(store.disable('c1')).toBe(true)
      expect(store.disable('non-existent')).toBe(false)
    })

    it('enable 应该返回是否存在', () => {
      store.add('command', createPlugin('command', 'c1'))

      expect(store.enable('c1')).toBe(true)
      expect(store.enable('non-existent')).toBe(false)
    })
  })
})
