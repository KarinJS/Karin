---
title: 通用数据
icon: database
---

## 所有事件

::: tip
`karin`是基于`kritor`标准进行开发。  
大多数情况下都符合`kritor`的标准，如有冲突，请以`karin`为准。
:::

所有事件都包含以下字段：

| 属性      | 类型                  | 说明                    |
| --------- | --------------------- | ----------------------- |
| self_id   | string                | 机器人ID                |
| user_id   | string                | 触发用户ID              |
| group_id  | string                | 触发群ID(`非群聊无值`)  |
| time      | number                | 事件触发时间戳          |
| event     | [object](#事件类型)   | 触发的事件类型          |
| sub_event | [string](#事件子类型) | 触发事件子类型          |
| contact   | [object](#消息来源)   | 消息来源信息            |
| sender    | [object](#消息触发者) | 消息触发者信息          |
|           |                       |                         |
| isMaster  | boolean               | 是否为机器人主人        |
| isAdmin   | boolean               | 是否为机器人管理员      |
| isPrivate | boolean               | 是否为私聊              |
| isGroup   | boolean               | 是否为群聊              |
| isGuild   | boolean               | 是否为频道              |
| store     | Map                   | 存储器 由开发者自行调用 |
| bot       | Function              | 机器人自身实例          |

## 事件类型

::: tip 提示
`event` 为 `message` 或 `message_sent` 时，数据是一致的。  
区别在于 `message` 是收到的消息，`message_sent` 是发送的消息。  
在大多数协议端中，`message_sent`事件均为用户手动开启。
:::

| 事件类型     | 说明                  |
| ------------ | --------------------- |
| message      | 消息事件              |
| message_sent | bot自身触发的消息事件 |
| notice       | 通知事件              |
| request      | 请求事件              |

## 消息来源

> `contact`是一个`Object`对象哦~

```js
const contact = {
  scene: 'group', // 场景
  peer: '123456', // 群为群ID、频道为频道ID、好友为好友ID
  sub_peer: '123456' // 一般与`peer`相同或为空，频道场景为`channel_id`。
}
```

以下是scene的值：

- `group`: 群聊
- `private`: 私聊
- `guild`: 频道
- `nearby`: 附近的人
- `stranger`: 陌生人
- `stranger_from_group`: 群临时会话

## 消息触发者

> `sender`是一个`Object`对象哦~

::: tip 提示
无需关心`uin`字段，`user_id`默认使用`uid`，后续会废弃`uin`字段。  
这里的字段目前还处于不断完善中，可能会有变动。
:::

```js
const sender = {
  uid: '123456', // 发送者uid
  uin: '123456', // 发送者uin
  nick: '昵称', // 发送者昵称 可能为空
  role: '群身份' // 仅在群聊生效 可能为空
}
```

以下是role的值：

- `owner`: 群主
- `admin`: 管理员
- `member`: 普通成员
- `unknown`: 未知

## 事件子类型

| 场景名称                          | 对应事件 | 说明               |
| --------------------------------- | -------- | ------------------ |
| group                             | message  | 群聊               |
| private                           | message  | 私聊               |
| guild                             | message  | 频道               |
| nearby                            | message  | 附近的人           |
| stranger                          | message  | 陌生人             |
|                                   |          |                    |
| friend_poke                       | notice   | 好友戳一戳         |
| friend_recall                     | notice   | 好友消息撤回       |
| group_poke                        | notice   | 群戳一戳           |
| group_card_changed                | notice   | 群名片变动         |
| group_member_unique_title_changed | notice   | 群成员专属头衔改变 |
| group_essence_changed             | notice   | 群精华消息变动     |
| group_recall                      | notice   | 群消息撤回         |
| group_member_increase             | notice   | 群成员增加         |
| group_member_decrease             | notice   | 群成员减少         |
| group_admin_change                | notice   | 群管理员变动       |
| group_member_ban                  | notice   | 群成员禁言         |
| group_sign_in                     | notice   | 群签到             |
| group_whole_ban                   | notice   | 群全员禁言         |
| group_file_uploaded               | notice   | 群文件上传         |
|                                   |          |                    |
| friend_apply                      | request  | 新的好友申请       |
| group_apply                       | request  | 新的加群请求       |
