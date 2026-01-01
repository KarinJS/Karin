# Karin Plugin v11 - 完整架构

> 更好的命名 + 缓存系统内部实现

---

## 一、命名方案

### 方案对比

| 名称 | 示例 | 风格 |
|------|------|------|
| `chain()` | `chain(/^ping$/, 'pong').perm()` | ❌ 怪异 |
| `define()` | `define(/^ping$/, 'pong').perm()` | ✅ Vue 风格 |
| `build()` | `build(/^ping$/, 'pong').perm()` | ✅ 构建器风格 |
| `cmd()` | `cmd(/^ping$/, 'pong').perm()` | ✅ 简短 |
| `$()` | `$(/^ping$/, 'pong').perm()` | ❓ jQuery 风格 |

### 推荐：`cmd()` / `define()`

```ts
// 方案 A：cmd() - 简短直观
import { command, ref, cmd } from '@karinjs/plugin'

command(/^ping$/, 'pong')           // 极简
ref(/^ping$/, 'pong')               // 响应式
cmd(/^ping$/, 'pong').perm('master') // 链式

// 方案 B：define() - Vue 风格
import { command, ref, define } from '@karinjs/plugin'

command(/^ping$/, 'pong')              // 极简
ref(/^ping$/, 'pong')                  // 响应式
define(/^ping$/, 'pong').perm('master') // 链式
```

### 最终 API

```ts
// 极简
command(reg, callback, options?)

// 响应式
ref(reg, callback, options?)

// 链式（选其一）
cmd(reg, callback)       // 简短
define(reg, callback)    // Vue 风格

// 其他类型同理
task(name, cron, callback)
ref.task(name, cron, callback)
cmd.task(name, cron, callback)  // 或 define.task()
```

---

## 二、三种方式对比

```ts
import { command, ref, cmd } from '@karinjs/plugin'

// 1. 极简 - 大多数场景
command(/^ping$/, 'pong')

// 2. 响应式 - 需要动态控制
const ping = ref(/^ping$/, 'pong')
ping.disabled = true

// 3. 链式 - 复杂配置
cmd(/^admin$/, doAdmin)
  .name('管理命令')
  .perm('master')
  .priority(1)
  .on('message.group')
  .ref()  // 可选：转为响应式
```

---

## 三、缓存系统内部实现

### 3.1 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Store (单例)                             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  plugins    │  │  fileIndex  │  │  pkgIndex   │              │
│  │  Map<id,P>  │  │  Map<file,  │  │  Map<pkg,   │              │
│  │             │  │    Set<id>> │  │    Set<id>> │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ sortedCache │  │   dirty     │                               │
│  │ Map<type,   │  │ Map<type,   │                               │
│  │   Plugin[]> │  │   boolean>  │                               │
│  └─────────────┘  └─────────────┘                               │
│                                                                 │
│  Events: add | del | update | sort                              │
└─────────────────────────────────────────────────────────────────┘
         ↑                              ↓
         │                              │
    command()                      HMR 系统
    ref()                          监听事件
    cmd()
```

### 3.2 核心实现

```ts
// src/store/index.ts

import { EventEmitter } from 'node:events'

/** 插件类型 */
type PluginType = 'message' | 'notice' | 'request' | 'button' | 'handler' | 'task'

/** 插件基础接口 */
interface Plugin {
  id: string
  type: PluginType
  name: string
  priority: number
  disabled: boolean
  file?: string
  pkg?: string
  [key: string]: unknown
}

/** Store 事件 */
interface StoreEvents {
  add: [type: PluginType, plugin: Plugin]
  del: [type: PluginType, id: string, plugin: Plugin]
  update: [type: PluginType, id: string, key: string, newVal: unknown, oldVal: unknown]
  sort: [type: PluginType]
}

