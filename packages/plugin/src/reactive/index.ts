/**
 * 响应式模块
 *
 * 提供：
 * - `ref()` - 响应式命令插件创建（属性变更自动同步到 store）
 *
 * @module reactive
 */

import { store } from '../store'
import { command, type CreateCommand, type MessageCallback, type Options, type EventTypes } from '../create/command'
import type { Elements } from '@karinjs/adapter'

// ==================== 类型定义 ====================

/** 变更监听器 */
type ChangeListener = (key: string, newVal: unknown, oldVal: unknown) => void

/** 响应式插件基础接口 */
export interface RefPlugin {
  /** 销毁插件（从 Store 中删除） */
  dispose: () => void
  /** 监听属性变化 */
  on: (event: 'change', listener: ChangeListener) => () => void
  /** 热更新标记 */
  readonly __hot: true
  /** 唯一标识 */
  readonly __refid: string
}

/** 响应式命令插件 */
export type RefCommand<T extends EventTypes = EventTypes> = CreateCommand<T> & RefPlugin

// ==================== 内部实现 ====================

/** 生成唯一 ID */
function generateRefId (): string {
  return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 创建响应式代理
 * 属性变更自动同步到 store
 */
function createReactiveProxy<T extends { id: string; type: string }> (
  plugin: T
): T & RefPlugin {
  const refid = generateRefId()
  const listeners = new Set<ChangeListener>()

  const proxy = new Proxy(plugin, {
    get (target, key: string) {
      // 特殊属性
      if (key === '__hot') return true
      if (key === '__refid') return refid
      if (key === 'dispose') {
        return () => {
          store.del(plugin.id)
          listeners.clear()
        }
      }
      if (key === 'on') {
        return (event: string, listener: ChangeListener) => {
          if (event === 'change') {
            listeners.add(listener)
            return () => listeners.delete(listener)
          }
          return () => {}
        }
      }

      return (target as Record<string, unknown>)[key]
    },

    set (target, key: string, value: unknown) {
      const oldVal = (target as Record<string, unknown>)[key]
      if (Object.is(oldVal, value)) return true

      // 更新 Store（会自动处理排序等）
      store.update(plugin.id, key, value)

      // 同步本地对象
      ;(target as Record<string, unknown>)[key] = value

      // 通知监听器
      for (const fn of listeners) {
        try {
          fn(key, value, oldVal)
        } catch (e) {
          console.error('[ref] change listener error:', e)
        }
      }

      return true
    },
  }) as T & RefPlugin

  return proxy
}

// ==================== ref 实现 ====================

/** 参数二为消息段时的类型 */
type MessageSegment = string | Elements | Elements[]

/**
 * 创建响应式命令插件
 *
 * 属性变更会自动同步到 store，支持动态控制：
 * - 修改 `disabled` 可禁用/启用插件
 * - 修改 `priority` 会自动重新排序
 *
 * @example
 * ```ts
 * import { ref } from '@karinjs/plugin'
 *
 * // 创建响应式插件
 * const ping = ref(/^ping$/, 'pong')
 *
 * // 直接修改属性 → 自动同步到 Store
 * ping.disabled = true  // 禁用插件
 * ping.priority = 1     // 修改优先级
 *
 * // 监听属性变化
 * const unsubscribe = ping.on('change', (key, newVal, oldVal) => {
 *   console.log(`${key}: ${oldVal} → ${newVal}`)
 * })
 *
 * // 取消监听
 * unsubscribe()
 *
 * // 销毁插件（从 Store 中删除）
 * ping.dispose()
 * ```
 */
export function ref<T extends EventTypes = EventTypes> (
  reg: string | RegExp,
  callback: MessageCallback<T> | MessageSegment,
  options: Options<T>
): RefCommand<T> {
  // 创建插件
  const plugin = command(reg, callback, options)
  // 返回响应式代理
  return createReactiveProxy(plugin) as RefCommand<T>
}

// ==================== 工具函数 ====================

/**
 * 判断是否是响应式插件
 */
export function isRef (value: unknown): value is RefPlugin {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__hot' in value &&
    (value as Record<string, unknown>).__hot === true
  )
}

/**
 * 从响应式插件中提取原始插件
 */
export function unref<T extends RefPlugin> (value: T): Omit<T, keyof RefPlugin> {
  const result = {} as Record<string, unknown>
  for (const key of Object.keys(value)) {
    if (!['__hot', '__refid', 'dispose', 'on'].includes(key)) {
      result[key] = (value as Record<string, unknown>)[key]
    }
  }
  return result as Omit<T, keyof RefPlugin>
}
