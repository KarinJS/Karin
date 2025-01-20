import { Card } from '@heroui/card'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Outlet } from 'react-router-dom'
import SideBar from '@/pages/dashboard/sandbox/layout/sidebar'
import List from '@/pages/dashboard/sandbox/layout/list'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function SandboxPage() {
  useEffect(() => {
    toast.error('沙箱调试正在开发中，目前不可用')
  }, [])
  return (
    <section className="h-full pt-20 md:pt-8 pb-5 md:pb-8">
      <Card shadow="sm" className="h-full">
        <ResizablePanelGroup direction="horizontal">
          <div className="w-14 flex flex-col items-stretch">
            <div className="flex justify-around py-2 px-1.5">
              <div className="w-3 h-3 rounded-full bg-danger"></div>
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
            </div>
            <SideBar />
          </div>
          <ResizablePanel minSize={20} defaultSize={30} maxSize={40} className="bg-content2">
            <List />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-content1">
            <Outlet />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </section>
  )
}
