## elements

本文档介绍了 Krita 的消息元素结构和 `segment` 模块的使用方法。

::: tip tips
目前尚在开发阶段，可能有部分内容未完善或错误，敬请谅解。
:::

## 导入
::: tip 温馨提示
以下所有的示例都假设你已经导入了 `segment` 模块。
:::

```js
import { segment } from '#karin'
```

## 多媒体资源标准

karin对于多媒体资源的标准化处理，遵循以下规则：

- 对于网络资源，要求传入的url必须为 `https://` 或 `http://` 开头
- 对于base64格式，传入必须是 `base64://` 格式开头的字符串
- 对于`file://`格式，传入的字符串必须是`绝对路径`，且资源必须存在
- 对于未知字段，请确认适配器可以正确处理

::: tip 注意
对于`file://`格式，请开发者注意以下几点：
- 请确保用户的协议端和karin运行环境一致，否则可能导致文件读取失败
- 对于Linux系统，由于绝对路径前方有`/`，格式为`file:///root/...`，请注意区分`///`和`//`
:::

## 文本 text
```js
const text = segment.text('Hello, world!')
console.log(text)
```

输出：
```js
{
    type: 'text',
    text: 'Hello, world!'
}
```

## 表情 face

::: tip 温馨提示
键入的ID必须为数字
:::

```js
const face = segment.face(1)
console.log(face)
```

输出：
```js
{
    type: 'face',
    id: 1
}
```


## 图片 image

