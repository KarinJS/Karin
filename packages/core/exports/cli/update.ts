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
 * 更新操作的结果项
 */
interface UpdateItem {
  name: string          // 包名或插件名
  type: 'npm' | 'git'   // 类型：npm包或git插件
  currentVersion: string // 当前版本
  latestVersion: string  // 最新版本
  status: string         // 状态
  needUpdate: boolean    // 是否需要更新
  isPlugin: boolean      // 是否是正常插件
}

/**
 * 排序更新项目
 * 优先级：非插件、无更新、有更新（有更新的在最后便于查看）
 */
const sortUpdateItems = (items: UpdateItem[]): UpdateItem[] => {
  return [...items].sort((a, b) => {
    // 首先按插件类型排序（非插件在前）
    if (a.isPlugin !== b.isPlugin) {
      return a.isPlugin ? 1 : -1
    }

    // 然后按更新需求排序（需要更新的在后）
    if (a.needUpdate !== b.needUpdate) {
      return a.needUpdate ? 1 : -1
    }

    // 最后按名称排序
    return a.name.localeCompare(b.name)
  })
}

/**
 * 全部更新
 */
export const updateAll = async () => {
  try {
    console.log('开始执行更新任务\n')

    // 收集所有项目的信息
    const allItems: UpdateItem[] = []

    // 收集需要更新的包
    const packagesToUpdate: string[] = []

    // 并行执行依赖检查和插件检查
    await Promise.all([
      // 检查npm依赖
      checkDependencies('./package.json', allItems, packagesToUpdate),
      // 检查git插件
      checkPlugins('./plugins', allItems),
    ])

    // 对结果进行排序
    const sortedItems = sortUpdateItems(allItems)

    // 输出检查结果表格
    if (sortedItems.length > 0) {
      console.log('检查结果:')

      const tableData = sortedItems.map(item => {
        return {
          name: item.name,
          type: item.type,
          currentVersion: item.currentVersion,
          latestVersion: item.latestVersion,
          status: item.status,
        }
      })

      console.table(tableData)
    } else {
      console.log('没有找到需要检查的项目')
    }

    // 更新npm包
    if (packagesToUpdate.length > 0) {
      console.log('\n开始更新包:')
      try {
        const { status, error } = await exec(`pnpm update ${packagesToUpdate.join(' ')} --save`)
        if (status) {
          console.log('npm包更新完成')

          // 显示已更新的包列表
          const updatedItems = sortedItems.filter(item => item.needUpdate)
          if (updatedItems.length > 0) {
            console.log('\n已更新的项目:')
            const updatedTable = updatedItems.map(item => ({
              name: item.name,
              type: item.type,
              from: item.currentVersion,
              to: item.latestVersion,
            }))
            console.table(updatedTable)
          }
        } else {
          console.error('npm包更新失败:', error)
        }
      } catch (error) {
        console.error('npm包更新失败:', error)
      }
    }

    console.log('\n更新任务执行完成')
  } finally {
    process.exit(0)
  }
}

/**
 * 检查 package.json 中的生产依赖版本
 * @param packagePath - package.json 文件的完整路径
 * @param allItems - 收集所有项目信息的数组
 * @param packagesToUpdate - 需要更新的包数组
 */
const checkDependencies = async (packagePath: string, allItems: UpdateItem[], packagesToUpdate: string[]) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    const dependencies = packageJson.dependencies || {}

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
        if (!pkgInfo.karin && pkg !== 'node-karin') return

        const currentVersion = (version as string).replace(/[\^~]/g, '')

        /** 获取包的所有标签信息 */
        const { stdout: distTagsStr } = await exec(`pnpm view ${pkg} dist-tags --json`)
        const distTags = JSON.parse(distTagsStr.trim())

        /** 判断当前版本是否为预发布版本 */
        const isPreRelease = /[-+]/.test(currentVersion)
        const latestVersion = distTags.latest
        const needUpdate = isPreRelease || currentVersion !== latestVersion

        /** 如果当前是预发布版本或版本落后，则更新到最新版本 */
        if (needUpdate) {
          packagesToUpdate.push(`${pkg}@latest`)
          allItems.push({
            name: pkg,
            type: 'npm',
            currentVersion: `${currentVersion}${isPreRelease ? ' (预发布)' : ''}`,
            latestVersion,
            status: `${currentVersion} -> ${latestVersion}`,
            needUpdate: true,
            isPlugin: true,
          })
        } else {
          allItems.push({
            name: pkg,
            type: 'npm',
            currentVersion,
            latestVersion,
            status: '已是最新',
            needUpdate: false,
            isPlugin: true,
          })
        }
      } catch (error) {
        console.error(`检查 ${pkg} 版本失败:`, error)
      }
    })

    /** 等待所有版本检查完成 */
    await Promise.all(checkVersionTasks)
  } catch (error) {
    console.error('更新依赖失败:', error)
  }
}

/**
 * 检查 plugins 目录下所有符合条件的 Git 仓库
 * @param pluginsPath - plugins 目录的完整路径
 * @param allItems - 收集所有项目信息的数组
 */
