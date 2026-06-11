/**
 * 直接启动 此文件不暴露给外部
 * 通过变量来防止打包器解析模块
 */
let isStart = false;

(async () => {
  if (isStart) return
  isStart = true
  const entry = import.meta.url.includes('.ts') ? '../index.ts' : '../index.mjs'
  const index = new URL(entry, import.meta.url).href
  const { start } = await import(index)
  start()
})()
