# @karinjs/onebot

> **说明：** 本文档由 Claude 4.0 Sonnet 模型生成，如出现错误或与实际代码不符，请以实际代码为准。

一个强大的 OneBot 协议客户端库，支持 WebSocket 和 HTTP 连接模式，兼容多种 OneBot 实现（NapCat、Lagrange、GoCQ 等）。

## 特性

- 🚀 支持 WebSocket 客户端/服务端和 HTTP 客户端/服务端模式
- 🎯 完整的 TypeScript 类型支持
- 📦 支持所有标准 OneBot API 和扩展 API
- 🔄 自动重连和错误处理
- 📝 丰富的事件系统
- 🛠 支持多种消息类型（文本、图片、语音、视频等）
- 🌐 兼容 NapCat、Lagrange、GoCQ 等多种 OneBot 实现

## 安装

```bash
# 使用 pnpm
pnpm add @karinjs/onebot

# 使用 npm
npm install @karinjs/onebot

# 使用 yarn
yarn add @karinjs/onebot
```

## 快速开始

### WebSocket 客户端模式

```typescript
import { OneBotWsClient } from '@karinjs/onebot'

const client = new OneBotWsClient({
  url: 'ws://localhost:8080',
  accessToken: 'your_access_token', // 可选
  timeout: 120000 // 可选，默认 120 秒
})

// 初始化客户端
await client.init()

// 监听连接事件
client.on('open', () => {
  console.log('WebSocket 连接已建立')
})

// 监听消息事件
client.on('message', async (event) => {
  console.log('收到消息:', event)

  // 回复消息
  if (event.message_type === 'private') {
    await client.sendPrivateMsg(event.user_id, [
      { type: 'text', data: { text: '你好！' } }
    ])
  } else if (event.message_type === 'group') {
    await client.sendGroupMsg(event.group_id, [
      { type: 'text', data: { text: '群聊消息收到！' } }
    ])
  }
})

// 监听错误事件
client.on('error', (error) => {
  console.error('发生错误:', error)
})

// 监听连接关闭
client.on('close', (code, reason, error) => {
  console.log('连接关闭:', code, reason.toString())
  if (error) console.error('关闭错误:', error)
})
```

### WebSocket 服务端模式

```typescript
import { OneBotWsServer } from '@karinjs/onebot'
import WebSocket, { WebSocketServer } from 'ws'

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', async (socket, request) => {
  // 为每个连接创建 OneBotWsServer 实例
  const server = new OneBotWsServer(socket, request, {
    accessToken: 'your_access_token', // 可选
    timeout: 120000 // 可选
  })

  // 初始化服务端
  await server.init()

  // 监听消息事件
  server.on('message', async (event) => {
    console.log('收到消息:', event)

    // 发送群消息
    await server.sendGroupMsg(123456789, [
      { type: 'text', data: { text: '服务端回复' } }
    ])
  })

  // 监听错误事件
  server.on('error', (error) => {
    console.error('连接错误:', error)
  })

  // 监听连接关闭
  server.on('close', (code, reason) => {
    console.log('客户端断开连接:', code, reason.toString())
  })
})

console.log('WebSocket 服务器启动在端口 8080')
```

### HTTP 客户端模式

```typescript
import { OneBotHttpClient } from '@karinjs/onebot'

const client = new OneBotHttpClient({
  httpHost: 'http://localhost:5700',
  accessToken: 'your_access_token', // 可选
  timeout: 60000, // 可选
  heartbeat: 5000, // 可选，心跳间隔
  retryAttempts: 3 // 可选，重试次数
})

// 初始化客户端（会进行心跳检查）
await client.init()

// 检查服务状态
if (client.isServiceAvailable()) {
  // 发送私聊消息
  try {
    const result = await client.sendPrivateMsg(123456789, [
      { type: 'text', data: { text: 'Hello World!' } }
    ])
    console.log('消息发送成功，消息ID:', result.message_id)
  } catch (error) {
    console.error('发送失败:', error)
  }

  // 获取群列表
  const groups = await client.getGroupList()
  console.log('群列表:', groups)
}

// 监听连接事件
client.on('open', () => {
  console.log('HTTP 客户端初始化成功')
})

// 监听错误事件
client.on('error', (error) => {
  console.error('HTTP 客户端错误:', error)
})
```

### HTTP 服务端模式

```typescript
import { OneBotHttpServer } from '@karinjs/onebot'
import express from 'express'

const server = new OneBotHttpServer({
  accessToken: 'your_access_token', // 可选
  timeout: 60000 // 可选
})

// 初始化服务端
await server.init()

// 创建 Express 应用
const app = express()
app.use(express.json())
app.use(express.text())

// 处理事件上报
app.post('/onebot', (req, res) => {
  const result = server.handleEvent(req.body, req.headers)

  if (result.success) {
    res.status(200).json({ status: 'ok' })
  } else {
    console.error('处理事件失败:', result.error)
    res.status(400).json({ status: 'failed', error: result.error })
  }
})

// 监听上报事件
server.on('message', async (event) => {
  console.log('收到消息上报:', event)
})

server.on('notice', async (event) => {
  console.log('收到通知上报:', event)
})

server.on('request', async (event) => {
  console.log('收到请求上报:', event)
})

// 启动服务器
app.listen(5700, () => {
  console.log('HTTP 服务器启动在端口 5700')
})
```

