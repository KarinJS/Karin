import { karin } from 'node-karin'

export const test = karin.command(/test/, (e, next) => {
  e.reply('test2')
  next()
}, { name: '测试插件' })

export const test2 = karin.command(/test2/, (e, next) => {
  e.reply('test3')
  next()
}, { name: '测试插件2' })

export const test3 = karin.command(/test3/, (e, next) => {
  e.reply('test4')
  next()
}, { name: '测试插件3' })

export const test4 = karin.command(/test4/, (e, next) => {
  e.reply('test5')
  next()
}, { name: '测试插件4' })

export const test5 = karin.command(/test5/, (e, next) => {
  e.reply('test6')
  next()
}, { name: '测试插件5' })
