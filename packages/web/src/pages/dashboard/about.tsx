import type React from 'react'
import { useEffect, useState } from 'react'
import { Bot, Code, Github, MessageCircle, Star, GitPullRequest, GitFork, MessageSquare, Users } from 'lucide-react'
import { Button } from '@heroui/button'
import axios from 'axios'
import { useInView } from 'react-intersection-observer'
import CountUp from '@/components/CountUp'
import { Tooltip } from '@heroui/tooltip'

interface RepoStats {
  stars: number
  forks: number
  pullRequests: number
  discussions: number
  contributors: Array<{
    avatar_url: string
    login: string
    html_url: string
  }>
}

const AboutUs: React.FC = () => {
  const [repoStats, setRepoStats] = useState<RepoStats>({
    stars: 0,
    forks: 0,
    pullRequests: 0,
    discussions: 0,
    contributors: [],
  })

  const { ref: statsRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        const [repoData, contributorsData] = await Promise.all([
          axios.get('https://api.github.com/repos/KarinJS/Karin'),
          axios.get('https://api.github.com/repos/KarinJS/Karin/contributors?per_page=10'),
        ])

        setRepoStats({
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          pullRequests: repoData.data.open_issues_count,
          discussions: 0,
          contributors: contributorsData.data,
        })
      } catch (error) {
        console.error('Error fetching repo stats:', error)
      }
    }

    if (inView) {
      fetchRepoStats()
    }
  }, [inView])

  return (
    <div className='min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white'>
      {/* Header Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-8'>
                <h1 className='text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400'>
                  轻量、高效、简洁的
                  <div className='h-2' />
                  <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400'>
                    NodeJS 机器人框架
                  </h2>
                </h1>
                <p className='text-xl text-gray-600 dark:text-gray-300'>
                  让机器人开发变得简单有趣 ✨
                </p>
                <div className='flex flex-wrap gap-4'>
                  <Button
                    as='a'
                    href='https://github.com/KarinJS/Karin'
                    target='_blank'
                    rel='noopener noreferrer'
                    size='lg'
                    variant='ghost'
                    radius='full'
                  >
                    <Github className='h-5 w-5 mr-2' />
                    GitHub
                  </Button>
                  <Button as='a' href='https://docs.karin.fun' color='primary' size='lg' variant='ghost' radius='full'>
                    <Code className='h-5 w-5 mr-2' />
                    文档
                  </Button>
                </div>
              </div>
              <div ref={statsRef} className='grid grid-cols-2 gap-4'>
                {[
                  { icon: <Star className='h-6 w-6' />, label: 'Stars', value: repoStats.stars },
                  { icon: <GitFork className='h-6 w-6' />, label: 'Forks', value: repoStats.forks },
                  { icon: <GitPullRequest className='h-6 w-6' />, label: 'PRs', value: repoStats.pullRequests },
                  { icon: <Users className='h-6 w-6' />, label: 'Contributors', value: repoStats.contributors.length },
                ].map((stat, index) => (
                  <div key={index} className='bg-slate-100 dark:bg-neutral-900 p-4 rounded-lg flex items-center space-x-3'>
                    <div className='text-primary dark:text-primary-400'>{stat.icon}</div>
                    <div>
                      <CountUp
                        from={0}
                        to={stat.value}
                        separator=','
                        direction='up'
                        duration={2}
                        className='text-2xl font-bold'
                      />
                      <div className='text-sm text-gray-600 dark:text-gray-400'>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-slate-100 dark:bg-black rounded-sm'>
        <div className='container mx-auto px-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold mb-6'>核心特性</h2>
                <div className='space-y-8'>
                  {[
                    {
                      icon: <Bot className='h-8 w-8 text-primary dark:text-primary-400' />,
                      title: '简单易用',
                      description: '无需复杂的编程知识，通过直观的界面和丰富的模板，快速构建您的机器人应用。',
                    },
                    {
                      icon: <Code className='h-8 w-8 text-primary dark:text-primary-400' />,
                      title: '高性能',
                      description: '基于现代技术栈构建，确保您的机器人应用运行流畅，响应迅速。',
                    },
                    {
                      icon: <Github className='h-8 w-8 text-primary dark:text-primary-400' />,
                      title: '完全开源',
                      description: '所有代码完全开源，您可以自由查看、修改和贡献，共同打造更好的机器人开发生态。',
                    },
                  ].map((feature, index) => (
                    <div key={index} className='flex space-x-4'>
                      <div className='flex-shrink-0'>{feature.icon}</div>
                      <div>
                        <h3 className='text-xl font-bold mb-2'>{feature.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold'>活跃贡献者</h3>
                <div className='flex flex-wrap gap-2'>
                  {repoStats.contributors.map((contributor, index) => (
                    <a
                      key={index}
                      href={contributor.html_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='block'
                    >
                      <Tooltip content={contributor.login}>
                        <img
                          src={contributor.avatar_url || 'https://avatar.vercel.sh/0'}
                          alt={contributor.login}
                          className='w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 hover:border-primary dark:hover:border-primary-400 transition-colors'
                          title={contributor.login}
                        />
                      </Tooltip>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-6'>
                <h2 className='text-3xl md:text-4xl font-bold'>关于项目</h2>
                <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                  <p>我们的机器人框架是一个始于 2023 年的开源项目，由一群热爱机器人技术的开发者发起。该框架基于 TypeScript（ts）构建，旨在降低机器人开发的门槛。</p>
                  <p>通过提供一套完整的工具链和丰富的文档，我们希望让更多人能够参与到机器人技术的创新中来，无论是教育、研究还是商业应用场景下，都能借助这个框架轻松开展机器人相关的开发工作。</p>
                  <p>我们坚信，开源协作是推动技术进步的最佳方式，也是让机器人技术得以广泛普及的关键因素，而我们的机器人框架正是开源精神的具体实践。</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-slate-100 dark:bg-neutral-900 p-6 rounded-xl'>
                  <MessageCircle className='h-8 w-8 text-primary dark:text-primary-400 mb-4' />
                  <h3 className='text-xl font-bold mb-2'>社区交流</h3>
                  <p className='text-gray-600 dark:text-gray-400 mb-4'>加入我们的用户交流群，与其他开发者分享经验。</p>
                  <div className='space-x-3'>
                    <Button as='a' href='#' size='sm' variant='ghost' color='secondary' radius='full'>
                      Discord
                    </Button>
                    <Button
                      as='a'
                      href='http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=kDN3vwVj8Qozw94TWX69r24vxrWqkgMy&authKey=NxnqHYmo8037jCeDkO9yIFPOdQxkKa4JlxC%2FAV6UNxwGc%2FwKEVoogi44syB3BWuC&noverify=0&group_code=967068507'
                      size='sm'
                      variant='shadow'
                      radius='full'
                      color='primary'
                    >
                      QQ群
                    </Button>
                  </div>
                </div>
                <div className='bg-slate-100 dark:bg-neutral-900 p-6 rounded-xl'>
                  <MessageSquare className='h-8 w-8 text-primary dark:text-primary-400 mb-4' />
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
                  >
                    提交 Issue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 border-t border-gray-200 dark:border-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='mb-4 md:mb-0'>
                <div className='text-2xl font-bold text-primary dark:text-primary-400'>Karin</div>
                <p className='text-gray-600 dark:text-gray-400 mt-1'>让机器人开发变得简单</p>
              </div>
              <div className='flex gap-6'>
                <a
                  href='https://github.com/KarinJS/Karin'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                >
                  <Github className='h-5 w-5' />
                </a>
                <a
                  href='https://docs.karin.fun'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                >
                  文档
                </a>
                <a
                  href='https://github.com/KarinJS/Karin/blob/main/LICENSE'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                >
                  许可证
                </a>
              </div>
            </div>
            <div className='mt-6 text-center text-gray-500 dark:text-gray-500 text-sm'>
              <p>© {new Date().getFullYear()} KarinJS/Karin. 基于 MIT 许可证开源。</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs
