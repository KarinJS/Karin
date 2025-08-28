import fs from 'node:fs'
import path from 'node:path'
import { getPlugins } from '@karinjs/plugin'
import { webuiDB as task } from '@karinjs/db'
import { karinPathPlugins } from '@karinjs/paths'
import { handleReturn, spawnProcess } from './utils'

import type { Response } from 'express'
import type { PluginAdminUninstall } from './types'

/**
 * 插件卸载管理类
 * 负责处理插件的卸载操作
 */
export class PluginUninstaller {
  /**
   * 卸载插件
   *
   * 根据插件类型执行不同的卸载操作：
   * - npm: 使用pnpm remove命令卸载npm包
   * - git: 删除插件目录
   * - app: 删除特定的应用文件
   *
   * 过程：
   * 1. 验证请求参数
   * 2. 检查插件是否存在
   * 3. 创建并执行卸载任务
   * 4. 返回操作结果
   *
   * @param res - 响应对象
   * @param name - 插件名称
   * @param target - 插件目标
   * @param operatorIp - 操作者IP地址
   * @returns 操作响应
   */
  public static async uninstall (
    res: Response,
    name: string,
    target: PluginAdminUninstall['target'],
    operatorIp: string = '0.0.0.0'
  ) {
    if (!Array.isArray(target) || target.length < 1) {
      return handleReturn(res, false, '无效请求: 插件目标错误')
    }

    /**
     * 创建并执行卸载任务
     */
    const id = await task.add(
      {
        type: 'uninstall',
        name,
        target: target.map(v => `${v.type}:${v.name}`).join(','),
        operatorIp,
      },
      async (options, emitLog) => {
        try {
          await this.performUninstall(emitLog, target)
          await task.update.logs(options.id, '任务执行成功')
          return true
        } catch (error) {
          await task.update.logs(options.id, `任务执行失败: ${(error as Error).message}`)
          return false
        }
      }
    )

    return handleReturn(res, true, '卸载任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 执行不同类型插件的卸载操作
   *
   * 根据插件类型选择适当的卸载方法：
   * - npm包：使用pnpm remove
   * - git仓库：删除整个目录
   * - app应用：删除特定文件
   *
   * @param emitLog - 日志回调函数
   * @param target - 目标插件列表
   * @returns 操作结果对象
   */
  private static async performUninstall (
    emitLog: (message: string) => void,
    target: PluginAdminUninstall['target']
  ) {
    const npm: string[] = []
    const git: string[] = []
    const app: string[] = []
    /** 记录不存在的插件 */
    const notExist: string[] = []

    /** 本地已安装插件列表 */
    const list = await getPlugins('all')

    target.forEach(async (v) => {
      if (v.type === 'npm') {
        list.includes(`${v.type}:${v.name}`) ? npm.push(v.name) : notExist.push(v.name)
        return
      }

      if (v.type === 'git') {
        list.includes(`${v.type}:${v.name}`) ? git.push(v.name) : notExist.push(v.name)
        return
      }

      if (v.type === 'apps') {
        /** 等下直接判断路径更快 因为还需要判断路径穿越的问题 */
        app.push(v.name)
        return
      }

      notExist.push(v.name)
    })

    // 处理NPM包卸载
    await this.uninstallNpmPlugins(npm, emitLog)

    // 处理Git仓库卸载
    await this.uninstallGitPlugins(git, emitLog)

    // 处理App文件卸载
    await this.uninstallAppPlugins(app, list, emitLog)

    if (notExist.length) {
      notExist.unshift('以下插件不存在:')
      emitLog(notExist.join('\n') + '\n\n')
    }

    emitLog('卸载任务完成')
  }

  /**
   * 卸载NPM类型插件
   * @param npm - npm包列表
   * @param emitLog - 日志回调函数
   */
  private static async uninstallNpmPlugins (
    npm: string[],
    emitLog: (message: string) => void
  ) {
    if (npm.length === 0) return

    await spawnProcess('pnpm', ['remove', ...npm], { timeout: 60 * 1000 }, emitLog)

    /** 执行完成之后 检查package.json是否还存在这些依赖 */
    const pkg = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(pkg)) {
      const content = fs.readFileSync(pkg, 'utf-8')
      const data = JSON.parse(content)
      const delDep = (obj: Record<string, string>) => {
        Object.keys(obj).forEach(key => {
          if (npm.includes(key)) {
            delete obj[key]
          }
        })
      }

      delDep(data.dependencies || {})
      delDep(data.devDependencies || {})
      delDep(data.peerDependencies || {})
      fs.writeFileSync(pkg, JSON.stringify(data, null, 2), 'utf-8')
    }
  }

  /**
   * 卸载Git类型插件
   * @param git - git仓库列表
   * @param emitLog - 日志回调函数
   */
  private static async uninstallGitPlugins (
    git: string[],
    emitLog: (message: string) => void
  ) {
    for (const v of git) {
      emitLog('-----------------------')
      emitLog(`开始卸载 git 插件: ${v}`)
      if (v.includes('..')) {
        emitLog(`卸载 ${v} 失败: 文件名称存在路径穿越风险`)
        continue
      }

      /** 判断git文件夹是否存在 */
      const dir = path.join(karinPathPlugins, v)
      if (!fs.existsSync(path.join(dir, '.git'))) {
        emitLog(`卸载 ${v} 失败: 非git仓库`)
        continue
      }

      try {
        await fs.promises.rm(dir, { recursive: true, force: true })
        emitLog(`卸载 ${v} 成功`)
      } catch (error) {
        emitLog(`卸载 ${v} 失败: ${(error as Error).message}`)
      }
      emitLog('-----------------------\n\n')
    }
  }

  /**
   * 卸载App类型插件
   * @param app - app文件列表
   * @param list - 已安装插件列表
   * @param emitLog - 日志回调函数
   */
  private static async uninstallAppPlugins (
    app: string[],
    list: string[],
    emitLog: (message: string) => void
  ) {
    for (const v of app) {
      emitLog('-----------------------')
      emitLog(`开始卸载 app 插件: ${v}`)
      if (v.includes('..')) {
        emitLog(`卸载 ${v} 失败: 文件名称存在路径穿越风险`)
        continue
      }

      /** 判断app文件夹是否存在 */
      const arr = v.split('/')
      const [pkg, file] = arr
      if (arr.length !== 2 || !pkg || !file) {
        emitLog(`卸载 ${v} 失败: 格式错误`)
        continue
      }

      if (!list.includes(`app:${pkg}`)) {
        emitLog(`卸载 ${v} 失败: 插件不存在`)
        continue
      }

      const dir = path.join(karinPathPlugins, pkg)
      if (!fs.existsSync(path.join(dir, file))) {
        emitLog(`卸载 ${v} 失败: 文件不存在`)
        continue
      }

      /** 判断后缀 必须是.js .mjs .cjs .ts .cts .mts */
      const ext = path.extname(file)
      if (!['.js', '.mjs', '.cjs', '.ts', '.cts', '.mts'].includes(ext)) {
        emitLog(`卸载 ${v} 失败: 错误的文件类型`)
        continue
      }

      try {
        /** 这里是文件 不能使用rm函数 */
        await fs.promises.unlink(path.join(dir, file))
        emitLog(`卸载 ${v} 成功`)
      } catch (error) {
        emitLog(`卸载 ${v} 失败: ${(error as Error).message}`)
      }
      emitLog('-----------------------\n\n')
    }
  }
}
