import { Link } from '@heroui/link'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'
import { Tooltip } from '@heroui/tooltip'
import { Card, CardBody } from '@heroui/card'
import { FaCheckCircle } from 'react-icons/fa'

import type { FC } from 'react'
import type { FrontendInstalledPluginListResponse } from 'node-karin'

/**
 * 已安装图标组件
 * @returns 返回已安装图标组件
 */
const InstalledIcon: FC = () => {
  return (
    <Tooltip content='已安装'>
      <div className='flex items-center justify-center'>
        <FaCheckCircle className='text-success text-sm' />
      </div>
    </Tooltip>
  )
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
          {plugin.name}
        </Link>
      </Tooltip>
    )
  }

  return (
    <span className='text-sm font-medium text-default-900 truncate'>{plugin.name}</span>
  )
}

/**
 * 插件描述组件
 * @param plugin - 插件信息
 * @returns 返回插件描述组件
 */
const PluginDescription: FC<{ plugin: FrontendInstalledPluginListResponse }> = ({ plugin }) => {
  const description = plugin.description || '暂无描述'

  return (
    <p className='text-xs text-default-500 line-clamp-2 break-words'>
      {description}
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
          {plugin.author.home && <p className='text-xs text-default-400'>点击访问主页</p>}
        </div>
      }
    >
      {plugin.author.home
        ? (
          <Link href={plugin.author.home} isExternal>
            <Avatar
              isBordered
              size='sm'
              src={plugin.author.avatar || `https://avatar.vercel.sh/${plugin.author.name}`}
              className='bg-default-100 border-white dark:border-default-800'
            />
          </Link>
        )
        : (
          <Avatar
            isBordered
            size='sm'
            src={plugin.author.avatar || `https://avatar.vercel.sh/${plugin.author.name}`}
            className='bg-default-100 border-white dark:border-default-800'
          />
        )}
    </Tooltip>
  )
}

/**
 * 简洁版已安装插件卡片组件
 * @param plugin - 插件信息
 * @returns 返回插件卡片组件
 */
const InstalledPluginCard: FC<{
  plugin: FrontendInstalledPluginListResponse
}> = ({ plugin }) => {
  return (
    <Card
      className='w-full flex flex-col overflow-hidden bg-default-50/10 rounded-xl border border-default-200 transition-all duration-300 hover:border-primary-500 hover:shadow-sm'
      radius='sm'
    >
      <CardBody className='p-4'>
        <div className='flex items-start justify-between gap-3 mb-2'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5'>
              <InstalledIcon />
              <PluginName plugin={plugin} />
            </div>
            <PluginDescription plugin={plugin} />
          </div>

          <div className='flex shrink-0'>
            <CardAvatar plugin={plugin} />
          </div>
        </div>

        <div className='flex items-center mt-auto'>
          <Chip
            variant='flat'
            size='sm'
            className='h-5 px-2 bg-default-100/80 border-small border-default-200/50'
          >
            <span className='text-xs font-mono'>
              {plugin.type}
            </span>
          </Chip>
        </div>
      </CardBody>
    </Card>
  )
}

export default InstalledPluginCard
