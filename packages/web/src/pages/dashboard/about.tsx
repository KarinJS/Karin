'use client'

import { useEffect, useState } from 'react'
import {
  Code,
  Github,
  MessageCircle,
  Star,
  GitPullRequest,
  GitFork,
  MessageSquare,
  Users,
  Sparkles,
  Zap,
  Target,
  Code2,
  Puzzle,
  LayoutDashboard,
  GitBranch,
  GitCommit,
  Tag,
  Eye,
  MessageSquareText,
  Clock,
  BookOpen,
  FileCode2,
  GitMerge,
  GitPullRequestClosed,
} from 'lucide-react'
import { Button } from '@heroui/button'
import axios from 'axios'
import { useInView } from 'react-intersection-observer'
import CountUp from '@/components/CountUp'
import { Tooltip } from '@heroui/tooltip'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Skeleton } from '@heroui/skeleton'
import { testGithub } from '@/lib/test-url'
import ShinyText from '@/components/ShinyText'

interface RepoStats {
  stars: number
  forks: number
  openIssues: number
  closedIssues: number
  watchers: number
  contributors: Array<{
    avatar_url: string
    login: string
    html_url: string
  }>
  lastCommit: Date
  latestRelease: {
    name: string
    tag_name: string
    published_at: string
  }
  license: string
  discussions: number
  description: string
  language: string
  openPullRequests: number
  mergedPullRequests: number
  closedPullRequests: number
}

/**
 * 计算时间差
 * @param dateString ISO格式的时间字符串
 * @returns 格式化的时间差
 */
const timeAgo = (dateString: string): string => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

