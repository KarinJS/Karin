import { cron } from './create/cron'
import { defineConfig } from './defineConfig'

export default defineConfig({
  info: {
    id: 'demo',
    name: 'demo',
    author: {
      name: 'shijin',
      avatar: 'https://github.com/sj817.png',
    },
    description: 'demo',
  },
  components: () => {
    return [
      cron.create('cron', {
        defaultValue: '* * * * * *',
      }),
    ]
  },
  save: (_: Record<string, any>) => {
    return {
      success: true,
      message: '保存成功',
    }
  },
})
