import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import toast from 'react-hot-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'
import { Select, SelectItem } from '@heroui/select'
import { Tab, Tabs } from '@heroui/tabs'
import { Tooltip } from '@heroui/tooltip'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoMusicalNotes } from 'react-icons/io5'
import { TbMusicPlus } from 'react-icons/tb'
import { isURI } from '@/lib/utils'
import useShowStructuredMessage from '@/hooks/sandbox/use_show_strcuted_message'


import type { Key } from '@react-types/shared'

import type { SharedSelection } from '@heroui/system'
import type { Elements, CustomMusicElement, MusicElement } from '@/types/segment'

type MusicData = CustomMusicElement | MusicElement

const MusicInsert = () => {
  const [musicId, setMusicId] = useState<string>('')
  const [musicType, setMusicType] = useState<SharedSelection>(new Set(['163']))
  const [mode, setMode] = useState<Key>('default')
  const containerRef = useRef<HTMLDivElement>(null)
  const { control, handleSubmit, reset } = useForm<Omit<CustomMusicElement, 'type'>>({
    defaultValues: {
      url: '',
      audio: '',
      title: '',
    },
  })
  const showStructuredMessage = useShowStructuredMessage()

  const showMusicSegment = (data: MusicData) => {
    const messages: Elements[] = []
    if (data.platform === 'custom') {
      messages.push({
        ...data,
        type: 'music',
      })
    } else {
      messages.push({
        ...data,
        type: 'music',
      })
    }
    showStructuredMessage(messages)
  }

  const onSubmit = (data: Omit<CustomMusicElement, 'type'>) => {
    showMusicSegment({
      ...data,
      type: 'music',
    })
    reset()
  }

  return (
    <div ref={containerRef} className="overflow-visible">
      <Popover placement="top" shouldCloseOnScroll={false} portalContainer={containerRef.current!}>
        <Tooltip content="发送音乐">
          <div className="max-w-fit">
            <PopoverTrigger>
              <Button size="sm" variant="light" isIconOnly radius="full">
                <IoMusicalNotes className="text-xl" />
              </Button>
            </PopoverTrigger>
          </div>
        </Tooltip>
        <PopoverContent className="gap-2 p-4">
          <Tabs
            placement="top"
            className="w-96"
            fullWidth
            selectedKey={mode}
            onSelectionChange={setMode}
          >
            <Tab title="主流平台" key="default" className="flex flex-col gap-2">
              <Select
                onClick={e => e.stopPropagation()}
                aria-label="音乐平台"
                selectedKeys={musicType}
                label="音乐平台"
                placeholder="请选择音乐平台"
                items={[
                  {
                    name: 'QQ音乐',
                    id: 'qq',
                  },
                  {
                    name: '网易云音乐',
                    id: '163',
                  },
                  {
                    name: '虾米音乐',
                    id: 'xm',
                  },
                ]}
                onSelectionChange={setMusicType}
              >
                {item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                )}
              </Select>
              <Input
                value={musicId}
                onChange={e => setMusicId(e.target.value)}
                placeholder="请输入音乐ID"
                label="音乐ID"
              />
              <Button
                fullWidth
                size="lg"
                color="primary"
                variant="flat"
                radius="full"
                onPress={() => {
                  if (!musicId) {
                    toast.error('请输入音乐ID')
                    return
                  }
                  showMusicSegment({
                    type: 'music',
                    id: musicId,
                    platform: Array.from(musicType)[0] as '163' | 'qq' | 'migu' | 'kugou' | 'kuwo',
                  })
                  setMusicId('')
                }}
                startContent={<TbMusicPlus />}
              >
                创建{Array.from(musicType)[0] === '163' ? '网易云' : 'QQ'}音乐
              </Button>
            </Tab>
            <Tab title="自定义音乐" key="custom" className="flex flex-col gap-2">
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
                validationBehavior="native"
              >
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      isRequired
                      validate={v => {
                        return !isURI(v) ? '请输入正确的音乐URL' : null
                      }}
                      size="sm"
                      placeholder="请输入音乐URL"
                      label="音乐URL"
                    />
                  )}
                />
                <Controller
                  name="audio"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      isRequired
                      validate={v => {
                        return !isURI(v) ? '请输入正确的音频URL' : null
                      }}
                      size="sm"
                      placeholder="请输入音频URL"
                      label="音频URL"
                    />
                  )}
                />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      isRequired
                      size="sm"
                      errorMessage="请输入音乐标题"
                      placeholder="请输入音乐标题"
                      label="音乐标题"
                    />
                  )}
                />
                <Controller
                  name="pic"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="sm"
                      placeholder="请输入封面图片URL"
                      label="封面图片URL"
                    />
                  )}
                />
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} size="sm" placeholder="请输入音乐作者" label="音乐作者" />
                  )}
                />
                <Button
                  fullWidth
                  size="lg"
                  color="primary"
                  variant="flat"
                  radius="full"
                  type="submit"
                  startContent={<TbMusicPlus />}
                >
                  创建自定义音乐
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MusicInsert
