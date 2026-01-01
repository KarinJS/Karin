/**
 * 函数式插件示例1
 */
command(/test/, async (ctx) => {
  await ctx.reply('这是一个测试命令！')
}, {
  name: '测试命令插件',
})

export class MessagePlugin extends Plugin {
  constructor () {

  }
}
