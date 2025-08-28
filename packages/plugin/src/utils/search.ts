import fs from 'node:fs'
import path from 'node:path'
import { getFolders, getFoldersSync, hasKarinField, hasKarinFieldSync } from './file'

type SearchResult = {
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
export const searchNpm = async (dir: string = process.cwd()) => {
  const list: SearchResult[] = []

  const files = await getFolders(dir)
  await Promise.all(files.map(async (file) => {
    if (file.startsWith('@')) {
      const scopedFiles = await getFolders(path.join(dir, file))
      scopedFiles.forEach((name) => {
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
export const searchNpmSync = (dir: string = process.cwd()) => {
  const list: SearchResult[] = []

  const files = getFoldersSync(dir)
  files.forEach((file) => {
    if (file.startsWith('@')) {
      const scopedFiles = getFoldersSync(path.join(dir, file))
      scopedFiles.forEach((name) => {
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
export const searchGitAndApps = async (dir: string = process.cwd()) => {
  const git: SearchResult[] = []
  const apps: SearchResult[] = []

  const files = await getFolders(dir)
  await Promise.all(files.map(async (file) => {
    const pkgDir = path.join(dir, file)
    const packageDir = path.join(pkgDir, 'package.json')

    if (!await fs.promises.stat(packageDir)) return

    if (await hasKarinField(packageDir)) {
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
export const searchGitAndAppsSync = (dir: string = process.cwd()) => {
  const git: SearchResult[] = []
  const apps: SearchResult[] = []

  const files = getFoldersSync(dir)
  files.forEach((file) => {
    const pkgDir = path.join(dir, file)
    const packageDir = path.join(pkgDir, 'package.json')

    if (!fs.existsSync(packageDir)) return

    if (hasKarinFieldSync(packageDir)) {
      return git.push({ name: file, path: pkgDir })
    }

    apps.push({ name: file, path: pkgDir })
  })

  return { git, apps }
}
