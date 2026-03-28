import { useState, useEffect, useRef } from 'react'
import { Button } from '@heroui/react'
import { useTheme } from '@/hooks/useTheme'
import { gsap } from 'gsap'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FiSun,
  FiMoon,
  FiTerminal,
  FiGrid,
  FiShoppingCart,
  FiSettings,
  FiClock,
  FiFileText,
  FiFolder,
  FiDatabase,
  FiInfo,
  FiX
} from 'react-icons/fi'
import TerminalConsole from './components/TerminalConsole'
import { Group, Panel } from 'react-resizable-panels'
import type { PanelImperativeHandle } from 'react-resizable-panels'

export default function MainLayout () {
  const { toggleTheme, isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Multi-tab state
  const [openTabs, setOpenTabs] = useState<{ name: string, path: string }[]>([
    { name: '仪表盘', path: '/' }
  ])
  const [hasSwitched, setHasSwitched] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const terminalContentRef = useRef<HTMLDivElement>(null)
  const terminalPanelRef = useRef<PanelImperativeHandle | null>(null)
  const terminalCollapseTweenRef = useRef<gsap.core.Tween | null>(null)
  const terminalCollapsedSizePx = 40
  const terminalOpenMinSizePercent = 30

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: '仪表盘', icon: FiGrid, path: '/' },
    { name: '插件商店', icon: FiShoppingCart, path: '/plugins' },
    { name: '插件配置', icon: FiSettings, path: '/config' },
    { name: '版本历史', icon: FiClock, path: '/history' },
    { name: '运行日志', icon: FiFileText, path: '/logs' },
    { name: '文件管理', icon: FiFolder, path: '/files' },
    { name: '数据库', icon: FiDatabase, path: '/database' },
    { name: '关于我们', icon: FiInfo, path: '/about' },
  ]

  // Terminal state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isTerminalResizeLocked, setIsTerminalResizeLocked] = useState(true)

  const toggleTerminal = () => {
    setIsTerminalOpen(prev => {
      const next = !prev
      if (next) {
        setIsTerminalResizeLocked(false)
      }
      return next
    })
  }

  useEffect(() => {
    if (terminalCollapseTweenRef.current) {
      terminalCollapseTweenRef.current.kill()
      terminalCollapseTweenRef.current = null
    }

    if (!terminalPanelRef.current) {
      return
    }

    if (isTerminalOpen) {
      terminalPanelRef.current.expand()
      setIsTerminalResizeLocked(false)
      return
    }

    setIsTerminalResizeLocked(true)
    const currentSizeInPixels = terminalPanelRef.current.getSize().inPixels
    const startSize = Number.isFinite(currentSizeInPixels) && currentSizeInPixels > terminalCollapsedSizePx
      ? currentSizeInPixels
      : terminalCollapsedSizePx
    const panelSizeState = { value: startSize }
    terminalCollapseTweenRef.current = gsap.to(panelSizeState, {
      value: terminalCollapsedSizePx,
      duration: 0.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        terminalPanelRef.current?.resize(`${panelSizeState.value}px`)
      },
      onComplete: () => {
        terminalPanelRef.current?.collapse()
        terminalCollapseTweenRef.current = null
      },
    })

    return () => {
      if (terminalCollapseTweenRef.current) {
        terminalCollapseTweenRef.current.kill()
        terminalCollapseTweenRef.current = null
      }
    }
  }, [isTerminalOpen, terminalCollapsedSizePx])

  useEffect(() => {
    if (!terminalContentRef.current) {
      return
    }

    gsap.killTweensOf(terminalContentRef.current)

    if (isTerminalOpen) {
      gsap.fromTo(
        terminalContentRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.46, ease: 'power3.out' }
      )
      return
    }

    gsap.set(terminalContentRef.current, {
      opacity: 1,
      y: 0,
    })
  }, [isTerminalOpen])

  // Update tabs when location changes
  useEffect(() => {
    const currentItem = navItems.find(item =>
      location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/')
    )

    if (currentItem) {
      setOpenTabs(prev => {
        if (!prev.find(t => t.path === currentItem.path)) {
          if (prev.length === 1 && !hasSwitched) {
            setHasSwitched(true)
            // Animate tabs container appearing
            if (tabsContainerRef.current) {
              gsap.fromTo(tabsContainerRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
              )
            }
          }
          return [...prev, { name: currentItem.name, path: currentItem.path }]
        }
        return prev
      })
    }
  }, [location.pathname])

  const closeTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    const newTabs = openTabs.filter(t => t.path !== path)
    if (newTabs.length === 0) {
      setOpenTabs([{ name: '仪表盘', path: '/' }])
      navigate('/')
      setHasSwitched(false)
      // Animate tabs container hiding
      if (tabsContainerRef.current) {
        gsap.to(tabsContainerRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
      }
    } else {
      setOpenTabs(newTabs)
      if (location.pathname === path) {
        navigate(newTabs[newTabs.length - 1].path)
      }
      if (newTabs.length === 1) {
        setHasSwitched(false)
        // Animate tabs container hiding
        if (tabsContainerRef.current) {
          gsap.to(tabsContainerRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">

      {/* Sidebar */}
      <aside className="w-70 bg-surface flex flex-col border-r border-border shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">Karin WebUI</h1>
          <div className="text-xs text-default-400 font-mono tracking-wider">V2.0.0-alpha.0</div>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/')
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                onPress={() => navigate(item.path)}
                variant={isActive ? "primary" : "ghost"}
                className={`w-full justify-start h-12 px-4 pl-8 transition-all no-underline! ${isActive
                  ? 'shadow-[0_0_20px_rgba(0,111,238,0.3)] font-medium'
                  : 'text-default-500 hover:text-foreground hover:bg-default-100 border-none'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-accent-foreground' : 'text-default-400'} />
                <span className="text-base">{item.name}</span>
              </Button>
            )
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-full bg-surface-secondary border border-default-200 cursor-pointer hover:bg-surface-tertiary transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent-soft-hover overflow-hidden flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-accent" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">Admin User</span>
              <span className="text-xs text-default-400 truncate">admin@karinjs.dev</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {/* Header */}
        <header className="flex flex-col z-50 bg-background/80 backdrop-blur-md border-b border-border">
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Title */}
            <div className="flex flex-col gap-1 min-w-50">
              <span className="text-lg font-bold text-foreground">
                {navItems.find(item => item.path === location.pathname || (location.pathname.startsWith(item.path) && item.path !== '/'))?.name || "未知页面"}
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 ml-auto">
              <Button
                className="rounded-full font-medium shadow-md px-6 bg-accent text-accent-foreground"
                onPress={toggleTerminal}
              >
                <FiTerminal size={18} /> 终端控制台
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  isIconOnly
                  variant="ghost"
                  aria-label="Toggle theme"
                  onPress={toggleTheme}
                  className="rounded-full text-default-400 hover:text-foreground border-none"
                >
                  {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </Button>
              )}

              <Button isIconOnly variant="ghost" className="rounded-full text-default-400 hover:text-foreground border-none">
                <FiSettings size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs Row */}
          <div ref={tabsContainerRef} className="flex items-center gap-2 px-6 overflow-x-auto hide-scrollbar overflow-hidden h-0 opacity-0">
            {openTabs.map((tab) => {
              const isActive = location.pathname === tab.path || (location.pathname.startsWith(tab.path) && tab.path !== '/')
              return (
                <div
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`group flex items-center gap-2 px-4 py-1.5 rounded-t-lg text-sm cursor-pointer transition-colors border-b-2 ${isActive
                    ? 'bg-surface border-accent text-accent font-medium'
                    : 'bg-surface-secondary border-transparent text-default-500 hover:bg-surface-tertiary hover:border-default-300'
                    }`}
                >
                  <span>{tab.name}</span>
                  {openTabs.length > 1 && (
                    <div
                      onClick={(e) => closeTab(e, tab.path)}
                      className="p-0.5 rounded-full hover:bg-default-200/50 text-default-400 hover:text-foreground transition-colors"
                    >
                      <FiX size={14} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </header>

        {/* Page Content & Global Terminal Console */}
        <div className="flex-1 flex flex-col relative min-h-0">
          <div className="w-full h-full">
            <Group
              orientation="vertical"
              className="w-full h-full"
              disabled={isTerminalResizeLocked}
              resizeTargetMinimumSize={{ coarse: 37, fine: 12 }}
              onLayoutChanged={() => {
                if (isTerminalOpen) {
                  window.dispatchEvent(new CustomEvent('layout:animated'))
                }
              }}
            >
              <Panel defaultSize="100%" minSize="30%">
                <main className="h-full p-6 flex flex-col gap-6 overflow-y-auto">
                  <Outlet />
                </main>
              </Panel>

              <Panel
                panelRef={terminalPanelRef}
                defaultSize="30%"
                minSize={isTerminalOpen ? `${terminalOpenMinSizePercent}%` : "20%"}
                maxSize="80%"
                collapsible={!isTerminalOpen}
                collapsedSize={`${terminalCollapsedSizePx}px`}
              >
                <div ref={terminalContentRef} className="h-full w-full">
                  <TerminalConsole
                    isOpen={isTerminalOpen}
                    onToggle={toggleTerminal}
                  />
                </div>
              </Panel>
            </Group>
          </div>
        </div>
      </div>
    </div>
  )
}
