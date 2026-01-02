/**
 * Vitest 测试设置
 */
import { vi } from 'vitest'

/**
 * 创建 mock logger
 */
const createMockLogger = () => ({
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
})

/**
 * 动态创建的 logger 实例，用于 logger.create() 返回值
 */
const dynamicCreateLogger = createMockLogger()

/**
 * Mock logger 实例
 * 可在测试中通过 mockLogger 访问
 */
export const mockLogger = {
  hmr: createMockLogger(),
  hmrEffects: createMockLogger(),
  hmrConfig: createMockLogger(),
  loader: createMockLogger(),
  cache: createMockLogger(),
  engines: createMockLogger(),
  pluginClass: createMockLogger(),
  /** create 方法返回固定的 dynamicCreateLogger 以便测试验证 */
  create: Object.assign(vi.fn(() => dynamicCreateLogger), dynamicCreateLogger),
}

/**
 * 重置所有 mock logger
 */
export const resetMockLogger = () => {
  // 重置 dynamicCreateLogger
  Object.values(dynamicCreateLogger).forEach(fn => {
    if (typeof fn === 'function') fn.mockClear()
  })

  Object.entries(mockLogger).forEach(([key, l]) => {
    if (key === 'create') {
      // create 是带有 logger 方法的函数
      ; (l as ReturnType<typeof vi.fn>).mockClear()
    } else if (typeof l === 'object' && l !== null) {
      Object.values(l).forEach(fn => {
        if (typeof fn === 'function') fn.mockClear()
      })
    }
  })
}

// Mock @karinjs/utils
vi.mock('@karinjs/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@karinjs/utils')>()
  return {
    ...actual,
    formatPath: (path: string, options?: { type?: string }) => {
      if (options?.type === 'fileURL') {
        return `file:///${path.replace(/\\/g, '/')}`
      }
      if (options?.type === 'rel') {
        return path.split('/').pop() || path
      }
      return path
    },
    types: {
      string: <T = string> (val: unknown, def: T): T => (typeof val === 'string' && val ? val : def) as T,
      number: (val: unknown, def: number): number => (typeof val === 'number' ? val : def),
      bool: (val: unknown, def: boolean): boolean => (typeof val === 'boolean' ? val : def),
      array: <T> (val: unknown, def: T[]): T[] => (Array.isArray(val) ? val : def),
    },
    isClass: <T> (val: unknown): val is new (...args: any[]) => T => {
      return typeof val === 'function' && /^class\s/.test(Function.prototype.toString.call(val))
    },
  }
})

// Mock @karinjs/events
vi.mock('@karinjs/events', () => {
  const listeners = new Map<string, Set<(...args: any[]) => void>>()

  return {
    emitter: {
      on: vi.fn((event: string, listener: (...args: any[]) => void) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set())
        }
        listeners.get(event)!.add(listener)
      }),
      off: vi.fn((event: string, listener: (...args: any[]) => void) => {
        listeners.get(event)?.delete(listener)
      }),
      emit: vi.fn((event: string, ...args: any[]) => {
        listeners.get(event)?.forEach(fn => fn(...args))
      }),
      once: vi.fn(),
      listenerCount: vi.fn(() => 0),
    },
    EventEmitter: class MockEventEmitter { },
  }
})

// Mock ../utils/logger
vi.mock('../src/utils/logger', () => {
  return {
    logger: mockLogger,
  }
})

  // 设置全局 logger mock（作为降级使用）
  ; (globalThis as any).logger = {
    prefix: vi.fn(() => createMockLogger()),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    mark: vi.fn(),
    bot: vi.fn(),
  }
  ; (global as any).logger = (globalThis as any).logger
