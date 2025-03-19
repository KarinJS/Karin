import { request } from '@/lib/request'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DashboardPage } from '@/components/config/plugin/plugins'
import { Spinner } from '@heroui/spinner'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { FaRotateRight } from 'react-icons/fa6'

import type { GetConfigResponse } from 'node-karin'

interface GetConfigRequest {
  name: string
  type: 'git' | 'npm' | 'app'
}

// http://localhost:5173/web/plugins/config?name=karin-plugin-demo&type=git
// http://localhost:5173/web/plugins/config?name=@karinjs/karin-plugin-demo&type=npm
export default function PluginConfigPage () {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')
  const type = searchParams.get('type') as GetConfigRequest['type'] | null
  const [config, setConfig] = useState<GetConfigResponse>({
    options: [],
    info: {
      id: '',
      name: '',
    },
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const requestSentRef = useRef(false)

  const fetchConfig = useCallback(async () => {
    if (!name || !type) return
    // 如果已经发送过请求，则不再重复发送
    if (requestSentRef.current) return

    try {
      setLoading(true)
      setError(null)
      requestSentRef.current = true // 标记请求已发送
      const result = await request.serverPost<GetConfigResponse, GetConfigRequest>(
        '/api/v1/plugin/config/get',
        {
          name,
          type,
        }
      )
      setConfig(result)
    } catch (error) {
      console.error('Failed to fetch config:', error)
      setError(error instanceof Error ? error : new Error('未知错误'))
    } finally {
      setLoading(false)
    }
  }, [name, type])

  useEffect(() => {
    if (!name || !type) return
    fetchConfig()

    // 组件卸载时重置标记，以便在组件重新挂载时可以再次发送请求
    return () => {
      requestSentRef.current = false
    }
  }, [name, type, fetchConfig])

  if (!name || !type) {
    return (
      <Card className='max-w-lg mx-auto mt-8'>
        <CardBody>
          <div className='text-center text-danger-600'>
            <h3 className='text-lg font-semibold mb-2'>参数错误</h3>
            <p className='text-sm text-default-600'>缺少必要的插件名称或类型参数</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[200px]'>
        <Spinner size='lg' color='primary' />
        <p className='mt-4 text-default-600'>正在加载插件配置...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className='max-w-lg mx-auto mt-8'>
        <CardHeader>
          <h3 className='text-lg font-semibold text-danger-600'>配置加载失败</h3>
        </CardHeader>
        <CardBody>
          <div className='bg-danger-50 rounded-lg p-4 mb-4'>
            <pre className='text-sm text-danger-600 whitespace-pre-wrap font-mono'>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
          <div className='flex justify-center'>
            <Button
              color='primary'
              variant='flat'
              startContent={<FaRotateRight />}
              onPress={fetchConfig}
            >
              重试加载
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

  return <DashboardPage options={config.options} info={{ ...config.info, type, id: config.info.id || name }} key={config.info.id || name} />
}