/** 创建 Store */
function createStore() {
  // ==================== 内部状态 ====================

  /** 事件发射器 */
  const emitter = new EventEmitter()

  /** 插件主存储 Map<type, Map<id, Plugin>> */
  const plugins = new Map<PluginType, Map<string, Plugin>>()

  /** 文件索引 Map<file, Set<id>> */
  const fileIndex = new Map<string, Set<string>>()

  /** 包名索引 Map<pkg, Set<id>> */
  const pkgIndex = new Map<string, Set<string>>()

  /** 排序缓存 Map<type, Plugin[]> */
  const sortedCache = new Map<PluginType, Plugin[]>()

  /** 脏标记 Map<type, boolean> */
  const dirty = new Map<PluginType, boolean>()

  // 初始化类型
  const types: PluginType[] = ['message', 'notice', 'request', 'button', 'handler', 'task']
  for (const t of types) {
    plugins.set(t, new Map())
    dirty.set(t, false)
  }

  // ==================== 索引管理 ====================

  /** 添加到文件索引 */
  function addFileIndex(plugin: Plugin): void {
    if (!plugin.file) return
    let set = fileIndex.get(plugin.file)
    if (!set) {
      set = new Set()
      fileIndex.set(plugin.file, set)
    }
    set.add(plugin.id)
  }

  /** 添加到包索引 */
  function addPkgIndex(plugin: Plugin): void {
    if (!plugin.pkg) return
    let set = pkgIndex.get(plugin.pkg)
    if (!set) {
      set = new Set()
      pkgIndex.set(plugin.pkg, set)
    }
    set.add(plugin.id)
  }

  /** 从索引中移除 */
  function removeFromIndexes(plugin: Plugin): void {
    if (plugin.file) {
      const set = fileIndex.get(plugin.file)
      if (set) {
        set.delete(plugin.id)
        if (set.size === 0) fileIndex.delete(plugin.file)
      }
    }
    if (plugin.pkg) {
      const set = pkgIndex.get(plugin.pkg)
      if (set) {
        set.delete(plugin.id)
        if (set.size === 0) pkgIndex.delete(plugin.pkg)
      }
    }
  }

  // ==================== 核心 API ====================

  return {
    // ===== 添加 =====

    /**
     * 添加插件
     * @param type 插件类型
     * @param plugin 插件对象
     */
    add(type: PluginType, plugin: Plugin): void {
      const store = plugins.get(type)!

      // 检查重复
      if (store.has(plugin.id)) {
        console.warn(`[Store] 插件 ${plugin.id} 已存在，将被覆盖`)
        this.del(plugin.id)
      }

      // 存储
      store.set(plugin.id, plugin)

      // 更新索引
      addFileIndex(plugin)
      addPkgIndex(plugin)

      // 标记需要重新排序
      dirty.set(type, true)
      sortedCache.delete(type)

      // 发射事件
      emitter.emit('add', type, plugin)
    },

    // ===== 删除 =====

    /**
     * 删除插件
     * @param id 插件 ID
     * @returns 是否成功删除
     */
    del(id: string): boolean {
      for (const [type, store] of plugins) {
        const plugin = store.get(id)
        if (plugin) {
          store.delete(id)
          removeFromIndexes(plugin)
          dirty.set(type, true)
          sortedCache.delete(type)
          emitter.emit('del', type, id, plugin)
          return true
        }
      }
      return false
    },

    /**
     * 按文件删除所有插件
     * @param file 文件路径
     * @returns 删除的数量
     */
    delByFile(file: string): number {
      const ids = fileIndex.get(file)
      if (!ids) return 0

      // 复制 Set，因为删除会修改原 Set
      const idList = Array.from(ids)
      let count = 0

      for (const id of idList) {
        if (this.del(id)) count++
      }

      return count
    },

    /**
     * 按包名删除所有插件
     * @param pkg 包名
     * @returns 删除的数量
     */
    delByPkg(pkg: string): number {
      const ids = pkgIndex.get(pkg)
      if (!ids) return 0

      const idList = Array.from(ids)
      let count = 0

      for (const id of idList) {
        if (this.del(id)) count++
      }

      return count
    },

    // ===== 查询 =====

    /**
     * 获取某类型的所有插件（已排序、已过滤禁用）
     * @param type 插件类型
     * @returns 排序后的插件数组
     */
    get(type: PluginType): Plugin[] {
      // 检查缓存
      if (!dirty.get(type) && sortedCache.has(type)) {
        return sortedCache.get(type)!
      }

      // 排序
      const store = plugins.get(type)!
      const list = Array.from(store.values())
        .filter(p => !p.disabled)
        .sort((a, b) => a.priority - b.priority)

      // 缓存
      sortedCache.set(type, list)
      dirty.set(type, false)

      // 发射排序事件
      emitter.emit('sort', type)

      return list
    },

    /**
     * 获取所有插件（包括禁用的，未排序）
     * @param type 插件类型
     * @returns 插件数组
     */
    getAll(type: PluginType): Plugin[] {
      const store = plugins.get(type)!
      return Array.from(store.values())
    },

    /**
     * 按 ID 获取插件
     * @param id 插件 ID
     * @returns 插件或 undefined
     */
    getById(id: string): Plugin | undefined {
      for (const store of plugins.values()) {
        const plugin = store.get(id)
        if (plugin) return plugin
      }
      return undefined
    },

    /**
     * 按文件获取插件
     * @param file 文件路径
     * @returns 插件数组
     */
    getByFile(file: string): Plugin[] {
      const ids = fileIndex.get(file)
      if (!ids) return []

      const result: Plugin[] = []
      for (const id of ids) {
        const plugin = this.getById(id)
        if (plugin) result.push(plugin)
      }
      return result
    },

    /**
     * 按包名获取插件
     * @param pkg 包名
     * @returns 插件数组
     */
    getByPkg(pkg: string): Plugin[] {
      const ids = pkgIndex.get(pkg)
      if (!ids) return []

      const result: Plugin[] = []
      for (const id of ids) {
        const plugin = this.getById(id)
        if (plugin) result.push(plugin)
      }
      return result
    },

    /**
     * 检查插件是否存在
     * @param id 插件 ID
     * @returns 是否存在
     */
    has(id: string): boolean {
      for (const store of plugins.values()) {
        if (store.has(id)) return true
      }
      return false
    },

    // ===== 更新 =====

    /**
     * 更新插件属性
     * @param id 插件 ID
     * @param key 属性名
     * @param value 新值
     * @returns 是否成功
     */
    update(id: string, key: string, value: unknown): boolean {
      const plugin = this.getById(id)
      if (!plugin) return false

      const oldVal = (plugin as Record<string, unknown>)[key]
      if (oldVal === value) return true  // 值未变化

      ;(plugin as Record<string, unknown>)[key] = value

      // 优先级变化需要重新排序
      if (key === 'priority') {
        dirty.set(plugin.type, true)
        sortedCache.delete(plugin.type)
      }

      // disabled 变化需要重新排序
      if (key === 'disabled') {
        dirty.set(plugin.type, true)
        sortedCache.delete(plugin.type)
      }

      // 发射更新事件
      emitter.emit('update', plugin.type, id, key, value, oldVal)

      return true
    },

    /**
     * 禁用插件
     * @param id 插件 ID
     */
    disable(id: string): boolean {
      return this.update(id, 'disabled', true)
    },

    /**
     * 启用插件
     * @param id 插件 ID
     */
    enable(id: string): boolean {
      return this.update(id, 'disabled', false)
    },

    // ===== 批量操作 =====

    /**
     * 清空所有插件
     */
    clear(): void {
      for (const [type, store] of plugins) {
        store.clear()
        dirty.set(type, false)
      }
      fileIndex.clear()
      pkgIndex.clear()
      sortedCache.clear()
    },

    /**
     * 标记需要重新排序
     * @param type 插件类型
     */
    markDirty(type: PluginType): void {
      dirty.set(type, true)
      sortedCache.delete(type)
    },

    // ===== 统计 =====

    /**
     * 获取统计信息
     */
    stats(): Record<PluginType, { total: number; active: number }> {
      const result = {} as Record<PluginType, { total: number; active: number }>

      for (const [type, store] of plugins) {
        const all = Array.from(store.values())
        result[type] = {
          total: all.length,
          active: all.filter(p => !p.disabled).length,
        }
      }

      return result
    },

    /**
     * 获取文件统计
     */
    fileStats(): { files: number; plugins: number } {
      let pluginCount = 0
      for (const set of fileIndex.values()) {
        pluginCount += set.size
      }
      return {
        files: fileIndex.size,
        plugins: pluginCount,
      }
    },

    // ===== 事件 =====

    /**
     * 监听事件
     */
    on<K extends keyof StoreEvents>(event: K, listener: (...args: StoreEvents[K]) => void): void {
      emitter.on(event, listener as (...args: unknown[]) => void)
    },

    /**
     * 取消监听
     */
    off<K extends keyof StoreEvents>(event: K, listener: (...args: StoreEvents[K]) => void): void {
      emitter.off(event, listener as (...args: unknown[]) => void)
    },

    /**
     * 监听一次
     */
    once<K extends keyof StoreEvents>(event: K, listener: (...args: StoreEvents[K]) => void): void {
      emitter.once(event, listener as (...args: unknown[]) => void)
    },

    // ===== 调试 =====

    /**
     * 导出所有数据（调试用）
     */
    dump(): {
      plugins: Record<PluginType, Plugin[]>
      fileIndex: Record<string, string[]>
      pkgIndex: Record<string, string[]>
    } {
      const result = {
        plugins: {} as Record<PluginType, Plugin[]>,
        fileIndex: {} as Record<string, string[]>,
        pkgIndex: {} as Record<string, string[]>,
      }

      for (const [type, store] of plugins) {
        result.plugins[type] = Array.from(store.values())
      }

      for (const [file, ids] of fileIndex) {
        result.fileIndex[file] = Array.from(ids)
      }

      for (const [pkg, ids] of pkgIndex) {
        result.pkgIndex[pkg] = Array.from(ids)
      }

      return result
    },
  }
}

