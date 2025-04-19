import { karin, segment } from 'node-karin'

export const hello = karin.command(/^#你好$/, async (e) => {
  await e.reply('hello', { at: false, recallMsg: 0, reply: true })
  return true
})

// 先介绍一个最简单的插件
export const test = karin.command('^文本$', '这是一段文本消息')

// 发送文本消息
export const text = karin.command(/^#文本$/, segment.text('1'), { name: '测试文本' })

export const test2 = karin.command('^文本$', '这是一段文本消息', {
  event: 'message', // 监听的事件
  name: '文本', // 插件名称
  perm: 'all', // 触发权限
  at: false, // 是否加上at 仅在群聊中有效
  reply: false, // 是否加上引用回复
  recallMsg: 0, // 发送是否撤回消息 单位秒
  log: true, // 是否启用日志
  rank: 10000, // 优先级
  adapter: [], // 生效的适配器
  dsbAdapter: [], // 禁用的适配器
  delay: 0, // 延迟回复 单位毫秒 仅在第二个参数非函数时有效
  stop: false, // 是否停止执行后续插件 仅在第二个参数非函数时有效
  authFailMsg: '暂无权限，只有主人才能操作',
})
