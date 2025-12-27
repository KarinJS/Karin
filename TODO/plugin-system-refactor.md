# 插件系统重构优化方案

> 目标: 性能 > 可维护性 > 可读性
> 原则: 逻辑越简单越好

## 🎯 重构目标

1. **高性能** - 最小化运行时开销，懒加载，高效缓存
2. **高可用** - HMR 可靠工作，插件隔离，错误不影响全局
3. **高维护性** - 单一职责，统一入口，清晰的数据流

## 📐 架构简化方案

### 当前问题 vs 目标架构

```
当前（混乱）:                    目标（简洁）:

┌─────────────────────┐        ┌─────────────────────┐
│ 4个独立加载器        │        │ PluginManager       │
│ npm/git/dev/apps    │   →    │ (唯一入口)           │
│ 各自为政             │        └──────────┬──────────┘
└─────────────────────┘                   │
                                          ▼
┌─────────────────────┐        ┌─────────────────────┐
│ 分散的注册逻辑       │        │ Registry            │
│ create/class.ts     │   →    │ (统一注册中心)       │
│ 不存在的 registry/  │        └──────────┬──────────┘
└─────────────────────┘                   │
                                          ▼
┌─────────────────────┐        ┌─────────────────────┐
│ 损坏的 HMR          │   →    │ Watcher             │
│ 依赖丢失            │        │ (简单文件监听)       │
└─────────────────────┘        └─────────────────────┘
```

## ✅ 优化清单

### P0 - 必须修复（HMR 可用）

| # | 任务 | 说明 | 预估工作量 |
|---|------|------|-----------|
| 1 | 创建 `registry/` 模块 | 统一的注册/注销中心 | 2h |
| 2 | 修复 HMR 依赖 | 让 hmr/ 模块能正常运行 | 1h |
| 3 | 在 `pluginLoader.run()` 中启用 HMR | 目前没有调用初始化 | 0.5h |

### P1 - 架构简化

| # | 任务 | 说明 | 预估工作量 |
|---|------|------|-----------|
| 4 | 合并 4 个加载器 | 统一为 1 个 `PluginLoader` + 策略模式 | 4h |
| 5 | 简化缓存结构 | 减少 `pluginCache` 的嵌套层级 | 2h |
| 6 | 统一生命周期 | `load → enable → disable → unload` | 3h |

### P2 - 性能优化

| # | 任务 | 说明 | 预估工作量 |
|---|------|------|-----------|
| 7 | 懒加载入口文件 | 按需 import，而非全部预加载 | 2h |
| 8 | 缓存 package.json 读取 | 避免重复 IO | 1h |
| 9 | 并行化文件扫描 | 使用 worker 或 Promise.all | 2h |

### P3 - 可维护性提升

| # | 任务 | 说明 | 预估工作量 |
|---|------|------|-----------|
| 10 | 添加单元测试 | 覆盖 Registry、Loader、HMR | 4h |
| 11 | 清理 TODO 注释 | 完成或删除过时的 TODO | 1h |
| 12 | 文档化核心流程 | 添加 JSDoc 和流程图 | 2h |

## 🏗️ 推荐的新架构

### 核心模块（3 个）

```typescript
// 1. PluginManager - 唯一入口
export const pluginManager = {
  init(),      // 初始化所有插件
  load(name),  // 加载单个插件
  unload(name),// 卸载单个插件
  reload(name),// 重载插件
  enable(name),
  disable(name),
}

// 2. Registry - 统一注册中心
export const registry = {
  add(type, item),      // 注册
  remove(type, id),     // 注销
  get(type, id),        // 获取
  getAll(type),         // 获取全部
  clear(pkgName),       // 清除某包的所有注册
}

// 3. Watcher - 文件监听
export const watcher = {
  watch(paths),   // 开始监听
  stop(),         // 停止监听
  onAdd(cb),
  onChange(cb),
  onRemove(cb),
}
```

### 数据流（单向）

```
[文件系统]
    │
    ▼ scan
[PluginManager]
    │
    ▼ register
[Registry] ←──── [Watcher] 监听变化
    │
    ▼ dispatch
[事件系统]
```

### 简化后的目录结构

```
packages/plugin/src/
├── index.ts           # 导出 pluginManager + DSL
├── manager.ts         # PluginManager 实现
├── registry.ts        # Registry 实现（新建）
├── watcher.ts         # Watcher 实现（从 hmr/ 提取）
├── loader.ts          # 统一的加载逻辑（合并 4 个加载器）
├── cache.ts           # 简化后的缓存
├── create/            # DSL（保持不变）
└── types.ts           # 类型定义
```