/** 导出单例 */
export const store = createStore()
```

### 3.3 与 HMR 集成

```ts
// src/hot/integration.ts

import { store } from '../store'
import { runUnloadHooks } from '../lifecycle'

/**
 * 初始化 HMR 集成
 * Store 事件 → HMR 系统自动同步
 */
export function initHMRIntegration() {
  // 监听插件添加
  store.on('add', (type, plugin) => {
    // HMR 系统自动追踪
    if (plugin.file) {
      console.debug(`[HMR] 追踪插件: ${plugin.id} (${plugin.file})`)
    }
  })

  // 监听插件删除
  store.on('del', (type, id, plugin) => {
    console.debug(`[HMR] 移除插件: ${id}`)
  })
}

/**
 * 文件变更处理
 * @param file 变更的文件路径
 */
export async function onFileChange(file: string): Promise<{ unloaded: number; loaded: number }> {
  const normalizedPath = file.replace(/\\/g, '/')

  // 1. 执行卸载钩子
  await runUnloadHooks(normalizedPath)

  // 2. 删除该文件的所有插件
  const unloaded = store.delByFile(normalizedPath)
  console.debug(`[HMR] 卸载 ${unloaded} 个插件: ${normalizedPath}`)

  // 3. 清除模块缓存（如果是 CommonJS）
  try {
    const resolved = require.resolve(file)
    delete require.cache[resolved]
  } catch {}

  // 4. 重新导入（ESM 用 ?t= 参数）
  const before = store.stats()
  try {
    await import(`${file}?t=${Date.now()}`)
  } catch (err) {
    console.error(`[HMR] 重载失败: ${normalizedPath}`, err)
    return { unloaded, loaded: 0 }
  }

  // 5. 统计新加载的插件
  const after = store.stats()
  let loaded = 0
  for (const type of Object.keys(after) as (keyof typeof after)[]) {
    loaded += after[type].total - (before[type]?.total ?? 0)
  }

  console.debug(`[HMR] 加载 ${loaded} 个插件: ${normalizedPath}`)

  return { unloaded, loaded }
}

