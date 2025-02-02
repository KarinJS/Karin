import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import { FaWindowMaximize } from 'react-icons/fa'
import type { Task } from './task_list'

interface TaskListModalProps {
  isOpen: boolean
  onClose: () => void
  tasks: Task[]
  onMaximize: (taskId: string) => void
}

export function TaskListModal ({ isOpen, onClose, tasks, onMaximize }: TaskListModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">任务列表</h3>
        </ModalHeader>
        <ModalBody>
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-default-400">
              暂无任务
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{task.name}</span>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        task.status === 'completed'
                          ? 'success'
                          : task.status === 'failed'
                            ? 'danger'
                            : 'primary'
                      }
                    >
                      {task.status}
                    </Chip>
                  </div>

                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => {
                      onMaximize(task.id)
                      onClose()
                    }}
                  >
                    <FaWindowMaximize />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 