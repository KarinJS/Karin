import Sidebar from '@/components/sidebar.tsx'
import { Outlet, useNavigate } from 'react-router-dom'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key'

export default function DashboardLayout() {
  const [token] = useLocalStorageState(key.token)
  const navigate = useNavigate()
  if (!token) {
    navigate('/login')
  }
  return (
    <div className="relative flex h-screen items-stretch">
      <div className="flex-grow-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="container mx-auto px-6 flex-grow overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  )
}
