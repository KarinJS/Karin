/**
 * HMR 配置文件示例
 *
 * 此文件应放置在插件包的根目录下，命名为：
 * - karin.hmr.config.ts (推荐)
 * - karin.hmr.config.mts
 * - karin.hmr.config.js
 * - karin.hmr.config.mjs
 *
 * 仅在开发环境且启用了 Node 内部 API 时生效。
 */

import { defineHMRConfig } from '@karinjs/plugin'

// 模拟一些需要清理的副作用
let myTimer: NodeJS.Timeout | null = null
let wsConnection: unknown = null

export default defineHMRConfig({
  // ============================================================================
  // 基础配置
  // ============================================================================

  /**
   * 受保护的路径（不清除缓存）
   * 支持 glob 模式
   */
  exclude: [
    'node_modules/**',
    'dist/**',
    '.git/**',
  ],

  /**
   * 额外监听的路径
   * 默认会监听 karin.config 中定义的 entry
   */
  watch: [
    'src/**/*.ts',
  ],

  /**
   * 防抖延迟（毫秒）
   * @default 100
   */
  debounce: 150,

  /**
   * 是否启用详细日志
   * @default false
   */
  verbose: true,

  // ============================================================================
  // 全局钩子
  // ============================================================================

  /**
   * 模块热更新前的钩子
   * 在清除缓存之前调用，用于清理副作用
   */
  onBeforeHot: async (ctx) => {
    console.log(`[HMR] 准备热更新: ${ctx.file}`)
    console.log(`[HMR] 受影响的模块数: ${ctx.affectedModules.length}`)
  },

  /**
   * 模块热更新后的钩子
   * 在模块重新加载后调用
   */
  onAfterHot: async (ctx) => {
    console.log(`[HMR] 热更新完成: ${ctx.file}`)
    console.log(`[HMR] 耗时: ${Date.now() - ctx.timestamp}ms`)
  },

  // ============================================================================
  // 特定模块的处理器
  // ============================================================================

  /**
   * 针对特定模块的热更新处理
   * key 支持 glob 模式，value 为处理函数
   */
  modules: {
    // 处理定时器模块
    'src/timer.ts': async (_ctx) => {
      console.log('[HMR] 清理定时器')
      if (myTimer) {
        clearInterval(myTimer)
        myTimer = null
      }
    },

    // 处理 WebSocket 模块（使用 glob 模式）
    'src/ws/**/*.ts': async (_ctx) => {
      console.log('[HMR] 关闭 WebSocket 连接')
      if (wsConnection) {
        // ws.close()
        wsConnection = null
      }
    },

    // 处理数据库连接
    'src/db/*.ts': async (_ctx) => {
      console.log('[HMR] 关闭数据库连接')
      // await db.close()
    },
  },

  // ============================================================================
  // 副作用注册
  // ============================================================================

  /**
   * 自定义副作用清理
   * 提供更细粒度的副作用管理方式
   *
   * 注意：这里注册的副作用会在模块卸载时自动清理
   * 也可以在模块内部使用 registerEffect() 动态注册
   */
  effects: (_registry) => {
    // 示例：在这里可以预注册一些全局副作用
    // 但更推荐在各个模块内部使用 registerEffect()
    //
    // 例如在 src/timer.ts 中：
    // import { registerEffect } from '@karinjs/plugin'
    //
    // const timer = setInterval(() => console.log('tick'), 1000)
    // registerEffect(import.meta.url, () => clearInterval(timer))
  },

  // ============================================================================
  // karin.config 热更新配置
  // ============================================================================

  karinConfig: {
    /**
     * 配置变更前的钩子
     */
    onBeforeChange: async (ctx) => {
      console.log('[HMR] karin.config 即将更新')
      console.log(`[HMR] 变更的配置项: ${ctx.changedKeys.join(', ')}`)
    },

    /**
     * 配置变更后的钩子
     */
    onAfterChange: async (ctx) => {
      console.log('[HMR] karin.config 已更新')

      // 可以在这里根据变更的配置做一些处理
      if (ctx.changedKeys.includes('env')) {
        console.log('[HMR] 环境变量已更新，可能需要重启某些服务')
      }
    },

    /**
     * 是否需要完全重载插件
     * 返回 true 则重新加载整个插件
     * 返回 false 则仅热更新配置
     *
     * @default false
     */
    requireFullReload: (ctx) => {
      // entry 或 hooks 变更需要完全重载
      const criticalKeys = ['entry', 'hooks']
      return ctx.changedKeys.some(key => criticalKeys.includes(key))
    },
  },
})

// ============================================================================
// 在模块内部注册副作用的示例
// ============================================================================

/**
 * 示例：如何在模块中注册需要清理的副作用
 *
 * @example
 * ```ts
 * // src/timer.ts
 * import { registerEffect } from '@karinjs/plugin'
 *
 * // 创建定时器
 * const timer = setInterval(() => {
 *   console.log('tick')
 * }, 1000)
 *
 * // 注册清理函数，热更新时会自动调用
 * registerEffect(import.meta.url, () => {
 *   clearInterval(timer)
 *   console.log('timer cleared')
 * })
 * ```
 *
 * @example
 * ```ts
 * // src/ws/client.ts
 * import { registerEffect } from '@karinjs/plugin'
 *
 * const ws = new WebSocket('ws://example.com')
 *
 * ws.onopen = () => console.log('connected')
 * ws.onmessage = (e) => console.log('message:', e.data)
 *
 * // 热更新时自动关闭连接
 * registerEffect(import.meta.url, () => {
 *   ws.close()
 *   console.log('ws closed')
 * })
 * ```
 *
 * @example
 * ```ts
 * // src/events.ts
 * import { registerEffect } from '@karinjs/plugin'
 * import { emitter } from '@karinjs/events'
 *
 * const handler = (data) => console.log('event:', data)
 * emitter.on('my-event', handler)
 *
 * // 热更新时自动移除监听器
 * registerEffect(import.meta.url, () => {
 *   emitter.off('my-event', handler)
 * })
 * ```
 */
