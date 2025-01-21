import fs from 'node:fs'
import * as root from '@/root'
import { existToMkdirSync } from '@/utils/fs/fsSync'

const env = () => {
  /** `.env`同步新版本 */
  const list = [
    {
      key: 'LOG_MAX_CONNECTIONS',
      value: '5',
      comment: '日志实时Api最多支持同时连接数',
    },
  ]

  const file = `${process.cwd()}/.env`
  const content = fs.readFileSync(file, 'utf-8')

  list.forEach(v => {
    if (!content.includes(v.key)) {
      fs.appendFileSync(file, `\n${v.comment}\n${v.key}=${v.value}`)
      /** tips: 记得str格式化 */
      process.env[v.key] = v.value
    }
  })
}

await (async () => {
  const list = [
    root.basePath,
    root.configPath,
    root.dataPath,
    root.tempPath,
    root.htmlPath,
    root.consolePath,
    root.resourcePath,
    root.sandboxDataPath,
    root.sandboxTempPath,
    `${root.sandboxDataPath}/avatar`,
  ]

  list.map(v => existToMkdirSync(v))

  const [
    { pkg },
    { setVersion, setRuntime },
    ,
    { clearFiles },
  ] = await Promise.all([
    import('@/utils/config/pkg'),
    import('@/env'),
    import('@/utils/config/default'),
    import('@/utils/config/admin'),
  ])

  setVersion(pkg().version)
  env()
  if (process.env.pm_id) setRuntime('pm2')

  clearFiles(root.consolePath)
})()
