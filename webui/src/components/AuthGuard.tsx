import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard ({ children }: AuthGuardProps) {
  const location = useLocation()
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
