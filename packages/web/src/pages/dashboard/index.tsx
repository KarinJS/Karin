import { Card, CardBody, CardHeader } from '@heroui/card'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
// import clsx from 'clsx'
import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import { VscBracketError } from 'react-icons/vsc'
import { getSystemStatus } from '@/lib/status'
import SystemStatusDisplay from '@/components/system_display_card'
import Counter from '@/components/counter.tsx'
// import RotatingText from '@/components/RotatingText'
import SplitText from '@/components/SplitText'
import type { AdapterType, LocalApiResponse } from 'node-karin'
import type { NetworkStatus, SystemStatus } from '@/types/server'
import {
  Tag,
  Cpu,
  Server,
  Clock,
  Puzzle,
  Bot,
  Terminal,
  GitBranch,
  LucideIcon,
  TriangleAlert,
} from 'lucide-react'
import { LuInfo, LuNetwork } from 'react-icons/lu'
import { testGithub } from '@/lib/test-url'
import { compareVersion } from '@/lib/version'
import { getPackageInfo } from '@/lib/utils'
import { Spinner } from '@heroui/spinner'
import NetworkMonitor from '@/components/NetworkMonitor'
import { Switch } from '@heroui/switch'
import ConsoleMessage from '@/components/ConsoleMessage'
import { getKarinStatusRequest } from '@/request/status'
import key from '@/consts/key'
import ControlButtons from '@/components/common/ControlButtons'
import UpdateLogModal from '@/components/UpdateLogModal'

interface IconMap {
  [key: string]: LucideIcon
}

const iconMap: IconMap = {
  名称: Tag,
  PID: Cpu,
  'PM2 ID': Server,
  运行时间: Clock,
  插件数量: Puzzle,
  适配器数量: Bot,
  运行环境: Terminal,
  版本: GitBranch,
}

const generatePlaces = (value: number): number[] => {
  const digits = Math.floor(value).toString().length
  return Array.from({ length: digits }, (_, i) => 10 ** (digits - 1 - i))
}

function getWindowSizeCategory () {
  const width = window.innerWidth

  if (width < 768) {
    return 'sm'
  } else if (width >= 768 && width < 1024) {
    return 'md'
  } else {
    return 'lg'
  }
}

// function OnlineStatus () {
//   const { data, error } = useRequest(() => getKarinStatusRequest(), {
//     pollingInterval: 1000,
//   })
//   const msg = []
//   data?.version && msg.push(data.version)
//   error ? msg.push('离线') : msg.push('在线')

//   return (
//     <div className='ml-4 flex items-center gap-2'>
//       <div className={clsx(
//         'rounded-full w-3 h-3',
//         error ? 'bg-danger' : 'bg-success'
//       )}
//       />
//       <RotatingText
//         texts={msg}
//         ClassName='px-3 sm:px-1 md:px-2 bg-primary-400 text-default-50 font-bold rounded-lg'
//         staggerFrom='last'
//         initial={{ y: '100%' }}
//         animate={{ y: 0 }}
//         exit={{ y: '-120%' }}
//         staggerDuration={0.025}
//         splitLevelClassName='overflow-hidden'
//         transition={{ type: 'spring', damping: 30, stiffness: 400 }}
//         rotationInterval={4000}
//       />
//     </div>
//   )
// }

export interface StatusItemProps {
  title: string
  value: React.ReactNode
}
function StatusItem ({ title, value }: StatusItemProps) {
  const IconComponent = iconMap[title] || Tag
  return (
    <Card
      className='ease-in-out hover:bg-default-100 dark:hover:bg-default-100 hover:translate-y-[-4px] border cursor-pointer glass-effect'
    >
      <CardHeader className='px-2.5 py-1.5 md:px-2.5 md:py-2 lg:px-4 lg:py-3  flex-col items-start'>
        <div className='flex items-center gap-2'>
          <IconComponent className='w-4 h-4 lg:w-5 lg:h-5 text-primary' />
          <p className='text-sm text-primary select-none'>{title}</p>
        </div>
        <div className='mt-1 md:mt-2 lg:mt-3 text-lg md:text-xl lg:text-2xl text-default-800 font-mono font-bold'>{value || '--'}</div>
      </CardHeader>
    </Card>
  )
}

// 使用 React.memo 包装 StatusItem 组件，只在 props 变化时重新渲染
const MemoizedStatusItem = React.memo(StatusItem)

// 单独抽离运行时间组件，因为它需要频繁更新
function UptimeStatusItem ({ uptime }: { uptime: number }) {
  return (
    <MemoizedStatusItem
      title='运行时间'
      value={
        <div className='flex items-center gap-2'>
          <Counter
            className='flex items-center gap-0'
            value={Math.floor(uptime)}
            fontSize={(() => {
              const size = getWindowSizeCategory()
              switch (size) {
                case 'sm':
                  return 18
                case 'md':
                  return 20
                case 'lg':
                  return 24
                default:
                  return 24
              }
            })()}
            places={generatePlaces(Math.floor(uptime))}
          />
          <span>秒</span>
        </div>
      }
    />
  )
}

