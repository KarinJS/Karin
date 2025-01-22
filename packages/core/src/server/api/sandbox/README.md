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
   "id": "机器人id",
   "name": "机器人名称",
   "avatar": "机器人头像"
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
  "data": { "url": "ws://localhost:7777/sandbox" }
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
    "id": "sandbox",
    "name": "Bot名称",
    "avatar": "头像URL"
  }
}
```

### 更新Bot信息

- 路径: `/sandbox/self/update`
- 方法: `POST`
- 请求体:

```json
{
  "name": "新名称",
  "avatar": "新头像URL"
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
  "name": "好友名称",
  "avatar": "头像URL"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "userId": "好友ID",
    "name": "好友名称", 
    "avatar": "头像URL"
  }
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
      "name": "好友名称",
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

- 响应:

```json
{
  "code": 200,
  "data": "成功"
}
```

### 更新好友信息

- 路径: `/sandbox/friend/update`
- 方法: `POST`
- 请求体:

```json
{
  "id": "好友ID",
  "name": "新名称",
  "avatar": "新头像URL"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "userId": "好友ID",
    "name": "更新后的名称",
    "avatar": "更新后的头像URL"
  }
}
```

## 群组相关

### 创建群组

- 路径: `/sandbox/group/create`
- 方法: `POST`
- 请求体:

```json
{
  "id": "群ID",
  "name": "群名称",
  "avatar": "群头像URL"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "groupId": "群ID",
    "name": "群名称",
    "avatar": "群头像URL"
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

- 响应:

```json
{
  "code": 200,
  "data": "成功"
}
```

### 更新群组信息

- 路径: `/sandbox/group/update`
- 方法: `POST`
- 请求体:

```json
{
  "id": "群ID",
  "name": "新群名称",
  "avatar": "新群头像URL"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "groupId": "群ID",
    "name": "更新后的群名称",
    "avatar": "更新后的群头像URL"
  }
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
      "name": "成员名称",
      "avatar": "成员头像URL",
      "role": "member"
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
  "name": "成员名称",
  "avatar": "成员头像URL",
  "role": "member"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "groupId": "群ID",
    "userId": "成员ID", 
    "name": "成员名称",
    "avatar": "成员头像URL",
    "role": "member"
  }
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

- 响应:

```json
{
  "code": 200,
  "data": "成功"
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
  "name": "新名称",
  "avatar": "新头像URL",
  "role": "member"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "groupId": "群ID",
    "userId": "成员ID",
    "name": "更新后的名称",
    "avatar": "更新后的头像URL",
    "role": "更新后的角色"
  }
}
```

## 消息相关

### 创建消息索引

- 路径: `/sandbox/msg/create`
- 方法: `POST`
- 请求体:

```json
{
  "type": "friend",
  "targetId": "目标ID"
}
```

```json
{
  "type": "group",
  "targetId": "目标ID"
}
```

- 响应:

```json
{
  "code": 200,
  "data": {
    "seq": 1,
    "time": 1716489600000,
    "messageId": "friend:123456:1716489600000"
  }
}
```

### 消息上报

> `seq`、`messageId`、`time` 由 `createMsgSeq` 接口生成

- 路径: `/sandbox/webhook`
- 方法: `POST`
- 请求体:

```json
{
  "type": "friend",
  "seq": 1,
  "messageId": "消息ID",
  "time": 1716489600000,
  "sender": {
    "id": "发送者ID",
    "name": "发送者名称",
    "role": "member"
  },
  "groupId": "群ID",
  "groupName": "群名称",
  "elements": [
    {
      "type": "text",
      "text": "消息内容"
    }
  ]
}
```

```json
{
  "type": "friend",
  "seq": 1,
  "messageId": "消息ID",
  "time": 1716489600000,
  "sender": {
    "id": "发送者ID",
    "name": "发送者名称",
    "role": "member"
  },
  "elements": [
    {
      "type": "text",
      "text": "消息内容"
    }
  ]
}
```

- 响应:

```json
{
  "code": 200,
  "data": "成功"
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
  "type": "friend",
  "targetId": "目标ID",
  "count": 10
}
```

- 响应:

```json
{
  "code": 200,
  "data": [
    {
      "type": "friend",
      "targetId": "目标ID",
      "seq": 1,
      "messageId": "消息ID",
      "time": 1716489600000,
      "status": "normal",
      "elements": [
        {
          "type": "text",
          "text": "消息内容"
        }
      ]
    }
  ]
}
```
