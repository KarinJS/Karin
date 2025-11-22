# LRUCache

高性能的 LRU（Least Recently Used）缓存实现，支持 TTL（Time To Live）过期策略。

## 特性

- ✨ **高性能**：`get` 操作异步更新 LRU 顺序，优先返回值
- ⏰ **灵活的 TTL**：支持全局 TTL 和单项 TTL，TTL=0 表示永不过期
- 🚀 **懒惰过期**：不使用定时器，在访问时检查过期，减少内存开销
- 📦 **完整的 API**：提供 `get`、`set`、`peek`、`has` 等丰富方法
- 🔍 **集合操作**：支持 `keys()`、`values()`、`entries()`、`forEach()`
- 📄 **序列化支持**：提供 `toJSON()` 和 `toString()` 方法

## 安装

```bash
npm install @karinjs/utils
```

## 基本用法

```typescript
import { LRUCache } from '@karinjs/utils'

// 创建缓存实例（容量 100，默认 TTL 5 分钟）
const cache = new LRUCache<string, any>(100, 5 * 60 * 1000)

// 设置缓存
cache.set('key1', 'value1')
cache.set('key2', 'value2', 10000) // 自定义 TTL：10 秒
cache.set('key3', 'value3', 0)     // 永不过期

// 获取缓存
const value = cache.get('key1')
console.log(value) // 'value1'

// 检查是否存在
if (cache.has('key2')) {
  console.log('key2 存在')
}

// 删除缓存
cache.delete('key1')

// 清空所有缓存
cache.clear()
```

## API 文档

### 构造函数

```typescript
constructor(capacity?: number, defaultTTL?: number)
```

- `capacity`：缓存容量，默认 `100`
- `defaultTTL`：默认过期时间（毫秒），默认 `5 * 60 * 1000`（5 分钟）

### 核心方法

#### `get(key: K): V | undefined`

获取缓存值，若过期则自动清除。异步更新 LRU 顺序以提升性能。

```typescript
const value = cache.get('myKey')
```

#### `set(key: K, value: V, ttl?: number): void`

设置缓存值。

- `ttl`：可选，过期时间（毫秒）
  - `0`：永不过期
  - `undefined`：使用默认 TTL

```typescript
cache.set('key', 'value')           // 使用默认 TTL
cache.set('key', 'value', 10000)    // 10 秒后过期
cache.set('key', 'value', 0)        // 永不过期
```

#### `peek(key: K): V | undefined`

查看缓存值但不更新 LRU 顺序，适用于只读场景。

```typescript
const value = cache.peek('myKey')
```

#### `has(key: K): boolean`

检查 key 是否存在且未过期，不会更新 LRU 顺序。

```typescript
if (cache.has('myKey')) {
  console.log('存在且未过期')
}
```

#### `delete(key: K): boolean`

删除指定 key，返回是否成功删除。

```typescript
const deleted = cache.delete('myKey')
```

#### `clear(): void`

清空所有缓存。

```typescript
cache.clear()
```

#### `size(): number`

获取当前有效缓存数量（忽略过期项）。

```typescript
const count = cache.size()
```

### 集合操作

#### `keys(): K[]`

获取所有有效的键。

```typescript
const allKeys = cache.keys()
```

#### `values(): V[]`

获取所有有效的值。

```typescript
const allValues = cache.values()
```

#### `entries(): Array<[K, V]>`

获取所有有效的键值对。

```typescript
const allEntries = cache.entries()
for (const [key, value] of allEntries) {
  console.log(key, value)
}
```

#### `forEach(callback: (value: V, key: K, cache: this) => void): void`

遍历所有有效的缓存项。

```typescript
cache.forEach((value, key) => {
  console.log(`${key}: ${value}`)
})
```

### 序列化方法

#### `toJSON(): Record<string, V>`

转换为 JSON 对象（仅包含有效的缓存项）。

```typescript
const json = cache.toJSON()
console.log(json) // { key1: 'value1', key2: 'value2' }
```

#### `toString(): string`

转换为 JSON 字符串表示。

```typescript
const str = cache.toString()
console.log(str)
```

## 使用场景

### 1. API 响应缓存

```typescript
const apiCache = new LRUCache<string, any>(1000, 60000) // 1000 条，1 分钟

async function fetchData(url: string) {
  if (apiCache.has(url)) {
    return apiCache.get(url)
  }

  const data = await fetch(url).then(r => r.json())
  apiCache.set(url, data)
  return data
}
```

### 2. 会话管理

```typescript
const sessions = new LRUCache<string, Session>(10000, 30 * 60 * 1000) // 30 分钟

function getSession(sessionId: string) {
  return sessions.get(sessionId)
}

function createSession(sessionId: string, data: Session) {
  sessions.set(sessionId, data)
}
```

### 3. 计算结果缓存

```typescript
const computeCache = new LRUCache<string, number>(500, 0) // 永不过期

function expensiveCompute(input: string): number {
  const cached = computeCache.get(input)
  if (cached !== undefined) return cached

  const result = /* 复杂计算 */ 42
  computeCache.set(input, result, 0) // 永不过期
  return result
}
```

### 4. 只读查询

```typescript
// 使用 peek 避免更新 LRU 顺序
function checkCache(key: string) {
  const value = cache.peek(key) // 不影响 LRU 顺序
  return value !== undefined
}
```

## 性能特点

- **异步 LRU 更新**：`get` 操作立即返回值，LRU 顺序在微任务中异步更新
- **懒惰过期**：仅在访问时检查过期，无定时器开销
- **零拷贝**：直接使用 Map 的迭代顺序作为 LRU 顺序
- **内联优化**：关键方法可被 V8 引擎内联优化

## 注意事项

1. **过期清理**：过期项在访问时才被清除，不会主动清理
2. **容量限制**：达到容量上限时，自动淘汰最久未使用的项
3. **TTL 精度**：使用毫秒级精度，最小有效 TTL 为 1ms
4. **键类型**：支持任意类型的键，但 `toJSON()` 会将键转换为字符串

## License

MIT