/**
 * 包变更处理
 * @param pkg 包名
 */
export async function onPackageChange(pkg: string): Promise<void> {
  // 删除该包的所有插件
  const count = store.delByPkg(pkg)
  console.debug(`[HMR] 卸载包 ${pkg} 的 ${count} 个插件`)

  // 重新加载包（由外部 loader 处理）
}
```

### 3.4 响应式 ref 与 Store 集成

```ts
// src/reactive/ref.ts

import { store } from '../store'

/** 响应式插件接口 */
export interface RefPlugin<T extends object = object> {
  // 原始属性代理
  [K in keyof T]: T[K]
} & {
  /** 销毁插件 */
  dispose(): void
  /** 监听属性变化 */
  on(event: 'change', listener: (key: string, newVal: unknown, oldVal: unknown) => void): () => void
  /** 热更新标记 */
  readonly __hot: true
  /** 唯一标识 */
  readonly __refid: string
}

/**
 * 创建响应式命令插件
 */
export function ref(
  reg: RegExp | string,
  callback: CommandCallback | string,
  options: CommandOptions = {}
): RefPlugin<CommandPlugin> {
  // 1. 创建插件对象
  const plugin = createCommandPlugin(reg, callback, options)

  // 2. 注册到 Store
  store.add('message', plugin)

  // 3. 创建响应式代理
  return createReactiveProxy(plugin)
}

