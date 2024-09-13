const sidebar = [
  {
    text: '快速开始',
    collapsed: true,
    items: [
      { text: '目录', link: '/start/index' },
      { text: '框架', link: '/start/start' },
      { text: '渲染器', link: '/start/render' },
      {
        text: '疑难杂症', link: '/start/problems', items: [{
          text: '常见问题解答', link: '/start/faq'
        }]
      }
    ],
  },
  {
    text: '事件',
    collapsed: true,
    items: [
      { text: '目录', link: '/event/index' },
      { text: '消息事件', link: '/event/message' }
    ],
  },
  {
    text: '插件开发',
    collapsed: true,
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
    collapsed: true,
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
  },
  {
    text: 'Api',
    collapsed: true,
    items: [
      { text: '目录', link: '/api/index' },
      { text: '标准Api', link: '/api/api' },
      { text: '联系人相关', link: '/api/contact' },
      { text: '消息相关', link: '/api/message' }
    ]
  },
  { text: '更新日志', link: '/other/changelog' },
]

export default sidebar