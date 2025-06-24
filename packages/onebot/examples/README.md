# OneBot 示例代码

本目录包含了几个使用 OneBot 库的简单示例，展示如何创建和使用 OneBot HTTP 客户端和服务器。

## 示例列表

1. **HTTP客户端** (http-client.ts)
   - 演示如何创建HTTP客户端连接到OneBot实现
   - 展示如何注册并处理消息事件

2. **HTTP服务器** (http-server.ts)
   - 演示如何创建HTTP服务器接收OneBot事件
   - 展示如何处理不同类型的事件

3. **消息构建器** (message-builder.ts)
   - 演示如何构建各种不同类型的消息
   - 包含纯文本、图片、@、表情、混合消息等

4. **API调用示例** (api-examples.ts)
   - 演示如何调用各种常用API
   - 获取机器人信息、好友列表、群列表等

## 环境准备

1. 确保安装了 Node.js 16+ 和 pnpm 9+
2. 确保有可用的 OneBot 实现（如 go-cqhttp, cqhttp-mirai 等）

## 运行示例

在项目根目录执行：

```bash
# 编译项目
pnpm build

# 运行HTTP客户端示例
tsx examples/http-client.ts

# 运行HTTP服务器示例
tsx examples/http-server.ts

# 运行消息构建器示例
tsx examples/message-builder.ts

# 运行API调用示例
tsx examples/api-examples.ts
```

## 注意事项

- 请修改示例中的 `self_id`、`httpHost` 和 `accessToken` 为你自己的配置
- 确保你的 OneBot 实现已正确配置并运行
- 这些示例仅展示基本功能，实际应用中可能需要更复杂的错误处理和业务逻辑 