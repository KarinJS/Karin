# 消息事件标准

---

::: warning 温馨提示
由于protobufjs编译后产生的格式并不适用于直接开发，karin封装了消息体标准，并提供适配器接口。

开发者只需要关注karin本身的标准即可。
:::

### 标准属性对象
```js
const message = {
  self_id: 'string', // 机器人的ID，默认为uin
  user_id: 'string', // 用户ID，默认为uin
  group_id: 'string', // 群组ID，仅在群聊中有效，默认为uin
  time: 0, // 消息时间戳
  message_id: 'string', // 消息ID
  message_seq: 'string', // 消息序列号
  raw_message: 'string', // 原始消息文本
  // 从什么地方收到的信息
  contact: {
    // 信息来源，对应：群聊、私聊、频道、临时群聊、陌生人、陌生人群组
    scene: 'group' | 'friend' | 'guild' | 'group_temp' | 'stranger' | 'stranger_group',
    // 场景值对应的ID，群聊则为群号 私聊则为用户uin 频道消息则为频道号
    peer: 'string',
    // 子场景值，群临时聊天则为群号 频道消息则为子频道号 其它情况可能不存在
    sub_peer: 'string'
  },
  // 发送者详细信息
  sender: {
    uid: 'string', // 用户uin，由于为新属性，可能不存在
    uin: 'string', // 用户uin，建议目前使用uin作为唯一标识
    nick: 'string' // 用户昵称，可能不存在
  },
  elements: [], // 消息元素数组，详情见下方
  msg: 'string', // 框架属性，由karin处理后的消息纯文本
  game: 'string', // 框架属性，通过前缀判断是否为游戏指令
  image: [], // 框架属性，图片数组
  at: [], // 框架属性，存放被@的用户uin、uid，如uid不存在则会键入uin
  atBot: false | true, // 框架属性，是否@机器人
  atAll: false | true, // 框架属性，是否@全体成员
  file: {}, // 框架属性，文件对象
  reply_id: 'string' // 框架属性，引用回复消息ID
}

```

### elements

> 对于媒体消息，karin标准为统一使用file属性，不再使用url

```js
const elements = [
  { type: 'text', text: 'Hello' }, // 文本
  { type: 'face', id: 1 }, // 表情
  { type: 'at', uid: '1234567890', uin: '1234567890' }, // @某人
  { type: 'reply', message_id: 'abc1234567890' }, // 引用回复
  { type: 'image', file: 'https://example.com/image.png' }, // 图片
  { type: 'video', file: 'https://example.com/video.mp4' }, // 视频
  { type: 'voice', file: 'https://example.com/voice.mp3' }, // 语音
  // ...其他类型消息
]

```

### 快速回复

> 此外，每个消息事件，karin都会提供一个快速回复接口，开发者可以直接调用接口快速回复消息。

```js
e.reply('Hello') // 回复消息内容
e.reply('Hello', { at: true }) // @消息发送者
e.reply('Hello', { reply: true }) // 引用回复消息本身
e.reply('Hello', { recallMsg: 10 }) // 发送成功后，撤回消息时间，单位秒
e.reply('Hello', { button: false }) // 暂未实现
e.reply('Hello', { retry_count: 1 }) // 重试次数
e.reply('Hello', { at: true, reply: true, recallMsg: 10, button: false, retry_count: 1 })
```


| 参数                | 类型    | 说明                             |
| ------------------- | ------- | -------------------------------- |
| message             | string  | 回复消息内容                     |
| options             | object  | 回复选项,以下均为可选参数        |
| options.at          | boolean | 是否@消息发送者                  |
| options.reply       | boolean | 是否引用回复消息本身             |
| options.recallMsg   | number  | 发送成功后，撤回消息时间，单位秒 |
| options.button      | boolean | 暂未实现                         |
| options.retry_count | number  | 发送失败后，重试次数             |