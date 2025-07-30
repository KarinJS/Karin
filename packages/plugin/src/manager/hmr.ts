// import path from 'node:path'
// import chokidar from 'chokidar'
// import { importModule } from '@/utils'
// import { load } from '@/plugins/load'
// import { getModuleType, isDev } from '@/env'
// import { formatPath } from '@/utils/fs/path'
// import { loadClass } from '@/core/karin/class'
// import { cache, getPackageName } from '@/plugins/manager'
// import { sort, unregisterApp } from '@/plugins/register'

import type { FSWatcher } from 'chokidar'

/**
 * 监听插件变化的watcher
 */
export let watcher: FSWatcher

/**
 * 初始化插件热重载
 */
export const initPluginHmr = async () => {
  // /**
  //  * 监听的目录
  //  * @description 这里的目录全部都是apps目录
  //  */
  // const watchDirs = new Set<string>()

  // Array.from(cache.pluginsDetails.values()).forEach((pkg) => {
  //   if (!isDev() && pkg.type !== 'apps') return
  //   pkg.appsDirs.forEach(dir => watchDirs.add(dir))
  // })

  // watcher = chokidar.watch(Array.from(watchDirs), {
  //   ignoreInitial: true,
  //   ignored: /(^|[/\\])\../,
  // })

  // watcher
  //   .on('add', file => handleFileChange(file, 'add'))
  //   .on('change', file => handleFileChange(file, 'change'))
  //   .on('unlink', file => handleFileChange(file, 'unlink'))

  // /** 打印相对路径 */
  // const relativePaths = Array.from(watchDirs).map(dir => {
  //   return path.relative(process.cwd(), dir).replace(/\\/g, '/')
  // })

  // watchDirs.clear()
  // relativePaths.length
  //   ? logger.info(`\n[hmr] ${logger.magenta('正在监听文件夹')}:\n  ${relativePaths.join('\n  ')}`)
  //   : logger.info('[hmr] 当前监听的插件列表为空')
}

/**
 * 处理文件变化
 * @param file 文件路径
 * @param action 操作类型
 */
// const handleFileChange = async (file: string, action: 'add' | 'change' | 'unlink') => {
//   /** 文件后缀 */
//   const ext = path.extname(file)
//   const exts = getModuleType()
//   if (!exts.includes(ext)) return
//   file = formatPath(file)
//   const pkgName = getPackageName(file)
//   /** 前缀 */
//   const prefix = `[hmr][${pkgName}]`

//   /** 相对路径 */
//   const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/')
//   logger.debug(`${prefix} 文件${action}: ${relativePath}`)

//   if (action === 'unlink') {
//     unregisterApp(file)
//     logger.info(`${prefix} 卸载成功: ${path.basename(file)}`)
//     return
//   }

//   if (action === 'change') {
//     unregisterApp(file)
//   }

//   try {
//     await reloadApp(file)
//     const actionText = action === 'add' ? '新增插件' : '重载完成'
//     logger.info(`${prefix} ${actionText}: ${path.basename(file)}`)
//   } catch (error) {
//     logger.error(`${prefix} 加载失败:`)
//     logger.error(error)
//   }
// }

/**
 * 热加载一个App文件
 * @param file 文件路径
 */
export const reloadApp = async (file: string) => {
  console.log(file)
  // const { status, data } = await importModule(file, true)
  // if (status) {
  //   const pkgName = getPackageName(file) || 'null'
  //   loadClass(pkgName, file, data)
  // }

  // sort()
}

/**
 * 热加载一个插件包
 * @param pkgName 插件包名称
 */
export const reloadPackage = async (pkgName: string) => {
  console.log(pkgName)
  // await load(pkgName)
  // sort()
}
