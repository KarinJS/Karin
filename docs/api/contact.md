# Contact

> contact 为联系人对象，用于描述联系人信息

## 属性

|  contact   |  类型  | 必须  |                  描述                   |
| :--------: | :----: | :---: | :-------------------------------------: |
|  `scene`   | string |  是   |  暂时没有意向支持除群和好友以外的场景   |
|   `peer`   | string |  是   |           好友QQ号/群号/频道            |
| `sub_peer` | string |  否   | 子频道id 非频道场景与`peer`一致或不存在 |

### 以下为`scene`的标准值

|         scene         |    描述    |
| :-------------------: | :--------: |
|        `group`        |     群     |
|       `friend`        |    好友    |
|        `guild`        |    频道    |
|       `nearby`        |  附近的人  |
|      `stranger`       |   陌生人   |
| `stranger_from_group` | 群临时会话 |

## 示例

- 在收到事件时，此属性必须存在
- 此属性在调用大多数API时都会用到

```js
// 一个简单的例子，回复消息
import { segment, Bot } from 'node-karin'

const self_id = 123456789
await Bot.sendMsg(
  // 参数1 机器人ID
  self_id,
  // 参数2 contact
  {
    scene: 'group',
    peer: '123456789',
  },
  // 参数3 elements
  '这只一条主动消息'
)
```
