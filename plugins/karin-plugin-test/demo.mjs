// @ts-ignore
import { karin, segment } from '@karinjs/core'
import path from 'node:path'

karin.command('test1', async (ctx) => {
  logger.debug('123')
  await ctx.reply(segment.image(path.resolve('./image.png')))
}, { name: '测试命令1' })
