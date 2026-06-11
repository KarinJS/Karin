import { cron } from './cron'
import { defineConfig } from './defineConfig'

interface DemoConfig {
  cron: string
}

export const componentConfig = defineConfig<DemoConfig>({
  info: {
    id: 'demo',
    name: 'demo',
    author: {
      name: 'shijin',
      avatar: 'https://github.com/sj817.png',
    },
    version: '1.0.0',
    description: 'demo',
  },
  components: () => {
    return [
      cron.create('cron', {
        defaultValue: '* * * * * *',
      }),
    ]
  },
  save: (config) => {
    return {
      success: typeof config.cron === 'string',
      message: '保存成功',
    }
  },
})

export const pageConfig = defineConfig({
  info: {
    id: 'demo-page',
    name: 'demo-page',
  },
  page: {
    url: '/demo-page/',
    title: '自定义配置页',
    description: '使用插件自带页面渲染配置',
  },
})

export default componentConfig
