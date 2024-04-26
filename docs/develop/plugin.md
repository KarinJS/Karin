# 插件编写示例

>本文档将介绍如何编写一个简单的插件。

- [插件编写示例](#插件编写示例)
  - [插件参数说明](#插件参数说明)
  - [插件示例](#插件示例)
    - [方法1](#方法1)
    - [方法2](#方法2)
  - [完整参数](#完整参数)
    - [方法1](#方法1-1)
    - [方法2](#方法2-1)
    - [监听事件](#监听事件)
  - [消息匹配规则](#消息匹配规则)
  - [快速回复](#快速回复)

## 插件参数说明

| 参数     | 必须 | 默认值  | 描述   | 说明                           |
| -------- | ---- | ------- | ------ | ------------------------------ |
| name     | √    | -       | string | 插件名称                       |
| dsc      |      | 描述    | string | 插件描述                       |
| event    |      | message | string | [监听事件](#监听事件)          |
| priority |      | 5000    | number | 插件优先级，数字越小优先级越高 |
| rule     | √    | -       | array  | [消息匹配规则](#消息匹配规则)  |
| reply    |      | -       |        | [快速回复](#快速回复)          |

## 插件示例

::: warning 温馨提示
未标注必选的参数，可选键入。
:::

1. 打开`plugins/karin-plugin-example`目录，在此新建一个`hello.js`文件。
2. 打开`hello.js`文件，输入以下代码：

### 方法1

```js
import { App } from '#Karin'

const app = App.init({
  /** 必选 插件名称 */
  name: 'hello',
  /** 插件描述 */
  dsc: '发送你好回复hello',
  /** 监听事件 默认message */
  event: 'message',
  /** 插件优先级 */
  priority: 5000
})

app.reg({
  /** 命令匹配正则 */
  reg: '你好$',
  /** 命令执行方法名称 */
  fnc: 'hello',
  /** 是否显示操作日志 true=是 false=否 */
  log: true,
  /** 权限 master,owner,admin,all */
  permission: 'all',
  /** 调用 this.reply 方法回复 hello 关于参数2，请看下文 */
  async hello () {
    this.reply('hello', { at: false, recallMsg: 0, reply: true, button: false })
  }
})

export const hello = app.plugin(app)

```

3. 保存，对机器人输入`你好`，机器人会回复`hello`。

以上，是一个最基本的插件构建方法。

### 方法2

```js
import { plugin } from '#Karin'

export class hello extends plugin {
  constructor () {
    super({
      // 必选 插件名称
      name: 'hello',
      // 插件描述
      dsc: '发送你好回复hello',
      // 监听消息事件 默认message
      event: 'message',
      // 优先级
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#你好$',
          /** 执行方法 */
          fnc: 'hello',
          //  是否显示操作日志 true=是 false=否
          log: true,
          // 权限 master,owner,admin,all
          permission: 'all'
        }
      ],
    })
  }

  async hello () {
    // 调用 this.reply 方法回复 hello 关于参数2，请看下文
    this.reply('hello', { at: false, recallMsg: 0, reply: true, button: false })
  }
}

```

## 完整参数
>
> 以下是一个完整的插件编写示例。

### 方法1

```js
import { App } from '#Karin'

const app = App.init({
  /** 插件名称 */
  name: 'hello',
  /** 插件描述 */
  dsc: '发送你好回复hello',
  /** 监听事件 */
  event: 'message',
  /** 插件优先级 */
  priority: 5000
})

app.reg({
  /** 命令匹配正则 */
  reg: '你好$',
  /** 命令执行方法名称 */
  fnc: 'hello',
  /** 是否显示操作日志 true=是 false=否 */
  log: true,
  /** 权限 master,owner,admin,all */
  permission: 'all',
  /** 调用 this.reply 方法回复 hello 关于参数2，请看下文 */
  async hello () {
    this.reply('hello', { at: false, recallMsg: 0, reply: true, button: false })
  }
})

export const hello = app.plugin(app)

```

### 方法2

```js
import { plugin } from '#Karin'

export class hello extends plugin {
  constructor () {
    super({
      // 插件名称
      name: 'hello',
      // 插件描述
      dsc: '发送你好回复hello',
      // 监听消息事件
      event: 'message',
      // 优先级
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#你好$',
          /** 执行方法 */
          fnc: 'hello',
          //  是否显示操作日志 true=是 false=否
          log: true,
          // 权限 master,owner,admin,all
          permission: 'all'
        }
      ]
    })
  }

  async hello () {
    // 调用 this.reply 方法回复 hello 关于参数2，请看下文
    this.reply('hello', { at: false, recallMsg: 0, reply: true, button: false })
  }
}

```

### 监听事件

| 事件名称 | 说明     |
| -------- | -------- |
| message  | 消息事件 |
| notice   | 通知事件 |
| request  | 请求事件 |

>高级监听事件：

|          | 结构                             | 参考                 | 说明         |
| -------- | -------------------------------- | -------------------- | ------------ |
| 一级事件 | `post_type`                      | `message`            | 所有消息事件 |
| 二级事件 | `post_type.notice_type`          | `message.group`      | 群消息事件   |
| 三级事件 | `post_type.notice_type.sub_type` | `notice.notify.poke` | 群内戳一戳   |

## 消息匹配规则

| 参数       | 必须 | 类型    | 说明                        |
| ---------- | ---- | ------- | --------------------------- |
| reg        | √    | string  | 正则匹配                    |
| fnc        | √    | string  | 执行方法                    |
| log        |      | boolean | 是否显示操作日志            |
| permission |      | string  | 权限 master,owner,admin,all |

> 一些正则...

| 正则 | 说明     |     | 正则 | 说明       |
| ---- | -------- | --- | ---- | ---------- |
| ^    | 开头     |     | \d   | 数字       |
| $    | 结尾     |     | \D   | 非数字     |
| .    | 任意字符 |     | \w   | 单词       |
| *    | 任意多个 |     | \W   | 非单词     |
| ?    | 0或1个   |     | \s   | 空白       |
| +    | 1或多个  |     | \S   | 非空白     |
| []   | 字符集   |     | \b   | 单词边界   |
| [^]  | 非字符集 |     | \B   | 非单词边界 |
| ()   | 分组     |     | \|   | 或         |

## 快速回复

| 参数      | 必须 | 类型    | 说明                                           |
| --------- | ---- | ------- | ---------------------------------------------- |
| at        |      | boolean | 是否@回复发送者消息                            |
| recallMsg |      | number  | 单位秒，设置后，将在指定时间撤回本次回复的消息 |
| reply     |      | boolean | 是否引用回复发送者消息                         |
| button    |      | boolean | 是否加入按钮，暂未实现                         |
