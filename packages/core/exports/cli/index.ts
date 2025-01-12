#!/usr/bin/env node

import { pm2 } from './pm2'
import { init } from './init'
import { start } from './start'
import { updateAll } from './up'
import { program } from 'commander'

program.version(process.env.npm_package_version!, '-v, --version', '显示版本号')
program.command('.').description('前台启动').action(start)
program.command('start').description('前台启动').action(start)
program.command('pm2').description('后台运行').action(pm2.start)
program.command('stop').description('停止后台运行').action(pm2.stop)
program.command('rs').description('重启pm2服务').action(pm2.restart)
program.command('log').description('查看日志').action(pm2.log)
program.command('up').description('更新插件').action(updateAll)
program.command('init').description('初始化项目').action(init)

program.parse(process.argv)
