# Karin Plugin v10 - 完整示例版

> 链式直接创建、支持 ref、丰富示例

---

## 一、三种创建方式

```ts
// 1. 极简方式 - command()
command(/^ping$/, 'pong')

// 2. 响应式方式 - ref()
const ping = ref(/^ping$/, 'pong')

// 3. 链式方式 - chain()
chain(/^ping$/, 'pong')
  .perm('master')
  .priority(1)
```

**三者关系：**
- `command()` → 普通插件，无法动态控制
- `ref()` → 响应式插件，可动态修改属性
- `chain()` → 链式构建，最终可选 `.ref()` 或 `.done()`

---

## 二、API 签名

```ts
// 极简
function command(reg: RegExp, callback: Callback | string, options?: Options): Plugin

// 响应式
function ref(reg: RegExp, callback: Callback | string, options?: Options): RefPlugin

// 链式
function chain(reg: RegExp, callback: Callback | string): ChainBuilder
```

---

## 三、完整示例

### 3.1 command() - 极简用法

```ts
import { command } from '@karinjs/plugin'

// ===== 最简形式 =====

// 字符串回复
command(/^ping$/, 'pong')

// 函数回调
command(/^time$/, ctx => ctx.reply(new Date().toLocaleString()))

// 带捕获组
command(/^echo (.+)$/, ctx => ctx.reply(ctx.match[1]))

// ===== 带选项 =====

// 权限控制
command(/^restart$/, doRestart, { perm: 'master' })

// 优先级
command(/^help$/, showHelp, { priority: 1 })

// 指定事件类型
command(/^群消息$/, handle, { event: 'message.group' })

// 多事件类型
command(/^通用$/, handle, { event: ['message.group', 'message.friend'] })

// 适配器过滤
command(/^qq专用$/, handle, { adapter: ['onebot'] })

// 组合选项
command(/^admin$/, doAdmin, {
  name: '管理命令',
  perm: 'master',
  priority: 1,
  log: false,
  event: 'message.group',
  adapter: ['onebot', 'icqq'],
})

// ===== 字符串回复的额外选项 =====

// 延迟回复
command(/^慢$/, '这是延迟消息', { delay: 3000 })

// 带 @
command(/^at$/, '收到', { at: true })

// 带引用
command(/^quote$/, '引用回复', { reply: true })

// 自动撤回（5秒后）
command(/^秘密$/, '悄悄告诉你', { recallMsg: 5 })
```

### 3.2 ref() - 响应式用法

```ts
import { ref } from '@karinjs/plugin'

// ===== 基础创建 =====

const ping = ref(/^ping$/, 'pong')

// ===== 直接修改属性（无 .value） =====

ping.reg = /^pong$/           // 修改匹配规则
ping.callback = () => 'hi'    // 修改回调
ping.priority = 1             // 修改优先级（自动重排序）
ping.perm = 'master'          // 修改权限
ping.name = '新名字'          // 修改名称
ping.disabled = true          // 禁用（从匹配队列移除，但不删除）
ping.disabled = false         // 重新启用

// ===== 监听变化 =====

ping.on('change', (key, newVal, oldVal) => {
  console.log(`属性 ${key} 从 ${oldVal} 变为 ${newVal}`)
})

// ===== 卸载 =====

ping.dispose()  // 完全删除，无法恢复

// ===== 带选项创建 =====

const admin = ref(/^admin$/, doAdmin, {
  name: '管理命令',
  perm: 'master',
  priority: 1,
})

// ===== 实际应用：计数器 =====

let count = 0
const counter = ref(/^count$/, ctx => ctx.reply(`计数: ${++count}`))

// 管理员可以重置
command(/^reset$/, () => {
  count = 0
  return '已重置'
}, { perm: 'master' })

// 管理员可以禁用
command(/^toggle$/, () => {
  counter.disabled = !counter.disabled
  return counter.disabled ? '计数器已禁用' : '计数器已启用'
}, { perm: 'master' })

// ===== 实际应用：动态功能开关 =====

const features = {
  抽卡: ref(/^抽卡$/, doGacha),
  签到: ref(/^签到$/, doSignIn),
  转账: ref(/^转账$/, doTransfer),
}

// 管理命令：开关功能
command(/^#(开启|关闭) (.+)$/, ctx => {
  const [, action, name] = ctx.match
  const feature = features[name]

  if (!feature) return ctx.reply('功能不存在')

  feature.disabled = action === '关闭'
  ctx.reply(`${name} 已${action}`)
}, { perm: 'master' })
```

