import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { manageDependencies } from '@/request/dependencies'
import type { DependenciesManage, UpgradeDependenciesParams, RemoveDependenciesParams } from 'node-karin'
import { getErrorMessage } from '@/request/base'

/**
 * 依赖操作Hook，处理依赖更新和卸载等操作
 * @param onSuccess - 操作成功后的回调函数
 * @returns 依赖操作相关状态和方法
 */
export const useDependencyOperations = (onSuccess: () => void) => {
  /** 操作中状态 */
  const [isOperating, setIsOperating] = useState<boolean>(false)
  /** 日志模态框是否打开 */
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false)
  /** 任务ID */
  const [taskId, setTaskId] = useState<string>('')
  /** 任务名称 */
  const [taskName, setTaskName] = useState<string>('')
  /** 初始日志 */
  const [initialLogs, setInitialLogs] = useState<string[]>([])

  /**
   * 重置任务状态
   */
  const resetTaskState = useCallback(() => {
    setTaskId('')
    setTaskName('')
    setInitialLogs([])
  }, [])

  /**
   * 执行依赖管理操作
   * @param params - 依赖管理参数
   * @param operationName - 操作名称
   */
  const executeDependencyOperation = async (
    params: DependenciesManage,
    operationName: string
  ) => {
    try {
      // 重置之前的任务状态
      resetTaskState()

      setIsOperating(true)

      // 构建初始日志
      let logs: string[] = []
      const operationTaskName = getTaskName(params)

      if (params.type === 'upgrade') {
        if (params.isAll) {
          logs = ['开始更新所有依赖', '正在创建任务...']
        } else {
          logs = [
            `开始更新 ${params.data.length} 个依赖`,
            `依赖列表: ${params.data.map(d => `${d.name}${d.version ? `@${d.version}` : ''}`).join(', ')}`,
            '正在创建任务...',
          ]
        }
      } else if (params.type === 'remove') {
        logs = [
          `开始卸载 ${params.data.length} 个依赖`,
          `依赖列表: ${params.data.join(', ')}`,
          '正在创建任务...',
        ]
      }

      // 调用API进行依赖管理
      const response = await manageDependencies(params)

      if (!response.success || !response.data || !response.data.success) {
        toast.error(`${operationName}失败`)
        return
      }

      // 设置任务信息
      setTaskId(response.data.taskId)
      setTaskName(operationTaskName)
      setInitialLogs([
        ...logs,
        '任务创建成功!',
        `任务ID: ${response.data.taskId}`,
        '正在连接任务执行日志...',
      ])

      // 显示日志模态框
      setIsLogModalOpen(true)

      // 操作成功后刷新依赖
      setTimeout(onSuccess, 500)
    } catch (error) {
      console.error(`${operationName}失败:`, error)
      toast.error(`${operationName}失败: ${getErrorMessage(error)}`)
    } finally {
      setIsOperating(false)
    }
  }

  /**
   * 根据参数获取任务名称
   */
  const getTaskName = (params: DependenciesManage): string => {
    if (params.type === 'upgrade') {
      const upgradeParams = params as UpgradeDependenciesParams
      return upgradeParams.isAll ? '更新所有依赖' : `更新依赖 (${upgradeParams.data.length}个)`
    } else if (params.type === 'remove') {
      const removeParams = params as RemoveDependenciesParams
      return `卸载依赖 (${removeParams.data.length}个)`
    } else if (params.type === 'add') {
      return `安装依赖: ${params.data.name}`
    }
    return '依赖管理'
  }

  /**
   * 更新依赖
   * @param isAll - 是否更新所有依赖
   * @param dependencies - 要更新的依赖列表
   */
  const updateDependencies = async (
    isAll: boolean,
    dependencies?: Array<{ name: string; version: string }>
  ) => {
    if (!isAll && (!dependencies || dependencies.length === 0)) {
      toast.error('未选择要更新的依赖')
      return
    }

    const params: UpgradeDependenciesParams = {
      type: 'upgrade',
      isAll,
      data: dependencies || [],
    }

    await executeDependencyOperation(params, '更新依赖')
  }

  /**
   * 卸载依赖
   * @param packageNames - 要卸载的依赖名称数组
   */
  const uninstallDependencies = async (packageNames: string[]) => {
    if (!packageNames || packageNames.length === 0) {
      toast.error('未选择要卸载的依赖')
      return
    }

    const params: RemoveDependenciesParams = {
      type: 'remove',
      data: packageNames,
    }

    await executeDependencyOperation(params, '卸载依赖')
  }

  /**
   * 处理日志模态框关闭
   */
  const handleLogModalClose = useCallback(() => {
    setIsLogModalOpen(false)
    // 关闭后清理状态
    resetTaskState()
    // 刷新依赖列表
    onSuccess()
  }, [onSuccess, resetTaskState])

  return {
    isOperating,
    isLogModalOpen,
    taskId,
    taskName,
    initialLogs,
    updateDependencies,
    uninstallDependencies,
    handleLogModalClose,
  }
}
