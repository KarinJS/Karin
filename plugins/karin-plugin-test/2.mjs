import { hmr } from '@karinjs/core'

hmr('.', (value) => {
  if (value.event === 'change') {
    // 对于监听器或者定时器等，可以手动导入这个文件 先进行清理再进行重载
    value.ctx.reload()
  }
}, {
  pluginName: 'karin-plugin-test',
  exclude: [import.meta.url],
  cwd: import.meta.dirname,
  ignored: (file) => file.endsWith('2.mjs'),
})
