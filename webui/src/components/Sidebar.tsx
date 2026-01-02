import { Home, Settings, Activity, Box, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'

export function Sidebar () {
  const location = useLocation()
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/' },
    { icon: Activity, label: t('sidebar.activity'), path: '/activity' },
    { icon: Box, label: t('sidebar.plugins'), path: '/plugins' },
    { icon: Settings, label: t('sidebar.settings'), path: '/settings' },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 z-50 flex flex-col bg-white border-r border-slate-200">
      {/* Logo Section - Minimal */}
      <div className="h-16 flex items-center justify-center mb-2">
        <Logo className="w-8 h-8" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group relative flex items-center justify-center w-full h-12 mb-1"
              title={item.label}
            >
              {/* Active Border (Left) - VS Code Style */}
              <div className={twMerge(
                "absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-200",
                isActive ? "bg-sky-500" : "bg-transparent group-hover:bg-slate-200"
              )} />

              {/* Icon */}
              <item.icon
                size={24}
                strokeWidth={1.5}
                className={twMerge(
                  "transition-colors duration-200",
                  isActive
                    ? "text-sky-500"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />

              {/* Tooltip (Simplified) */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center w-full pb-4 gap-2">
        <button className="group relative flex items-center justify-center w-full h-12" title="Logout">
          <LogOut size={22} strokeWidth={1.5} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
          A
        </div>
      </div>
    </aside>
  )
}
