import fs from 'fs'

/**
 * 获取当前的包管理器 根据锁文件判断 优先级 pnpm > yarn > npm > cnpm
 */
export const getRegistry = (): 'pnpm' | 'cnpm' | 'yarn' | 'npm' => {
  if (fs.existsSync('./pnpm-lock.yaml')) return 'pnpm'
  if (fs.existsSync('./yarn.lock')) return 'yarn'
  if (fs.existsSync('./package-lock.json')) return 'npm'
  // cnpm 没有锁文件
  return 'cnpm'
}
