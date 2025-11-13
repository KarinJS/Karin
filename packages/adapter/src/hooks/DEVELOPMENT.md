# Hooks 开发维护指南

本文档详细说明如何在 Hooks 系统中新增、修改和维护钩子 API。

## 📋 目录

- [架构概述](#架构概述)
- [新增钩子完整流程](#新增钩子完整流程)
- [文件组织规范](#文件组织规范)
- [代码规范](#代码规范)
- [测试指南](#测试指南)
- [常见问题](#常见问题)

---

## 架构概述

### 核心概念

Hooks 系统采用**双层 API 设计**：

1. **用户 API（User-facing API）**
   - 供插件开发者使用
   - 注册钩子、移除钩子
   - API 必须保持向后兼容
   - 导出位置：`hooks.xxx`

2. **内部 API（Internal API）**
   - 供框架内部使用
   - 触发钩子执行
   - 可以自由重构优化
   - 导出位置：`HooksInternal.xxx`

### 文件结构

```
hooks/
├── index.ts                    # 主导出文件（唯一对外接口）
├── core/                       # 核心基础设施
│   └── manager.ts              # HookManager 类（通用钩子管理器）
├── implements/                 # 钩子具体实现
│   ├── message.ts              # 消息钩子
│   ├── sendMsg.ts              # 发送消息钩子
│   ├── empty.ts                # 空插件钩子
│   └── eventCall.ts            # 事件调用钩子
└── types/                      # 类型定义
    ├── index.ts
    └── message.ts              # 所有钩子的类型定义
```

### 数据流向

```
插件开发者                    框架内部
    │                           │
    ├─ hooks.message()          │
    │  ├─ add()                 │
    │  └─ remove()              │
    │                           │
    │                           ├─ HooksInternal.Message.trigger()
    │                           │  └─ messageManager.emit()
    │                           │
    └─ 注册回调函数 ──────────> 执行回调函数
```

---

## 新增钩子完整流程

### 示例：新增 "会话钩子"（session）

假设我们要添加一个新的会话管理钩子，用于在会话创建/销毁时执行自定义逻辑。

### 步骤 1：定义类型（types/message.ts）

在 `types/message.ts` 中添加相关类型定义：

```typescript
/**
 * 会话事件类型
 */
export interface SessionEvent {
  /** 会话ID */
  sessionId: string
  /** 用户ID */
  userId: string
  /** 会话类型 */
  type: 'create' | 'destroy'
  /** 创建时间 */
  timestamp: number
}

/**
 * 会话钩子回调函数
 * @param event 会话事件
 * @param next 继续执行下一个钩子的函数
 */
export type SessionHookCallback = (
  event: SessionEvent,
  next: HookNext
) => void | Promise<void>

/**
 * 会话钩子项
 */
export interface SessionHookItem {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: SessionHookCallback
}
```

**类型定义规范：**

- 事件类型必须定义清晰的接口
- 回调函数必须包含 `next: HookNext` 参数（用于控制流）
- HookItem 接口保持统一结构（id, priority, callback）

### 步骤 2：创建实现文件（implements/session.ts）

在 `implements/` 目录下创建新文件：

```typescript
import { logger } from '@karinjs/logger'
import { HookManager } from '../core/manager'
import type { SessionEvent, SessionHookCallback, HookOptions } from '../types/message'

// 创建钩子管理器实例（每种钩子独立管理）
const sessionCreateManager = new HookManager<SessionHookCallback>('session.create')
const sessionDestroyManager = new HookManager<SessionHookCallback>('session.destroy')

/**
 * 会话钩子（用户 API）
 */
export const session = Object.assign(
  /**
   * 添加会话钩子（监听所有会话事件）
   * @param callback 会话处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: SessionHookCallback, options: HookOptions = {}): number => {
    const createId = sessionCreateManager.add(callback, options)
    const destroyId = sessionDestroyManager.add(callback, options)
    logger.mark(`[hooks] 添加会话钩子: create=${createId}, destroy=${destroyId}`)
    // 返回第一个ID即可（remove 时会同时移除两个）
    return createId
  },
  {
    /**
     * 添加会话创建钩子
     * @param callback 会话处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    create(callback: SessionHookCallback, options: HookOptions = {}): number {
      const id = sessionCreateManager.add(callback, options)
      logger.mark(`[hooks] 添加会话创建钩子: ${id}`)
      return id
    },

    /**
     * 添加会话销毁钩子
     * @param callback 会话处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    destroy(callback: SessionHookCallback, options: HookOptions = {}): number {
      const id = sessionDestroyManager.add(callback, options)
      logger.mark(`[hooks] 添加会话销毁钩子: ${id}`)
      return id
    },

    /**
     * 删除会话钩子
     * @param id 钩子ID
     */
    remove(id: number): void {
      logger.mark(`[hooks] 移除会话钩子: ${id}`)
      sessionCreateManager.remove(id)
      sessionDestroyManager.remove(id)
    },
  }
)

/**
 * 会话钩子内部触发器（框架内部 API）
 */
export class SessionHooks {
  /**
   * 触发会话创建钩子
   * @param event 会话事件
   * @returns 是否继续执行（false 表示被拦截）
   */
  static async triggerCreate(event: SessionEvent): Promise<boolean> {
    return await sessionCreateManager.emit(event)
  }

  /**
   * 触发会话销毁钩子
   * @param event 会话事件
   * @returns 是否继续执行
   */
  static async triggerDestroy(event: SessionEvent): Promise<boolean> {
    return await sessionDestroyManager.emit(event)
  }

  /**
   * 获取当前注册的钩子数量（用于调试）
   */
  static getStats() {
    return {
      create: sessionCreateManager.size,
      destroy: sessionDestroyManager.size,
    }
  }
}
```

**实现规范：**

1. **Manager 实例命名**：`{功能}{子类型}Manager`（如 `sessionCreateManager`）
2. **Manager 标识**：使用点分隔的命名（如 `'session.create'`），便于日志追踪
3. **用户 API 结构**：
   - 使用 `Object.assign` 支持主函数 + 子方法的模式
   - 主函数监听所有事件
   - 子方法监听特定事件
   - 必须包含 `remove()` 方法
4. **内部 API 结构**：
   - 使用静态类（Class）组织内部触发方法
   - 方法命名：`trigger{EventType}`（如 `triggerCreate`）
   - 可选添加 `getStats()` 等辅助方法
5. **日志规范**：
   - 添加钩子：`logger.mark('[hooks] 添加xxx钩子: {id}')`
   - 移除钩子：`logger.mark('[hooks] 移除xxx钩子: {id}')`

### 步骤 3：更新主导出文件（index.ts）

```typescript
import { session, SessionHooks } from './implements/session'

/**
 * 钩子系统类型
 */
export type HooksType = {
  // ... 现有的
  /** 会话钩子 */
  session: typeof session
}

/**
 * 钩子系统（用户API）
 */
export const hooks: HooksType = {
  // ... 现有的
  session,
}

/**
 * 内部钩子触发器（框架内部使用）
 */
export const HooksInternal = {
  // ... 现有的
  /** 会话钩子触发器 */
  Session: SessionHooks,
}
```

**导出规范：**

- 用户 API：小写开头（`session`）
- 内部 API：大写开头（`SessionHooks`）
- 必须同时添加类型定义（`HooksType`）

### 步骤 4：编写测试（可选但推荐）

创建 `test/hooks/session.spec.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { hooks, HooksInternal } from '../../src/hooks'

describe('Session Hooks', () => {
  beforeEach(() => {
    // 清理钩子
  })

  it('should register and trigger create hook', async () => {
    let triggered = false
    
    const id = hooks.session.create((event, next) => {
      triggered = true
      expect(event.type).toBe('create')
      next()
    })

    await HooksInternal.Session.triggerCreate({
      sessionId: 'test',
      userId: '123',
      type: 'create',
      timestamp: Date.now(),
    })

    expect(triggered).toBe(true)
    hooks.session.remove(id)
  })

  it('should respect priority order', async () => {
    const order: number[] = []

    hooks.session.create(() => order.push(1), { priority: 100 })
    hooks.session.create(() => order.push(2), { priority: 1 })
    hooks.session.create(() => order.push(3), { priority: 50 })

    await HooksInternal.Session.triggerCreate({
      sessionId: 'test',
      userId: '123',
      type: 'create',
      timestamp: Date.now(),
    })

    expect(order).toEqual([2, 3, 1])
  })

  it('should stop on missing next()', async () => {
    hooks.session.create((event, next) => {
      // 不调用 next()，应该中断后续钩子
    })

    hooks.session.create(() => {
      throw new Error('Should not be called')
    })

    const result = await HooksInternal.Session.triggerCreate({
      sessionId: 'test',
      userId: '123',
      type: 'create',
      timestamp: Date.now(),
    })

    expect(result).toBe(false) // 被中断
  })
})
```

### 步骤 5：更新文档

在 `README.md` 中添加新 API 的使用示例：

```markdown
### 会话钩子 (SessionHooks)
| 用户 API | 内部触发器 | 说明 |
|---------|-----------|------|
| `hooks.session()` | - | 监听所有会话事件 |
| `hooks.session.create()` | `SessionHooks.triggerCreate()` | 会话创建 |
| `hooks.session.destroy()` | `SessionHooks.triggerDestroy()` | 会话销毁 |
```

### 步骤 6：编译和验证

```bash
cd packages/adapter
pnpm run build
pnpm run checkType
```

确保没有类型错误和编译错误。

---

## 文件组织规范

### 何时创建新文件

**应该创建独立文件的情况：**

- 新的业务领域钩子（如消息、会话、权限等）
- 包含 3 个以上的子钩子类型
- 类型定义超过 50 行

**不应该创建独立文件的情况：**

- 只有 1-2 个简单钩子
- 可以归类到现有文件中的功能

### 文件命名规范

- **实现文件**：小驼峰命名（`sessionManager.ts`）或全小写（`session.ts`）
- **类型文件**：与实现文件对应
- **核心文件**：功能性命名（`manager.ts`、`utils.ts`）

### 导入导出规范

```typescript
// ✅ 正确：使用相对路径
import { HookManager } from '../core/manager'
import type { HookOptions } from '../types/message'

// ❌ 错误：不要使用绝对路径
import { HookManager } from '@karinjs/adapter/hooks/core/manager'
```

---

## 代码规范

### 命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| Manager 实例 | `{功能}{类型}Manager` | `sessionCreateManager` |
| 用户 API 对象 | 小写开头 | `session`, `message` |
| 内部 API 类 | 大写开头 + Hooks 后缀 | `SessionHooks` |
| 触发方法 | `trigger{EventType}` | `triggerCreate` |
| 回调类型 | `{Feature}HookCallback` | `SessionHookCallback` |

### JSDoc 注释规范

所有导出的 API 必须包含完整的 JSDoc：

```typescript
/**
 * 添加会话创建钩子
 * @param callback 会话处理回调函数
 * @param options 钩子配置项
 * @returns 钩子ID
 * @example
 * ```typescript
 * const id = hooks.session.create((event, next) => {
 *   console.log('会话创建:', event.sessionId)
 *   next()
 * })
 * ```
 */
create(callback: SessionHookCallback, options?: HookOptions): number
```

**必需的标签：**

- `@param` - 所有参数
- `@returns` - 返回值（除 void）
- `@example` - 至少一个使用示例（用户 API）

**可选的标签：**

- `@throws` - 可能抛出的异常
- `@see` - 相关 API 引用
- `@deprecated` - 废弃标记

### 错误处理规范

```typescript
// ✅ 正确：在 Manager 中捕获错误
const result = await manager.emit(event)
// Manager 内部已经处理了错误

// ❌ 错误：不要在实现层再次 try-catch
try {
  await manager.emit(event)
} catch (err) {
  // 这是多余的
}
```

HookManager 已经内置了错误处理：

- 默认捕获并记录错误
- 可通过 `swallowErrors` 选项控制行为
- 错误不会导致进程崩溃

---

## 测试指南

### 单元测试覆盖范围

每个新增钩子必须测试：

1. **基础功能**
   - ✅ 注册钩子
   - ✅ 触发钩子
   - ✅ 移除钩子

2. **优先级**
   - ✅ 按优先级顺序执行
   - ✅ 相同优先级按注册顺序

3. **控制流**
   - ✅ 调用 `next()` 继续执行
   - ✅ 不调用 `next()` 中断执行

4. **异步处理**
   - ✅ 同步钩子
   - ✅ 异步钩子（Promise）
   - ✅ 混合场景

5. **错误处理**
   - ✅ 钩子内抛出错误
   - ✅ `swallowErrors` 配置

### 测试框架

使用 vitest 进行测试：

```bash
pnpm test hooks/session.spec.ts
```

---

## 常见问题

### Q1: 何时使用 `emit()` vs `emitAll()`？

**emit() - 前置钩子（可中断）**

```typescript
// 用于需要控制流程的场景
const shouldContinue = await manager.emit(event)
if (!shouldContinue) {
  return // 被钩子拦截
}
// 继续执行主逻辑
```

**emitAll() - 后置钩子（不可中断）**

```typescript
// 用于通知性质的场景
await manager.emitAll(result)
// 无论钩子执行结果如何，都不影响主流程
```

**emitParallel() - 并行后置钩子**

```typescript
// 用于独立的后置处理
await manager.emitParallel(result)
// 所有钩子并行执行，互不影响
```

### Q2: 如何处理钩子中的异步操作？

钩子回调可以返回 Promise：

```typescript
hooks.session.create(async (event, next) => {
  await someAsyncOperation()
  // 异步操作完成后再调用 next
  next()
})
```

HookManager 会自动等待 Promise 完成。

### Q3: 如何在钩子中修改事件数据？

如果需要修改事件数据，传递可变对象：

```typescript
// 定义可变事件类型
interface MutableEvent {
  data: {
    message: string
  }
}

// 在钩子中修改
hooks.myHook((event: MutableEvent, next) => {
  event.data.message = '修改后的消息'
  next()
})
```

**注意：** 直接修改事件对象，后续钩子会看到修改后的值。

### Q4: 如何调试钩子执行顺序？

1. **查看日志**

```typescript
// HookManager 会自动记录
[hooks] 添加会话创建钩子: 1
[hooks] 添加会话创建钩子: 2
```

2. **使用 getStats()**

```typescript
const stats = SessionHooks.getStats()
console.log('当前钩子数量:', stats)
```

3. **使用 list() 方法**

```typescript
const hooks = manager.list()
hooks.forEach(hook => {
  console.log(`ID: ${hook.id}, Priority: ${hook.priority}`)
})
```

### Q5: 如何保证向后兼容性？

**DO（推荐）：**

- ✅ 添加新的可选参数
- ✅ 添加新的子方法
- ✅ 扩展事件对象（新增字段）

**DON'T（避免）：**

- ❌ 修改现有参数类型
- ❌ 删除现有方法
- ❌ 改变方法行为（除非是 bug 修复）

如果必须做破坏性修改：

1. 标记旧 API 为 `@deprecated`
2. 提供迁移指南
3. 至少保留 2-3 个版本

### Q6: 性能优化建议

1. **避免在钩子中执行耗时操作**

```typescript
// ❌ 不好
hooks.message(async (event, next) => {
  await heavyDatabaseQuery() // 阻塞其他钩子
  next()
})

// ✅ 更好
hooks.message((event, next) => {
  next() // 先继续流程
  // 异步处理，不阻塞
  heavyDatabaseQuery().catch(err => logger.error(err))
})
```

2. **使用优先级控制执行顺序**

```typescript
// 重要的钩子先执行
hooks.message(callback, { priority: 1 })

// 次要的钩子后执行
hooks.message(callback, { priority: 1000 })
```

3. **及时移除不需要的钩子**

```typescript
const id = hooks.message(callback)

// 不再需要时立即移除
hooks.message.remove(id)
```

---

## 维护清单

在修改 Hooks 系统时，请确保：

- [ ] 更新了类型定义（`types/message.ts`）
- [ ] 创建了实现文件（`implements/*.ts`）
- [ ] 更新了主导出（`index.ts`）
- [ ] 添加了 JSDoc 注释
- [ ] 编写了单元测试
- [ ] 更新了 README.md
- [ ] 运行了 `pnpm run build`
- [ ] 运行了 `pnpm run checkType`

---

## 参考资料

- [HookManager 源码](./core/manager.ts)
- [现有实现示例](./implements/)
- [类型定义](./types/message.ts)
- [用户文档](./README.md)

---

**最后更新：** 2025年11月14日  
**维护者：** Karin 开发团队

如有疑问，请在 GitHub Issues 中提问。
