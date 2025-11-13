import fs from 'node:fs'
import path from 'node:path'
import { getDirs, getDirsSync } from '../path'

export interface NpmPackageInfo {
  /** 包名 */
  name?: string
  /** 相对路径 */
  rel?: string
  /** 绝对路径 */
  abs?: string
}

export interface GetNpmPackagesOptions<T extends keyof NpmPackageInfo | (keyof NpmPackageInfo)[] | undefined = undefined> {
  /** 忽略列表, 支持字符串或正则表达式 */
  ignore?: (string | RegExp)[]
  /** 返回字段, 默认返回包名数组 */
  fields?: T
}

type ReturnType<T extends keyof NpmPackageInfo | (keyof NpmPackageInfo)[] | undefined> = T extends (keyof NpmPackageInfo)[]
  ? Pick<Required<NpmPackageInfo>, T[number]>[]
  : T extends keyof NpmPackageInfo ? string[] : string[]

/**
 * 获取 node_modules 下的所有 npm 包(包含组织包) - 异步
 * @param options 选项配置
 * @returns 包名数组或包信息对象数组
 * @example
 * ```ts
 * await getNpmPackages()
 * // -> ['express', 'lodash', '@karinjs/core', '@types/node', ...]
 *
 * await getNpmPackages({ ignore: ['express', '@types/node'] })
 * // -> ['lodash', '@karinjs/core', ...]
 *
 * await getNpmPackages({ ignore: [/^@types\//] })
 * // -> ['express', 'lodash', ...] (排除所有 @types 包)
 *
 * await getNpmPackages({ fields: 'name' })
 * // -> ['express', 'lodash', '@karinjs/core', ...]
 *
 * await getNpmPackages({ fields: 'abs' })
 * // -> ['D:/project/node_modules/express', 'D:/project/node_modules/lodash', ...]
 *
 * await getNpmPackages({ fields: ['name', 'rel'] })
 * // -> [{ name: 'express', rel: 'node_modules/express' }, ...]
 *
 * await getNpmPackages({ fields: ['name', 'abs', 'rel'] })
 * // -> [{ name: 'express', abs: 'D:/project/node_modules/express', rel: 'node_modules/express' }, ...]
 * ```
 */
export const getNpmPackages = async <T extends keyof NpmPackageInfo | (keyof NpmPackageInfo)[] | undefined = undefined> (
  options?: GetNpmPackagesOptions<T>
): Promise<ReturnType<T>> => {
  const cwd = process.cwd()
  const nodeModulesPath = path.join(cwd, 'node_modules')

  if (!fs.existsSync(nodeModulesPath)) return [] as unknown as ReturnType<T>

  const ignore = options?.ignore || []
  const fields = options?.fields

  /** 判断需要计算哪些字段 */
  const needAbs = !fields || fields === 'abs' || (Array.isArray(fields) && fields.includes('abs'))
  const needRel = !fields || fields === 'rel' || (Array.isArray(fields) && fields.includes('rel'))

  /** 构建包信息 */
  const buildPkg = (name: string): NpmPackageInfo => {
    const pkg: NpmPackageInfo = { name }
    if (needAbs || needRel) {
      const abs = path.join(nodeModulesPath, name)
      if (needAbs) pkg.abs = abs
      if (needRel) pkg.rel = path.relative(cwd, abs)
    }
    return pkg
  }

  const packages: NpmPackageInfo[] = []
  const dirs = await getDirs(nodeModulesPath)

  await Promise.all(dirs.map(async (dir) => {
    if (dir.startsWith('.')) return

    if (dir.startsWith('@')) {
      const orgPath = path.join(nodeModulesPath, dir)
      const orgPackages = await getDirs(orgPath)

      for (const pkg of orgPackages) {
        packages.push(buildPkg(`${dir}/${pkg}`))
      }
      return
    }

    packages.push(buildPkg(dir))
  }))

  /** 提前过滤，减少后续处理 */
  const filtered = ignore.length > 0
    ? packages.filter(pkg => {
      const name = pkg.name!
      return !ignore.some(pattern =>
        pattern instanceof RegExp ? pattern.test(name) : pattern === name
      )
    })
    : packages

  if (!fields) return filtered.map(pkg => pkg.name!) as ReturnType<T>

  if (typeof fields === 'string') {
    return filtered.map(pkg => {
      const value = pkg[fields as keyof NpmPackageInfo]
      return (fields === 'abs' || fields === 'rel') && value ? value.replaceAll('\\', '/') : value
    }) as ReturnType<T>
  }

  return filtered.map(pkg => {
    const result: any = {}
    for (const key of fields) {
      const value = pkg[key as keyof NpmPackageInfo]
      result[key] = (key === 'abs' || key === 'rel') && value ? value.replaceAll('\\', '/') : value
    }
    return result
  }) as ReturnType<T>
}

