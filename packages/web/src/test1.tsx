import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { useState } from 'react'
import {
  Settings,
  Plug,
  Users,
  MessageSquare,
  Palette,
  Server,
  Cpu,
  Eye,
  FoldVertical,
  RotateCw,
  Save,
  Settings2
} from 'lucide-react'

export default function TestPage () {
  const [selectedTab, setSelectedTab] = useState('basic')

  return (
    <div className='p-4 space-y-4'>
      {/* 头部卡片 */}
      <Card className='p-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <Cpu size={24} className='text-primary-500' />
            <h2 className='text-xl font-semibold text-gray-800'>系统配置</h2>
          </div>

          <div className='flex items-center justify-between gap-4'>
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={key => setSelectedTab(key as string)}
            >
              <Tab
                key='basic' title={
                  <div className='flex items-center gap-2'>
                    <Settings size={18} />
                    <span>基本配置</span>
                  </div>
                }
              />
              <Tab
                key='adapter' title={
                  <div className='flex items-center gap-2'>
                    <Plug size={18} />
                    <span>适配器</span>
                  </div>
                }
              />
              <Tab
                key='group' title={
                  <div className='flex items-center gap-2'>
                    <Users size={18} />
                    <span>群聊频道</span>
                  </div>
                }
              />
              <Tab
                key='private' title={
                  <div className='flex items-center gap-2'>
                    <MessageSquare size={18} />
                    <span>好友私信</span>
                  </div>
                }
              />
              <Tab
                key='renderer' title={
                  <div className='flex items-center gap-2'>
                    <Palette size={18} />
                    <span>渲染器</span>
                  </div>
                }
              />
              <Tab
                key='pm2' title={
                  <div className='flex items-center gap-2'>
                    <Server size={18} />
                    <span>PM2</span>
                  </div>
                }
              />
            </Tabs>

            <div className='flex items-center gap-2 shrink-0'>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant='bordered'
                    size='sm'
                    startContent={<Settings2 size={18} />}
                  >
                    设置
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key='preview'
                    startContent={<Eye size={18} />}
                  >
                    预览配置
                  </DropdownItem>
                  <DropdownItem
                    key='fold'
                    startContent={<FoldVertical size={18} />}
                  >
                    全部折叠
                  </DropdownItem>
                  <DropdownItem
                    key='refresh'
                    startContent={<RotateCw size={18} />}
                  >
                    刷新
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                color='primary'
                size='sm'
                startContent={<Save size={18} />}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 下方内容区域卡片 */}
      <Card className='p-6'>
        {selectedTab === 'basic' && <div>基本配置内容区域</div>}
        {selectedTab === 'adapter' && <div>适配器内容区域</div>}
        {selectedTab === 'group' && <div>群聊频道内容区域</div>}
        {selectedTab === 'private' && <div>好友私信内容区域</div>}
        {selectedTab === 'renderer' && <div>渲染器内容区域</div>}
        {selectedTab === 'pm2' && <div>PM2内容区域</div>}
      </Card>
    </div>
  )
}
