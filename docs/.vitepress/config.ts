import { defineConfig } from 'vitepress'
// 时间线
import timeline from 'vitepress-markdown-timeline'
// 任务列表
import taskLists from "markdown-it-task-lists"
// mathjax3公式支持
import mathjax3 from 'markdown-it-mathjax3'
// 页脚
import footnote_plugin from 'markdown-it-footnote'
// 双向链接
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
// 行内链接预览
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
// 基于git的页面历史
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite'
// 页面属性
import {
  PageProperties,
  PagePropertiesMarkdownSection
} from '@nolebase/vitepress-plugin-page-properties/vite'

export default defineConfig({
  lang: 'zh-CN',
  base: '/Karin',
  title: 'karin',
  description: '基于 Kritor 进行开发的nodejs机器人框架',
  markdown: {
    math: true,
    // 全局代码块行号显示
    lineNumbers: true,
    image: {
      // 开启图片懒加载
      lazyLoading: true,
    },
    config: (md) => {
      // 时间线
      md.use(timeline)
      // 任务列表
      md.use(taskLists)
      // 公式
      md.use(mathjax3)
      // 脚注
      md.use(footnote_plugin)
      // 双向链接
      md.use(BiDirectionalLinks())
      // 行内链接预览
      md.use(InlineLinkPreviewElementTransform)
    },
  },
  vite: {
    plugins: [
      GitChangelog({
        // 要获取git日志的仓库
        repoURL: () => 'https://github.com/KarinJS/Karin',
      }),
      GitChangelogMarkdownSection({
        sections: {
          // 禁用页面历史
          disableChangelog: false,
          // 禁用贡献者
          disableContributors: false,
        },
      }),
      // 页面属性
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: [
          'toc.md',
          'index.md',
        ],
      }),
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  },
  // 移除地址的.html
  cleanUrls: true,
  // 显示最后更新时间
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/Karin/logo.png' }],
  ],
  themeConfig: {
    siteTitle: 'Karin主页',
    logo: {
      src: '/logo.png',
    },
    // 深浅模式文字翻译
    darkModeSwitchLabel: '深浅模式',
    editLink: {
      pattern: 'https://github.com/KarinJS/Karin/edit/docs/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    outline: {
      level: [2, 4],
      label: '页面导航'
    },
    nav: [
      {
        text: '快速开始',
        items: [
          { text: '总目录', link: '/start/index' },
          { text: '快速开始', link: '/start/start' },
          { text: '渲染器', link: '/start/render' }
        ]
      },
      {
        text: '事件',
        items: [
          { text: '目录', link: '/event/index' },
          { text: '消息事件', link: '/event/message' },
          { text: '通知事件', link: '/event/notice' },
          { text: '请求事件', link: '/event/request' }
        ]
      },
      {
        text: '开发指南',
        items: [
          { text: '目录', link: '/plugins/index' },
          { text: '开发规范', link: '/plugins/standard' },
          { text: 'elements', link: '/plugins/elements' },
          { text: '插件示例', link: '/plugins/demo' },
          { text: '插件包示例', link: '/plugins/package' },
          { text: '插件列表', link: '/plugins/list' }
        ]
      },
      {
        text: '开发工具',
        items: [
          { text: '目录', link: '/utils/index' },
          { text: 'karin', link: '/utils/karin' },
          { text: 'segment', link: '/utils/segment' },
          { text: 'redis', link: '/utils/redis' },
          { text: 'update', link: '/utils/update' },
          { text: 'YamlEditor', link: '/utils/YamlEditor' },
          { text: 'Renderer', link: '/utils/Renderer' }
        ]
      },
      {
        text: 'Api',
        items: [
          { text: '目录', link: '/api/index' },
          { text: '标准Api', link: '/api/standard' },
          { text: '联系人相关', link: '/api/contact' },
          { text: '消息相关', link: '/api/message' }
        ]
      },
      { text: '插件索引', link: '/plugins/index' },
    ],
    sidebar: {
      '/start/': [
        {
          text: '快速开始',
          items: [
            { text: '目录', link: '/start/index' },
            { text: '框架', link: '/start/start' },
            { text: '渲染器', link: '/start/render' }
          ],
        }
      ],
      '/event/': [
        {
          text: '事件',
          items: [
            { text: '目录', link: '/event/index' },
            { text: '消息事件', link: '/event/message' }
          ],
        }
      ],
      '/plugins/': [
        {
          text: '插件开发',
          items: [
            { text: '目录', link: '/plugins/index' },
            { text: '开发规范', link: '/plugins/standard' },
            { text: 'elements', link: '/plugins/elements' },
            { text: '插件示例', link: '/plugins/demo' },
            { text: '插件包示例', link: '/plugins/package' },
            { text: '插件列表', link: '/plugins/list' }
          ]
        }
      ],
      '/utils/': [
        {
          text: '开发工具',
          items: [
            { text: 'karin', link: '/utils/karin' },
            { text: 'segment', link: '/utils/segment' },
            { text: 'logger', link: '/utils/logger' },
            { text: 'common', link: '/utils/common' },
            { text: 'redis', link: '/utils/redis' },
            { text: 'update', link: '/utils/update' },
            { text: 'YamlEditor', link: '/utils/YamlEditor' },
            { text: 'Renderer', link: '/utils/Renderer' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Api',
          items: [
            { text: '目录', link: '/api/index' },
            { text: '标准Api', link: '/api/standard' },
            { text: '联系人相关', link: '/api/contact' },
            { text: '消息相关', link: '/api/message' }
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KarinJS/Karin' },
      {
        icon: {
          svg: '<svg t="1718335878865" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1729" width="200" height="200"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.296 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84h-240.224a25.28 25.28 0 0 1-25.28-25.28v-240.192a75.84 75.84 0 0 1 75.84-75.84h353.92a25.28 25.28 0 0 0 25.28-25.28l0.064-63.2a25.312 25.312 0 0 0-25.28-25.312H417.184a189.632 189.632 0 0 0-189.632 189.6v353.952c0 13.952 11.328 25.28 25.28 25.28h372.928a170.656 170.656 0 0 0 170.656-170.656v-145.376a25.28 25.28 0 0 0-25.28-25.28z" p-id="1730"></path></svg>',
        },
        link: 'https://gitee.com/KarinJS/Karin',
      }
    ],
    footer: {
      message: "Released under the <a href='https://github.com/KarinJS/Karin/blob/dev/LICENSE'>GPL-3.0 License</a>",
      copyright: "Copyright © 2024 <a href='https://github.com/KarinJS/Karin'>Karin</a>",
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    lastUpdatedText: '最后编辑于',
    outlineTitle: '本页大纲',
    // 侧边栏文字更改
    sidebarMenuLabel: '目录',
    // 返回顶部文字修改
    returnToTopLabel: '返回顶部',
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


const customElements = [
  'mjx-container',
  'mjx-assistive-mml',
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml',
]
