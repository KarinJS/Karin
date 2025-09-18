import { Plugin } from '@karinjs/core'

export class KarinPluginTest extends Plugin {
  constructor () {
    super({
      name: 'karin-plugin-test',
      version: '0.0.1',
      description: 'A test plugin for karinjs',
      rule: [
        {
          reg: /^test$/,
          fnc: async (ctx) => {
            ctx.reply('CLASS111')
          },
        },
      ],
    })
  }
}
