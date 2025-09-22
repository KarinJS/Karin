---
mode: agent
---

# Karin Plugin 开发提示文件

## 开发环境要求

- **Node.js**: 22+ 版本
- **包管理器**: pnpm 9
- **语法**: ESM + TypeScript
- **构建命令**: `pnpm run build`
- **代码检查**: ESLint (保存文件自动触发，格式问题可忽略)

## 代码规范

### 1. 函数风格
- **优先使用箭头函数**，除非需要 `this` 绑定或构造函数
- 示例：
  ```typescript
  /** 处理用户消息 */
  const handleMessage = (msg: string): string => {
    return msg.trim()
  }
  ```

### 2. 注释规范
- **每个函数都必须编写 TSDoc 注释**
- **每个关键的地方调用都需要编写 TSDoc**
- **单行注释格式**: `/** 注释内容 */`

#### 函数注释示例：
```typescript
/**
 * 解析用户输入的命令
 * @param input - 用户输入的原始字符串
 * @param prefix - 命令前缀
 * @returns 解析后的命令对象
 */
const parseCommand = (input: string, prefix: string): CommandResult => {
  /** 移除命令前缀 */
  const command = input.replace(prefix, '').trim()

  /** 分割命令和参数 */
  const [cmd, ...args] = command.split(' ')

  return { command: cmd, args }
}
```

#### 关键调用注释示例：
```typescript
const processMessage = async (msg: Message): Promise<void> => {
  /** 验证消息格式 */
  if (!validateMessage(msg)) {
    return
  }

  /** 解析命令内容 */
  const command = parseCommand(msg.text, '/')

  /** 执行命令处理器 */
  await executeCommand(command)
}
```

### 3. TypeScript 要求
- 使用严格的类型检查
- 优先使用接口定义复杂类型
- 合理使用泛型提高代码复用性

### 4. 文件结构要求
- 使用 ESM 模块语法 (`import`/`export`)
- 每个文件都应该有明确的导出
- 优先使用命名导出，避免默认导出混淆

## 开发工作流

1. **开发**: 直接修改 TypeScript 源码
2. **构建**: 运行 `pnpm run build` 编译代码
3. **检查**: ESLint 会在保存时自动检查，格式问题可暂时忽略
4. **测试**: 确保功能正常工作

## 示例代码结构

```typescript
import type { PluginConfig, MessageHandler } from '../types'

/**
 * 插件配置接口
 */
interface Config {
  name: string
  version: string
  enabled: boolean
}

/**
 * 创建消息处理器
 * @param config - 插件配置
 * @returns 消息处理函数
 */
export const createMessageHandler = (config: Config): MessageHandler => {
  return async (message) => {
    /** 检查插件是否启用 */
    if (!config.enabled) {
      return
    }

    /** 处理消息逻辑 */
    await processMessage(message)
  }
}

/**
 * 处理消息的核心逻辑
 * @param message - 接收到的消息
 */
const processMessage = async (message: any): Promise<void> => {
  /** 消息预处理 */
  const processed = preprocessMessage(message)

  /** 执行业务逻辑 */
  await handleBusinessLogic(processed)
}
```

## 注意事项

- 保持代码简洁和可读性
- 重视类型安全，避免使用 `any`
- 合理使用异步编程模式
- 及时更新文档和注释
- 遵循现有代码库的风格约定
