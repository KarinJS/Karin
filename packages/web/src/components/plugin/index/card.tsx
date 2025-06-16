import { Link } from '@heroui/link'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'
import { Tooltip } from '@heroui/tooltip'
import { BadgeCheck } from 'lucide-react'
import { Card, CardBody } from '@heroui/card'
import { Button } from '@heroui/button'
import { IoSettingsOutline } from 'react-icons/io5'

import type { FC } from 'react'
import type { FrontendInstalledPluginListResponse } from 'node-karin'

/**
 * 卡片安装图标组件
 * @param installed - 是否已安装
 * @param onClick - 点击事件
 * @returns 返回卡片安装图标组件
 */
const IsInstallIcon: FC<{
  installed: boolean
  onClick?: () => void
}> = ({ installed }) => {
  if (installed) {
    return (
      <Tooltip content='已安装'>
        <div className='relative flex items-center justify-center'>
          <div className='w-4 h-4 flex items-center justify-center'>
            <BadgeCheck className='w-full h-full text-success-500/90 dark:text-success-400/90 stroke-[2]' />
          </div>
        </div>
      </Tooltip>
    )
  }
  return <></>
}

/**
 * 插件名称组件
 * @param plugin - 插件信息
 * @returns 返回插件名称组件
 */
const PluginName: FC<{ plugin: FrontendInstalledPluginListResponse }> = ({ plugin }) => {
  if (plugin.repoUrl) {
    return (
      <Tooltip content='点击访问插件主页'>
        <Link
          href={plugin.repoUrl}
          isExternal
          className='text-sm font-medium text-default-900 hover:text-primary-500 transition-colors truncate'
        >
          {plugin.id}
        </Link>
      </Tooltip>
    )
  }

  return (
    <span className='text-sm font-medium text-default-900 truncate'>{plugin.id}</span>
  )
}

/**
 * 插件描述组件
 * @param plugin - 插件信息
 * @returns 返回插件描述组件
 */
const PluginDescription: FC<{ plugin: FrontendInstalledPluginListResponse }> = ({ plugin }) => {
  const getDefaultDescription = (name: string) => {
    const descriptions = [
      '为您的工作流程带来更多可能性和效率提升',
      '简单易用且功能强大的插件，助力开发体验',
      '为项目开发锦上添花的得力助手',
      '提升开发效率的智能工具，让工作更轻松',
      '优化您的开发流程，提供更好的使用体验',
      '为您的项目增添新的维度和可能性',
      '智能且高效的开发工具，助力效率提升',
      '让开发更简单，让创作更有趣',
      '为您的工作流程带来智能化的解决方案',
      '提供专业的开发支持，让工作更高效',
    ]

    /** 种子 */
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    /** 索引 */
    const index = seed % descriptions.length

    /** 将插件名称插入描述中，使其更加个性化 */
    return descriptions[index].replace(/您的|开发/, () => {
      const keywords = ['您的', name, '开发']
      return keywords[seed % keywords.length]
    })
  }

  /**
   * 截断文本并添加省略号
   * @param text - 需要截断的文本
   * @param maxLength - 最大长度
   * @returns 截断后的文本
   */
  const truncateText = (text: string): string => {
    /** 一行大约可显示的字符数 */
    const charsPerLine = 40
    /** 两行最多可显示的字符数 */
    const maxChars = charsPerLine * 2

    if (text.length <= maxChars) {
      return text
    }

    /** 在合适的位置截断，优先在标点符号或空格处 */
    let truncateIndex = maxChars
    /** 从最大长度向前查找适合的截断位置（标点符号或空格） */
    for (let i = maxChars; i > maxChars - 10; i--) {
      if ([',', '.', '，', '。', '；', ';', ' ', '、'].includes(text[i])) {
        truncateIndex = i + 1
        break
      }
    }

    return text.substring(0, truncateIndex) + '...'
  }

  const description = !plugin.description
    ? getDefaultDescription(plugin.id)
    : plugin.description

  /** 处理可能过长的描述 */
  const displayText = truncateText(description)

  return (
    <p className='text-xs text-default-500 line-clamp-2 leading-relaxed' title={description}>
      {displayText}
    </p>
  )
}

