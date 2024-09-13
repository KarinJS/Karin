export const Footer_Data: FooterData = {
  // beian: { icp: '备案号', police: '公网安备号' },
  author: { name: 'KarinJS', link: 'https://github.com/KarinJS', time: '2024' },
  group: [
    {
      title: '解决方案',
      icon: 'fa-solid fa-lightbulb',
      links: [
        { name: '外置渲染器', href: 'https://github.com/KarinJS/karin-puppeteer' },
        { name: 'Karin 渲染器核心', href: 'https://github.com/KarinJS/puppeteer-core' },
        { name: '一站式 Karin 服务支持', href: 'https://github.com/KarinJS/karin-support' },
        { name: 'Markdown 转 HTML', href: 'https://github.com/KarinJS/md-html' },
      ]
    },
    {
      title: '适配器',
      icon: 'fa-solid fa-puzzle-piece',
      links: [
        { name: 'ICQQ 适配器', href: 'https://github.com/KarinJS/karin-plugin-adapter-icqq' },
        { name: 'QQBot 适配器', href: 'https://www.npmjs.com/package/axios' },
      ]
    },
    {
      title: '其他',
      icon: 'fa-solid fa-expand',
      links: [
        { name: 'JavaScript 插件开发模板', href: 'https://github.com/KarinJS/karin-plugin-template' },
        { name: 'TypeScript 插件开发模板', href: 'https://github.com/KarinJS/karin-plugin-template-ts' },
      ]
    }
  ]
}

/**
 * Footer 的数据对象。
 */
interface FooterData {
  /**
   * 各个 section 的数据。
   */
  group: Array<{
    /**
     * Section 的标题。
     */
    title: string

    /**
     * 图标的类名（Font Awesome 图标类名）。
     */
    icon?: string

    /**
     * 该 section 下的链接。
     */
    links: Array<{
      /**
       * 链接文本。
       */
      name: string

      /**
       * 链接的图标类名（Font Awesome 图标类名）。
       */
      icon?: string

      /**
       * 链接地址。
       */
      href: string

      /**
       * 链接是否为内部链接。
       */
      internal?: boolean
    }>
  }>

  /**
   * 备案信息。
   */
  beian?: {
    /**
     * ICP 备案号。
     */
    icp?: string

    /**
     * 公安备案号。
     */
    police?: string
  }

  /**
   * 作者信息。
   */
  author?: {
    /**
     * 作者名称。
     */
    name?: string

    /**
     * 版权年份。
     */
    time?: string

    /**
     * 作者的链接。
     */
    link?: string
  }
}