## 🔧 具体实现建议

### 1. Registry 模块实现

```typescript
// registry.ts
type PluginType = 'command' | 'accept' | 'handler' | 'button' | 'task'

interface RegistryItem {
  id: string
  pkg: string
  file: string
  instance: any
}

class Registry {
  private stores = new Map<PluginType, Map<string, RegistryItem>>()

  add(type: PluginType, item: RegistryItem) {
    if (!this.stores.has(type)) {
      this.stores.set(type, new Map())
    }
    this.stores.get(type)!.set(item.id, item)
  }

  remove(type: PluginType, id: string) {
    this.stores.get(type)?.delete(id)
  }

  // 按包名批量清除（用于卸载/重载）
  clearByPkg(pkg: string) {
    for (const store of this.stores.values()) {
      for (const [id, item] of store) {
        if (item.pkg === pkg) store.delete(id)
      }
    }
  }
}

export const registry = new Registry()
```

### 2. 统一加载器

```typescript
// loader.ts
type PluginSource = 'npm' | 'git' | 'dev' | 'apps'

interface LoadOptions {
  source: PluginSource
  path: string
}

export async function loadPlugin(options: LoadOptions) {
  // 1. 读取 package.json
  const pkg = await readPkg(options.path)

  // 2. 检查版本兼容性
  if (!checkEngines(pkg)) return

  // 3. 获取配置
  const config = await getConfig(pkg, options.path)

  // 4. 获取入口文件
  const entries = await getEntries(config, options.path)

  // 5. 加载并注册
  for (const entry of entries) {
    const module = await import(entry)
    registerModule(pkg.name, entry, module)
  }
}
```

### 3. 简化 HMR

```typescript
// watcher.ts
import chokidar from 'chokidar'
import { registry } from './registry'

export function createWatcher(paths: string[]) {
  return chokidar.watch(paths, { ignoreInitial: true })
    .on('change', async (file) => {
      // 1. 找到对应的包
      const pkg = findPkgByFile(file)

      // 2. 清除该文件的注册
      registry.clearByFile(file)

      // 3. 重新加载
      const module = await import(`${file}?t=${Date.now()}`)
      registerModule(pkg, file, module)

      logger.info(`[hmr] reloaded: ${file}`)
    })
}
```

## 📋 执行顺序建议

```
Week 1:
  ├── Day 1-2: 创建 registry.ts，修复 HMR 依赖
  ├── Day 3-4: 启用 HMR，验证基本热重载
  └── Day 5:   测试 + 修复问题

Week 2:
  ├── Day 1-2: 合并 4 个加载器为 1 个
  ├── Day 3:   简化缓存结构
  └── Day 4-5: 统一生命周期

Week 3:
  ├── Day 1-2: 性能优化（懒加载、缓存）
  └── Day 3-5: 单元测试 + 文档
```

## 🎯 成功标准

- [ ] HMR 正常工作（修改文件后自动重载）
- [ ] 插件加载时间 < 500ms（100 个插件）
- [ ] 单个文件修改不影响其他插件
- [ ] 核心模块代码量 < 500 行
- [ ] 测试覆盖率 > 80%

---

## 🔌 内部 API 设计（核心）

> **设计理念**: 插件系统导出一套完整的内部 API，HMR 等高级功能作为 API 的消费者实现，保持可扩展性。

### 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    External Consumers                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │   HMR   │  │  CLI    │  │  WebUI  │  │ 第三方  │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │
│       │            │            │            │          │
│       └────────────┴────────────┴────────────┘          │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Plugin Internal API                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │ Registry │ │ Loader   │ │ Lifecycle│         │   │
│  │  │   API    │ │   API    │ │   API    │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │  Cache   │ │  Module  │ │  Event   │         │   │
│  │  │   API    │ │   API    │ │   API    │         │   │
│  │  └──────────┘ └──────────┘ └──────────┘         │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  Core Storage                     │   │
│  │      (pluginCache, instances, metadata)          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 内部 API 模块划分

```typescript
// packages/plugin/src/api/index.ts
// 统一导出所有内部 API

export * from './registry'   // 注册/注销 API
export * from './loader'     // 加载 API
export * from './lifecycle'  // 生命周期 API
export * from './cache'      // 缓存访问 API
export * from './module'     // 模块操作 API
export * from './event'      // 事件 API
```

---

## 📦 API 详细设计

### 1. Registry API（注册中心）

