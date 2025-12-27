/**
 * 副作用注册器实现
 * @module hmr/effects
 *
 * 提供细粒度的副作用管理，允许模块注册清理函数
 */

import { formatPath } from '@karinjs/utils'
import type { CleanupFunction, EffectRegistry } from './types'

/**
 * 副作用注册器实现
 */
class EffectRegistryImpl implements EffectRegistry {
  /** 模块 -> 清理函数列表 */
  private cleanups = new Map<string, Set<CleanupFunction>>()
  /** 正在清理中的模块（防止并发） */
  private cleaningInProgress = new Set<string>()
  /** 日志前缀 */
  private logger = global.logger?.prefix?.('[hmr:effects]') || console

  /**
   * 规范化文件路径
   */
  private normalizePath (file: string): string {
    return formatPath(file, { type: 'fileURL' })
  }

  /**
   * 注册清理函数
   * @param moduleFile 模块文件路径
   * @param cleanup 清理函数
   * @returns 取消注册的函数
   */
  register (moduleFile: string, cleanup: CleanupFunction): () => void {
    // 防御性检查：cleanup 必须是函数
    if (typeof cleanup !== 'function') {
      this.log('warn', `invalid cleanup function for ${moduleFile}, ignoring`)
      return () => { } // 返回空函数
    }

    // 防御性检查：moduleFile 必须是非空字符串
    if (typeof moduleFile !== 'string' || !moduleFile.trim()) {
      this.log('warn', 'invalid moduleFile, must be a non-empty string')
      return () => { }
    }

    const normalizedPath = this.normalizePath(moduleFile)

    if (!this.cleanups.has(normalizedPath)) {
      this.cleanups.set(normalizedPath, new Set())
    }

    this.cleanups.get(normalizedPath)!.add(cleanup)

    // 返回取消注册函数
    return () => {
      const cleanupSet = this.cleanups.get(normalizedPath)
      if (cleanupSet) {
        cleanupSet.delete(cleanup)
        if (cleanupSet.size === 0) {
          this.cleanups.delete(normalizedPath)
        }
      }
    }
  }

  /**
   * 执行指定模块的所有清理函数
   * @param moduleFile 模块文件路径
   */
  async cleanup (moduleFile: string): Promise<void> {
    // 防御性检查
    if (typeof moduleFile !== 'string' || !moduleFile) {
      return
    }
    const normalizedPath = this.normalizePath(moduleFile)
    await this.cleanupByKey(normalizedPath, moduleFile)
  }

  /**
   * 根据规范化的 key 执行清理
   */
  private async cleanupByKey (key: string, displayPath: string): Promise<void> {
    // 防止并发清理同一模块
    if (this.cleaningInProgress.has(key)) {
      return
    }

    const cleanupSet = this.cleanups.get(key)

    if (!cleanupSet || cleanupSet.size === 0) {
      return
    }

    // 标记正在清理
    this.cleaningInProgress.add(key)

    const errors: Error[] = []

    try {
      // 并行执行所有清理函数
      await Promise.allSettled(
        Array.from(cleanupSet).map(async (fn) => {
          try {
            await fn()
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error))
            errors.push(err)
            this.log('error', `cleanup error for ${displayPath}: ${err.message}`)
          }
        })
      )

      // 清除该模块的所有注册
      this.cleanups.delete(key)

      if (errors.length > 0) {
        this.log('warn', `${errors.length} cleanup errors for ${displayPath}`)
      }
    } finally {
      // 清理完成，移除标记
      this.cleaningInProgress.delete(key)
    }
  }

  /**
   * 清理所有注册的副作用
   */
  async cleanupAll (): Promise<void> {
    const allModules = Array.from(this.cleanups.keys())

    await Promise.allSettled(
      allModules.map(moduleKey => this.cleanupByKey(moduleKey, moduleKey))
    )

    this.cleanups.clear()
  }

  /**
   * 获取指定模块的清理函数数量
   */
  count (moduleFile?: string): number {
    if (moduleFile) {
      // 防御性检查
      if (typeof moduleFile !== 'string') {
        return 0
      }
      const normalizedPath = this.normalizePath(moduleFile)
      return this.cleanups.get(normalizedPath)?.size ?? 0
    }
    let total = 0
    for (const set of this.cleanups.values()) {
      total += set.size
    }
    return total
  }

  /**
   * 检查模块是否有注册的清理函数
   */
  has (moduleFile: string): boolean {
    // 防御性检查
    if (typeof moduleFile !== 'string' || !moduleFile) {
      return false
    }
    const normalizedPath = this.normalizePath(moduleFile)
    const set = this.cleanups.get(normalizedPath)
    return set !== undefined && set.size > 0
  }

  /**
   * 获取所有有副作用的模块路径
   */
  getModules (): string[] {
    return Array.from(this.cleanups.keys())
  }

  /**
   * 重置（测试用）
   */
  reset (): void {
    this.cleanups.clear()
  }

  /**
   * 日志输出
   */
  private log (level: 'info' | 'debug' | 'warn' | 'error', message: string): void {
    if (this.logger[level]) {
      this.logger[level](message)
    } else {
      console.log(`[hmr:effects] ${message}`)
    }
  }
}

// 单例
const effectRegistry = new EffectRegistryImpl()

/**
 * 导出副作用注册器
 */
export { effectRegistry }

/**
 * 便捷函数：注册副作用清理函数
 *
 * @example
 * ```ts
 * // 在模块中
 * import { registerEffect } from '@karinjs/plugin'
 *
 * const timer = setInterval(() => {
 *   console.log('tick')
 * }, 1000)
 *
 * // 注册清理函数，热更新时会自动调用
 * registerEffect(import.meta.url, () => {
 *   clearInterval(timer)
 * })
 * ```
 */
export function registerEffect (moduleUrl: string, cleanup: CleanupFunction): () => void {
  return effectRegistry.register(moduleUrl, cleanup)
}

/**
 * 创建一个带自动清理的副作用
 *
 * @example
 * ```ts
 * import { createEffect } from '@karinjs/plugin'
 *
 * // 自动在热更新时清理
 * const timer = createEffect(import.meta.url, () => {
 *   const id = setInterval(() => console.log('tick'), 1000)
 *   // 返回清理函数
 *   return () => clearInterval(id)
 * })
 * ```
 */
export function createEffect<T> (
  moduleUrl: string,
  factory: () => T | { value: T, cleanup: CleanupFunction }
): T {
  const result = factory()

  // 检查是否返回了包含 cleanup 的对象
  if (
    result !== null &&
    typeof result === 'object' &&
    'cleanup' in result &&
    typeof result.cleanup === 'function'
  ) {
    effectRegistry.register(moduleUrl, result.cleanup as CleanupFunction)
    return (result as { value: T, cleanup: CleanupFunction }).value
  }

  return result as T
}
