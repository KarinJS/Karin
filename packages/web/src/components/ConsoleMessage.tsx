import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getKarinStatusRequest } from '@/request/status'

const ConsoleMessage = () => {
  const hasPrinted = useRef(false)
  const location = useLocation()
  const fetchData = () => getKarinStatusRequest()

  useEffect(() => {
    fetchData()
      .then((data) => {
        if (import.meta.env.MODE !== 'development') {
          console.log('%c🚀 Karin WebUI Console', 'color: white; background-color: #2c3e50; padding: 5px 10px; border-radius: 5px; font-size: 16px;')
          console.log('%cVersion: %s', 'color: #9b59b6; font-size: 14px;', data?.version)
          console.log('%c© 2025 KarinJS. All rights reserved.', 'color: #7f8c8d; font-size: 12px;')
          console.log('%cPowered by @KarinJS/node-karin@%s', 'color: #3498db; font-size: 12px;', data?.version)
          hasPrinted.current = true
        }
      })
      .catch((error) => {
        console.error('Failed to fetch Karin status:', error)
      })
  }, [location])

  return null
}

export default ConsoleMessage
