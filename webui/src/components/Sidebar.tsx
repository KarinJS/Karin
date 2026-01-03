import { Home, Settings, Activity, Box, LogOut, Sliders } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'
import { Tooltip, Button, Avatar } from "@heroui/react"

export function Sidebar () {
  const location = useLocation()
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/' },
    { icon: Sliders, label: t('sidebar.basicConfig', 'Basic Config'), path: '/basic-config' },
    { icon: Activity, label: t('sidebar.activity'), path: '/activity' },
    { icon: Box, label: t('sidebar.plugins'), path: '/plugins' },
    { icon: Settings, label: t('sidebar.settings'), path: '/settings' },
  ]

  return (
    <aside className="fixed left-2 top-2 bottom-2 w-16 z-50 flex flex-col bg-content1/80 backdrop-blur-xl rounded-2xl shadow-sm border border-divider/50">
      {/* Logo Section - Minimal */}
      <div className="h-16 flex items-center justify-center mb-2">
        <Logo className="w-8 h-8" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Tooltip
              key={item.path}
              content={item.label}
              placement="right"
              color="foreground"
              offset={10}
            >
              <Link
                to={item.path}
                className="group relative flex items-center justify-center w-full h-12 mb-1"
              >
                {/* Active Indicator (Left) - Rounded Pill Style */}
                <div className={twMerge(
                  "absolute left-1 top-2 bottom-2 w-1 rounded-full transition-all duration-200",
                  isActive ? "bg-primary" : "bg-transparent"
                )} />

                {/* Icon */}
                <item.icon
                  size={24}
                  strokeWidth={1.5}
                  className={twMerge(
                    "transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-default-500 group-hover:text-default-900"
                  )}
                />
              </Link>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center w-full pb-4 gap-2">
        <Tooltip content="Logout" placement="right" color="foreground">
          <Button isIconOnly variant="light" radius="full" className="w-10 h-10 min-w-10">
            <LogOut size={20} strokeWidth={1.5} className="text-default-500 hover:text-default-900 transition-colors" />
          </Button>
        </Tooltip>

        <Avatar
          name="A"
          size="sm"
          className="bg-primary/10 text-primary font-bold text-xs"
        />
      </div>
    </aside>
  )
}
