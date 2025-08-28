import { getAccessToken } from '@/lib/token'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth ({ children }: { children: React.ReactNode }) {
  const token = getAccessToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}
