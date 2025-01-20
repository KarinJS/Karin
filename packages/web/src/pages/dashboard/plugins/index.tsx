import { Outlet, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Tabs, Tab } from '@heroui/tabs'
import { Card, CardBody } from '@heroui/card'
const routes = [
  {
    path: '/plugins',
    title: '插件市场',
  },
  {
    path: '/plugins/local',
    title: '已安装',
  },
]
export default function PluginsPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <section className="flex flex-col gap-2 h-full pt-5 pb-5 md:pb-8">
      <Tabs
        selectedKey={pathname}
        aria-label="Tabs"
        className="flex-shrink-0 flex-grow-0 mb-2"
        items={routes}
        size="lg"
        radius="full"
        classNames={{
          base: 'justify-center',
        }}
        onSelectionChange={key => {
          navigate(key.toString())
        }}
      >
        {route => {
          return <Tab key={route.path} title={route.title} />
        }}
      </Tabs>
      <Card className="flex-grow overflow-y-auto" shadow="sm">
        <CardBody>
          <Outlet />
        </CardBody>
      </Card>
    </section>
  )
}