const AboutUs = () => {
  const [repoStats, setRepoStats] = useState<RepoStats>({
    stars: 0,
    forks: 0,
    openIssues: 0,
    closedIssues: 0,
    watchers: 0,
    contributors: [],
    lastCommit: new Date(),
    latestRelease: {
      name: 'N/A',
      tag_name: 'N/A',
      published_at: new Date().toISOString(),
    },
    license: 'MIT',
    discussions: 0,
    description: '',
    language: 'TypeScript',
    openPullRequests: 0,
    mergedPullRequests: 0,
    closedPullRequests: 0,
  })

  const [hasRepoData, sethasRepoData] = useState<boolean>(false)
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('sm')
  const [iconSize, setIconSize] = useState<number>(4)
  const [textSize, setTextSize] = useState<string>('text-sm')

  // 修改监听屏幕尺寸变化的函数
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setButtonSize('sm')
        setIconSize(4)
        setTextSize('text-xs')
      } else {
        setButtonSize('lg')
        setIconSize(5)
        setTextSize('text-sm')
      }
    }

    // 初始化
    handleResize()
    // 添加监听
    window.addEventListener('resize', handleResize)
    // 清理
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        /** Github RAW代理 */
        const proxyFn = await testGithub()

        const [
          repoData,
          commitsData,
          contributorsData,
          discussionsData,
          latestReleaseData,
          licenseData,
          watchData,
          issuesOpenData,
          issuesClosedData,
          pullsOpenData,
          pullsClosedData,
        ] = await Promise.all([
          /** 获取仓库状态 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/Karin.json')),
          /** 提交信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/commits.json')),
          /** 贡献者信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/contributors.json')),
          /** 仓库讨论信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/discussions.json')),
          /** 最新版本 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/releases.json')),
          /** 许可证信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/license.json')),
          /** 关注 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/subscribers.json')),
          /** issues打开信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/issue_open.json')),
          /** issues关闭信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/issue_closed.json')),
          /** pr打开信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/pr_open.json')),
          /** pr关闭信息 */
          axios.get(proxyFn('https://raw.githubusercontent.com/KarinJS/repo-status/main/data/pr_closed.json')),
        ])

        const openIssues = issuesOpenData.data.length
        const closedIssues = issuesClosedData.data.length

        const openPullRequests = pullsOpenData.data.length
        const mergedPullRequests = pullsClosedData.data.length
        const closedPullRequests = pullsClosedData.data.length

        setRepoStats({
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          openIssues,
          closedIssues,
          watchers: watchData.data.length,
          contributors: contributorsData.data,
          lastCommit: new Date(commitsData.data[0].commit.author.date),
          latestRelease: {
            name: latestReleaseData.data[0]?.name || 'Initial Release',
            tag_name: latestReleaseData.data[0]?.tag_name || 'v0.1.0',
            published_at: latestReleaseData.data[0]?.published_at || new Date().toISOString(),
          },
          license: licenseData.data.license?.name || 'MIT',
          discussions: discussionsData.data.length,
          description: repoData.data.description || '开源 NodeJS 机器人框架，让机器人开发变得简单有趣',
          language: repoData.data.language || 'TypeScript',
          openPullRequests,
          mergedPullRequests,
          closedPullRequests,
        })
        sethasRepoData(true)
      } catch (error) {
        sethasRepoData(false)
        toast.error('仓库统计数据获取失败 ~')
      }
    }

    if (statsInView) {
      fetchRepoStats()
    }
  }, [statsInView])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className='min-h-screen'>
      {/* 首屏 */}
      <section className='py-14 overflow-hidden relative'>
        <div className='container mx-auto px-8 relative'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <motion.div
                className='space-y-8'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p>
                  <span className='text-default-400 text-xl md:text-2xl lg:text-3xl font-normal'>Karin</span>{' '}
                  <span className='text-4xl md:text-5xl lg:text-6xl text-default-800 font-bold'>是什么？</span>
                </p>
                <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4'>
                  <Sparkles className='h-4 w-4 mr-2' />
                  开源聊天平台机器人框架
                </div>
                <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                  <div className='items-center'>
                    Karin 是一个始于 2023 年的开源聊天平台机器人框架，由一群热爱即时通讯技术的开发者发起。该框架基于
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300 align-middle translate-y-[-1px]'>
                      Node.js
                    </span>
                    开发，使用
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 align-middle translate-y-[-1px]'>
                      TypeScript
                    </span>+
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 align-middle translate-y-[-1px]'>
                      React
                    </span>
                    构建，旨在简化各大聊天平台机器人的开发流程。
                  </div>
                  <p>
                    通过提供统一的 API 接口和丰富的插件生态，我们希望让开发者能够轻松接入 QQ 等多种聊天平台，快速构建功能丰富的聊天机器人，为社区、群组和个人用户提供智能化的服务体验。
                  </p>
                  <div className='items-center'>
                    Karin 的一大亮点是自带前端相关页面，插件开发者可以更加得心应手地进行开发。技术栈方面，前端采用
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 align-middle translate-y-[-1px]'>
                      Vite
                    </span>+
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 align-middle translate-y-[-1px]'>
                      React
                    </span>+
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 align-middle translate-y-[-1px]'>
                      TailwindCSS
                    </span>
                    构建，后端使用
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 align-middle translate-y-[-1px]'>
                      TypeScript
                    </span>
                    开发并且完全兼容
                    <span className='inline-flex items-center px-2.5 py-0.5 mx-1.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 align-middle translate-y-[-1px]'>
                      Bun
                    </span>
                    运行时，为开发者提供了现代、高效的开发体验。
                  </div>
                </div>
                <p className='text-xl text-gray-600 dark:text-gray-300'>
                  让插件开发变得
                  <span className='relative inline-block'>
                    <span className='relative z-10'>简单有趣</span>
                    <span className='absolute bottom-1 left-0 w-full h-3 bg-primary-200 dark:bg-primary-800/30 -z-0 rounded-sm' />
                  </span>{' '}
                  ✨
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Button
                    as='a'
                    href='https://github.com/KarinJS/Karin'
                    target='_blank'
                    rel='noopener noreferrer'
                    size={buttonSize}
                    variant='shadow'
                    radius='full'
                    className={`group bg-white dark:bg-black border border-default-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors ${textSize}`}
                  >
                    <Github className={`h-${iconSize} w-${iconSize} mr-2 group-hover:rotate-12 transition-transform`} />
                    GitHub
                  </Button>
                  <Button
                    as='a'
                    href='https://karinjs.com'
                    color='primary'
                    size={buttonSize}
                    variant='shadow'
                    radius='full'
                    className={`group ${textSize}`}
                  >
                    <Code className={`h-${iconSize} w-${iconSize} mr-2 group-hover:rotate-12 transition-transform`} />
                    文档
                  </Button>
                </div>
              </motion.div>

              <motion.div
                ref={statsRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* GitHub-style repository card */}
                <div className='border dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-sm'>
                  {/* Header */}
                  <div className='border-b dark:border-gray-800 p-4'>
                    <div className='flex items-center'>
                      <div className='min-w-10 min-h-10 rounded-md bg-primary-100 flex items-center justify-center text-primary-600 mr-3'>
                        <Code2 className='w-6 h-6' />
                      </div>
                      <div>
                        <h3 className='text-xl font-semibold flex items-center'>
                          <span>KarinJS / </span>
                          <span className='font-bold text-primary-500'>Karin</span>
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {hasRepoData ? repoStats.description : '开源 NodeJS 机器人框架，让插件开发变得简单有趣'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='p-4'>
                    <div className='flex flex-wrap gap-4'>
                      <div className='flex items-center'>
                        <div className='flex items-center text-gray-700 dark:text-gray-300'>
                          <Star className='w-4 h-4 mr-1' fill='currentColor' />
                          <span className='font-semibold mr-1'>
                            {hasRepoData
                              ? (
                                <CountUp from={0} to={repoStats.stars} separator=',' duration={2} />
                              )
                              : (
                                <Skeleton className='w-8 h-4' />
                              )}
                          </span>
                          <span className='text-gray-600 dark:text-gray-400 text-sm'>stars</span>
                        </div>
                      </div>

                      <div className='flex items-center'>
                        <div className='flex items-center text-gray-700 dark:text-gray-300'>
                          <GitFork className='w-4 h-4 mr-1' />
                          <span className='font-semibold mr-1'>
                            {hasRepoData
                              ? (
                                <CountUp from={0} to={repoStats.forks} separator=',' duration={2} />
                              )
                              : (
                                <Skeleton className='w-8 h-4' />
                              )}
                          </span>
                          <span className='text-gray-600 dark:text-gray-400 text-sm'>forks</span>
                        </div>
                      </div>

                      <div className='flex items-center'>
                        <div className='flex items-center text-gray-700 dark:text-gray-300'>
                          <Eye className='w-4 h-4 mr-1' />
                          <span className='font-semibold mr-1'>
                            {hasRepoData
                              ? (
                                <CountUp from={0} to={repoStats.watchers} separator=',' duration={2} />
                              )
                              : (
                                <Skeleton className='w-8 h-4' />
                              )}
                          </span>
                          <span className='text-gray-600 dark:text-gray-400 text-sm'>watchers</span>
                        </div>
                      </div>

                      <div className='flex items-center'>
                        <div className='flex items-center text-gray-700 dark:text-gray-300'>
                          <GitPullRequest className='w-4 h-4 mr-1' />
                          <span className='font-semibold mr-1'>
                            {hasRepoData
                              ? (
                                <CountUp from={0} to={repoStats.openIssues} separator=',' duration={2} />
                              )
                              : (
                                <Skeleton className='w-8 h-4' />
                              )}
                          </span>
                          <span className='text-gray-600 dark:text-gray-400 text-sm'>open issues</span>
                        </div>
                      </div>

                      {hasRepoData && repoStats.discussions > 0 && (
                        <div className='flex items-center'>
                          <div className='flex items-center text-gray-700 dark:text-gray-300'>
                            <MessageSquareText className='w-4 h-4 mr-1' />
                            <span className='font-semibold mr-1'>
                              <CountUp from={0} to={repoStats.discussions} separator=',' duration={2} />
                            </span>
                            <span className='text-gray-600 dark:text-gray-400 text-sm'>discussions</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional stats */}
                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='border dark:border-gray-800 rounded-md p-3'>
                        <div className='text-sm font-medium mb-2'>Issues</div>
                        <div className='flex flex-col xs:flex-row items-start xs:items-center xs:justify-between space-y-2 xs:space-y-0'>
                          <div className='flex items-center text-sm'>
                            <GitPullRequestClosed className='w-4 h-4 mr-2 text-green-500 flex-shrink-0' />
                            <span className='truncate'>
                              Closed: {hasRepoData ? <CountUp from={0} to={repoStats.closedIssues} separator=',' duration={2} /> : <Skeleton className='w-8 h-4' />}
                            </span>
                          </div>
                          <div className='flex items-center text-sm'>
                            <GitPullRequest className='w-4 h-4 mr-2 text-red-500 flex-shrink-0' />
                            <span className='truncate'>
                              Open: {hasRepoData ? <CountUp from={0} to={repoStats.openIssues} separator=',' duration={2} /> : <Skeleton className='w-8 h-4' />}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='border dark:border-gray-800 rounded-md p-3'>
                        <div className='text-sm font-medium mb-2'>Pull Requests</div>
                        <div className='flex flex-col xs:flex-row items-start xs:items-center xs:justify-between space-y-2 xs:space-y-0'>
                          <div className='flex items-center text-sm'>
                            <GitMerge className='w-4 h-4 mr-2 text-purple-500 flex-shrink-0' />
                            <span className='truncate'>
                              Merged: {hasRepoData ? <CountUp from={0} to={repoStats.mergedPullRequests} separator=',' duration={2} /> : <Skeleton className='w-8 h-4' />}
                            </span>
                          </div>
                          <div className='flex items-center text-sm'>
                            <GitPullRequest className='w-4 h-4 mr-2 text-blue-500 flex-shrink-0' />
                            <span className='truncate'>
                              Open: {hasRepoData ? <CountUp from={0} to={repoStats.openPullRequests} separator=',' duration={2} /> : <Skeleton className='w-8 h-4' />}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GitHub-style release section */}
                    <div className='mt-4 border dark:border-gray-800 rounded-md overflow-hidden'>
                      <div className='bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b dark:border-gray-800 flex items-center justify-between'>
                        <div className='flex items-center'>
                          <Tag className='w-4 h-4 mr-2 text-gray-600 dark:text-gray-400' />
                          <span className='text-sm font-medium'>Releases</span>
                        </div>
                      </div>

                      <div className='p-3'>
                        {hasRepoData
                          ? (
                            <div className='flex items-start'>
                              <div className='flex-shrink-0 mt-1'>
                                <Tag className='w-5 h-5 text-green-600 dark:text-green-400' />
                              </div>
                              <div className='ml-2'>
                                <div className='flex items-center'>
                                  <a
                                    href={`https://github.com/KarinJS/Karin/releases/tag/${repoStats.latestRelease.tag_name}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary-500 font-semibold hover:underline'
                                  >
                                    {repoStats.latestRelease.name || repoStats.latestRelease.tag_name}
                                  </a>
                                  <span className='ml-2 text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full'>
                                    Latest
                                  </span>
                                </div>
                                <div className='flex items-center mt-1 text-xs text-gray-600 dark:text-gray-400'>
                                  <span className='font-medium'>{repoStats.latestRelease.tag_name}</span>
                                  <span className='mx-1'>•</span>
                                  <Clock className='w-3 h-3 mr-1' />
                                  <span>{timeAgo(repoStats.latestRelease.published_at)}</span>
                                </div>
                              </div>
                            </div>
                          )
                          : (
                            <div className='space-y-2'>
                              <Skeleton className='w-full h-5' />
                              <Skeleton className='w-2/3 h-4' />
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Additional GitHub-style sections */}
                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='border dark:border-gray-800 rounded-md p-3'>
                        <div className='flex items-center text-sm font-medium mb-2'>
                          <BookOpen className='w-4 h-4 mr-2 text-gray-600 dark:text-gray-400' />
                          <span>About</span>
                        </div>
                        <div className='text-xs text-gray-600 dark:text-gray-400 space-y-2'>
                          <div className='flex items-center'>
                            <FileCode2 className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
                            <span className='truncate'>{hasRepoData ? repoStats.language : 'TypeScript'}</span>
                          </div>
                          <div className='flex items-center'>
                            <GitCommit className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
                            <span className='truncate'>
                              Last commit: {hasRepoData ? repoStats.lastCommit.toISOString().split('T')[0] : 'N/A'}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <Users className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
                            <span className='truncate'>
                              {hasRepoData ? repoStats.contributors.length : '?'} contributors
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='border dark:border-gray-800 rounded-md p-3'>
                        <div className='flex items-center text-sm font-medium mb-2'>
                          <GitBranch className='w-4 h-4 mr-2 text-gray-600 dark:text-gray-400' />
                          <span>Repository</span>
                        </div>
                        <div className='space-y-2'>
                          <Button
                            as='a'
                            href='https://github.com/KarinJS/Karin'
                            target='_blank'
                            rel='noopener noreferrer'
                            size='sm'
                            variant='flat'
                            radius='full'
                            className='w-full text-xs h-8'
                          >
                            <Github className='w-3.5 h-3.5 mr-1.5' />
                            <ShinyText text='View on GitHub' disabled={false} speed={4} />
                          </Button>
                          <Button
                            as='a'
                            href='https://github.com/KarinJS/Karin/stargazers'
                            target='_blank'
                            rel='noopener noreferrer'
                            size='sm'
                            variant='flat'
                            radius='full'
                            className='w-full text-xs h-8'
                          >
                            <Star className='w-3.5 h-3.5 mr-1.5' />
                            <ShinyText text='Star' disabled={false} speed={4} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center px-2 py-0.5 mx-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300'>
                        Node.js
                      </span>
                      <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'>
                        TypeScript
                      </span>
                      <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'>
                        React
                      </span>
                      <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'>
                        {hasRepoData ? repoStats.license : 'MIT'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能介绍 - 移动端友好的卡片布局 */}
      <section className='py-16 relative overflow-hidden' ref={featuresRef}>
        <div className='container mx-auto px-4 relative'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4'>
                <Zap className='h-4 w-4 mr-2' />
                超能力加持
              </div>
              <h2 className='text-3xl md:text-4xl font-bold'>核心特性</h2>
              <div className='h-1 w-20 bg-primary-500 mx-auto mt-4 rounded-full' />
            </motion.div>

            <motion.div
              className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'
              variants={container}
              initial='hidden'
              animate={featuresInView ? 'show' : 'hidden'}
            >
              {[
                {
                  icon: <Zap className='h-6 w-6 text-yellow-500' />,
                  title: '🚀 轻量 · 高效',
                  description: '极简设计，资源占用少',
                },
                {
                  icon: <Target className='h-6 w-6 text-green-500' />,
                  title: '🎯 简单 · 强大',
                  description: '5分钟即可上手开发',
                },
                {
                  icon: <Code2 className='h-6 w-6 text-blue-500' />,
                  title: '💪 TypeScript',
                  description: '完善的类型支持',
                },
                {
                  icon: <Puzzle className='h-6 w-6 text-purple-500' />,
                  title: '🎨 模块化',
                  description: '插件配置简单易用',
                },
                {
                  icon: <LayoutDashboard className='h-6 w-6 text-indigo-500' />,
                  title: '🔧 可视化',
                  description: 'Web 管理界面',
                },
                {
                  icon: <GitBranch className='h-6 w-6 text-pink-500' />,
                  title: '🌟 持续进化',
                  description: '欢迎参与贡献',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className='bg-default-100/50 rounded-lg overflow-hidden shadow-sm border border-default-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 group'
                  variants={item}
                  whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='p-6'>
                    <div className='rounded-full w-10 h-10 flex items-center justify-center bg-default-100 mb-3 group-hover:scale-110 transition-transform'>
                      {feature.icon}
                    </div>
                    <h3 className='text-base font-bold mb-1'>{feature.title}</h3>
                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 添加查看更多功能特性的按钮 */}
            <div className='mt-8 text-center'>
              <Button
                as='a'
                href='https://karinjs.com/changelog/'
                color='primary'
                variant='flat'
                radius='full'
                className='group'
              >
                查看更多特性
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 开发者列表 */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              className='text-center mb-12'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4'>
                <Users className='h-4 w-4 mr-2' />
                社区力量
              </div>
              <h2 className='text-3xl md:text-4xl font-bold'>活跃贡献者</h2>
              <div className='h-1 w-20 bg-primary-500 mx-auto mt-4 rounded-full' />
            </motion.div>

            <motion.div
              className='flex flex-wrap justify-center gap-4'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
              viewport={{ once: true }}
            >
              {hasRepoData
                ? repoStats.contributors.map((contributor, index) => (
                  <motion.a
                    key={index}
                    href={contributor.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block'
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Tooltip content={contributor.login} offset={18}>
                      <div className='relative group'>
                        <div className='absolute -inset-0.5 bg-primary-500 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-300' />
                        <img
                          src={contributor.avatar_url || 'https://avatar.vercel.sh/0'}
                          alt={contributor.login}
                          className='relative w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 group-hover:border-primary-500 transition-colors'
                        />
                      </div>
                    </Tooltip>
                  </motion.a>
                ))
                : Array.from({ length: 10 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Skeleton className='w-12 h-12 rounded-full' />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 关于 Karin */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='items-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <motion.div
                  className='bg-default-100/50 p-6 rounded-xl shadow-sm hover:shadow-lg border border-default-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500'
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <MessageCircle className='h-8 w-8 text-primary-500 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>社区交流</h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-4'>加入我们的用户交流群，与其他开发者分享经验。</p>
                  <div className='gap-2 grid grid-cols-2'>
                    <Button
                      as='a'
                      href='https://discord.gg/nT467eb3'
                      size='sm'
                      variant='shadow'
                      color='secondary'
                      radius='full'
                    >
                      Discord
                    </Button>
                    <Button
                      as='a'
                      href='https://qm.qq.com/q/SgP7WaLTag'
                      size='sm'
                      variant='shadow'
                      radius='full'
                      color='primary'
                    >
                      QQ群
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className='bg-default-100/50 p-6 rounded-xl shadow-sm hover:shadow-lg border border-default-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500'
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <MessageSquare className='h-8 w-8 text-primary-500 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>问题反馈</h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-4'>发现问题或有建议？欢迎提交 Issue。</p>
                  <Button
                    as='a'
                    href='https://github.com/KarinJS/Karin/issues'
                    target='_blank'
                    rel='noopener noreferrer'
                    size='sm'
                    variant='shadow'
                    radius='full'
                    color='primary'
                    fullWidth
                  >
                    提交 Issue
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className='py-12 border-t border-default-200 dark:border-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <motion.div
                className='mb-8 md:mb-0 text-center md:text-left'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className='text-3xl font-bold text-primary-600 dark:text-primary-500'>Karin</div>
                <p className='text-gray-600 dark:text-gray-400 mt-2'>让插件开发变得简单有趣</p>
              </motion.div>

              <motion.div
                className='flex flex-wrap justify-center gap-6'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.a
                  href='https://github.com/KarinJS/Karin'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className='h-6 w-6' />
                </motion.a>
                <motion.a
                  href='https://karinjs.com'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  文档
                </motion.a>
                <motion.a
                  href='https://github.com/KarinJS/Karin/blob/main/LICENSE'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors'
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  许可证
                </motion.a>
              </motion.div>
            </div>

            <motion.div
              className='mt-8 text-center text-gray-500 dark:text-gray-500 text-sm'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p>© {new Date().getFullYear()} KarinJS/Karin. 基于 MIT 许可证开源。</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs
