import { Card } from "@/components/ui/card"
import { Activity, MessageSquare, UserPlus, SettingsIcon } from "lucide-react"

export function ActivityView() {
  const activities = [
    { type: "message", user: "张三", action: "发送了 234 条消息", time: "5 分钟前", icon: MessageSquare },
    { type: "user", user: "系统", action: '新用户 "李四" 加入', time: "1 小时前", icon: UserPlus },
    { type: "config", user: "王五", action: "更新了 Bot 配置", time: "2 小时前", icon: SettingsIcon },
    { type: "message", user: "Customer Support Bot", action: "处理了 89 个请求", time: "3 小时前", icon: Activity },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">活动日志</h2>
        <p className="text-muted-foreground">实时跟踪系统活动和用户操作</p>
      </div>

      <Card className="glass border border-border/50 bg-card/40">
        <div className="divide-y divide-border/50">
          {activities.map((activity, i) => {
            const Icon = activity.icon
            return (
              <div key={i} className="p-6 hover:bg-accent/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground mb-1">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
