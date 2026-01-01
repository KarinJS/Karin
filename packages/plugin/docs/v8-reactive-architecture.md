# Karin Plugin v8 - 响应式架构

> 解决 5 个核心问题的完整方案

---

## 问题分析

| 问题 | 现状 | 根因 |
|------|------|------|
| 1. 缓存与 HMR 无法交互 | `pluginCache` 和 `hotRegistry` 是两个独立系统 | 没有统一的响应式数据源 |
| 2. 响应式应该用 ref 包裹 | 返回值控制，需要手动保存引用 | 没有响应式原语 |
| 3. 可扩展性低 | 固定的类结构，无法自定义行为 | 缺少中间件/插件机制 |
| 4. 缺少链式调用 | `setReg`, `setOptions` 返回 void | 方法没有返回 this |
| 5. 内部实现混乱 | 职责不清，耦合严重 | 缺少分层架构 |

---

## 核心设计：响应式 + 链式 + 可扩展

### 架构总览

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户 API 层                               │
│   ref(command(...))   command(...).chain().perm('admin')        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     响应式核心 (Reactive Core)                   │
│   RefPlugin<T>  ←  统一的响应式容器，包装所有插件                 │
│   effect()      ←  副作用追踪，当插件变化时触发                   │
│   watch()       ←  监听插件变化                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     统一存储层 (Unified Store)                   │
│   store.add()   store.del()   store.get()   store.watch()       │
│   ↳ 自动通知 HMR 系统                                            │
│   ↳ 自动更新缓存                                                 │
│   ↳ 自动触发排序                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        HMR 层                                    │
│   订阅 store 变化  →  文件变更时精准卸载/重载                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 一、响应式原语 (Reactivity Primitives)

### 1.1 `ref()` - 响应式包装器

```ts
import { ref, command } from '@karinjs/plugin'

// 用 ref 包裹，获得响应式能力
const ping = ref(
  command(/^ping$/, 'pong')
)

// 响应式修改
ping.value.reg = /^ping|pong$/   // 自动触发更新
ping.value.callback = () => '!'  // 自动触发更新
ping.value.priority = 100        // 自动触发排序

// 禁用/启用
ping.value.disabled = true       // 自动从匹配队列移除
ping.value.disabled = false      // 自动恢复

// 卸载
ping.dispose()                   // 完全移除
```

### 1.2 `effect()` - 副作用追踪

```ts
import { ref, effect, command } from '@karinjs/plugin'

const ping = ref(command(/^ping$/, 'pong'))

// 当 ping 发生任何变化时执行
effect(() => {
  console.log('ping 插件已更新:', ping.value.reg)
})

// 修改触发 effect
ping.value.reg = /^pong$/  // 控制台输出: ping 插件已更新: /^pong$/
```

### 1.3 `watch()` - 精确监听

```ts
import { ref, watch, command } from '@karinjs/plugin'

const ping = ref(command(/^ping$/, 'pong'))

// 监听特定属性
watch(() => ping.value.priority, (newVal, oldVal) => {
  console.log(`优先级从 ${oldVal} 变为 ${newVal}`)
})
```

### 1.4 内部实现

```ts
// src/reactive/ref.ts

type RefId = string

/** 响应式插件包装器 */
export class RefPlugin<T extends Plugin = Plugin> {
  /** 唯一标识 */
  readonly __refid: RefId = crypto.randomUUID()
  /** 热更新标记 */
  readonly __hot: true = true
  /** 原始插件 */
  private _raw: T
  /** 代理对象 */
  private _proxy: T
  /** 订阅者 */
  private _subscribers = new Set<() => void>()
  /** 是否已销毁 */
  private _disposed = false

  constructor(plugin: T) {
    this._raw = plugin
    this._proxy = this.createProxy(plugin)

    // 注册到 store
    store.add(plugin.type, this._proxy)
    // 注册到 hot registry
    hotRegistry.track(this)
  }

  /** 获取代理后的值 */
  get value(): T {
    return this._proxy
  }

  /** 创建响应式代理 */
  private createProxy(target: T): T {
    return new Proxy(target, {
      set: (obj, key, value) => {
        const oldValue = (obj as Record<string, unknown>)[key as string]
        if (oldValue === value) return true

        ;(obj as Record<string, unknown>)[key as string] = value

        // 触发副作用
        this.notify()

        // 特殊处理：priority 变化需要重新排序
        if (key === 'priority') {
          store.markDirty(target.type)
        }

        // 特殊处理：disabled 变化
        if (key === 'disabled') {
          value ? store.deactivate(target.id) : store.activate(target.id)
        }

        return true
      },
      get: (obj, key) => {
        return (obj as Record<string, unknown>)[key as string]
      }
    })
  }

  /** 通知所有订阅者 */
  private notify(): void {
    for (const fn of this._subscribers) {
      fn()
    }
  }

  /** 订阅变化 */
  subscribe(fn: () => void): () => void {
    this._subscribers.add(fn)
    return () => this._subscribers.delete(fn)
  }

  /** 销毁 */
  dispose(): void {
    if (this._disposed) return
    this._disposed = true

    store.del(this._raw.id)
    hotRegistry.untrack(this.__refid)
    this._subscribers.clear()
  }
}

/** 创建响应式插件 */
export function ref<T extends Plugin>(plugin: T): RefPlugin<T> {
  return new RefPlugin(plugin)
}
```