### 3.3 chain() - 链式用法

```ts
import { chain } from '@karinjs/plugin'

// ===== 基础链式 =====

chain(/^test$/, 'ok')
  .name('测试命令')
  .priority(100)

// ===== 完整链式 =====

chain(/^admin$/, doAdmin)
  .name('管理命令')
  .priority(1)
  .perm('master')
  .log(false)
  .on('message.group')
  .adapter('onebot', 'icqq')

// ===== 条件过滤 =====

chain(/^群专用$/, handle)
  .when(ctx => ctx.isGroup)                    // 必须是群消息
  .when(ctx => ctx.groupId === '123456789')    // 必须是指定群

// ===== 生命周期钩子 =====

chain(/^复杂命令$/, mainHandler)
  .before(async ctx => {
    console.log('命令开始执行')
    ctx.startTime = Date.now()
  })
  .after(async ctx => {
    console.log(`命令执行完成，耗时 ${Date.now() - ctx.startTime}ms`)
  })
  .catch((err, ctx) => {
    console.error('命令执行出错:', err)
    ctx.reply('出错了，请稍后重试')
  })

// ===== 链式 + ref =====

// 方式1：.ref() 终结
const myCmd = chain(/^my$/, 'ok')
  .perm('master')
  .priority(1)
  .ref()  // 返回响应式插件

myCmd.disabled = true  // 可以动态控制

// 方式2：.done() 终结（普通插件）
const normalCmd = chain(/^normal$/, 'ok')
  .perm('all')
  .done()  // 返回普通插件

// ===== 实际应用：签到系统 =====

const signIn = chain(/^签到$/, async ctx => {
  const result = await doSignIn(ctx.userId)
  await ctx.reply(`签到成功！连续 ${result.days} 天`)
})
  .name('每日签到')
  .perm('all')
  .on('message.group')
  .before(async ctx => {
    // 检查是否已签到
    const signed = await checkSigned(ctx.userId)
    if (signed) {
      await ctx.reply('今天已经签到过了')
      ctx.stop = true  // 阻止主回调执行
    }
  })
  .catch((err, ctx) => {
    ctx.reply('签到失败，请稍后重试')
  })
  .ref()  // 获取响应式引用

// 维护时可以临时禁用
command(/^#维护签到$/, () => {
  signIn.disabled = true
  return '签到功能已进入维护'
}, { perm: 'master' })
```

### 3.4 开发环境

```ts
import { command, ref, dev, onLoad, onUnload } from '@karinjs/plugin'

// ===== 生命周期 =====

onLoad(() => {
  console.log('插件加载了')
  // 初始化资源
})

onUnload(() => {
  console.log('插件卸载了')
  // 清理资源、关闭连接等
})

// ===== 开发模式判断 =====

if (dev.isDev) {
  console.log('当前是开发模式')

  // 开发时的调试命令
  command(/^#debug$/, () => {
    return JSON.stringify(dev.stats(), null, 2)
  }, { perm: 'master' })
}

// ===== 开发日志 =====

dev.log('这只在开发模式输出')
dev.warn('开发警告')
dev.error('开发错误')

// ===== 手动重载 =====

command(/^#reload$/, async () => {
  await dev.reload()  // 重载当前文件
  return '重载完成'
}, { perm: 'master' })

command(/^#reload (.+)$/, async ctx => {
  const file = ctx.match[1]
  await dev.reloadFile(file)  // 重载指定文件
  return `已重载 ${file}`
}, { perm: 'master' })

// ===== 完整开发示例 =====

// dev/my-plugin/index.ts

import { command, ref, dev, onLoad, onUnload } from '@karinjs/plugin'

// 状态
let requestCount = 0
const startTime = Date.now()

// 生命周期
onLoad(() => {
  dev.log('我的插件已加载')
})

onUnload(() => {
  dev.log(`我的插件已卸载，共处理 ${requestCount} 次请求`)
  requestCount = 0  // 清理状态
})

// 业务逻辑
const ping = ref(/^ping$/, ctx => {
  requestCount++
  ctx.reply('pong')
})

// 开发时的调试命令
if (dev.isDev) {
  command(/^#stats$/, () => {
    return [
      `运行时间: ${Math.floor((Date.now() - startTime) / 1000)}s`,
      `请求次数: ${requestCount}`,
      `ping 状态: ${ping.disabled ? '禁用' : '启用'}`,
    ].join('\n')
  }, { perm: 'master' })

  command(/^#toggle-ping$/, () => {
    ping.disabled = !ping.disabled
    return `ping 已${ping.disabled ? '禁用' : '启用'}`
  }, { perm: 'master' })
}
```

