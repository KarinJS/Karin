import { command } from 'karin'

command('hello', /^#hello$/, async (ctx) => {
  await ctx.reply('Hello from karin v2!')
})

command('echo', /^#echo (.+)$/, async (ctx) => {
  await ctx.reply(ctx.match![1])
})

command('help', /^#help$/, async (ctx) => {
  await ctx.reply('可用命令: #hello, #echo <内容>, #help')
})
