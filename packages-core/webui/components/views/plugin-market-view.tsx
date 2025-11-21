"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Calendar, ChevronLeft, ChevronRight, ArrowDownToLine } from "lucide-react"

interface Plugin {
  name: string
  description: string
  version: string
  downloads: string
  lastUpdated: string
  homepage: string
  authors: {
    name: string
    avatar: string
    homepage: string
  }[]
  installed: boolean
}

export function PluginMarketView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState("1")
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const viewportHeight = window.innerHeight
      const availableHeight = viewportHeight - 200
      const cardHeight = 140
      const rowsPerPage = Math.max(1, Math.floor(availableHeight / cardHeight))
      const items = rowsPerPage * 3
      setItemsPerPage(Math.max(3, items))
    }

    calculateItemsPerPage()
    window.addEventListener("resize", calculateItemsPerPage)
    return () => window.removeEventListener("resize", calculateItemsPerPage)
  }, [])

  const allPlugins: Plugin[] = [
    {
      name: "高级数据分析",
      description: "提供全面的数据分析仪表板，支持实时数据可视化和自定义报告工具，帮助您深入了解业务数据",
      version: "2.4.1",
      downloads: "12.5k",
      lastUpdated: "2天前",
      homepage: "https://example.com/advanced-analytics",
      authors: [
        {
          name: "陈小雅",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
          homepage: "https://github.com/alice",
        },
      ],
      installed: false,
    },
    {
      name: "AI 智能聊天助手",
      description: "自然语言处理引擎，具备上下文理解能力和多语言支持，为用户提供智能对话体验",
      version: "3.1.0",
      downloads: "8.2k",
      lastUpdated: "1周前",
      homepage: "https://example.com/ai-chat",
      authors: [
        {
          name: "王大海",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
          homepage: "https://github.com/bob",
        },
        {
          name: "李晓琳",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
          homepage: "https://github.com/carol",
        },
      ],
      installed: true,
    },
    {
      name: "专业支付网关",
      description: "安全的支付处理系统，支持多种货币和支付方式，确保交易安全可靠",
      version: "1.8.5",
      downloads: "15.3k",
      lastUpdated: "3天前",
      homepage: "https://example.com/payment",
      authors: [
        {
          name: "金大卫",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          homepage: "https://github.com/david",
        },
      ],
      installed: false,
    },
    {
      name: "数据库优化器",
      description: "自动化查询优化和性能监控，适用于大规模应用程序，提升数据库运行效率",
      version: "2.0.2",
      downloads: "6.7k",
      lastUpdated: "5天前",
      homepage: "https://example.com/db-optimizer",
      authors: [
        {
          name: "赵小美",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          homepage: "https://github.com/emma",
        },
        {
          name: "张大明",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
          homepage: "https://github.com/frank",
        },
        {
          name: "朴小恩",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
          homepage: "https://github.com/grace",
        },
      ],
      installed: false,
    },
    {
      name: "邮件营销管理",
      description: "设计、安排和跟踪邮件营销活动，支持高级用户分组和个性化内容推送",
      version: "1.5.3",
      downloads: "9.1k",
      lastUpdated: "1天前",
      homepage: "https://example.com/email-campaign",
      authors: [
        {
          name: "刘小亨",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
          homepage: "https://github.com/henry",
        },
      ],
      installed: false,
    },
    {
      name: "安全防护盾",
      description: "企业级安全监控系统，提供实时威胁检测和防护，保障系统安全稳定运行",
      version: "4.2.0",
      downloads: "18.9k",
      lastUpdated: "4小时前",
      homepage: "https://example.com/security",
      authors: [
        {
          name: "陈小虹",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Iris",
          homepage: "https://github.com/iris",
        },
        {
          name: "王小杰",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
          homepage: "https://github.com/jack",
        },
      ],
      installed: true,
    },
    {
      name: "自动化任务调度",
      description: "灵活的任务调度系统，支持定时任务、条件触发和依赖管理，提升工作效率",
      version: "1.9.0",
      downloads: "7.4k",
      lastUpdated: "6天前",
      homepage: "https://example.com/task-scheduler",
      authors: [
        {
          name: "林小芳",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kate",
          homepage: "https://github.com/kate",
        },
      ],
      installed: false,
    },
    {
      name: "文件存储管理",
      description: "云端文件存储解决方案，支持多种存储后端和智能文件压缩，节省存储空间",
      version: "3.3.2",
      downloads: "11.2k",
      lastUpdated: "2天前",
      homepage: "https://example.com/file-storage",
      authors: [
        {
          name: "周小明",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
          homepage: "https://github.com/leo",
        },
        {
          name: "吴小兰",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
          homepage: "https://github.com/mary",
        },
      ],
      installed: false,
    },
    {
      name: "实时通知中心",
      description: "多渠道通知推送系统，支持邮件、短信、推送通知等多种方式，确保信息及时送达",
      version: "2.1.4",
      downloads: "13.8k",
      lastUpdated: "1周前",
      homepage: "https://example.com/notification",
      authors: [
        {
          name: "徐小强",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nick",
          homepage: "https://github.com/nick",
        },
      ],
      installed: false,
    },
    {
      name: "权限管理系统",
      description: "基于角色的访问控制系统，支持细粒度权限配置和动态权限分配，保障数据安全",
      version: "1.7.1",
      downloads: "9.9k",
      lastUpdated: "3天前",
      homepage: "https://example.com/permission",
      authors: [
        {
          name: "孙小丽",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
          homepage: "https://github.com/olivia",
        },
      ],
      installed: true,
    },
    {
      name: "日志分析工具",
      description: "强大的日志收集和分析工具，支持实时日志查询和可视化分析，快速定位问题",
      version: "2.5.3",
      downloads: "8.6k",
      lastUpdated: "5天前",
      homepage: "https://example.com/log-analyzer",
      authors: [
        {
          name: "马小云",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
          homepage: "https://github.com/peter",
        },
        {
          name: "郑小雪",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn",
          homepage: "https://github.com/quinn",
        },
      ],
      installed: false,
    },
    {
      name: "表单构建器",
      description: "可视化表单设计工具，支持拖拽式布局和丰富的字段类型，快速创建各类表单",
      version: "1.6.8",
      downloads: "10.5k",
      lastUpdated: "4天前",
      homepage: "https://example.com/form-builder",
      authors: [
        {
          name: "冯小华",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rose",
          homepage: "https://github.com/rose",
        },
      ],
      installed: false,
    },
  ]

  const totalPages = Math.ceil(allPlugins.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedPlugins = allPlugins.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setPageInput(page.toString())
    }
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = Number.parseInt(pageInput)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">插件市场</h2>
        <p className="text-muted-foreground">发现并安装插件来扩展您的 Bot 框架功能</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedPlugins.map((plugin, i) => (
          <Card
            key={i}
            className="glass border border-border/50 bg-card/40 p-5 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col"
          >
            <div className="flex gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <a
                  href={plugin.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-normal text-foreground hover:text-primary transition-colors block mb-2"
                  title={plugin.name}
                >
                  {plugin.name}
                </a>
                <p className="text-sm text-muted-foreground/70 leading-relaxed" title={plugin.description}>
                  {plugin.description}
                </p>
              </div>
              <div className="flex items-start flex-shrink-0 pt-1">
                {plugin.authors.length === 1 ? (
                  <a
                    href={plugin.authors[0].homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                  >
                    <img
                      src={plugin.authors[0].avatar || "/placeholder.svg"}
                      alt={plugin.authors[0].name}
                      className="w-12 h-12 rounded-full border-2 border-background shadow-md hover:scale-110 transition-transform"
                    />
                    <div className="absolute -top-10 right-0 px-2 py-1 bg-popover text-popover-foreground text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
                      {plugin.authors[0].name}
                    </div>
                  </a>
                ) : (
                  <div className="flex -space-x-3">
                    {plugin.authors.map((author, idx) => (
                      <a
                        key={idx}
                        href={author.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                      >
                        <img
                          src={author.avatar || "/placeholder.svg"}
                          alt={author.name}
                          className="w-12 h-12 rounded-full border-2 border-background shadow-md hover:z-10 hover:scale-110 transition-transform"
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md">
                          {author.name}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs flex-1 min-w-0">
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full font-medium flex-shrink-0">
                  {plugin.version}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground" title="下载量">
                  <Download className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{plugin.downloads}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground" title="更新时间">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{plugin.lastUpdated}</span>
                </div>
              </div>
              <Button
                variant={plugin.installed ? "outline" : "default"}
                size="sm"
                className="rounded-lg px-4 flex-shrink-0 hover:scale-105 transition-transform flex items-center gap-2"
              >
                {!plugin.installed && <ArrowDownToLine className="w-4 h-4" />}
                <span className={plugin.installed ? "text-foreground" : "text-primary-foreground"}>
                  {plugin.installed ? "查看" : "安装"}
                </span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg hover:scale-105 transition-transform disabled:hover:scale-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">第</span>
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-16 h-8 text-center text-sm rounded-lg"
            />
          </form>
          <span className="text-sm text-muted-foreground">/ {totalPages} 页</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg hover:scale-105 transition-transform disabled:hover:scale-100"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
