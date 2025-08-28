import toast from 'react-hot-toast'
import { pluginAdminRequest } from '@/request/plugins'
import type { PluginAdminParams } from 'node-karin'

/**
 * 任务状态更新函数接口
 */
export interface TaskStateUpdater {
  /** 设置是否打开模态框 */
  setIsLogModalOpen: (isOpen: boolean) => void
  /** 设置任务ID */
  setTaskId: (id: string) => void
  /** 设置任务日志 */
  setTaskLogs: (logs: string[]) => void
  /** 设置任务名称 */
  setTaskName: (name: string) => void
}

/**
 * 创建插件更新任务
 * @param options 任务选项
 * @param stateUpdater 状态更新函数
 * @param onSuccess 成功回调
 * @param onClose 关闭模态框回调
 */
export const createUpdatePlugins = async (
  options: PluginAdminParams,
  stateUpdater: TaskStateUpdater,
  onSuccess?: () => void,
  onClose?: () => void
): Promise<void> => {
  const { setIsLogModalOpen, setTaskId, setTaskLogs, setTaskName } = stateUpdater
  setTaskName('更新插件')
  /** 初始日志 */
  const logs: string[] = [
    '开始创建更新任务...',
    `options: ${JSON.stringify(options)}`,
  ]

  setTaskLogs(logs)

  try {
    const response = await pluginAdminRequest(options)
    if (response.success && response.taskId) {
      /** 任务ID 创建任务后返回 */
      setTaskId(response.taskId)
      /** 更新日志 */
      setTaskLogs([
        ...logs,
        '\n任务创建成功!',
        `任务ID: ${response.taskId}`,
        '正在连接任务执行日志...',
      ])
      setIsLogModalOpen(true)
      if (typeof onSuccess === 'function') {
        onSuccess()
      }

      if (typeof onClose === 'function') {
        onClose()
      }
    } else {
      throw new Error(response.message || '未知错误')
    }
  } catch (error) {
    console.error('更新失败:', error)
    toast.error(`更新失败: ${(error as Error).message}`)
  }
}

/**
 * 创建任务结束处理函数
 * @param stateUpdater 状态更新函数
 * @param onFinish 任务结束后的回调
 */
export const createTaskCloseHandler = (
  stateUpdater: TaskStateUpdater,
  onFinish?: () => void
) => {
  const { setIsLogModalOpen, setTaskId, setTaskLogs } = stateUpdater

  return () => {
    /** 重置模拟框状态 */
    setIsLogModalOpen(false)
    setTaskId('')
    setTaskLogs([])
    if (typeof onFinish === 'function') {
      onFinish()
    }
  }
}
