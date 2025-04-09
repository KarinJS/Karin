import { spawn } from 'child_process'
import { TaskEntity } from '../../types/task/task'
import { taskSystem } from './index'

/**
 * 示例：命令行任务执行器
 * 执行命令行命令的任务执行器
 *
 * @param task - 任务实体
 * @param log - 日志函数
 * @returns 执行是否成功
 */
export const commandExecutor = async (
  task: TaskEntity,
  log: (message: string) => void
): Promise<boolean> => {
  // 构建执行命令信息
  const command = 'npm'
  const args = ['install', task.target]
  const cwd = process.cwd()

  log(`开始执行命令: ${command} ${args.join(' ')} (工作目录: ${cwd})\n`)

  try {
    // 启动子进程
    const proc = spawn(
      command,
      args,
      {
        shell: true,
        windowsHide: true,
        cwd,
        env: {
          ...process.env,
          LANG: 'zh_CN.UTF-8',
        },
      }
    )

    return new Promise<boolean>((resolve) => {
      // 处理标准输出
      proc.stdout.on('data', (data) => {
        log(typeof data === 'string' ? data : data.toString())
      })

      // 处理标准错误
      proc.stderr.on('data', (data) => {
        log(typeof data === 'string' ? data : data.toString())
      })

      // 处理完成事件
      proc.on('close', (code: number | null) => {
        const success = code === 0
        log(`\n命令执行${success ? '成功' : '失败'}，退出码: ${code}\n`)
        resolve(success)
      })
    })
  } catch (error) {
    // 处理错误
    log(`执行任务出错: ${error instanceof Error ? error.message : String(error)}\n`)
    return false
  }
}

/**
 * 示例：延时任务执行器
 * 延时一段时间后完成的任务执行器
 *
 * @param task - 任务实体
 * @param log - 日志函数
 * @returns 执行是否成功
 */
export const delayExecutor = async (
  task: TaskEntity,
  log: (message: string) => void
): Promise<boolean> => {
  // 获取延时时间，根据任务类型设置不同的延时
  const delay = task.type === 'update' ? 3000 : 1000 // 更新任务3秒，其他1秒

  log(`开始执行延时任务，将在 ${delay / 1000} 秒后完成\n`)

  // 模拟任务进度
  const interval = setInterval(() => {
    log('.')
  }, 1000)

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      clearInterval(interval)
      log('\n任务完成！\n')
      resolve(true)
    }, delay)
  })
}

/**
 * 示例：如何使用任务系统创建和执行任务
 */
export const taskExample = async (): Promise<void> => {
  // 1. 创建一个安装任务，并提供命令执行器作为回调
  const installTaskId = await taskSystem.add(
    {
      type: 'install',
      name: '安装示例插件',
      target: 'example-plugin',
      operatorIp: '127.0.0.1',
    },
    commandExecutor // 直接提供执行函数
  )

  console.log(`已创建安装任务，ID: ${installTaskId}`)

  // 2. 创建一个更新任务，并提供延时执行器作为回调
  const updateTaskId = await taskSystem.add(
    {
      type: 'update',
      name: '更新示例插件',
      target: 'example-plugin',
      operatorIp: '127.0.0.1',
    },
    delayExecutor // 直接提供执行函数
  )

  console.log(`已创建更新任务，ID: ${updateTaskId}`)

  // 3. 执行安装任务
  console.log('开始执行安装任务...')
  const installResult = await taskSystem.run(
    installTaskId,
    (log) => process.stdout.write(log), // 日志输出到控制台
    (status) => console.log(`安装任务状态更新: ${status}`) // 状态变更通知
  )

  console.log(`安装任务执行${installResult ? '成功' : '失败'}`)

  // 4. 执行更新任务
  console.log('开始执行更新任务...')
  const updateResult = await taskSystem.run(
    updateTaskId,
    (log) => process.stdout.write(log), // 日志输出到控制台
    (status) => console.log(`更新任务状态更新: ${status}`) // 状态变更通知
  )

  console.log(`更新任务执行${updateResult ? '成功' : '失败'}`)
}
