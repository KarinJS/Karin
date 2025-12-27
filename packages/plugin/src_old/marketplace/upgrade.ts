import { exec as execChild } from 'node:child_process'
import type { ExecException } from 'node:child_process'

/** 更新npm插件参数 */
export interface NpmUpdateOptions {
  /** 标签 默认 `latest` */
  tag?: string
  /** 指定源 */
  registry?: string
  /** 超时时间(秒) 默认30秒 */
  timeout?: number
}

/** 更新命令参数类型 */
export type ExecOptions = Parameters<typeof execChild>[1]

/** 获取git仓库远程分支列表返回类型 */
export interface GitRemoteBranches {
  /** 分支名称 */
  branch: string
  /** 短哈希 */
  short: string
  /** 长哈希 */
  hash: string
}

const exec = (cmd: string, options?: ExecOptions) => {
  return new Promise<{
    status: boolean
    error: ExecException | null
    stdout: string
    stderr: string
  }>((resolve) => {
    const timeout = (options?.timeout || 30) * 1000
    const timer = setTimeout(() => {
      resolve({
        status: false,
        error: new Error('命令执行超时'),
        stdout: '',
        stderr: '命令执行超时',
      })
    }, timeout)

    const child = execChild(cmd, options, (error, stdout, stderr) => {
      clearTimeout(timer)
      stderr = stderr.toString().trim()
      stdout = stdout.toString().trim()
      const status = !error

      resolve({ status, error, stdout, stderr })
    })

    child.stdin?.write('\n')
  })
}

/**
 * 检查npm包是否存在更新
 */
export const checkNpmUpdate = async (name: string) => {
  if (!name) throw new TypeError('包名不能为空')
  const { stdout } = await exec(`npm list ${name} --depth=0 --json`)
  const data = JSON.parse(stdout)
  if (!data.dependencies || !data.dependencies[name]) {
    throw new Error(`${name} 未安装`)
  }

  const { version } = data.dependencies[name]
  const remote = await getNpmPackageVersion(name)
  return {
    status: version !== remote,
    version,
    remote,
  }
}

/**
 * 获取npm包的远程版本号
 * @param name 包名
 * @param tag 标签 默认 `latest`
 * @throws 执行发生错误 例如包不存在
 */
export const getNpmPackageVersion = async (name: string, tag = 'latest') => {
  const cmd = tag === 'latest' ? `npm show ${name} version` : `npm show ${name} dist-tags.${tag}`

  const data = await exec(cmd)
  if (data.error) {
    throw data.error
  }

  return data.stdout
}

/**
 * 更新指定的npm包
 * @param name 包名
 * @param options 更新选项
 * @description 相对于旧版本 此方法不会检查本地版本是否存在 并且使用兼容性更好的`install`命令
 */
export const updateNpmPackage = async (
  name: string,
  options: NpmUpdateOptions & ExecOptions = {}
) => {
  const tag = options.tag || 'latest'
  const registry = options.registry ? ` --registry=${options.registry}` : ''
  const cmd = `pnpm install ${name}@${tag}${registry} --save`
  const result = await exec(cmd, options)
  return result
}

/**
 * 批量更新npm包
 * @param packages 包名列表 如果传递空数组则更新所有npm包
 * @param options 更新选项
 * @returns 执行结果
 */
export const updateNpmPackages = async (
  packages: string[],
  options: Omit<NpmUpdateOptions, 'tag'> & ExecOptions = {}
) => {
  const registry = options.registry ? ` --registry=${options.registry}` : ''

  const cmd = packages.length
    ? `pnpm install ${packages.join('@latest ')}${registry} --save`
    : `pnpm update${registry} --save`

  const result = await exec(cmd, options)
  return result
}
