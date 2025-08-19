import { useEffect, useRef, useState } from 'react'
import XTerm, { type XTermRef } from '@/components/xterm'
import terminalManager from '@/controllers/terminal_manager'
import toast from 'react-hot-toast'

interface TerminalInstanceProps {
  id: string
}

export function TerminalInstance ({ id }: TerminalInstanceProps) {
  const terminalRef = useRef<XTermRef>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error' | 'initial'>('initial')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // 处理终端数据
  const handleTerminalData = (data: string) => {
    try {
      const parsed = JSON.parse(data)
      if (parsed.data) {
        terminalRef.current?.write(parsed.data)
      }
    } catch (e) {
      // 如果不是有效的JSON，直接写入原始数据
      terminalRef.current?.write(data)
    }
  }

  // 处理连接状态变化
  const handleConnectionStatus = (terminalId: string, status: 'connected' | 'disconnected' | 'error', message?: string) => {
    if (terminalId === id) {
      // 之前未断开但现在断开了，显示toast提示
      if (connectionStatus !== 'disconnected' && connectionStatus !== 'error' &&
        (status === 'disconnected' || status === 'error')) {
        toast.error(status === 'disconnected'
          ? '终端连接已断开，请关闭此选项卡并创建新的终端'
          : '终端连接错误，请关闭此选项卡并创建新的终端'
        )
      }

      setConnectionStatus(status)
      if (message) {
        setErrorMessage(message)
      }
    }
  }

  useEffect(() => {
    // 连接终端
    terminalManager.connectTerminal(
      id,
      handleTerminalData,
      { statusCallback: handleConnectionStatus }
    )

    return () => {
      terminalManager.disconnectTerminal(id, handleTerminalData, handleConnectionStatus)
    }
  }, [id])

  // 处理终端断开连接UI
  if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-400 text-center'>
        <div className='max-w-md p-4'>
          <h3 className='text-lg font-medium mb-2'>
            {connectionStatus === 'disconnected' ? '终端连接已断开' : '终端连接错误'}
          </h3>
          <p>{errorMessage || '连接已关闭，请关闭此选项卡并创建新的终端'}</p>
        </div>
      </div>
    )
  }

  return (
    <XTerm
      ref={terminalRef}
      onInput={(data) => terminalManager.sendInput(id, data)}
      onResize={(cols, rows) => terminalManager.sendResize(id, cols, rows)}
      className='h-full'
    />
  )
}
