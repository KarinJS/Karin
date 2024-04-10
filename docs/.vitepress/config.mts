import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Karin',
  title: 'Karin',
  description: '基于 Kritor 和 noebots 进行开发的nodejs机器人框架',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '快速开始', link: '/start' },
      { text: '开发文档', link: '/develop/index' }
    ],

    sidebar: [
      {
        text: '导航栏',
        items: [
          { text: '主页', link: '/' },
          { text: '快速开始', link: '/start' },
          { text: '事件', link: '/event/message' },
          { text: '插件编写', link: '/develop/plugin' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KarinJS/Karin' }
    ]
  }
})
