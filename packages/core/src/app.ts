(async () => {
  /** 直接import会被打包器处理... */
  const dir = './index.mjs'
  const { start } = await import(dir)
  await start()
})()
