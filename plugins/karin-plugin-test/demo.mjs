import { karin } from '@karinjs/core'

karin.command('test1', async (ctx) => {
  logger.debug('123')
  await ctx.reply('hmr2')
})
