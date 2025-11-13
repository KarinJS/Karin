"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, FileText, Plug, Bot, Activity, Users, Database, Store } from "lucide-react"

interface NavItem {
  id: string
  icon: React.ElementType
  label: string
}

const navItems: NavItem[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "仪表盘" },
  { id: "bots", icon: Bot, label: "Bot 管理" },
  { id: "plugins", icon: Plug, label: "插件" },
  { id: "plugin-market", icon: Store, label: "Plugin Market" },
  { id: "users", icon: Users, label: "用户" },
  { id: "activity", icon: Activity, label: "活动日志" },
  { id: "database", icon: Database, label: "数据库" },
  { id: "logs", icon: FileText, label: "系统日志" },
  { id: "settings", icon: Settings, label: "设置" },
]

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 glass border-r border-sidebar-border bg-sidebar/60 flex flex-col items-center py-6 gap-2 z-50 transition-all duration-300">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        const isHovered = hoveredItem === item.id

        return (
          <div key={item.id} className="relative group">
            <button
              onClick={() => onViewChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "relative w-11 h-11 flex justify-center transition-all duration-200 items-center font-normal tracking-normal leading-7 text-center opacity-100 rounded-full",
                "hover:bg-sidebar-accent active:scale-95",
                isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                !isActive && "text-sidebar-foreground hover:text-accent-foreground",
              )}
            >
              <Icon className="w-5 h-5" />

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-1 h-6 bg-primary rounded-full" />
              )}
            </button>

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-light bg-popover/90 text-popover-foreground rounded-lg text-sm font-medium whitespace-nowrap border border-border/50 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover/90" />
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
