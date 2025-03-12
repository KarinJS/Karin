import '@xterm/xterm/css/xterm.css'
import { Card } from '@heroui/card'
import { Terminal } from '@xterm/xterm'
import { parseLogLine } from './parse'
import { Button } from '@heroui/button'
import { Tabs, Tab } from '@heroui/tabs'
import { FitAddon } from '@xterm/addon-fit'
import { useEffect, useState, useRef } from 'react'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { eventSourcePolyfill, request } from '@/lib/request'
import { StreamDownloader } from '@/components/StreamDownloader'
import { IoChevronDown as MoreVerticalIcon } from 'react-icons/io5'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'

import type { Key } from 'react'
import type { FilterLevel, LogItem, LogLevel } from '@/types/log'

const color = {
  trac: {
    color: 'primary',
    name: 'TRACE'
  },
  debu: {
    color: 'primary',
    name: 'DEBUG'
  },
  info: {
    color: 'success',
    name: 'INFO'
  },
  warn: {
    color: 'warning',
    name: 'WARN'
  },
  erro: {
    color: 'danger',
    name: 'ERROR'
  },
  fata: {
    color: 'secondary',
    name: 'FATAL'
  },
  mark: {
    color: 'default',
    name: 'MARK'
  }
} as const

const LOG_LEVELS = Object.keys(color) as LogLevel[]

/**
 * 创建终端
 * @returns 终端实例
 */
const createTerminal = () => {
  const terminal = new Terminal({
    fontSize: 14,
    fontFamily: 'Consolas, "DejaVu Sans Mono", "Courier New", monospace',
    theme: {
      background: '#1a1a1a',
      foreground: '#f0f0f0',
      selectionBackground: '#3b3b3b',
      cursor: '#f0f0f0'
    },
    convertEol: true,
    cursorBlink: false,
    disableStdin: false,
    scrollback: 5000
  })

  return terminal
}

/**
 * 创建日志流
 * @returns 日志流实例
 */
const createEventSource = () => {
  return eventSourcePolyfill('/api/v1/log', {
    withCredentials: true,
    heartbeatTimeout: 60000
  })
}

