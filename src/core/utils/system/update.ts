import { exec } from './exec'
import { requireFile } from '../fs/require'
import { getNpmPlugins } from '@/plugin/list/npm'
import type { PackageType } from '@/utils/config/types'
import type { ExecException } from 'node:child_process'

const getPkg = (isForcibly = false): Promise<PackageType> => {
  return requireFile('package.json', { force: isForcibly })
}

/**
 * @description 获取指定包的本地版本号 如果获取失败则会获取package.json中的版本号
 * @param name 包名
 */
export const getPkgVersion = async (name: string): Promise<string | null> => {
  const { stdout } = await exec(`npm list ${name} --depth=0`)
  const reg = new RegExp(`${name}@(\\d+\\.\\d+\\.\\d+)`, 'gm')
  const result = reg.exec(stdout.toString())
  if (result?.[1]) return result[1]

  const pkg = await getPkg()
  return pkg?.dependencies?.[name] || pkg?.devDependencies?.[name] || pkg?.peerDependencies?.[name] || null
}

/**
 * @description 获取指定包的远程版本号
 * @param name 包名
 */
export const getRemotePkgVersion = async (name: string): Promise<string | null> => {
  const { stdout } = await exec(`npm show ${name} version`)
  return stdout.toString().trim() || null
}

type UpdatePkgReturn<T extends boolean> = T extends true
  ? { ok: true, data: string }
  : { ok: false, data: ExecException | string }

/**
 * @description 更新指定的npm插件
 * @param name 包名
 */
export const updatePkg = async <T extends boolean> (name: string): Promise<UpdatePkgReturn<T>> => {
  const local = await getPkgVersion(name)
  const remote = await getRemotePkgVersion(name)

  if (local === remote) {
    return { ok: false, data: `[${name}][无更新] ${local} => ${remote}` } as UpdatePkgReturn<T>
  }

  const shell = `pnpm up ${name}@${remote}`
  const { error } = await exec(shell)
  if (error) {
    return { ok: false, data: error } as UpdatePkgReturn<T>
  }

  const updatedVersion = await getPkgVersion(name)
  if (updatedVersion !== remote) {
    return { ok: false, data: `[${name}][更新失败] 请尝试手动更新 pnpm up ${name}@${remote}` } as UpdatePkgReturn<T>
  }

  return { ok: true, data: `[${name}][更新成功] ${local} => ${remote}` } as UpdatePkgReturn<T>
}

/**
 * @description 更新全部npm插件
 */
export const updateAllPkg = async (): Promise<string> => {
  const logger = global?.logger || console
  const list = await getNpmPlugins()
  list.push('node-karin')

  const state: Record<string, {
    local: string | null
    remote: string
  }> = {}
  const tips = ['---------- 更新npm插件 ----------']
  const cmd = ['pnpm up']
  const pkg = await getPkg()
  const result: string[] = []

  await Promise.all(list.map(async (name) => {
    /** 本地版本号 */
    const local = await getPkgVersion(name)
    /** 远程版本号 */
    const remote = await getRemotePkgVersion(name) || pkg.dependencies[name]
    /** 无更新 */
    if (local === remote) {
      tips.push(`[${name}][无更新] ${local} => ${remote}`)
      return
    }

    tips.push(`更新${name} ${local} => ${remote}`)
    cmd.push(`${name}@${remote}`)
    state[name] = { local, remote }
  }))

  tips.push('----------------------------')
  logger.info(tips.join('\n'))

  const shell = cmd.join(' ')
  logger.mark(`开始更新: ${shell}`)

  const { error } = await exec(shell)
  if (error) {
    Object.keys(state).forEach(name => {
      result.push(`[${name}][更新失败] 请尝试手动更新 pnpm up ${name}@${state[name].remote}`)
    })

    result.unshift(`[更新失败] 更新数量: ${result.length}`)
    logger.error(result.join('\n'))
    logger.error(error)
    return result.join('\n')
  }

  const updatedPkg = await getPkg(true)

  Object.keys(state).forEach(name => {
    const updatedVersion = updatedPkg.dependencies?.[name] || updatedPkg.devDependencies?.[name] || updatedPkg.peerDependencies?.[name]
    if (updatedVersion !== state[name].remote) {
      result.push(`[${name}][更新失败] 请尝试手动更新 pnpm up ${name}@${state[name].remote}`)
    } else {
      result.push(`[${name}][更新成功] ${state[name].local} => ${state[name].remote}`)
    }
  })

  /** 排序 成功在上 */
  result.sort((a, b) => a.includes('成功') ? -1 : 1)
  logger.info(result.join('\n'))
  return result.join('\n')
}
