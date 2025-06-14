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

interface ControlButtonsProps {
  runtime?: string
}

function ControlButtons ({ runtime }: ControlButtonsProps) {
  const [running, setRunning] = useState(false)
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false)
  const [isPm2, setIsPm2] = useState(false)
  const [reloadDeps, setReloadDeps] = useState(false)
  const [useParentProcess, setUseParentProcess] = useState(false)
  const [useChildProcess, setUseChildProcess] = useState(true)
  const [isEnvInfoModalOpen, setIsEnvInfoModalOpen] = useState(false)
  const dialog = useDialog()
  const navigate = useNavigate()

  const handleRestartClick = async () => {
    // 根据传入的runtime设置默认选项
    if (runtime === 'pm2') {
      // PM2环境：默认选择快速重启
      setIsPm2(false)
      setUseParentProcess(false)
      setUseChildProcess(true)
      setReloadDeps(false)
    } else if (runtime === 'node') {
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
      // 重启成功后刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 1000) // 延迟1秒刷新，让用户看到成功提示
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
  const isPm2Runtime = runtime === 'pm2'
  /** 是否为node运行 */
  const isNodeRuntime = runtime === 'node'

  // 检查是否有任何选项被选中
  const hasSelectedOption = useParentProcess || useChildProcess || isPm2 || reloadDeps

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
                    <div className='w-full'>
                      <Checkbox
                        isSelected={useChildProcess}
                        onValueChange={handleChildProcessChange}
                        color='primary'
                        classNames={{
                          base: 'inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 active:scale-[0.98] transition-all duration-150 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-primary hover:shadow-md active:shadow-sm',
                          label: 'w-full',
                        }}
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium'>快速重启</span>
                            <Chip
                              size='sm'
                              color='primary'
                              variant='flat'
                            >
                              推荐
                            </Chip>
                          </div>
                          <span className='text-xs text-default-500'>
                            只重启应用本身，速度快，适合更新插件后的日常重启
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 完全重启 */}
                    <div className='w-full'>
                      <Checkbox
                        isSelected={reloadDeps}
                        onValueChange={handleReloadDepsChange}
                        color='warning'
                        classNames={{
                          base: 'inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 active:scale-[0.98] transition-all duration-150 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-warning hover:shadow-md active:shadow-sm',
                          label: 'w-full',
                        }}
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium'>完全重启</span>
                            <Chip
                              size='sm'
                              color='warning'
                              variant='flat'
                            >
                              慢速
                            </Chip>
                          </div>
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
                    <div className='w-full'>
                      <Checkbox
                        isSelected={useParentProcess}
                        onValueChange={handleParentProcessChange}
                        color='danger'
                        classNames={{
                          base: 'inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 active:scale-[0.98] transition-all duration-150 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-danger hover:shadow-md active:shadow-sm',
                          label: 'w-full',
                        }}
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium'>退出程序</span>
                            <Chip
                              size='sm'
                              color='danger'
                              variant='flat'
                            >
                              高级
                            </Chip>
                          </div>
                          <span className='text-xs text-default-500'>
                            完全退出程序，需要手动重新启动，适合有进程守护的高玩
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 快速重启 */}
                    <div className='w-full'>
                      <Checkbox
                        isSelected={useChildProcess}
                        onValueChange={handleChildProcessChange}
                        color='primary'
                        classNames={{
                          base: 'inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 active:scale-[0.98] transition-all duration-150 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-primary hover:shadow-md active:shadow-sm',
                          label: 'w-full',
                        }}
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium'>快速重启</span>
                            <Chip
                              size='sm'
                              color='primary'
                              variant='flat'
                            >
                              推荐
                            </Chip>
                          </div>
                          <span className='text-xs text-default-500'>
                            只重启应用本身，速度快，适合更新插件后的日常重启
                          </span>
                        </div>
                      </Checkbox>
                    </div>

                    {/* 升级到PM2模式 */}
                    <div className='w-full'>
                      <Checkbox
                        isDisabled
                        onValueChange={handlePm2Change}
                        color='success'
                        classNames={{
                          base: 'inline-flex w-full max-w-full bg-content1 m-0 hover:bg-content2 active:scale-[0.98] transition-all duration-150 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent data-[selected=true]:border-success data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:active:scale-100',
                          label: 'w-full',
                        }}
                      >
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-sm font-medium'>前台转后台</span>
                            <Chip
                              size='sm'
                              color='warning'
                              variant='flat'
                            >
                              待实现
                            </Chip>
                          </div>
                          <span className='text-xs text-default-500'>
                            切换到PM2模式重启
                          </span>
                        </div>
                      </Checkbox>
                    </div>
                  </>
                )}
              </div>
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
              isDisabled={running || !hasSelectedOption}
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
                当前运行环境为 <Chip color='warning' variant='flat' radius='md' size='sm' className='glass-effect'>{runtime}</Chip> 不是PM2环境。
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
