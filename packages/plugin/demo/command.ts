import { command } from '../src/create/command'

/**
 * 示例1: 单个事件类型（原有功能保持不变）
 * - ctx 的类型是对应的单个事件类型
 */
const singleEventCommand = command(/^#测试/, async (ctx, _next) => {
  // ctx 的类型是 DirectMessage
  console.log(`收到消息: ${ctx.msg}`)
  await ctx.reply('单个事件响应')
}, {
  event: 'message.direct',
})

/**
 * 示例2: 多个事件类型（新功能）
 * - ctx 的类型是联合类型: GroupMessage | FriendMessage
 * - 可以使用类型守卫进行类型判断
 */
const multiEventCommand = command(/^#多事件/, async (ctx, _next) => {
  // 使用类型守卫判断具体的事件类型
  if (ctx.isGroup) {
    console.log(`群聊消息: ${ctx.msg}`)
    await ctx.reply('这是群聊响应')
  } else if (ctx.isFriend) {
    console.log(`好友消息: ${ctx.msg}`)
    await ctx.reply('这是好友响应')
  }
}, {
  event: ['message.group', 'message.friend'], // 支持事件数组
})

/**
 * 示例3: 所有消息事件类型
 * - 监听所有消息场景
 * - 使用 switch 语句处理不同场景
 */
const allMessageEventCommand = command(/^#全部/, async (ctx, _next) => {
  console.log(`收到来自 ${ctx.contact.scene} 的消息: ${ctx.msg}`)

  switch (ctx.contact.scene) {
    case 'group':
      await ctx.reply('群聊响应')
      break
    case 'friend':
      await ctx.reply('好友响应')
      break
    case 'guild':
      await ctx.reply('频道响应')
      break
    case 'direct':
      await ctx.reply('频道私信响应')
      break
    case 'groupTemp':
      await ctx.reply('群临时会话响应')
      break
  }
}, {
  event: ['message.group', 'message.friend', 'message.guild', 'message.direct', 'message.groupTemp'],
})

/**
 * 示例4: 使用字符串回复（也支持事件数组）
 * - 快速回复，不需要编写回调函数
 */
const stringResponseCommand = command(/^#自动回复/, '这是自动回复', {
  event: ['message.group', 'message.friend'],
  at: true, // 在群聊中@发送者
  reply: true, // 引用回复
})

/**
 * 示例5: 权限控制与事件数组结合
 * - 在多个场景中使用相同的权限控制
 */
const permissionCommand = command(/^#管理/, async (ctx, _next) => {
  if (ctx.isGroup) {
    await ctx.reply('群聊管理功能')
  } else if (ctx.isFriend) {
    await ctx.reply('私聊管理功能')
  }
}, {
  event: ['message.group', 'message.friend'],
  permission: 'admin', // 仅管理员可用
  authFailMsg: '此功能仅管理员可用',
})

/**
 * 示例6: 优先级与事件数组
 * - 不同场景使用相同的优先级
 * - 数字越小优先级越高，越先执行
 * - 默认优先级：10000
 */
const priorityCommand = command(/^#优先/, async (ctx, _next) => {
  await ctx.reply('高优先级响应')
}, {
  event: ['message.group', 'message.friend', 'message.guild'],
  priority: 100, // 高优先级（数字小，优先执行）
})

/**
 * 示例7: 低优先级插件
 * - 在其他插件执行后再执行
 */
const lowPriorityCommand = command(/^#最后/, async (ctx, _next) => {
  await ctx.reply('低优先级响应')
}, {
  event: ['message.group', 'message.friend'],
  priority: 20000, // 低优先级（数字大，最后执行）
})

export {
  singleEventCommand,
  multiEventCommand,
  allMessageEventCommand,
  stringResponseCommand,
  permissionCommand,
  priorityCommand,
  lowPriorityCommand,
}
