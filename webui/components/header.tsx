"use client"

import { Bell, Search, User, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Header() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-light bg-card/40 border-b border-border/50 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-full">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-primary/60 rounded-full" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Bot Framework</h1>
            <p className="text-xs text-muted-foreground">管理控制台</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索功能、设置..."
              className="pl-10 glass-light bg-background/50 border-border/50 focus:bg-background/80 transition-colors"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-lg hover:bg-accent/50" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="rounded-lg hover:bg-accent/50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
          </Button>

          <div className="w-px h-6 bg-border/50 mx-2" />

          <Button variant="ghost" className="rounded-lg hover:bg-accent/50 gap-2 px-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">管理员</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