::: tip 温馨提示
遵循 [多媒体资源标准](#多媒体资源标准)
:::

```js
const image = segment.image('https://example.com/image.png') // 网络图片
const image = segment.image('base64://iVBORw0KGgoAAAANSUhEUgA...') // base64格式
const image = segment.image('file://C:/Users/admin/Pictures/image.png') // Windows绝对路径
const image = segment.image('file:///root/karin/image.png') // Linux绝对路径
console.log(image)
```

输出：
```js
{   // 对于网络图片，要求传入的url必须为https://或http://开头
    type: 'image',
    file: 'https://example.com/image.png'
}
{   // 对于base64格式，传入的字符串必须是base64格式的图片
    type: 'image',
    file: 'base64://iVBORw0KGgoAAAANSUhEUgA...'
}
{   // file://格式，传入的字符串必须是绝对路径，且图片必须存在
    type: 'image',
    file: 'file://C:/Users/admin/Pictures/image.png'
}
{   // file:///格式，传入的字符串必须是绝对路径，且图片必须存在
    type: 'image',
    file: 'file:///root/karin/image.png'
}
```

## 语音 record

::: tip 温馨提示
遵循 [多媒体资源标准](#多媒体资源标准)
:::

```js
const record = segment.record('https://example.com/record.mp3')
console.log(record)
```

输出：
```js
{
    type:'record',
    file: 'https://example.com/record.mp3'
}
```


## 视频 video
::: tip 温馨提示
遵循 [多媒体资源标准](#多媒体资源标准)
::: 

```js
const video = segment.video('https://example.com/video.mp4')
console.log(video)
```

输出：
```js
{
    type: 'video',
    file: 'https://example.com/video.mp4'
}
```

## @用户 at

::: tip 温馨提示
开发者只需要关注uid字段即可
:::

```js
const at = segment.at('abc1234567890', '1234567890')
console.log(at)
```

输出：
```js
{
    type: 'at',
    uid: 'abc1234567890',
    uin: '1234567890' // 二选一 推荐使用uid
}
```

## 戳一戳 poke

关于这部分，见[mirai](https://github.com/mamoe/mirai/blob/f5eefae7ecee84d18a66afce3f89b89fe1584b78/mirai-core/src/commonMain/kotlin/net.mamoe.mirai/message/data/HummerMessage.kt#L49)

```js
const poke = segment.poke(1, -1, '戳一戳')
console.log(poke)
```

输出：
```js
{
    type: 'poke',
    poke: 1, // 类型
    id: -1, // id
    name: '戳一戳' //  表情名称
}
```

## 链接分享 share

```js
const share = segment.share('https://example.com/share', '分享标题', '分享描述', '图片 URL')
console.log(share)
```

输出：
```js
{
    type:'share',
    url: 'https://example.com/share',
    title: '分享标题',
    content: '分享描述',
    image: '图片 URL'
}
```

## 推荐好友或群 contact

```js
const contact = segment.contact('qq', '12345')
console.log(contact)
```


输出：
```js
{
    type: 'contact',
    platform: 'qq', // 'qq' 表示推荐好友，'group' 表示推荐群
    id: '12345' // 被推荐人的 QQ 号或被推荐群的群号
}
```

## 位置 location

```js
const location = segment.location('121.527328', '31.21515', '上海市浦东新区', '内容描述')
console.log(location)
```


输出：
```js
{
    type: 'location',
    lat: '121.527328', // 纬度
    lon: '31.21515', // 经度
    title: '上海市浦东新区', // 标题 (可选)
    content: '内容描述' // 内容描述 (可选)
}
```

## 音乐分享 music


```js
const music = segment.music('qq', '12345')
console.log(music)
```


输出：
```js
{
    type:'music',
    platform: 'qq', // 音乐类型，'qq', '163', 'xm'
    id: '12345' // 歌曲 ID
}
```

## 自定义音乐分享 customMusic

```js
const customMusic = segment.customMusic('https://example.com/music.mp3', 'https://example.com/music.mp3', '标题', '内容描述', 'https://example.com/image.jpg')
console.log(customMusic)
```


输出：
```js
{
    type: 'customMusic',
    url: 'https://example.com/music.mp3', // 点击后跳转目标 URL
    audio: 'https://example.com/music.mp3', // 音乐 URL
    title: '标题', // 标题
    content: '内容描述', // 内容描述
    image: 'https://example.com/image.jpg', // 图片 URL
}
```

## 回复 reply

```js
const reply = segment.reply('1234567890')
console.log(reply)
```

输出：
```js
{
    type:'reply',
    message_id: '1234567890'
}
```

## 发送res_id合并转发 forward

```js
const forward = segment.forward('abs1234567890')
console.log(forward)
```

输出：
```js
{
    type: 'forward',
    id: 'abs1234567890'
}
```

## 合并转发自定义节点 node

```js
const node = segment.node('1234567890', 'karin', [segment.text('Hello, world!')])
console.log(node)
```

输出：
```js
{
    type: 'node',
    user_id: '1234567890',
    nickname: 'karin',
    content: [
        {
            type: 'text',
            text: 'Hello, world!'
        }
    ]
}
```

## xml

```js
const xml = segment.xml('<xml>...</xml>', 'id')
console.log(xml)
```

输出：
```js
{
    type: 'xml',
    data: '<xml>...</xml>',
    id: 'id'
}
```

## JSON

```js
const json = segment.json('JSON 内容')
console.log(json)
```

输出：
```js
{
    type: 'json',
    data: 'JSON 内容'
}
```

## markdown消息

```js
// 原生markdown内容
const markdown = segment.markdown('## 标题\n- 列表1\n- 列表2')

// 模板markdown参数 此为QQBot官方字段，其他平台不可用
const markdown = segment.markdown({
  custom_template_id: '模板ID',
  params: [
    { key: 'title', values: ['标题'] },
    { key: 'list', values: ['列表1'] }
  ]
})
console.log(markdown)
```


输出：
```js
// 原生markdown内容
{
    type:'markdown',
    content: '## 标题\n- 列表1\n- 列表2'
}

// 模板markdown参数 此为QQBot官方字段，其他平台不可用
{
    type:'markdown',
    custom_template_id: '模板ID',
    params: [
        { key: 'title', values: ['标题'] },
        { key: 'list', values: ['列表1', '列表2'] }
    ]
}
```

## rows按钮 QQBot官方格式

::: tip 温馨提示
rows和button的键入值一致，且比较复杂，请查看最下方的构建方法，这里只展示输出
:::

::: details 点我查看输出示例

```js:line-numbers {1}
 {
  type: 'rows',
  rows: [
    {
      buttons: [
        {
          id: '1',
          render_data: {
            label: '⬅️上一页',
            visited_label: '⬅️上一页'
          },
          action: {
            type: 1,
            permission: {
              type: 1,
              specify_role_ids: [
                '1',
                '2',
                '3'
              ]
            },
            click_limit: 10,
            unsupport_tips: '兼容文本',
            data: 'data',
            at_bot_show_channel_list: true
          }
        },
        {
          id: '2',
          render_data: {
            label: '➡️下一页',
            visited_label: '➡️下一页'
          },
          action: {
            type: 1,
            permission: {
              type: 1,
              specify_role_ids: [
                '1',
                '2',
                '3'
              ]
            },
            click_limit: 10,
            unsupport_tips: '兼容文本',
            data: 'data',
            at_bot_show_channel_list: true
          }
        }
      ]
    },
    {
      buttons: [
        {
          id: '3',
          render_data: {
            label: '📅 打卡（5）',
            visited_label: '📅 打卡（5）'
          },
          action: {
            type: 1,
            permission: {
              type: 1,
              specify_role_ids: [
                '1',
                '2',
                '3'
              ]
            },
            click_limit: 10,
            unsupport_tips: '兼容文本',
            data: 'data',
            at_bot_show_channel_list: true
          }
        }
      ]
    }
  ]
}

```

:::

## button按钮

::: tip 温馨提示
rows和button的键入值一致，且比较复杂，请查看最下方的构建方法，这里只展示输出
:::

::: details 点我查看输出示例

```js:line-numbers {1}
{
  type: 'button',
  buttons: [
    {
      id: '1',
      render_data: {
        label: '⬅️上一页',
        visited_label: '⬅️上一页'
      },
      action: {
        type: 1,
        permission: {
          type: 1,
          specify_role_ids: [
            '1',
            '2',
            '3'
          ]
        },
        click_limit: 10,
        unsupport_tips: '兼容文本',
        data: 'data',
        at_bot_show_channel_list: true
      }
    },
    {
      id: '2',
      render_data: {
        label: '➡️下一页',
        visited_label: '➡️下一页'
      },
      action: {
        type: 1,
        permission: {
          type: 1,
          specify_role_ids: [
            '1',
            '2',
            '3'
          ]
        },
        click_limit: 10,
        unsupport_tips: '兼容文本',
        data: 'data',
        at_bot_show_channel_list: true
      }
    }
  ]
}
```

:::

## rows按钮、button按钮构建方法

::: tip 温馨提示
以下所有代码，`segment.rows`和`segment.button`均可使用  
所有未出现在快速构建方法中的参数，均为可选参数，可以根据需要选择是否传入
:::

### 跳转按钮
```js:line-numbers {1}
// 快速构建
segment.rows({ link: 'https://example.com' })

// 完整构建
segment.rows({
  text: '链接跳转', // 按钮默认显示的文本
  show: '链接跳转', // 按钮点击后显示的文本
  link: 'https://example.com',
  style: 0, // 按钮样式 0 灰色线框，1 蓝色线框 默认 0
  admin: false, // 设置为true时，只有群管理员可以点击
  list: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥
  role: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥 （仅频道可用）
  tips: '指令提示' // 客户端不支持本 action 的时候，弹出的 toast 文案
})

```

### 回调按钮
```js:line-numbers {1}
// 快速构建
segment.rows({ type: 1, text: '回调按钮'})

// 完整构建
segment.rows({
  type: 1, // 按钮类型 1 回调按钮
  text: '回调按钮', // 按钮默认显示的文本
  show: '回调按钮', // 按钮点击后显示的文本
  data: '操作相关数据', // 回调数据
  style: 0, // 按钮样式 0 灰色线框，1 蓝色线框 默认 0
  admin: false, // 设置为true时，只有群管理员可以点击
  list: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥
  role: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥 （仅频道可用）
  tips: '指令提示' // 客户端不支持本 action 的时候，弹出的 toast 文案
})

```

### 指令按钮
```js:line-numbers {1}
// 快速构建
segment.rows({ text: '指令按钮' })

// 完整构建
segment.rows({
  type: 2, // 按钮类型 2 指令按钮
  text: '指令按钮', // 按钮默认显示的文本
  show: '指令按钮', // 按钮点击后显示的文本
  data: '操作相关数据', // 指令数据
  style: 0, // 按钮样式 0 灰色线框，1 蓝色线框 默认 0
  enter: true, // 设置为true时，点击按钮后直接自动发送 data，默认 false
  reply: true, // 设置为true时，点击按钮后回复当前消息，默认 false
  admin: false, // 设置为true时，只有群管理员可以点击
  list: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥
  role: ['用户ID1', '用户ID2'], // 设置后，只有这些用户可以点击，与admin互斥 （仅频道可用）
  tips: '指令提示' // 客户端不支持本 action 的时候，弹出的 toast 文案
})