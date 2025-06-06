import { title } from '@/components/primitives.ts'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import clsx from 'clsx'
import { Button } from '@heroui/button'
import { RiRestartLine, RiShutDownLine } from 'react-icons/ri'
import { Tooltip } from '@heroui/tooltip'
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { VscBracketError } from 'react-icons/vsc'
import { getSystemStatus } from '@/lib/status'
import SystemStatusDisplay from '@/components/system_display_card'
import Counter from '@/components/counter.tsx'
import RotatingText from '@/components/RotatingText'
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
import axios from 'axios'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { testGithub } from '@/lib/test-url'
import Markdown from '@/components/Markdown'
import { GithubRelease } from '@/types/release'
import { compareVersion, extractUpdateLogs } from '@/lib/version'
import { Chip } from '@heroui/chip'
import { getPackageInfo } from '@/lib/utils'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Spinner } from '@heroui/spinner'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import NetworkMonitor from '@/components/NetworkMonitor'
import { Switch } from '@heroui/switch'
import ConsoleMessage from '@/components/ConsoleMessage'
import { getKarinStatusRequest } from '@/request/status'
import key from '@/consts/key'
import { restartRequest } from '@/request/restart'

interface IconMap {
  [key: string]: LucideIcon
}

const iconMap: IconMap = {
  名称: Tag,
  PID: Cpu,
  'PM2 ID': Server,
  运行时间: Clock,
  插件数量: Puzzle,
  BOT数量: Bot,
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

function OnlineStatus () {
  const { data, error } = useRequest(() => getKarinStatusRequest(), {
    pollingInterval: 1000,
  })
  const msg = []
  data?.version && msg.push(data.version)
  error ? msg.push('离线') : msg.push('在线')

  return (
    <div className='ml-4 flex items-center gap-2'>
      <div className={clsx(
        'rounded-full w-3 h-3',
        error ? 'bg-danger' : 'bg-success'
      )}
      />
      <RotatingText
        texts={msg}
        ClassName='px-3 sm:px-1 md:px-2 bg-primary-400 text-default-50 font-bold rounded-lg'
        staggerFrom='last'
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-120%' }}
        staggerDuration={0.025}
        splitLevelClassName='overflow-hidden'
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        rotationInterval={4000}
      />
    </div>
  )
}

export interface StatusItemProps {
  title: string
  value: React.ReactNode
}
function StatusItem ({ title, value }: StatusItemProps) {
  const IconComponent = iconMap[title] || Tag
  return (
    <Card
      className='transition-all duration-150 ease-in-out hover:bg-default-100 dark:hover:bg-default-100 hover:translate-y-[-4px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-default-200 dark:border-default-100 cursor-pointer'
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

function UpdateButtons ({ handleCloseModal }: { handleCloseModal: () => void }) {
  const [running, setRunning] = useState(false)
  const dialog = useDialog()
  const onUpdate = async () => {
    dialog.confirm({
      title: '更新',
      content: '确认更新吗',
      onConfirm: async () => {
        try {
          try {
            setRunning(true)
            const { status } = await request.serverGet<{ status: 'ok' | 'failed' }>('/api/v1/system/update', { timeout: 30000 })
            if (status === 'ok') {
              toast.success('更新成功，正在重启......')
              await restartRequest({ isPm2: true })
              await new Promise(resolve => {
                const interval = setInterval(async () => {
                  try {
                    await request.serverGet('/api/v1/ping')
                    clearInterval(interval)
                    resolve(null)
                  } catch (e) {
                    console.error(e)
                  }
                }, 2000)
              })
              toast.success('重启成功')
              window.location.reload()
            }
          } catch (e: any) {
            toast.error(e.message)
          }
        } catch (e) {
          console.log(e)
          toast.error('重启失败')
        } finally {
          setRunning(false)
        }
      },
    })
  }

  return (
    <div className='flex gap-2 ml-auto'>
      {running && <FullScreenLoader />}
      <Button
        color='primary'
        variant='shadow'
        isDisabled={running}
        onPress={onUpdate}
      >
        更新
      </Button>
      <Button
        color='danger'
        variant='shadow'
        isDisabled={running}
        onPress={handleCloseModal}
      >
        关闭
      </Button>
    </div>
  )
}

function Status () {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false)
  const [updateTip, setUpdateTip] = useState(false)
  const [proxyFn, setProxyFn] = useState(() => (url: string) => url)
  const [proxyFnInitialized, setProxyFnInitialized] = useState(false)
  const [npmLatest, setNpmLatest] = useState(false)
  const [hasCheckedNpm, setHasCheckedNpm] = useState(false)
  const [isLoadingRelease, setIsLoadingRelease] = useState(false)

  const { data, error } = useRequest(() => getKarinStatusRequest(), {
    pollingInterval: 1000,
  })

  const localPluginsList = useRequest(() => request.serverPost<LocalApiResponse[], {}>('/api/v1/plugin/local'))
  const botList = useRequest(() => request.serverGet<Array<AdapterType>>('/api/v1/system/get/bots'), {
    pollingInterval: 5000,
  })

  const handleTooltipClick = () => {
    // 只在第一次点击时初始化 proxyFn
    if (!proxyFnInitialized) {
      testGithub().then(fn => {
        if (typeof fn === 'function') {
          setProxyFn(fn)
        } else {
          // 如果不是函数，保持默认的 url => url 函数
          console.warn('testGithub 返回的不是函数，使用默认代理函数')
        }
        setProxyFnInitialized(true)
      })
        .catch(err => {
          console.error('初始化代理函数失败:', err)
          setProxyFnInitialized(true) // 即使失败也标记为已初始化
        })
    }
    // 延迟执行 fetchRelease，确保 proxyFn 已经设置好
    setTimeout(() => {
      fetchRelease()
    }, 100)
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

  const { data: releaseData, error: releaseError, run: fetchRelease } = useRequest(
    async () => {
      setIsLoadingRelease(true)
      try {
        const proxyFunction = typeof proxyFn === 'function' ? proxyFn : (url: string) => url
        const url = proxyFunction('https://raw.githubusercontent.com/karinjs/repo-status/refs/heads/main/data/releases.json')
        const response = await axios.get<GithubRelease[]>(url)
        return response.data
      } catch (error) {
        console.error('获取更新日志失败:', error)
        throw error
      } finally {
        setIsLoadingRelease(false)
      }
    },
    { manual: true, onError: (error) => console.error('版本检测失败', error) }
  )

  const updateLogs = releaseData ? extractUpdateLogs(releaseData, data?.version!) : []

  const stableCards = useMemo(() => {
    if (!data) return <></>

    return (
      <>
        <MemoizedStatusItem title='名称' value={data.name} />
        <MemoizedStatusItem title='PID' value={data.pid} />
        <MemoizedStatusItem title='PM2 ID' value={data.pm2_id} />
        <MemoizedStatusItem title='插件数量' value={localPluginsList.data?.length || '--'} />
        <MemoizedStatusItem title='BOT数量' value={botList.data?.length} />
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

  const middleVersions = useMemo(() => {
    const versions: GithubRelease[] = []
    if (updateLogs && data) {
      for (let i = 0; i < updateLogs.length; i++) {
        const versionInfo = updateLogs[i]
        if (compareVersion(versionInfo.tag_name, data.version) > 0) {
          versions.push(versionInfo)
        } else {
          break
        }
      }
    }
    return versions
  }, [updateLogs, data])

  const handleCloseModal = useCallback(() => {
    setIsChangelogOpen(false)
  }, [])

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
    <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 lg:gap-x-8 lg:gap-y-6'>
      {stableCards}

      <UptimeStatusItem uptime={data.uptime} />

      <Modal
        isOpen={isChangelogOpen}
        onOpenChange={(isOpen) => {
          setIsChangelogOpen(isOpen)
        }}
        size='4xl'
      >
        <ModalContent>
          <ModalHeader className='border-b'>
            <div className='flex items-center gap-2'>
              新版本
              <span className='text-green-400'>{npmLatest || ''}</span>
              可用
              <span className='text-default-400 text-sm'>
                (当前版本：{data.version})
              </span>
            </div>
          </ModalHeader>

          <ModalBody className='max-h-[60vh] overflow-y-auto'>
            <ScrollShadow hideScrollBar>
              {isLoadingRelease
                ? (
                  <div className='flex justify-center items-center h-60'>
                    <Spinner size='lg' color='primary' label='处理中...' />
                  </div>
                )
                : (
                  <>
                    {middleVersions.map((versionInfo) => (
                      <div
                        key={versionInfo.tag_name}
                        className='p-5 bg-default-50 rounded-md shadow-md mb-5'
                      >
                        <div className='mb-2'>
                          {(function () {
                            let tagName = '本体'
                            let color: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary'
                            switch (true) {
                              case versionInfo.tag_name.includes('core'):
                                tagName = '本体'
                                break
                              case versionInfo.tag_name.includes('web'):
                                tagName = 'WEB 界面'
                                color = 'warning'
                                break
                              case versionInfo.tag_name.includes('cli'):
                                tagName = '命令行工具'
                                color = 'secondary'
                                break
                              case versionInfo.tag_name.includes('create'):
                                tagName = '脚手架'
                                color = 'success'
                            }
                            return (
                              <Chip color={color} variant='flat'>
                                {tagName}
                              </Chip>
                            )
                          })()}
                        </div>

                        <Markdown content={versionInfo.body} />
                      </div>
                    ))}
                    {releaseError && (
                      <div className='flex flex-col gap-2 p-4 bg-danger-50 rounded-lg border border-danger-200'>
                        <div className='text-danger font-medium flex items-center gap-2'>
                          <TriangleAlert className='w-5 h-5' />
                          更新日志请求失败...
                        </div>
                        <div className='text-default-600 text-sm'>
                          <div className='mb-2'>
                            错误详情: {
                              axios.isAxiosError(releaseError)
                                ? `${releaseError.message} (状态码: ${releaseError.response?.status || '未知'})`
                                : releaseError.message || '未知错误'
                            }
                          </div>
                          您可以直接前往
                          <a
                            href='https://github.com/KarinJS/Karin/releases'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary underline ml-1'
                          >
                            GitHub Releases
                          </a>
                          页面查看最新更新内容。
                        </div>
                      </div>
                    )}
                  </>
                )}
            </ScrollShadow>
          </ModalBody>

          <ModalFooter>
            <UpdateButtons handleCloseModal={handleCloseModal} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
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

function ControlButtons () {
  const [running, setRunning] = useState(false)
  const dialog = useDialog()
  const onRestart = async () => {
    dialog.confirm({
      title: '重启',
      content: '确认重启吗',
      onConfirm: async () => {
        try {
          setRunning(true)
          await restartRequest({ isPm2: false })
          await new Promise(resolve => {
            const interval = setInterval(async () => {
              try {
                await request.serverGet('/api/v1/ping')
                clearInterval(interval)
                resolve(null)
              } catch (e) {
                console.error(e)
              }
            }, 2000)
          })
          toast.success('重启成功')
        } catch (e) {
          toast.error('重启失败')
        } finally {
          setRunning(false)
        }
      },
    })
  }

  const onShutDown = async () => {
    dialog.confirm({
      title: '关机',
      content: '确认关机吗',
      onConfirm: async () => {
        try {
          setRunning(true)
          await request.serverPost('/api/v1/exit')
          window.location.reload()
          toast.success('关机成功')
        } catch (e) {
          toast.error('关机失败')
        } finally {
          setRunning(false)
        }
      },
    })
  }

  return (
    <div className='flex gap-2 ml-auto'>
      <Tooltip content='重启' showArrow>
        <Button
          className='btn btn-primary text-lg'
          isIconOnly
          radius='full'
          color='primary'
          variant='flat'
          isDisabled={running}
          onPress={onRestart}
        >
          <RiRestartLine />
        </Button>
      </Tooltip>
      <Tooltip content='关机' showArrow>
        <Button
          className='btn btn-primary text-lg'
          isIconOnly
          radius='full'
          color='primary'
          variant='shadow'
          isDisabled={running}
          onPress={onShutDown}
        >
          <RiShutDownLine />
        </Button>
      </Tooltip>
    </div>
  )
}

export default function IndexPage () {
  ConsoleMessage()
  return (
    <section className='flex flex-col gap-4'>
      <Card shadow='sm'>
        <CardHeader className='px-6 pt-6 pb-0'>
          <div
            className={title({
              size: 'sm',
              color: 'blue',
            })}
          >
            <SplitText
              text='Karin'
              className='text-4xl'
            />
          </div>
          <OnlineStatus />
          <ControlButtons />
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
