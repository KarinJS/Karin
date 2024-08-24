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

## logger

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

<!-- 
  /**
   * 获取群头像url 请使用`getGroupAvatarUrl`
   * @param group_id - 群号
   * @param size - 头像大小，默认`0`
   * @param history - 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
   * @returns 头像的url地址
   * @deprecated
   */
  getGroupAvatar (group_id: string, size?: 0 | 40 | 100 | 140, history?: number): string

 -->