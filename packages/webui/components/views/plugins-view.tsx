import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plug, Download, CheckCircle2 } from "lucide-react"

export function PluginsView() {
  const plugins = [
    { name: "Natural Language Processing", version: "v2.4.1", installed: true, category: "AI/ML" },
    { name: "Database Connector", version: "v1.8.0", installed: true, category: "Integration" },
    { name: "Analytics Dashboard", version: "v3.1.2", installed: false, category: "Analytics" },
    { name: "Payment Gateway", version: "v2.0.5", installed: false, category: "Commerce" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">插件管理</h2>
        <p className="text-muted-foreground">扩展您的 Bot 框架功能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin, i) => (
          <Card
            key={i}
            className="glass border border-border/50 bg-card/40 p-6 hover:bg-card/60 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Plug className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{plugin.name}</h3>
                <p className="text-xs text-muted-foreground">{plugin.category}</p>
              </div>
              {plugin.installed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>

            <p className="text-sm text-muted-foreground mb-4">{plugin.version}</p>

            <Button variant={plugin.installed ? "outline" : "default"} className="w-full rounded-lg">
              {plugin.installed ? (
                "已安装"
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  安装
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
