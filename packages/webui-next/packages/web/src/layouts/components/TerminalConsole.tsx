/**
 * @file TerminalConsole.tsx
 * @description 终端控制台组件，用于展示系统状态和实时日志
 */

import { useState, useEffect, useRef } from 'react'
import { Select, ListBox, Input, Label, Description } from '@heroui/react'
import { FiTerminal, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { gsap } from 'gsap'
import { useRequest } from 'ahooks'
import { format } from 'date-fns'
import type { TerminalLog, DashboardData } from '@karinjs/types'
import request from '@/api/request'

/**
 * 终端控制台组件的属性接口
 */
export interface TerminalConsoleProps {
  /** 控制台是否处于展开状态 */
  isOpen: boolean
  /** 切换控制台展开/收起状态的回调函数 */
  onToggle: () => void
}

type LogLevelKey = 'all' | 'info' | 'mark' | 'debug' | 'warn' | 'error'

interface LogLevelOption {
  label: string
  description: string
  textClass: string
  dotClass: string
}

/**
 * 日志连接重连间隔（毫秒）
 */
const LOGS_SOCKET_RECONNECT_INTERVAL = 1000

/**
 * 日志消息心跳超时（毫秒）
 */
const LOGS_SOCKET_HEARTBEAT_TIMEOUT = 3600

/**
 * 自动滚动恢复阈值（像素）
 */
const AUTO_SCROLL_RESUME_THRESHOLD = 16

const logLevelOptions: Record<LogLevelKey, LogLevelOption> = {
  all: {
    label: 'ALL',
    description: '全部等级日志',
    textClass: 'text-foreground',
    dotClass: 'bg-muted'
  },
  info: {
    label: 'INFO',
    description: '信息等级日志',
    textClass: 'text-success',
    dotClass: 'bg-success'
  },
  mark: {
    label: 'MARK',
    description: '标记等级日志',
    textClass: 'text-muted',
    dotClass: 'bg-muted'
  },
  debug: {
    label: 'DEBUG',
    description: '调试等级日志',
    textClass: 'text-cyan-500',
    dotClass: 'bg-cyan-500'
  },
  warn: {
    label: 'WARN',
    description: '警告等级日志',
    textClass: 'text-warning',
    dotClass: 'bg-warning'
  },
  error: {
    label: 'ERROR',
    description: '错误等级日志',
    textClass: 'text-danger',
    dotClass: 'bg-danger'
  }
}

const normalizeLogLevel = (level: string): LogLevelKey => {
  const normalizedLevel = level.toLowerCase()
  if (normalizedLevel === 'warning') return 'warn'
  if (normalizedLevel in logLevelOptions) return normalizedLevel as LogLevelKey
  return 'all'
}

/**
 * 获取不同日志级别对应的样式类
 * @param level - 日志级别
 * @returns 返回对应的 Tailwind CSS 类名
 */
const getLevelStyle = (level: string): string => {
  const normalizedLevel = normalizeLogLevel(level)
  if (normalizedLevel === 'all') return 'text-muted'
  return logLevelOptions[normalizedLevel].textClass
}

/**
 * 格式化日志时间戳
 * @param timestamp 日志时间戳（毫秒）
 * @returns 格式化后的时间文本
 */
const formatLogTimestamp = (timestamp: number | string): string => {
  if (typeof timestamp === 'number') {
    return format(new Date(timestamp), 'HH:mm:ss')
  }
  const parsedValue = Number(timestamp)
  if (!Number.isNaN(parsedValue)) {
    return format(new Date(parsedValue), 'HH:mm:ss')
  }
  return String(timestamp)
}

/**
 * 日志 SSE 接口地址
 * @returns SSE 地址
 */
const logsStreamPath = '/logs/stream'

/**
 * 终端控制台组件
 * @param props - 包含 isOpen 和 onToggle 的属性对象
 * @returns 渲染的终端控制台 React 元素
 */
const TerminalConsole = ({ isOpen, onToggle }: TerminalConsoleProps) => {
  /** 当前选中的日志级别过滤条件 */
  const [logLevel, setLogLevel] = useState<LogLevelKey>('all')
  /** 终端日志列表 */
  const [logs, setLogs] = useState<TerminalLog[]>([])
  /** 日志流是否已连接 */
  const [isLogsSocketConnected, setIsLogsSocketConnected] = useState<boolean>(false)

  /** 终端日志容器底部的引用，用于自动滚动 */
  const terminalEndRef = useRef<HTMLDivElement>(null)
  /** 终端日志滚动容器引用 */
  const logsViewportRef = useRef<HTMLDivElement>(null)
  /** 整个控制台容器的引用，用于动画控制高度 */
  const containerRef = useRef<HTMLDivElement>(null)
  /** 最近日志元素的引用，用于动画控制 */
  const recentLogRef = useRef<HTMLDivElement>(null)
  /** 系统状态元素的引用，用于动画控制 */
  const systemStatsRef = useRef<HTMLDivElement>(null)
  const consoleBodyRef = useRef<HTMLDivElement>(null)
  const connectionBadgeRef = useRef<HTMLDivElement>(null)
  const [isConsoleBodyMounted, setIsConsoleBodyMounted] = useState<boolean>(isOpen)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true)
  const isBackendConnected = isLogsSocketConnected

  /**
   * 轮询获取仪表盘核心数据（CPU/RAM）
   */
  const { data: dashboardData } = useRequest(async () => {
    const json = await request.get('/dashboard/trend')
    return json.data as DashboardData
  })

  /**
   * 通过 SSE 持续接收日志流
   */
  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let heartbeatWatchdogTimer: ReturnType<typeof setTimeout> | null = null
    let disposeSSE: (() => void) | null = null
    let disposed = false

    /**
     * 清理日志连接定时器
     * @returns void
     */
    const clearSocketTimers = (): void => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
      if (heartbeatWatchdogTimer) {
        clearTimeout(heartbeatWatchdogTimer)
        heartbeatWatchdogTimer = null
      }
    }

    /**
     * 重置日志心跳看门狗
     * @returns void
     */
    const resetHeartbeatWatchdog = (): void => {
      if (heartbeatWatchdogTimer) {
        clearTimeout(heartbeatWatchdogTimer)
      }
      heartbeatWatchdogTimer = setTimeout(() => {
        setIsLogsSocketConnected(false)
        if (disposeSSE) {
          disposeSSE()
          disposeSSE = null
        }
        if (disposed || reconnectTimer) return
        reconnectTimer = setTimeout(connect, LOGS_SOCKET_RECONNECT_INTERVAL)
      }, LOGS_SOCKET_HEARTBEAT_TIMEOUT)
    }

    /**
     * 建立日志 SSE 连接
     */
    const connect = (): void => {
      clearSocketTimers()
      disposeSSE = request.createSSE<TerminalLog>(logsStreamPath, {
        onMessage: (log) => {
          setLogs((prev) => {
            const newLogs = [...prev, log]
            const uniqueLogs = Array.from(new Map(newLogs.map((item) => [item.id, item])).values())
            return uniqueLogs.slice(-100)
          })
          setIsLogsSocketConnected(true)
          resetHeartbeatWatchdog()
        },
        onError: (error) => {
          setIsLogsSocketConnected(false)
          if (disposeSSE) {
            disposeSSE()
            disposeSSE = null
          }
          if (disposed || reconnectTimer) return
          console.error('Logs SSE error:', error)
          reconnectTimer = setTimeout(connect, LOGS_SOCKET_RECONNECT_INTERVAL)
        }
      })
    }

    connect()
    return () => {
      disposed = true
      clearSocketTimers()
      if (disposeSSE) {
        disposeSSE()
        disposeSSE = null
      }
    }
  }, [])

  /** 系统状态数据引用 */
  const stats = dashboardData?.metrics

  /**
   * 处理连接状态标识过渡动画
   */
  useEffect(() => {
    if (!connectionBadgeRef.current) return
    gsap.fromTo(
      connectionBadgeRef.current,
      { autoAlpha: 0.68, scale: 0.98 },
      { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'power2.out' }
    )
  }, [isBackendConnected])

  /**
   * 初始化 GSAP 元素的初始位置
   */
  useEffect(() => {
    if (systemStatsRef.current && recentLogRef.current) {
      gsap.set(systemStatsRef.current, {
        yPercent: isOpen ? 0 : 100,
        opacity: isOpen ? 1 : 0
      })
      gsap.set(recentLogRef.current, {
        yPercent: isOpen ? -100 : 0,
        opacity: isOpen ? 0 : 1
      })
      if (consoleBodyRef.current) {
        gsap.set(consoleBodyRef.current, {
          autoAlpha: isOpen ? 1 : 0,
          y: isOpen ? 0 : 10
        })
      }
    }
  }, [])

  /**
   * 处理日志容器滚动事件
   * @returns void
   */
  const handleLogsViewportScroll = (): void => {
    if (!logsViewportRef.current) return
    const distanceToBottom = logsViewportRef.current.scrollHeight - logsViewportRef.current.scrollTop - logsViewportRef.current.clientHeight
    setIsAutoScrollEnabled(distanceToBottom <= AUTO_SCROLL_RESUME_THRESHOLD)
  }

  /**
   * 监听日志更新和展开状态，自动滚动到底部
   */
  useEffect(() => {
    if (isOpen && isAutoScrollEnabled && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, logs, logLevel, isAutoScrollEnabled])

  /**
   * 处理控制台展开与收起时的 GSAP 动画
   */
  useEffect(() => {
    if (containerRef.current && recentLogRef.current && systemStatsRef.current) {
      if (isOpen) {
        setIsConsoleBodyMounted(true)
      }

      if (consoleBodyRef.current) {
        gsap.killTweensOf(consoleBodyRef.current)
      }
      gsap.killTweensOf(recentLogRef.current)
      gsap.killTweensOf(systemStatsRef.current)

      window.dispatchEvent(new CustomEvent('layout:animating'))

      const tl = gsap.timeline({
        onComplete: () => {
          if (!isOpen) {
            setIsConsoleBodyMounted(false)
          }
          window.dispatchEvent(new CustomEvent('layout:animated'))
        }
      })

      if (isOpen) {
        tl.to(recentLogRef.current, { yPercent: -100, opacity: 0, duration: 0.45, ease: 'power3.inOut' })
          .to(systemStatsRef.current, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.inOut' }, "<")
        if (consoleBodyRef.current) {
          tl.fromTo(
            consoleBodyRef.current,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' },
            '-=0.26'
          )
        }
      } else {
        if (consoleBodyRef.current) {
          tl.to(consoleBodyRef.current, { autoAlpha: 0, y: 10, duration: 0.32, ease: 'power2.inOut' })
        }
        tl.to(systemStatsRef.current, { yPercent: 100, opacity: 0, duration: 0.38, ease: 'power3.inOut' }, 0)
          .to(recentLogRef.current, { yPercent: 0, opacity: 1, duration: 0.38, ease: 'power3.inOut' }, 0.02)
      }
    }
  }, [isOpen])

  /** 最新的一条日志记录 */
  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null

  return (
    <div
      ref={containerRef}
      className="bg-surface-secondary flex flex-col font-mono z-40 h-full w-full relative"
    >
      {/* 终端头部 / 收起状态的预览视图 */}
      <div
        className="flex items-center justify-between px-4 h-10 border-b border-border select-none cursor-pointer w-full shrink-0"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <span className="text-sm font-bold text-default-500 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap shrink-0">
            <FiTerminal size={16} />
            控制台输出
          </span>
          {/* 放大尺寸的连接状态指示器 */}
          <div
            ref={connectionBadgeRef}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md shrink-0 ${isBackendConnected ? 'bg-success-soft' : 'bg-danger-soft'}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${isBackendConnected ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
            <span className={`text-sm font-bold uppercase tracking-wider leading-none ${isBackendConnected ? 'text-success' : 'text-danger'}`}>
              {isBackendConnected ? '已连接' : '已离线'}
            </span>
          </div>

          <div className="relative h-10 flex-1 flex items-center overflow-hidden w-full max-w-200">
            {/* 展开状态：系统状态统计 (动画移动) */}
            <div
              ref={systemStatsRef}
              className="absolute left-0 flex items-center gap-4 text-xs font-normal tracking-wider whitespace-nowrap"
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Select
                  className="w-36"
                  value={logLevel}
                  onChange={(key) => {
                    if (key) setLogLevel(normalizeLogLevel(String(key)))
                  }}
                  aria-label="日志等级"
                >
                  <Select.Trigger className="h-8 min-h-8 bg-surface border border-border shadow-md rounded-md px-2.5">
                    <Select.Value className="text-xs font-bold text-foreground">
                      {({ defaultChildren, isPlaceholder, state }) => {
                        if (isPlaceholder || state.selectedItems.length === 0) {
                          return defaultChildren
                        }
                        if (state.selectedItems.length > 1) {
                          return `已选择 ${state.selectedItems.length} 个等级`
                        }
                        const selectedLogLevel = normalizeLogLevel(String(state.selectedItems[0]?.key ?? 'all'))
                        const selectedOption = logLevelOptions[selectedLogLevel]
                        return (
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${selectedOption.dotClass}`}></span>
                            <span className={`text-xs font-bold tracking-wide ${selectedOption.textClass}`}>{selectedOption.label}</span>
                          </div>
                        )
                      }}
                    </Select.Value>
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover className="bg-surface border border-border shadow-lg rounded-lg">
                    <ListBox>
                      {Object.entries(logLevelOptions).map(([id, option]) => (
                        <ListBox.Item key={id} id={id} textValue={option.label}>
                          <div className="flex items-center gap-2.5 py-1.5">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${option.dotClass}`}></span>
                            <div className="flex flex-col leading-tight">
                              <Label className={`text-xs font-bold tracking-wide ${option.textClass}`}>{option.label}</Label>
                              <Description className="text-[10px] text-default-400 font-normal">{option.description}</Description>
                            </div>
                            <ListBox.ItemIndicator className="ml-auto" />
                          </div>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
              <div className="w-px h-3 bg-default-200"></div>
              <span className="text-primary font-bold">RAM: {stats?.memoryUsage || '0'}GB/{stats?.memoryTotal || '0'}GB</span>
              <div className="w-px h-3 bg-default-200"></div>
              <span className="text-secondary font-bold">CPU: {stats?.cpuLoad || 0}%</span>
            </div>

            {/* 收起状态：最近的日志记录 (在收起时可见) */}
            <div
              ref={recentLogRef}
              className="absolute left-0 flex items-center gap-4 text-sm text-default-400 font-normal tracking-wider whitespace-nowrap"
            >
              <div className="w-px h-3 bg-default-200"></div>
              <span className="text-primary font-bold">RAM: {stats?.memoryUsage || '0'}GB/{stats?.memoryTotal || '0'}GB</span>
              <div className="w-px h-3 bg-default-200"></div>
              <span className="text-secondary font-bold">CPU: {stats?.cpuLoad || 0}%</span>
              <div className="w-px h-3 bg-default-200"></div>
              <span className="truncate max-w-125">最近日志: {latestLog ? <><span className={`${getLevelStyle(latestLog.level)} font-bold`}>{latestLog.level}:</span> {latestLog.message}</> : '暂无日志'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4 shrink-0">
          {/* 点击图标触发控制台收起/展开，由于外层有 onClick 且冒泡，这里不需要单独绑定 onToggle */}
          <div className="text-default-400 hover:text-foreground p-1 cursor-pointer transition-transform duration-300">
            {isOpen ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
          </div>
        </div>
      </div>

      {isConsoleBodyMounted && (
        <div ref={consoleBodyRef} className="flex-1 flex flex-col min-h-0">
          <div
            ref={logsViewportRef}
            onScroll={handleLogsViewportScroll}
            className="flex-1 p-4 text-sm overflow-y-auto flex flex-col leading-relaxed tracking-wide custom-scrollbar bg-background"
          >
            {logs.filter(log => logLevel === 'all' || normalizeLogLevel(log.level) === logLevel).map(log => (
              <div key={log.id} className="text-default-500">
                <span className="text-accent">[{formatLogTimestamp(log.timestamp)}]</span>{' '}
                <span className={`${getLevelStyle(log.level)} font-bold`}>{log.level}:</span>{' '}
                {log.message}
              </div>
            ))}
            <div className="text-default-400 italic mt-2 opacity-50">... streaming logs ...</div>
            <div ref={terminalEndRef} />
          </div>

          {/* 终端命令输入框 */}
          <div className="px-4 py-2 bg-surface-secondary border-t border-border flex items-center gap-3 shrink-0">
            <div className="w-5 h-5 bg-accent-soft text-accent flex items-center justify-center rounded text-xs font-bold">❯</div>
            <Input
              className="bg-transparent border-none outline-none text-foreground flex-1 placeholder:text-default-400 font-mono text-sm"
              placeholder="输入命令 (例如: karin help)..."
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TerminalConsole
