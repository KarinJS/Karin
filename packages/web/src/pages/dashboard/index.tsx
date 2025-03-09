import { title } from '@/components/primitives.ts'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import clsx from 'clsx'
import type { KarinStatus, SystemStatus } from '@/types/server'
import { Button } from '@heroui/button'
import { RiRestartLine, RiShutDownLine } from 'react-icons/ri'
import { Tooltip } from '@heroui/tooltip'
import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { VscBracketError } from 'react-icons/vsc'
import { getSystemStatus } from '@/lib/status'
import SystemStatusDisplay from '@/components/system_display_card'
import Counter from '@/components/counter.tsx'
import RotatingText from '@/components/RotatingText'
import SplitText from '@/components/SplitText'
import type { AdapterType, LocalApiResponse } from 'node-karin'
import {
  Tag,
  Cpu,
  Server,
  Clock,
  Puzzle,
  Bot,
  Terminal,
  GitBranch,
  LucideIcon
} from 'lucide-react'
import { LuInfo } from 'react-icons/lu'
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
  const { error } = useRequest(
    () =>
      request.serverGet<{
        ping: string
      }>('/api/v1/ping'),
    {
      pollingInterval: 1000,
      // ready: location.pathname === '/dashboard',
    },
  )
  const { data } = useRequest(() => request.serverGet<KarinStatus>('/api/v1/status/karin'))
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
              await request.serverPost('/api/v1/restart')
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
  const [npmLatest, setNpmLatest] = useState(false)
  const [hasCheckedNpm, setHasCheckedNpm] = useState(false)
  const [isLoadingRelease, setIsLoadingRelease] = useState(false)

  // 获取运行状态
  const { data, error } = useRequest(() => request.serverGet<KarinStatus>('/api/v1/status/karin'), {
    pollingInterval: 1000,
  })
  const localPluginsList = useRequest(() => request.serverPost<LocalApiResponse[], {}>('/api/v1/plugin/local'))
  const botList = useRequest(() => request.serverGet<Array<AdapterType>>('/api/v1/utils/get/bots'), {
    pollingInterval: 5000,
  })

  const handleTooltipClick = () => {
    testGithub().then(fn => setProxyFn(fn))
    fetchRelease()
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

  // 获取 release.json
  const { data: releaseData, error: releaseError, run: fetchRelease } = useRequest(
    async () => {
      setIsLoadingRelease(true) // 开始加载时设置为 true
      try {
        const url = proxyFn('https://raw.githubusercontent.com/karinjs/repo-status/refs/heads/main/data/releases.json')
        console.log('fetchRelease', url)
        const response = await axios.get<GithubRelease[]>(url)
        return response.data
      } finally {
        setIsLoadingRelease(false)
      }
    },
    { manual: true, onError: () => console.log('版本检测失败') }
  )

  const updateLogs = releaseData ? extractUpdateLogs(releaseData, data?.version!) : []

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

  const middleVersions: GithubRelease[] = []
  if (updateLogs) {
    for (let i = 0; i < updateLogs.length; i++) {
      const versionInfo = updateLogs[i]
      if (compareVersion(versionInfo.tag_name, data.version) > 0) {
        middleVersions.push(versionInfo)
      } else {
        break
      }
    }
  }

  // 将关闭方法传递给 UpdateButtons
  const handleCloseModal = () => {
    setIsChangelogOpen(false)
  }

  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4 lg:gap-x-8 lg:gap-y-6'>
      <StatusItem title='名称' value={data.name} />
      <StatusItem title='PID' value={data.pid} />
      <StatusItem title='PM2 ID' value={data.pm2_id} />
      <StatusItem
        title='运行时间'
        value={
          <div className='flex items-center gap-2'>
            <Counter
              className='flex items-center gap-0'
              value={Math.floor(data.uptime)}
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
              places={generatePlaces(Math.floor(data.uptime))}
            />
            <span>秒</span>
          </div>
        }
      />
      <StatusItem title='插件数量' value={localPluginsList.data?.length || '--'} />
      <StatusItem title='BOT数量' value={botList.data?.length} />
      <StatusItem
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
      <StatusItem title='运行环境' value={data.karin_runtime} />

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
                    <Spinner size='lg' color='primary' label='处理中' />
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
                      <div className='text-danger'>无法加载更新日志</div>
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
          await request.serverPost('/api/v1/restart')
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
      <Card shadow='sm'>
        <CardBody>
          <SystemStatusCard />
        </CardBody>
      </Card>
    </section>
  )
}