### 3.5 热重载

```ts
import { command, ref, onUnload, dev } from '@karinjs/plugin'

// ===== 状态保留 =====

// 问题：热重载后状态丢失
let count = 0
command(/^count$/, () => `${++count}`)  // 重载后 count 重置为 0

// 解决：使用 dev.state 持久化
const state = dev.state({
  count: 0,
  users: new Set(),
})

command(/^count$/, () => `${++state.count}`)  // 重载后保留

// ===== 资源清理 =====

import { WebSocket } from 'ws'

let ws: WebSocket | null = null

onLoad(() => {
  ws = new WebSocket('wss://example.com')
  ws.on('message', handleMessage)
})

onUnload(() => {
  // 必须清理，否则热重载会创建多个连接
  ws?.close()
  ws = null
})

// ===== 定时器清理 =====

let timer: NodeJS.Timeout | null = null

onLoad(() => {
  timer = setInterval(() => {
    console.log('定时任务')
  }, 60000)
})

onUnload(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// ===== 监听器清理 =====

import { EventEmitter } from 'events'

const bus = new EventEmitter()

function onEvent(data: unknown) {
  console.log('收到事件', data)
}

onLoad(() => {
  bus.on('custom-event', onEvent)
})

onUnload(() => {
  bus.off('custom-event', onEvent)
})

// ===== 热重载最佳实践 =====

// 1. 所有外部资源都在 onLoad 中创建
// 2. 所有外部资源都在 onUnload 中清理
// 3. 需要保留的状态用 dev.state()
// 4. 响应式插件自动处理，无需手动清理

// 完整示例
import { command, ref, onLoad, onUnload, dev } from '@karinjs/plugin'
import { Database } from './database'

// 持久化状态
const state = dev.state({
  messageCount: 0,
})

// 资源
let db: Database | null = null

onLoad(async () => {
  db = new Database()
  await db.connect()
  dev.log('数据库已连接')
})

onUnload(async () => {
  await db?.disconnect()
  db = null
  dev.log('数据库已断开')
})

// 业务插件
command(/^stats$/, async ctx => {
  const dbStats = await db!.getStats()
  ctx.reply(`消息数: ${state.messageCount}, 数据库记录: ${dbStats.count}`)
})

command(/^.*/, ctx => {
  state.messageCount++  // 热重载后保留
}, { priority: 99999, log: false })  // 低优先级统计
```

### 3.6 任务 (task)

```ts
import { task, ref } from '@karinjs/plugin'

// ===== 基础用法 =====

// Cron 表达式
task('每日报告', '0 9 * * *', async () => {
  await sendDailyReport()
})

// 每分钟
task('心跳', '* * * * *', () => {
  console.log('心跳检测')
})

// 每小时
task('清理缓存', '0 * * * *', cleanCache)

// ===== 立即执行一次 =====

task('初始化', '0 0 * * *', init, { immediate: true })

// ===== 响应式任务 =====

const dailyTask = ref.task('日报', '0 9 * * *', sendReport)

// 动态控制
command(/^#暂停日报$/, () => {
  dailyTask.disabled = true
  return '日报已暂停'
}, { perm: 'master' })

command(/^#恢复日报$/, () => {
  dailyTask.disabled = false
  return '日报已恢复'
}, { perm: 'master' })

// 动态修改时间
command(/^#修改日报时间 (.+)$/, ctx => {
  dailyTask.cron = ctx.match[1]  // 如 '0 10 * * *'
  return `日报时间已修改为 ${ctx.match[1]}`
}, { perm: 'master' })
```

### 3.7 accept (通知/请求)

