import fs from 'node:fs'
import path from 'path'
import { NpmInfo } from 'karin/utils'
import { readJson } from './readJson'

/**
 * 获取npm插件列表
 * @param showDetails - 是否返回详细信息
 * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
 */
export async function getNpmPlugins<T extends boolean> (showDetails: T): Promise<T extends true ? NpmInfo[] : string[]> {
  /** 屏蔽的依赖包列表 */
  const exclude = ['art-template', 'axios', 'chalk', 'chokidar', 'commander', 'express', 'level', 'lodash', 'log4js', 'moment', 'node-karin', 'node-schedule', 'redis', 'ws', 'yaml']

  const pkg = readJson('./package.json')
  const dependencies = Object.keys(pkg.dependencies).filter((name) => !exclude.includes(name))

  if (!showDetails) {
    const list: string[] = []
    const readPackageJson = async (name: string) => {
      try {
        const pkgPath = path.join(process.cwd(), 'node_modules', name, 'package.json')
        const pkg = readJson(pkgPath)
        if (pkg?.karin) list.push(name)
      } catch (error: any) {
        console.error(`[common] 解析 package.json 时出错：${error.stack || error.message || JSON.stringify(error)}`)
      }
    }

    await Promise.all(dependencies.map(readPackageJson))
    return list as T extends true ? NpmInfo[] : string[]
  }

  const list: NpmInfo[] = []
  /** 获取详细的npm信息 */
  const readPackageJson = async (files: string) => {
    try {
      const root = path.join(process.cwd(), 'node_modules', files)
      const pkgPath = path.join(root, 'package.json')
      const pkg = readJson(pkgPath)
      if (!pkg?.karin) return

      if (pkg?.main) {
        list.push({ plugin: files, path: path.dirname(pkg.main), file: path.basename(pkg.main), isMain: true })
      }

      if (pkg?.karin?.apps?.length) {
        pkg.karin.apps.forEach((app: string) => {
          if (!fs.existsSync(path.join(root, app))) {
            console.error(`[common] npm插件${files}的app目录${app}不存在 已跳过`)
            return
          }

          fs.readdirSync(path.join(root, app)).forEach((filename: string) => {
            /** 忽略非js文件 npm包不考虑ts */
            if (!filename.endsWith('.js')) return
            list.push({ plugin: files, path: app, file: filename, isMain: false })
          })
        })
      }
    } catch (error: any) {
      console.error(`[common] 获取npm插件列表时出错：${error.stack || error.message || JSON.stringify(error)}`)
    }
  }

  await Promise.all(dependencies.map(readPackageJson))
  return list as T extends true ? NpmInfo[] : string[]
}