---

## 二、链式 API (Chainable API)

### 2.1 使用示例

```ts
import { command } from '@karinjs/plugin'

// 链式调用
command(/^test$/, ctx => ctx.reply('ok'))
  .name('测试命令')
  .priority(100)
  .perm('admin')
  .adapter(['onebot'])
  .log(false)
  .on('message.group')  // 事件类型
  .when(ctx => ctx.groupId === '123456')  // 条件
  .before(async ctx => { /* 前置钩子 */ })
  .after(async ctx => { /* 后置钩子 */ })
  .catch(async (err, ctx) => { /* 错误处理 */ })
  .ref()  // 可选：获取响应式引用
```

### 2.2 内部实现

```ts
// src/core/command.ts

export class CommandBuilder extends BuilderBase {
  private _config: CommandConfig = {
    reg: /./,
    callback: () => {},
    name: '',
    priority: 10000,
    perm: 'all',
    log: true,
    event: ['message'],
    adapter: [],
    dsbAdapter: [],
    conditions: [],
    before: [],
    after: [],
    onError: null,
  }

  constructor(reg: string | RegExp, callback: CommandCallback) {
    super()
    this._config.reg = formatReg(reg)
    this._config.callback = callback
    this._config.name = this.defaultAppName
  }

  // ===== 链式方法 =====

  name(name: string): this {
    this._config.name = name
    return this
  }

  priority(n: number): this {
    this._config.priority = n
    return this
  }

  perm(p: 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin'): this {
    this._config.perm = p
    return this
  }

  adapter(...adapters: string[]): this {
    this._config.adapter = adapters
    return this
  }

  log(enabled: boolean): this {
    this._config.log = enabled
    return this
  }

  on<E extends EventTypes>(event: E): this {
    this._config.event = Array.isArray(event) ? event : [event]
    return this
  }

  when(condition: (ctx: CommandContext) => boolean): this {
    this._config.conditions.push(condition)
    return this
  }

  before(hook: BeforeHook): this {
    this._config.before.push(hook)
    return this
  }

  after(hook: AfterHook): this {
    this._config.after.push(hook)
    return this
  }

  catch(handler: ErrorHandler): this {
    this._config.onError = handler
    return this
  }

  // ===== 终结方法 =====

  /** 获取响应式引用 */
  ref(): RefPlugin<CommandPlugin> {
    return ref(this.build())
  }

  /** 构建并注册（默认行为） */
  private build(): CommandPlugin {
    const plugin: CommandPlugin = {
      id: this.id,
      type: 'message',
      file: this.callerPath,
      pkg: this.packageName,
      ...this._config,
      fnc: this.wrapCallback(),
    }
    store.add('message', plugin)
    hotRegistry.track({ __refid: this.id, ...plugin, __hot: true })
    return plugin
  }

  /** 包装回调函数 */
  private wrapCallback(): PluginCallback {
    const { callback, before, after, onError, conditions } = this._config

    return async (ctx, next) => {
      // 条件检查
      for (const cond of conditions) {
        if (!cond(ctx)) return next?.()
      }

      try {
        // 前置钩子
        for (const hook of before) {
          await hook(ctx)
        }

        // 主回调
        await callback(ctx, next)

        // 后置钩子
        for (const hook of after) {
          await hook(ctx)
        }
      } catch (err) {
        if (onError) {
          await onError(err as Error, ctx)
        } else {
          throw err
        }
      }
    }
  }
}

/** 工厂函数 */
export function command(
  reg: string | RegExp,
  callback: CommandCallback
): CommandBuilder {
  return new CommandBuilder(reg, callback)
}
```