```typescript
// api/registry.ts
export interface RegistryAPI {
  /**
   * 注册插件组件
   * @param type 组件类型
   * @param item 组件数据
   * @returns 注册 ID
   */
  register(type: PluginType, item: RegistryItem): string

  /**
   * 注销插件组件
   * @param type 组件类型
   * @param id 组件 ID
   */
  unregister(type: PluginType, id: string): boolean

  /**
   * 按文件路径注销所有组件
   * @param filePath 文件绝对路径
   * @returns 注销的组件数量
   */
  unregisterByFile(filePath: string): number

  /**
   * 按包名注销所有组件
   * @param pkgName 包名
   * @returns 注销的组件数量
   */
  unregisterByPackage(pkgName: string): number

  /**
   * 获取组件
   */
  get(type: PluginType, id: string): RegistryItem | undefined

  /**
   * 获取某类型的所有组件
   */
  getAll(type: PluginType): RegistryItem[]

  /**
   * 获取某文件注册的所有组件
   */
  getByFile(filePath: string): RegistryItem[]

  /**
   * 获取某包注册的所有组件
   */
  getByPackage(pkgName: string): RegistryItem[]

  /**
   * 触发排序（优先级变更后调用）
   */
  sort(type?: PluginType): void
}

export type PluginType = 'command' | 'accept' | 'handler' | 'button' | 'task'

export interface RegistryItem {
  id: string
  type: PluginType
  pkg: string           // 所属包名
  file: string          // 来源文件
  priority: number      // 优先级
  instance: any         // 实际实例
  metadata?: Record<string, any>
}
```

### 2. Loader API（加载器）

```typescript
// api/loader.ts
export interface LoaderAPI {
  /**
   * 加载单个文件
   * @param filePath 文件绝对路径
   * @param options 加载选项
   */
  loadFile(filePath: string, options?: LoadFileOptions): Promise<LoadResult>

  /**
   * 加载整个包
   * @param pkgPath 包路径
   */
  loadPackage(pkgPath: string): Promise<LoadResult>

  /**
   * 重新加载文件（清除缓存后加载）
   * @param filePath 文件绝对路径
   */
  reloadFile(filePath: string): Promise<LoadResult>

  /**
   * 重新加载包
   * @param pkgName 包名
   */
  reloadPackage(pkgName: string): Promise<LoadResult>

  /**
   * 导入模块（带缓存清除）
   * @param filePath 文件路径
   * @param bustCache 是否清除缓存
   */
  importModule(filePath: string, bustCache?: boolean): Promise<any>
}

export interface LoadFileOptions {
  /** 是否强制重新加载（清除缓存） */
  force?: boolean
  /** 所属包名（可选，自动推断） */
  pkg?: string
  /** 是否静默（不打印日志） */
  silent?: boolean
}

export interface LoadResult {
  success: boolean
  file: string
  pkg?: string
  registered: number  // 注册的组件数量
  error?: Error
}
```

### 3. Lifecycle API（生命周期）

```typescript
// api/lifecycle.ts
export interface LifecycleAPI {
  /**
   * 启用插件包
   */
  enable(pkgName: string): Promise<void>

  /**
   * 禁用插件包（保留注册但不响应事件）
   */
  disable(pkgName: string): Promise<void>

  /**
   * 卸载插件包（完全移除）
   */
  unload(pkgName: string): Promise<void>

  /**
   * 获取插件状态
   */
  getStatus(pkgName: string): PluginStatus

  /**
   * 获取所有已加载的包
   */
  getLoadedPackages(): PackageInfo[]
}

export type PluginStatus = 'loading' | 'loaded' | 'enabled' | 'disabled' | 'error' | 'unloaded'

export interface PackageInfo {
  name: string
  version: string
  status: PluginStatus
  path: string
  files: string[]
  components: number
}
```

### 4. Module API（模块操作）

```typescript
// api/module.ts
export interface ModuleAPI {
  /**
   * 清除模块缓存
   * @param filePath 文件路径
   * @param recursive 是否清除依赖该模块的其他模块缓存
   */
  clearCache(filePath: string, recursive?: boolean): void

  /**
   * 查找依赖某文件的所有模块
   * @param filePath 文件路径
   */
  findDependents(filePath: string): string[]

  /**
   * 查找某文件依赖的所有模块
   * @param filePath 文件路径
   */
  findDependencies(filePath: string): string[]

  /**
   * 根据文件路径获取所属包名
   */
  getPackageByFile(filePath: string): string | null

  /**
   * 根据包名获取所有文件
   */
  getFilesByPackage(pkgName: string): string[]
}
```

### 5. Cache API（缓存访问）

