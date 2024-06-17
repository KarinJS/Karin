# 标准API

> 咕咕咕~

## 交互方式

| 交互方式         | kritor | onebot11 | onebot12 |
| :--------------- | :----: | :------: | :------: |
| 反向 `WebSocket` |   ➖    |    ✅     |    ❌     |
| 正向 `WebSocket` |   ➖    |    ✅     |    ❌     |
| `HTTP`           |   ➖    |    ❌     |    ❌     |
| 反向 `gRPC`      |   ✅    |    ➖     |    ➖     |
| 正向 `gRPC`      |   ❌    |    ➖     |    ➖     |

## 调用方法

- 在插件内部调用

::: code-group

```js [被动消息]
const res = await this.e.bot.GetVersion()
console.log(res)

```

```js [主动调用]
import { Bot } from '#Karin'

const self_id = 123456789

// 获取机器人实例
const bot = Bot.getBot(self_id)
// 需要注意 如果ID对应的机器人实例不存在会返回undefined
const res = await bot.GetVersion()
console.log(res)

```

## 适配进度

::: tip 温馨提示
频道相关的暂无打算支持  
需注意，如果在调用API时请求失败或超时，`karin`会直接抛出一个错误
:::

### 核心API

|       核心API        | kritor | onebot11 | icqq  | onebot12 | 描述               |
| :------------------: | :----: | :------: | :---: | :------: | :----------------- |
|     `GetVersion`     |   ✅    |    ✅     |   ❌   |    ❌     | 获取Kritor版本     |
| `GetCurrentAccount`  |   ✅    |    ✅     |   ❌   |    ❌     | 获取当前账号信息   |
|    `DownloadFile`    |   ❌    |    ❌     |   ❌   |    ❌     | 下载文件到Kritor   |
|   `SwitchAccount`    |   ❌    |    ❌     |   ❌   |    ❌     | 切换账号`(不支持)` |
| `SendMessageByResId` |   ✅    |    ✅     |   ❌   |    ❌     | 通过资源ID发送消息 |
|  `SetMessageReaded`  |   ❌    |    ✅     |   ❌   |    ❌     | 清空本地聊天记录   |

### 消息相关API

|       消息相关API        | kritor | onebot11 | icqq  | onebot12 | 描述                |
| :----------------------: | :----: | :------: | :---: | :------: | :------------------ |
|      `SendMessage`       |   ✅    |    ✅     |   ❌   |    ❌     | 发送消息            |
|     `RecallMessage`      |   ✅    |    ✅     |   ❌   |    ❌     | 撤回消息            |
|       `GetMessage`       |   ✅    |    ✅     |   ❌   |    ❌     | 获取消息            |
|    `GetMessageBySeq`     |   ✅    |    ✅     |   ❌   |    ❌     | 获取消息`(通过seq)` |
|   `GetHistoryMessage`    |   ❌    |    ❌     |   ❌   |    ❌     | 获取历史消息        |
| `GetHistoryMessageBySeq` |   ❌    |    ❌     |   ❌   |    ❌     | 获取历史消息        |
|  `UploadForwardMessage`  |   ✅    |    ✅     |   ❌   |    ❌     | 上传合并转发消息    |
| `DownloadForwardMessage` |   ❌    |    ❌     |   ❌   |    ❌     | 下载合并转发消息    |
| `GetEssenceMessageList`  |   ❌    |    ❌     |   ❌   |    ❌     | 获取精华消息        |
|   `SetEssenceMessage`    |   ❌    |    ❌     |   ❌   |    ❌     | 设置精华消息        |
|  `DeleteEssenceMessage`  |   ❌    |    ❌     |   ❌   |    ❌     | 删除精华消息        |
| `ReactMessageWithEmoji`  |   ✅    |    ✅     |   ❌   |    ❌     | 设置消息评论表情    |

### 好友相关API

