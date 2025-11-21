import { Card } from "@/components/ui/card"
import { Database, HardDrive, Activity } from "lucide-react"

export function DatabaseView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">数据库管理</h2>
        <p className="text-muted-foreground">监控数据库状态和性能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "数据库大小", value: "2.4 GB", icon: HardDrive, color: "text-blue-500" },
          { label: "活跃连接", value: "48", icon: Activity, color: "text-green-500" },
          { label: "总记录数", value: "125,847", icon: Database, color: "text-purple-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="glass border border-border/50 bg-card/40 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} from-current/10 to-current/5 flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
