import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

/**
 * 获取当前工作目录的 pnpm-workspace.yaml 文件路径
 * @returns pnpm-workspace.yaml 文件的绝对路径
 */
const getWorkspaceFilePath = (): string => {
  const cwd = process.cwd()
  return path.join(cwd, 'pnpm-workspace.yaml')
}

/**
 * 读取 pnpm-workspace.yaml 文件
 * @returns 解析后的 YAML 文件内容
 */
const readWorkspaceFile = (): any => {
  const filePath = getWorkspaceFilePath()
  if (!fs.existsSync(filePath)) {
    throw new Error('pnpm-workspace.yaml 文件不存在')
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return yaml.parse(fileContent)
}

/**
 * 写入 pnpm-workspace.yaml 文件
 * @param content 要写入的内容
 */
const writeWorkspaceFile = (content: any): void => {
  const filePath = getWorkspaceFilePath()
  const yamlStr = yaml.stringify(content)
  fs.writeFileSync(filePath, yamlStr, 'utf-8')
}

/**
 * 添加构建依赖
 * @param dependencies 依赖包名称，可以是单个依赖或以空格分隔的多个依赖
 */
const addBuildDependency = (dependencies: string): void => {
  try {
    const content = readWorkspaceFile()
    const depList = dependencies.split(' ').filter(dep => dep.trim() !== '')

    if (depList.length === 0) {
      console.log('提示：请提供有效的依赖名称')
      return
    }

    if (!content.onlyBuiltDependencies) {
      content.onlyBuiltDependencies = []
    }

    let addedCount = 0
    let existCount = 0

    depList.forEach(dependency => {
      if (!content.onlyBuiltDependencies.includes(dependency)) {
        content.onlyBuiltDependencies.push(dependency)
        addedCount++
      } else {
        existCount++
      }
    })

    if (addedCount > 0) {
      writeWorkspaceFile(content)
      console.log(`成功：已添加 ${addedCount} 个依赖到 onlyBuiltDependencies 中`)
    }

    if (existCount > 0) {
      console.log(`提示：${existCount} 个依赖已存在于 onlyBuiltDependencies 中，无需添加`)
    }
  } catch (error) {
    console.error(`错误：添加构建依赖失败 - ${(error as Error).message}`)
  }
}

/**
 * 删除构建依赖
 * @param dependencies 依赖包名称，可以是单个依赖或以空格分隔的多个依赖
 */
const removeBuildDependency = (dependencies: string): void => {
  try {
    const content = readWorkspaceFile()
    const depList = dependencies.split(' ').filter(dep => dep.trim() !== '')

    if (depList.length === 0) {
      console.log('提示：请提供有效的依赖名称')
      return
    }

    if (!content.onlyBuiltDependencies) {
      console.log('提示：onlyBuiltDependencies 列表为空或不存在，无需删除')
      return
    }

    let removedCount = 0
    let notExistCount = 0

    depList.forEach(dependency => {
      const originalLength = content.onlyBuiltDependencies.length
      content.onlyBuiltDependencies = content.onlyBuiltDependencies.filter((dep: string) => dep !== dependency)

      if (content.onlyBuiltDependencies.length !== originalLength) {
        removedCount++
      } else {
        notExistCount++
      }
    })

    if (removedCount > 0) {
      writeWorkspaceFile(content)
      console.log(`成功：已从 onlyBuiltDependencies 中删除 ${removedCount} 个依赖`)
    }

    if (notExistCount > 0) {
      console.log(`提示：${notExistCount} 个依赖不存在于 onlyBuiltDependencies 中，无需删除`)
    }
  } catch (error) {
    console.error(`错误：删除构建依赖失败 - ${(error as Error).message}`)
  }
}

/**
 * 列出所有构建依赖
 */
const listBuildDependencies = (): void => {
  try {
    const content = readWorkspaceFile()

    if (!content.onlyBuiltDependencies || content.onlyBuiltDependencies.length === 0) {
      console.log('提示：onlyBuiltDependencies 列表为空，没有构建依赖')
      return
    }

    console.log('==== onlyBuiltDependencies 列表 ====')
    content.onlyBuiltDependencies.forEach((dep: string) => {
      console.log(dep)
    })
    console.log('==== 共 ' + content.onlyBuiltDependencies.length + ' 个依赖 ====')
  } catch (error) {
    console.error(`错误：列出构建依赖失败 - ${(error as Error).message}`)
  }
}

/**
 * 构建依赖管理
 */
export const buildDep = {
  add: addBuildDependency,
  rm: removeBuildDependency,
  ls: listBuildDependencies
} 