export default function LogPage () {
  /** 日志行数限制 */
  const [maxLogLines, setMaxLogLines] = useState(1000)
  /** 当前过滤等级 */
  const [selectedLevel, setSelectedLevel] = useState<FilterLevel>('all')
  /** 终端容器 */
  const terminalRef = useRef<HTMLDivElement>(null)
  /** 终端实例 */
  const terminalInstance = useRef<Terminal | null>(null)
  /** 日志流 */
  const eventSourceRef = useRef<EventSource | null>(null)
  /** 日志列表 */
  const logsRef = useRef<LogItem[]>([])
  /** 日志文件列表 */
  const [logFiles, setLogFiles] = useState<string[]>([])
  /** 选中的日志文件 */
  const [selectedFile, setSelectedFile] = useState<string>('')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [selectedTab, setSelectedTab] = useState('realtime')
  /** 历史日志内容 */
  const [historyLogs, setHistoryLogs] = useState<LogItem[]>([])

  /**
   * 设置日志流
   */
  const setEventSource = () => {
    /** 创建日志流 */
    const eventSource = createEventSource()
    /** 设置日志流 */
    eventSourceRef.current = eventSource
    /** 监听日志流 */
    eventSource.onmessage = (event) => {
      /** 解析日志行 */
      const logItem = parseLogLine(event.data)
      if (!logItem) return

      /** 限制日志行数 */
      if (logsRef.current.length >= maxLogLines) {
        logsRef.current = logsRef.current.slice(-maxLogLines + 1)
      }

      /** 添加日志行 */
      logsRef.current.push(logItem)

      /** 如果终端行数超过限制，清除一半的内容 */
      if (selectedLevel === 'all' || logItem.level === selectedLevel) {
        if (terminalInstance.current && terminalInstance.current.buffer.active.length >= maxLogLines) {
          /** 清除一半的内容 */
          terminalInstance.current.clear()
          /** 获取最近一半的内容 */
          const recentLogs = logsRef.current
            .slice(-maxLogLines / 2)
            .filter(log => selectedLevel === 'all' || log.level === selectedLevel)
          /** 写入终端 */
          recentLogs.forEach(log => terminalInstance.current?.writeln(log.message))
        } else {
          /** 写入终端 */
          terminalInstance.current?.writeln(logItem.message)
        }
      }
    }

    eventSource.onerror = (error) => {
      console.error('日志连接出错:', error)
    }
  }

  useEffect(() => {
    if (!terminalRef.current) return
    /** 创建终端 */
    const terminal = createTerminal()
    /** 创建终端适配器 */
    const fitAddon = new FitAddon()
    /** 加载终端适配器 */
    terminal.loadAddon(fitAddon)
    /** 加载终端链接适配器 */
    terminal.loadAddon(new WebLinksAddon())
    /** 打开终端 */
    terminal.open(terminalRef.current)
    /** 调整终端大小 */
    fitAddon.fit()
    /** 监听终端大小变化 */
    terminalInstance.current = terminal
    /** 创建终端大小观察器 */
    const resizeObserver = new ResizeObserver(() => fitAddon.fit())
    /** 观察终端大小变化 */
    resizeObserver.observe(terminalRef.current)
    /** 清理终端 */
    return () => {
      resizeObserver.disconnect()
      terminal.dispose()
    }
  }, [])

  useEffect(() => {
    try {
      /** 连接日志流 */
      setEventSource()
    } catch (error) {
      console.error('日志获取失败:', error)
    }
    return () => {
      eventSourceRef?.current?.close()
    }
  }, [])

  /** 处理日志等级切换 */
  useEffect(() => {
    if (!terminalInstance.current) return

    terminalInstance.current.clear()
    const filteredLogs = selectedLevel === 'all'
      ? logsRef.current
      : logsRef.current.filter(log => log.level === selectedLevel)

    /** 写入终端 */
    filteredLogs.forEach(log => terminalInstance.current?.writeln(log.message))
  }, [selectedLevel])

  /**
   * 获取历史日志
   * @param file 日志文件
   */
  const fetchHistoryLog = async (file: string) => {
    if (!file) return
    setMaxLogLines(9999)
    const content = await request.serverGet<string>(`/api/v1/logs/file?file=${file}`)

    if (terminalInstance.current) {
      terminalInstance.current.clear()
      const logs: LogItem[] = []
      content.split('\n').forEach(line => {
        const logItem = parseLogLine(line)
        if (!logItem) return
        logs.push(logItem)
        if (selectedLevel === 'all' || logItem.level === selectedLevel) {
          terminalInstance.current?.writeln(logItem.message)
        }
      })
      setHistoryLogs(logs)
    }
  }

  /**
   * 写入日志
   * @param writer 写入器
   */
  const handleWrite = async (writer: WritableStreamDefaultWriter<Uint8Array>) => {
    const encoder = new TextEncoder()
    // 根据当前标签页选择要下载的日志
    const logsToWrite = selectedTab === 'realtime' ? logsRef.current : historyLogs
    const logs = selectedLevel === 'all'
      ? logsToWrite
      : logsToWrite.filter(log => log.level === selectedLevel)

    const total = logs.length
    const batchSize = 1000

    for (let i = 0; i < total; i += batchSize) {
      const batch = logs.slice(i, i + batchSize)
      const content = batch
        .map(log => log.message)
        .join('\n') + '\n'

      await writer.write(encoder.encode(content))
    }
  }

  /** 获取日志文件列表 */
  const fetchLogFiles = async () => {
    const res = await request.serverGet<string[]>('/api/v1/logs/list')
    setLogFiles(res)
    if (res.length > 0) {
      setSelectedFile(res[0])
    }
  }

  /** 移动端 */
  const showMobileButtons = () => {
    return (
      <>
        <Button
          size='sm'
          variant='flat'
          color='danger'
          onPress={() => setSelectedLevel('erro')}
        >
          {color.erro.name}
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              size='sm'
              variant='flat'
              color='success'
            >
              更多
              <MoreVerticalIcon className='w-3.5 h-3.5 ml-1' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className='min-w-[120px]'
          >
            {LOG_LEVELS.map(level => {
              if (level === 'erro') return null
              return (
                <DropdownItem
                  key={level}
                  className='data-[hover=true]:bg-default-100'
                  onPress={() => setSelectedLevel(level)}
                >
                  <div className='flex items-center gap-2'>
                    <div className={`w-2 h-2 rounded-full bg-${color[level].color}`} />
                    {color[level].name}
                  </div>
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Dropdown>
      </>
    )
  }

  /** pc端 */
  const showPcButtons = () => {
    return LOG_LEVELS.map(level => {
      if (level === 'trac') {
        return (
          <Button
            key={level}
            size='sm'
            variant='flat'
            className='bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
            onPress={() => setSelectedLevel(level)}
          >
            {color[level].name}
          </Button>
        )
      }

      return (
        <Button
          key={level}
          size='sm'
          variant='flat'
          color={color[level].color}
          onPress={() => setSelectedLevel(level)}
        >
          {color[level].name}
        </Button>
      )
    })
  }

  /** 处理标签切换 */
  const handleTabChange = (key: Key) => {
    setSelectedTab(key as string)
    if (key === 'realtime') {
      setMaxLogLines(1000)
      // 重新显示实时日志...
      if (terminalInstance.current) {
        terminalInstance.current.clear()
        const filteredLogs = selectedLevel === 'all'
          ? logsRef.current
          : logsRef.current.filter(log => log.level === selectedLevel)
        filteredLogs.forEach(log => terminalInstance.current?.writeln(log.message))
      }
    } else {
      // 获取历史日志文件列表
      fetchLogFiles()
    }
  }

  return (
    <div className='space-y-6'>
      {/* 标签页卡片 */}
      <Card className='w-full border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden'>
        <div className='p-4'>
          <div className='flex flex-col md:flex-row md:items-center gap-4'>
            <div className='flex-shrink-0'>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
                size='sm'
                className='min-w-[160px]'
                classNames={{
                  tabList: 'gap-2',
                  tab: 'px-3 h-8'
                }}
              >
                <Tab key='realtime' title='实时日志' />
                <Tab key='history' title='历史日志' />
              </Tabs>
            </div>

            <div className={`flex-shrink-0 ${selectedTab === 'realtime' ? 'md:ml-auto' : ''} flex items-center gap-2`}>
              <div className='flex w-full md:w-auto gap-2'>
                {selectedTab === 'history' && logFiles.length > 0 && (
                  <Dropdown className='flex-1 md:flex-initial'>
                    <DropdownTrigger>
                      <Button
                        size='sm'
                        variant='flat'
                        color='secondary'
                        className='w-full md:w-auto'
                      >
                        {selectedFile || '选择日志文件'}
                        <MoreVerticalIcon className='w-3.5 h-3.5 ml-1' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      className='max-h-[210px] overflow-y-auto'
                    >
                      {logFiles.map(file => (
                        <DropdownItem
                          key={file}
                          onPress={() => {
                            setSelectedFile(file)
                            fetchHistoryLog(file)
                          }}
                        >
                          {file}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )}
                <div className='flex-1 md:flex-initial'>
                  <StreamDownloader
                    onWrite={handleWrite}
                    filename={`system-log-${selectedFile || new Date().toISOString().split('T')[0]}.txt`}
                    className='w-full md:w-auto'
                  >
                    下载日志
                  </StreamDownloader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 控制台卡片 */}
      <Card className='w-full border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden'>
        <div className='p-6'>
          <div className='flex gap-2 flex-wrap mb-4'>
            <Button
              size='sm'
              variant='flat'
              color='default'
              className='bg-gradient-to-r from-gray-500 to-gray-600 text-white'
              onPress={() => setSelectedLevel('all')}
            >
              全部
            </Button>
            {isMobile ? showMobileButtons() : showPcButtons()}
          </div>
          <div className='pl-3 pt-3 pr-3 bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800'>
            <div
              ref={terminalRef}
              className='h-[700px] w-full overflow-hidden'
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
