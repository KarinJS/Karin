# TypeScript 类型安全的事件发射器

一个基于 Node.js EventEmitter 的增强版事件发射器，提供完整的 TypeScript 类型支持，同时保留灵活性。

## 特性

- **类型安全**：在编译时检查事件名称和参数类型
- **正则表达式事件名**：支持使用正则表达式模式匹配多个事件
- **命名空间支持**：通过点号分隔的事件名称实现命名空间管理
- **自定义事件**：支持创建独立的事件实例
- **灵活性**：支持使用预定义事件类型和任意字符串作为事件名

## 安装

```bash
pnpm add @karin/events
```

## 基本用法

### 定义事件类型

```typescript
interface AppEvents {
  // 用户相关事件
  'user.login': [userId: number, username: string]
  'user.logout': [userId: number]
  
  // 系统相关事件
  'system.start': [timestamp: number]
}

// 创建类型安全的事件发射器
const events = new EventEmitter<AppEvents>()
```

### 添加和触发事件

```typescript
// 添加事件监听器
events.on('user.login', (userId, username) => {
  console.log(`用户登录: ${username}(ID: ${userId})`)
})

// 添加一次性事件监听器
events.once('user.logout', (userId) => {
  console.log(`用户登出: ID ${userId}`)
})

// 触发事件
events.emit('user.login', 1001, 'alice') // 参数类型会被检查
```

### 自定义事件名

除了预定义的事件类型，还可以使用任意字符串作为事件名：

```typescript
// 添加自定义事件监听器
events.on('custom-event', (...args) => {
  console.log('自定义事件被触发，参数:', args)
})

// 触发自定义事件
events.emit('custom-event', 'hello', 'world')
```

## 高级功能

### 正则表达式事件名

```typescript
// 使用正则表达式字符串监听所有用户相关事件
events.on('/^user\\./', (...args) => {
  const [userId] = args
  console.log(`用户事件触发: 用户ID ${userId}`)
})

// 将触发上面的监听器
events.emit('user.login', 1001, 'charlie')
events.emit('user.logout', 1001)
```

### 命名空间管理

```typescript
// 移除特定命名空间的所有监听器
events.removeNamespaceListeners('user')

// 所有 user.* 事件的监听器都会被移除
```

### 自定义事件实例

```typescript
// 创建自定义事件
const loginEvent = events.createEvent<AppEvents>()

// 添加监听器
loginEvent.on('user.login', (userId, username) => {
  console.log(`自定义事件监听器: 用户 ${username}(ID: ${userId}) 登录`)
})

// 通过自定义事件实例触发
loginEvent.emit('user.login', 1001, 'helen')

// 使用em方法同时触发父级和自定义事件
loginEvent.em('user.login', 1002, 'ivan')
```

### 最大监听器数量限制

```typescript
// 设置最大监听器数量
events.setMaxListeners(3)

// 获取当前最大监听器数量
const maxListeners = events.getMaxListeners()
```

## API 参考

### EventEmitter 类

- `on(eventName, listener)` - 添加事件监听器
- `once(eventName, listener)` - 添加一次性事件监听器
- `off(eventName, listener)` - 移除事件监听器
- `emit(eventName, ...args)` - 触发事件
- `removeAllListeners([eventName])` - 移除所有监听器
- `removeNamespaceListeners(namespace)` - 移除指定命名空间的监听器
- `listenerCount(eventName, [listener])` - 获取监听器数量
- `listeners(eventName)` - 获取监听器列表
- `eventNames()` - 获取所有已注册事件名称
- `setMaxListeners(n)` - 设置最大监听器数量
- `getMaxListeners()` - 获取最大监听器数量
- `createEvent()` - 创建自定义事件实例
- `clear()` - 清理所有事件和缓存

### 自定义事件实例

- 继承 EventEmitter 的所有方法
- `em(eventName, ...args)` - 同时触发父级和自定义事件

## 许可证

MIT 