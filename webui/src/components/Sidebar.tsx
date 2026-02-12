import { Home, Settings, Activity, Box, LogOut, Sliders, LayoutGrid } from 'lucide-react'
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
    { icon: LayoutGrid, label: t('sidebar.schemaDemo'), path: '/schema-demo' },
    { icon: Activity, label: t('sidebar.activity'), path: '/activity' },
    { icon: Box, label: t('sidebar.plugins'), path: '/plugins' },
    { icon: Settings, label: t('sidebar.settings'), path: '/settings' },
  ]

  // Custom styling for tooltips to match glass morphism theme
  const tooltipClasses = {
    base: [
      "before:bg-neutral-400/20", // Arrow color
    ],
    content: [
      "py-2 px-4 shadow-xl",
      "text-black bg-white/80 backdrop-blur-md", // Matching glass morphism
      "border border-white/40",
      "font-medium tracking-wide",
    ],
  };

  return (
    <aside className="fixed left-2 top-2 bottom-2 w-16 z-50 flex flex-col glass-panel rounded-2xl">
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
              offset={10}
              classNames={tooltipClasses}
              showArrow
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    }
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    }
                  },
                },
              }}
            >
              <Link
                to={item.path}
                className={twMerge(
                  "group relative flex items-center justify-center w-10 h-10 mb-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/40"
                )}
              >
                {/* Active Indicator (Left) - Removed, using button style instead */}

                {/* Icon */}
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center w-full pb-4 gap-2">
        <Tooltip content={t('sidebar.logout', 'Logout')} placement="right" offset={10} classNames={tooltipClasses} showArrow>
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
