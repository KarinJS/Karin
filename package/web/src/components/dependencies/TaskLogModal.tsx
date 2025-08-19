import { api } from '@/request/base'
import { toast } from 'react-hot-toast'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'
import { useEffect, useRef, useState } from 'react'
import { eventSourcePolyfill } from '@/lib/request'
import { LuActivity, LuClipboard, LuX } from 'react-icons/lu'
import { hideRocket, showRocket } from '../common/ScrollToTop.utils'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

/** 前端日志前缀 */
const CLIENT_LOG_PREFIX = '[webui] '

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
  /** 已接收的日志索引 */
  const [logIndex, setLogIndex] = useState(0)
  /** 是否尝试重连 */
  const [isReconnecting, setIsReconnecting] = useState(false)
  /** 是否需要重连 */
  const [needReconnect, setNeedReconnect] = useState(false)
  /** 事件源引用 */
  const eventSourceRef = useRef<EventSource | null>(null)
  /** 日志容器引用 */
  const logContainerRef = useRef<HTMLDivElement>(null)
  /** 保存上一次的任务ID */
  const prevTaskIdRef = useRef<string>('')

  /**
   * 重置所有状态
   */
  const resetState = () => {
    setLogs([])
    setLogIndex(0)
    setIsConnecting(false)
    setIsCompleted(false)
    setIsReconnecting(false)
    setNeedReconnect(false)

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }

  /**
   * 当任务ID变化时，重置状态并设置初始日志
   */
  useEffect(() => {
    if (taskId && taskId !== prevTaskIdRef.current) {
      resetState()
      setLogs(initialLogs || [])
      prevTaskIdRef.current = taskId
    }
  }, [taskId, initialLogs])

  /**
   * 当模态框打开时，重置状态并设置初始日志
   */
  useEffect(() => {
    if (isOpen) {
      hideRocket()
      // 设置初始日志，但不重置连接状态
      setLogs(prevLogs => [`${CLIENT_LOG_PREFIX}开始执行任务\n--------------------\n\n`, ...prevLogs])
    } else {
      showRocket()
      // 模态框关闭时完全重置状态
      resetState()
      prevTaskIdRef.current = ''
    }
  }, [isOpen, initialLogs])

  /**
   * 连接任务日志
   */
  const connectTaskLogs = () => {
    if (!taskId) return null

    setIsConnecting(true)
    setIsCompleted(false)

    /** 构建连接URL，断线重连时附加上次接收的日志索引 */
    const url = needReconnect
      ? `${api.runTask}?id=${taskId}&lastIndex=${logIndex}`
      : `${api.runTask}?id=${taskId}`

    /** 连接任务执行端点 */
    const eventSource = eventSourcePolyfill(url)

    /** 连接成功 */
    eventSource.onopen = () => {
      setIsConnecting(false)
      setIsReconnecting(false)
      setNeedReconnect(false)
      if (!needReconnect) {
        setLogs(prevLogs => [...prevLogs, `${CLIENT_LOG_PREFIX}连接已建立，正在接收任务日志...`])
      } else {
        setLogs(prevLogs => [...prevLogs, `${CLIENT_LOG_PREFIX}已重新连接，继续接收任务日志...`])
      }
    }

    /** 接收消息 */
    eventSource.onmessage = (event) => {
      const data = event.data
      setLogIndex(prevIndex => prevIndex + 1)
      /** 判断任务是否完成 */
      if (data === 'end') {
        setIsCompleted(true)
        /** 关闭连接 */
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }
        setLogs(prevLogs => [...prevLogs, `\n--------------------\n${CLIENT_LOG_PREFIX}任务已完成`])
        return
      }

      setLogs(prevLogs => [...prevLogs, data])
      /** 滚动到底部 */
      if (logContainerRef.current) {
        setTimeout(() => {
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
          }
        }, 0)
      }
    }

    /** 发生错误或连接断开 */
    eventSource.onerror = (error) => {
      /** 检查连接状态 */
      if (eventSource.readyState === EventSource.CLOSED) {
        setLogs(prevLogs => [...prevLogs, `\n${CLIENT_LOG_PREFIX}连接已关闭`])
        setNeedReconnect(true)
      } else {
        setLogs(prevLogs => [...prevLogs, `\n${CLIENT_LOG_PREFIX}连接发生错误`])
        setNeedReconnect(true)
        console.error('EventSource 错误:', error)
      }

      setIsCompleted(true)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }

    return eventSource
  }

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

    // 避免重复连接同一个任务
    if (!eventSourceRef.current) {
      eventSourceRef.current = connectTaskLogs()
    }

    return cleanup
  }, [isOpen, taskId])

  /** 处理断线重连 */
  useEffect(() => {
    if (needReconnect && !isReconnecting && isOpen && taskId) {
      setIsReconnecting(true)
      const reconnectTimer = setTimeout(() => {
        setLogs(prevLogs => [...prevLogs, `${CLIENT_LOG_PREFIX}尝试重新连接...`])
        eventSourceRef.current = connectTaskLogs()
      }, 3000)

      return () => clearTimeout(reconnectTimer)
    }
  }, [needReconnect, isReconnecting, isOpen, taskId])

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
          {/* 桌面端布局 */}
          <div className='hidden md:flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <LuActivity size={20} className='text-primary-500' />
              <div className='text-lg font-light tracking-tight'>{taskName}</div>
              {(isConnecting || isReconnecting) && <Spinner size='sm' color='primary' />}
            </div>
            <div className='text-xs text-default-500 mr-7'>
              {taskId && <span>任务ID: {taskId}</span>}
            </div>
          </div>
          {/* 移动端布局，在小屏幕上将标题和任务ID分为两行 */}
          <div className='md:hidden flex flex-col w-full'>
            <div className='flex items-center gap-2'>
              <LuActivity size={20} className='text-primary-500' />
              <div className='text-base font-medium line-clamp-1'>{taskName}</div>
              {(isConnecting || isReconnecting) && <Spinner size='sm' color='primary' />}
            </div>
            {taskId && <div className='text-xs text-default-500 mt-1'>任务ID: {taskId}</div>}
          </div>
        </ModalHeader>

        <Divider className='opacity-50 m-0' />

        <ModalBody>
          <div
            ref={logContainerRef}
            className='h-full w-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap break-words bg-default-50'
          >
            {logs.length === 0
              ? (
                <div className='flex items-center justify-center h-full text-default-500'>
                  {isConnecting ? '正在连接任务日志...' : '暂无日志'}
                </div>
              )
              : (
                logs.map((log, index) => (
                  <div key={index} className='py-0.5 overflow-x-hidden break-words'>{log}</div>
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