function Status () {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)
  const [updateTip, setUpdateTip] = useState(false)
  const [proxyFn, setProxyFn] = useState(() => (url: string) => url)
  const [proxyFnInitialized, setProxyFnInitialized] = useState(false)
  const [npmLatest, setNpmLatest] = useState<string | false>(false)
  const [hasCheckedNpm, setHasCheckedNpm] = useState(false)

  const { data, error } = useRequest(() => getKarinStatusRequest(), {
    // pollingInterval: 1000,
  })

  const localPluginsList = useRequest(() => request.serverPost<LocalApiResponse[], {}>('/api/v1/plugin/local'))
  const botList = useRequest(() => request.serverGet<Array<AdapterType>>('/api/v1/system/get/bots'), {
    // pollingInterval: 5000,
  })

  const handleTooltipClick = () => {
    // 只在第一次点击时初始化 proxyFn
    if (!proxyFnInitialized) {
      testGithub().then(fn => {
        if (typeof fn === 'function') {
          setProxyFn(fn)
        } else {
          console.warn('testGithub 返回的不是函数，使用默认代理函数')
        }
        setProxyFnInitialized(true)
      })
        .catch(err => {
          console.error('初始化代理函数失败:', err)
          setProxyFnInitialized(true)
        })
    }
    setIsChangelogOpen(true)
  }

  useEffect(() => {
    if (data?.version && !hasCheckedNpm) {
      setHasCheckedNpm(true)
      getPackageInfo('node-karin')
        .then((res) => {
          const npmLatestVersion = res.latest
          if (npmLatestVersion && compareVersion(npmLatestVersion, data.version) > 0) {
            setUpdateTip(true)
            setNpmLatest(res.latest)
          }
        })
        .catch((err) => {
          console.error('npm 注册表版本检测失败', err)
        })
    }
  }, [data, hasCheckedNpm])

  const stableCards = useMemo(() => {
    if (!data) return <></>

    return (
      <>
        <MemoizedStatusItem title='名称' value={data.name} />
        <MemoizedStatusItem title='PID' value={data.pid} />
        <MemoizedStatusItem title='PM2 ID' value={data.pm2_id} />
        <MemoizedStatusItem title='插件数量' value={localPluginsList.data?.length || '--'} />
        <MemoizedStatusItem title='适配器数量' value={botList.data?.length} />
        <MemoizedStatusItem
          title='版本'
          value={
            <div className='flex items-center gap-2'>
              <span>{data.version}</span>
              {updateTip && (
                <Tooltip
                  delay={0}
                  closeDelay={0}
                  placement='bottom-start'
                  content={
                    <div className='px-1 py-2'>
                      新版本
                      <span className='text-green-400 font-bold'>{npmLatest}</span>
                      可用，点击查看更新日志
                    </div>
                  }
                >
                  <LuInfo
                    className='text-danger animate-pulse cursor-help'
                    onClick={handleTooltipClick}
                  />
                </Tooltip>
              )}
            </div>
          }
        />
        <MemoizedStatusItem title='运行环境' value={data.karin_runtime} />
      </>
    )
  }, [
    data,
    localPluginsList.data?.length,
    botList.data?.length,
    updateTip,
    npmLatest,
    handleTooltipClick,
  ])

  if (error || !data) {
    return (
      <div className='flex flex-col justify-center items-center gap-2'>
        <div className='text-danger text-4xl'>
          <VscBracketError />
        </div>
        <div>请求错误</div>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 lg:gap-x-8 lg:gap-y-6'>
        {stableCards}
        <UptimeStatusItem uptime={data.uptime} />
      </div>

      {/* 更新日志模态框 */}
      <UpdateLogModal
        currentVersion={data.version}
        isOpen={isChangelogOpen}
        onOpenChange={setIsChangelogOpen}
        npmLatest={npmLatest}
        proxyFn={proxyFn}
      />
    </>
  )
}

function SystemStatusCard () {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>()
  const getStatus = useCallback(() => {
    try {
      const event = getSystemStatus(setSystemStatus)
      return event
    } catch (error) {
      toast.error('获取系统状态失败')
    }
  }, [])

  useEffect(() => {
    const close = getStatus()
    return () => {
      close?.close()
    }
  }, [getStatus])

  return <SystemStatusDisplay data={systemStatus} />
}

export default function IndexPage () {
  ConsoleMessage()
  return (
    <section className='flex flex-col gap-4'>
      <Card shadow='sm'>
        <CardHeader className='px-6 pt-6 pb-0'>
          <div className='flex flex-col flex-grow gap-4'>
            <div>
              <SplitText
                text='Hello, Karin !'
                className='text-4xl font-semibold text-center tracking-wider'
                delay={100}
                duration={0.6}
                ease='power3.out'
                splitType='chars'
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin='-100px'
                textAlign='center'
              />
            </div>
            <div className='flex justify-end gap-4'>
              <ControlButtons />
            </div>
          </div>
        </CardHeader>
        <CardBody className='px-6 py-6'>
          <Status />
        </CardBody>
      </Card>
      <NetworkMonitorCard />
      <Card shadow='sm'>
        <CardBody>
          <SystemStatusCard />
        </CardBody>
      </Card>
    </section>
  )
}

