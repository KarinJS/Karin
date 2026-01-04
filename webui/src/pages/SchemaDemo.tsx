import { useState } from 'react'
import { Tabs, Tab, Card, CardBody, Code, Button } from '@heroui/react'
import { toast } from 'sonner'
import { SchemaForm } from '../components/schema-form'
import {
  serverConfigSchema,
  sceneConfigSchema,
  demoSchema,
  advancedComponentsSchema,
  mockServerData,
  mockSceneData,
  mockDemoData,
  mockAdvancedData,
} from '../mocks/schemaDemo'
import { Eye, Code as CodeIcon } from 'lucide-react'

/**
 * Schema-Driven UI 演示页面
 */
export function SchemaDemo () {
  const [activeTab, setActiveTab] = useState('demo')
  const [showJson, setShowJson] = useState(false)
  const [currentData, setCurrentData] = useState<Record<string, unknown>>({})

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log('提交数据:', data)
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('保存成功！')
    setCurrentData(data)
  }

  const tabs = [
    {
      key: 'demo',
      title: '综合演示',
      schema: demoSchema,
      data: mockDemoData,
    },
    {
      key: 'advanced',
      title: '高级组件',
      schema: advancedComponentsSchema,
      data: mockAdvancedData,
    },
    {
      key: 'server',
      title: '服务器配置',
      schema: serverConfigSchema,
      data: mockServerData,
    },
    {
      key: 'scene',
      title: '场景配置 (对象数组)',
      schema: sceneConfigSchema,
      data: mockSceneData,
    },
  ]

  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 页面标题 */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Schema-Driven UI</h1>
          <p className="text-default-500 text-sm mt-1 truncate">
            后端只需定义 JSON Schema，前端自动渲染 HeroUI 组件
          </p>
        </div>
        <Button
          variant="flat"
          size="sm"
          className="shrink-0"
          startContent={showJson ? <Eye size={16} /> : <CodeIcon size={16} />}
          onPress={() => setShowJson(!showJson)}
        >
          <span className="hidden sm:inline">{showJson ? '查看表单' : '查看 Schema'}</span>
          <span className="sm:hidden">{showJson ? '表单' : 'Schema'}</span>
        </Button>
      </div>

      {/* 标签切换 */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="bordered"
        size="sm"
        classNames={{
          base: 'shrink-0 overflow-x-auto mb-4',
          tabList: 'bg-content1',
        }}
      >
        {tabs.map(tab => (
          <Tab key={tab.key} title={tab.title} />
        ))}
      </Tabs>

      {/* 主内容区域 - 占据剩余高度 */}
      <div className="flex-1 min-h-0 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* 主内容 */}
          <div className={showJson ? 'lg:col-span-2 h-full' : 'lg:col-span-3 h-full'}>
            <Card shadow="sm" className="border border-divider h-full">
              <CardBody className="p-4 sm:p-6 overflow-y-auto">
                {showJson ? (
                  <div>
                    <h3 className="font-semibold mb-4 text-sm">Schema 定义</h3>
                    <Code className="w-full overflow-auto">
                      <pre className="text-xs">
                        {JSON.stringify(currentTab.schema, null, 2)}
                      </pre>
                    </Code>
                  </div>
                ) : (
                  <SchemaForm
                    schema={currentTab.schema}
                    initialData={currentTab.data}
                    onSubmit={handleSubmit}
                    onChange={setCurrentData}
                  />
                )}
              </CardBody>
            </Card>
          </div>

          {/* 侧边栏：实时数据预览 */}
          {showJson && (
            <div className="lg:col-span-1 h-full">
              <Card shadow="sm" className="border border-divider h-full">
                <CardBody className="p-4 overflow-y-auto">
                  <h3 className="font-semibold mb-4 text-sm">当前数据</h3>
                  <Code className="w-full overflow-auto">
                    <pre className="text-xs">
                      {JSON.stringify(currentData, null, 2)}
                    </pre>
                  </Code>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 功能特点 - 固定在底部 */}
      <Card shadow="sm" className="border border-divider bg-default-50 shrink-0">
        <CardBody className="p-3">
          <div className="flex items-center gap-4 text-xs overflow-x-auto">
            <span className="font-semibold shrink-0">✨ 功能特点</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-1 bg-content1 rounded-lg text-primary">🎨 样式固定</span>
              <span className="px-2 py-1 bg-content1 rounded-lg text-secondary">📦 40+ 组件</span>
              <span className="px-2 py-1 bg-content1 rounded-lg text-success">🔄 动态数组</span>
              <span className="px-2 py-1 bg-content1 rounded-lg text-warning">🌐 国际化</span>
            </div>
          </div>
          <details className="mt-3">
            <summary className="text-xs text-default-500 cursor-pointer hover:text-default-700">
              查看全部 {35} 种组件类型...
            </summary>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-1.5 text-xs">
              {[
                '文本输入', '密码', '数字', '文本域', '开关', '选择器',
                '复选框', '单选组', '自动补全', '滑块', '颜色选择',
                '标签输入', 'OTP输入', '评分', '进度条', '头像',
                '标签', '链接', '代码片段', '图片', '按钮',
                '手风琴', '标签页', '分隔线', '提示框', '分组',
                '卡片', '弹出框', '模态框', '抽屉', '列表框',
                '下拉菜单', '面包屑', '分页', '表格', '滚动区域',
              ].map((name) => (
                <div key={name} className="px-1.5 py-0.5 bg-default-100 rounded text-center truncate">
                  {name}
                </div>
              ))}
            </div>
          </details>
        </CardBody>
      </Card>
    </div>
  )
}
