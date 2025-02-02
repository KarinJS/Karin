import { useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { request } from '@/lib/request'
import { FaWindowMinimize } from 'react-icons/fa'
import type { KarinBase } from '@/types/plugins'

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
  plugin: KarinBase<'all'>[number]
  task: Task | undefined
}

export function InstallLogModal ({ isOpen, onClose, taskId, plugin, task }: InstallLogModalProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (task?.logs.length) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [task?.logs])

  const handleMinimize = async () => {
    await request.serverPost('/api/v1/plugin/task/status', {
      taskId,
      minimized: true
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex gap-1">
          <span>安装插件:</span>
          <span className="font-mono text-primary-500">{plugin.name}</span>
        </ModalHeader>

        <ModalBody>
          <div className="h-[400px] w-full overflow-auto">
            <div className="font-mono text-sm whitespace-pre-wrap">
              {task?.logs.map((log, index) => (
                <div key={index} className="py-0.5">
                  {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={handleMinimize}
            startContent={<FaWindowMinimize />}
          >
            最小化
          </Button>
          <Button
            color="primary"
            onPress={onClose}
            isDisabled={task?.status === 'running'}
          >
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}