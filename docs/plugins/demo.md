# 示例

> 一个简单的 `demo` 示例，直接代码展示了。

## 准备工作

- 打开 `plugins/karin-plugin-example` 目录，在此新建一个 `index-demo.js` 文件。

## 函数式语法糖示例

- <Badge type="warning" text="文本" />
::: code-group
```js [js]
import karin from 'node-karin'

// 直接回复字符串
export const hello = karin.command(/^#hello$/, 'hello')

// 回调函数
export const hello = karin.command(/^#你好$/, async (e) => {
  await e.reply('hello')
  return true
})

```
:::
- <Badge type="warning" text="图片" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'
import { axios } from 'node-karin/modules.js'

export const image = karin.command(/^#动漫壁纸$/, async (e) => {
  // 来自: https://blog.jixiaob.cn/?post=93
  await e.reply(segment.image('https://t.alcy.cc/mp'))
  return true
})

```
:::

- <Badge type="warning" text="at" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'

export const at = karin.command(/^#at$/, async (e) => {
  await e.reply('\n这是一个at元素', { at: true })
  return true
})

// or 上方代码等同于下方代码

export const at = karin.command(/^#at$/, async (e) => {
  await e.reply([
    segment.at(e.user_id),
    '\n这是一个at元素',
  ])
  return true
})

```
:::
- <Badge type="warning" text="引用回复" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'

export const reply = karin.command(/^#reply$/, async (e) => {
  await e.reply('这是一个引用回复', { reply: true })
  return true
})

// or 上方代码等同于下方代码

export const reply = karin.command(/^#reply$/, async (e) => {
  await e.reply([
    segment.reply(e.message_id),
    '这是一个引用回复',
  ])
  return true
})

```
:::

- <Badge type="warning" text="语音" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'

export const record = karin.command(/^#语音$/, async (e) => {
  await e.reply(segment.record('base64://...'))
  return true
})

```
:::

- <Badge type="warning" text="视频" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'

export const video = karin.command(/^#视频$/, async (e) => {
  await e.reply(segment.video('base64://...'))
  return true
})

```
:::

- <Badge type="warning" text="表情" />
::: code-group
```js [js]
import karin, { segment } from 'node-karin'

export const face = karin.command(/^#表情$/, async (e) => {
  // 表情id请参考 https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#Emoji
  await e.reply(segment.face(1))
  return true
})

```
:::

<Badge type="danger" text="待完善..." />

## 类语法糖示例

> 该示例为消息插件示例  
> 将下面的代码复制到 `index-demo.js` 中，保存  
>对机器人发送 `#你好` ，机器人会回复 `你好` 、图片、语音、视频、@某人
::: code-group
```js [js]
import { Plugin, segment } from 'node-karin'

export class hello extends Plugin {
  constructor () {
    super({
      name: '插件名称',
      dsc: '插件描述',
      rule: [
        {
          /** 命令正则匹配 */
          reg: /^#你好$/,
          /** 正则对应的执行方法 */
          fnc: 'hello'
        }
      ]
    })
  }

  async hello () {
    /** 回复纯文本 */
    await this.reply(segment.text('你好'))
    /** 回复图片 */
    await this.reply(segment.image('https://www.example.com/example.png'))
    /** 回复语音 */
    await this.reply(segment.record('https://www.example.com/example.mp3'))
    /** 回复视频 */
    await this.reply(segment.video('https://www.example.com/example.mp4'))
    /** @某人 */
    await this.reply(segment.at('888888'))
    /** ...更多类型请查看segment 这里只展示常用的 */

    /** 这里return若为false karin会继续匹配下一个插件 */
    // return false
    /** 若为true 则此次用户触发的事件到此结束 */
    return true
  }
}

```
:::

## 更复杂的类语法糖示例
::: code-group
```js [js]
import { Plugin, segment } from 'node-karin'

export class hello extends Plugin {
  constructor () {
    super({
      name: '插件名称',
      dsc: '插件描述',
      /** 监听事件 具体请查看事件分类 */
      event: 'message',
      /** 插件的优先级 必须为数字 数字越小优先级越高 默认5000 */
      priority: 1000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: /^#你好$/,
          /** 正则对应的执行方法 */
          fnc: 'hello',
          /** 是否显示操作日志 默认显示 */
          log: true,
          /** 操作权限 all | admin | master | group.admin | group.owner */
          permission: 'all'
        }
      ]
    })
  }

  async hello () {
    /**
     * 将多个元素放在一起发送...
     * 这里只是一个例子，正常情况语音和视频是不支持组合发送的。
     */
    const msg = [
      segment.text('下面是一张图片：'),
      segment.image('https://www.example.com/example.png'),
      segment.text('下面是一段语音：'),
      segment.record('https://www.example.com/example.mp3'),
      segment.text('下面是一个视频：'),
      segment.video('https://www.example.com/example.mp4'),
      segment.text('下面是一个AT：'),
      segment.at('888888')
    ]

    /**
     * 这里是快捷操作方法
     * 也称回复消息附加选项
     * 以下选项，均为可选项，不填写则不会执行对应操作
     */
    const options = {
      /** 设置为true 则会在发送消息的时候自动在前方加上AT 对象是消息的触发者 */
      at: true,
      /** 设置为true 则会在发送消息的时候自动附加一个引用回复 对象是消息触发者 */
      reply: true,
      /** 这里需要是数字，代表消息发送成功后，多少秒后撤回消息 */
      recallMsg: 10
    }

    await this.reply(msg, options)

    return true
  }
}

```
:::
