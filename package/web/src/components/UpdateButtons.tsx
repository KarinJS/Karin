import { useState } from 'react'
import { Button } from '@heroui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { request } from '@/lib/request'
import { restartRequest } from '@/request/restart'
import { useLiquidGlassButton } from '@/hooks/useLiquidGlass'

interface UpdateButtonsProps {
  handleCloseModal: () => void
  onUpdateStart: () => void
  onUpdateEnd: () => void
}

/**
 * 更新按钮组件
 * 提供关闭和更新功能，使用统一的 useDialog 接口
 */
export default function UpdateButtons ({ handleCloseModal, onUpdateStart, onUpdateEnd }: UpdateButtonsProps) {
  const [running, setRunning] = useState(false)
  const dialog = useDialog()

  /**
   * 执行更新操作
   */
  const executeUpdate = async () => {
    const startTime = Date.now()
    let updateSuccess = false

    try {
      setRunning(true)
      /** 通知父组件开始更新，显示全屏加载器 */
      onUpdateStart()
      /** 立即关闭更新日志模态框 */
      handleCloseModal()

      const { status } = await request.serverGet<{ status: 'ok' | 'failed' }>('/api/v1/system/update', { timeout: 60000 })

      if (status === 'ok') {
        updateSuccess = true
        toast.success('更新成功，正在重启......')

        try {
          await restartRequest({ isPm2: true })
        } catch (e) {
          /** PM2完全重启时，子进程会被关闭导致HTTP 500错误，这是正常现象 */
          console.log('PM2完全重启：子进程关闭导致的HTTP错误是预期行为')
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
        toast.success(`重启成功，耗时 ${duration} 秒，即将自动刷新页面`)

        /** 刷新页面以加载可能更新的前端代码 */
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (e: any) {
      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(1)
      toast.error(`更新失败，耗时 ${duration} 秒：${e.message}`)
      /** 更新失败时通知父组件结束更新 */
      onUpdateEnd()
    } finally {
      /** 只有在更新失败时才重置运行状态 */
      if (!updateSuccess) {
        setRunning(false)
      }
    }
  }

  /**
   * 显示确认更新对话框
   */
  const onUpdate = async () => {
    dialog.confirm({
      title: '确认系统更新',
      content: (
        <div className='space-y-4'>
          <p className='text-default-600'>即将开始更新 Karin 系统，更新过程大约需要 30-60 秒。</p>

          <div className='bg-warning-50 border border-warning-200 rounded-lg p-3'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0' />
              <div className='text-sm text-warning-700'>
                <p className='font-medium mb-1'>重要提醒：</p>
                <ul className='space-y-1 text-xs'>
                  <li>• 更新期间请勿关闭浏览器</li>
                  <li>• 服务将暂时不可用</li>
                  <li>• 完成后页面将自动刷新</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      size: 'lg',
      onConfirm: executeUpdate,
    })
  }

  const liquidGlassButtonRef1 = useLiquidGlassButton({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0.3,
  })

  const liquidGlassButtonRef2 = useLiquidGlassButton({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0.3,
  })

  return (
    <div className='flex gap-2 ml-auto'>
      <Button
        ref={window.innerWidth <= 768 ? liquidGlassButtonRef1 : undefined}
        color='danger'
        variant='flat'
        isDisabled={running}
        onPress={handleCloseModal}
        className='glass-effect'
      >
        关闭
      </Button>
      <Button
        ref={window.innerWidth <= 768 ? liquidGlassButtonRef2 : undefined}
        color='primary'
        variant='flat'
        isDisabled={running}
        onPress={onUpdate}
        className='glass-effect'
        startContent={<RefreshCw className='w-4 h-4' />}
      >
        更新
      </Button>
    </div>
  )
}
