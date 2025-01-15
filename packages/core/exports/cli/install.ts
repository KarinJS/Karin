import { execSync } from './exec'

/**
 * 安装pm2
 */
export const installPm2 = (): boolean => {
  const { status: pm2 } = execSync('pm2 -v')
  if (pm2) return true
  const { status } = execSync('npm install -g pm2')
  return status
}

/**
 * 安装ffmpeg
 */
export const installFfmpeg = () => {
  // const { status } = execSync('ffmpeg -version')
  // if (status) return true
  // const { status: status2 } = execSync('npm install -g ffmpeg')
  // return status2
}
