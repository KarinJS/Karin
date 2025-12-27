/**
 * Vitest 测试设置
 */
import { vi } from 'vitest'

// Mock @karinjs/utils
vi.mock('@karinjs/utils', () => ({
  formatPath: (path: string, options?: { type?: string }) => {
    if (options?.type === 'fileURL') {
      return `file:///${path.replace(/\\/g, '/')}`
    }
    if (options?.type === 'rel') {
      return path.split('/').pop() || path
    }
    return path
  },
}))

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

  // 设置全局 logger mock
  ; (globalThis as any).logger = {
    prefix: () => ({
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  }
