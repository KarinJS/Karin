import React, { useState } from 'react'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { Tooltip } from '@heroui/tooltip'
import { RiRestartLine, RiShutDownLine, RiAlarmWarningLine } from 'react-icons/ri'
import { Chip } from '@heroui/chip'
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { request } from '@/lib/request'
import { restartRequest } from '@/request/restart'

interface ControlButtonsProps {
  runtime?: string
}

interface RestartOptions {
  isPm2: boolean
  reloadDeps: boolean
  useParentProcess: boolean
  useChildProcess: boolean
}

function ControlButtons ({ runtime }: ControlButtonsProps) {
  const [running, setRunning] = useState(false)
  const dialog = useDialog()

  /** 根据运行时环境获取默认选项 */
  const getDefaultOptions = (): RestartOptions => {
    if (runtime === 'pm2') {
      return {
        isPm2: false,
        reloadDeps: false,
        useParentProcess: false,
        useChildProcess: true,
      }
    } else if (runtime === 'node') {
      return {
        isPm2: false,
        reloadDeps: false,
        useParentProcess: false,
        useChildProcess: true,
      }
    } else {
      return {
        isPm2: true,
        reloadDeps: false,
        useParentProcess: false,
        useChildProcess: false,
      }
    }
  }

  const handleRestartClick = async () => {
    let currentOptions = getDefaultOptions()

    /** 检查是否有任何选项被选中 */
    const hasAnySelection = (options: RestartOptions) => {
      return options.useParentProcess ||
           options.useChildProcess ||
           options.isPm2 ||
           options.reloadDeps
    }

    /** 创建重启选项组件 */
    const RestartOptionsComponent = () => {
      const [localOptions, setLocalOptions] = useState<RestartOptions>(currentOptions)

      // 更新外部选项引用和按钮状态
      React.useEffect(() => {
        currentOptions = localOptions

        // 动态更新dialog的confirmDisabled状态
        const isDisabled = !hasAnySelection(localOptions)
        dialog.updateDialog(dialogId, { confirmDisabled: isDisabled })
      }, [localOptions])

      /** 处理退出程序选择 */
      const handleParentProcessChange = (checked: boolean) => {
        const newOptions = {
          ...localOptions,
          useParentProcess: checked,
          useChildProcess: checked ? false : localOptions.useChildProcess,
          isPm2: checked ? false : localOptions.isPm2,
          reloadDeps: checked ? false : localOptions.reloadDeps,
        }
        setLocalOptions(newOptions)
      }

      /** 处理快速重启选择 */
      const handleChildProcessChange = (checked: boolean) => {
        const newOptions = {
          ...localOptions,
          useChildProcess: checked,
          useParentProcess: checked ? false : localOptions.useParentProcess,
          isPm2: checked ? false : localOptions.isPm2,
          reloadDeps: checked ? false : localOptions.reloadDeps,
        }
        setLocalOptions(newOptions)
      }

      /** 处理PM2重启选择 */
      const handlePm2Change = (checked: boolean) => {
        const newOptions = {
          ...localOptions,
          isPm2: checked,
          useParentProcess: checked ? false : localOptions.useParentProcess,
          useChildProcess: checked ? false : localOptions.useChildProcess,
          reloadDeps: checked ? false : localOptions.reloadDeps,
        }
        setLocalOptions(newOptions)
      }

      /** 处理完全重启选择（PM2环境） */
      const handleReloadDepsChange = (checked: boolean) => {
        const newOptions = {
          ...localOptions,
          reloadDeps: checked,
          useChildProcess: checked ? false : localOptions.useChildProcess,
        }
        setLocalOptions(newOptions)
      }

      const isPm2Runtime = runtime === 'pm2'
      const isNodeRuntime = runtime === 'node'

      return (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-3'>
            <div className='text-sm font-medium text-default-700'>请选择你的重启方式：</div>

            {/* PM2环境下的选项 */}
            {isPm2Runtime && (
              <>
                {/* 快速重启（默认选项） */}
                <div className='w-full'>
                  <Checkbox
                    isSelected={localOptions.useChildProcess}
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
                        <Chip size='sm' color='primary' variant='flat'>推荐</Chip>
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
                    isSelected={localOptions.reloadDeps}
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
                        <Chip size='sm' color='warning' variant='flat'>慢速</Chip>
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
                    isSelected={localOptions.useParentProcess}
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
                        <Chip size='sm' color='danger' variant='flat'>高级</Chip>
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
                    isSelected={localOptions.useChildProcess}
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
                        <Chip size='sm' color='primary' variant='flat'>推荐</Chip>
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
                    isSelected={localOptions.isPm2}
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
                        <Chip size='sm' color='warning' variant='flat'>待实现</Chip>
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
      )
    }

    // 创建dialog并获取ID
    const dialogId = dialog.confirm({
      title: (
        <div className='flex items-center gap-2'>
          <RiRestartLine className='w-5 h-5' />
          重启
        </div>
      ),
      content: <RestartOptionsComponent />,
      size: 'md',
      confirmDisabled: !hasAnySelection(currentOptions),
      onConfirm: async () => {
        toast.success('开始执行重启操作...')
        await handleRestartConfirm(currentOptions)
      },
    })
  }

  const handleRestartConfirm = async (options: RestartOptions) => {
    const startTime = Date.now()

    try {
      setRunning(true)

      // 如果选择退出程序，调用/api/v1/exit接口
      if (options.useParentProcess) {
        await request.serverPost('/api/v1/exit')

        // 等待服务重新启动
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

        const endTime = Date.now()
        const duration = ((endTime - startTime) / 1000).toFixed(1)
        toast.success(`重启成功，耗时 ${duration} 秒，即将自动刷新页面`)

        // 刷新页面以加载可能更新的前端代码
        setTimeout(() => {
          window.location.reload()
        }, 2000)

        return
      }

      // 快速重启或完全重启
      let restartOptions: { isPm2?: boolean; reloadDeps?: boolean } = {}

      const isPm2Runtime = runtime === 'pm2'
      const isFullRestart = isPm2Runtime && options.reloadDeps
      const isPm2Upgrade = options.isPm2 && !isPm2Runtime

      if (isFullRestart) {
        // PM2环境下勾选了完全重启：传递pm2:true
        restartOptions = { isPm2: true }
      } else if (isPm2Upgrade) {
        // 非PM2环境下选择升级到PM2模式
        restartOptions = { isPm2: true, reloadDeps: false }
      }
      // 其他情况（快速重启、PM2环境下未勾选完全重启）：什么都不传

      try {
        await restartRequest(restartOptions)
      } catch (e) {
      // PM2完全重启时，子进程会被关闭导致HTTP 500错误，这是正常现象
        if (isFullRestart) {
          console.log('PM2完全重启：子进程关闭导致的HTTP错误是预期行为')
        } else {
        // 非完全重启的情况下，重新抛出错误
          throw e
        }
      }

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

      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(1)

      !(isFullRestart || isPm2Upgrade) && toast.success(`重启成功，耗时 ${duration} 秒`)

      // 只有完全重启或PM2升级时才刷新页面
      if (isFullRestart || isPm2Upgrade) {
        toast.success(`重启成功，耗时 ${duration} 秒，即将自动刷新页面`)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (e) {
      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(1)
      toast.error(`重启失败，耗时 ${duration} 秒`)
    } finally {
      setRunning(false)
    }
  }

  const onShutDown = async () => {
    /** 创建关机确认组件 */
    const ShutdownConfirmComponent = () => {
      return (
        <div className='py-2 max-h-[60vh] overflow-y-auto scrollbar-hide'>
          {/* 警告标题 */}
          <div className='flex items-center justify-center gap-3 mb-6'>
            <RiAlarmWarningLine className='w-6 h-6 text-danger-500' />
            <h3 className='text-lg font-semibold text-danger-600'>关机警告</h3>
          </div>

          {/* 主要说明 */}
          <div className='text-center mb-6'>
            <p className='text-default-600 text-base leading-relaxed'>
              关机将完全停止 Karin 服务
            </p>
            <p className='text-default-500 text-sm mt-2'>
              所有正在运行的功能都将停止工作
            </p>
          </div>

          {/* 影响概览 */}
          <div className='space-y-2 mb-6'>
            <div className='flex items-center justify-between py-2 border-b border-default-200'>
              <span className='text-default-700 text-sm'>机器人服务</span>
              <Chip size='sm' color='danger' variant='flat'>停止</Chip>
            </div>
            <div className='flex items-center justify-between py-2 border-b border-default-200'>
              <span className='text-default-700 text-sm'>Web 管理</span>
              <Chip size='sm' color='danger' variant='flat'>停止</Chip>
            </div>
            <div className='flex items-center justify-between py-2 border-b border-default-200'>
              <span className='text-default-700 text-sm'>插件任务</span>
              <Chip size='sm' color='danger' variant='flat'>停止</Chip>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span className='text-default-700 text-sm'>服务恢复</span>
              <Chip size='sm' color='warning' variant='flat'>需手动启动</Chip>
            </div>
          </div>

          {/* 底部提示 */}
          <div className='text-center p-3 bg-default-50 rounded-lg'>
            <p className='text-xs sm:text-sm text-default-600'>
              如需重启服务，建议使用 <span className='font-medium text-primary-600'>"重启"</span> 功能
            </p>
          </div>
        </div>
      )
    }

    dialog.confirm({
      title: (
        <div className='flex items-center gap-2'>
          <RiShutDownLine className='w-5 h-5 text-danger-500' />
          <span className='text-danger-700'>确认关机</span>
        </div>
      ),
      content: <ShutdownConfirmComponent />,
      size: 'md',
      onConfirm: async () => {
        try {
          setRunning(true)
          await request.serverPost('/api/v1/exit')
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
    <div className='flex gap-2'>
      <Tooltip content='重启' showArrow closeDelay={0}>
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
      <Tooltip content='关机' showArrow closeDelay={0}>
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
  )
}

export default ControlButtons
