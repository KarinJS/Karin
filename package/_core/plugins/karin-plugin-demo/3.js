import axios from 'node-karin/axios'
import { karin, segment } from 'node-karin'
import util from 'node:util'

export const test = karin.command(/^test$/, async (ctx) => {
  try {
    const url = 'https://q1.qlogo.cn/g?b=qq&s=0&nk=1250226509'
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': 'axios/1.9.0',
        'Accept-Encoding': 'gzip, compress, deflate, br',
      },
    })
    const base64 = Buffer.from(res.data).toString('base64')
    await ctx.reply(segment.image(`base64://${base64}`))
  } catch (error) {
    await ctx.reply('获取失败')
    await ctx.reply(JSON.stringify(util.format(error)))
  }
}, { name: 'test', description: '测试命令' })