|       好友相关API        | kritor | onebot11 | icqq  | onebot12 | 描述               |
| :----------------------: | :----: | :------: | :---: | :------: | :----------------- |
|     `GetFriendList`      |   ✅    |    ✅     |   ❌   |    ❌     | 获取好友列表       |
|  `GetFriendProfileCard`  |   ❌    |    ❌     |   ❌   |    ❌     | 获取名片`(限好友)` |
| `GetStrangerProfileCard` |   ❌    |    ❌     |   ❌   |    ❌     | 获取陌生人信息     |
|     `SetProfileCard`     |   ❌    |    ❌     |   ❌   |    ❌     | 设置自己的名片     |
|    `IsBlackListUser`     |   ❌    |    ❌     |   ❌   |    ❌     | 是否是黑名单用户   |
|        `VoteUser`        |   ✅    |    ✅     |   ❌   |    ❌     | 点赞好友           |
|      `GetUidByUin`       |   ❌    |    ❌     |   ❌   |    ❌     | 获取uid            |
|      `GetUinByUid`       |   ❌    |    ❌     |   ❌   |    ❌     | 获取uin            |

### 群聊相关API

|       群聊相关API       | kritor | onebot11 | icqq  | onebot12 | 描述                     |
| :---------------------: | :----: | :------: | :---: | :------: | :----------------------- |
|       `BanMember`       |   ✅    |    ✅     |   ❌   |    ❌     | 禁言用户                 |
|      `PokeMember`       |   ❌    |    ❌     |   ❌   |    ❌     | 戳一戳用户               |
|      `KickMember`       |   ✅    |    ✅     |   ❌   |    ❌     | 踢出用户                 |
|      `LeaveGroup`       |   ✅    |    ✅     |   ❌   |    ❌     | 退出群组                 |
|   `ModifyMemberCard`    |   ✅    |    ✅     |   ❌   |    ❌     | 修改群名片               |
|    `ModifyGroupName`    |   ✅    |    ✅     |   ❌   |    ❌     | 修改群名称               |
|   `ModifyGroupRemark`   |   ❌    |    ❌     |   ❌   |    ❌     | 修改群备注               |
|     `SetGroupAdmin`     |   ✅    |    ✅     |   ❌   |    ❌     | 设置群管理员             |
|  `SetGroupUniqueTitle`  |   ✅    |    ✅     |   ❌   |    ❌     | 设置群头衔               |
|   `SetGroupWholeBan`    |   ✅    |    ✅     |   ❌   |    ❌     | 设置全员禁言             |
|     `GetGroupInfo`      |   ✅    |    ✅     |   ❌   |    ❌     | 获取群信息               |
|     `GetGroupList`      |   ✅    |    ✅     |   ❌   |    ❌     | 获取群列表               |
|  `GetGroupMemberInfo`   |   ✅    |    ✅     |   ❌   |    ❌     | 获取群成员信息           |
|  `GetGroupMemberList`   |   ✅    |    ✅     |   ❌   |    ❌     | 获取群成员列表           |
| `GetProhibitedUserList` |   ❌    |    ❌     |   ❌   |    ❌     | 获取禁言用户列表         |
|  `GetRemainCountAtAll`  |   ❌    |    ❌     |   ❌   |    ❌     | 获取艾特全体成员剩余次数 |
| `GetNotJoinedGroupInfo` |   ❌    |    ❌     |   ❌   |    ❌     | 获取未加入群组信息       |
|     `GetGroupHonor`     |   ✅    |    ✅     |   ❌   |    ❌     | 获取群荣誉信息           |

### Web服务相关API

|  Web服务相关API  | kritor | onebot11 | icqq  | onebot12 | 描述                 |
| :--------------: | :----: | :------: | :---: | :------: | :------------------- |
|   `GetCookies`   |   ❌    |    ❌     |   ❌   |    ❌     | 获取通用cookie       |
| `GetCredentials` |   ❌    |    ❌     |   ❌   |    ❌     | 获取bkn参数与cookie  |
|  `GetCSRFToken`  |   ❌    |    ❌     |   ❌   |    ❌     | 获取bkn              |
| `GetHttpCookies` |   ❌    |    ❌     |   ❌   |    ❌     | 获取http请求的cookie |

### 请求事件相关API

|       请求事件相关API       | kritor | onebot11 | icqq  | onebot12 | 描述             |
| :-------------------------: | :----: | :------: | :---: | :------: | :--------------- |
|   `SetFriendApplyResult`    |   ❌    |    ❌     |   ❌   |    ❌     | 设置好友申请结果 |
|    `SetGroupApplyResult`    |   ❌    |    ❌     |   ❌   |    ❌     | 设置群组申请结果 |
| `SetInvitedJoinGroupResult` |   ❌    |    ❌     |   ❌   |    ❌     | 设置邀请入群结果 |
