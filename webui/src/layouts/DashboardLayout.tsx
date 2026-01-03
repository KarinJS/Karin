import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'

export function DashboardLayout () {
  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-16 transition-all duration-500">
        <main className="flex-1 overflow-hidden bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