```typescript
// api/cache.ts
export interface CacheAPI {
  /**
   * 获取包信息
   */
  getPackage(name: string): PackageCache | undefined

  /**
   * 获取所有包
   */
  getAllPackages(): Map<string, PackageCache>

  /**
   * 获取组件实例缓存
   */
  getInstances(type: PluginType): Map<string, any>

  /**
   * 设置自定义缓存数据
   */
  set(key: string, value: any): void

  /**
   * 获取自定义缓存数据
   */
  get<T>(key: string): T | undefined

  /**
   * 清除所有缓存
   */
  clear(): void
}
```

### 6. Event API（事件）

```typescript
// api/event.ts
export interface EventAPI {
  /**
   * 监听插件事件
   */
  on(event: PluginEvent, handler: EventHandler): () => void

  /**
   * 单次监听
   */
  once(event: PluginEvent, handler: EventHandler): () => void

  /**
   * 触发事件
   */
  emit(event: PluginEvent, data?: any): void
}

export type PluginEvent =
  | 'plugin:load:start'
  | 'plugin:load:done'
  | 'plugin:load:error'
  | 'plugin:unload'
  | 'plugin:reload'
  | 'plugin:enable'
  | 'plugin:disable'
  | 'file:change'
  | 'file:add'
  | 'file:remove'
  | 'registry:add'
  | 'registry:remove'
```

---

## 🔥 HMR 作为 API 消费者

### HMR 实现示例

```typescript
// hmr/index.ts
// HMR 完全基于内部 API 实现，不直接操作 pluginCache

import chokidar from 'chokidar'
import {
  registry,      // Registry API
  loader,        // Loader API
  module,        // Module API
  event,         // Event API
  cache,         // Cache API
} from '../api'

export interface HMROptions {
  /** 监听的文件/目录列表 */
  paths: string[]
  /** 文件扩展名过滤 */
  extensions?: string[]
  /** 防抖延迟 */
  debounce?: number
  /** 自定义重载策略 */
  reloadStrategy?: 'file' | 'package' | 'all'
}

export class HotModuleReloader {
  private watcher: chokidar.FSWatcher | null = null
  private options: Required<HMROptions>

  constructor(options: HMROptions) {
    this.options = {
      extensions: ['.js', '.ts', '.mjs', '.mts'],
      debounce: 100,
      reloadStrategy: 'file',
      ...options,
    }
  }

  /**
   * 启动 HMR
   */
  start() {
    this.watcher = chokidar.watch(this.options.paths, {
      ignoreInitial: true,
      ignored: (file) => !this.isWatchedExtension(file),
    })

    this.watcher
      .on('add', (file) => this.handleAdd(file))
      .on('change', (file) => this.handleChange(file))
      .on('unlink', (file) => this.handleRemove(file))

    event.emit('hmr:start', { paths: this.options.paths })
  }

  /**
   * 停止 HMR
   */
  stop() {
    this.watcher?.close()
    this.watcher = null
    event.emit('hmr:stop')
  }

  private async handleAdd(filePath: string) {
    // 使用 Loader API 加载新文件
    const result = await loader.loadFile(filePath)

    if (result.success) {
      event.emit('file:add', { file: filePath, registered: result.registered })
      logger.info(`[hmr] added: ${filePath}`)
    }
  }

  private async handleChange(filePath: string) {
    const pkgName = module.getPackageByFile(filePath)

    if (this.options.reloadStrategy === 'package' && pkgName) {
      // 整包重载策略
      await this.reloadPackage(pkgName)
    } else {
      // 单文件重载策略
      await this.reloadFile(filePath)
    }
  }

  private async handleRemove(filePath: string) {
    // 使用 Registry API 注销该文件的所有组件
    const count = registry.unregisterByFile(filePath)

    // 使用 Module API 清除缓存
    module.clearCache(filePath, true)

    event.emit('file:remove', { file: filePath, unregistered: count })
    logger.info(`[hmr] removed: ${filePath}`)
  }

  /**
   * 重载单个文件
   */
  async reloadFile(filePath: string) {
    // 1. 注销该文件的所有组件
    registry.unregisterByFile(filePath)

    // 2. 清除模块缓存
    module.clearCache(filePath, true)

    // 3. 重新加载
    const result = await loader.loadFile(filePath, { force: true })

    // 4. 触发排序
    registry.sort()

    event.emit('file:change', { file: filePath, result })
    logger.info(`[hmr] reloaded: ${filePath}`)

    return result
  }

  /**
   * 重载整个包
   */
  async reloadPackage(pkgName: string) {
    // 1. 注销该包的所有组件
    registry.unregisterByPackage(pkgName)

    // 2. 获取该包的所有文件
    const files = module.getFilesByPackage(pkgName)

    // 3. 清除所有文件的缓存
    files.forEach(f => module.clearCache(f, true))

    // 4. 重新加载
    const result = await loader.reloadPackage(pkgName)

    // 5. 触发排序
    registry.sort()

    event.emit('plugin:reload', { pkg: pkgName, result })
    logger.info(`[hmr] reloaded package: ${pkgName}`)

    return result
  }

  private isWatchedExtension(file: string): boolean {
    return this.options.extensions.some(ext => file.endsWith(ext))
  }
}

// 工厂函数
export function createHMR(options: HMROptions) {
  return new HotModuleReloader(options)
}
```

