import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Plus, Power, Settings, MoreVertical } from "lucide-react"

export function BotsView() {
  const bots = [
    { id: 1, name: "Customer Support Bot", status: "online", messages: 1234, uptime: "99.9%" },
    { id: 2, name: "Sales Assistant", status: "online", messages: 856, uptime: "98.5%" },
    { id: 3, name: "FAQ Bot", status: "offline", messages: 423, uptime: "95.2%" },
    { id: 4, name: "Order Tracker", status: "online", messages: 2103, uptime: "99.7%" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Bot 管理</h2>
          <p className="text-muted-foreground">管理和监控您的所有 Bot 实例</p>
        </div>
        <Button className="rounded-lg bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          创建新 Bot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bots.map((bot) => (
          <Card
            key={bot.id}
            className="glass border border-border/50 bg-card/40 p-6 hover:bg-card/60 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{bot.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${bot.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    <span className="text-xs text-muted-foreground capitalize">{bot.status}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">消息数</p>
                <p className="text-lg font-semibold text-foreground">{bot.messages.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">运行时间</p>
                <p className="text-lg font-semibold text-foreground">{bot.uptime}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg glass-light hover:bg-accent/50 bg-transparent"
              >
                <Power className="w-4 h-4 mr-2" />
                {bot.status === "online" ? "停止" : "启动"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg glass-light hover:bg-accent/50 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                配置
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
