# HMR 配置系统设计方案

## 概述

本方案为 Karin 插件系统设计了一个完整的 HMR（热模块替换）配置系统，用于处理开发环境下的模块副作用清理、依赖树管理、配置文件热更新等复杂场景。

## 核心问题

1. **副作用清理**：定时器、事件监听器、WebSocket 连接等无法自动清理的副作用
2. **依赖树管理**：正确追踪和清理模块依赖关系，避免内存泄漏
3. **HMR 配置自身重载**：配置文件本身也需要热更新，但必须最后处理
4. **karin.config 热更新**：插件配置文件需要特殊处理
5. **环境隔离**：仅在开发环境 + Node 内部 API 可用时生效

## 文件结构

```
src/hmr/
├── index.ts        # 主入口，导出所有 HMR 功能
├── types.ts        # 类型定义
├── effects.ts      # 副作用注册器
├── config.ts       # HMR 配置加载器
└── enhanced.ts     # 增强型 HMR 实现
```

## 配置文件

用户在插件根目录创建 `karin.hmr.config.ts`（或 `.mts`, `.js`, `.mjs`）：

```typescript
import { defineHMRConfig } from '@karinjs/plugin'

export default defineHMRConfig({
  // 受保护的路径（不清除缓存）
  exclude: ['node_modules/**', 'dist/**'],

  // 额外监听的路径
  watch: ['src/**/*.ts'],

  // 防抖延迟
  debounce: 150,

  // 全局热更新钩子
  onBeforeHot: async (ctx) => {
    console.log(`准备热更新: ${ctx.file}`)
  },

  onAfterHot: async (ctx) => {
    console.log(`热更新完成: ${ctx.file}`)
  },

  // 特定模块的处理器（支持 glob）
  modules: {
    'src/timer.ts': async (ctx) => {
      clearInterval(globalTimer)
    },
    'src/ws/**/*.ts': async (ctx) => {
      wsConnection?.close()
    },
  },

  // 副作用注册（初始化时调用）
  effects: (registry) => {
    // 预注册副作用
  },

  // karin.config 热更新配置
  karinConfig: {
    onBeforeChange: async (ctx) => {
      console.log('配置即将更新:', ctx.changedKeys)
    },
    onAfterChange: async (ctx) => {
      console.log('配置已更新')
    },
    requireFullReload: (ctx) => {
      // entry 变更需要完全重载
      return ctx.changedKeys.includes('entry')
    },
  },
})
```

## 模块内副作用注册

在模块内部使用 `registerEffect` 注册需要清理的副作用：

```typescript
// src/timer.ts
import { registerEffect } from '@karinjs/plugin'

const timer = setInterval(() => console.log('tick'), 1000)

// 热更新时自动清理
registerEffect(import.meta.url, () => {
  clearInterval(timer)
})
```

或使用 `createEffect` 工厂函数：

```typescript
import { createEffect } from '@karinjs/plugin'

// 自动注册清理函数
const timer = createEffect(import.meta.url, () => {
  const id = setInterval(() => console.log('tick'), 1000)
  return {
    value: id,
    cleanup: () => clearInterval(id),
  }
})
```

## 热更新流程

```
┌─────────────────────────────────────────────────────────────┐
│                     文件变更事件                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. 判断文件类型                                              │
│     - karin.hmr.config.* → handleHMRConfigChange()          │
│     - karin.config.* → handleKarinConfigChange()            │
│     - 其他文件 → handleFileChangeOrUnlink()                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. 查找受影响的模块（依赖树）                                  │
│     moduleApi.findDependentModules(file)                    │
│     排除 node_modules 和 exclude 路径                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. 调用 onBeforeHot 钩子                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. 执行特定模块处理器（modules 配置）                          │
│     支持 glob 模式匹配                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. 清理所有受影响模块的副作用                                  │
│     effectRegistry.cleanup(module)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  6. 清理 ESM 缓存                                            │
│     moduleApi.clearCaches(affectedModules)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  7. 重载 apps 文件                                           │
│     registry.unregisterByFile() + loader.loadFile()         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  8. 调用 onAfterHot 钩子                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  9. 如果有待处理的 HMR 配置重载，最后执行                        │
│     hmrConfigManager.reloadConfig()                         │
└─────────────────────────────────────────────────────────────┘
```

## karin.config 热更新流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 加载新配置                                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. 计算变更的配置项（diffConfigKeys）                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. 调用 onBeforeChange 钩子                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. 判断是否需要完全重载                                       │
│     requireFullReload(ctx)                                  │
│     - true → loader.reloadPackage()                         │
│     - false → 仅更新配置对象                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. 调用 onAfterChange 钩子                                  │
└─────────────────────────────────────────────────────────────┘
```

## 依赖树清理策略

### 生产环境

- 不使用 Node 内部 API
- 使用版本号查询参数绕过缓存：`?v=1`, `?v=2`

### 开发环境

- 使用 Node 内部 API 直接清理 ESM 缓存
- 递归查找所有依赖当前模块的模块
- 自动排除 `node_modules` 和 `exclude` 配置的路径
- 支持时间戳查询参数：`?t=1703692800000`

### 排除策略

```typescript
// 生产环境：node_modules 始终排除
if (cacheUrl.includes('node_modules') || cacheUrl.includes('node:')) {
  return // 跳过
}