```ts
import { accept, ref } from '@karinjs/plugin'

// ===== 通知事件 =====

// 群成员增加
accept('notice.group.increase', ctx => {
  ctx.reply(`欢迎 ${ctx.user.nickname} 加入本群！`)
})

// 群成员减少
accept('notice.group.decrease', ctx => {
  console.log(`${ctx.user.nickname} 离开了群聊`)
})

// 好友添加
accept('notice.friend.add', ctx => {
  ctx.reply('你好，很高兴认识你！')
})

// 群禁言
accept('notice.group.ban', ctx => {
  if (ctx.duration > 0) {
    console.log(`${ctx.user.nickname} 被禁言 ${ctx.duration} 秒`)
  } else {
    console.log(`${ctx.user.nickname} 被解除禁言`)
  }
})

// ===== 请求事件 =====

// 加好友请求
accept('request.friend', async ctx => {
  // 自动同意
  await ctx.approve()
})

// 加群请求
accept('request.group', async ctx => {
  if (ctx.comment.includes('暗号')) {
    await ctx.approve()
  } else {
    await ctx.reject('请输入正确的暗号')
  }
})

// ===== 响应式 =====

const welcome = ref.accept('notice.group.increase', ctx => {
  ctx.reply('欢迎新人！')
})

// 可以动态禁用
welcome.disabled = true
```

### 3.8 handler (自定义处理器)

```ts
import { handler, ref } from '@karinjs/plugin'

// ===== 基础用法 =====

handler('render', async (data, next) => {
  // 处理渲染请求
  const result = await renderImage(data)
  return result
})

handler('ai-chat', async (data, next) => {
  // 处理 AI 对话
  const response = await callAI(data.message)
  return response
})

// ===== 优先级和链式 =====

// 高优先级处理器，可以拦截
handler('render', async (data, next) => {
  if (data.type === 'special') {
    return specialRender(data)
  }
  // 不处理，交给下一个
  return next()
}, { priority: 1 })

// 低优先级，兜底处理
handler('render', async (data, next) => {
  return defaultRender(data)
}, { priority: 9999 })

// ===== 响应式 =====

const aiHandler = ref.handler('ai-chat', handleAI)

// 切换 AI 模型
command(/^#切换模型 (.+)$/, ctx => {
  const model = ctx.match[1]
  aiHandler.callback = async (data) => {
    return callAI(data.message, { model })
  }
  return `已切换到 ${model}`
}, { perm: 'master' })
```

### 3.9 动态注册与卸载

```ts
import { ref, command } from '@karinjs/plugin'

// ===== 动态创建命令 =====

const dynamicCommands = new Map<string, RefPlugin>()

command(/^#创建命令 (\S+) (.+)$/, ctx => {
  const [, trigger, response] = ctx.match

  // 检查是否已存在
  if (dynamicCommands.has(trigger)) {
    return `命令 ${trigger} 已存在`
  }

  // 创建新命令
  const cmd = ref(new RegExp(`^${trigger}$`), response)
  dynamicCommands.set(trigger, cmd)

  return `已创建命令: ${trigger} -> ${response}`
}, { perm: 'master' })

command(/^#删除命令 (\S+)$/, ctx => {
  const trigger = ctx.match[1]
  const cmd = dynamicCommands.get(trigger)

  if (!cmd) {
    return `命令 ${trigger} 不存在`
  }

  cmd.dispose()
  dynamicCommands.delete(trigger)

  return `已删除命令: ${trigger}`
}, { perm: 'master' })

command(/^#命令列表$/, () => {
  if (dynamicCommands.size === 0) {
    return '暂无动态命令'
  }

  const list = Array.from(dynamicCommands.entries())
    .map(([trigger, cmd]) => `${trigger}: ${cmd.disabled ? '(禁用)' : '(启用)'}`)
    .join('\n')

  return `动态命令列表:\n${list}`
}, { perm: 'master' })

// ===== 批量禁用 =====

command(/^#禁用所有$/, () => {
  for (const cmd of dynamicCommands.values()) {
    cmd.disabled = true
  }
  return `已禁用 ${dynamicCommands.size} 个命令`
}, { perm: 'master' })

command(/^#启用所有$/, () => {
  for (const cmd of dynamicCommands.values()) {
    cmd.disabled = false
  }
  return `已启用 ${dynamicCommands.size} 个命令`
}, { perm: 'master' })
```

### 3.10 中间件

```ts
import { use, command } from '@karinjs/plugin'

// ===== 全局中间件 =====

// 性能监控
use(async (ctx, next) => {
  const start = Date.now()
  await next()
  console.log(`[${ctx.plugin.name}] 耗时 ${Date.now() - start}ms`)
})

// 访问日志
use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.userId}: ${ctx.msg}`)
  await next()
})

