import path from 'node:path'
import { hmr } from '@karinjs/core'

hmr('.', async (value) => {
  if (value.event === 'change') {
    /** 对于包含定时器的模块 需要手动清理 */
    if (value.ctx.fileUrl.endsWith('timer.mjs')) {
      const { cleanup } = await import(`${value.ctx.fileUrl}`) // 不要使用 query 参数
      cleanup()
    }

    value.ctx.reload() // 一键重载
  }
}, {
  pluginName: 'karin-plugin-test', // 插件名称 必须提供
  exclude: [import.meta.url], // 排除当前文件
  cwd: import.meta.dirname, // 当前插件目录
  ignored: (file, stats) => {
    const ext = path.extname(file)
    const exts = ['.mjs', '.js', '.ts']
    return stats?.isFile() && !exts.includes(ext) // 仅监听mjs、js、ts文件变化
  },
})
