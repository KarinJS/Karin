import { useState, useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'
import { Chip } from '@heroui/chip'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Spinner } from '@heroui/spinner'
import { TriangleAlert } from 'lucide-react'
import axios from 'axios'
import Markdown from '@/components/Markdown'
import { GithubRelease } from '@/types/release'
import { extractUpdateLogs } from '@/lib/version'
import UpdateButtons from './UpdateButtons'

interface UpdateLogModalProps {
  currentVersion: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  npmLatest: string | false
  proxyFn: (url: string) => string
  onUpdateStart: () => void
  onUpdateEnd: () => void
}

export default function UpdateLogModal ({
  currentVersion,
  isOpen,
  onOpenChange,
  npmLatest,
  proxyFn,
  onUpdateStart,
  onUpdateEnd,
}: UpdateLogModalProps) {
  const [isLoadingRelease, setIsLoadingRelease] = useState(false)

  const { data: releaseData, error: releaseError, run: fetchRelease } = useRequest(
    async () => {
      setIsLoadingRelease(true)
      try {
        const proxyFunction = typeof proxyFn === 'function' ? proxyFn : (url: string) => url
        const url = proxyFunction('https://raw.githubusercontent.com/karinjs/repo-status/refs/heads/main/data/releases.json')
        const response = await axios.get<GithubRelease[]>(url)
        return response.data
      } catch (error) {
        console.error('获取更新日志失败:', error)
        throw error
      } finally {
        setIsLoadingRelease(false)
      }
    },
    { manual: true, onError: (error) => console.error('版本检测失败', error) }
  )

  // 当模态框打开时自动获取数据
  useEffect(() => {
    if (isOpen && !releaseData && !isLoadingRelease) {
      fetchRelease()
    }
  }, [isOpen, releaseData, isLoadingRelease, fetchRelease])

  const updateLogs = releaseData ? extractUpdateLogs(releaseData, currentVersion) : []

  const middleVersions = useMemo(() => {
    return updateLogs || []
  }, [updateLogs])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size='4xl'
      className='mx-2 md:mx-0'
      classNames={{
        base: 'sm:max-h-[90vh] max-h-screen',
        wrapper: 'sm:p-4 p-0',
        backdrop: 'bg-black/50',
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent className='relative h-full'>
        <ModalHeader className='border-b p-4 text-base flex-shrink-0'>
          <div className='flex items-center gap-2 md:text-base'>
            新版本
            <span className='text-green-400'>{npmLatest || ''}</span>
            可用
            <span className='text-default-400'>
              (当前版本：{currentVersion})
            </span>
          </div>
        </ModalHeader>

        <ModalBody className='flex-1 overflow-hidden px-2 md:px-6 pb-0 relative'>
          <ScrollShadow hideScrollBar className='h-full pb-20 sm:pb-16'>
            {isLoadingRelease
              ? (
                <div className='flex justify-center items-center h-60'>
                  <Spinner size='lg' color='primary' label='处理中...' />
                </div>
              )
              : (
                <>
                  {middleVersions.map((versionInfo) => (
                    <div
                      key={versionInfo.tag_name}
                      className='p-3 md:p-5 bg-white dark:bg-default-100 border border-default-200 dark:border-default-300 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 md:mb-4'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='flex items-center gap-2'>
                          {(function () {
                            let tagName = '本体'
                            let color: 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary'
                            switch (true) {
                              case versionInfo.tag_name.includes('core'):
                                tagName = '本体'
                                break
                              case versionInfo.tag_name.includes('web'):
                                tagName = 'WEB 界面'
                                color = 'warning'
                                break
                              case versionInfo.tag_name.includes('cli'):
                                tagName = '命令行工具'
                                color = 'secondary'
                                break
                              case versionInfo.tag_name.includes('create'):
                                tagName = '脚手架'
                                color = 'success'
                            }
                            return (
                              <Chip
                                color={color}
                                variant='flat'
                                size='sm'
                                className='text-xs md:text-sm'
                              >
                                {tagName}
                              </Chip>
                            )
                          })()}
                          <span className='text-sm font-mono text-default-600 bg-default-100 px-2 py-1 rounded'>
                            {versionInfo.tag_name}
                          </span>
                        </div>

                        <div className='text-right'>
                          <div className='text-xs text-default-500'>
                            {new Date(versionInfo.published_at).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          {versionInfo.prerelease && (
                            <Chip size='sm' color='warning' variant='flat' className='text-xs mt-1'>
                              预发布
                            </Chip>
                          )}
                        </div>
                      </div>

                      {versionInfo.name && versionInfo.name !== versionInfo.tag_name && (
                        <div className='mb-2'>
                          <h4 className='text-sm md:text-base font-semibold text-default-700'>
                            {versionInfo.name}
                          </h4>
                        </div>
                      )}

                      <div className='flex items-center gap-2 mb-3 text-xs text-default-500'>
                        <span>发布者：</span>
                        <a
                          href={versionInfo.author.html_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1 hover:text-primary'
                        >
                          <img
                            src={versionInfo.author.avatar_url}
                            alt={versionInfo.author.login}
                            className='w-4 h-4 rounded-full'
                          />
                          {versionInfo.author.login}
                        </a>
                      </div>

                      <div className='text-sm md:text-base'>
                        <Markdown
                          content={versionInfo.body}
                          className='prose prose-sm md:prose-base max-w-none prose-headings:text-default-700 prose-p:text-default-600 prose-a:text-primary'
                        />
                      </div>

                      <div className='flex items-center justify-between mt-3 pt-3 border-t border-default-200'>
                        <div className='flex items-center gap-2 text-xs text-default-500'>
                          {versionInfo.assets.length > 0 && (
                            <span>{versionInfo.assets.length} 个附件</span>
                          )}
                        </div>
                        <a
                          href={versionInfo.html_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xs text-primary hover:underline'
                        >
                          查看详情 →
                        </a>
                      </div>
                    </div>
                  ))}
                  {releaseError && (
                    <div className='flex flex-col gap-2 p-3 md:p-4 bg-danger-50 rounded-lg border border-danger-200'>
                      <div className='text-danger font-medium flex items-center gap-2 text-sm md:text-base'>
                        <TriangleAlert className='w-4 h-4 md:w-5 md:h-5' />
                        更新日志请求失败...
                      </div>
                      <div className='text-default-600 text-xs md:text-sm'>
                        <div className='mb-2'>
                          错误详情: {
                            axios.isAxiosError(releaseError)
                              ? `${releaseError.message} (状态码: ${releaseError.response?.status || '未知'})`
                              : releaseError.message || '未知错误'
                          }
                        </div>
                        您可以直接前往
                        <a
                          href='https://github.com/KarinJS/Karin/releases'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary underline ml-1'
                        >
                          GitHub Releases
                        </a>
                        页面查看最新更新内容。
                      </div>
                    </div>
                  )}
                </>
              )}
          </ScrollShadow>

          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t p-4 flex justify-end'>
            <UpdateButtons
              handleCloseModal={() => onOpenChange(false)}
              onUpdateStart={onUpdateStart}
              onUpdateEnd={onUpdateEnd}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
