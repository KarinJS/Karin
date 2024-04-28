# 消息事件标准

---

::: warning 温馨提示
由于protobufjs编译后产生的格式并不适用于直接开发，karin封装了消息体标准，并提供适配器接口。

开发者只需要关注karin本身的标准即可。
:::

[[toc]]

## 标准属性对象

> 以下，是一个标准的适配器应该遵循的属性对象

```js
const e = {
  self_id: 'string', // 机器人的ID，默认为uin
  user_id: 'string', // 用户ID，默认为uin
  group_id: 'string', // 群组ID，仅在群聊中有效，默认为uin
  time: 0, // 消息时间戳
  message_id: 'string', // 消息ID
  message_seq: 'string', // 消息序列号 推荐使用message_id，某些场景可能无法提供
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
    nick: 'string', // 用户昵称，可能不存在
    role: 'string', // 用户角色，可能不存在 目前暂未实现
  },
  elements: [], // 消息元素数组 见#elements
  replyCallback(elements, retry_count) // 回复函数，这个方法不应该由开发者调用
}

```

## karin拓展字段

karin在标准字段之外，会对消息事件进行拓展，以便开发者更方便的使用。

```js
const e = {
// ...
  bot(), // 适配器对象
  msg: 'string', // 由karin处理后的消息纯文本
  game: 'string', // 通过前缀判断是否为游戏指令
  image: [], // 图片数组
  at: [], // 存放被@的用户uin、uid，如uid不存在则会键入uin
  atBot: false | true, // 是否@机器人
  atAll: false | true, // 是否@全体成员
  file: {}, // 文件对象
  reply_id: 'string', // 引用回复消息ID
  isAdmin: false | true, // 是否为机器人管理员
  isMaster : false | true, // 是否为机器人主人
  isPrivate: false | true, // 是否为私聊消息
  isGroup: false | true, // 是否为群聊消息
  logText: 'string', // 日志用户字符串
  logFnc: 'string', // 日志函数字符串
  store: new Map(), // 开发者可以存放自定义数据
  reply(elements, options) // 快速回复接口
}
```

## elements

见 [element](../utils/segment.md)

## replyCallback

> 此方法需要由适配器实现，开发者不应该调用此方法。

```js
/**
 * @callback replyCallback
 * @param {Array<KarinElement>} elements - 发送的消息元素 只能是数组
 * @param {number} retry_count - 重试次数
 * @returns {{ message_id?: string }}
 */
e.replyCallback = (elements, retry_count) => {
  // 适配器实现
}

```

## 快速回复

> 此外，每个消息事件，karin都会提供一个快速回复接口，开发者可以直接调用接口快速回复消息。

```js
/**
 * @callback quickReplyCallback
 * @param {string|KarinElement|Array<KarinElement>} elements - 发送的消息
 * @param {object} [options] - 回复数据
 * @param {boolean} [options.at] - 是否at用户
 * @param {boolean} [options.reply] - 是否引用回复
 * @param {number} [options.recallMsg] - 群聊是否撤回消息，0-120秒，0不撤回
 * @param {boolean} [options.button] - 是否使用按钮
 * @param {number} [options.retry_count] - 重试次数
 * @returns {{ message_id?: string }}
 */
e.reply = (elements, options) => {
  // 这部分由karin实现，开发者只需要调用即可
}

```

| 参数                | 类型    | 说明                             |
| ------------------- | ------- | -------------------------------- |
| elements            | string  | 回复消息内容                     |
| options             | object  | 回复选项,以下均为可选参数        |
| options.at          | boolean | 是否@消息发送者                  |
| options.reply       | boolean | 是否引用回复消息本身             |
| options.recallMsg   | number  | 发送成功后，撤回消息时间，单位秒 |
| options.button      | boolean | 暂未实现                         |
| options.retry_count | number  | 发送失败后，重试次数             |

## bot

> `e.bot`为上报事件bot的的适配器对象，开发者可以通过此对象调用Api接口

```js
// 获取头像
const avatar = await e.bot.getAvatarUrl('uid', 100)
console.log(avatar) // https://q1.qlogo.cn/g?b=qq&s=100&nk=uid
```

更多api接口请查看 [Api](../api/index.md)

## 流程

> 大概流程，待补充更详细的...

![流程](./message.svg)