## 消息类型

### 文本消息

```typescript
const textMessage = [
  { type: 'text', data: { text: '这是一条文本消息' } }
]
```

### 图片消息

```typescript
const imageMessage = [
  { type: 'image', data: { file: 'base64://...' } }, // Base64 编码
  { type: 'image', data: { file: 'file:///path/to/image.jpg' } }, // 本地文件
  { type: 'image', data: { file: 'https://example.com/image.jpg' } } // 网络图片
]
```

### 语音消息

```typescript
const recordMessage = [
  { type: 'record', data: { file: 'base64://...' } }
]
```

### 视频消息

```typescript
const videoMessage = [
  { type: 'video', data: { file: 'file:///path/to/video.mp4' } }
]
```

### At 消息

```typescript
const atMessage = [
  { type: 'at', data: { qq: '123456789' } }, // @某人
  { type: 'at', data: { qq: 'all' } }, // @全体成员
  { type: 'text', data: { text: ' 你好' } }
]
```

### 回复消息

```typescript
const replyMessage = [
  { type: 'reply', data: { id: '12345' } }, // 回复消息ID
  { type: 'text', data: { text: '这是回复内容' } }
]
```

### 合并转发消息

```typescript
import { NodeMessage } from '@karinjs/onebot'

const forwardMessages: NodeMessage[] = [
  {
    type: 'node',
    data: {
      name: '发送者1',
      uin: 123456789,
      content: [{ type: 'text', data: { text: '消息1' } }]
    }
  },
  {
    type: 'node',
    data: {
      name: '发送者2',
      uin: 987654321,
      content: [{ type: 'text', data: { text: '消息2' } }]
    }
  }
]

await client.sendGroupForwardMsg(groupId, forwardMessages)
```

## API 使用示例

### 好友管理

```typescript
// 获取好友列表
const friends = await client.getFriendList()

// 获取陌生人信息
const stranger = await client.getStrangerInfo(123456789)

// 处理加好友请求
await client.setFriendAddRequest('flag_string', true, '同意添加')

// 删除好友
await client.deleteFriend(123456789)

// 发送好友赞
await client.sendLike(123456789, 10)
```

### 群组管理

```typescript
// 获取群列表
const groups = await client.getGroupList()

// 获取群信息
const groupInfo = await client.getGroupInfo(123456789)

// 获取群成员列表
const members = await client.getGroupMemberList(123456789)

// 获取群成员信息
const memberInfo = await client.getGroupMemberInfo(123456789, 987654321)

// 踢出群成员
await client.setGroupKick(123456789, 987654321, true)

// 禁言群成员
await client.setGroupBan(123456789, 987654321, 600) // 禁言10分钟

// 解除禁言
await client.setGroupBan(123456789, 987654321, 0)

// 设置管理员
await client.setGroupAdmin(123456789, 987654321, true)

// 设置群名片
await client.setGroupCard(123456789, 987654321, '新名片')

// 设置群名
await client.setGroupName(123456789, '新群名')

// 退出群聊
await client.setGroupLeave(123456789)
```

### 文件管理

```typescript
// 上传群文件
await client.uploadGroupFile(123456789, '/path/to/file.txt', '文件名.txt')

// 获取群文件列表
const files = await client.getGroupRootFiles(123456789)

// 获取文件下载链接
const fileUrl = await client.getGroupFileUrl(123456789, 'file_id')

// 删除群文件
await client.deleteGroupFile(123456789, 'file_id', 100)
```

### 消息管理

```typescript
// 撤回消息
await client.deleteMsg(messageId)

// 获取消息详情
const messageInfo = await client.getMsg(messageId)

// 获取群消息历史
const history = await client.getGroupMsgHistory(123456789, 100, 20)

// 设置精华消息
await client.setEssenceMsg(messageId)

// 获取精华消息列表
const essenceList = await client.getEssenceMsgList(123456789)
```

## 事件监听

