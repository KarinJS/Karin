import { TaskStatus, TaskEntity } from '../../types/task'
import { spawn } from 'child_process'

/**
 * 执行任务
 * @param task - 任务实体
 * @param onLog - 日志回调
 * @param onStatus - 状态回调
 * @returns 执行是否成功的Promise
 */
export const executeTask = async (
  task: TaskEntity,
  onLog?: (log: string) => void,
  onStatus?: (status: TaskStatus) => void
): Promise<boolean> => {
  /** 命令配置 */
  const commandConfig = parseCommandConfig(task.command)

  /** 如果没有有效的命令配置，则失败 */
  if (!commandConfig || !commandConfig.command) {
    if (onLog) onLog('任务缺少有效的命令配置')
    if (onStatus) onStatus('failed')
    return false
  }

  /** 通知状态为运行中 */
  if (onStatus) onStatus('running')

  try {
    /** 构建命令描述 */
    const cmdDesc = `${commandConfig.command} ${commandConfig.args.join(' ')}`

    /** 添加工作目录信息 */
    const cwdInfo = commandConfig.cwd ? `(工作目录: ${commandConfig.cwd})` : ''

    /** 记录开始信息 */
    const startMessage = `开始执行命令: ${cmdDesc} ${cwdInfo}\n`
    if (onLog) onLog(startMessage)

    /** 准备spawn选项 */
    const spawnOptions: any = {
      shell: true,
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8', // 对Python命令设置编码
      }
    }

    /** 如果指定了工作目录，添加到选项中 */
    if (commandConfig.cwd) {
      spawnOptions.cwd = commandConfig.cwd
    }

    /** 启动子进程 */
    const proc = spawn(
      commandConfig.command,
      commandConfig.args,
      spawnOptions
    )

    return new Promise<boolean>((resolve) => {
      /** 处理标准输出 */
      proc.stdout.on('data', (data: Buffer) => {
        const logChunk = data.toString()
        if (onLog) onLog(logChunk)
      })

      /** 处理标准错误 */
      proc.stderr.on('data', (data: Buffer) => {
        const logChunk = data.toString()
        if (onLog) onLog(logChunk)
      })

      /** 处理完成事件 */
      proc.on('close', (code: number | null) => {
        const status: TaskStatus = code === 0 ? 'success' : 'failed'
        const resultMessage = `\n命令执行${status === 'success' ? '成功' : '失败'}，退出码: ${code}\n`

        if (onLog) onLog(resultMessage)
        if (onStatus) onStatus(status)

        resolve(status === 'success')
      })
    })
  } catch (error) {
    /** 处理错误 */
    const errorMessage = `执行任务出错: ${error instanceof Error ? error.message : String(error)}\n`
    if (onLog) onLog(errorMessage)
    if (onStatus) onStatus('failed')
    return false
  }
}

/**
 * 解析命令配置
 * @param commandJson - 命令配置JSON
 * @returns 命令配置对象
 */
const parseCommandConfig = (commandJson?: string): {
  command: string
  args: string[]
  cwd?: string
} | null => {
  if (!commandJson) return null

  try {
    const config = JSON.parse(commandJson)
    // 确保args始终存在
    if (!config.args) {
      config.args = []
    }
    return config
  } catch (e) {
    console.error('解析命令配置失败:', e)
    return null
  }
}
