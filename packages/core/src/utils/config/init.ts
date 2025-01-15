import * as root from '@/root'
import { existToMkdirSync } from '@/utils/fs/fsSync'

const list = [
  root.basePath,
  root.configPath,
  root.dataPath,
  root.tempPath,
  root.htmlPath,
  root.consolePath,
  root.resourcePath,
]

list.map(v => existToMkdirSync(v))

const [
  { pkg, clearTemp },
  { setVersion, setRuntime },
] = await Promise.all([
  import('@/utils/config/config'),
  import('@/env'),
  import('@/utils/config/default'),
])

setVersion(pkg().version)
if (process.env.pm_id) setRuntime('pm2')

clearTemp()
