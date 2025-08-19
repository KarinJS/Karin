import path from 'node:path'
import { listeners } from './listeners'

/** 插件名称:缺失的依赖 */
const missing = new Map<string, { name: string, file: string, depend: string }>()

/**
 * @description 插件载入错误
 * @param name 插件包名
 * @param file 报错的文件名称
 * @param error 错误信息
 */
const loaderPlugin = (name: string, file: string, error: unknown) => {
  const pkg = /Cannot find package '(.+?)'/.exec(error as string)?.[1]
  if (pkg) {
    const key = `${name}.${pkg}`
    if (missing.has(key)) return
    missing.set(key, { name, file, depend: pkg })
  } else {
    logger.error(`载入插件错误：${logger.red(`${name}/${path.basename(file)}`)}`)
    listeners.emit('error', error)
  }
}

/**
 * @description 定时任务执行错误
 * @param name 插件包名
 * @param task 任务名称
 * @param error 错误信息
 */
const taskStart = (name: string, task: string, error: unknown) => {
  logger.error(`[定时任务][${name}][${task}] 执行错误`)
  listeners.emit('error', error)
}

/**
 * @description 打印插件载入错误
 */
export const printMissing = () => {
  try {
    if (!missing.size) return

    const msg = ['\n-----依赖缺失----']

    for (const [, { name, file, depend }] of missing) {
      msg.push(`[${name}][${path.basename(file)}] 缺少依赖：${logger.red(depend)}`)
    }

    msg.push('-------------------')
    const one = missing.values().next().value
    msg.push(...[
      '温馨提示:',
      `1. 如果是新安装的插件，请尝试执行 ${logger.red('pnpm install -P')} 自动安装依赖`,
      `2. 如果执行第一步无效，请尝试执行 ${logger.red('pnpm imstall 依赖名称 -w')} 手动安装依赖`,
      `举例: ${logger.red(`pnpm add ${one!.depend} -w`)}`,
      logger.yellow('对于手动安装的依赖，如果对应插件未在使用，请进行及时卸载: pnpm rm 依赖名称'),
    ])
    msg.push('-------------------')
    logger.error(msg.join('\n'))
  } finally {
    missing.clear()
  }
}

export const errorHandler = {
  /** 插件载入错误 */
  loaderPlugin,
  /** 定时任务执行错误 */
  taskStart,
  /** 打印插件载入错误 */
  printMissing,
}
