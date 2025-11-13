import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function UsersView() {
  const users = [
    { name: "张三", role: "Admin", email: "zhang@example.com", status: "active", initials: "ZS" },
    { name: "李四", role: "Developer", email: "li@example.com", status: "active", initials: "LS" },
    { name: "王五", role: "Operator", email: "wang@example.com", status: "away", initials: "WW" },
    { name: "赵六", role: "Viewer", email: "zhao@example.com", status: "offline", initials: "ZL" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">用户管理</h2>
        <p className="text-muted-foreground">管理系统用户和权限</p>
      </div>

      <Card className="glass border border-border/50 bg-card/40">
        <div className="divide-y divide-border/50">
          {users.map((user, i) => (
            <div key={i} className="p-6 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.status === "active"
                        ? "bg-green-500"
                        : user.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
