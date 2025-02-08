# Sandbox API 文档

所有API路径前缀为: `/api/v1`

## 对接流程

1. 前端创建一个ws连接: `ws://localhost:7777/sandbox` 可以通过 [获取沙盒连接地址](#获取沙盒连接地址) 获取地址
2. 等待后端推送一个初始化完成事件 结构为 [初始化事件结构](#初始化事件结构)
3. 获取好友列表、群列表、群成员列表
4. 调用 [消息上报](#消息上报) 接口上报消息事件

### 初始化事件结构

```json
{
  "action": "init",
  "param": {
    "userId": "机器人id",
    "nick": "机器人名称",
    "sex": "性别",
    "avatar": "机器人头像",
    "sign": "签名",
    "status": "在线状态"
  }
}
```

### 获取沙盒连接地址

- 路径: `/sandbox/url`
- 方法: `POST`
- 响应:

```json
{
  "code": 200,
  "data": { 
    "url": "ws://localhost:7777/sandbox",
    "authKey": "认证密钥"
  }
}
```

## Bot相关

### 获取Bot信息

- 路径: `/sandbox/self`
- 方法: `POST`
- 响应:

```json
{
  "code": 200,
  "data": {
    "userId": "sandbox",
    "nick": "Bot名称",
    "sex": "性别",
    "avatar": "头像URL",
    "sign": "签名",
    "status": "在线状态"
  }
}
```

### 更新Bot信息

- 路径: `/sandbox/self/update`
- 方法: `POST`
- 请求体:

```json
{
  "nick": "新名称",
  "avatar": "新头像URL",
  "sex": "性别",
  "sign": "新签名",
  "status": "新状态"
}
```

## 好友相关

### 创建好友

- 路径: `/sandbox/friend/create`
- 方法: `POST`
- 请求体:

```json
{
  "id": "好友ID",
  "nick": "好友名称",
  "avatar": "头像URL",
  "sex": "性别"
}
```

### 获取好友列表

- 路径: `/sandbox/friend/list`
- 方法: `POST`
- 响应:

```json
{
  "code": 200,
  "data": [
    {
      "userId": "好友ID",
      "nick": "好友名称",
      "sex": "性别",
      "avatar": "头像URL"
    }
  ]
}
```

### 删除好友

- 路径: `/sandbox/friend/delete`
- 方法: `POST`
- 请求体:

```json
{
  "id": "好友ID"
}
```

### 更新好友信息

- 路径: `/sandbox/friend/update`
- 方法: `POST`
- 请求体:

```json
{
  "userId": "好友ID",
  "nick": "新名称",
  "avatar": "新头像URL",
  "sex": "性别"
}
```

## 群组相关

### 创建群组

- 路径: `/sandbox/group/create`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID",
  "name": "群名称",
  "avatar": "群头像URL",
  "member": {
    "userId": "成员ID",
    "name": "成员名称",
    "avatar": "成员头像",
    "sex": "性别",
    "role": "成员角色",
    "card": "群名片",
    "title": "群头衔"
  }
}
```

### 获取群组列表

- 路径: `/sandbox/group/list`
- 方法: `POST`
- 响应:

```json
{
  "code": 200,
  "data": [
    {
      "groupId": "群ID",
      "name": "群名称",
      "avatar": "群头像URL"
    }
  ]
}
```

### 删除群组

- 路径: `/sandbox/group/delete`
- 方法: `POST`
- 请求体:

```json
{
  "id": "群ID"
}
```

### 更新群组信息

- 路径: `/sandbox/group/update`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID",
  "name": "新群名称",
  "avatar": "新群头像URL"
}
```

## 群成员相关

### 获取群成员列表

- 路径: `/sandbox/group/member/list`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID"
}
```

- 响应:

```json
{
  "code": 200,
  "data": [
    {
      "groupId": "群ID",
      "userId": "成员ID",
      "role": "成员角色",
      "joinTime": "加入时间",
      "lastSpeakTime": "最后发言时间",
      "muteTime": "禁言时间",
      "card": "群名片",
      "title": "群头衔",
      "nick": "昵称",
      "sex": "性别",
      "avatar": "头像URL"
    }
  ]
}
```

### 创建群成员

- 路径: `/sandbox/group/member/create`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID",
  "userId": "成员ID",
  "role": "成员角色",
  "card": "群名片",
  "title": "群头衔",
  "name": "成员名称",
  "avatar": "成员头像",
  "sex": "性别"
}
```

### 删除群成员

- 路径: `/sandbox/group/member/delete`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID",
  "userId": "成员ID"
}
```

### 更新群成员信息

- 路径: `/sandbox/group/member/update`
- 方法: `POST`
- 请求体:

```json
{
  "groupId": "群ID",
  "userId": "成员ID",
  "role": "新角色",
  "card": "新群名片",
  "title": "新群头衔"
}
```

## 消息相关

### 消息上报

- 路径: `/sandbox/webhook`
- 方法: `POST`
- 请求体:

好友消息:

```json
{
  "type": "friend",
  "event": "message",
  "subEvent": "friend",
  "contact": {
    "scene": "friend",
    "peer": "好友ID",
    "name": "好友名称"
  },
  "sender": {
    "userId": "发送者ID",
    "nick": "发送者昵称",
    "name": "发送者名称",
    "sex": "性别"
  },
  "elements": [
    {
      "type": "text",
      "text": "消息内容"
    }
  ]
}
```

群消息:

```json
{
  "type": "group",
  "event": "message",
  "subEvent": "group",
  "contact": {
    "scene": "group",
    "peer": "群ID",
    "name": "群名称"
  },
  "sender": {
    "userId": "发送者ID",
    "nick": "发送者昵称",
    "name": "发送者名称",
    "sex": "性别",
    "role": "角色",
    "card": "群名片",
    "title": "群头衔"
  },
  "elements": [
    {
      "type": "text",
      "text": "消息内容"
    }
  ]
}
```

### 撤回消息

- 路径: `/sandbox/msg/recall`
- 方法: `POST`
- 请求体:

```json
{
  "messageId": "消息ID"
}
```

### 获取消息列表

- 路径: `/sandbox/msg/list`
- 方法: `POST`
- 请求体:

```json
{
  "type": "friend|group",
  "targetId": "目标ID",
  "count": "获取数量"
}
```

- 响应:

```json
{
  "code": 200,
  "data": [
    {
      "messageId": "消息ID",
      "messageSeq": "消息序号",
      "time": "消息时间",
      "elements": "消息内容",
      "rawEvent": "原始事件",
      "contact": "来源信息",
      "sender": "发送者信息"
    }
  ]
}
```

## ws push事件

```ts
import type { Elements } from '../segment'

export interface Sandbox {
  sendMsg: {
    /** 消息类型 */
    type: 'friend' | 'group'
    /** 目标id */
    targetId: string
    /** 消息段 */
    elements: Elements[]
    /** 消息索引 */
    seq: number
    /** 消息id */
    messageId: string
    /** 消息时间 */
    time: number
  },
  /** 撤回消息 */
  recallMsg: {
    /** 消息id */
    messageId: string
  },
  /** 初始化完成 */
  init: {
    /** 机器人id */
    id: string
    /** 机器人名称 */
    name: string
    /** 机器人头像 */
    avatar: string
  }
}

```
