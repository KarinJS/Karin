import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@heroui/button'
import DynamicForm from '@/components/dynamic_form'
import { FormField } from '@/types/config'
import { Spinner } from '@heroui/spinner'
import { Tab, Tabs } from '@heroui/tabs'
import toast from 'react-hot-toast'
import { request } from '@/lib/request'
import { Key } from '@react-types/shared'
import { MdSave, MdUnfoldLess } from 'react-icons/md'

// 动态表单组件
const ConfigPage: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [configStructure, setConfigStructure] = useState<FormField[]>([])
  const [activeTab, setActiveTab] = useState<Key>('config')
  const [loading, setLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<Key>>(new Set())
  const [hasSections, setHasSections] = useState(false)

  const fetchConfig = async () => {
    try {
      const res = await request.serverPost<
        {
          struct: FormField[]
          value: Record<string, unknown>
        },
        { type: string }
      >('/api/v1/config/get', {
        type: activeTab.toString(),
      })

      // console.log(res)

      setConfigStructure(res.struct)
      // 检查是否有section类型的字段
      setHasSections(res.struct.some(field => field.type === 'section'))
      // 默认展开所有section
      const sectionKeys = res.struct
        .filter(field => field.type === 'section')
        .map(field => field.key)
      setExpandedSections(new Set(sectionKeys))

      reset(res.value)
    } catch (error) {
      console.error('获取配置失败:', error)
      toast.error('获取配置失败')
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [activeTab, reset])

  const onSubmit = async (data: Record<string, unknown>) => {
    if (Object.keys(data).length === 0) {
      toast.error('表单数据不能为空')
      return
    }
    setLoading(true)
    try {
      await request.serverPost<null, { type: string; data: Record<string, unknown> }>(
        '/api/v1/config/set',
        {
          type: activeTab.toString(),
          data,
        },
      )
      toast.success('保存配置成功')
      fetchConfig()
    } catch (error) {
      console.error('保存配置失败:', error)
      toast.error('保存配置失败')
    } finally {
      setLoading(false)
    }
  }

  const toggleAllSections = () => {
    if (expandedSections.size > 0) {
      // 全部折叠
      setExpandedSections(new Set())
    } else {
      // 全部展开
      const sectionKeys = configStructure
        .filter(field => field.type === 'section')
        .map(field => field.key)
      setExpandedSections(new Set(sectionKeys))
    }
  }

  return (
    <section className="pt-20 md:pt-8">
      <div className="max-w-2xl mx-auto flex items-center sticky top-0 z-20 bg-content1 rounded-b-3xl bg-opacity-50 backdrop-blur-md py-4 px-2 overflow-hidden mb-4 gap-2">
        <Tabs
          className="w-auto flex flex-shrink flex-grow overflow-x-auto"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          radius="full"
        >
          <Tab key="config" title="基础配置" />
          <Tab key="adapter" title="适配器" />
          <Tab key="groups" title="群聊和频道" />
          <Tab key="privates" title="好友和频道私信" />
          <Tab key="render" title="渲染配置" />
          <Tab key="pm2" title="pm2配置" />
          <Tab key="redis" title="redis配置" />
          <Tab key="env" title="环境变量" />
        </Tabs>
        <div className="flex gap-2 ml-auto flex-grow-0 flex-shrink-0 items-center">
          {hasSections && (
            <Button
              color={expandedSections.size > 0 ? 'primary' : 'default'}
              startContent={<MdUnfoldLess />}
              radius="full"
              size="sm"
              variant="flat"
              onPress={toggleAllSections}
            >
              {expandedSections.size > 0 ? '全部折叠' : '全部展开'}
            </Button>
          )}
          <Button
            color="primary"
            startContent={<MdSave />}
            isLoading={loading}
            radius="full"
            onPress={() => handleSubmit(onSubmit)()}
          >
            保存
          </Button>
        </div>
      </div>

      {configStructure.length === 0 ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto flex flex-col gap-4 px-2 pb-10"
        >
          <DynamicForm
            register={register}
            control={control}
            errors={errors}
            formConfig={configStructure}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
          />
        </form>
      )}
    </section>
  )
}

export default ConfigPage
