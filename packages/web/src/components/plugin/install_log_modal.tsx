import { useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { request } from '@/lib/request'
import { FaWindowMinimize } from 'react-icons/fa'
import type { pluginLists } from '@/types/plugins'
import { useRequest } from 'ahooks'

interface Task {
  id: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  logs: string[]
  minimized: boolean
  error?: string
}

interface InstallLogModalProps {
  isOpen: boolean
  onClose: () => void
  taskId: string
  plugin: pluginLists
  task?: Task
}

export function InstallLogModal ({ isOpen, onClose, taskId, plugin, task: initialTask }: InstallLogModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  // 获取任务状态
  const { data: currentTask = initialTask } = useRequest<Task, [{ taskId: string }]>(
    async () => {
      const response = await request.serverPost<Task, { taskId: string }>('/api/v1/plugin/task', { taskId })
      return response
    },
    {
      pollingInterval: 1000,
      pollingWhenHidden: false,
      ready: !!taskId && isOpen,
    }
  )

  // 自动滚动到底部
  useEffect(() => {
    if (currentTask?.logs?.length) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentTask?.logs])

  const handleMinimize = async () => {
    await request.serverPost('/api/v1/plugin/task/status', {
      taskId,
      minimized: true
    })
    onClose()
  }

  const getTitle = () => {
    if (currentTask?.type === 'uninstall') {
      return '卸载插件:'
    }
    return '安装插件:'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      isDismissable
    >
      <ModalContent>
        <ModalHeader className='flex gap-1'>
          <span>{getTitle()}</span>
          <span className='font-mono text-primary-500'>{plugin.name}</span>
        </ModalHeader>

        <ModalBody>
          <div className='h-[400px] w-full overflow-auto'>
            <div className='font-mono text-sm whitespace-pre-wrap'>
              {currentTask?.logs?.map((log, index) => (
                <div key={index} className='py-0.5'>
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant='light'
            onPress={handleMinimize}
            startContent={<FaWindowMinimize />}
          >
            最小化
          </Button>
          <Button
            color='primary'
            onPress={onClose}
          >
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
