import { karin, segment } from 'node-karin'

export const hello = karin.command('^(#)?你好$', async (e) => {
  await e.reply('你好啊！我是Karin，很高兴认识你~ (。・∀・)ノ', { at: false, recallMsg: 0, reply: true })
  return true
})

// 先介绍一个最简单的插件
export const test = karin.command('^(#)?测试$', '让我来展示一下我的功能吧！✨')

// 发送文本消息
export const text = karin.command('^(#)?打招呼$', segment.text('大家好呀！今天也要元气满满哦！╰(*°▽°*)╯'), { name: '打招呼' })

export const test2 = karin.command('^(#)?菜单$', '来看看我都会些什么吧~\n- #你好：打个招呼\n- #测试：功能展示\n- #打招呼：元气问候\n(｡･ω･｡)ﾉ♡', {
  event: 'message', // 监听的事件
  name: '菜单', // 插件名称
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
  authFailMsg: '哎呀，这个功能只有主人才能用哦！要不你先许个愿？(๑•̀ㅂ•́)و✧',
})
