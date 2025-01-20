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
import { MdSave } from 'react-icons/md'

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

      console.log(res)

      setConfigStructure(res.struct)

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

  return (
    <section className="pt-20 md:pt-8">
      <div className="max-w-2xl mx-auto flex items-center sticky top-0 z-10 bg-content1 rounded-full bg-opacity-50 backdrop-blur-md p-4">
        <Tabs
          className="flex"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          radius="full"
        >
          <Tab key="config" title="基础配置" />
          <Tab key="adapter" title="适配器" />
        </Tabs>
        <Button
          className="ml-auto"
          color="primary"
          startContent={<MdSave />}
          isLoading={loading}
          radius="full"
          onPress={() => handleSubmit(onSubmit)()}
        >
          保存
        </Button>
      </div>

      {configStructure.length === 0 ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
          <DynamicForm
            register={register}
            control={control}
            errors={errors}
            formConfig={configStructure}
          />
        </form>
      )}
    </section>
  )
}

export default ConfigPage