### 第三方 HMR 实现示例

```typescript
// 第三方可以基于相同的 API 实现自己的 HMR 策略
import { registry, loader, module, event } from '@karinjs/plugin/api'

// 例如：基于 WebSocket 的远程 HMR
export class RemoteHMR {
  constructor(private ws: WebSocket) {
    ws.on('message', (data) => {
      const { type, file } = JSON.parse(data)

      if (type === 'reload') {
        this.handleReload(file)
      }
    })
  }

  private async handleReload(filePath: string) {
    registry.unregisterByFile(filePath)
    module.clearCache(filePath)
    await loader.loadFile(filePath, { force: true })
    registry.sort()
  }
}

// 例如：基于 Git Hook 的 HMR
export class GitHookHMR {
  async onPostMerge(changedFiles: string[]) {
    for (const file of changedFiles) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        registry.unregisterByFile(file)
        module.clearCache(file)
        await loader.loadFile(file, { force: true })
      }
    }
    registry.sort()
  }
}
```

---

## 📁 重构后的目录结构

```
packages/plugin/src/
├── index.ts                 # 公开 API + DSL
├── api/                     # 内部 API（核心）
│   ├── index.ts             # 统一导出
│   ├── registry.ts          # Registry API
│   ├── loader.ts            # Loader API
│   ├── lifecycle.ts         # Lifecycle API
│   ├── module.ts            # Module API
│   ├── cache.ts             # Cache API
│   └── event.ts             # Event API
├── core/                    # 核心实现
│   ├── registry.impl.ts     # Registry 实现
│   ├── loader.impl.ts       # Loader 实现
│   ├── lifecycle.impl.ts    # Lifecycle 实现
│   └── storage.ts           # 底层存储
├── create/                  # DSL（保持不变）
│   ├── command.ts
│   ├── accept.ts
│   ├── handler.ts
│   ├── button.ts
│   ├── task.ts
│   └── class.ts
├── hmr/                     # HMR 实现（API 消费者）
│   ├── index.ts
│   ├── watcher.ts
│   └── strategies/          # 可选的重载策略
│       ├── file.ts
│       ├── package.ts
│       └── full.ts
└── types/                   # 类型定义
    └── index.ts
```

---

## 🎯 可扩展性设计

### 扩展点

| 扩展点 | 说明 | 使用场景 |
|--------|------|----------|
| 自定义 HMR | 基于内部 API 实现自己的热重载 | 远程同步、Git 集成 |
| 自定义加载策略 | 扩展 Loader API | 加密插件、远程插件 |
| 自定义组件类型 | 扩展 Registry | 新的插件组件类型 |
| 生命周期钩子 | 监听 Event API | 插件统计、日志 |

### 插件 API 导出

```typescript
// packages/plugin/src/index.ts

// 公开 API（给插件开发者）
export { command, accept, handler, button, task, Plugin } from './create'

// 内部 API（给高级用户和扩展）
export * as api from './api'

// 或者分开导出
export {
  registry,
  loader,
  lifecycle,
  module,
  cache,
  event,
} from './api'

// HMR 工具（可选使用）
export { createHMR, HotModuleReloader } from './hmr'
```

---

## 💡 总结

**最小改动方案**（如果时间紧张）:

1. 创建 `registry.ts` 模块
2. 修复 `hmr/` 的 import 路径
3. 在 `pluginLoader.run()` 末尾调用 `HMRManager.init()`

**完整重构方案**（推荐）:

1. 按上述优化清单逐步执行
2. 最终目标：分层 API + HMR 作为消费者

**核心设计原则**:

1. **分层清晰** - 内部 API 层 → HMR/CLI/WebUI 消费层
2. **单一职责** - 每个 API 只做一件事
3. **可扩展** - 第三方可基于 API 实现自己的功能
4. **无副作用** - API 调用不产生意外的全局影响
