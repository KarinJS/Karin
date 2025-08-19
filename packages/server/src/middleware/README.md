# 访问频率限制中间件

这是一个基于内存的访问频率限制中间件，用于限制短时间内的访问次数，并对超出限制的IP进行拉黑处理。

## 功能特性

- ✅ **内存存储**：无需依赖外部Redis服务
- ✅ **IP拉黑**：自动将超出限制的IP加入黑名单
- ✅ **白名单支持**：支持配置白名单IP
- ✅ **路径跳过**：支持跳过特定路径的限制
- ✅ **自动清理**：定期清理过期数据，防止内存泄露
- ✅ **实时统计**：提供实时的访问统计信息
- ✅ **灵活配置**：支持多种预设配置和自定义配置

## 使用方式

### 1. 默认配置

```typescript
import { defaultRateLimitMiddleware } from '../middleware'

// 在router中使用（已在项目中配置）
router.use(defaultRateLimitMiddleware)
```

默认配置：

- 时间窗口：60秒
- 最大请求数：100次
- 黑名单TTL：3600秒（1小时）
- 白名单：['127.0.0.1', '::1']
- 跳过路径：['/ping', '/login']

### 2. 预设配置

```typescript
import {
  strictRateLimitMiddleware, // 严格模式
  lenientRateLimitMiddleware, // 宽松模式
  apiIntensiveRateLimitMiddleware, // API密集型
} from '../middleware'

// 使用严格模式（30次/分钟）
router.use(strictRateLimitMiddleware)

// 使用宽松模式（200次/分钟）
router.use(lenientRateLimitMiddleware)

// 使用API密集型（500次/分钟）
router.use(apiIntensiveRateLimitMiddleware)
```

### 3. 自定义配置

```typescript
import { createRateLimitMiddleware } from '../middleware'

const customRateLimit = createRateLimitMiddleware({
  windowMs: 300, // 5分钟时间窗口
  maxRequests: 50, // 最多50次请求
  blacklistTTL: 7200, // 拉黑2小时
  whitelist: ['127.0.0.1', '192.168.1.100'], // 自定义白名单
  skipPaths: ['/ping', '/health', '/metrics'], // 跳过的路径
})

router.use(customRateLimit)
```

## 工具函数

### 黑名单管理

```typescript
import { manualBlacklistIP, removeFromBlacklist, getBlacklistIPs } from '../middleware'

// 手动拉黑IP
manualBlacklistIP('192.168.1.100', 3600) // 拉黑1小时

// 从黑名单移除IP
removeFromBlacklist('192.168.1.100')

// 获取当前黑名单
const blacklistedIPs = getBlacklistIPs()
console.log('黑名单IP列表:', blacklistedIPs)
```

### 请求统计

```typescript
import { getRequestCountStats, resetRequestCount, cleanupExpiredData } from '../middleware'

// 获取请求统计
const stats = getRequestCountStats()
console.log('请求统计:', stats)

// 重置特定IP的请求计数
resetRequestCount('192.168.1.100')

// 手动清理过期数据
cleanupExpiredData()
```

## 响应头

中间件会在响应中添加以下头信息：

- `X-RateLimit-Limit`: 时间窗口内的请求限制
- `X-RateLimit-Remaining`: 剩余可用请求次数
- `X-RateLimit-Reset`: 限制重置时间

## 错误响应

当请求被限制时，会返回以下JSON响应：

```json
{
  "code": 429,
  "message": "请求过于频繁，IP已被拉黑",
  "data": null
}
```

## 自动清理

系统每分钟自动清理一次过期数据：

- 清理过期的请求计数记录
- 清理过期的黑名单记录

这确保了内存使用量不会无限增长。

## 日志记录

中间件会记录以下事件：

- IP被加入黑名单
- IP从黑名单中移除
- 请求频率接近限制（80%以上）
- 错误和异常情况

所有日志都带有 `[RateLimit]` 前缀，便于识别和过滤。