---

## 三、统一存储层 (Unified Store)

### 3.1 核心设计

```ts
// src/store/index.ts

import { EventEmitter } from 'node:events'

type PluginType = 'message' | 'notice' | 'request' | 'button' | 'handler' | 'task'

/** 事件类型 */
interface StoreEvents {
  'add': (type: PluginType, plugin: Plugin) => void
  'del': (type: PluginType, id: string) => void
  'update': (type: PluginType, id: string, changes: Partial<Plugin>) => void
  'sort': (type: PluginType) => void
  'clear': (type: PluginType) => void
}

class UnifiedStore extends EventEmitter {
  /** 按类型分组存储 */
  private stores = new Map<PluginType, Map<string, Plugin>>()
  /** 按文件索引 */
  private fileIndex = new Map<string, Set<string>>()
  /** 按包名索引 */
  private pkgIndex = new Map<string, Set<string>>()
  /** 排序缓存 */
  private sortedCache = new Map<PluginType, Plugin[]>()
  /** 脏标记 */
  private dirty = new Map<PluginType, boolean>()

  constructor() {
    super()
    const types: PluginType[] = ['message', 'notice', 'request', 'button', 'handler', 'task']
    for (const t of types) {
      this.stores.set(t, new Map())
      this.dirty.set(t, false)
    }
  }

  // ===== 核心操作 =====

  add(type: PluginType, plugin: Plugin): void {
    const store = this.stores.get(type)!
    store.set(plugin.id, plugin)

    // 更新索引
    this.indexByFile(plugin)
    this.indexByPkg(plugin)

    // 标记需要重新排序
    this.dirty.set(type, true)

    // 发射事件 → HMR 系统可以监听
    this.emit('add', type, plugin)
  }

  del(id: string): boolean {
    for (const [type, store] of this.stores) {
      const plugin = store.get(id)
      if (plugin) {
        store.delete(id)
        this.removeFromIndexes(plugin)
        this.dirty.set(type, true)
        this.emit('del', type, id)
        return true
      }
    }
    return false
  }

  get(type: PluginType): Plugin[] {
    if (!this.dirty.get(type) && this.sortedCache.has(type)) {
      return this.sortedCache.get(type)!
    }

    const store = this.stores.get(type)!
    const plugins = Array.from(store.values())
      .filter(p => !p.disabled)
      .sort((a, b) => a.priority - b.priority)

    this.sortedCache.set(type, plugins)
    this.dirty.set(type, false)
    this.emit('sort', type)

    return plugins
  }

  // ===== 索引查询 =====

  getByFile(file: string): Plugin[] {
    const ids = this.fileIndex.get(file)
    if (!ids) return []
    return Array.from(ids).map(id => this.getById(id)).filter(Boolean) as Plugin[]
  }

  getByPkg(pkg: string): Plugin[] {
    const ids = this.pkgIndex.get(pkg)
    if (!ids) return []
    return Array.from(ids).map(id => this.getById(id)).filter(Boolean) as Plugin[]
  }

  getById(id: string): Plugin | undefined {
    for (const store of this.stores.values()) {
      const plugin = store.get(id)
      if (plugin) return plugin
    }
    return undefined
  }

  // ===== 批量操作 =====

  clearByFile(file: string): number {
    const plugins = this.getByFile(file)
    for (const p of plugins) {
      this.del(p.id)
    }
    return plugins.length
  }

  clearByPkg(pkg: string): number {
    const plugins = this.getByPkg(pkg)
    for (const p of plugins) {
      this.del(p.id)
    }
    return plugins.length
  }

  // ===== HMR 集成 =====

  /** 标记需要重新排序 */
  markDirty(type: PluginType): void {
    this.dirty.set(type, true)
    this.sortedCache.delete(type)
  }

  /** 临时停用（不删除） */
  deactivate(id: string): void {
    const plugin = this.getById(id)
    if (plugin) {
      plugin.disabled = true
      this.markDirty(plugin.type)
    }
  }

  /** 重新激活 */
  activate(id: string): void {
    const plugin = this.getById(id)
    if (plugin) {
      plugin.disabled = false
      this.markDirty(plugin.type)
    }
  }

  // ===== 私有方法 =====

  private indexByFile(plugin: Plugin): void {
    if (!plugin.file) return
    let set = this.fileIndex.get(plugin.file)
    if (!set) {
      set = new Set()
      this.fileIndex.set(plugin.file, set)
    }
    set.add(plugin.id)
  }

  private indexByPkg(plugin: Plugin): void {
    if (!plugin.pkg) return
    let set = this.pkgIndex.get(plugin.pkg)
    if (!set) {
      set = new Set()
      this.pkgIndex.set(plugin.pkg, set)
    }
    set.add(plugin.id)
  }

  private removeFromIndexes(plugin: Plugin): void {
    if (plugin.file) {
      const set = this.fileIndex.get(plugin.file)
      if (set) {
        set.delete(plugin.id)
        if (set.size === 0) this.fileIndex.delete(plugin.file)
      }
    }
    if (plugin.pkg) {
      const set = this.pkgIndex.get(plugin.pkg)
      if (set) {
        set.delete(plugin.id)
        if (set.size === 0) this.pkgIndex.delete(plugin.pkg)
      }
    }
  }
}

export const store = new UnifiedStore()
```