// 权限检查
use(async (ctx, next) => {
  if (ctx.plugin.perm === 'master' && !ctx.isMaster) {
    return ctx.reply('权限不足')
  }
  await next()
})

// 黑名单
const blacklist = new Set(['123456'])

use(async (ctx, next) => {
  if (blacklist.has(ctx.userId)) {
    return  // 直接忽略
  }
  await next()
})

// ===== 插件级中间件 =====

chain(/^敏感操作$/, doSomething)
  .use(async (ctx, next) => {
    // 二次确认
    await ctx.reply('确定要执行吗？回复"确定"继续')
    const confirm = await ctx.waitReply(30000)

    if (confirm?.msg === '确定') {
      await next()
    } else {
      await ctx.reply('已取消')
    }
  })

// ===== 装饰器风格中间件 =====

import { decorators } from '@karinjs/plugin'

const { cooldown, rateLimit, retry } = decorators

// 冷却时间
chain(/^签到$/, signIn)
  .use(cooldown({
    seconds: 86400,
    key: ctx => ctx.userId,
    message: '今天已经签到过了，明天再来吧',
  }))

// 速率限制
chain(/^抽卡$/, gacha)
  .use(rateLimit({
    max: 10,
    window: '1h',
    key: ctx => ctx.userId,
    message: '抽卡次数已用完，1小时后重置',
  }))

// 自动重试
chain(/^网络请求$/, fetchData)
  .use(retry({
    times: 3,
    delay: 1000,
  }))
```

---

## 四、配置文件

```ts
// karin.config.ts
import { defineConfig } from '@karinjs/plugin'

export default defineConfig({
  // 开发模式配置
  dev: {
    // 监听目录
    watch: ['./dev', './plugins'],

    // 热更新配置
    hmr: {
      // 防抖延迟
      delay: 100,
      // 忽略的文件
      ignore: ['**/*.test.ts', '**/node_modules/**'],
    },
  },

  // 插件配置
  plugins: {
    // NPM 插件
    npm: {
      // 自动发现 karin-plugin-* 包
      autoDiscover: true,
      // 手动指定
      include: ['karin-plugin-xxx'],
      exclude: ['karin-plugin-broken'],
    },

    // 本地插件目录
    local: ['./plugins'],
  },

  // 日志配置
  log: {
    level: 'info',
    // 插件日志默认开关
    plugin: true,
  },
})
```

---

## 五、目录结构

```
my-bot/
├── karin.config.ts          # 配置文件
├── plugins/                  # 本地插件（生产）
│   ├── welcome.ts           # 单文件插件
│   └── admin/               # 多文件插件
│       ├── index.ts
│       └── commands/
├── dev/                      # 开发目录（开发时热更新）
│   └── my-plugin/
│       ├── index.ts
│       └── lib/
└── node_modules/
    └── karin-plugin-xxx/    # NPM 插件
```

---

## 六、API 总结

```ts
// 创建插件
command(reg, callback, options?)    // 极简
ref(reg, callback, options?)        // 响应式
chain(reg, callback)                // 链式

// 其他类型
task(name, cron, callback, options?)
accept(event, callback, options?)
handler(key, callback, options?)

// 响应式变体
ref.task(name, cron, callback)
ref.accept(event, callback)
ref.handler(key, callback)

// 生命周期
onLoad(callback)
onUnload(callback)

// 开发环境
dev.isDev
dev.log(...args)
dev.reload()
dev.state(initial)

// 中间件
use(middleware)

// 链式终结
chain(...).ref()   // 返回响应式插件
chain(...).done()  // 返回普通插件
```

---

## 七、对比

| 方式 | 用途 | 动态控制 | 链式配置 |
|------|------|---------|---------|
| `command()` | 简单场景 | ❌ | ❌ |
| `ref()` | 需要动态控制 | ✅ | ❌ |
| `chain()` | 复杂配置 | 可选 `.ref()` | ✅ |

---

## 八、核心理念

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   三种创建方式，满足不同场景：                                    │
│                                                                │
│   command(/^ping$/, 'pong')              ← 极简，大多数情况     │
│   ref(/^ping$/, 'pong')                  ← 需要动态控制        │
│   chain(/^ping$/, 'pong').perm('master') ← 复杂配置           │
│                                                                │
│   核心原则：                                                    │
│   - 简单场景用最简 API                                          │
│   - 复杂场景有完整能力                                          │
│   - 开发体验优先                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```
