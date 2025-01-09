// import * as root from '@/root'
// import { setRuntime, setVersion } from '@/env'
// import { clearTemp, pkg } from './config'
// import { existToMkdirSync } from '../fs/fsSync'

/**
 * 初始化配置
 */
export const init = async () => {
  const { pkg } = await import('@/utils/config/config')
  const { setVersion, setRuntime } = await import('@/env')
  const { existToMkdirSync } = await import('@/utils/fs/fsSync')
  const { clearTemp } = await import('@/utils/config/config')
  const root = await import('@/root')

  setVersion(pkg().version)
  if (process.env.pm_id) setRuntime('pm2')

  clearTemp()
  const list = [
    root.basePath,
    root.configPath,
    root.dataPath,
    root.tempPath,
    root.htmlPath,
    root.consolePath,
  ]

  list.map(v => existToMkdirSync(v))
}