---

## 四、HMR 与 Store 集成

### 4.1 HMR 订阅 Store 事件

```ts
// src/hot/hmr.ts

import { store } from '../store'
import { hotRegistry } from './registry'

export function setupHMR() {
  // 监听插件添加
  store.on('add', (type, plugin) => {
    if (plugin.file) {
      hotRegistry.track({
        __refid: plugin.id,
        __hot: true,
        ...plugin
      })
    }
  })

  // 监听插件删除
  store.on('del', (type, id) => {
    hotRegistry.untrack(id)
  })
}

/** 文件变更时的处理 */
export async function onFileChange(file: string): Promise<void> {
  // 1. 清除该文件的所有插件
  const count = store.clearByFile(file)
  logger.debug(`[HMR] 卸载 ${count} 个插件: ${file}`)

  // 2. 重新导入文件
  await import(`${file}?t=${Date.now()}`)

  // 3. 新插件会自动通过 command() 等函数注册到 store
  logger.debug(`[HMR] 重载完成: ${file}`)
}
```

### 4.2 数据流

```
文件变更
    ↓
onFileChange(file)
    ↓
store.clearByFile(file)  ──→  store.emit('del', ...)  ──→  hotRegistry.untrack()
    ↓
import(file + '?t=...')
    ↓
command(...) 执行
    ↓
store.add(type, plugin)  ──→  store.emit('add', ...)  ──→  hotRegistry.track()
    ↓
完成
```

---

## 五、可扩展性：中间件系统

### 5.1 全局中间件

```ts
import { use } from '@karinjs/plugin'

// 注册全局中间件
use(async (ctx, next) => {
  const start = Date.now()
  await next()
  console.log(`耗时: ${Date.now() - start}ms`)
})

// 权限中间件
use(async (ctx, next) => {
  if (ctx.plugin.perm === 'master' && !ctx.isMaster) {
    return ctx.reply('权限不足')
  }
  await next()
})
```

### 5.2 插件级中间件

```ts
command(/^test$/, 'ok')
  .use(async (ctx, next) => {
    console.log('只在这个命令执行前')
    await next()
  })
```

### 5.3 插件装饰器

```ts
import { command, decorators } from '@karinjs/plugin'

const { cooldown, rateLimit, cache } = decorators

// 冷却时间
command(/^签到$/, signIn)
  .use(cooldown({ seconds: 60, key: ctx => ctx.userId }))

// 速率限制
command(/^抽卡$/, gacha)
  .use(rateLimit({ max: 10, window: '1m' }))

// 结果缓存
command(/^天气 (.+)$/, getWeather)
  .use(cache({ ttl: '5m', key: ctx => ctx.msg }))
```

---

## 六、完整示例

### 6.1 简单命令

```ts
import { command } from '@karinjs/plugin'

// 最简形式（保持兼容）
command(/^ping$/, 'pong')

// 链式配置
command(/^help$/, showHelp)
  .name('帮助')
  .priority(1)
  .perm('all')
```

### 6.2 响应式命令

```ts
import { ref, command, watch } from '@karinjs/plugin'

const counter = ref(
  command(/^count$/, ctx => ctx.reply(`${++count}`))
    .name('计数器')
)

let count = 0

// 监听变化
watch(() => counter.value.disabled, (disabled) => {
  if (disabled) count = 0  // 禁用时重置
})

// 动态控制
command(/^toggle$/, () => {
  counter.value.disabled = !counter.value.disabled
}, { perm: 'master' })
```

