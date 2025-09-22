import fs from 'node:fs'
import path from 'node:path'
import { getFolders, getFoldersSync, hasKarinField, hasKarinFieldSync } from './file'

/** 搜索结果类型 */
export type SearchResult = {
  /** 包名 */
  name: string
  /** 包路径 */
  path: string
}

/**
 * 查找所有的npm包
 * @param dir 查找的目录
 * @returns 返回所有的npm包
 * @example
 * ```ts
 * const npmFiles = await searchNpm()
 * console.log(npmFiles)
 * // => [
 * //   { name: '@karinjs/demo', path: '/root/karin/node_modules/@karinjs/demo' },
 * //   { name: 'axios', path: '/root/karin/node_modules/axios' },
 * // ]
 * ```
 */
export const searchNpm = async (dir: string = process.cwd()): Promise<SearchResult[]> => {
  const list: SearchResult[] = []

  const files = await getFolders(dir)
  await Promise.all(files.map(async (file: string) => {
    if (file.startsWith('@')) {
      const scopedFiles = await getFolders(path.join(dir, file))
      scopedFiles.forEach((name: string) => {
        list.push({ name: `${file}/${name}`, path: path.join(dir, file, name) })
      })
      return
    }

    list.push({ name: file, path: path.join(dir, file) })
  }))

  return list
}

/**
 * 同步查找所有的npm包
 * @param dir 查找的目录
 * @returns 返回所有的npm包
 * @example
 * ```ts
 * const npmFiles = searchNpmSync()
 * console.log(npmFiles)
 * // => [
 * //   { name: '@karinjs/demo', path: '/root/karin/node_modules/@karinjs/demo' },
 * //   { name: 'axios', path: '/root/karin/node_modules/axios' },
 * // ]
 * ```
 */
export const searchNpmSync = (dir: string = process.cwd()): SearchResult[] => {
  const list: SearchResult[] = []

  const files = getFoldersSync(dir)
  files.forEach((file: string) => {
    if (file.startsWith('@')) {
      const scopedFiles = getFoldersSync(path.join(dir, file))
      scopedFiles.forEach((name: string) => {
        list.push({ name: `${file}/${name}`, path: path.join(dir, file, name) })
      })
      return
    }

    list.push({ name: file, path: path.join(dir, file) })
  })

  return list
}

/**
 * 查找所有符合条件的git、apps包
 * @param dir 查找的目录
 */
export const searchGitAndApps = async (dir: string = process.cwd()): Promise<{ git: SearchResult[], apps: SearchResult[] }> => {
  const git: SearchResult[] = []
  const apps: SearchResult[] = []

  const files = await getFolders(dir)
  await Promise.all(files.map(async (file: string) => {
    const pkgDir = path.join(dir, file)
    const packageJsonPath = path.join(pkgDir, 'package.json')

    if (!await fs.promises.stat(packageJsonPath).catch(() => null)) return

    if (await hasKarinField(packageJsonPath)) {
      return git.push({ name: file, path: pkgDir })
    }

    apps.push({ name: file, path: pkgDir })
  }))

  return { git, apps }
}

/**
 * 同步查找所有符合条件的git、apps包
 * @param dir 查找的目录
 */
export const searchGitAndAppsSync = (dir: string = process.cwd()): { git: SearchResult[], apps: SearchResult[] } => {
  const git: SearchResult[] = []
  const apps: SearchResult[] = []

  const files = getFoldersSync(dir)
  files.forEach((file: string) => {
    const pkgDir = path.join(dir, file)
    const packageJsonPath = path.join(pkgDir, 'package.json')

    if (!fs.existsSync(packageJsonPath)) return

    if (hasKarinFieldSync(packageJsonPath)) {
      return git.push({ name: file, path: pkgDir })
    }

    apps.push({ name: file, path: pkgDir })
  })

  return { git, apps }
}
