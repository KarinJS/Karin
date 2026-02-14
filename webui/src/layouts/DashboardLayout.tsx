import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function DashboardLayout () {
  const location = useLocation()
  
  // 这些页面不需要 glass-panel 背景容器，它们自己管理布局和背景
  const isTransparentPage = [
    '/plugin-config',
    '/plugin-custom',
    '/plugin-manage'
  ].some(path => location.pathname.startsWith(path))

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-20 transition-all duration-500">
        <main className={`flex-1 overflow-hidden relative z-10 ${
          isTransparentPage ? '' : 'm-2 rounded-2xl glass-panel'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
