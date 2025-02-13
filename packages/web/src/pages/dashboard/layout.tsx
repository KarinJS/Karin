import Sidebar from '@/components/sidebar.tsx'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout () {
  return (
    <div className="relative flex h-screen items-stretch">
      <div className="flex-grow-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="container mx-auto px-3 flex-grow overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  )
}