/**
 * 创建响应式代理
 */
function createReactiveProxy<T extends Plugin>(plugin: T): RefPlugin<T> {
  const refid = crypto.randomUUID()
  const listeners = new Set<(key: string, newVal: unknown, oldVal: unknown) => void>()

  const proxy = new Proxy(plugin, {
    get(target, key) {
      // 特殊属性
      if (key === '__hot') return true
      if (key === '__refid') return refid
      if (key === 'dispose') return () => {
        store.del(plugin.id)
        listeners.clear()
      }
      if (key === 'on') return (event: string, listener: (...args: unknown[]) => void) => {
        if (event === 'change') {
          listeners.add(listener)
          return () => listeners.delete(listener)
        }
        return () => {}
      }

      return (target as Record<string, unknown>)[key as string]
    },

    set(target, key, value) {
      const oldVal = (target as Record<string, unknown>)[key as string]
      if (oldVal === value) return true

      // 更新 Store（会自动处理排序等）
      store.update(plugin.id, key as string, value)

      // 同步本地对象
      ;(target as Record<string, unknown>)[key as string] = value

      // 通知监听器
      for (const fn of listeners) {
        fn(key as string, value, oldVal)
      }

      return true
    },
  }) as RefPlugin<T>

  return proxy
}

// ===== 其他类型的 ref =====

ref.task = function(name: string, cron: string, callback: TaskCallback, options?: TaskOptions): RefPlugin<TaskPlugin> {
  const plugin = createTaskPlugin(name, cron, callback, options)
  store.add('task', plugin)
  return createReactiveProxy(plugin)
}

ref.accept = function(event: string, callback: AcceptCallback, options?: AcceptOptions): RefPlugin<AcceptPlugin> {
  const plugin = createAcceptPlugin(event, callback, options)
  store.add(plugin.type, plugin)
  return createReactiveProxy(plugin)
}

ref.handler = function(key: string, callback: HandlerCallback, options?: HandlerOptions): RefPlugin<HandlerPlugin> {
  const plugin = createHandlerPlugin(key, callback, options)
  store.add('handler', plugin)
  return createReactiveProxy(plugin)
}
```

### 3.5 command 与 Store 集成

```ts
// src/core/command.ts

import { store } from '../store'
import { getCallerInfo, createId, formatReg } from '../utils'

/**
 * 创建命令插件（极简方式）
 */
export function command(
  reg: RegExp | string,
  callback: CommandCallback | string,
  options: CommandOptions = {}
): CommandPlugin {
  // 获取调用者信息
  const caller = getCallerInfo()

  // 构建插件对象
  const plugin: CommandPlugin = {
    id: createId('command', caller.file),
    type: 'message',
    name: options.name ?? caller.defaultName,
    reg: formatReg(reg),
    callback: normalizeCallback(callback, options),
    priority: options.priority ?? 10000,
    perm: options.perm ?? 'all',
    log: options.log ?? true,
    event: normalizeEvent(options.event),
    adapter: options.adapter ?? [],
    dsbAdapter: options.dsbAdapter ?? [],
    disabled: false,
    file: caller.file,
    pkg: caller.pkg,
  }

  // 注册到 Store
  store.add('message', plugin)

  return plugin
}
```

---

## 四、数据流图

```
用户代码                    Store                      HMR
    │                         │                         │
    │  command(/^ping$/...)   │                         │
    ├────────────────────────►│                         │
    │                         │  store.add()            │
    │                         ├────────────────────────►│
    │                         │  emit('add', plugin)    │
    │                         │                         │
    │                         │                         │
    │  ref.disabled = true    │                         │
    ├────────────────────────►│                         │
    │                         │  store.update()         │
    │                         ├────────────────────────►│
    │                         │  emit('update', ...)    │
    │                         │  markDirty(type)        │
    │                         │                         │
    │                         │                         │
    │                         │  文件变更               │
    │                         │◄────────────────────────│
    │                         │  store.delByFile()      │
    │                         │  emit('del', ...)       │
    │                         │                         │
    │                         │  重新导入               │
    │                         │  command(...) 执行      │
    │                         ├────────────────────────►│
    │                         │  store.add()            │
    │                         │  emit('add', ...)       │
