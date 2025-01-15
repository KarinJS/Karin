import fs from 'node:fs'
import { join } from 'node:path'
import { exec } from './exec'

/**
 * 检查系统是否安装了 Git
 * @returns 如果安装了 Git 返回 true，否则返回 false
 */
const checkGitInstalled = async () => {
  try {
    const { status } = await exec('git --version')
    return status
  } catch {
    return false
  }
}

/**
 * 更新 package.json 中的生产依赖到最新版本
 * @param packagePath - package.json 文件的完整路径
 */
export const updateDependencies = async (packagePath: string) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    const dependencies = packageJson.dependencies || {}

    /** 需要更新的包 */
    const packagesToUpdate: string[] = []

    /** 并发检查所有包的版本 */
    const checkVersionTasks = Object.entries(dependencies).map(async ([pkg, version]) => {
      /** 跳过类型包 */
      if (pkg.startsWith('@types/')) {
        return
      }

      try {
        /** 获取包的 package.json 信息 */
        const { stdout: pkgInfoStr } = await exec(`pnpm view ${pkg} --json`)
        const pkgInfo = JSON.parse(pkgInfoStr.trim())

        /** 检查是否包含 karin 字段 */
        if (!pkgInfo.karin) return

        const currentVersion = (version as string).replace(/[\^~]/g, '')

        /** 获取包的所有标签信息 */
        const { stdout: distTagsStr } = await exec(`pnpm view ${pkg} dist-tags --json`)
        const distTags = JSON.parse(distTagsStr.trim())

        /** 判断当前版本是否为预发布版本 */
        const isPreRelease = /[-+]/.test(currentVersion)
        const latestVersion = distTags.latest

        console.log(`[npm] ${pkg}:`)
        console.log(`  当前版本: ${currentVersion}${isPreRelease ? ' (预发布版本)' : ''}`)
        console.log(`  最新版本: ${latestVersion}`)

        /** 如果当前是预发布版本或版本落后，则更新到最新版本 */
        if (isPreRelease || currentVersion !== latestVersion) {
          console.log(`[npm] 发现新版本 ${pkg}: ${currentVersion} -> ${latestVersion}`)
          packagesToUpdate.push(`${pkg}@latest`)
        } else {
          console.log(`[npm] ${pkg} 已经是最新版本`)
        }
      } catch (error) {
        console.error(`[npm] 检查 ${pkg} 版本失败:`, error)
      }
    })

    /** 等待所有版本检查完成 */
    await Promise.all(checkVersionTasks)

    /** 如果有需要更新的包，统一更新 */
    if (packagesToUpdate.length > 0) {
      console.log('[npm] 开始更新以下包:\n', packagesToUpdate.join('\n'))
      try {
        const { status, error } = await exec(`pnpm update ${packagesToUpdate.join(' ')}`)
        if (status) {
          console.log('[npm] 所有插件更新完成')
        } else {
          console.error('[npm] 批量更新失败:', error)
        }
      } catch (error) {
        console.error('[npm] 批量更新失败:', error)
      }
    } else {
      console.log('[npm] 所有插件都已经是最新版本')
    }
  } catch (error) {
    console.error('[npm] 更新依赖失败:', error)
  }
}

/**
 * 更新 plugins 目录下所有符合条件的 Git 仓库
 * @param pluginsPath - plugins 目录的完整路径
 */
export const updatePlugins = async (pluginsPath: string) => {
  /** 检查git是否安装 */
  if (!await checkGitInstalled()) {
    console.error('[git] 请先安装git')
    return
  }

  /** 检查plugins目录是否存在 */
  if (!fs.existsSync(pluginsPath)) {
    console.error('[git] plugins目录不存在')
    return
  }

  const isDirectory = (await fs.promises.stat(pluginsPath)).isDirectory()
  if (!isDirectory) {
    console.error('[git] plugins路径不是一个目录')
    return
  }

  /** 获取所有插件目录 */
  const dirs = await fs.promises.readdir(pluginsPath)

  /** 并发更新所有插件 */
  const updateTasks = dirs.map(async (dir) => {
    const pluginPath = join(pluginsPath, dir)
    const gitPath = join(pluginPath, '.git')
    const packageJsonPath = join(pluginPath, 'package.json')

    /** 检查是否是目录且以karin-plugin-开头 */
    if (!dir.startsWith('karin-plugin-') || !(await fs.promises.stat(pluginPath)).isDirectory()) {
      return
    }

    /** 检查.git目录是否存在 */
    if (!fs.existsSync(gitPath)) {
      console.log(`[git] ${dir} 不是git仓库，跳过`)
      return
    }

    /** 检查package.json是否存在karin字段 */
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      if (!packageJson.karin) {
        console.log(`[git] ${dir} 的package.json中没有karin字段，跳过`)
        return
      }

      /** 执行git pull */
      console.log(`[git] 正在更新 ${dir}...`)
      const { status, error } = await exec('git pull', { cwd: pluginPath })
      if (!status) {
        console.error(`[git] 更新 ${dir} 失败:`, error)
      }
    } catch (error) {
      console.error(`[git] 更新 ${dir} 失败:`, error)
    }
  })

  /** 等待所有更新任务完成 */
  await Promise.all(updateTasks)
}

/**
 * 全部更新
 */
export const updateAll = async () => {
  try {
    console.log('[all] 开始执行更新任务\n')
    await Promise.all([updateDependencies('./package.json'), updatePlugins('./plugins')])
    console.log('\n[all] 更新任务执行完成')
  } finally {
    process.exit(0)
  }
}