### 6.3 带中间件的命令

```ts
import { command, decorators } from '@karinjs/plugin'

const { cooldown } = decorators

command(/^签到$/, async ctx => {
  await doSignIn(ctx.userId)
  ctx.reply('签到成功！')
})
  .name('签到')
  .perm('all')
  .use(cooldown({ seconds: 86400, key: ctx => ctx.userId }))
  .catch((err, ctx) => ctx.reply('签到失败，请稍后重试'))
```

### 6.4 动态注册

```ts
import { ref, command } from '@karinjs/plugin'

// 存储动态创建的命令
const dynamicCommands = new Map<string, RefPlugin>()

command(/^#add (.+)$/, ctx => {
  const name = ctx.match[1]

  const cmd = ref(
    command(new RegExp(`^${name}$`), `你触发了 ${name}`)
      .name(`动态命令: ${name}`)
  )

  dynamicCommands.set(name, cmd)
  ctx.reply(`已创建命令: ${name}`)
}, { perm: 'master' })

command(/^#del (.+)$/, ctx => {
  const name = ctx.match[1]
  const cmd = dynamicCommands.get(name)

  if (cmd) {
    cmd.dispose()
    dynamicCommands.delete(name)
    ctx.reply(`已删除命令: ${name}`)
  } else {
    ctx.reply('命令不存在')
  }
}, { perm: 'master' })
```

---

## 七、迁移指南

### 7.1 从 v1/old 迁移

```ts
// 旧代码（完全兼容，无需修改）
command(/^ping$/, 'pong')

// 新代码（可选升级）
command(/^ping$/, 'pong')
  .name('Ping')
  .priority(100)
```

### 7.2 获取响应式能力

```ts
// 旧代码
const ping = command(/^ping$/, 'pong')
ping.setReg(/^pong$/)  // 手动调用 setter

// 新代码
const ping = ref(command(/^ping$/, 'pong'))
ping.value.reg = /^pong$/  // 自动响应式更新
```

---

## 八、架构对比

| 方面 | 旧架构 | 新架构 |
|------|--------|--------|
| 缓存与 HMR | 两个独立系统 | 统一 Store + 事件驱动 |
| 响应式 | 返回值 + setter | `ref()` 包装 + Proxy |
| 扩展性 | 继承类 | 中间件 + 装饰器 |
| 链式调用 | 不支持 | 完整链式 API |
| 内部实现 | 职责混乱 | 分层清晰 |

---

## 九、文件结构

```
src/
├── index.ts              # 统一导出
├── reactive/             # 响应式系统
│   ├── ref.ts            # ref() 实现
│   ├── effect.ts         # effect() 实现
│   └── watch.ts          # watch() 实现
├── store/                # 统一存储
│   ├── index.ts          # UnifiedStore 类
│   └── indexes.ts        # 索引管理
├── core/                 # 核心构建器
│   ├── base.ts           # BuilderBase
│   ├── command.ts        # CommandBuilder (链式)
│   ├── accept.ts
│   ├── handler.ts
│   ├── task.ts
│   └── button.ts
├── middleware/           # 中间件系统
│   ├── index.ts          # use() 注册
│   ├── compose.ts        # 中间件组合
│   └── decorators/       # 内置装饰器
│       ├── cooldown.ts
│       ├── rateLimit.ts
│       └── cache.ts
├── hot/                  # HMR 系统
│   ├── registry.ts       # 订阅 store 事件
│   ├── watcher.ts        # 文件监听
│   └── reload.ts         # 重载逻辑
└── types/                # 类型定义
```

---

## 十、总结

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   v8 核心理念：响应式 + 链式 + 可扩展                            │
│                                                                │
│   1. ref(command(...)) - 类似 Vue 的响应式包装                  │
│   2. command(...).name().perm() - 完整链式调用                  │
│   3. use(middleware) - 中间件可扩展                             │
│   4. UnifiedStore + 事件 - 缓存与 HMR 统一                      │
│   5. 分层架构 - reactive / store / core / hot                  │
│                                                                │
│   同时保持：                                                    │
│   - command(/^ping$/, 'pong') 的极简用法                        │
│   - 100% 向后兼容                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```
