import { defineConfig } from 'vitepress'
import nav from './theme/script/nav'
import sidebar from './theme/script/sidebar'
import search from './theme/script/search'
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
// 缩略图模糊哈希生成
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite'
// 代码块内的代码类型提示
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
// 代码组图标
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

export default defineConfig({
  lang: 'zh-CN',
  base: '/',
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
      // 代码组图标
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash()
    ]
  },
  vite: {
    plugins: [
      ThumbnailHashImages(),
      GitChangelog({
        maxGitLogCount: 2000,
        // 要获取git日志的仓库
        repoURL: () => 'https://github.com/KarinJS/Karin',
      }),
      GitChangelogMarkdownSection({
        exclude: (id) => id.endsWith('index.md'),
        sections: {
          // 禁用页面历史
          disableChangelog: false,
          // 禁用贡献者
          disableContributors: true,
        },
      }) as any,
      // 页面属性
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: [
          'index.md',
        ],
      }),
      // 代码组图标
      groupIconVitePlugin({
        customIcon: {
          ts: 'logos:typescript',
          js: 'logos:javascript', //js图标
          md: 'logos:markdown', //markdown图标
          css: 'logos:css-3', //css图标
          cnpm: localIconLoader(import.meta.url, '../public/cnpm.png'),
        },
      })
    ],
    ssr: {
      noExternal: [
        '@nolebase/*',
      ],
    },
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
    nav: nav as [],
    sidebar: sidebar,
    search: search as any,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KarinJS/Karin' },
      {
        icon: {
          svg: '<svg t="1718335878865" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1729" width="200" height="200"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.296 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84h-240.224a25.28 25.28 0 0 1-25.28-25.28v-240.192a75.84 75.84 0 0 1 75.84-75.84h353.92a25.28 25.28 0 0 0 25.28-25.28l0.064-63.2a25.312 25.312 0 0 0-25.28-25.312H417.184a189.632 189.632 0 0 0-189.632 189.6v353.952c0 13.952 11.328 25.28 25.28 25.28h372.928a170.656 170.656 0 0 0 170.656-170.656v-145.376a25.28 25.28 0 0 0-25.28-25.28z" p-id="1730"></path></svg>',
        },
        link: 'https://gitee.com/KarinJS/Karin',
      },
      { icon: 'npm', link: 'https://www.npmjs.com/package/node-karin' }
    ],
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
