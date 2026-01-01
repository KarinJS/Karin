# Karin Plugin v9 - 纯函数式架构

> 无 class、无 .value、API 分离、开发环境集成

---

## 设计原则

1. **无 Class** - 全部用纯函数 + 闭包
2. **无 .value** - `ref()` 返回的对象直接操作属性
3. **API 分离** - `command()` 保持极简，`chain()` 单独提供链式
4. **开发环境优先** - 插件开发从第一天就考虑

---

## 一、核心 API

### 1.1 基础用法（保持极简）

```ts
import { command, task, accept, handler } from '@karinjs/plugin'

// 最简形式 - 不变
command(/^ping$/, 'pong')
command(/^echo (.+)$/, ctx => ctx.reply(ctx.match[1]))

// 带 options
command(/^admin$/, doAdmin, { perm: 'master', priority: 1 })

// 定时任务
task('daily', '0 9 * * *', () => sendReport())

// 通知
accept('notice.group.increase', ctx => ctx.reply('欢迎新人！'))

// 处理器
handler('custom-event', (data, next) => { ... })
```

### 1.2 链式 API（独立函数）

```ts
import { chain } from '@karinjs/plugin'

// chain() 包装任何插件，返回链式构建器
chain(command(/^test$/, 'ok'))
  .name('测试')
  .priority(100)
  .perm('admin')
  .on('message.group')
  .when(ctx => ctx.groupId === '123')
  .before(ctx => console.log('before'))
  .after(ctx => console.log('after'))
  .catch((err, ctx) => ctx.reply('出错了'))
  .done()  // 结束链式，返回插件对象

// 或者直接用
chain(command(/^test$/, 'ok'))
  .perm('master')
  // 不调用 done() 也行，自动注册
```

### 1.3 响应式（无 .value）

```ts
import { ref, command } from '@karinjs/plugin'

// ref() 返回 Proxy，直接操作属性
const ping = ref(command(/^ping$/, 'pong'))

// 直接修改，无需 .value
ping.reg = /^pong$/           // ✅ 自动触发更新
ping.callback = () => 'hi'    // ✅ 自动触发更新
ping.priority = 1             // ✅ 自动触发排序
ping.disabled = true          // ✅ 自动停用

// 卸载
ping.dispose()                // 完全移除

// 监听变化
ping.on('change', (key, newVal, oldVal) => {
  console.log(`${key} 从 ${oldVal} 变为 ${newVal}`)
})
```

---

## 二、纯函数实现（无 Class）

### 2.1 command() 实现

```ts
// src/core/command.ts

import { store } from '../store'
import { createId, getCallerInfo } from '../utils'

/** 插件对象类型 */
export interface CommandPlugin {
  id: string
  type: 'message'
  reg: RegExp
  callback: CommandCallback
  name: string
  priority: number
  perm: Permission
  log: boolean
  event: string[]
  adapter: string[]
  dsbAdapter: string[]
  file: string
  pkg: string
  disabled: boolean
}

/** 创建命令插件 */
export function command(
  reg: string | RegExp,
  callback: CommandCallback | string,
  options: CommandOptions = {}
): CommandPlugin {
  const caller = getCallerInfo()

  // 构建插件对象
  const plugin: CommandPlugin = {
    id: createId('command', caller.file),
    type: 'message',
    reg: typeof reg === 'string' ? new RegExp(reg) : reg,
    callback: normalizeCallback(callback, options),
    name: options.name ?? caller.defaultName,
    priority: options.priority ?? 10000,
    perm: options.perm ?? 'all',
    log: options.log ?? true,
    event: normalizeEvent(options.event),
    adapter: options.adapter ?? [],
    dsbAdapter: options.dsbAdapter ?? [],
    file: caller.file,
    pkg: caller.pkg,
    disabled: false,
  }

  // 注册到 store
  store.add('message', plugin)

  return plugin
}

/** 标准化回调 */
function normalizeCallback(
  callback: CommandCallback | string,
  options: CommandOptions
): CommandCallback {
  if (typeof callback === 'function') {
    return callback
  }

  // 字符串转回调
  const message = callback
  const { delay = 0, at = false, reply = false, recallMsg = 0 } = options

  return async (ctx) => {
    if (delay > 0) await sleep(delay)
    await ctx.reply(message, { at, reply, recallMsg })
  }
}

/** 标准化事件 */
function normalizeEvent(event?: string | string[]): string[] {
  if (!event) return ['message']
  return Array.isArray(event) ? event : [event]
}
```

