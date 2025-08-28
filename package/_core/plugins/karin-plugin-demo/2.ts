import axios from 'node-karin/axios'
import { karin, logger } from 'node-karin'
import mysql from 'mysql2/promise'

const API = 'https://nswyt.hdu.edu.cn/three/query/queryInfo'

// 创建数据库连接池
const db = mysql.createPool({
  host: '124.221.22.19:3306',
  user: '2026hdu',
  password: 'sNXP7j2wyBy3SN56',
  database: '2026hdu',
})

function generateUID () {
  return Math.floor(10000 + Math.random() * 90000).toString() // 五位随机数
}

export const plugin = karin.accept('request.groupApply', async (ctx) => {
  const { reason: reason1, flag } = ctx.content

  const matches = reason1.match(/\d{14}/)
  const studentNum = matches ? matches[0] : null

  logger.info(`请求体: ${reason1} ${studentNum}`)

  if (!studentNum) {
    return await ctx.bot.setGroupApplyResult(flag, false, '未携带有效考生号 有疑问清联系群管理')
  }

  const payload = { studentNum }
  logger.info(`请求体: ${JSON.stringify(payload, null, 2)}`)

  const { data } = await axios.post(API, payload)

  if (!data?.obj?.[0]?.studentName) {
    logger.error(`查询失败: ${JSON.stringify(data, null, 2)}`)
    return await ctx.bot.setGroupApplyResult(flag, false, '考生号有误 有疑问请联系群管理（机器人自动审核）')
  }

  const name = data.obj[0].studentName
  const number = data.obj[0].studentNum
  const qq = ctx.userId
  const uid = generateUID()

  logger.info(`鉴权成功 ${name}_${number}_${qq}`)

  try {
    await db.execute(
      'INSERT INTO students (uid, name, number, qq) VALUES (?, ?, ?, ?)',
      [uid, name, number, qq]
    )
    logger.info(`数据库插入成功: ${uid} ${name} ${number} ${qq}`)
  } catch (err) {
    logger.error(`数据库插入失败: ${err}`)
  }

  await ctx.bot.setGroupApplyResult(flag, true)
})
