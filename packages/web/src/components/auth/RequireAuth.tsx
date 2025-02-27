import key from '@/consts/key'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAuth ({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(key.accessToken)
  const location = useLocation()

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <>{children}</>
}