### 2.2 ref() 实现（无 .value）

```ts
// src/reactive/ref.ts

import { store } from '../store'

/** 事件监听器 */
type ChangeListener = (key: string, newVal: unknown, oldVal: unknown) => void

/** 响应式插件 */
export interface RefPlugin<T> extends T {
  /** 销毁插件 */
  dispose(): void
  /** 监听变化 */
  on(event: 'change', listener: ChangeListener): () => void
  /** 热更新标记 */
  readonly __hot: true
  /** 唯一标识 */
  readonly __refid: string
}

/** 创建响应式插件 */
export function ref<T extends { id: string; type: string }>(plugin: T): RefPlugin<T> {
  const refid = crypto.randomUUID()
  const listeners = new Set<ChangeListener>()

  // 创建 Proxy，直接代理所有属性
  const proxy = new Proxy(plugin, {
    get(target, key) {
      // 特殊属性
      if (key === '__hot') return true
      if (key === '__refid') return refid
      if (key === 'dispose') return dispose
      if (key === 'on') return on

      return (target as Record<string, unknown>)[key as string]
    },

    set(target, key, value) {
      const oldVal = (target as Record<string, unknown>)[key as string]
      if (oldVal === value) return true

      ;(target as Record<string, unknown>)[key as string] = value

      // 通知监听器
      for (const fn of listeners) {
        fn(key as string, value, oldVal)
      }

      // 特殊处理
      if (key === 'priority') {
        store.markDirty((target as { type: string }).type)
      }
      if (key === 'disabled') {
        value
          ? store.deactivate((target as { id: string }).id)
          : store.activate((target as { id: string }).id)
      }

      return true
    }
  }) as RefPlugin<T>

  function dispose() {
    store.del(plugin.id)
    listeners.clear()
  }

  function on(event: 'change', listener: ChangeListener): () => void {
    if (event === 'change') {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
    return () => {}
  }

  return proxy
}
```

### 2.3 chain() 实现

```ts
// src/core/chain.ts

import type { CommandPlugin } from './command'

/** 链式构建器 */
export interface ChainBuilder<T> {
  name(n: string): ChainBuilder<T>
  priority(n: number): ChainBuilder<T>
  perm(p: Permission): ChainBuilder<T>
  adapter(...a: string[]): ChainBuilder<T>
  log(enabled: boolean): ChainBuilder<T>
  on(event: string | string[]): ChainBuilder<T>
  when(condition: (ctx: unknown) => boolean): ChainBuilder<T>
  before(hook: (ctx: unknown) => void | Promise<void>): ChainBuilder<T>
  after(hook: (ctx: unknown) => void | Promise<void>): ChainBuilder<T>
  catch(handler: (err: Error, ctx: unknown) => void): ChainBuilder<T>
  done(): T
}

/** 创建链式构建器 */
export function chain<T extends CommandPlugin>(plugin: T): ChainBuilder<T> {
  const hooks = {
    conditions: [] as Array<(ctx: unknown) => boolean>,
    before: [] as Array<(ctx: unknown) => void | Promise<void>>,
    after: [] as Array<(ctx: unknown) => void | Promise<void>>,
    onError: null as ((err: Error, ctx: unknown) => void) | null,
  }

  const originalCallback = plugin.callback

  const builder: ChainBuilder<T> = {
    name(n) {
      plugin.name = n
      return builder
    },

    priority(n) {
      plugin.priority = n
      return builder
    },

    perm(p) {
      plugin.perm = p
      return builder
    },

    adapter(...a) {
      plugin.adapter = a
      return builder
    },

    log(enabled) {
      plugin.log = enabled
      return builder
    },

    on(event) {
      plugin.event = Array.isArray(event) ? event : [event]
      return builder
    },

    when(condition) {
      hooks.conditions.push(condition)
      return builder
    },

    before(hook) {
      hooks.before.push(hook)
      return builder
    },

    after(hook) {
      hooks.after.push(hook)
      return builder
    },

    catch(handler) {
      hooks.onError = handler
      return builder
    },

    done() {
      // 包装回调
      if (hooks.conditions.length || hooks.before.length || hooks.after.length || hooks.onError) {
        plugin.callback = async (ctx, next) => {
          // 条件检查
          for (const cond of hooks.conditions) {
            if (!cond(ctx)) return next?.()
          }

          try {
            // 前置钩子
            for (const hook of hooks.before) {
              await hook(ctx)
            }

            // 主回调
            await originalCallback(ctx, next)

            // 后置钩子
            for (const hook of hooks.after) {
              await hook(ctx)
            }
          } catch (err) {
            if (hooks.onError) {
              hooks.onError(err as Error, ctx)
            } else {
              throw err
            }
          }
        }
      }

      return plugin
    }
  }

  return builder
}
```

