import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal } from "lucide-react"

export function LogsView() {
  const logs = [
    { level: "info", message: "Bot #1 started successfully", timestamp: "2025-01-14 10:23:45" },
    { level: "warning", message: "High memory usage detected (85%)", timestamp: "2025-01-14 10:22:31" },
    { level: "error", message: "Failed to connect to database", timestamp: "2025-01-14 10:21:18" },
    { level: "info", message: "User authentication completed", timestamp: "2025-01-14 10:20:05" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">系统日志</h2>
        <p className="text-muted-foreground">查看系统运行日志和错误信息</p>
      </div>

      <Card className="glass border border-border/50 bg-card/40 p-6">
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors font-mono text-sm"
            >
              <Terminal className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <Badge
                variant={log.level === "error" ? "destructive" : log.level === "warning" ? "secondary" : "outline"}
                className="flex-shrink-0"
              >
                {log.level.toUpperCase()}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-foreground">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
