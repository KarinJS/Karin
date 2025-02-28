import { useEffect, useState } from 'react'
import {
  Bot,
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
  Heart,
} from 'lucide-react'
import { Button } from '@heroui/button'
import axios from 'axios'
import { useInView } from 'react-intersection-observer'
import CountUp from '@/components/CountUp'
import { Tooltip } from '@heroui/tooltip'
import { motion } from 'framer-motion'

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

const AboutUs = () => {
  const [repoStats, setRepoStats] = useState<RepoStats>({
    stars: 0,
    forks: 0,
    pullRequests: 0,
    discussions: 0,
    contributors: [],
  })

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: featuresRef, inView: featuresInView } = useInView({
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
    <div className='min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white'>
      {/* Hero Section with Animated Elements */}
      <section className='py-16 md:py-24 overflow-hidden relative'>
        <div className='container mx-auto px-4 relative'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <motion.div
                className='space-y-8'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4'>
                  <Sparkles className='h-4 w-4 mr-2' />
                  开源 NodeJS 机器人框架
                </div>
                <h1 className='text-5xl md:text-6xl font-bold tracking-tight'>
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500'>
                    Karin
                  </span>
                </h1>
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>轻量、高效、简洁</h2>
                <p className='text-xl text-gray-600 dark:text-gray-300'>
                  让机器人开发变得
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
                    size='lg'
                    variant='shadow'
                    radius='full'
                    className='group bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors'
                  >
                    <Github className='h-5 w-5 mr-2 group-hover:rotate-12 transition-transform' />
                    GitHub
                  </Button>
                  <Button
                    as='a'
                    href='https://docs.karin.fun'
                    color='primary'
                    size='lg'
                    variant='shadow'
                    radius='full'
                    className='group'
                  >
                    <Code className='h-5 w-5 mr-2 group-hover:rotate-12 transition-transform' />
                    文档
                  </Button>
                </div>
              </motion.div>

              <motion.div
                ref={statsRef}
                className='grid grid-cols-2 gap-4'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className='bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-primary-500 dark:hover:border-primary-500 transition-all'
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-2'>
                      <Star className='h-8 w-8 text-yellow-500' />
                    </div>
                    <CountUp
                      from={0}
                      to={repoStats.stars}
                      separator=','
                      direction='up'
                      duration={2}
                      className='text-3xl font-bold'
                    />
                    <div className='text-sm text-gray-600 dark:text-gray-400'>Stars</div>
                  </div>
                </motion.div>

                <div className='grid grid-rows-3 gap-4'>
                  {[
                    {
                      icon: <GitFork className='h-5 w-5' />,
                      label: 'Forks',
                      value: repoStats.forks,
                      color: 'text-blue-500',
                    },
                    {
                      icon: <GitPullRequest className='h-5 w-5' />,
                      label: 'PRs',
                      value: repoStats.pullRequests,
                      color: 'text-green-500',
                    },
                    {
                      icon: <Users className='h-5 w-5' />,
                      label: '贡献者',
                      value: repoStats.contributors.length,
                      color: 'text-primary-500',
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className='bg-white dark:bg-black p-4 rounded-lg flex items-center space-x-3 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500'
                      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                      transition={{ duration: 0.2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${stat.color}`}>{stat.icon}</div>
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Animated Cards */}
      <section className='py-16 relative overflow-hidden bg-gray-50 dark:bg-gray-950' ref={featuresRef}>
        <div className='container mx-auto px-8 relative'>
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
              className='grid grid-cols-1 md:grid-cols-3 gap-8'
              variants={container}
              initial='hidden'
              animate={featuresInView ? 'show' : 'hidden'}
            >
              {[
                {
                  icon: <Bot className='h-10 w-10 text-primary-500' />,
                  title: '简单易用',
                  description: '无需复杂的编程知识，通过直观的界面和丰富的模板，快速构建您的机器人应用。',
                },
                {
                  icon: <Zap className='h-10 w-10 text-yellow-500' />,
                  title: '高性能',
                  description: '基于现代技术栈构建，确保您的机器人应用运行流畅，响应迅速。',
                },
                {
                  icon: <Heart className='h-10 w-10 text-red-500' />,
                  title: '完全开源',
                  description: '所有代码完全开源，您可以自由查看、修改和贡献，共同打造更好的机器人开发生态。',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className='bg-white dark:bg-black rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 group'
                  variants={item}
                  whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='h-2 bg-primary-500' />
                  <div className='p-6'>
                    <div className='rounded-full w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-900 mb-6 group-hover:scale-110 transition-transform'>
                      {feature.icon}
                    </div>
                    <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
                    <p className='text-gray-600 dark:text-gray-400'>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contributors Section */}
      <section className='py-16 bg-white dark:bg-black'>
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
              {repoStats.contributors.map((contributor, index) => (
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
                  <Tooltip content={contributor.login}>
                    <div className='relative group'>
                      <div className='absolute -inset-0.5 bg-primary-500 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-300' />
                      <img
                        src={contributor.avatar_url || 'https://avatar.vercel.sh/0'}
                        alt={contributor.login}
                        className='relative w-16 h-16 rounded-full border-2 border-white dark:border-gray-800 group-hover:border-primary-500 transition-colors'
                      />
                    </div>
                  </Tooltip>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Project Section with Animated Text */}
      <section className='py-16 bg-gray-50 dark:bg-gray-950'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className='inline-flex items-center px-3 py-1 rounded-full bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4'>
                  <Heart className='h-4 w-4 mr-2' />
                  我们的故事
                </div>
                <h2 className='text-3xl md:text-4xl font-bold'>关于项目</h2>
                <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                  <p>
                    我们的机器人框架是一个始于 2023 年的开源项目，由一群热爱机器人技术的开发者发起。该框架基于
                    TypeScript（ts）构建，旨在降低机器人开发的门槛。
                  </p>
                  <p>
                    通过提供一套完整的工具链和丰富的文档，我们希望让更多人能够参与到机器人技术的创新中来，无论是教育、研究还是商业应用场景下，都能借助这个框架轻松开展机器人相关的开发工作。
                  </p>
                  <p>
                    我们坚信，开源协作是推动技术进步的最佳方式，也是让机器人技术得以广泛普及的关键因素，而我们的机器人框架正是开源精神的具体实践。
                  </p>
                </div>
              </motion.div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <motion.div
                  className='bg-white dark:bg-black p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className='h-8 w-8 text-primary-500 mb-4' />
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
                </motion.div>

                <motion.div
                  className='bg-white dark:bg-black p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
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
                  >
                    提交 Issue
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Animated Elements */}
      <footer className='py-12 border-t border-gray-200 dark:border-gray-800'>
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
                <p className='text-gray-600 dark:text-gray-400 mt-2'>让机器人开发变得简单有趣</p>
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
                  href='https://docs.karin.fun'
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
