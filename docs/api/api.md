# 标准api

[[toc]]

## 先决条件

> 下方展示均为 `api` `参数` `返回值` 的展示，具体使用方法请参考下方的示例代码

被动事件调用: `e.bot`

```JavaScript{3}
import karin from 'node-karin'
export const test = karin.command(/^test$/, async (e) => {
    const data = e.bot.<方法名>(参数1, 参数2, ...) // [!code warning]
    console.log(data)
    return true
})

```

主动调用: `karin.getBot`

```JavaScript{5}
import karin from 'node-karin'

const self_id = '1234567890'
const Bot = karin.getBot(self_id)
const data = Bot.<方法名>(参数1, 参数2, ...) // [!code warning]
console.log(data)

```

## 打印Bot专属日志

> 方法名: `logger`  
> 描述: `打印带有Bot前缀带有颜色日志`  
> 参数: `level` `...args`  
> 返回值: `void`

| 参数名称  |  类型  |                                参数要求                                 |   备注   |
| :-------: | :----: | :---------------------------------------------------------------------: | :------: |
|  `level`  | string | `all` `trace` `debug` `mark` `info` `mark` `warn` `error` `fatal` `off` | 日志等级 |
| `...args` | any[]  |                                日志内容                                 | 日志内容 |

使用示例:

::: code-group

```JavaScript [被动事件调用]
e.bot.logger('info', '这是一个info日志')
```

```JavaScript [主动事件调用]
Bot.logger('info', '这是一个info日志')
```

```bash [响应]
# 这里其实每个日志等级都有对应的颜色，但是由于文档的限制，无法展示
[Karin][08:22:50.292][INFO] [Bot:1234567890] 这是一个info日志
```

:::

## 获取头像url

> 方法名: `getAvatarUrl`  
> 描述: `获取头像url，Bot自身也是此参数`  
> 参数: `user_id` `size`  
> 返回值: `string`

| 参数名称 |  类型  |       参数要求       |   备注   |
| :------: | :----: | :------------------: | :------: |
| user_id  | string |         ---          |  用户ID  |
|   size   | number | `0` `40` `100` `140` | 头像大小 |

::: code-group

```JavaScript [被动事件调用]
e.bot.getAvatarUrl(e.user_id)
```

```JavaScript [主动事件调用]
Bot.getAvatarUrl(user_id)
```

```bash [响应]
https://q.qlogo.cn/headimg_dl?dst_uin=1234567890&spec=100
```

:::

## 获取群头像

> 方法名: `getGroupAvatarUrl`  
> 描述: `获取群头像url`  
> 参数: `group_id` `size` `history`
> 返回值: `string`

| 参数名称 |  类型  |       参数要求       |                     备注                      |
| :------: | :----: | :------------------: | :-------------------------------------------: |
| group_id | string |         ---          |                     群号                      |
|   size   | number | `0` `40` `100` `140` |                   头像大小                    |
| history  | number |      `1,2,3...`      | 历史头像<Badge type="warning" text="可选 " /> |

::: code-group

```JavaScript [被动事件调用]
e.bot.getGroupAvatarUrl(e.group_id)
// or
e.bot.getGroupAvatarUrl(e.group_id, 100)
```

```JavaScript [主动事件调用]
Bot.getGroupAvatarUrl(group_id)
// or
Bot.getGroupAvatarUrl(group_id, 100)
```

```bash [响应]
https://p.qlogo.cn/gh/1234567890/1234567890/100
```

:::

## 发送消息

::: warning 注意
`elements`参数必须为数组，并且每个元素都是由`segment`模块中的方法构建的
:::

> 方法名: `SendMessage`  
> 描述: `发送群消息、好友消息、频道消息(暂不支持)`  
> 参数: `contact` `elements` `retry_count`  
> 返回值: `Promise<ReplyReturn>`  

|   参数名称    |                   类型                   | 参数要求 |         备注         |
| :-----------: | :--------------------------------------: | :------: | :------------------: |
|   `contact`   |         [Contact](./contact.md)          |   ---    |      联系人信息      |
|  `elements`   | Array\<[elements](../utils/segment.md)\> |   ---    |       消息元素       |
| `retry_count` |                  number                  |   ---    | 重试次数`(暂未适配)` |

::: code-group

```JavaScript [被动事件调用]
const elements = [
  segment.text('hello')
]
e.bot.SendMessage(e.contact, elements)
```

```JavaScript [主动事件调用]
const elements = [
  segment.text('hello')
]
Bot.SendMessage(contact, elements)
```

```JavaScript [响应]
{
  /** 消息ID */
  message_id: 'string',
  /** 消息发送时间戳 可能会不存在 */
  message_time: 'number',
  /** 原始结果 QQBot适配器下为数组 其他已知适配器为对象 */
  raw_data?: {
    // ...
  }
}
```

:::

<!-- 
  /**
   * 发送消息
   * @param contact - 联系人信息
   * @param elements - 消息元素
   * @param retry_count - 重试次数 默认为1
   * @returns 此接口因各平台问题，允许返回更多自定义数据
   */
  SendMessage (contact: Contact, elements: Array<KarinElement>, retry_count?: number): Promise<ReplyReturn>

 -->