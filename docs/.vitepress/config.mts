import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/Karin',
  title: 'Karin',
  description: '基于 Kritor 和 noebots 进行开发的nodejs机器人框架',
  themeConfig: {
    siteTitle: '主页',
    nav: [
      { text: '快速开始', link: '/start' },
      { text: '开发文档', link: '/develop/index' },
      { text: 'elements', link: '/develop/elements' },
      { text: '插件索引', link: '/plugins/index' },
    ],
    sidebar: {
      '/event/': [
        {
          text: '事件',
          items: [
            { text: '目录', link: '/event/index' },
            { text: '消息事件', link: '/event/message' }
          ],
        }
      ],
      '/develop/': [
        {
          text: '插件开发',
          items: [
            { text: 'elements', link: '/develop/elements' },
            { text: '#karin', link: '/develop/karin' },
            { text: 'YamlEditor', link: '/develop/YamlEditor' },
            { text: '插件编写', link: '/develop/plugin' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KarinJS/Karin' }
    ],
    outline: {
      label: '页面导航'
    },
    search: {
      provider: 'algolia',
      options: {
        appId: '...',
        apiKey: '...',
        indexName: '...',
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          }
        }
      }
    }
  }
})
