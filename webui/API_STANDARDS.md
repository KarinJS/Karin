# API Standards / API 对接规范

## 概述

本文档定义了 Karin WebUI 前后端交互的 API 规范。

## 基本约定

### 1. API 基础路径

- **前端开发环境**: `/api` (通过 Vite 代理到后端)
- **生产环境**: 由后端 Express 直接托管
- **后端 API 前缀**: `/api/v1`

### 2. 响应格式

所有 API 响应遵循统一格式：

```typescript
interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  ok: boolean
  /** HTTP 状态码 */
  code: number
  /** 响应数据 */
  data: T | null
  /** 响应消息 */
  message: string
}
```

### 3. HTTP 状态码

| 状态码 | 常量名 | 说明 |
|--------|--------|------|
| 200 | OK | 成功 |
| 400 | BadRequest | 请求参数错误 |
| 401 | Unauthorized | 未授权（未登录） |
| 403 | Forbidden | 禁止访问（无权限） |
| 404 | NotFound | 资源未找到 |
| 405 | MethodNotAllowed | 方法不允许 |
| 413 | PayloadTooLarge | 请求体过大 |
| 419 | AccessTokenExpired | 访问令牌已过期 |
| 420 | RefreshTokenExpired | 刷新令牌已过期 |
| 500 | InternalServerError | 服务器错误 |

---

## API 端点定义

### 配置管理 (Config)

#### 获取权限配置

```
GET /api/v1/config/permissions
```

**响应**:
```typescript
interface PermissionsResponse {
  master: string[]
  admin: string[]
}
```

#### 更新权限配置

```
POST /api/v1/config/permissions
```

**请求体**:
```typescript
interface PermissionsRequest {
  master: string[]
  admin: string[]
}
```

---

#### 获取服务器配置

```
GET /api/v1/config/server
```

**响应**:
```typescript
interface ServerConfigResponse {
  http: {
    port: number
    host: string
    auth_key: string
    username: string
    password: string
  }
  ws_server: {
    enable: boolean
    routes: Record<string, string>
    exclude_routes: string[]
  }
  ffmpeg: {
    ffmpeg_path: string
    ffprobe_path: string
    ffplay_path: string
  }
}
```

#### 更新服务器配置

```
POST /api/v1/config/server
```

**请求体**: 同 `ServerConfigResponse`

---

#### 获取日志配置

```
GET /api/v1/config/logger
```

**响应**:
```typescript
interface LoggerConfigResponse {
  level: string
  days_to_keep: number
  max_log_size: number
  fnc_color: string
}
```

#### 更新日志配置

```
POST /api/v1/config/logger
```

**请求体**: 同 `LoggerConfigResponse`

---

#### 获取 Redis 配置

```
GET /api/v1/config/redis
```

**响应**:
```typescript
interface RedisConfigResponse {
  enable: boolean
  url: string
  username: string
  password: string
  database: number
}
```

#### 更新 Redis 配置

```
POST /api/v1/config/redis
```

**请求体**: 同 `RedisConfigResponse`

---

## 前端实现规范

### 1. API 客户端结构

```
webui/src/api/
├── client.ts          # Axios 实例与拦截器
├── types.ts           # API 类型定义
└── modules/
    ├── config.ts      # 配置相关 API
    ├── stats.ts       # 统计相关 API
    └── logs.ts        # 日志相关 API
```

### 2. 类型定义

所有 API 请求和响应必须有明确的 TypeScript 类型定义，禁止使用 `any`。

### 3. 错误处理

- 使用拦截器统一处理错误
- 401/419/420 错误自动跳转登录页
- 其他错误显示 Toast 提示

### 4. 开发环境代理配置

在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 后端实现规范

### 1. 路由结构

```
packages-core/server/src/
├── app/
│   └── index.ts           # Express 应用
├── routes/
│   ├── index.ts           # 路由注册
│   └── api/
│       └── v1/
│           ├── index.ts   # v1 路由入口
│           └── config.ts  # 配置路由
└── utils/
    └── response.ts        # 响应工具函数
```

### 2. 响应函数使用

```typescript
import { createSuccessResponse, createBadRequestResponse } from '../utils/response'

// 成功响应
createSuccessResponse(res, data, '获取成功')

// 错误响应
createBadRequestResponse(res, '参数错误')
```

### 3. 路由命名规范

- 使用 RESTful 风格
- 资源名使用复数形式
- 使用小写字母和连字符

---

## 版本管理

- 当前版本: `v1`
- API 路径格式: `/api/v{version}/{resource}`
- 破坏性变更需要升级版本号