// 开发环境：支持自定义排除
moduleApi.setExclude([
  'node_modules/**',
  'dist/**',
  '.git/**',
])
```

## API 参考

### effectRegistry

```typescript
// 注册清理函数
const unregister = effectRegistry.register(moduleFile, cleanup)

// 执行清理
await effectRegistry.cleanup(moduleFile)

// 清理所有
await effectRegistry.cleanupAll()

// 查询
effectRegistry.has(moduleFile)
effectRegistry.count(moduleFile)
effectRegistry.getModules()
```

### hmrConfigManager

```typescript
// 查找配置文件
const configPath = await hmrConfigManager.findConfigFile(pluginRoot)

// 加载配置
const config = await hmrConfigManager.loadConfig(pluginRoot)

// 重新加载
const config = await hmrConfigManager.reloadConfig(pluginRoot)

// 获取缓存的配置
const config = hmrConfigManager.getConfig(pluginRoot)

// 检查是否是配置文件
hmrConfigManager.isHMRConfigFile(filePath)
```

### EnhancedHMR

```typescript
const hmr = createEnhancedHMR({
  pluginRoot: '/path/to/plugin',
  pluginName: 'my-plugin',
  paths: ['src/**/*.ts'],
  debounce: 100,
  verbose: true,
})

await hmr.start()
await hmr.stop()
```

## 类型定义

### HMRContext

```typescript
interface HMRContext {
  file: string           // 被热更新的模块路径
  fileUrl: string        // file:// URL
  affectedModules: string[]  // 受影响的模块列表
  eventType: 'change' | 'unlink'
  timestamp: number
}
```

### DefineHMRConfig

```typescript
interface DefineHMRConfig {
  exclude?: string[]
  watch?: string[]
  debounce?: number
  verbose?: boolean
  onBeforeHot?: (ctx: HMRContext) => void | Promise<void>
  onAfterHot?: (ctx: HMRContext) => void | Promise<void>
  modules?: Record<string, ModuleHotHandler>
  effects?: (registry: EffectRegistry) => void | Promise<void>
  karinConfig?: KarinConfigHooks
}
```

### ConfigChangeContext

```typescript
interface ConfigChangeContext {
  file: string
  oldConfig?: Record<string, unknown>
  newConfig: Record<string, unknown>
  changedKeys: string[]
}
```

## 使用示例

### 基础用法

```typescript
// karin.hmr.config.ts
import { defineHMRConfig } from '@karinjs/plugin'

export default defineHMRConfig({
  onBeforeHot: async (ctx) => {
    console.log('热更新:', ctx.file)
  },
})
```

### 定时器清理

```typescript
// src/scheduler.ts
import { registerEffect } from '@karinjs/plugin'

const jobs = new Map<string, NodeJS.Timeout>()

export function scheduleJob(name: string, cron: string, fn: () => void) {
  const timer = setInterval(fn, 1000)
  jobs.set(name, timer)

  // 热更新时自动清理
  registerEffect(import.meta.url, () => {
    for (const timer of jobs.values()) {
      clearInterval(timer)
    }
    jobs.clear()
  })
}
```

### WebSocket 连接清理

```typescript
// src/ws/client.ts
import { registerEffect } from '@karinjs/plugin'

const ws = new WebSocket('ws://example.com')

ws.onopen = () => console.log('connected')
ws.onmessage = (e) => handleMessage(e.data)

registerEffect(import.meta.url, () => {
  ws.close()
  console.log('ws closed')
})
```

### 事件监听器清理

```typescript
// src/events.ts
import { registerEffect } from '@karinjs/plugin'
import { emitter } from '@karinjs/events'

const handlers = new Map<string, Function>()

export function on(event: string, handler: Function) {
  handlers.set(event, handler)
  emitter.on(event, handler as any)
}

registerEffect(import.meta.url, () => {
  for (const [event, handler] of handlers) {
    emitter.off(event, handler as any)
  }
  handlers.clear()
})
```

## 注意事项

1. **仅开发环境生效**：HMR 配置系统仅在 `NODE_ENV=development` 或 `KARIN_DEV=true` 时启用
2. **Node 内部 API**：依赖 Node.js 18+ 的内部 ESM 缓存 API，生产环境自动降级
3. **配置文件最后处理**：`karin.hmr.config.*` 变更时会标记 pending，等其他模块处理完再重载
4. **Glob 模式**：`modules` 配置支持 glob 模式，如 `src/**/*.ts`
5. **错误处理**：清理函数执行错误会被捕获并记录，不会中断其他清理
