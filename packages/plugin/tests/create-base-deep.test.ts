/**
 * create/base.ts 深度单元测试
 * @description BuilderBase 类的完整测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BuilderBase, createID } from '../src/create/base'
import { pkgRegistry } from '../src/pkg'
import { store } from '../src/store'

// 创建一个具体实现类用于测试
class TestBuilder extends BuilderBase {
  constructor () {
    super()
  }

  // 覆盖 type getter 进行测试
  get type () {
    return 'command' as const
  }
}

describe('create/base 深度测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    store.clear()
  })

  describe('createID', () => {
    it('应该生成包含所有必需部分的 ID', () => {
      const id = createID('test-package', 'command', 'test.ts')

      expect(id).toContain('test-package')
      expect(id).toContain('command')
      expect(id).toContain('test.ts')
    })

    it('应该生成唯一的 ID', () => {
      const id1 = createID('test-package', 'command', 'test.ts')
      const id2 = createID('test-package', 'command', 'test.ts')

      expect(id1).not.toBe(id2)
    })

    it('应该包含递增的索引', () => {
      const id1 = createID('test-package', 'command', 'test.ts')
      const id2 = createID('test-package', 'command', 'test.ts')

      const parts1 = id1.split(':')
      const parts2 = id2.split(':')

      const index1 = parseInt(parts1[3])
      const index2 = parseInt(parts2[3])

      expect(index2).toBeGreaterThan(index1)
    })

    it('应该包含时间戳', () => {
      const before = Date.now()
      const id = createID('test-package', 'command', 'test.ts')
      const after = Date.now()

      const parts = id.split(':')
      const timestamp = parseInt(parts[4])

      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('应该支持不同的插件类型', () => {
      const types = ['command', 'accept', 'task', 'button', 'handler'] as const

      types.forEach(type => {
        const id = createID('test-package', type, 'test.ts')
        expect(id).toContain(type)
      })
    })

    it('应该处理特殊字符的包名', () => {
      const id = createID('@scope/package-name', 'command', 'test.ts')
      expect(id).toContain('@scope/package-name')
    })
  })

  describe('BuilderBase', () => {
    describe('id getter', () => {
      it('应该返回唯一 ID', () => {
        const builder = new TestBuilder()
        const id = builder.id

        expect(typeof id).toBe('string')
        expect(id.length).toBeGreaterThan(0)
      })

      it('应该缓存 ID', () => {
        const builder = new TestBuilder()
        const id1 = builder.id
        const id2 = builder.id

        expect(id1).toBe(id2)
      })
    })

    describe('callerPath getter', () => {
      it('应该返回字符串路径', () => {
        const builder = new TestBuilder()
        const callerPath = builder.callerPath

        expect(typeof callerPath).toBe('string')
      })

      it('应该使用正斜杠', () => {
        const builder = new TestBuilder()
        const callerPath = builder.callerPath

        expect(callerPath).not.toContain('\\')
      })

      it('应该缓存路径', () => {
        const builder = new TestBuilder()
        const path1 = builder.callerPath
        const path2 = builder.callerPath

        expect(path1).toBe(path2)
      })
    })

    describe('file getter', () => {
      it('应该返回文件信息对象', () => {
        const builder = new TestBuilder()
        const file = builder.file

        expect(file).toHaveProperty('absPath')
        expect(file).toHaveProperty('relPath')
        expect(file).toHaveProperty('dirname')
        expect(file).toHaveProperty('basename')
      })

      it('absPath 应该返回绝对路径', () => {
        const builder = new TestBuilder()
        const absPath = builder.file.absPath

        expect(typeof absPath).toBe('string')
        expect(absPath.length).toBeGreaterThan(0)
      })

      it('dirname 应该返回目录路径', () => {
        const builder = new TestBuilder()
        const dirname = builder.file.dirname

        expect(typeof dirname).toBe('string')
        expect(dirname).not.toContain('\\')
      })

      it('basename 应该返回文件名', () => {
        const builder = new TestBuilder()
        const basename = builder.file.basename

        expect(typeof basename).toBe('string')
        expect(basename.length).toBeGreaterThan(0)
      })

      it('relPath 应该返回相对路径或空字符串', () => {
        const builder = new TestBuilder()
        const relPath = builder.file.relPath

        expect(typeof relPath).toBe('string')
      })
    })

    describe('type getter', () => {
      it('应该返回 command', () => {
        const builder = new TestBuilder()
        expect(builder.type).toBe('command')
      })
    })

    describe('packageName getter', () => {
      it('应该返回包名或回退值', () => {
        const builder = new TestBuilder()
        const packageName = builder.packageName

        expect(typeof packageName).toBe('string')
        expect(packageName.length).toBeGreaterThan(0)
      })

      it('应该缓存包名', () => {
        const builder = new TestBuilder()
        const name1 = builder.packageName
        const name2 = builder.packageName

        expect(name1).toBe(name2)
      })

      it('应该使用回退格式当无法获取包名时', () => {
        const builder = new TestBuilder()
        const packageName = builder.packageName

        // 如果无法获取真实包名，应该包含 type:unknown:filename 格式
        if (packageName.includes('unknown')) {
          expect(packageName).toContain('command')
          expect(packageName).toContain('unknown')
        }
      })
    })

    describe('defaultAppName getter', () => {
      it('应该返回 7 位哈希字符串', () => {
        const builder = new TestBuilder()
        const defaultName = builder.defaultAppName

        expect(typeof defaultName).toBe('string')
        expect(defaultName.length).toBe(7)
      })

      it('应该返回 hex 字符', () => {
        const builder = new TestBuilder()
        const defaultName = builder.defaultAppName

        expect(/^[0-9a-f]{7}$/.test(defaultName)).toBe(true)
      })

      it('相同 builder 应该返回相同的 defaultAppName', () => {
        const builder = new TestBuilder()
        const name1 = builder.defaultAppName
        const name2 = builder.defaultAppName

        expect(name1).toBe(name2)
      })
    })

    describe('log 方法', () => {
      it('应该是一个函数', () => {
        const builder = new TestBuilder()
        expect(typeof builder.log).toBe('function')
      })

      it('应该默认使用 logger.info', () => {
        const infoSpy = vi.spyOn(logger, 'info')
        const builder = new TestBuilder()

        builder.log('test message')

        expect(infoSpy).toHaveBeenCalledWith('test message')
      })

      it('应该支持多个参数', () => {
        const infoSpy = vi.spyOn(logger, 'info')
        const builder = new TestBuilder()

        builder.log('arg1', 'arg2', 123)

        expect(infoSpy).toHaveBeenCalledWith('arg1', 'arg2', 123)
      })
    })

    describe('setLog 方法', () => {
      it('应该是一个函数', () => {
        const builder = new TestBuilder()
        expect(typeof builder.setLog).toBe('function')
      })

      it('setLog(false) 应该切换到 mark 日志', () => {
        const markSpy = vi.spyOn(logger, 'mark')
        const builder = new TestBuilder()

        builder.setLog(false, false)
        builder.log('test message')

        expect(markSpy).toHaveBeenCalled()
      })

      it('setLog(false, true) 应该使用 bot 日志', () => {
        const botSpy = vi.spyOn(logger, 'bot')
        const builder = new TestBuilder()

        builder.setLog(false, true)
        builder.log('botId', 'test message')

        expect(botSpy).toHaveBeenCalledWith('mark', 'botId', 'test message')
      })

      it('setLog 应该添加前缀', () => {
        const markSpy = vi.spyOn(logger, 'mark')
        const builder = new TestBuilder()

        builder.setLog(false, false)
        builder.log('test message')

        const firstArg = markSpy.mock.calls[0][0]
        expect(firstArg).toContain('[')
        expect(firstArg).toContain(']')
      })
    })
  })

  describe('继承测试', () => {
    it('子类应该继承所有基类方法', () => {
      class ChildBuilder extends BuilderBase {
        get type () {
          return 'accept' as const
        }
      }

      const child = new ChildBuilder()

      expect(child.id).toBeDefined()
      expect(child.callerPath).toBeDefined()
      expect(child.file).toBeDefined()
      expect(child.packageName).toBeDefined()
      expect(child.defaultAppName).toBeDefined()
      expect(typeof child.log).toBe('function')
      expect(typeof child.setLog).toBe('function')
    })

    it('子类可以覆盖 type', () => {
      class TaskBuilder extends BuilderBase {
        get type () {
          return 'task' as const
        }
      }

      const builder = new TaskBuilder()
      expect(builder.type).toBe('task')
    })
  })
})
