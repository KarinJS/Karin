import { useState } from 'react'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Checkbox } from '@heroui/checkbox'
import { Tooltip } from '@heroui/tooltip'
import { RiRestartLine, RiShutDownLine } from 'react-icons/ri'
import { LuInfo } from 'react-icons/lu'
import { FiInfo } from "react-icons/fi"
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { request } from '@/lib/request'
import { restartRequest } from '@/request/restart'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'

interface SystemEnvsField {
  HTTP_PORT: {
    value: number
    comment: string
  }
  HTTP_HOST: {
    value: string
    comment: string
  }
  HTTP_AUTH_KEY: {
    value: string
    comment: string
  }
  WS_SERVER_AUTH_KEY: {
    value: string
    comment: string
  }
  REDIS_ENABLE: {
    value: boolean
    comment: string
  }
  PM2_RESTART: {
    value: boolean
    comment: string
  }
  TSX_WATCH: {
    value: boolean
    comment: string
  }
  LOG_LEVEL: {
    value: 'all' | 'trace' | 'debug' | 'mark' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    comment: string
  }
  LOG_DAYS_TO_KEEP: {
    value: number
    comment: string
  }
  LOG_MAX_LOG_SIZE: {
    value: number
    comment: string
  }
  LOG_FNC_COLOR: {
    value: string
    comment: string
  }
  LOG_MAX_CONNECTIONS: {
    value: number
    comment: string
  }
  FFMPEG_PATH: {
    value: string
    comment: string
  }
  FFPROBE_PATH: {
    value: string
    comment: string
  }
  FFPLAY_PATH: {
    value: string
    comment: string
  }
  RUNTIME: {
    value: 'node' | 'tsx' | 'pm2'
    comment: string
  }
  NODE_ENV: {
    value: 'development' | 'production' | 'test'
    comment: string
  }
}

