# 消息相关

> 文档存在一定的滞后性或者错误，如有问题请提交issue~

::: tip 提示
如果你不知道如何使用API，请查看[调用方法](./index.md#调用方法)
:::

[[toc]]

## 发送消息

Api: `SendMessage`

|  请求参数  |                类型                | 必须  |   描述   |
| :--------: | :--------------------------------: | :---: | :------: |
| `contact`  |  [点击跳转](./contact.md#contact)  |  是   | 发送目标 |
| `elements` | [elements](../plugins/elements.md) |  是   | 消息内容 |

::: warning 温馨提示
请各位开发者尽量使用`array`，其他类型的值可能会在未来版本中被废弃
:::

::: code-group

```js [请求示例1]
// 主动发送消息 直接调用Api
import { segment } from '#Karin'

const contact = {
  scene: 'private',
  peer: '123456789',
}

const elements = [
  segment.at(123456789),
  segment.text('Hello World!')
]

await this.e.bot.SendMessage(contact, elements)

```

```js [请求示例2]
// 主动发送消息 调用封装过的Api
import { Bot } from '#Karin'

const self_id = 123456789
const contact = {
  scene: 'private',
  peer: '123456789',
}

// 封装过的支持直接传入字符串 elements
await Bot.sendMsg(self_id, contact, '这只一条主动消息')

```

```js [请求示例3]
// 被动回复消息
import { segment } from '#Karin'

const elements = [
  segment.at(123456789),
  segment.text('Hello World!')
]

// 这里在插件内部，只需要一个参数即可
const res = await this.reply(elements)
```

```js [响应]
// 需要注意，如果发送消息失败，karin会直接抛出一个错误
// 返回的消息ID可能是数字也可能是字符串，如有需要请自行根据适配器判断
res = { message_id: 'a1234567890' }
```

:::

## 撤回消息

Api: `RecallMessage`

|   请求参数   |               类型               | 必须  |   描述   |
| :----------: | :------------------------------: | :---: | :------: |
|  `contact`   | [点击跳转](./contact.md#contact) |  是   | 发送目标 |
| `message_id` |              string              |  是   |  消息ID  |

::: code-group

```js [请求示例]
import { Bot } from '#Karin'

const self_id = 123456789
const contact = {
  scene: 'private',
  peer: '123456789',
}

const message_id = 'a1234567890'

// 获取机器人实例
const bot = Bot.getBot(self_id)
const res = await bot.RecallMessage(contact, message_id)

```

```js [响应]
// 此api标准是没有返回值的，如果撤回消息失败，karin会直接抛出一个错误
res = {}
```

## 通过`message_id`获取消息

Api: `GetMessage`

|   请求参数   |               类型               | 必须  |   描述   |
| :----------: | :------------------------------: | :---: | :------: |
|  `contact`   | [点击跳转](./contact.md#contact) |  是   | 发送目标 |
| `message_id` |              string              |  是   |  消息ID  |

::: code-group

```js [请求示例]
import { Bot } from '#Karin'

const self_id = 123456789
const contact = {
  scene: 'private',
  peer: '123456789',
}

const message_id = 'a1234567890'

// 获取机器人实例
const bot = Bot.getBot(self_id)
const res = await bot.GetMessage(contact, message_id)

```

```js [响应]
res = {
  // 消息发送时间
  time: 1631234567890,
  // 消息ID
  message_id: 'a1234567890',
  // 消息序号 这个字段一般没有。
  message_seq: 1234567890,
  contact: {
    scene: 'private',
    peer: '123456789',
  },
  sender: {
    uid: '123456789',
    // 有可能不存在
    uin: '123456789',
    // 有可能不存在
    nick: '昵称',
    // 群聊时有效 有可能不存在 可选值: unknown, member, admin, owner
    role: 'owner',
  },
  elements: [
    // ... 参考 开发指南-elements
  ],
}

```

## 通过`message_seq`获取消息

Api: `GetMessageBySeq`

此Api是通过`message_seq`获取消息，与`GetMessage`基本相同，这里不再赘述

