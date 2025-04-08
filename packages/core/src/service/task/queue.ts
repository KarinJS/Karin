import { TaskStatus, TaskEntity } from '../../types/task/task'
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
  onLog: (log: string) => void,
  onStatus: (status: TaskStatus) => void
): Promise<boolean> => {
  if (!task.command || !task.command.command || !Array.isArray(task.command.args)) {
    onLog('任务缺少有效的命令配置')
    onStatus('failed')
    return false
  }

  /** 通知状态为运行中 */
  onStatus('running')

  try {
    /** 构建命令描述 */
    const cmdDesc = `${task.command.command} ${task.command.args.join(' ')}`

    /** 添加工作目录信息 */
    const cwdInfo = `(工作目录: ${task.command.cwd || '当前目录'})`

    /** 记录开始信息 */
    const startMessage = `开始执行命令: ${cmdDesc} ${cwdInfo}\n`
    onLog(startMessage)

    /** 启动子进程 */
    const proc = spawn(
      task.command.command,
      task.command.args,
      {
        shell: true,
        windowsHide: true,
        cwd: task.command.cwd || process.cwd(),
        env: {
          ...process.env,
          LANG: 'zh_CN.UTF-8',
        },
      }
    )

    return new Promise<boolean>((resolve) => {
      /** 处理标准输出 */
      proc.stdout.on('data', (data) => {
        onLog(typeof data === 'string' ? data : data.toString())
      })

      /** 处理标准错误 */
      proc.stderr.on('data', (data) => {
        onLog(typeof data === 'string' ? data : data.toString())
      })

      /** 处理完成事件 */
      proc.on('close', (code: number | null) => {
        const status: TaskStatus = code === 0 ? 'success' : 'failed'
        const resultMessage = `\n命令执行${status === 'success' ? '成功' : '失败'}，退出码: ${code}\n`

        onLog(resultMessage)
        onStatus(status)

        resolve(status === 'success')
      })
    })
  } catch (error) {
    /** 处理错误 */
    const errorMessage = `执行任务出错: ${error instanceof Error ? error.message : String(error)}\n`
    onLog(errorMessage)
    onStatus('failed')
    return false
  }
}
