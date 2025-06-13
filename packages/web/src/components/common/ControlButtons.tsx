import { useState } from 'react'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Checkbox } from '@heroui/checkbox'
import { Tooltip } from '@heroui/tooltip'
import { RiRestartLine, RiShutDownLine } from 'react-icons/ri'
import { LuInfo } from 'react-icons/lu'
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
  const [useParentProcess, setUseParentProcess] = useState(false)
  const [useChildProcess, setUseChildProcess] = useState(true) // 默认勾选快速重启
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
        type: 'env',
      })
      setEnvConfig(response)

      // 根据环境设置默认选项
      console.log(response.RUNTIME.value)
      if (response.RUNTIME.value === 'pm2') {
        // PM2环境：默认选择快速重启（什么都不传）
        setIsPm2(false)
        setUseParentProcess(false)
        setUseChildProcess(true)
        setReloadDeps(false)
      } else if (response.RUNTIME.value === 'node') {
        // Node环境：默认选择快速重启
        setIsPm2(false)
        setUseParentProcess(false)
        setUseChildProcess(true)
        setReloadDeps(false)
      } else {
        // 其他环境：默认选择PM2模式
        setIsPm2(true)
        setUseParentProcess(false)
        setUseChildProcess(false)
        setReloadDeps(false)
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

  const handleRestartConfirm = async () => {
    try {
      setRunning(true)
      setIsRestartModalOpen(false)

      // 如果选择退出程序，调用/exit接口
      if (useParentProcess) {
        await request.serverPost('/api/v1/exit')
        toast.success('程序退出指令发送成功')
        return
      }

      // 快速重启或完全重启
      let restartOptions: { isPm2?: boolean; reloadDeps?: boolean } = {}

      if (isPm2Runtime && reloadDeps) {
        // PM2环境下勾选了完全重启：传递pm2:true
        restartOptions = { isPm2: true }
      } else if (isPm2 && !isPm2Runtime) {
        // 非PM2环境下选择升级到PM2模式
        restartOptions = { isPm2: true, reloadDeps: false }
      }
      // 其他情况（快速重启、PM2环境下未勾选完全重启）：什么都不传

      await restartRequest(restartOptions)

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
      setUseParentProcess(false)
      setUseChildProcess(true) // 默认勾选快速重启
    }
  }

  // 处理退出程序选择
  const handleParentProcessChange = (checked: boolean) => {
    setUseParentProcess(checked)
    if (checked) {
      // 选择退出程序后自动取消其他选项
      setUseChildProcess(false)
      setIsPm2(false)
      setReloadDeps(false)
    }
  }

  // 处理快速重启选择
  const handleChildProcessChange = (checked: boolean) => {
    setUseChildProcess(checked)
    if (checked) {
      // 选择快速重启后自动取消其他选项
      setUseParentProcess(false)
      setIsPm2(false)
      setReloadDeps(false)
    }
  }

  // 处理PM2重启选择
  const handlePm2Change = (checked: boolean) => {
    setIsPm2(checked)
    if (checked) {
      // 选择PM2后自动取消其他选项
      setUseParentProcess(false)
      setUseChildProcess(false)
      setReloadDeps(false)
    }
  }

  // 处理完全重启选择（PM2环境）
  const handleReloadDepsChange = (checked: boolean) => {
    setReloadDeps(checked)
    if (checked) {
      // 选择完全重启后自动取消快速重启
      setUseChildProcess(false)
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
            <div className='flex items-center gap-2'>
              <RiRestartLine className='w-5 h-5' />
              重启配置
            </div>
          </ModalHeader>
          <ModalBody>
            {/* 重启配置模态框中的选项部分 */}
            <div className='flex flex-col gap-4'>
              <p className='text-default-600 text-sm'>
                请选择重启选项：
              </p>

              {/* 重启方式选择 */}
              <div className='flex flex-col gap-3'>
                <div className='text-sm font-medium text-default-700'>重启方式：</div>

                {/* PM2环境下的选项 */}
                {isPm2Runtime && (
                  <>
                    {/* 快速重启（默认选项） */}
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        isSelected={useChildProcess}
                        onValueChange={handleChildProcessChange}
                        color='primary'
                        isDisabled={loadingEnvConfig}
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>快速重启（推荐）</span>
                          <span className='text-xs text-default-500'>
                            只重启应用本身，速度快，适合更新插件后的日常重启
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 完全重启 */}
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        isSelected={reloadDeps}
                        onValueChange={handleReloadDepsChange}
                        color='warning'
                        isDisabled={loadingEnvConfig}
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>完全重启</span>
                          <span className='text-xs text-default-500'>
                            重启整个程序和依赖，速度较慢，适用于 Karin 更新后使用
                          </span>
                        </div>
                      </Checkbox>
                    </div>
                  </>
                )}

                {/* Node环境下的三个选项 */}
                {isNodeRuntime && (
                  <>
                    {/* 退出程序 */}
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        isSelected={useParentProcess}
                        onValueChange={handleParentProcessChange}
                        color='danger'
                        isDisabled={loadingEnvConfig}
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>退出程序</span>
                          <span className='text-xs text-default-500'>
                            完全退出程序，需要手动重新启动，适合有进程守护的高玩
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 快速重启 */}
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        isSelected={useChildProcess}
                        onValueChange={handleChildProcessChange}
                        color='primary'
                        isDisabled={loadingEnvConfig}
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>快速重启（推荐）</span>
                          <span className='text-xs text-default-500'>
                            只重启应用本身，速度快，适合更新插件后的日常重启
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 升级到PM2模式 */}
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        isSelected={isPm2}
                        onValueChange={handlePm2Change}
                        color='success'
                        isDisabled={loadingEnvConfig}
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>升级到PM2模式</span>
                          <span className='text-xs text-default-500'>
                            切换到更稳定的PM2管理模式
                          </span>
                        </div>
                      </Checkbox>
                    </div>
                  </>
                )}
              </div>

              {/* 环境信息显示 */}
              {envConfig && (
                <div className='text-xs text-default-500 bg-default-50 p-3 rounded'>
                  <div>当前运行环境: <span className='font-mono font-medium'>{envConfig.RUNTIME.value}</span></div>
                  {envConfig.RUNTIME.value === 'node' && (
                    <div className='text-info-600 mt-1'>
                      💡 普通模式：推荐使用"快速重启"，如需完全退出可选择"退出程序"
                    </div>
                  )}
                  {envConfig.RUNTIME.value === 'pm2' && (
                    <div className='text-success-600 mt-1'>
                      ✅ PM2模式：推荐使用"快速重启"，更新后可选择"完全重启"
                    </div>
                  )}
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
              isDisabled={running || loadingEnvConfig}
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
                当前运行环境为 <Chip color='warning' variant='flat' radius='md' size='sm' className='glass-effect'>{envConfig?.RUNTIME.value}</Chip> 不是PM2环境。
              </p>
              <p className='text-default-600'>
                要使用PM2重启功能，需要将运行环境设置为 <Chip color='primary' variant='flat' radius='md' size='sm' className='glass-effect'>PM2</Chip>。
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
