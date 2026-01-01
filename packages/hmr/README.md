# @karinjs/hmr

Hot Module Replacement for Karin Dev Packages

## 简介

`@karinjs/hmr` 为 Karin 的 `dev` 类型插件提供热更新支持。它使用 Node.js 内部 ESM 缓存 API 实现真正的模块热替换。

## 安装

```bash
pnpm add @karinjs/hmr
```

## 快速开始

```typescript
import { createDevHMR } from '@karinjs/hmr'

// 创建 HMR 实例
const hmr = createDevHMR({
  paths: ['./plugins/my-dev-plugin'],
  debounce: 100
})

// 启动监听
hmr.start()

// 监听重载事件
hmr.on('reload', (result) => {
  if (result.success) {
    console.log(`✅ Reloaded: ${result.file}`)
    console.log(`   Removed: ${result.removedCount}, Added: ${result.addedCount}`)
  } else {
    console.error(`❌ Failed: ${result.error}`)
  }
})

// 停止监听
await hmr.stop()
```

## API

### createDevHMR(options)

创建 Dev HMR 管理器。

#### 选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `paths` | `string \| string[]` | - | 监听的目录或文件 |
| `cwd` | `string` | `process.cwd()` | 当前工作目录 |
| `debounce` | `number` | `100` | 防抖延迟（毫秒） |
| `ignored` | `ChokidarOptions['ignored']` | - | 忽略规则 |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error' \| 'silent'` | `'info'` | 日志级别 |

#### 方法

- `start()` - 启动热更新监听
- `stop()` - 停止热更新监听
- `reloadFile(file)` - 手动重载单个文件
- `reloadPackage(pkgName)` - 手动重载整个包
- `on(event, listener)` - 监听事件
- `off(event, listener)` - 移除事件监听
- `once(event, listener)` - 一次性事件监听

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `add` | `ReloadResult` | 文件添加 |
| `change` | `ReloadResult` | 文件变更并重载 |
| `unlink` | `ReloadResult` | 文件删除 |
| `reload` | `ReloadResult` | 统一重载事件 |
| `error` | `Error` | 错误 |
| `start` | - | 启动 |
| `stop` | - | 停止 |

### 缓存工具

```typescript
import {
  clearModuleCache,
  clearModuleCaches,
  findDependentModules,
  getCacheStats,
  clearCacheByPrefix
} from '@karinjs/hmr'

// 清理单个模块缓存
clearModuleCache('/path/to/module.ts')

// 批量清理
clearModuleCaches(['/path/to/a.ts', '/path/to/b.ts'])

// 查找依赖模块
const dependents = findDependentModules('/path/to/target.ts')

// 获取缓存统计
const stats = getCacheStats()
console.log(`Cached modules: ${stats.size}`)

// 按前缀清理
clearCacheByPrefix('/path/to/plugins/')
```

### 重载工具

```typescript
import { reloadDevFile, reloadDevPackage } from '@karinjs/hmr'

// 重载单个文件
const result = await reloadDevFile('/path/to/plugin.ts')
if (result.success) {
  console.log(`Removed: ${result.removedCount}, Added: ${result.addedCount}`)
}

// 重载整个包
const pkgResult = await reloadDevPackage('my-dev-plugin')
```

## 工作原理

1. **监听文件变化** - 使用 chokidar 监听指定目录
2. **删除旧插件** - 通过 `store.delByFile()` 删除该文件注册的所有插件
3. **清理 ESM 缓存** - 使用 Node.js 内部 API 清理模块缓存
4. **重新导入** - 使用 `import()` 重新加载模块
5. **自动注册** - 新插件通过 DSL API 自动注册到 store

## 与 apps 类型的区别

| 类型 | HMR 方式 | 说明 |
|------|----------|------|
| `apps` | URL 参数 (`?t=timestamp`) | 内置支持，无需额外包 |
| `dev` | Node ESM 缓存 API | 需要 `@karinjs/hmr` |
| `npm` | 不支持 | 生产环境，无需热更新 |

## 注意事项

1. 仅支持 `dev` 类型插件
2. 需要 Node.js 18+ (ESM 缓存 API)
3. 某些边缘情况可能需要手动重启

## License

MIT