---

## 三、开发环境集成

### 3.1 目录结构

```
my-bot/
├── karin.config.ts       # 主配置
├── plugins/              # 本地插件目录（热更新）
│   ├── my-plugin.ts      # 单文件插件
│   └── my-plugin/        # 多文件插件
│       ├── index.ts
│       └── commands/
├── node_modules/
│   └── karin-plugin-xxx/ # NPM 插件包
└── dev/                  # 开发目录（开发时热更新）
    └── my-new-plugin/
        └── src/
```

### 3.2 开发模式配置

```ts
// karin.config.ts
import { defineConfig } from '@karinjs/plugin'

export default defineConfig({
  // 开发目录
  dev: {
    // 开发时监听的目录
    watch: ['./dev'],
    // 热更新策略
    hmr: {
      // 清除缓存方式（开发目录用这个）
      strategy: 'cache-clear',
      // 文件变更延迟（防抖）
      delay: 100,
    }
  },

  // 生产插件目录
  plugins: {
    // plugins 目录的热更新策略
    hmr: {
      strategy: 'url-param',  // ?t=timestamp
    }
  }
})
```

### 3.3 开发环境 API

```ts
// 插件开发入口
import { command, dev } from '@karinjs/plugin'

// 开发模式下的额外功能
if (dev.isDev) {
  // 开发时的调试命令
  command(/^#reload$/, () => {
    dev.reload()  // 手动触发重载
    return '重载完成'
  }, { perm: 'master' })

  // 开发时日志
  dev.log('插件已加载')
}

// 正常插件代码
command(/^ping$/, 'pong')
```

### 3.4 开发环境与 HMR 关联

```ts
// src/dev/index.ts

import { store } from '../store'
import { watch } from 'chokidar'

/** 开发环境状态 */
export const dev = {
  /** 是否开发模式 */
  isDev: process.env.NODE_ENV === 'development',

  /** 当前监听的目录 */
  watchDirs: [] as string[],

  /** 文件监听器 */
  watcher: null as ReturnType<typeof watch> | null,

  /** 开发日志 */
  log(...args: unknown[]) {
    if (this.isDev) {
      console.log('[DEV]', ...args)
    }
  },

  /** 手动重载当前文件 */
  reload() {
    // 获取当前调用者文件
    const file = getCallerFile()
    return reloadFile(file)
  },

  /** 启动开发模式 */
  async start(dirs: string[]) {
    this.watchDirs = dirs
    this.watcher = watch(dirs, {
      ignoreInitial: true,
      ignored: /node_modules/,
    })

    this.watcher.on('change', async (file) => {
      await reloadFile(file)
    })

    this.log(`开发模式启动，监听: ${dirs.join(', ')}`)
  },

  /** 停止开发模式 */
  stop() {
    this.watcher?.close()
    this.watcher = null
  }
}

/** 重载文件 */
async function reloadFile(file: string) {
  const normalizedPath = file.replace(/\\/g, '/')

  // 1. 清除该文件注册的所有插件
  const count = store.clearByFile(normalizedPath)
  dev.log(`卸载 ${count} 个插件: ${normalizedPath}`)

  // 2. 清除 Node.js 模块缓存（开发目录专用）
  const resolved = require.resolve(file)
  delete require.cache[resolved]

  // 3. 重新导入
  try {
    await import(file)
    dev.log(`重载成功: ${normalizedPath}`)
  } catch (err) {
    dev.log(`重载失败: ${normalizedPath}`, err)
  }
}
```

