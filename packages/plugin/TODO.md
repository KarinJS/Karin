# Plugin v11 重构计划

> **目标**：提高可维护性和可读性，统一架构，更好适配 HMR

---

## 📋 目录

1. [设计理念](#-设计理念)
2. [HMR 架构设计](#-hmr-架构设计)
3. [标准缓存 API](#-标准缓存-api)
4. [当前状态分析](#-当前状态分析)
5. [架构决策](#-架构决策)
6. [详细实现计划](#-详细实现计划)
7. [数据流设计](#-数据流设计)
8. [API 设计](#-api-设计)
9. [迁移清单](#-迁移清单)
10. [测试计划](#-测试计划)

---

## 🎯 设计理念

### 核心原则

| 原则 | 说明 | 来源 |
|------|------|------|
| **纯函数优先** | 全部用纯函数 + 闭包，无 class | v9 |
| **API 分离** | `command()` 极简，`cmd()` 链式，`ref()` 响应式 | v10 |
| **统一存储** | 单一 Store 管理所有插件实例 | v8/v11 |
| **事件驱动** | Store 发射事件，HMR 订阅响应 | v8 |
| **开发优先** | HMR 作为核心特性设计 | v9 |

### 三种创建方式（v10 方案）

```typescript
// 1. 极简方式 - command()
command(/^ping$/, 'pong')

// 2. 链式方式 - cmd()
cmd(/^admin$/, doAdmin)
  .name('管理命令')
  .perm('master')
  .priority(1)

// 3. 响应式方式 - ref()
const ping = ref(/^ping$/, 'pong')
ping.disabled = true  // 动态控制
```

### 为什么这样设计？

1. **极简 `command()`**：80% 的场景只需要最简单的用法
2. **链式 `cmd()`**：复杂配置时提供流畅的链式体验
3. **响应式 `ref()`**：需要动态控制时使用

---

## � HMR 架构设计

### 包类型与 HMR 策略

| 类型 | HMR 策略 | 实现方式 | 说明 |
|------|----------|----------|------|
| `apps` | ✅ 内置支持 | URL 参数 `?t=timestamp` | 任何环境都支持，ESM 原生机制 |
| `dev` | ✅ 独立插件包 | Node 内部缓存 API | 需安装 `@karinjs/hmr` 插件 |
| `npm` | ❌ 不支持 | - | 生产环境，无需热更新 |

### 架构分层

```
┌─────────────────────────────────────────────────────────────────┐
│                     @karinjs/plugin (核心包)                     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   store     │  │    pkg      │  │   create    │              │
│  │  (标准API)  │  │ (包注册表)  │  │  (插件DSL)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ↓                                      │
│                   标准 API 暴露                                  │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  apps 热更新  │  │ @karinjs/hmr  │  │   第三方实现   │
│  (内置 URL)   │  │ (Node 缓存)   │  │   (自定义)    │
└───────────────┘  └───────────────┘  └───────────────┘
```

### apps 热更新（内置）

apps 类型天生支持热更新，使用 ESM 的 URL 参数机制：

```typescript
// 内置在 @karinjs/plugin 中
// src/hot/apps.ts

export async function reloadAppsFile(file: string): Promise<void> {
  // 1. 删除旧插件
  store.delByFile(file)

  // 2. 通过 URL 参数绕过缓存重新导入
  await import(`${file}?t=${Date.now()}`)

  // 3. 插件自动注册到 store
}
```

**特点**：

- 无需额外依赖
- 任何环境都支持
- 简单可靠

### dev 热更新（独立包）

dev 类型使用 Node 内部缓存 API，作为**独立插件包**提供：

**包结构**：

```
packages/
├── plugin/           # @karinjs/plugin (核心)
└── hmr/              # @karinjs/hmr (HMR 插件)
    ├── package.json
    ├── src/
    │   ├── index.ts
    │   ├── watcher.ts       # 文件监听
    │   ├── cache.ts         # Node 缓存清理
    │   ├── reload.ts        # 重载逻辑
    │   └── integration.ts   # 与 store 集成
    └── README.md
```

**@karinjs/hmr 包设计**：

```typescript
// packages/hmr/src/index.ts

import { store, pkgRegistry, onLoad, onUnload } from '@karinjs/plugin'
import { watch } from 'chokidar'
import { clearModuleCache, findDependentModules } from './cache'

export interface HMROptions {
  /** 监听的目录 */
  paths: string[]
  /** 防抖延迟 */
  delay?: number
  /** 忽略的文件 */
  ignore?: string[]
}

/**
 * 创建 HMR 实例
 * @example
 * ```ts
 * import { createHMR } from '@karinjs/hmr'
 *
 * const hmr = createHMR({
 *   paths: ['./plugins/dev'],
 *   delay: 100
 * })
 *
 * await hmr.start()
 * ```
 */
export function createHMR(options: HMROptions) {
  let watcher: ReturnType<typeof watch> | null = null

  return {
    /** 启动 HMR */
    async start() {
      watcher = watch(options.paths, {
        ignoreInitial: true,
        ignored: options.ignore ?? /node_modules/,
      })

      watcher.on('change', async (file) => {
        await this.reload(file)
      })
    },

    /** 停止 HMR */
    stop() {
      watcher?.close()
      watcher = null
    },

    /** 重载文件 */
    async reload(file: string) {
      // 1. 执行卸载钩子
      await runUnloadHooks(file)

      // 2. 清除 Node 模块缓存（关键：使用 Node 内部 API）
      clearModuleCache(file)

      // 3. 清除依赖模块缓存
      const deps = findDependentModules(file)
      for (const dep of deps) {
        clearModuleCache(dep)
      }

      // 4. 删除旧插件（使用标准 store API）
      const count = store.delByFile(file)

      // 5. 重新导入
      await import(file)

      // 6. 执行加载钩子
      await runLoadHooks(file)
    }
  }
}

/**
 * Node 内部缓存清理
 * 这是 dev 类型 HMR 的核心
 */
function clearModuleCache(file: string): void {
  // CommonJS
  const resolved = require.resolve(file)
  delete require.cache[resolved]

  // ESM (Node 20.6+ 实验性)
  // 需要使用 --experimental-vm-modules
}
```

**使用方式**：

```typescript
// karin.config.ts
import { defineKarinConfig } from '@karinjs/plugin'
import { createHMR } from '@karinjs/hmr'

// 在开发环境启用 HMR
if (process.env.NODE_ENV === 'development') {
  const hmr = createHMR({
    paths: ['./plugins/dev'],
    delay: 100,
  })
  hmr.start()
}

export default defineKarinConfig({
  // ...
})
```

### 为什么 HMR 独立成包？

1. **可选依赖**：生产环境不需要 HMR，减少包体积
2. **灵活替换**：用户可以使用自己的 HMR 实现
3. **关注分离**：核心包只提供标准 API，不绑定具体 HMR 策略
4. **易于维护**：HMR 逻辑复杂，独立维护更清晰

---

## 📐 标准缓存 API

### 设计原则

核心包 `@karinjs/plugin` 应该提供**标准、稳定、完整**的缓存 API：

1. **标准化**：API 设计遵循一致的命名和参数规范
2. **稳定性**：API 一旦发布，保持向后兼容
3. **完整性**：提供足够的能力供外部（如 HMR 包）使用
4. **文档化**：每个 API 都有完整的 JSDoc 注释

### Store API（核心存储）

```typescript
// @karinjs/plugin 导出

export interface Store {
  // ==================== 添加 ====================

  /**
   * 添加插件到存储
   * @param type 插件类型
   * @param plugin 插件实例
   * @fires store:add
   */
  add<T extends PluginType>(type: T, plugin: PluginTypeMap[T]): void

  // ==================== 删除 ====================

  /**
   * 按 ID 删除插件
   * @param id 插件 ID
   * @returns 是否成功删除
   * @fires store:del
   */
  del(id: string): boolean

  /**
   * 按文件删除所有插件
   * @param file 文件绝对路径
   * @returns 删除的插件数量
   * @fires store:del (每个插件)
   * @example HMR 场景：文件变更时清理
   */
  delByFile(file: string): number

  /**
   * 按包名删除所有插件
   * @param pkg 包名
   * @returns 删除的插件数量
   * @fires store:del (每个插件)
   */
  delByPkg(pkg: string): number

  // ==================== 查询 ====================

  /**
   * 获取某类型的所有插件（已排序、过滤禁用）
   * @param type 插件类型
   * @returns 排序后的插件数组
   */
  get<T extends PluginType>(type: T): PluginTypeMap[T][]

  /**
   * 获取某类型的所有插件（未排序、包含禁用）
   * @param type 插件类型
   * @returns 原始插件数组
   */
  getAll<T extends PluginType>(type: T): PluginTypeMap[T][]

  /**
   * 按 ID 获取插件
   * @param id 插件 ID
   * @returns 插件实例或 undefined
   */
  getById(id: string): AnyPlugin | undefined

  /**
   * 按文件获取所有插件
   * @param file 文件绝对路径
   * @returns 该文件注册的所有插件
   * @example HMR 场景：查看文件内容
   */
  getByFile(file: string): AnyPlugin[]

  /**
   * 按包名获取所有插件
   * @param pkg 包名
   * @returns 该包注册的所有插件
   */
  getByPkg(pkg: string): AnyPlugin[]

  /**
   * 检查插件是否存在
   * @param id 插件 ID
   */
  has(id: string): boolean

  // ==================== 更新 ====================

  /**
   * 更新插件属性
   * @param id 插件 ID
   * @param key 属性名
   * @param value 新值
   * @returns 是否成功
   * @fires store:update
   */
  update(id: string, key: string, value: unknown): boolean

  /**
   * 禁用插件
   * @param id 插件 ID
   */
  disable(id: string): boolean

  /**
   * 启用插件
   * @param id 插件 ID
   */
  enable(id: string): boolean

  // ==================== Handler 特殊操作 ====================

  /**
   * 按 key 获取 Handler
   * @param key Handler 的 key
   * @returns 匹配的 Handler 列表（已排序）
   */
  getHandler(key: string): CreateHandler[]

  // ==================== 批量操作 ====================

  /**
   * 清空存储
   * @param type 可选，指定类型；不传则清空全部
   * @fires store:clear
   */
  clear(type?: PluginType): void

  /**
   * 标记需要重新排序
   * @param type 插件类型
   */
  markDirty(type: PluginType): void

  // ==================== 统计 ====================

  /**
   * 获取统计信息
   * @returns 各类型插件数量统计
   */
  stats(): GlobalStats

  // ==================== 索引管理 ====================

  /**
   * 注册文件（加载器调用）
   * @param file 文件绝对路径
   * @param pkg 所属包名
   */
  registerFile(file: string, pkg: string): void

  /**
   * 注册包（加载器调用）
   * @param info 包信息
   */
  registerPackage(info: Omit<PackageInfo, 'files' | 'pluginIds'>): void

  /**
   * 获取文件信息
   * @param file 文件绝对路径
   */
  getFileInfo(file: string): FileInfo | undefined

  /**
   * 获取包信息
   * @param pkg 包名
   */
  getPackageInfo(pkg: string): PackageInfo | undefined

  // ==================== 事件 ====================

  /**
   * 监听事件
   * @example
   * ```ts
   * store.on('add', (type, plugin) => {
   *   console.log(`新插件: ${plugin.id}`)
   * })
   * ```
   */
  on<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void

  /**
   * 取消监听
   */
  off<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void

  /**
   * 监听一次
   */
  once<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void

  // ==================== 调试 ====================

  /**
   * 导出所有数据（调试用）
   */
  dump(): unknown
}
```

### 事件定义

```typescript
/**
 * Store 事件类型
 * 供外部订阅，实现自定义 HMR 等功能
 */
export interface StoreEvents {
  /** 插件添加 */
  add: [type: PluginType, plugin: AnyPlugin]

  /** 插件删除 */
  del: [type: PluginType, id: string, plugin: AnyPlugin]

  /** 插件更新 */
  update: [type: PluginType, id: string, key: string, newVal: unknown, oldVal: unknown]

  /** 排序完成 */
  sort: [type: PluginType]

  /** 清空 */
  clear: [type: PluginType | 'all']
}
```

### 生命周期 API

```typescript
/**
 * 生命周期钩子
 * 供 HMR 包调用，管理插件加载/卸载
 */

/**
 * 注册加载钩子
 * @param callback 加载时执行的函数
 */
export function onLoad(callback: () => void | Promise<void>): void

/**
 * 注册卸载钩子
 * @param callback 卸载时执行的函数
 */
export function onUnload(callback: () => void | Promise<void>): void

/**
 * 执行卸载钩子（供 HMR 调用）
 * @param file 文件路径
 */
export function runUnloadHooks(file: string): Promise<void>

/**
 * 执行加载钩子（供 HMR 调用）
 * @param file 文件路径
 */
export function runLoadHooks(file: string): Promise<void>
```

### 包注册表 API

```typescript
/**
 * 包注册表
 * 管理 文件 ↔ 包 的映射关系
 */
export interface PkgRegistry {
  /**
   * 注册包
   */
  registerPackage(info: PackageInfo): void

  /**
   * 注册文件
   */
  registerFile(file: string, pkg: string): void

  /**
   * 按文件获取包信息
   */
  getByFile(file: string): PackageInfo | undefined

  /**
   * 按包名获取包信息
   */
  getByName(name: string): PackageInfo | undefined

  /**
   * 获取包的所有文件
   */
  getFiles(pkg: string): string[]

  /**
   * 检查文件是否属于某个包
   */
  belongsTo(file: string, pkg: string): boolean

  /**
   * 获取所有包
   */
  getAll(): Map<string, PackageInfo>

  /**
   * 删除包
   */
  unregister(pkg: string): boolean
}
```

### 完整导出清单

```typescript
// @karinjs/plugin 最终导出

// ==================== 核心存储（标准 API） ====================

/** 统一存储 - 插件实例管理 */
export { store } from './store'

/** 包注册表 - 文件↔包映射 */
export { pkgRegistry } from './pkg'

// ==================== 辅助存储 ====================

/** 热点缓存 - 命令匹配优化 */
export { hotCache } from './store'

/** 缺失依赖 - 错误追踪 */
export { missingDeps } from './store'

/** 包列表 - npm/dev/apps 包管理 */
export { packageList } from './store'

/** 环境变量 - 插件 env 管理 */
export { envManager } from './store'

/** 引擎设置 - 版本兼容检查 */
export { engineSettings } from './store'

/** 静态目录 - public 目录管理 */
export { publicManager } from './store'

// ==================== 生命周期（供 HMR 使用） ====================

export { onLoad, onUnload, onReload } from './lifecycle'
export { runUnloadHooks, runLoadHooks } from './lifecycle'

// ==================== 类型导出 ====================

export type {
  Store,
  StoreEvents,
  StoreEventListener,
  PluginType,
  PluginTypeMap,
  AnyPlugin,
  GlobalStats,
  FileInfo,
  PackageInfo,
  PkgRegistry,
} from './store'
```

### API 使用示例

**示例 1：自定义 HMR 实现**

```typescript
import { store, runUnloadHooks, runLoadHooks } from '@karinjs/plugin'

async function myHMR(file: string) {
  // 使用标准 API
  await runUnloadHooks(file)
  store.delByFile(file)

  // 自定义重载逻辑
  await myCustomReload(file)

  await runLoadHooks(file)
}
```

**示例 2：插件统计面板**

```typescript
import { store } from '@karinjs/plugin'

function renderDashboard() {
  const stats = store.stats()

  return {
    commands: stats.command.total,
    handlers: stats.handler.total,
    tasks: stats.task.total,
    // ...
  }
}
```

**示例 3：监听插件变化**

```typescript
import { store } from '@karinjs/plugin'

// 实时日志
store.on('add', (type, plugin) => {
  console.log(`[${type}] 新增: ${plugin.name}`)
})

store.on('del', (type, id) => {
  console.log(`[${type}] 删除: ${id}`)
})
```

### 已完成

| 模块 | 状态 | 说明 |
|------|------|------|
| `store/index.ts` | ✅ 完成 | 统一存储层，事件驱动 |
| `store/hotCache.ts` | ✅ 完成 | 命令热点缓存 |
| `store/missingDeps.ts` | ✅ 完成 | 缺失依赖追踪 |
| `store/types.ts` | ✅ 完成 | 类型定义 |
| `store/list.ts` | ✅ 完成 | 包列表管理 |
| `store/envs.ts` | ✅ 完成 | 环境变量（v1 已移除） |
| `store/settings.ts` | ✅ 完成 | 引擎设置 |
| `store/public.ts` | ✅ 完成 | 静态目录管理 |
| `create/class.ts` | ✅ 已删除 | class 插件已移除 |
| `cache/` | ✅ 已删除 | 旧缓存系统已移除 |
| `pkg/index.ts` | ✅ 完成 | 包注册表 |
| `create/*.ts` | ✅ 完成 | 纯函数 API |
| `reactive/` | ✅ 完成 | ref() 响应式 |
| `lifecycle/` | ✅ 完成 | onLoad/onUnload |
| `hot/` | ✅ 完成 | HMR 核心 |
| `core/utils/status.ts` | ✅ 完成 | 使用新 store API |
| `core/utils/env.ts` | ✅ 完成 | v1 兼容已移除 |
| `core/utils/engines.ts` | ✅ 完成 | 使用新 store API |

### 待重构

| 模块 | 状态 | 问题 |
|------|------|------|
| `core/load/core.ts` | ⚠️ 待更新 | 需要使用新 store API |
| `core/load/npm.ts` | ⚠️ 待更新 | 需要使用新 store API |
| `core/load/dev.ts` | ⚠️ 待更新 | 需要使用新 store API |
| `core/load/apps.ts` | ⚠️ 待更新 | 需要使用新 store API |
| `package/types.ts` | ⚠️ 待更新 | 移除 git 类型 |
| `packages-core/adapter` | ⚠️ 待更新 | 使用 pluginCache，需重构 |

### 架构不一致问题

```typescript
// 问题1：加载器仍使用旧缓存
// core/load/npm.ts
import { pluginCache } from '../../cache'  // ❌ 旧
pluginCache.list.set('npm', npm)

// 问题2：两套并行系统
// index.ts 同时导出
export { store } from './store'            // ✅ 新
// 而 core/load/core.ts 使用
import { pluginCache } from '../../cache'  // ❌ 旧
```

---

## 🏗️ 架构决策

### 决策 1：包类型简化

| 决策 | 保留 | 移除 | 理由 |
|------|------|------|------|
| 包类型 | `npm`, `dev`, `apps` | `git` | HMR 复杂度过高 |

**git 移除理由**：

- git 克隆的包做 HMR 需要处理依赖、编译、缓存多层
- 维护成本高，实际使用场景少
- 用户可以用 `dev` 类型替代开发需求

### 决策 2：缓存系统完全重写

```
旧架构 (cache/)                新架构 (store/)
├── index.ts (pluginCache)     ├── index.ts (统一 Store)
├── list.ts                    ├── hotCache.ts
├── package.ts                 ├── missingDeps.ts
├── instances.ts        →      └── types.ts
├── register.ts
├── unregister.ts              pkg/
├── envs.ts                    └── index.ts (包注册表)
├── settings.ts
├── hot.ts
├── missingDeps.ts
└── public.ts
```

### 决策 3：响应式设计（采用 v9 方案）

```typescript
// v8 方案：需要 .value
ping.value.reg = /^pong$/  // ❌ 繁琐

// v9 方案：直接访问（采用）
ping.reg = /^pong$/        // ✅ 简洁
ping.disabled = true       // ✅ 直观
ping.dispose()             // ✅ 卸载
```

### 决策 4：Store 事件驱动

```typescript
// Store 发射事件
store.on('add', (type, plugin) => { ... })
store.on('del', (type, id, plugin) => { ... })
store.on('update', (type, id, key, newVal, oldVal) => { ... })
store.on('sort', (type) => { ... })

// HMR 订阅响应
function initHMR() {
  store.on('add', (type, plugin) => {
    if (plugin.file) {
      console.debug(`[HMR] 追踪: ${plugin.id}`)
    }
  })
}
```

---

## 📝 详细实现计划

### Phase 1: 完成 store 模块（优先级：高）

#### 1.1 迁移 list 管理

**文件**：`store/list.ts`

**功能**：管理包列表（npm/dev/apps）

```typescript
// store/list.ts
type PkgType = 'npm' | 'dev' | 'apps'  // 注意：无 git

interface PackageListItem {
  name: string
  abs: string
  pkg: string  // package.json 路径
}

interface PackageList {
  /** 设置包列表 */
  set(type: PkgType, list: PackageListItem[]): void

  /** 获取包列表 */
  get(type: PkgType): PackageListItem[]

  /** 获取所有包 */
  getAll(): Map<PkgType, PackageListItem[]>

  /** 按名称查找 */
  findByName(name: string): { type: PkgType; item: PackageListItem } | null

  /** 清空 */
  clear(type?: PkgType): void
}

export const packageList: PackageList = { ... }
```

**迁移自**：`cache/list.ts`

**关键变化**：

- 移除 `git` 类型
- 简化为纯数据结构，无副作用

#### 1.2 迁移环境变量管理

**文件**：`store/envs.ts`

**功能**：管理插件环境变量

```typescript
// store/envs.ts
interface EnvManager {
  /** 创建插件环境变量 (v2) */
  create(pkgName: string, env?: Record<string, any>): void

  /** 创建插件环境变量 (v1 兼容) */
  createV1(pkgName: string, env?: Record<string, any>): void

  /** 获取环境变量 */
  get(pkgName: string): Record<string, any> | undefined

  /** 清除 */
  clear(pkgName?: string): void
}

export const envManager: EnvManager = { ... }
```

**迁移自**：`cache/envs.ts` + `core/utils/env.ts`

**关键变化**：

- 合并分散的 env 逻辑
- 统一到 store 模块

#### 1.3 迁移引擎设置

**文件**：`store/settings.ts`

**功能**：管理版本引擎设置

```typescript
// store/settings.ts
interface VersionSetting {
  name: string
  version: string
  ignoreEngines: boolean
}

interface EngineSettings {
  /** 添加版本设置 */
  add(setting: VersionSetting): void

  /** 检查版本兼容性 */
  check(name: string, version: string, ignoreEngines?: boolean): boolean

  /** 获取所有设置 */
  getAll(): VersionSetting[]

  /** 打印状态 */
  print(): void
}

export const engineSettings: EngineSettings = { ... }
```

**迁移自**：`cache/settings.ts` + `core/utils/engines.ts`

#### 1.4 迁移 public 管理

**文件**：`store/public.ts`

**功能**：管理静态目录

```typescript
// store/public.ts
interface PublicDir {
  path: string
  alias?: string
}

interface PublicManager {
  /** 设置静态目录 */
  set(pkgName: string, dirs: PublicDir | PublicDir[]): void

  /** 获取 */
  get(pkgName: string): PublicDir[]

  /** 获取所有 */
  getAll(): Map<string, PublicDir[]>

  /** 清除 */
  clear(pkgName?: string): void
}

export const publicManager: PublicManager = { ... }
```

**迁移自**：`cache/public.ts`

### Phase 2: 加载器重写（优先级：高）

#### 2.1 删除 git 加载器

**操作**：删除 `core/load/git.ts`

**影响**：

- `core/load/index.ts` 移除 git 导出
- `pluginLoader.run()` 移除 git 加载

#### 2.2 重写核心加载器基类

**文件**：`core/load/core.ts`

**变更点**：

```typescript
// 旧
import { pluginCache } from '../../cache'

// 新
import { store } from '../../store'
import { packageList, envManager, engineSettings, publicManager } from '../../store'
import { pkgRegistry } from '../../pkg'

// 旧方法
this.addCache(meta, 'npm', main, entry)
pluginCache.package.add(meta.name, { ... })

// 新方法
pkgRegistry.registerPackage({
  name: meta.name,
  type: 'npm',
  main,
  abs: meta.abs,
  pkg: meta.pkg,
})
for (const file of entry) {
  pkgRegistry.registerFile(file, meta.name)
}
```

#### 2.3 重写 npm 加载器

**文件**：`core/load/npm.ts`

**关键变更**：

```typescript
// 旧
import { pluginCache } from '../../cache'
pluginCache.list.set('npm', npm)
pluginCache.package.add(...)

// 新
import { packageList } from '../../store'
import { pkgRegistry } from '../../pkg'

packageList.set('npm', npm)
pkgRegistry.registerPackage(...)
```

#### 2.4 重写 dev 加载器

**文件**：`core/load/dev.ts`

同上模式，额外关注 HMR 相关逻辑

#### 2.5 重写 apps 加载器

**文件**：`core/load/apps.ts`

同上模式

### Phase 3: 包查找重写（优先级：中）

#### 3.1 简化 packageFinder

**文件**：`package/find.ts`

**变更**：

```typescript
// 旧
async getPluginsPackages() {
  return { git, dev }  // 包含 git
}

// 新
async getDevPackages() {
  return dev  // 只有 dev
}

// 移除方法
getGitPackages()  // 删除
```

#### 3.2 更新类型定义

**文件**：`package/types.ts`

```typescript
// 旧
export type PluginsTypes = 'npm' | 'git' | 'dev' | 'apps'

// 新
export type PluginsTypes = 'npm' | 'dev' | 'apps'
```

### Phase 4: 清理旧模块（优先级：中）

#### 4.1 删除 cache 目录

删除整个 `src/cache/` 目录及所有文件：

- `cache/index.ts`
- `cache/list.ts`
- `cache/package.ts`
- `cache/instances.ts`
- `cache/instances.lazy.ts`
- `cache/instances.lazy.command.ts`
- `cache/register.ts`
- `cache/unregister.ts`
- `cache/envs.ts`
- `cache/settings.ts`
- `cache/hot.ts`
- `cache/missingDeps.ts`
- `cache/public.ts`
- `cache/stats.ts`
- `cache/default.ts`
- `cache/README.md`

#### 4.2 更新主入口

**文件**：`src/index.ts`

```typescript
// 移除
export { pluginCache } from './cache'  // 删除

// 保留并完善
export { store, packageList, envManager, hotCache, missingDeps } from './store'
export { pkgRegistry } from './pkg'
```

### Phase 5: 更新相关模块（优先级：低）

#### 5.1 更新 printRegistryStatus

**文件**：`core/utils/status.ts` 或 `core/index.ts`

```typescript
// 使用新 API
import { store } from '../store'

export function printRegistryStatus() {
  const stats = store.stats()
  console.log(`Commands: ${stats.command.total}`)
  console.log(`Handlers: ${stats.handler.total}`)
  // ...
}
```

---

## 🔄 数据流设计

### 插件加载流程

```
1. 启动
   │
   ├─ pluginLoader.run()
   │   │
   │   ├─ PluginsLoaderNpm.init()
   │   │   ├─ packageFinder.getNpmPackages()
   │   │   ├─ packageList.set('npm', list)     ← 新：store/list
   │   │   └─ for each package:
   │   │       ├─ load config
   │   │       ├─ pkgRegistry.registerPackage()  ← 新：pkg/
   │   │       ├─ import entry files
   │   │       └─ command() → store.add()     ← 新：store/
   │   │
   │   ├─ PluginsLoaderDev.init()
   │   │   └─ (同上，type='dev')
   │   │
   │   └─ PluginsLoaderApps.init()
   │       └─ (同上，type='apps')
   │
   └─ 完成
       ├─ store.markDirty() 触发排序
       ├─ printRegistryStatus()
       └─ engines.print()
```

### HMR 热更新流程

```
1. 文件变更 (dev 类型)
   │
   ├─ hmr.onFileChange(file)
   │   │
   │   ├─ 找包: pkgRegistry.getByFile(file)
   │   │
   │   ├─ 执行卸载钩子: runUnloadHooks(file)
   │   │
   │   ├─ 清除 Node 缓存:
   │   │   ├─ delete require.cache[file]  (CJS)
   │   │   └─ 使用 ?t=timestamp           (ESM)
   │   │
   │   ├─ 删除旧插件: store.delByFile(file)
   │   │   └─ emit('del', type, id, plugin)
   │   │
   │   ├─ 重新导入: import(file + '?t=...')
   │   │   └─ command() 等 DSL 执行
   │   │       └─ store.add(type, plugin)
   │   │           └─ emit('add', type, plugin)
   │   │
   │   └─ 执行加载钩子: runLoadHooks(file)
   │
   └─ 完成
```

### 响应式更新流程

```
1. 用户修改 ref 属性
   │
   ├─ ping.disabled = true
   │   │
   │   ├─ Proxy.set 拦截
   │   │   │
   │   │   ├─ store.update(id, 'disabled', true)
   │   │   │   └─ emit('update', type, id, 'disabled', true, false)
   │   │   │
   │   │   ├─ store.markDirty(type)
   │   │   │   └─ 清除排序缓存
   │   │   │
   │   │   └─ 通知本地监听器
   │   │       └─ listeners.forEach(fn => fn('disabled', true, false))
   │   │
   │   └─ 完成
   │
   └─ 下次 store.get(type) 时重新排序
```

---

## 📦 API 设计

### 最终导出

```typescript
// src/index.ts

// ==================== 创建插件 API ====================

/** 极简命令创建 */
export { command } from './create'
/** 链式命令创建 */
export { cmd } from './create'
/** 通知/请求处理 */
export { accept } from './create'
/** 按钮处理 */
export { button } from './create'
/** 自定义处理器 */
export { handler } from './create'
/** 定时任务 */
export { task } from './create'
/** 上下文 */
export { ctx } from './create'

// ==================== 响应式 API ====================

/** 响应式命令 */
export { ref, isRef, unref } from './reactive'

// ==================== 存储 API ====================

/** 统一存储 */
export { store } from './store'
/** 包列表 */
export { packageList } from './store'
/** 环境变量 */
export { envManager } from './store'
/** 热点缓存 */
export { hotCache } from './store'
/** 缺失依赖 */
export { missingDeps } from './store'
/** 引擎设置 */
export { engineSettings } from './store'
/** 静态目录 */
export { publicManager } from './store'

/** 包注册表 */
export { pkgRegistry } from './pkg'

// ==================== HMR API ====================

/** HMR 核心 */
export { hmr, clearModuleCaches, findDependentModules } from './hot'

// ==================== 生命周期 API ====================

export { onLoad, onUnload, onReload } from './lifecycle'

// ==================== 开发工具 API ====================

export { dev, snapshot, printReport, listPlugins } from './dev'

// ==================== 配置 API ====================

export { defineKarinConfig, defineWebConfig } from './config'

// ==================== 加载器 ====================

export { pluginLoader } from './'  // 原有位置
export { packageFinder } from './package'
```

### 废弃 API（不再导出）

```typescript
// ❌ 完全移除，不提供任何访问方式
pluginCache           // → 使用 store
CreateClassPlugin     // → 已删除
PluginsLoaderGit      // → 已删除
```

---

## ✅ 迁移清单

### Phase 1: store 模块完善

- [x] `store/index.ts` - 统一存储层（已完成）
- [x] `store/hotCache.ts` - 热点缓存（已完成）
- [x] `store/missingDeps.ts` - 缺失依赖（已完成）
- [x] `store/types.ts` - 类型定义（已完成）
- [x] `store/list.ts` - 包列表管理（已完成）
- [x] `store/envs.ts` - 环境变量管理（已完成，v1 兼容已移除）
- [x] `store/settings.ts` - 引擎设置（已完成）
- [x] `store/public.ts` - 静态目录管理（已完成）
- [x] 更新 `store/index.ts` 导出新模块（已完成）

### Phase 2: 加载器重写

- [x] 删除 `core/load/git.ts`（已完成，v11 移除 git 类型）
- [x] 更新 `core/load/index.ts` 移除 git 导出（已完成）
- [x] 重写 `core/load/core.ts` 基类
  - [x] 移除 `pluginCache` 导入
  - [x] 使用 `pkgRegistry` 替代 `pluginCache.package`
  - [x] 使用 `packageList` 替代 `pluginCache.list`
  - [x] 使用 `envManager` 替代 `pluginCache.envs`
  - [x] 移除 `setupV1` 方法
- [x] 重写 `core/load/npm.ts`
- [x] 重写 `core/load/dev.ts`
- [x] 重写 `core/load/apps.ts`

### Phase 3: 包查找重写

- [x] 更新 `package/find.ts` 移除 git 逻辑（已完成）
- [x] 更新 `package/types.ts` 移除 git 类型（已完成）

### Phase 4: 清理 v1 遗留

- [x] 删除 `cache/` 整个目录（已完成）
- [x] 删除 `tests/class-plugin.test.ts`（已完成）
- [x] 重构 `core/utils/status.ts` 使用新 store API（已完成）
- [x] 重构 `core/utils/env.ts` 移除 v1 兼容（已完成）
- [x] 重构 `core/utils/engines.ts` 使用新 store API（已完成）
- [x] 更新 `src/index.ts` 导出（已完成）
- [x] 更新 `pluginLoader.run()` 移除 git 加载（已完成）

### Phase 5: 文档与测试 ✅

- [x] 更新 `ARCHITECTURE.md`（已完成，更新 Store 系统文档）
- [x] 更新测试用例（已完成，新增 store-list, store-envs, store-settings, store-public 测试）
- [x] 更新外部依赖（adapter 包）
  - [x] 移除 `CreateClassPlugin` 类型引用（已完成）
  - [x] 重构 dispatch 模块使用新 store API（已完成）

### Phase 6: HMR 独立包（@karinjs/hmr）✅

- [x] 创建 `packages/hmr/` 目录结构
- [x] 实现 `packages/hmr/src/index.ts` - 主入口
- [x] 实现 `packages/hmr/src/watcher.ts` - 文件监听
- [x] 实现 `packages/hmr/src/cache.ts` - Node 缓存清理
- [x] 实现 `packages/hmr/src/reload.ts` - 重载逻辑
- [x] 编写 `packages/hmr/README.md` - 使用文档
- [x] 配置 `packages/hmr/package.json` - 依赖 @karinjs/plugin
- [x] 测试：dev 类型 HMR 流程（已完成，13 个测试通过）

### Phase 7: apps 内置热更新 ✅

- [x] 实现 `src/hot/apps.ts` - apps 类型热更新（URL 参数方式）
- [x] 导出 `createAppsHMR` 和 `reloadAppsFile` API
- [x] 集成到 pluginLoader（`startAppsHMR`/`stopAppsHMR`/`getAppsHMR`）
- [x] 测试：apps 类型热更新（`tests/hot-apps.test.ts`）

---

## 🧪 测试计划

### 单元测试

| 模块 | 测试文件 | 覆盖内容 |
|------|----------|----------|
| `store/list.ts` | `store-list.test.ts` | set/get/clear/findByName |
| `store/envs.ts` | `store-envs.test.ts` | create/get/clear |
| `store/settings.ts` | `store-settings.test.ts` | add/check/print |
| `store/public.ts` | `store-public.test.ts` | set/get/clear |

### 集成测试

| 场景 | 测试内容 |
|------|----------|
| 加载流程 | npm/dev/apps 三种类型正常加载 |
| HMR 流程 | dev 类型文件修改触发热更新 |
| 响应式 | ref() 属性修改自动更新 store |
| 事件驱动 | store 事件正确发射和接收 |

### 回归测试

确保现有功能不受影响：

- 所有 DSL API（command, accept, button, handler, task）
- 生命周期钩子（onLoad, onUnload）
- 配置文件（defineKarinConfig）

---

## 📅 时间线（建议）

| 阶段 | 内容 | 预估 |
|------|------|------|
| Phase 1 | store 模块完善 | 2-3 天 |
| Phase 2 | 加载器重写 | 3-4 天 |
| Phase 3 | 包查找重写 | 1 天 |
| Phase 4 | 清理 | 1 天 |
| Phase 5 | 文档与测试 | 2 天 |
| Phase 6 | @karinjs/hmr 独立包 | 2-3 天 |
| Phase 7 | apps 内置热更新 | 1 天 |

**总计**：约 12-15 天

---

## 🔗 参考文档

- [v8 响应式架构](docs/v8-reactive-architecture.md)
- [v9 纯函数式架构](docs/v9-functional-architecture.md)
- [v10 完整示例](docs/v10-complete-examples.md)
- [v11 Store 实现](docs/v11-store-implementation.md)
- [HMR 配置设计](docs/HMR-CONFIG-DESIGN.md)

---

## 🔍 v8-v11 设计取舍分析

### 采纳的设计

| 来源 | 设计 | 理由 |
|------|------|------|
| v8 | 统一 Store + 事件驱动 | 解决缓存与 HMR 无法交互的问题 |
| v8 | Store 索引（file/pkg/id） | 支持快速查找和批量删除 |
| v9 | 纯函数架构 | 提高可维护性，无 class 复杂性 |
| v9 | 无 .value 的响应式 | 更直观的 API 体验 |
| v9 | 生命周期钩子 | onLoad/onUnload 资源管理 |
| v10 | 三种创建方式 | 满足不同复杂度需求 |
| v10 | 链式 API 独立 | 保持 command() 极简 |
| v11 | 完整 Store 实现 | 详细的内部实现参考 |

### 未采纳的设计

| 来源 | 设计 | 理由 |
|------|------|------|
| v8 | ref().value | 太繁琐，采用 v9 直接访问 |
| v8 | 中间件系统 | 当前阶段复杂度过高，后续考虑 |
| v8 | watch()/effect() | 暂不需要，可后续添加 |
| v9 | dev.state() 持久化 | 实现复杂，当前 HMR 够用 |
| v10 | ref.task/ref.accept | 当前只支持 command 响应式 |

### 后续可扩展

| 特性 | 说明 | 优先级 |
|------|------|--------|
| 中间件系统 | 全局/插件级中间件 | 低 |
| watch()/effect() | 精确监听特定属性 | 低 |
| 装饰器 | cooldown/rateLimit 等 | 中 |
| dev.state() | HMR 状态持久化 | 中 |
| 全类型响应式 | ref.task/ref.accept 等 | 低 |
