import { request } from '@/lib/request'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { DashboardPage } from '@/components/config/plugins'
import type { GetConfigResponse } from 'node-karin'

interface GetConfigRequest {
  name: string
  type: 'git' | 'npm' | 'app'
}

// http://localhost:5173/web/plugins/karin-plugin-demo?type=git
export default function PluginConfigPage () {
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') as GetConfigRequest['type']
  const [config, setConfig] = useState<GetConfigResponse>({
    options: [],
    info: {
      id: '',
      name: '',
    }
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name || !type) return

    const fetchConfig = async () => {
      try {
        const result = await request.serverPost<GetConfigResponse, GetConfigRequest>(
          '/api/v1/plugin/config/get',
          { name, type }
        )
        setConfig(result)
      } catch (error) {
        console.error('Failed to fetch config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [name, type])

  if (!name || !type) {
    return <div>参数错误</div>
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return <DashboardPage options={config.options} info={{ ...config.info, type }} />
}
