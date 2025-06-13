import { useState } from 'react'
import { Button } from '@heroui/button'
import toast from 'react-hot-toast'
import useDialog from '@/hooks/use-dialog'
import { request } from '@/lib/request'
import { restartRequest } from '@/request/restart'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useLiquidGlassButton } from '@/hooks/useLiquidGlass'

interface UpdateButtonsProps {
  handleCloseModal: () => void
}

export default function UpdateButtons ({ handleCloseModal }: UpdateButtonsProps) {
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

  const liquidGlassButtonRef1 = useLiquidGlassButton({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0,
  })

  const liquidGlassButtonRef2 = useLiquidGlassButton({
    gaussianBlur: 0,
    scale: 20,
    transparency: 0,
  })

  return (
    <div className='flex gap-2 ml-auto'>
      {running && <FullScreenLoader />}
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
      >
        更新
      </Button>
    </div>
  )
}