```

---

## 五、使用示例

### 5.1 Store 直接操作

```ts
import { store } from '@karinjs/plugin'

// 获取所有命令插件（已排序）
const commands = store.get('message')

// 按 ID 查找
const plugin = store.getById('some-id')

// 按文件查找
const filePlugins = store.getByFile('/path/to/file.ts')

// 禁用插件
store.disable('some-id')

// 启用插件
store.enable('some-id')

// 删除插件
store.del('some-id')

// 监听事件
store.on('add', (type, plugin) => {
  console.log(`新插件: ${plugin.name}`)
})

store.on('del', (type, id) => {
  console.log(`删除插件: ${id}`)
})

// 统计信息
console.log(store.stats())
// { message: { total: 50, active: 48 }, task: { total: 5, active: 5 }, ... }
```

### 5.2 响应式操作

```ts
import { ref } from '@karinjs/plugin'

// 创建响应式插件
const ping = ref(/^ping$/, 'pong')

// 直接修改属性 → 自动同步到 Store
ping.priority = 1
ping.disabled = true

// 监听变化
const unsubscribe = ping.on('change', (key, newVal, oldVal) => {
  console.log(`${key}: ${oldVal} → ${newVal}`)
})

// 取消监听
unsubscribe()

// 销毁（从 Store 中删除）
ping.dispose()
```

### 5.3 HMR 手动控制

```ts
import { store, onFileChange } from '@karinjs/plugin'

// 手动触发文件重载
await onFileChange('/path/to/plugin.ts')

// 查看文件统计
console.log(store.fileStats())
// { files: 10, plugins: 45 }

// 导出调试数据
console.log(store.dump())
```

---

## 六、完整 API

```ts
// ===== 创建插件 =====

// 极简
command(reg, callback, options?)
task(name, cron, callback, options?)
accept(event, callback, options?)
handler(key, callback, options?)

// 响应式
ref(reg, callback, options?)
ref.task(name, cron, callback, options?)
ref.accept(event, callback, options?)
ref.handler(key, callback, options?)

// 链式
cmd(reg, callback)
cmd.task(name, cron, callback)
cmd.accept(event, callback)
cmd.handler(key, callback)

// ===== Store =====

store.add(type, plugin)
store.del(id)
store.delByFile(file)
store.delByPkg(pkg)
store.get(type)
store.getAll(type)
store.getById(id)
store.getByFile(file)
store.getByPkg(pkg)
store.has(id)
store.update(id, key, value)
store.disable(id)
store.enable(id)
store.clear()
store.markDirty(type)
store.stats()
store.fileStats()
store.on(event, listener)
store.off(event, listener)
store.dump()

// ===== 生命周期 =====

onLoad(callback)
onUnload(callback)

// ===== 开发环境 =====

dev.isDev
dev.log(...args)
dev.reload()
dev.state(initial)
```

---

## 七、文件结构

```
src/
├── index.ts              # 统一导出
├── store/
│   └── index.ts          # createStore() 实现
├── core/
│   ├── command.ts        # command() 实现
│   ├── task.ts           # task() 实现
│   ├── accept.ts         # accept() 实现
│   ├── handler.ts        # handler() 实现
│   └── cmd.ts            # cmd() 链式实现
├── reactive/
│   └── ref.ts            # ref() 实现
├── hot/
│   ├── integration.ts    # HMR 与 Store 集成
│   ├── watcher.ts        # 文件监听
│   └── reload.ts         # 重载逻辑
├── lifecycle/
│   └── index.ts          # onLoad/onUnload
├── dev/
│   └── index.ts          # dev 工具
├── utils/
│   ├── id.ts             # ID 生成
│   ├── caller.ts         # 调用者信息
│   └── format.ts         # 格式化工具
└── types/
    └── index.ts          # 类型定义
```