function NetworkMonitorCard () {
  const [showNetworkMonitor, setShowNetworkMonitor] = useState(() => {
    // 从localStorage读取之前的状态，如果存在则使用，否则默认为false
    return localStorage.getItem(key.networkMonitorVisible) === 'true'
  })
  const [enablePolling, setEnablePolling] = useState(true)
  const [showChart, setShowChart] = useState(true)
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const pollingIntervalRef = useRef<number | null>(null)

  // 当网络监控状态改变时，更新localStorage
  useEffect(() => {
    if (showNetworkMonitor) {
      localStorage.setItem(key.networkMonitorVisible, 'true')
    } else {
      localStorage.removeItem(key.networkMonitorVisible)
    }
  }, [showNetworkMonitor])

  // 初始检查接口是否可用
  const { data: initialData, error: initialError } = useRequest(
    () => request.serverGet<NetworkStatus>('/api/v1/system/get/network'),
    {
      onSuccess: () => {
        setInitialCheckDone(true)
      },
      onError: () => {
        setInitialCheckDone(true)
      },
      manual: false,
      pollingInterval: 0,
    }
  )

  // 实际数据请求 - 使用 manual 模式，手动控制轮询
  const { data, run: fetchNetworkData } = useRequest(
    () => request.serverGet<NetworkStatus>('/api/v1/system/get/network'),
    {
      manual: true,
    }
  )

  // 手动控制轮询，避免 ahooks 内部轮询可能导致的内存泄漏
  useEffect(() => {
    // 清理之前的轮询
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    // 如果满足条件，开始新的轮询
    if (showNetworkMonitor && enablePolling && initialCheckDone && !initialError) {
      // 立即执行一次
      fetchNetworkData()

      // 设置轮询
      pollingIntervalRef.current = window.setInterval(() => {
        fetchNetworkData()
      }, 2000)
    }

    // 组件卸载时清理轮询
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [showNetworkMonitor, enablePolling, initialCheckDone, initialError, fetchNetworkData])

  // 如果初始检查出错，不渲染整个组件
  if (initialError) {
    return null
  }

  // 等待初始检查完成
  if (!initialCheckDone) {
    return (
      <Card shadow='sm'>
        <CardHeader className='p-5 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <LuNetwork className='text-xl text-primary' />
            <span className='text-lg font-semibold'>网络监控</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className='flex flex-col items-center justify-center p-6 gap-2'>
            <Spinner label='检查网络监控可用性...' color='warning' />
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!data && showNetworkMonitor) {
    return (
      <Card shadow='sm'>
        <CardHeader className='p-5 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <LuNetwork className='text-xl text-primary' />
            <span className='text-lg font-semibold'>网络监控</span>
          </div>
          <Button
            color='primary'
            variant='flat'
            size='sm'
            onPress={() => setShowNetworkMonitor(!showNetworkMonitor)}
          >
            {showNetworkMonitor ? '关闭监控' : '开启监控'}
          </Button>
        </CardHeader>
        <CardBody>
          <div className='flex flex-col items-center justify-center p-6 gap-2'>
            <Spinner label='等待请求中' color='warning' />
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card shadow='sm'>
      <CardHeader className='p-5 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <LuNetwork className='text-xl text-primary' />
          <span className='text-lg font-semibold'>网络监控</span>
        </div>
        <Button
          color='primary'
          variant='flat'
          size='sm'
          onPress={() => setShowNetworkMonitor(!showNetworkMonitor)}
        >
          {showNetworkMonitor ? '关闭监控' : '开启监控'}
        </Button>
      </CardHeader>
      <CardBody className='flex gap-4'>
        <div className='px-5 flex items-center gap-3'>
          {showNetworkMonitor && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-base text-default-500'>实时更新</span>
                <Switch
                  isSelected={enablePolling}
                  onChange={(e) => setEnablePolling(e.target.checked)}
                  size='sm'
                  color='primary'
                />
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-base text-default-500'>显示图表</span>
                <Switch
                  isSelected={showChart}
                  onChange={(e) => { setShowChart(e.target.checked) }}
                  size='sm'
                  color='primary'
                />
              </div>
            </div>
          )}
        </div>
        {showNetworkMonitor
          ? (
            <NetworkMonitor
              networkData={data || initialData || { upload: 0, download: 0, totalSent: 0, totalReceived: 0, timestamp: Date.now() }}
              enablePolling={enablePolling}
              onPollingChange={setEnablePolling}
              showChart={showChart}
              onShowChartChange={setShowChart}
            />)
          : (
            <div className='flex flex-col items-center justify-center p-6 gap-2'>
              <TriangleAlert className='text-warning-400' />
              <div className='text-default-400'>网络监控已关闭</div>
            </div>)}
      </CardBody>
    </Card>
  )
}
