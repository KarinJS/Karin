import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { FaWindowMaximize } from 'react-icons/fa'

export interface Task {
  id: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  minimized: boolean
  error?: string
  logs: string[]
}

interface TaskListProps {
  onMaximize: (taskId: string) => void
  tasks: Task[]  // 从父组件接收任务列表
}

export function TaskList ({ onMaximize, tasks }: TaskListProps) {
  // 只显示最小化的任务
  const minimizedTasks = tasks.filter((task: Task) => task.minimized)

  if (minimizedTasks.length === 0) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80">
      <CardBody className="p-3">
        <div className="max-h-[300px] overflow-auto">
          {minimizedTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 hover:bg-default-100 rounded"
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
                onPress={() => onMaximize(task.id)}
              >
                <FaWindowMaximize />
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
} 