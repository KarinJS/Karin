import fs from 'node:fs'
import path from 'node:path'
import { getPnpmVersion } from './pnpm'
import { BUILD_DEPENDENCIES, dedupe, isPlainObject, readYamlFile, updateYamlFile } from './workspace'
import type { WorkspaceData } from './workspace'

/**
 * 构建脚本白名单说明
 * - allowBuilds: pnpm 10.26+/11+ 读取 值为 false 表示显式禁止
 * - onlyBuiltDependencies: pnpm 10.x 读取 11+ 已移除 因此仅在 pnpm <= 10 或版本未知时维护
 */

/**
 * 获取当前工作目录的 pnpm-workspace.yaml 文件路径
 * @returns pnpm-workspace.yaml 文件的绝对路径
 */
const getWorkspaceFilePath = (): string => {
  const filePath = path.join(process.cwd(), 'pnpm-workspace.yaml')
  if (!fs.existsSync(filePath)) {
    throw new Error('pnpm-workspace.yaml 文件不存在')
  }
  return filePath
}

/**
 * 解析依赖名称 支持空格或逗号分隔
 * @param dependencies 依赖名称
 */
const parseDependencies = (dependencies: string) => {
  return dedupe(dependencies.split(/[\s,]+/).filter(Boolean))
}

/**
 * 当前pnpm是否需要维护 onlyBuiltDependencies
 */
const useOnlyBuilt = () => {
  const version = getPnpmVersion()
  return !version || version.major <= 10
}

/**
 * 读取白名单
 * @param data pnpm-workspace.yaml 内容
 */
const getLists = (data: WorkspaceData) => {
  const allowBuilds: Record<string, boolean> = isPlainObject(data.allowBuilds) ? data.allowBuilds : {}
  const onlyBuilt: string[] = Array.isArray(data.onlyBuiltDependencies) ? data.onlyBuiltDependencies : []
  return { allowBuilds, onlyBuilt }
}

/**
 * 添加构建依赖
 * @param dependencies 依赖包名称，可以是单个依赖或以空格、逗号分隔的多个依赖
 */
const addBuildDependency = (dependencies: string) => {
  const result = { added: [] as string[], existed: [] as string[] }
  try {
    const filePath = getWorkspaceFilePath()
    const depList = parseDependencies(dependencies)

    if (depList.length === 0) {
      console.log('提示：请提供有效的依赖名称')
      return result
    }

    const withOnlyBuilt = useOnlyBuilt()
    updateYamlFile<WorkspaceData>(filePath, (data) => {
      const { allowBuilds, onlyBuilt } = getLists(data)

      depList.forEach(dependency => {
        const exists = allowBuilds[dependency] === true && (!withOnlyBuilt || onlyBuilt.includes(dependency))
        if (exists) {
          result.existed.push(dependency)
        } else {
          result.added.push(dependency)
        }

        /** 显式添加会覆盖之前设为 false 的条目 */
        allowBuilds[dependency] = true
        if (withOnlyBuilt && !onlyBuilt.includes(dependency)) onlyBuilt.push(dependency)
      })

      data.allowBuilds = allowBuilds
      if (withOnlyBuilt) data.onlyBuiltDependencies = onlyBuilt
      return data
    })

    if (result.added.length > 0) {
      console.log(`成功：已添加 ${result.added.length} 个依赖到构建脚本白名单中`)
    }

    if (result.existed.length > 0) {
      console.log(`提示：${result.existed.length} 个依赖已存在于构建脚本白名单中，无需添加`)
    }
  } catch (error) {
    console.error(`错误：添加构建依赖失败 - ${(error as Error).message}`)
  }
  return result
}

/**
 * 删除构建依赖
 *
 * karin 内置的构建依赖会在 allowBuilds 中设为 false (否则 karin init 会重新加入)
 * 其他依赖直接从白名单中移除
 * @param dependencies 依赖包名称，可以是单个依赖或以空格、逗号分隔的多个依赖
 */
const removeBuildDependency = (dependencies: string) => {
  const result = { removed: [] as string[], notExist: [] as string[] }
  try {
    const filePath = getWorkspaceFilePath()
    const depList = parseDependencies(dependencies)

    if (depList.length === 0) {
      console.log('提示：请提供有效的依赖名称')
      return result
    }

    updateYamlFile<WorkspaceData>(filePath, (data) => {
      const { allowBuilds, onlyBuilt } = getLists(data)
      const hasOnlyBuilt = Array.isArray(data.onlyBuiltDependencies)

      depList.forEach(dependency => {
        if (allowBuilds[dependency] !== true && !onlyBuilt.includes(dependency)) {
          result.notExist.push(dependency)
          return
        }

        result.removed.push(dependency)
        if (BUILD_DEPENDENCIES.includes(dependency)) {
          allowBuilds[dependency] = false
        } else {
          delete allowBuilds[dependency]
        }
      })

      data.allowBuilds = allowBuilds
      if (hasOnlyBuilt) data.onlyBuiltDependencies = onlyBuilt.filter(dep => !result.removed.includes(dep))
      return data
    })

    if (result.removed.length > 0) {
      console.log(`成功：已从构建脚本白名单中删除 ${result.removed.length} 个依赖`)
    }

    if (result.notExist.length > 0) {
      console.log(`提示：${result.notExist.length} 个依赖不存在于构建脚本白名单中，无需删除`)
    }
  } catch (error) {
    console.error(`错误：删除构建依赖失败 - ${(error as Error).message}`)
  }
  return result
}

/**
 * 列出所有构建依赖
 */
const listBuildDependencies = () => {
  const result = { allowed: [] as string[], denied: [] as string[] }
  try {
    const { allowBuilds, onlyBuilt } = getLists(readYamlFile(getWorkspaceFilePath()))
    const entries = Object.entries(allowBuilds)
    result.denied = entries.filter(([, value]) => value === false).map(([dep]) => dep)
    result.allowed = dedupe([
      ...entries.filter(([, value]) => value === true).map(([dep]) => dep),
      ...(useOnlyBuilt() ? onlyBuilt : []),
    ]).filter(dep => !result.denied.includes(dep))

    if (result.allowed.length === 0) {
      console.log('提示：构建脚本白名单为空，没有构建依赖')
    } else {
      console.log('==== 构建脚本白名单 ====')
      result.allowed.forEach(dep => console.log(dep))
      console.log('==== 共 ' + result.allowed.length + ' 个依赖 ====')
    }

    if (result.denied.length > 0) {
      console.log('==== 已禁止执行构建脚本 ====')
      result.denied.forEach(dep => console.log(dep))
    }
  } catch (error) {
    console.error(`错误：列出构建依赖失败 - ${(error as Error).message}`)
  }
  return result
}

/**
 * 构建依赖管理
 */
export const buildDep = {
  add: addBuildDependency,
  rm: removeBuildDependency,
  ls: listBuildDependencies,
}