### 3.5 生命周期钩子

```ts
// src/lifecycle/index.ts

/** 生命周期钩子存储 */
const hooks = {
  load: new Map<string, () => void | Promise<void>>(),
  unload: new Map<string, () => void | Promise<void>>(),
}

/** 插件加载时 */
export function onLoad(callback: () => void | Promise<void>) {
  const file = getCallerFile()
  hooks.load.set(file, callback)

  // 立即执行（首次加载）
  callback()
}

/** 插件卸载时 */
export function onUnload(callback: () => void | Promise<void>) {
  const file = getCallerFile()
  hooks.unload.set(file, callback)
}

/** 执行卸载钩子 */
export async function runUnloadHooks(file: string) {
  const hook = hooks.unload.get(file)
  if (hook) {
    await hook()
    hooks.unload.delete(file)
  }
  hooks.load.delete(file)
}
```

### 3.6 完整开发流程

```ts
// dev/my-plugin/src/index.ts

import { command, ref, onLoad, onUnload, dev } from '@karinjs/plugin'

// 状态
let count = 0

// 生命周期
onLoad(() => {
  dev.log('我的插件加载了')
})

onUnload(() => {
  dev.log('我的插件卸载了')
  // 清理资源
})

// 响应式插件
const counter = ref(
  command(/^count$/, ctx => ctx.reply(`计数: ${++count}`))
)

// 普通插件
command(/^ping$/, 'pong')

// 开发时的调试命令
if (dev.isDev) {
  command(/^#state$/, () => {
    return `count = ${count}, disabled = ${counter.disabled}`
  }, { perm: 'master' })
}
```

---

## 四、统一 Store

```ts
// src/store/index.ts

import { EventEmitter } from 'node:events'

type PluginType = 'message' | 'notice' | 'request' | 'button' | 'handler' | 'task'

/** 创建 store（纯函数） */
function createStore() {
  const emitter = new EventEmitter()
  const stores = new Map<PluginType, Map<string, Plugin>>()
  const fileIndex = new Map<string, Set<string>>()
  const dirty = new Map<PluginType, boolean>()
  const sortedCache = new Map<PluginType, Plugin[]>()

  // 初始化
  const types: PluginType[] = ['message', 'notice', 'request', 'button', 'handler', 'task']
  for (const t of types) {
    stores.set(t, new Map())
    dirty.set(t, false)
  }

  return {
    /** 添加插件 */
    add(type: PluginType, plugin: Plugin) {
      stores.get(type)!.set(plugin.id, plugin)

      // 文件索引
      if (plugin.file) {
        let set = fileIndex.get(plugin.file)
        if (!set) {
          set = new Set()
          fileIndex.set(plugin.file, set)
        }
        set.add(plugin.id)
      }

      dirty.set(type, true)
      emitter.emit('add', type, plugin)
    },

    /** 删除插件 */
    del(id: string): boolean {
      for (const [type, store] of stores) {
        const plugin = store.get(id)
        if (plugin) {
          store.delete(id)

          // 清理文件索引
          if (plugin.file) {
            const set = fileIndex.get(plugin.file)
            if (set) {
              set.delete(id)
              if (set.size === 0) fileIndex.delete(plugin.file)
            }
          }

          dirty.set(type, true)
          emitter.emit('del', type, id)
          return true
        }
      }
      return false
    },

    /** 获取排序后的插件列表 */
    get(type: PluginType): Plugin[] {
      if (!dirty.get(type) && sortedCache.has(type)) {
        return sortedCache.get(type)!
      }

      const list = Array.from(stores.get(type)!.values())
        .filter(p => !p.disabled)
        .sort((a, b) => a.priority - b.priority)

      sortedCache.set(type, list)
      dirty.set(type, false)
      return list
    },

    /** 按文件清除 */
    clearByFile(file: string): number {
      const ids = fileIndex.get(file)
      if (!ids) return 0

      let count = 0
      for (const id of ids) {
        if (this.del(id)) count++
      }
      return count
    },

    /** 标记需要重排序 */
    markDirty(type: PluginType) {
      dirty.set(type, true)
      sortedCache.delete(type)
    },

    /** 停用 */
    deactivate(id: string) {
      for (const store of stores.values()) {
        const plugin = store.get(id)
        if (plugin) {
          plugin.disabled = true
          dirty.set(plugin.type, true)
          return
        }
      }
    },

    /** 激活 */
    activate(id: string) {
      for (const store of stores.values()) {
        const plugin = store.get(id)
        if (plugin) {
          plugin.disabled = false
          dirty.set(plugin.type, true)
          return
        }
      }
    },

    /** 事件监听 */
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    once: emitter.once.bind(emitter),
  }
}

export const store = createStore()
```