/**
 * 获取 node_modules 下的所有 npm 包(包含组织包) - 同步
 * @param options 选项配置
 * @returns 包名数组或包信息对象数组
 * @example
 * ```ts
 * getNpmPackagesSync()
 * // -> ['express', 'lodash', '@karinjs/core', '@types/node', ...]
 *
 * getNpmPackagesSync({ ignore: ['express', '@types/node'] })
 * // -> ['lodash', '@karinjs/core', ...]
 *
 * getNpmPackagesSync({ ignore: [/^@types\//] })
 * // -> ['express', 'lodash', ...] (排除所有 @types 包)
 *
 * getNpmPackagesSync({ fields: 'name' })
 * // -> ['express', 'lodash', '@karinjs/core', ...]
 *
 * getNpmPackagesSync({ fields: 'abs' })
 * // -> ['D:/project/node_modules/express', 'D:/project/node_modules/lodash', ...]
 *
 * getNpmPackagesSync({ fields: ['name', 'rel'] })
 * // -> [{ name: 'express', rel: 'node_modules/express' }, ...]
 *
 * getNpmPackagesSync({ fields: ['name', 'abs', 'rel'] })
 * // -> [{ name: 'express', abs: 'D:/project/node_modules/express', rel: 'node_modules/express' }, ...]
 * ```
 */
export const getNpmPackagesSync = <T extends keyof NpmPackageInfo | (keyof NpmPackageInfo)[] | undefined = undefined> (
  options?: GetNpmPackagesOptions<T>
): ReturnType<T> => {
  const cwd = process.cwd()
  const nodeModulesPath = path.join(cwd, 'node_modules')

  if (!fs.existsSync(nodeModulesPath)) return [] as unknown as ReturnType<T>

  const ignore = options?.ignore || []
  const fields = options?.fields

  /** 判断需要计算哪些字段 */
  const needAbs = !fields || fields === 'abs' || (Array.isArray(fields) && fields.includes('abs'))
  const needRel = !fields || fields === 'rel' || (Array.isArray(fields) && fields.includes('rel'))

  /** 构建包信息 */
  const buildPkg = (name: string): NpmPackageInfo => {
    const pkg: NpmPackageInfo = { name }
    if (needAbs || needRel) {
      const abs = path.join(nodeModulesPath, name)
      if (needAbs) pkg.abs = abs
      if (needRel) pkg.rel = path.relative(cwd, abs)
    }
    return pkg
  }

  const packages: NpmPackageInfo[] = []
  const dirs = getDirsSync(nodeModulesPath)

  for (const dir of dirs) {
    if (dir.startsWith('.')) continue

    if (dir.startsWith('@')) {
      const orgPath = path.join(nodeModulesPath, dir)
      const orgPackages = getDirsSync(orgPath)

      for (const pkg of orgPackages) {
        packages.push(buildPkg(`${dir}/${pkg}`))
      }
      continue
    }

    packages.push(buildPkg(dir))
  }

  /** 提前过滤，减少后续处理 */
  const filtered = ignore.length > 0
    ? packages.filter(pkg => {
      const name = pkg.name!
      return !ignore.some(pattern =>
        pattern instanceof RegExp ? pattern.test(name) : pattern === name
      )
    })
    : packages

  if (!fields) return filtered.map(pkg => pkg.name!) as ReturnType<T>

  if (typeof fields === 'string') {
    return filtered.map(pkg => {
      const value = pkg[fields as keyof NpmPackageInfo]
      return (fields === 'abs' || fields === 'rel') && value ? value.replaceAll('\\', '/') : value
    }) as ReturnType<T>
  }

  return filtered.map(pkg => {
    const result: any = {}
    for (const key of fields) {
      const value = pkg[key as keyof NpmPackageInfo]
      result[key] = (key === 'abs' || key === 'rel') && value ? value.replaceAll('\\', '/') : value
    }
    return result
  }) as ReturnType<T>
}
