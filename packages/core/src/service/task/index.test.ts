import { initTaskSystem } from '.'
import { TaskStatus } from '../../types/task/task'

/**
 * 任务系统基础测试
 */
async function basicTest () {
  console.log('开始基础测试...')
  const task = await initTaskSystem('./test.db')

  // 使用spawn对象
  const id1 = await task.add({
    name: '列出文件',
    type: 'install',
    operatorIp: '0.0.0.0',
    target: 'ls',
    spawn: {
      cmd: 'dir',
      args: [],
    },
  })

  console.log(`创建任务成功: ${id1}`)
  let logs1 = ''

  // 执行任务
  await new Promise<void>((resolve) => {
    task.run(
      id1,
      (log: string) => {
        logs1 += log
        process.stdout.write(log.toString())
      },
      (status: TaskStatus) => {
        if (status === 'pending' || status === 'running') {
          console.log(`任务状态: ${status.toString()}`)
        }

        resolve()
      }
    )
  })

  // console.log('任务1日志:\n', logs1)
}

basicTest().catch(console.error)
