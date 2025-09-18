import { hmr } from '@karinjs/core'

hmr('.', (value) => {
  if (value.event === 'change') {
    value.ctx.reload()
  }
}, {
  pluginName: 'karin-plugin-test',
  exclude: [import.meta.url],
  cwd: import.meta.dirname,
  ignored: (file) => file.endsWith('2.mjs'),
})
