"use client"

import { DashboardView } from "./views/dashboard-view"
import { BotsView } from "./views/bots-view"
import { PluginsView } from "./views/plugins-view"
import { PluginMarketView } from "./views/plugin-market-view"
import { UsersView } from "./views/users-view"
import { ActivityView } from "./views/activity-view"
import { DatabaseView } from "./views/database-view"
import { LogsView } from "./views/logs-view"
import { SettingsView } from "./views/settings-view"

interface ContentAreaProps {
  activeView: string
}

export function ContentArea({ activeView }: ContentAreaProps) {
  return (
    <main className="flex-1 p-8 animate-in fade-in duration-300">
      {activeView === "dashboard" && <DashboardView />}
      {activeView === "bots" && <BotsView />}
      {activeView === "plugins" && <PluginsView />}
      {activeView === "plugin-market" && <PluginMarketView />}
      {activeView === "users" && <UsersView />}
      {activeView === "activity" && <ActivityView />}
      {activeView === "database" && <DatabaseView />}
      {activeView === "logs" && <LogsView />}
      {activeView === "settings" && <SettingsView />}
    </main>
  )
}
