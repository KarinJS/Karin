/* eslint-disable @stylistic/indent */
import { useEffect, useRef, useState } from 'react'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { LuActivity, LuClipboard, LuX } from 'react-icons/lu'
import { eventSourcePolyfill } from '@/lib/request'
import { toast } from 'react-hot-toast'
import { api } from '@/request/base'

/**
 * 任务日志模态框属性
 */
export interface TaskLogModalProps {
  /** 模态框是否打开 */
  isOpen: boolean
  /** 关闭模态框的回调 */
  onClose: () => void
  /** 任务ID */
  taskId?: string
  /** 任务名称 */
  taskName?: string
  /** 初始日志内容 */
  initialLogs?: string[]
}

/**
 * 任务日志模态框组件
 *
 * 用于显示任务执行的实时日志
 */
const TaskLogModal = ({
  isOpen,
  onClose,
  taskId,
  taskName = '任务执行',
  initialLogs = [],
}: TaskLogModalProps) => {
  /** 任务日志 */
  const [logs, setLogs] = useState<string[]>(initialLogs)
  /** 是否正在连接 */
  const [isConnecting, setIsConnecting] = useState(false)
  /** 是否已完成 */
  const [, setIsCompleted] = useState(false)
  /** 事件源引用 */
  const eventSourceRef = useRef<EventSource | null>(null)
  /** 日志容器引用 */
  const logContainerRef = useRef<HTMLDivElement>(null)

  /** 连接任务日志 */
  useEffect(() => {
    if (!isOpen || !taskId) return

    /** 清理函数 */
    const cleanup = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }

    setIsConnecting(true)
    setIsCompleted(false)

    /** 连接任务执行端点 */
    const eventSource = eventSourcePolyfill(`${api.runTask}?id=${taskId}`)

    eventSourceRef.current = eventSource

    /** 连接成功 */
    eventSource.onopen = () => {
      setIsConnecting(false)
      setLogs(prevLogs => [...prevLogs, '连接已建立，正在接收任务日志...'])
    }

    /** 接收消息 */
    eventSource.onmessage = (event) => {
      const data = event.data
      setLogs(prevLogs => [...prevLogs, data])

      /** 滚动到底部 */
      if (logContainerRef.current) {
        setTimeout(() => {
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
          }
        }, 0)
      }

      /** 判断任务是否完成 */
      if (
        data.includes('任务执行完成') ||
        (data.includes('任务状态变更') &&
          (data.includes('成功') || data.includes('失败') || data.includes('已取消') || data.includes('超时')))
      ) {
        setIsCompleted(true)
      }
    }

    /** 发生错误 */
    eventSource.onerror = (error) => {
      setLogs(prevLogs => [...prevLogs, '连接出错或已关闭'])
      setIsCompleted(true)
      console.error('EventSource 错误:', error)
      cleanup()
    }

    return cleanup
  }, [isOpen, taskId])

  /** 复制日志到剪贴板 */
  const handleCopyLogs = () => {
    if (logs.length > 0) {
      navigator.clipboard.writeText(logs.join('\n'))
        .then(() => toast.success('日志已复制到剪贴板'))
        .catch((error) => {
          console.error('复制失败:', error)
          toast.error('复制失败')
        })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop='blur'
      radius='lg'
      placement='center'
      classNames={{
        base: 'border border-default-100 max-w-3xl mx-auto my-0 h-[80vh]',
        wrapper: 'items-center justify-center',
        header: 'border-b border-default-100 p-4',
        body: 'p-0 flex-grow overflow-hidden',
        footer: 'border-t border-default-100 p-4',
        closeButton: 'hover:bg-default-100',
      }}
      size='2xl'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 pb-3'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <LuActivity size={20} className='text-primary-500' />
              <div className='text-lg font-light tracking-tight'>{taskName}</div>
              {isConnecting && <Spinner size='sm' color='primary' />}
            </div>
            <div className='text-xs text-default-500'>
              {taskId && <span>任务ID: {taskId}</span>}
            </div>
          </div>
        </ModalHeader>

        <Divider className='opacity-50 m-0' />

        <ModalBody>
          <div
            ref={logContainerRef}
            className='h-full w-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap bg-default-50'
          >
            {logs.length === 0
              ? (
                <div className='flex items-center justify-center h-full text-default-500'>
                  {isConnecting ? '正在连接任务日志...' : '暂无日志'}
                </div>
              )
              : (
                logs.map((log, index) => (
                  <div key={index} className='py-0.5'>{log}</div>
                ))
              )}
          </div>
        </ModalBody>

        <Divider className='opacity-50 m-0' />

        <ModalFooter>
          <Button
            color='default'
            variant='flat'
            onPress={handleCopyLogs}
            radius='full'
            size='sm'
            startContent={<LuClipboard size={16} />}
            isDisabled={logs.length === 0}
          >
            复制日志
          </Button>
          <Button
            color='danger'
            variant='light'
            onPress={onClose}
            radius='full'
            size='sm'
            startContent={<LuX size={16} />}
          >
            关闭窗口
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TaskLogModal
