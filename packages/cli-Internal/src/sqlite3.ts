import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * 安装 sqlite3 依赖
 */
export const installSqlite3 = () => {
  try {
    console.log('开始安装 sqlite3 二进制...')
    const pkgDir = fileURLToPath(new URL('../..', import.meta.url))
    const command = 'npx -y @karinjs/prebuild-install -r napi --pkg_version=5.1.7 --pkg_name=sqlite3'
    execSync(command, {
      stdio: 'inherit',
      cwd: pkgDir
    })

    console.log('sqlite3 二进制安装完成')
  } catch (error) {
    console.error('安装 sqlite3 二进制失败:', error)
    process.exit(1)
  }
} 