import fs from 'node:fs'
import { hooks, karin, logger, segment } from 'node-karin'

export const demo = karin.command('demo', async (e, next) => {
  try {
    const result = await e.bot.getMsg(e.replyId)
    return result
  } catch (err) {
    return err.stack
  }
}, {
  name: 'reg',
})

// /** 5秒之后更换reg */
// setTimeout(() => {
//   console.log('更换reg')
//   // demo.control.setReg(/^123$/)
// }, 5000)

// const id = hooks.message.group((ctx, next) => {
//   console.log(ctx)
//   fs.writeFileSync('1.txt', JSON.stringify(ctx, null, 2))
//   next()
// })

// console.log(id)

// hooks.message.remove(1)

logger.trace('测试12')
logger.debug('测试')
logger.info('测试')
logger.warn('测试')
logger.error('测试')
logger.fatal('测试')
logger.mark('测试12')