```typescript
// 监听所有事件
client.on('event', (event) => {
  console.log('收到事件:', event)
})

// 监听私聊消息
client.on('message', (event) => {
  if (event.message_type === 'private') {
    console.log('收到私聊消息:', event)
  }
})

// 监听群消息
client.on('message', (event) => {
  if (event.message_type === 'group') {
    console.log('收到群消息:', event)
  }
})

// 监听通知事件
client.on('notice', (event) => {
  console.log('收到通知:', event)
})

// 监听请求事件
client.on('request', (event) => {
  console.log('收到请求:', event)
})

// 监听元事件
client.on('metaEvent', (event) => {
  console.log('收到元事件:', event)
})

// 监听连接状态
client.on('open', () => {
  console.log('连接已建立')
})

client.on('close', (code, reason, error) => {
  console.log('连接已断开', code, reason.toString())
  if (error) console.error('断开错误:', error)
})

client.on('error', (error) => {
  console.error('连接错误:', error)
})
```

## 扩展 API

### NapCat 扩展

```typescript
// 标记消息为已读
await client.nc_markPrivateMsgAsRead(123456789, messageId)
await client.nc_markGroupMsgAsRead(123456789, messageId)

// 获取好友分类
const friendsWithCategory = await client.nc_getFriendsWithCategory()

// 设置好友备注
await client.nc_setFriendRemark(123456789, '新备注')

// 群内戳一戳
await client.nc_groupPoke(123456789, 987654321)

// 获取群详细信息
const groupDetail = await client.nc_getGroupDetailInfo(123456789)
```

### Lagrange 扩展

```typescript
// 加入群表情接龙
await client.lgl_joinGroupEmojiChain(123456789, messageId, 1)

// 设置群机器人状态
await client.lgl_setGroupBotStatus(123456789, 'normal')

// 获取好友消息历史
const friendHistory = await client.lgl_getFriendMsgHistory(123456789, messageId, 20)
```

## 错误处理

```typescript
try {
  await client.sendGroupMsg(123456789, [
    { type: 'text', data: { text: 'Hello' } }
  ])
} catch (error) {
  if (error.message.includes('群不存在')) {
    console.log('群聊不存在')
  } else if (error.message.includes('权限不足')) {
    console.log('没有发送权限')
  } else {
    console.error('发送失败:', error.message)
  }
}
```

## 配置选项

### WebSocket 客户端配置

```typescript
interface OneBotWsClientOptions {
  url: string                    // WebSocket 服务器地址
  accessToken?: string          // 访问令牌
  timeout?: number              // 超时时间（毫秒）
  headers?: Record<string, string> // 自定义请求头
}
```

### WebSocket 服务端配置

```typescript
interface OneBotWsServerOptions {
  accessToken?: string          // 访问令牌
  timeout?: number             // 超时时间（毫秒）
}
```

### HTTP 客户端配置

```typescript
interface OneBotHttpClientOptions {
  httpHost: string              // HTTP API 地址
  accessToken?: string          // 访问令牌
  timeout?: number             // 请求超时时间（毫秒）
  heartbeat?: number           // 心跳间隔（毫秒）
  retryAttempts?: number       // API 重试次数
  headers?: Record<string, string> // 自定义请求头
}
```

### HTTP 服务端配置

```typescript
interface OneBotHttpServerOptions {
  accessToken?: string         // 访问令牌（用于签名验证）
  timeout?: number            // 超时时间（毫秒）
}
```

## 类型定义

```typescript
import type {
  OneBotCore,
  OneBotEvent,
  OneBotMessage,
  OneBotMessageEvent,
  OneBotNoticeEvent,
  OneBotRequestEvent,
  OneBotApi
} from '@karinjs/onebot'

// 消息类型
type MessageSegment = {
  type: string
  data: Record<string, any>
}

// 事件类型
type EventHandler<T = any> = (event: T) => void | Promise<void>
```

## 最佳实践

### 1. WebSocket 客户端重连

```typescript
const client = new OneBotWsClient({
  url: 'ws://localhost:8080',
  accessToken: 'your_token'
})

// 监听连接关闭，实现自动重连
client.on('close', async (code, reason, error) => {
  console.log('连接断开，正在尝试重连...', code)

  // 等待 5 秒后重连
  setTimeout(async () => {
    try {
      const success = await client.reconnect()
      if (success) {
        console.log('重连成功')
        await client.init()
      } else {
        console.log('重连失败')
      }
    } catch (error) {
      console.error('重连错误:', error)
    }
  }, 5000)
})

client.on('error', (error) => {
  console.error('连接错误:', error.message)
})
```

### 2. 消息去重

```typescript
const processedMessages = new Set()

client.on('message', (event) => {
  // 使用消息ID去重
  if (processedMessages.has(event.message_id)) {
    return
  }
  processedMessages.add(event.message_id)

  // 处理消息逻辑
  handleMessage(event)
})
```

### 3. 异步处理

```typescript
client.on('message', async (event) => {
  try {
    // 异步处理消息
    await processMessage(event)
  } catch (error) {
    console.error('处理消息失败:', error)
  }
})

async function processMessage(event) {
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000))

  await client.sendPrivateMsg(event.user_id, [
    { type: 'text', data: { text: '处理完成' } }
  ])
}
```

## 许可证

MIT License