function ControlButtons () {
  const [running, setRunning] = useState(false)
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false)
  const [isPm2, setIsPm2] = useState(false)
  const [reloadDeps, setReloadDeps] = useState(false)
  const [envConfig, setEnvConfig] = useState<SystemEnvsField | null>(null)
  const [isEnvInfoModalOpen, setIsEnvInfoModalOpen] = useState(false)
  const [loadingEnvConfig, setLoadingEnvConfig] = useState(false)
  const dialog = useDialog()
  const navigate = useNavigate()

  // 获取环境配置
  const fetchEnvConfig = async () => {
    try {
      setLoadingEnvConfig(true)
      const response = await request.serverPost<SystemEnvsField, { type: 'env' }>('/api/v1/config/new/get', {
        type: 'env'
      })
      setEnvConfig(response)
      // 只有在PM2环境下才默认勾选重载子进程选项
      if (response.RUNTIME.value === 'pm2') {
        setReloadDeps(true)
      }
    } catch (error) {
      console.error('获取环境配置失败:', error)
      toast.error('获取环境配置失败')
    } finally {
      setLoadingEnvConfig(false)
    }
  }

  const handleRestartClick = async () => {
    await fetchEnvConfig()
    setIsRestartModalOpen(true)
  }

  const handlePm2CheckboxClick = () => {
    if (envConfig?.RUNTIME.value !== 'pm2') {
      setIsEnvInfoModalOpen(true)
      return
    }
    setIsPm2(!isPm2)
  }

  const handleRestartConfirm = async () => {
    try {
      setRunning(true)
      setIsRestartModalOpen(false)

      await restartRequest({
        isPm2,
        reloadDeps
      })

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

  const handleGoToEnvConfig = () => {
    setIsEnvInfoModalOpen(false)
    navigate('/config/env')
  }

  const handleRestartModalChange = (isOpen: boolean) => {
    setIsRestartModalOpen(isOpen)
    if (!isOpen) {
      // 模态框关闭时重置Checkbox选择状态
      setIsPm2(false)
      setReloadDeps(false)
    }
  }

  /** 是否为pm2运行 */
  const isPm2Runtime = envConfig?.RUNTIME.value === 'pm2'
  /** 是否为node运行 */
  const isNodeRuntime = envConfig?.RUNTIME.value === 'node'

  return (
    <>
      <div className='flex gap-2'>
        <Tooltip content='重启' showArrow>
          <Button
            className='btn btn-primary text-lg glass-effect'
            isIconOnly
            radius='full'
            color='primary'
            variant='flat'
            isDisabled={running}
            onPress={handleRestartClick}
          >
            <RiRestartLine />
          </Button>
        </Tooltip>
        <Tooltip content='关机' showArrow>
          <Button
            className='btn btn-primary text-lg glass-effect'
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

      {/* 重启配置模态框 */}
      <Modal
        isOpen={isRestartModalOpen}
        onOpenChange={handleRestartModalChange}
        size='md'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <div className="flex items-center gap-2">
              {isNodeRuntime ? (
                <>
                  <LuInfo className="w-5 h-5 text-warning" />
                  无法进行重启操作！！！
                </>
              ) : (
                <>
                  <RiRestartLine className="w-5 h-5" />
                  重启配置
                </>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-4'>
              <p className='text-default-600 text-sm'>
                请选择重启选项：
              </p>

              <div className='flex items-center gap-3'>
                <Checkbox
                  isSelected={isPm2}
                  onValueChange={isPm2Runtime ? setIsPm2 : undefined}
                  color='danger'
                  isDisabled={!isPm2Runtime || loadingEnvConfig}
                  className={!isPm2Runtime ? 'opacity-50' : ''}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>重载父进程</span>
                    <span className='text-xs text-default-500'>
                      适用于
                      <span className="text-danger font-bold"> 更新 Karin 后 </span>
                      的重启。通过 PM2 管理器重启应用，可保持进程管理
                    </span>
                  </div>
                </Checkbox>
                {!isPm2Runtime && (
                  <Tooltip
                    content='为何不可用？'
                    closeDelay={0}
                  >
                    <Button
                      isIconOnly
                      size='sm'
                      radius='full'
                      variant='flat'
                      color='danger'
                      onPress={handlePm2CheckboxClick}
                      className='glass-effect'
                    >
                      <FiInfo className='w-5 h-5' />
                    </Button>
                  </Tooltip>
                )}
              </div>

              <div className='flex items-center gap-3'>
                <Checkbox
                  isSelected={reloadDeps}
                  onValueChange={isPm2Runtime ? setReloadDeps : undefined}
                  color='primary'
                  isDisabled={!isPm2Runtime || loadingEnvConfig}
                  className={!isPm2Runtime ? 'opacity-50' : ''}
                >
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>重载子进程</span>
                    <span className='text-xs text-default-500'>
                      适用于
                      <span className="text-primary font-bold"> 更新插件后 </span>
                      的重启。Karin 通知子进程重载插件，而无需重启整个进程。
                    </span>
                  </div>
                </Checkbox>
                {!isPm2Runtime && (
                  <Tooltip
                    content='为何不可用？'
                    closeDelay={0}
                  >
                    <Button
                      isIconOnly
                      size='sm'
                      radius='full'
                      variant='flat'
                      color='primary'
                      onPress={handlePm2CheckboxClick}
                      className='glass-effect'
                    >
                      <FiInfo className='w-5 h-5' />
                    </Button>
                  </Tooltip>
                )}
              </div>

              {loadingEnvConfig && (
                <div className='text-xs text-default-400 flex items-center gap-2'>
                  <div className='w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin' />
                  正在获取环境配置...
                </div>
              )}

              {envConfig && (
                <div className='text-xs text-default-500 bg-default-50 p-2 rounded'>
                  当前运行环境: <span className='font-mono font-medium'>{envConfig.RUNTIME.value}</span>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              variant='flat'
              onPress={() => setIsRestartModalOpen(false)}
              isDisabled={running}
              className='glass-effect'
            >
              取消
            </Button>
            <Button
              color='primary'
              variant='flat'
              onPress={handleRestartConfirm}
              isDisabled={running || loadingEnvConfig || isNodeRuntime}
              isLoading={running}
              className='glass-effect'
            >
              确认重启
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PM2环境提示模态框 */}
      <Modal
        isOpen={isEnvInfoModalOpen}
        onOpenChange={setIsEnvInfoModalOpen}
        size='md'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <LuInfo className='w-5 h-5 text-warning' />
              无法使用PM2重启
            </div>
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-4'>
              <p className='text-default-600'>
                当前运行环境为 <Chip color="warning" variant="flat" radius='md' size='sm' className='glass-effect'>{envConfig?.RUNTIME.value}</Chip> 不是PM2环境。
              </p>
              <p className='text-default-600'>
                要使用PM2重启功能，需要将运行环境设置为 <Chip color="primary" variant="flat" radius='md' size='sm' className='glass-effect'>PM2</Chip>。
              </p>
              <Card className='bg-primary-50 border border-primary-200'>
                <CardBody className='p-3'>
                  <p className='text-sm text-primary-800 font-medium mb-1'>建议操作：</p>
                  <p className='text-sm text-primary-700'>
                    前往环境配置页面修改 <span className='font-bold text-danger'> 运行时配置 </span> ，然后重启应用使配置生效。

                  </p>
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color='default'
              variant='flat'
              onPress={() => setIsEnvInfoModalOpen(false)}
              className='glass-effect'
            >
              取消
            </Button>
            <Button
              color='primary'
              variant='flat'
              onPress={handleGoToEnvConfig}
              className='glass-effect'
            >
              前往环境配置
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ControlButtons