const checkPlugins = async (pluginsPath: string, allItems: UpdateItem[]) => {
  /** 检查git是否安装 */
  if (!await checkGitInstalled()) {
    console.error('请先安装git')
    return
  }

  /** 检查plugins目录是否存在 */
  if (!fs.existsSync(pluginsPath)) {
    console.error('plugins目录不存在')
    return
  }

  const isDirectory = (await fs.promises.stat(pluginsPath)).isDirectory()
  if (!isDirectory) {
    console.error('plugins路径不是一个目录')
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
      allItems.push({
        name: dir,
        type: 'git',
        currentVersion: '-',
        latestVersion: '-',
        status: '不是git仓库，已跳过',
        needUpdate: false,
        isPlugin: false,
      })
      return
    }

    /** 检查package.json是否存在karin字段 */
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      if (!packageJson.karin) {
        allItems.push({
          name: dir,
          type: 'git',
          currentVersion: '-',
          latestVersion: '-',
          status: '非Karin插件，已跳过',
          needUpdate: false,
          isPlugin: false,
        })
        return
      }

      /** 执行git pull */
      const { status, stdout, error } = await exec('git pull', { cwd: pluginPath })

      // 从git输出判断是否已是最新
      const isUpToDate = stdout.includes('Already up to date') || stdout.includes('已经是最新的')
      const currentVersion = packageJson.version || '-'

      if (!status) {
        allItems.push({
          name: dir,
          type: 'git',
          currentVersion,
          latestVersion: '-',
          status: `更新失败: ${error}`,
          needUpdate: false,
          isPlugin: true,
        })
      } else if (isUpToDate) {
        allItems.push({
          name: dir,
          type: 'git',
          currentVersion,
          latestVersion: currentVersion,
          status: '已是最新',
          needUpdate: false,
          isPlugin: true,
        })
      } else {
        // 尝试获取更新后的版本
        try {
          // 读取更新后的package.json
          const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          const updatedVersion = updatedPackageJson.version || '已更新'

          // 更新成功且有版本变化
          allItems.push({
            name: dir,
            type: 'git',
            currentVersion,
            latestVersion: updatedVersion,
            status: `${currentVersion} -> ${updatedVersion}`,
            needUpdate: true,
            isPlugin: true,
          })
        } catch {
          // 如果无法读取更新后的版本，则使用一般状态
          allItems.push({
            name: dir,
            type: 'git',
            currentVersion,
            latestVersion: '已更新',
            status: '更新成功',
            needUpdate: true,
            isPlugin: true,
          })
        }
      }
    } catch (error) {
      allItems.push({
        name: dir,
        type: 'git',
        currentVersion: '-',
        latestVersion: '-',
        status: `处理失败: ${error}`,
        needUpdate: false,
        isPlugin: false,
      })
    }
  })

  /** 等待所有更新任务完成 */
  await Promise.all(updateTasks)
}

/**
 * 更新 package.json 中的生产依赖到最新版本
 * @param packagePath - package.json 文件的完整路径
 */
export const updateDependencies = async (packagePath: string) => {
  const allItems: UpdateItem[] = []
  const packagesToUpdate: string[] = []

  await checkDependencies(packagePath, allItems, packagesToUpdate)

  // 对结果进行排序
  const sortedItems = sortUpdateItems(allItems)

  if (sortedItems.length > 0) {
    console.log('依赖版本信息:')

    const tableData = sortedItems.map(item => {
      return {
        name: item.name,
        type: item.type,
        currentVersion: item.currentVersion,
        latestVersion: item.latestVersion,
        status: item.status,
      }
    })

    console.table(tableData)
  }

  if (packagesToUpdate.length > 0) {
    console.log('开始更新包:')
    try {
      const { status, error } = await exec(`pnpm update ${packagesToUpdate.join(' ')} --save`)
      if (status) {
        console.log('所有包更新完成')

        // 显示已更新的包列表
        const updatedItems = sortedItems.filter(item => item.needUpdate)
        if (updatedItems.length > 0) {
          console.log('\n已更新的项目:')
          const updatedTable = updatedItems.map(item => ({
            name: item.name,
            from: item.currentVersion,
            to: item.latestVersion,
          }))
          console.table(updatedTable)
        }
      } else {
        console.error('批量更新失败:', error)
      }
    } catch (error) {
      console.error('批量更新失败:', error)
    }
  } else {
    console.log('所有包都已经是最新版本')
  }
}

/**
 * 更新 plugins 目录下所有符合条件的 Git 仓库
 * @param pluginsPath - plugins 目录的完整路径
 */
export const updatePlugins = async (pluginsPath: string) => {
  const allItems: UpdateItem[] = []

  await checkPlugins(pluginsPath, allItems)

  // 对结果进行排序
  const sortedItems = sortUpdateItems(allItems)

  if (sortedItems.length > 0) {
    console.log('插件更新结果:')

    const tableData = sortedItems.map(item => {
      return {
        name: item.name,
        type: item.type,
        currentVersion: item.currentVersion,
        latestVersion: item.latestVersion,
        status: item.status,
      }
    })

    console.table(tableData)

    // 显示已更新的插件列表
    const updatedItems = sortedItems.filter(item => item.needUpdate)
    if (updatedItems.length > 0) {
      console.log('\n已更新的插件:')
      const updatedTable = updatedItems.map(item => ({
        name: item.name,
        currentVersion: item.currentVersion,
        当前版本: item.latestVersion,
      }))
      console.table(updatedTable)
    }
  } else {
    console.log('没有找到符合条件的插件')
  }
}
