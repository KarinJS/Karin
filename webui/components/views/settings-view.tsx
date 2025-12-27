import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SettingsView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">系统设置</h2>
        <p className="text-muted-foreground">配置系统参数和偏好设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border border-border/50 bg-card/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">通用设置</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">站点名称</Label>
              <Input id="site-name" placeholder="Bot Framework" className="glass-light" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">管理员邮箱</Label>
              <Input id="admin-email" type="email" placeholder="admin@example.com" className="glass-light" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用通知</Label>
                <p className="text-sm text-muted-foreground">接收系统通知和警报</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>自动备份</Label>
                <p className="text-sm text-muted-foreground">每日自动备份数据库</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="glass border border-border/50 bg-card/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">安全设置</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>双因素认证</Label>
                <p className="text-sm text-muted-foreground">提高账户安全性</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>会话超时</Label>
                <p className="text-sm text-muted-foreground">30 分钟无活动后自动登出</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API 密钥</Label>
              <Input id="api-key" type="password" value="sk_test_••••••••••••" className="glass-light" readOnly />
            </div>
            <Button variant="outline" className="w-full rounded-lg glass-light bg-transparent">
              重新生成 API 密钥
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="rounded-lg glass-light bg-transparent">
          取消
        </Button>
        <Button className="rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">保存更改</Button>
      </div>
    </div>
  )
}
