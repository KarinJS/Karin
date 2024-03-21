import fs from 'node:fs'

const title = 'Karin'
/** 设置标题 */
process.title = title
/** 设置时区 */
process.env.TZ = 'Asia/Shanghai'
/** 检查node_modules */
if (!fs.existsSync('./node_modules')) {
  console.error('请先运行命令：pnpm install -P 安装依赖')
  process.exit()
}

export default title
