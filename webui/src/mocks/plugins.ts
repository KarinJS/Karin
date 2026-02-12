import type { Plugin } from '../types/plugin'

export const mockPlugins: Plugin[] = [
  {
    id: 'karin-plugin-example',
    name: 'karin-plugin-example',
    description: '一个简单的 Karin 插件示例，展示了基础功能。',
    type: 'npm',
    version: '1.0.0',
    authors: [
      { name: 'KarinJS', url: 'https://github.com/KarinJS', avatar: 'https://github.com/KarinJS.png' }
    ],
    tags: ['example', 'demo'],
    license: 'MIT',
    homepage: 'https://github.com/KarinJS/karin-plugin-example',
    repo: 'https://github.com/KarinJS/karin-plugin-example',
    updateTime: '2023-10-01',
    installed: true
  },
  {
    id: 'karin-plugin-music',
    name: 'karin-plugin-music',
    description: '点歌插件，支持多种音源，网易云、QQ音乐等。',
    type: 'npm',
    version: '2.1.3',
    authors: [
      { name: 'DeveloperA', url: 'https://github.com/DeveloperA' }
    ],
    tags: ['music', 'entertainment'],
    license: 'GPL-3.0',
    homepage: 'https://github.com/example/music',
    installed: false
  },
  {
    id: 'custom-script-weather',
    name: 'Weather Script',
    description: '通过直链安装的天气脚本，实时查询天气信息。',
    type: 'custom',
    version: '1.0.0',
    authors: [
      { name: 'ScriptMaster' }
    ],
    tags: ['tool', 'weather'],
    repo: 'https://example.com/scripts/weather.js',
    installed: true
  },
  {
    id: 'karin-plugin-admin',
    name: 'karin-plugin-admin',
    description: '强大的管理插件，提供群管、踢人、禁言等功能。',
    type: 'npm',
    version: '0.5.0',
    authors: [
      { name: 'AdminGroup', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' }
    ],
    tags: ['admin', 'management'],
    license: 'MIT',
    installed: false
  },
  {
    id: 'karin-plugin-image',
    name: 'karin-plugin-image',
    description: '随机图片插件，二次元、风景等多种分类。',
    type: 'npm',
    version: '1.2.0',
    authors: [
      { name: 'ImgLover' }
    ],
    tags: ['image', 'random'],
    installed: false
  },
  {
    id: 'direct-link-game',
    name: 'Mini Game Collection',
    description: '包含猜数字、成语接龙等小游戏的脚本集合。',
    type: 'custom',
    version: '3.0.1',
    authors: [
      { name: 'GameDev' }
    ],
    tags: ['game', 'fun'],
    installed: true
  }
]
