import { request } from '@/lib/request'
import { KarinStatus } from '@/types/server'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ConsoleMessage = () => {
  const hasPrinted = useRef(false)
  const location = useLocation()
  const fetchData = () => request.serverGet<KarinStatus>('/api/v1/status/karin')

  useEffect(() => {
    // 如果当前路由是 /login，或者已经打印过，则不执行请求
    if (location.pathname === '/login' || hasPrinted.current) {
      return
    }

    fetchData()
      .then((data) => {
        if (import.meta.env.MODE !== 'development') {
          console.log('%c🚀 Karin WebUI Console', 'color: white; background-color: #2c3e50; padding: 5px 10px; border-radius: 5px; font-size: 16px;')
          console.log('%cVersion: %s', 'color: #9b59b6; font-size: 14px;', data?.version)
          console.log('%c© 2025 KarinJS. All rights reserved.', 'color: #7f8c8d; font-size: 12px;')
          console.log('%cPowered by @KarinJS/node-karin@%s', 'color: #3498db; font-size: 12px;', data?.version)
          hasPrinted.current = true // 标记为已打印
        }
      })
      .catch((error) => {
        console.error('Failed to fetch Karin status:', error)
      })
  }, [location])

  return null
}

export default ConsoleMessage
