import { title } from '@/components/primitives.ts'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import clsx from 'clsx'
import type { KarinStatus } from '@/types/server'
import { Chip } from '@heroui/chip'
import { SiJavascript, SiTypescript } from 'react-icons/si'
import { Button } from '@heroui/button'
import { RiRestartLine, RiShutDownLine } from 'react-icons/ri'
import { Tooltip } from '@heroui/tooltip'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDialog from '@/hooks/use-dialog'

function OnlineStatus() {
  const { error } = useRequest(
    () =>
      request.serverGet<{
        ping: string
      }>('/api/v1/ping'),
    {
      pollingInterval: 1000,
    },
  )
  return (
    <div className="ml-4 flex items-center gap-2">
      <div className={clsx('rounded-full w-4 h-4', !!error ? 'bg-red-500' : 'bg-green-500')}></div>
      <div>{!!error ? '离线' : '在线'}</div>
    </div>
  )
}

export interface StatusItemProps {
  title: string
  value: React.ReactNode
}
function StatusItem({ title, value }: StatusItemProps) {
  return (
    <div className="flex shadow-small rounded-full bg-danger-50 bg-opacity-20 overflow-hidden items-center gap-2">
      <div className="w-24 py-2 px-4 bg-gradient-to-r from-danger-100 to-danger-100/0 text-danger font-bold">
        {title}
      </div>
      <Chip color="warning" variant="flat">
        {typeof value === 'boolean' ? (value ? '是' : '否') : value || '--'}
      </Chip>
    </div>
  )
}

function Status() {
  const { data, error } = useRequest(() => request.serverGet<KarinStatus>('/api/v1/status'), {
    pollingInterval: 1000,
  })
  if (error || !data) {
    return <div>请求错误</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <StatusItem title="名称" value={data.name.toUpperCase()} />
      <StatusItem title="PID" value={data.pid} />
      <StatusItem title="PM2 ID" value={data.pm2_id} />
      <StatusItem title="运行时间" value={`${Math.floor(data.uptime)}秒`} />
      <StatusItem title="版本" value={data.version} />
      <StatusItem title="开发模式" value={data.karin_dev} />
      <StatusItem
        title="语言"
        value={
          <div className="flex items-center gap-1">
            {data.karin_lang === 'js' ? (
              <SiJavascript className="text-lg text-yellow-500" />
            ) : (
              <SiTypescript className="text-lg text-blue-700" />
            )}
            {data.karin_lang.toUpperCase()}
          </div>
        }
      />
      <StatusItem title="运行环境" value={data.karin_runtime} />
    </div>
  )
}

function ControlButtons() {
  const [running, setRunning] = useState(false)
  const navigate = useNavigate()
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
            }, 1000)
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
          navigate('/login')
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
    <div className="flex gap-2 ml-auto">
      <Tooltip content="重启" showArrow>
        <Button
          className="btn btn-primary text-lg"
          isIconOnly
          radius="full"
          color="warning"
          variant="shadow"
          isDisabled={running}
          onPress={onRestart}
        >
          <RiRestartLine />
        </Button>
      </Tooltip>
      <Tooltip content="关机" showArrow>
        <Button
          className="btn btn-primary text-lg"
          isIconOnly
          radius="full"
          color="danger"
          variant="shadow"
          isDisabled={running}
          onPress={onShutDown}
        >
          <RiShutDownLine />
        </Button>
      </Tooltip>
    </div>
  )
}

export default function IndexPage() {
  return (
    <section>
      <Card shadow="sm">
        <CardHeader>
          <div
            className={title({
              size: 'sm',
              color: 'pink',
            })}
          >
            Karin
          </div>
          <OnlineStatus />
          <ControlButtons />
        </CardHeader>
        <CardBody>
          <Status />
        </CardBody>
      </Card>
    </section>
  )
}
