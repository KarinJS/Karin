import { karin, handler } from 'node-karin'

export const test = karin.handler('test.image', (args, reject) => {
  /** 取消注释告知karin继续使用下一个处理器 */
  // reject('继续循环下一个handler')
  return 'Handler处理完成'
})

export const testHandler = karin.command(/^#?测试handler$/, async (e) => {
  const msg = '测试handler'
  /** 对于传参，开发者传自行需要的参数即可，无任何参数强制需求... */
  const res = await handler.call('test.image', { e, msg })
  await e.reply(res)
  return true
}, {
  /** 插件优先级 */
  priority: 9999,

  /** 插件触发是否打印触发日志 */
  log: true,

  /** 插件名称 */
  name: '测试handler',

  /** 谁可以触发这个插件 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' */
  permission: 'all',
})