/**
 * 卡片头像组件
 * @param plugin - 插件信息
 * @returns 返回卡片头像组件
 */
const CardAvatar: FC<{ plugin: FrontendInstalledPluginListResponse }> = ({ plugin }) => {
  if (!plugin.author) {
    return (
      <Avatar
        isBordered
        size='sm'
        icon={<FaUser />}
        className='bg-default-100 border-white dark:border-default-800'
      />
    )
  }

  return (
    <Tooltip
      content={
        <div className='text-center'>
          <p className='text-sm text-default-600'>{plugin.author.name}</p>
          {
            plugin.author.home &&
            (
              <p className='text-xs text-default-400'>点击访问主页</p>
            )
          }
        </div>
      }
    >
      {plugin.author.home
        ? (
          <Link href={plugin.author.home} isExternal>
            <Avatar
              isBordered
              size='sm'
              src={plugin.author.avatar || 'https://avatar.vercel.sh/ikenxuan'}
              className='bg-default-100 border-white dark:border-default-800'
            />
          </Link>
        )
        : (
          <Avatar
            isBordered
            size='sm'
            src={plugin.author.avatar || 'https://avatar.vercel.sh/ikenxuan'}
            className='bg-default-100 border-white dark:border-default-800'
          />
        )}
    </Tooltip>
  )
}

/**
 * 插件卡片组件
 * @param plugin - 插件信息
 * @param cardClassName - 可选，外部自定义卡片className
 * @returns 返回插件卡片组件
 */
const PluginCard: FC<{
  plugin: FrontendInstalledPluginListResponse,
  cardClassName?: string
}> = ({ plugin, cardClassName }) => {
  /** 处理配置按钮点击 */
  const handleConfigClick = () => {
    console.log('配置插件:', plugin.id)
  }

  return (
    <Card
      className={`group w-full h-[140px] flex flex-col overflow-hidden cursor-pointer relative bg-default-50/10 rounded-xl border border-default-200 transition-all duration-700 hover:border-primary-500 hover:shadow-sm hover:shadow-primary-500/50 hover:scale-[1.02] ${cardClassName || ''}`}
      isPressable
      radius='sm'
      style={{
        '--tw-border-opacity': '0.6',
        transition: 'border-color 0.7s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.1s ease-out',
      } as React.CSSProperties}
    >
      <CardBody className='p-4 flex flex-col h-full relative'>
        <div className='flex items-start justify-between gap-3 mb-2'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5'>
              <IsInstallIcon installed />
              <PluginName plugin={plugin} />
            </div>
            <PluginDescription plugin={plugin} />
          </div>

          <div className='flex shrink-0'>
            <CardAvatar plugin={plugin} />
          </div>
        </div>

        <div className='flex items-center justify-between mt-auto'>
          <div className='flex items-center gap-2'>
            {plugin.hasConfig
              ? (
                <Chip
                  variant='flat'
                  size='sm'
                  className='h-5 px-2 bg-blue-100/80 border-small border-blue-200/50 text-blue-700'
                >
                  <span className='text-xs'>可配置</span>
                </Chip>
              )
              : (
                <Chip
                  variant='flat'
                  size='sm'
                  className='h-5 px-2 bg-default-100/80 border-small border-default-200/50'
                >
                  <span className='text-xs font-mono'>
                    ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄
                  </span>
                </Chip>
              )}
          </div>

          {plugin.hasConfig && (
            <Button
              isIconOnly
              size='sm'
              variant='light'
              color='primary'
              aria-label='配置插件'
              className='p-1'
              onPress={handleConfigClick}
            >
              <IoSettingsOutline className='text-lg' />
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default PluginCard
