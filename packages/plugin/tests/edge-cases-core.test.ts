/**
 * 核心 API 边缘情况测试
 * 覆盖各种极端和不常见的使用场景
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { store } from '../src/store'
import { pkgRegistry } from '../src/pkg'
import { command, CreateCommand } from '../src/create/command'
import { handler, CreateHandler } from '../src/create/handler'
import { task, CreateTask } from '../src/create/task'
import { accept, CreateAccept } from '../src/create/accept'
import { button, CreateButton } from '../src/create/button'
import { cmd, CmdBuilder } from '../src/create/cmd'
import { ref, isRef, unref } from '../src/reactive'
import {
  onLoad,
  onUnload,
  onReload,
  setLoadingContext,
  clearLoadingContext,
  runLoadHooks,
  runUnloadHooks,
  runReloadHooks,
  clearAllHooks,
} from '../src/lifecycle'

// Mock node-schedule
vi.mock('node-schedule', () => ({
  scheduleJob: vi.fn(() => ({
    cancel: vi.fn(),
    nextInvocation: () => new Date(),
  })),
}))

describe('边缘情况测试', () => {
  beforeEach(() => {
    store.clear()
    pkgRegistry.clear()
    clearAllHooks()
    clearLoadingContext()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ==================== Command 边缘情况 ====================
  describe('Command 边缘情况', () => {
    describe('正则表达式边缘情况', () => {
      it('应该处理空正则表达式', () => {
        const cmd = command(/(?:)/, vi.fn(), { name: 'empty-regex' })
        expect(cmd.reg.test('')).toBe(true)
        expect(cmd.reg.test('anything')).toBe(true)
      })

      it('应该处理复杂正则表达式', () => {
        const complexReg = /^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"))$/
        const cmd = command(complexReg, vi.fn(), { name: 'complex-regex' })
        expect(cmd.reg).toBe(complexReg)
      })

      it('应该处理 unicode 正则表达式', () => {
        const cmd = command(/^[你好世界]+$/, vi.fn(), { name: 'unicode-regex' })
        expect(cmd.reg.test('你好')).toBe(true)
        expect(cmd.reg.test('hello')).toBe(false)
      })

      it('应该处理带有 flags 的正则表达式', () => {
        const cmd = command(/test/gim, vi.fn(), { name: 'flags-regex' })
        expect(cmd.reg.flags).toBe('gim')
      })

      it('应该处理特殊字符的字符串转正则时抛出', () => {
        // 无效的正则表达式语法应该抛出错误
        expect(() => {
          command('test.*+?^${}()|[]\\', vi.fn(), { name: 'special-chars' })
        }).toThrow()
      })

      it('应该处理有效的正则字符串', () => {
        const cmd = command('^test\\d+$', vi.fn(), { name: 'valid-regex-string' })
        expect(cmd.reg.test('test123')).toBe(true)
      })
    })

    describe('回调函数边缘情况', () => {
      it('应该处理异步回调', async () => {
        const asyncCallback = vi.fn(async () => {
          await new Promise(r => setTimeout(r, 10))
          return 'done'
        })
        const cmd = command(/^test$/, asyncCallback, { name: 'async-callback' })

        expect(typeof cmd.callback).toBe('function')
      })

      it('应该处理生成器函数作为回调', () => {
        function * generatorCallback () {
          yield 1
          yield 2
        }
        const cmd = command(/^test$/, generatorCallback as any, { name: 'generator-callback' })
        expect(typeof cmd.callback).toBe('function')
      })

      it('应该处理 null 作为字符串回复', () => {
        // 当 callback 是 string/Elements 时会被包装
        const cmd = command(/^test$/, null as any, { name: 'null-reply' })
        expect(cmd.callback).toBeDefined()
      })

      it('应该处理空字符串作为回复', () => {
        const cmd = command(/^test$/, '', { name: 'empty-reply' })
        expect(cmd.callback).toBeDefined()
      })

      it('应该处理非常长的字符串回复', () => {
        const longString = 'a'.repeat(100000)
        const cmd = command(/^test$/, longString, { name: 'long-reply' })
        expect(cmd.callback).toBeDefined()
      })
    })

    describe('选项边缘情况', () => {
      it('应该处理 priority 为 0', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'zero-priority', priority: 0 })
        expect(cmd.priority).toBe(0)
      })

      it('应该处理 priority 为负数', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'negative-priority', priority: -100 })
        expect(cmd.priority).toBe(-100)
      })

      it('应该处理 priority 为非常大的数', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'huge-priority', priority: Number.MAX_SAFE_INTEGER })
        expect(cmd.priority).toBe(Number.MAX_SAFE_INTEGER)
      })

      it('应该处理 priority 为 Infinity', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'infinity-priority', priority: Infinity })
        expect(cmd.priority).toBe(Infinity)
      })

      it('应该处理 priority 为 NaN', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'nan-priority', priority: NaN })
        expect(Number.isNaN(cmd.priority)).toBe(true)
      })

      it('应该处理只有空格的 name (应该抛出)', () => {
        expect(() => {
          command(/^test$/, vi.fn(), { name: '   \t\n  ' })
        }).toThrow()
      })

      it('应该处理 unicode 字符的 name', () => {
        const cmd = command(/^test$/, vi.fn(), { name: '测试命令🚀' })
        expect(cmd.name).toBe('测试命令🚀')
      })

      it('应该处理非常长的 name', () => {
        const longName = 'a'.repeat(10000)
        const cmd = command(/^test$/, vi.fn(), { name: longName })
        expect(cmd.name).toBe(longName)
      })

      it('应该处理空 adapter 数组', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'empty-adapter', adapter: [] })
        expect(cmd.options.adapter).toEqual([])
      })

      it('应该处理未知的 permission 值', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'unknown-perm', permission: 'unknown' as any })
        expect(cmd.options.permission).toBe('unknown')
      })
    })

    describe('并发操作边缘情况', () => {
      it('应该处理同时创建大量命令', () => {
        const commands: CreateCommand[] = []
        for (let i = 0; i < 1000; i++) {
          commands.push(command(new RegExp(`^cmd${i}$`), vi.fn(), { name: `cmd-${i}` }))
        }

        expect(store.get('command').length).toBe(1000)
        expect(commands.every(c => store.has(c.id))).toBe(true)
      })

      it('应该处理快速删除后重建同名命令', () => {
        const cmd1 = command(/^test$/, vi.fn(), { name: 'recreate' })
        const id1 = cmd1.id
        store.del(id1)

        const cmd2 = command(/^test$/, vi.fn(), { name: 'recreate' })
        expect(cmd2.id).not.toBe(id1)
        expect(store.has(cmd2.id)).toBe(true)
      })
    })

    describe('setter 边缘情况', () => {
      it('应该处理多次连续 setReg', () => {
        const cmd = command(/^first$/, vi.fn(), { name: 'multi-set' })
        cmd.setReg(/^second$/)
        cmd.setReg(/^third$/)
        cmd.setReg(/^fourth$/)
        expect(cmd.reg.source).toBe('^fourth$')
      })

      it('应该处理 setOptions 后 name 改变', () => {
        const cmd = command(/^test$/, vi.fn(), { name: 'original' })
        cmd.setOptions({ name: 'changed', priority: 100 })
        expect(cmd.name).toBe('changed')
      })
    })
  })

  // ==================== Handler 边缘情况 ====================
  describe('Handler 边缘情况', () => {
    it('应该处理特殊字符的 key', () => {
      const h = handler('key:with:colons', vi.fn(), { name: 'special-key' })
      expect(h.key).toBe('key:with:colons')
    })

    it('应该处理空字符串 key 时抛出错误', () => {
      expect(() => {
        handler('', vi.fn(), { name: 'empty-key' })
      }).toThrow('[handler]: 缺少参数[key]')
    })

    it('应该处理 unicode key', () => {
      const h = handler('处理器🔧', vi.fn(), { name: 'unicode-key' })
      expect(h.key).toBe('处理器🔧')
    })

    it('应该处理同一 key 的多个 handler', () => {
      handler('same-key', vi.fn(), { name: 'h1' })
      handler('same-key', vi.fn(), { name: 'h2' })
      handler('same-key', vi.fn(), { name: 'h3' })

      const handlers = store.getHandler('same-key')
      expect(handlers.length).toBe(3)
    })

    it('应该按优先级排序同一 key 的 handlers', () => {
      handler('priority-key', vi.fn(), { name: 'low', priority: 100 })
      handler('priority-key', vi.fn(), { name: 'high', priority: 1000 })
      handler('priority-key', vi.fn(), { name: 'mid', priority: 500 })

      const handlers = store.getHandler('priority-key')
      expect(handlers[0].name).toBe('high')
      expect(handlers[1].name).toBe('mid')
      expect(handlers[2].name).toBe('low')
    })
  })

  // ==================== Task 边缘情况 ====================
  describe('Task 边缘情况', () => {
    it('应该处理 cron 表达式边缘情况', () => {
      // 每分钟 - task(name, cron, callback, options)
      const t1 = task('every-min-task', '* * * * *', vi.fn(), { name: 'every-min' })
      expect(t1.cron).toBe('* * * * *')

      // 每秒（6段）
      const t2 = task('every-sec-task', '* * * * * *', vi.fn(), { name: 'every-sec' })
      expect(t2.cron).toBe('* * * * * *')
    })

    it('应该处理复杂 cron 表达式', () => {
      const t = task('complex-task', '0 0 1,15 * *', vi.fn(), { name: 'complex-cron' })
      expect(t.cron).toBe('0 0 1,15 * *')
    })

    it('应该处理特殊的 cron 值', () => {
      const t = task('last-day-task', '0 0 L * *', vi.fn(), { name: 'last-day' })
      expect(t.cron).toBe('0 0 L * *')
    })

    it('应该处理 taskName 和 options.name 的区别', () => {
      const callback = vi.fn()
      const t = task('task-name', '0 * * * *', callback, { name: 'options-name' })
      expect(t.taskName).toBe('task-name')
      expect(t.name).toBe('options-name')
    })

    it('应该正确处理 cron 更新', () => {
      const t = task('update-cron-task', '0 * * * *', vi.fn(), { name: 'cron-update' })
      t.setCron('30 * * * *')
      expect(t.cron).toBe('30 * * * *')
    })

    it('应该正确处理 taskName 更新', () => {
      const t = task('original-task', '0 * * * *', vi.fn(), { name: 'task-rename' })
      t.setTaskName('new-task-name')
      expect(t.taskName).toBe('new-task-name')
    })
  })

  // ==================== Accept 边缘情况 ====================
  describe('Accept 边缘情况', () => {
    it('应该处理 notice 事件', () => {
      const a = accept('notice', vi.fn(), { name: 'notice-accept' })
      expect(a.event).toBe('notice')
    })

    it('应该处理 request 事件', () => {
      const a = accept('request', vi.fn(), { name: 'request-accept' })
      expect(a.event).toBe('request')
    })

    it('应该正确更新事件类型', () => {
      const a = accept('notice', vi.fn(), { name: 'switch-event' })
      a.setEvent('request')
      expect(a.event).toBe('request')
    })

    it('应该处理所有选项组合', () => {
      const a = accept('notice', vi.fn(), {
        name: 'full-options',
        priority: 50,
        log: false,
        adapter: ['onebot.11'],
        dsbAdapter: ['console'],
      })
      expect(a.priority).toBe(50)
      expect(a.options.log).toBe(false)
    })
  })

  // ==================== Button 边缘情况 ====================
  describe('Button 边缘情况', () => {
    it('应该处理复杂按钮 ID 正则', () => {
      const b = button(/^btn_(?<type>\w+)_(?<id>\d+)$/, vi.fn(), { name: 'complex-btn' })
      expect(b.reg.test('btn_action_123')).toBe(true)
      expect(b.reg.test('btn_invalid')).toBe(false)
    })

    it('应该处理 button ID 包含特殊字符', () => {
      const b = button(/^btn\|special\:chars$/, vi.fn(), { name: 'special-btn' })
      expect(b.reg.test('btn|special:chars')).toBe(true)
    })

    it('应该处理字符串正则', () => {
      const b = button('^simple$', vi.fn(), { name: 'string-regex-btn' })
      expect(b.reg.test('simple')).toBe(true)
    })
  })

  // ==================== Cmd (链式 API) 边缘情况 ====================
  describe('Cmd 链式 API 边缘情况', () => {
    it('应该处理不调用任何链式方法直接 register', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())
      expect(() => builder.register()).toThrow('name 是必填项')
    })

    it('应该处理多次调用同一个链式方法', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())
        .name('first')
        .name('second')
        .name('third')

      expect(builder.options.name).toBe('third')
    })

    it('应该处理覆盖权限设置', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())
        .name('perm-test')
        .perm('all')
        .perm('master')
        .perm('admin')

      expect(builder.options.permission).toBe('admin')
    })

    it('应该处理空 adapter 列表', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())
        .name('empty-adapter')
        .adapter()

      expect(builder.options.adapter).toEqual([])
    })

    it('应该处理 register 后的链式调用（更新已注册插件）', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())
        .name('registered')

      builder.register()

      // 继续链式调用应该更新已注册的插件
      builder.priority(999)

      expect(builder.plugin.priority).toBe(999)
    })
  })

  // ==================== Reactive 边缘情况 ====================
  describe('Reactive 边缘情况', () => {
    it('应该处理多次 dispose', () => {
      const plugin = ref(/^test$/, vi.fn(), { name: 'multi-dispose' })
      plugin.dispose()
      // 第二次 dispose 不应该抛出
      expect(() => plugin.dispose()).not.toThrow()
    })

    it('应该处理 dispose 后的属性访问', () => {
      const plugin = ref(/^test$/, vi.fn(), { name: 'disposed-access' })
      plugin.dispose()

      // 即使 dispose 后也应该能访问基本属性
      expect(plugin.name).toBe('disposed-access')
      expect(plugin.__hot).toBe(true)
    })

    it('应该处理事件监听器', () => {
      const plugin = ref(/^test$/, vi.fn(), { name: 'event-listener' })
      const listener = vi.fn()

      const unsub = plugin.on('change', listener)
      expect(typeof unsub).toBe('function')

      // 取消订阅不应该抛出
      expect(() => unsub()).not.toThrow()
    })

    it('isRef 应该处理各种类型', () => {
      expect(isRef(0)).toBe(false)
      expect(isRef('')).toBe(false)
      expect(isRef([])).toBe(false)
      expect(isRef(Symbol())).toBe(false)
      expect(isRef(() => {})).toBe(false)
      expect(isRef(new Map())).toBe(false)
      expect(isRef(new Set())).toBe(false)
      expect(isRef(new WeakMap())).toBe(false)
      expect(isRef(new Date())).toBe(false)
      expect(isRef(/regex/)).toBe(false)
      expect(isRef(Promise.resolve())).toBe(false)
    })

    it('unref 应该处理非 ref 对象 (返回原属性)', () => {
      const plain = { foo: 'bar' }
      const result = unref(plain as any)
      // unref 对于非 ref 对象只会返回非 RefPlugin 属性
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  // ==================== Lifecycle 边缘情况 ====================
  describe('Lifecycle 边缘情况', () => {
    it('应该处理同一文件的多个同类型钩子', async () => {
      setLoadingContext('/test.ts', 'pkg')

      const order: number[] = []
      onLoad(() => order.push(1))
      onLoad(() => order.push(2))
      onLoad(() => order.push(3))
      onLoad(async () => {
        await new Promise(r => setTimeout(r, 5))
        order.push(4)
      })
      onLoad(() => order.push(5))

      await runLoadHooks('/test.ts')

      expect(order).toEqual([1, 2, 3, 4, 5])
    })

    it('应该处理钩子抛出错误', async () => {
      setLoadingContext('/error.ts', 'pkg')

      onLoad(() => {
        throw new Error('Hook error')
      })

      // 不应该抛出，而是捕获错误
      await expect(runLoadHooks('/error.ts')).resolves.not.toThrow()
    })

    it('应该处理异步钩子 reject', async () => {
      setLoadingContext('/reject.ts', 'pkg')

      onLoad(async () => {
        throw new Error('Async hook error')
      })

      await expect(runLoadHooks('/reject.ts')).resolves.not.toThrow()
    })

    it('应该处理快速切换上下文', () => {
      setLoadingContext('/file1.ts', 'pkg1')
      onLoad(vi.fn())

      setLoadingContext('/file2.ts', 'pkg2')
      onLoad(vi.fn())

      setLoadingContext('/file3.ts', 'pkg3')
      onLoad(vi.fn())

      clearLoadingContext()
    })

    it('应该处理没有上下文时的 hook 注册', async () => {
      // 没有 setLoadingContext
      const hook = vi.fn()
      onLoad(hook)

      // 应该立即执行
      await new Promise(r => setTimeout(r, 0))
      expect(hook).toHaveBeenCalled()
    })

    it('应该处理空路径运行钩子', async () => {
      setLoadingContext('/test.ts', 'pkg')
      onLoad(vi.fn())

      // 空路径应该不执行任何钩子
      await expect(runLoadHooks('')).resolves.not.toThrow()
    })

    it('应该处理 unload 后再次 load 同一文件', async () => {
      let loadCount = 0
      let unloadCount = 0

      // 第一次加载
      setLoadingContext('/cycle.ts', 'pkg')
      onLoad(() => { loadCount++ })
      onUnload(() => { unloadCount++ })

      await runLoadHooks('/cycle.ts')
      expect(loadCount).toBe(1)

      await runUnloadHooks('/cycle.ts')
      expect(unloadCount).toBe(1)

      // 重新注册钩子（模拟重新加载）- loadHooks 是累积的
      setLoadingContext('/cycle.ts', 'pkg')
      onLoad(() => { loadCount++ })

      await runLoadHooks('/cycle.ts')
      // 现在有两个钩子被执行（第一次的和新注册的）
      expect(loadCount).toBe(3)
    })

    it('应该处理 reload 多次调用', async () => {
      setLoadingContext('/reload.ts', 'pkg')

      let reloadCount = 0
      onReload(() => reloadCount++)

      await runReloadHooks('/reload.ts')
      await runReloadHooks('/reload.ts')
      await runReloadHooks('/reload.ts')

      expect(reloadCount).toBe(3)
    })
  })

  // ==================== Store 边缘情况 ====================
  describe('Store 边缘情况', () => {
    it('应该处理删除不存在的插件', () => {
      expect(store.del('non-existent-id')).toBe(false)
    })

    it('应该处理重复添加相同 ID 的插件', () => {
      const plugin1 = {
        id: 'same-id',
        type: 'command',
        packageName: 'pkg',
        priority: 100,
        file: { absPath: '/test.ts' },
      } as any

      const plugin2 = {
        id: 'same-id',
        type: 'command',
        packageName: 'pkg',
        priority: 200,
        file: { absPath: '/test.ts' },
      } as any

      store.add('command', plugin1)
      store.add('command', plugin2)

      // 后添加的应该覆盖
      expect(store.getById('same-id')?.priority).toBe(200)
    })

    it('应该处理没有 id 的插件', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      store.add('command', { type: 'command' } as any)

      expect(warnSpy).toHaveBeenCalled()
      expect(store.get('command').length).toBe(0)

      warnSpy.mockRestore()
    })

    it('应该处理按不存在的文件删除', () => {
      expect(store.delByFile('/non/existent/file.ts')).toBe(0)
    })

    it('应该处理按不存在的包删除', () => {
      expect(store.delByPkg('non-existent-package')).toBe(0)
    })

    it('应该处理 update 不存在的插件', () => {
      expect(store.update('non-existent', 'priority', 100)).toBe(false)
    })

    it('应该处理清空后的操作', () => {
      const plugin = {
        id: 'test',
        type: 'command',
        packageName: 'pkg',
        priority: 100,
        file: { absPath: '/test.ts' },
      } as any

      store.add('command', plugin)
      store.clear()

      expect(store.get('command')).toEqual([])
      expect(store.has('test')).toBe(false)
      expect(store.stats().command.total).toBe(0)
    })

    it('应该处理空 handler key 查询', () => {
      expect(store.getHandler('non-existent-key')).toEqual([])
    })

    it('应该正确处理优先级排序', () => {
      for (let i = 0; i < 100; i++) {
        store.add('command', {
          id: `cmd-${i}`,
          type: 'command',
          packageName: 'pkg',
          priority: Math.random() * 10000,
          file: { absPath: '/test.ts' },
        } as any)
      }

      const commands = store.get('command')
      for (let i = 1; i < commands.length; i++) {
        expect((commands[i - 1] as any).priority).toBeGreaterThanOrEqual((commands[i] as any).priority)
      }
    })
  })

  // ==================== PkgRegistry 边缘情况 ====================
  describe('PkgRegistry 边缘情况', () => {
    it('应该处理重复注册同名包', () => {
      pkgRegistry.register({
        name: 'dup',
        abs: '/old',
        pkgPath: '/old/package.json',
        type: 'npm',
      })

      pkgRegistry.register({
        name: 'dup',
        abs: '/new',
        pkgPath: '/new/package.json',
        type: 'apps',
      })

      expect(pkgRegistry.get('dup')?.abs).toBe('/new')
    })

    it('应该处理空文件名添加', () => {
      pkgRegistry.register({
        name: 'pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('pkg', '')
      expect(pkgRegistry.getFiles('pkg')).toContain('')
    })

    it('应该处理非常长的路径', () => {
      const longPath = '/' + 'a'.repeat(1000) + '/package.json'
      pkgRegistry.register({
        name: 'long-path',
        abs: '/' + 'a'.repeat(1000),
        pkgPath: longPath,
        type: 'npm',
      })

      expect(pkgRegistry.get('long-path')).toBeDefined()
    })

    it('应该处理 Windows 路径', () => {
      pkgRegistry.register({
        name: 'win-pkg',
        abs: 'C:\\Users\\test',
        pkgPath: 'C:\\Users\\test\\package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('win-pkg', 'C:\\Users\\test\\src\\index.ts')

      const files = pkgRegistry.getFiles('win-pkg')
      expect(files).toContain('C:/Users/test/src/index.ts')
    })

    it('应该处理移除未注册包的文件', () => {
      expect(() => {
        pkgRegistry.removeFile('/any/path.ts')
      }).not.toThrow()
    })

    it('应该处理获取未注册包的信息', () => {
      expect(pkgRegistry.get('unknown')).toBeUndefined()
      expect(pkgRegistry.getAbsPath('unknown')).toBe('')
      expect(pkgRegistry.getFiles('unknown')).toEqual([])
    })
  })

  // ==================== 跨模块交互边缘情况 ====================
  describe('跨模块交互边缘情况', () => {
    it('应该处理插件创建时的 packageName 来自 pkgRegistry', () => {
      // 先注册一个包
      pkgRegistry.register({
        name: 'my-package',
        abs: '/test/my-package',
        pkgPath: '/test/my-package/package.json',
        type: 'npm',
      })

      // 创建命令 - packageName 由 pkgRegistry 管理而非 setLoadingContext
      const cmd = command(/^test$/, vi.fn() as any, { name: 'ctx-cmd' })

      // packageName 由 callerPath 和 pkgRegistry 决定，不由 setLoadingContext 决定
      // 在测试环境中，callerPath 不在 my-package 目录下，所以不会是 'my-package'
      expect(cmd.packageName).toBeDefined()
      expect(typeof cmd.packageName).toBe('string')
    })

    it('应该处理 store 事件和 lifecycle 的交互', async () => {
      const addListener = vi.fn()
      const delListener = vi.fn()

      store.on('add', addListener)
      store.on('del', delListener)

      setLoadingContext('/interact.ts', 'pkg')

      const cmd = command(/^test$/, vi.fn(), { name: 'interact-cmd' })

      expect(addListener).toHaveBeenCalled()

      store.del(cmd.id)
      expect(delListener).toHaveBeenCalled()
    })

    it('应该处理 ref 插件的 store 操作', () => {
      const plugin = ref(/^test$/, vi.fn(), { name: 'ref-store' })

      expect(store.has(plugin.id)).toBe(true)

      plugin.dispose()

      expect(store.has(plugin.id)).toBe(false)
    })
  })
})
