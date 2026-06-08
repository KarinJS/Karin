import { Button } from '@heroui/button'
import { Card } from '@heroui/card'

import type { GetConfigResponse, WebConfigPage } from 'node-karin'

interface PluginWebConfigPageProps {
  page: WebConfigPage
  info: GetConfigResponse['info']
}

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url)

/**
 * 插件自定义配置页面
 * @param props 页面属性
 */
export const PluginWebConfigPage = ({ page, info }: PluginWebConfigPageProps) => {
  const title = page.title || info.name || info.id || '插件配置'
  const description = page.description || info.description || '插件提供的自定义配置页面'
  const external = isExternalUrl(page.url)

  return (
    <div className='flex flex-col gap-2 sm:gap-3 h-full py-2 sm:py-4'>
      <Card shadow='sm' className='glass-effect shrink-0 border border-default-200'>
        <div className='flex items-center justify-between gap-2 p-2.5 sm:gap-3 sm:p-4'>
          <div className='min-w-0'>
            <h2 className='text-sm sm:text-base font-semibold text-default-900 truncate'>
              {title}
            </h2>
            <p className='mt-0.5 sm:mt-1 text-xs text-default-500 line-clamp-1 sm:line-clamp-2'>
              {description}
            </p>
            {external && (
              <p className='mt-0.5 sm:mt-1 text-xs text-warning-600 dark:text-warning-400'>
                外部配置页面
              </p>
            )}
          </div>
          <Button
            as='a'
            href={page.url}
            target='_blank'
            rel='noopener noreferrer'
            size='sm'
            color='primary'
            variant='flat'
            className='shrink-0'
          >
            新窗口打开
          </Button>
        </div>
      </Card>
      <div className='flex-1 min-h-0 overflow-hidden rounded-3xl border border-default-200 bg-background'>
        <iframe
          src={page.url}
          title={title}
          className='h-full w-full border-0 bg-background'
          referrerPolicy={external ? 'strict-origin-when-cross-origin' : 'same-origin'}
        />
      </div>
    </div>
  )
}