---

## 五、导出结构

```ts
// src/index.ts

// 核心 API
export { command } from './core/command'
export { task } from './core/task'
export { accept } from './core/accept'
export { handler } from './core/handler'

// 链式 API（独立）
export { chain } from './core/chain'

// 响应式（无 .value）
export { ref } from './reactive/ref'

// 生命周期
export { onLoad, onUnload } from './lifecycle'

// 开发环境
export { dev } from './dev'

// Store（高级用法）
export { store } from './store'

// 类型
export type * from './types'
```

---

## 六、完整示例

### 6.1 最简用法

```ts
import { command } from '@karinjs/plugin'

command(/^ping$/, 'pong')
```

### 6.2 链式配置

```ts
import { command, chain } from '@karinjs/plugin'

chain(command(/^admin$/, doAdmin))
  .name('管理命令')
  .perm('master')
  .priority(1)
  .done()
```

### 6.3 响应式控制

```ts
import { command, ref } from '@karinjs/plugin'

const ping = ref(command(/^ping$/, 'pong'))

// 直接修改属性（无 .value）
ping.reg = /^pong$/
ping.disabled = true

// 监听变化
ping.on('change', (key, newVal) => {
  console.log(`${key} 变了`)
})

// 卸载
ping.dispose()
```

### 6.4 开发环境

```ts
import { command, dev, onLoad, onUnload } from '@karinjs/plugin'

onLoad(() => dev.log('加载'))
onUnload(() => dev.log('卸载'))

command(/^ping$/, 'pong')

if (dev.isDev) {
  command(/^#reload$/, () => dev.reload())
}
```

---

## 七、对比总结

| 方面 | v8 | v9 |
|------|-----|-----|
| Class | 有 BuilderBase, CommandBuilder | **全部纯函数** |
| ref 访问 | `ping.value.reg` | **`ping.reg`** |
| 链式 API | 内置在 command() | **`chain()` 独立** |
| 开发环境 | 未设计 | **`dev` + 生命周期** |

---

## 八、文件结构

```
src/
├── index.ts           # 统一导出
├── core/              # 核心 API（纯函数）
│   ├── command.ts     # command()
│   ├── task.ts        # task()
│   ├── accept.ts      # accept()
│   ├── handler.ts     # handler()
│   └── chain.ts       # chain() 链式
├── reactive/          # 响应式（纯函数）
│   └── ref.ts         # ref() 无 .value
├── store/             # 统一存储（纯函数）
│   └── index.ts       # createStore()
├── dev/               # 开发环境
│   └── index.ts       # dev 对象
├── lifecycle/         # 生命周期
│   └── index.ts       # onLoad, onUnload
├── utils/             # 工具
│   ├── id.ts          # createId()
│   └── caller.ts      # getCallerInfo()
└── types/             # 类型
    └── index.ts
```

---

## 九、核心理念

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   v9 = 纯函数 + 无 .value + API 分离 + 开发优先                 │
│                                                                │
│   command(/^ping$/, 'pong')           ← 极简不变               │
│   chain(command(...)).perm('master')  ← 链式独立               │
│   ping.reg = /^xxx$/                  ← 无 .value              │
│   dev.isDev / onLoad / onUnload       ← 开发环境               │
│                                                                │
│   全部纯函数，无 Class                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```
