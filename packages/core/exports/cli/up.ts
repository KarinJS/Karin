import { join } from 'path'
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { readdir, stat } from 'fs/promises'

/**
 * 检查系统是否安装了 Git
 * @returns {boolean} 如果安装了 Git 返回 true，否则返回 false
 */
const checkGitInstalled = () => {
  try {
    execSync('git --version')
    return true
  } catch {
    return false
  }
}

/**
 * 更新 package.json 中的生产依赖到最新版本
 * @param packagePath - package.json 文件的完整路径
 * @throws 如果更新过程中发生错误
 * @example
 * ```ts
 * await updateDependencies('./package.json')
 * ```
 */
export const updateDependencies = async (packagePath: string) => {
  try {
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
    const dependencies = packageJson.dependencies || {}

    /** 需要更新的包 */
    const packagesToUpdate: string[] = []

    for (const [pkg, version] of Object.entries(dependencies)) {
      /** 跳过类型包 */
      if (pkg.startsWith('@types/')) {
        continue
      }

      try {
        /** 检查是否有新版本 */
        const latestVersion = execSync(`pnpm view ${pkg} version`, { encoding: 'utf-8' }).trim()
        const currentVersion = (version as string).replace(/[\^~]/g, '')

        if (latestVersion !== currentVersion) {
          console.log(`发现新版本 ${pkg}: ${currentVersion} -> ${latestVersion}`)
          packagesToUpdate.push(`${pkg}@latest`)
        } else {
          console.log(`${pkg} 已经是最新版本`)
        }
      } catch (error) {
        console.error(`检查 ${pkg} 版本失败:`, error)
      }
    }

    /** 如果有需要更新的包，统一更新 */
    if (packagesToUpdate.length > 0) {
      console.log('\n开始更新以下包:\n', packagesToUpdate.join('\n'))
      try {
        execSync(`pnpm update ${packagesToUpdate.join(' ')}`, {
          stdio: 'inherit',
        })
        console.log('\n所有包更新完成')
      } catch (error) {
        console.error('批量更新失败:', error)
      }
    } else {
      console.log('\n所有包都已经是最新版本')
    }
  } catch (error) {
    console.error('更新依赖失败:', error)
  }
}

/**
 * 更新 plugins 目录下所有符合条件的 Git 仓库
 *
 * 更新条件：
 * 1. 目录名以 karin-plugin- 开头
 * 2. 存在 .git 目录
 * 3. package.json 中包含 karin 字段
 *
 * @param pluginsPath - plugins 目录的完整路径
 * @throws 如果目录不存在或者更新过程中发生错误
 * @example
 * ```ts
 * await updatePlugins('./plugins')
 * ```
 */
export const updatePlugins = async (pluginsPath: string) => {
  /** 检查git是否安装 */
  if (!checkGitInstalled()) {
    console.error('请先安装git')
    return
  }

  /** 检查plugins目录是否存在 */
  if (!existsSync(pluginsPath)) {
    console.error('plugins目录不存在')
    return
  }

  const isDirectory = (await stat(pluginsPath)).isDirectory()
  if (!isDirectory) {
    console.error('plugins路径不是一个目录')
    return
  }

  /** 获取所有插件目录 */
  const dirs = await readdir(pluginsPath)

  for (const dir of dirs) {
    const pluginPath = join(pluginsPath, dir)
    const gitPath = join(pluginPath, '.git')
    const packageJsonPath = join(pluginPath, 'package.json')

    /** 检查是否是目录且以karin-plugin-开头 */
    if (!dir.startsWith('karin-plugin-') || !(await stat(pluginPath)).isDirectory()) {
      continue
    }

    /** 检查.git目录是否存在 */
    if (!existsSync(gitPath)) {
      console.log(`${dir} 不是git仓库，跳过`)
      continue
    }

    /** 检查package.json是否存在karin字段 */
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      if (!packageJson.karin) {
        console.log(`${dir} 的package.json中没有karin字段，跳过`)
        continue
      }

      /** 执行git pull */
      console.log(`正在更新 ${dir}...`)
      execSync('git pull', { cwd: pluginPath, stdio: 'inherit' })
    } catch (error) {
      console.error(`更新 ${dir} 失败:`, error)
    }
  }
}

/**
 * 全部更新
 */
export const updateAll = async () => {
  try {
    await Promise.all([updateDependencies('./package.json'), updatePlugins('./plugins')])
  } finally {
    process.exit(0)
  }
}
